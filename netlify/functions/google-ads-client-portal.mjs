import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { connectActivityStore, getDeviceType, getRequestIp, readClientActivity, readClientControl, readMockCampaignStatus, recordClientActivity, setMockCampaignStatus } from './_shared/client-portal-activity.mjs';
import { readServerClientConfigs } from './_shared/client-portal-registry.mjs';
import { sendOwnerCampaignNotification } from './_shared/owner-push-notifications.mjs';

const allowedRanges = new Set(['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'THIS_MONTH', 'LAST_MONTH']);
const actionAttempts = new Map();
const inFlightSnapshots = new Map();
const snapshotCacheStoreName = 'google-ads-snapshot-cache';
const campaignStateStoreName = 'google-ads-campaign-state';
const cacheMetricsStoreName = 'google-ads-cache-metrics';
const cacheMetricEventsStoreName = 'google-ads-cache-metric-events';
const cacheMetricsKey = 'counters.json';

function snapshotCacheStore() {
  return getStore(snapshotCacheStoreName);
}

function campaignStateStore() {
  return getStore(campaignStateStoreName);
}

function cacheMetricsStore() {
  return getStore(cacheMetricsStoreName);
}

function cacheMetricEventsStore() {
  return getStore(cacheMetricEventsStoreName);
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(body),
  };
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function parsePath(event) {
  const raw = event.path || '';
  const marker = '/.netlify/functions/google-ads-client-portal/';
  const index = raw.indexOf(marker);
  const route = index >= 0 ? raw.slice(index + marker.length) : '';
  const [clientSlug, token] = route.split('/').filter(Boolean);
  return { clientSlug, token };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

export async function refreshAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: requireEnv('GOOGLE_ADS_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_ADS_CLIENT_SECRET'),
      refresh_token: requireEnv('GOOGLE_ADS_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || 'Unable to refresh Google Ads access token.');
  }
  return payload.access_token;
}

export function googleAdsHeaders(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': requireEnv('GOOGLE_ADS_DEVELOPER_TOKEN'),
    'Content-Type': 'application/json',
  };

  if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) {
    headers['login-customer-id'] = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replaceAll('-', '');
  }

  return headers;
}

export async function googleAdsSearch({ accessToken, customerId, query }) {
  const response = await fetch(`https://googleads.googleapis.com/v25/customers/${customerId}/googleAds:search`, {
    method: 'POST',
    headers: googleAdsHeaders(accessToken),
    body: JSON.stringify({ query }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'Google Ads query failed.');
  return payload.results || [];
}

function snapshotCacheKey({ customerId, campaignId, range, startDate, endDate }) {
  const hash = sha256(JSON.stringify({ customerId, campaignId, range, startDate: startDate || null, endDate: endDate || null }));
  return `${customerId}-${campaignId}-${hash}.json`;
}

function campaignStateKey(customerId, campaignId) {
  return `campaign:${customerId}:${campaignId}:state.json`;
}

function snapshotCacheTtlMs() {
  const seconds = Number(process.env.GOOGLE_ADS_SNAPSHOT_CACHE_SECONDS || 300);
  return Math.max(60, Number.isFinite(seconds) ? seconds : 300) * 1000;
}

async function readCachedSnapshot(key) {
  const cached = await snapshotCacheStore().get(key, { type: 'json' });
  if (!cached?.snapshot || !cached.cachedAt) return null;
  return cached;
}

async function readCachedSnapshotError(key) {
  return snapshotCacheStore().get(`${key}.error.json`, { type: 'json' });
}

async function writeCachedSnapshotError(key, error) {
  await snapshotCacheStore().setJSON(`${key}.error.json`, {
    errorAt: new Date().toISOString(),
    message: error instanceof Error ? error.message : String(error),
  });
}

function snapshotErrorCooldownMs() {
  const seconds = Number(process.env.GOOGLE_ADS_ERROR_COOLDOWN_SECONDS || 300);
  return Math.max(60, Number.isFinite(seconds) ? seconds : 300) * 1000;
}

async function writeCachedSnapshot(key, snapshot) {
  await snapshotCacheStore().setJSON(key, {
    cachedAt: new Date().toISOString(),
    snapshot,
  });
}

export async function readCampaignState(customerId, campaignId) {
  return campaignStateStore().get(campaignStateKey(customerId, campaignId), { type: 'json' });
}

export async function writeCampaignState({ customerId, campaignId, status, source = 'SERVER_CONFIRMED' }) {
  const state = {
    status,
    source,
    lastConfirmedAt: new Date().toISOString(),
  };
  await campaignStateStore().setJSON(campaignStateKey(customerId, campaignId), state);
  return state;
}

export async function updateCachedCampaignStatus(customerId, campaignId, status) {
  await writeCampaignState({ customerId, campaignId, status, source: 'MUTATION_CONFIRMED' });
}

async function incrementCacheMetric(name, amount = 1) {
  try {
    const now = new Date().toISOString();
    const current = await cacheMetricsStore().get(cacheMetricsKey, { type: 'json' });
    const counters = current?.counters || {};
    counters[name] = Number(counters[name] || 0) + amount;
    await Promise.all([
      cacheMetricsStore().setJSON(cacheMetricsKey, {
        counters,
        updatedAt: now,
      }),
      cacheMetricEventsStore().setJSON(`${Date.now()}-${crypto.randomUUID()}.json`, {
        name,
        amount,
        occurredAt: now,
      }),
    ]);
  } catch {
    // Metrics must never affect portal behavior.
  }
}

export async function readGoogleAdsCacheMetrics() {
  const legacy = await cacheMetricsStore().get(cacheMetricsKey, { type: 'json' });
  const counters = { ...(legacy?.counters || {}) };
  const listed = await cacheMetricEventsStore().list();
  await Promise.all((listed.blobs || []).map(async (blob) => {
    const event = await cacheMetricEventsStore().get(blob.key, { type: 'json' });
    if (!event?.name) return;
    counters[event.name] = Number(counters[event.name] || 0) + Number(event.amount || 1);
  }));
  return counters;
}

function rangeTtlMs(range, isCustom) {
  if (isCustom) return 10 * 60_000;
  if (range === 'TODAY') return 3 * 60_000;
  if (range === 'LAST_7_DAYS') return 7 * 60_000;
  if (range === 'LAST_30_DAYS' || range === 'THIS_MONTH') return 10 * 60_000;
  if (range === 'LAST_MONTH') return 12 * 60 * 60_000;
  return snapshotCacheTtlMs();
}

async function fetchAndCacheCampaignSnapshot({ cacheKey, accessToken, customerId, campaignId, query, fallbackName, dateRange }) {
  await incrementCacheMetric('googleAdsReads');
  const rows = await googleAdsSearch({ accessToken, customerId, query });
  const first = rows[0] || {};
  const snapshot = {
    campaignName: first.campaign?.name || fallbackName,
    dateRange,
    metrics: {
      impressions: Number(first.metrics?.impressions ?? 0),
      clicks: Number(first.metrics?.clicks ?? 0),
      ctr: first.metrics?.ctr === undefined ? null : Number(first.metrics.ctr) * 100,
      conversions: first.metrics?.conversions === undefined ? null : Number(first.metrics.conversions),
      conversionRate: first.metrics?.conversionsFromInteractionsRate === undefined ? null : Number(first.metrics.conversionsFromInteractionsRate) * 100,
    },
    liveDataAvailable: true,
  };
  await writeCachedSnapshot(cacheKey, snapshot);
  return snapshot;
}

export async function getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange, startDate, endDate, fallbackName, bypassCache = false }) {
  await incrementCacheMetric('backendReads');
  const range = allowedRanges.has(dateRange) ? dateRange : 'LAST_7_DAYS';
  const isCustom = dateRange === 'CUSTOM_DATE' && /^\d{4}-\d{2}-\d{2}$/.test(startDate || '') && /^\d{4}-\d{2}-\d{2}$/.test(endDate || '');
  const cacheKey = snapshotCacheKey({ customerId, campaignId, range: isCustom ? 'CUSTOM_DATE' : range, startDate, endDate });
  const cached = await readCachedSnapshot(cacheKey);

  if (!bypassCache && cached && Date.now() - Date.parse(cached.cachedAt) < rangeTtlMs(range, isCustom)) {
    await incrementCacheMetric('cacheHits');
    return { ...cached.snapshot, cached: true, liveDataAvailable: true };
  }

  const cachedError = await readCachedSnapshotError(cacheKey);
  if (!bypassCache && !cached?.snapshot && cachedError?.errorAt && Date.now() - Date.parse(cachedError.errorAt) < snapshotErrorCooldownMs()) {
    await incrementCacheMetric('staleResponsesServed');
    throw new Error('Google Ads read temporarily suppressed after a recent failed read.');
  }

  const dateFilter = isCustom
    ? `segments.date BETWEEN '${startDate}' AND '${endDate}'`
    : `segments.date DURING ${range}`;
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.conversions,
      metrics.conversions_from_interactions_rate
    FROM campaign
    WHERE campaign.id = ${campaignId}
      AND ${dateFilter}
    LIMIT 1
  `;

  const refresh = async () => {
    try {
      return await fetchAndCacheCampaignSnapshot({
        cacheKey,
        accessToken,
        customerId,
        campaignId,
        query,
        fallbackName,
        dateRange: isCustom ? 'CUSTOM_DATE' : range,
      });
    } catch (error) {
      await writeCachedSnapshotError(cacheKey, error);
      throw error;
    }
  };

  if (!bypassCache && cached?.snapshot) {
    await incrementCacheMetric('staleResponsesServed');
    if (!inFlightSnapshots.has(cacheKey)) {
      const pending = refresh()
        .catch(() => null)
        .finally(() => inFlightSnapshots.delete(cacheKey));
      inFlightSnapshots.set(cacheKey, pending);
    } else {
      await incrementCacheMetric('coalescedRequests');
    }
    return { ...cached.snapshot, cached: true, stale: true, liveDataAvailable: false };
  }

  if (inFlightSnapshots.has(cacheKey)) {
    await incrementCacheMetric('coalescedRequests');
    return inFlightSnapshots.get(cacheKey);
  }

  await incrementCacheMetric('cacheMisses');
  const pending = refresh().finally(() => inFlightSnapshots.delete(cacheKey));
  inFlightSnapshots.set(cacheKey, pending);
  try {
    return await pending;
  } catch (error) {
    if (cached?.snapshot) {
      await incrementCacheMetric('staleResponsesServed');
      return { ...cached.snapshot, cached: true, stale: true, liveDataAvailable: false };
    }
    throw error;
  }
}

function verifyWriteOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const allowedOrigin = process.env.APP_URL || 'https://medialandkw.online';
  if (origin && origin.replace(/\/$/, '') !== allowedOrigin.replace(/\/$/, '')) {
    throw new Error('Request origin is not allowed.');
  }
}

function rateLimitAction(clientSlug, token) {
  const key = `${clientSlug}:${sha256(token).slice(0, 12)}`;
  const now = Date.now();
  const windowMs = 60_000;
  const maxAttempts = 6;
  const attempts = (actionAttempts.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (attempts.length >= maxAttempts) throw new Error('Too many action attempts. Please wait and try again.');
  attempts.push(now);
  actionAttempts.set(key, attempts);
}

function inferStatusFromEvents(events) {
  const latest = events.find((event) => [
    'CAMPAIGN_ENABLED',
    'CAMPAIGN_PAUSED',
    'ADMIN_CAMPAIGN_ENABLED',
    'ADMIN_CAMPAIGN_PAUSED',
    'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED',
  ].includes(event.eventType));
  if (!latest) return 'UNKNOWN';
  if (latest.eventType.includes('ENABLED')) return 'ENABLED';
  if (latest.eventType.includes('PAUSED')) return 'PAUSED';
  return 'UNKNOWN';
}

function isQuotaError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /resource has been exhausted|quota|temporarily suppressed/i.test(message);
}

async function notifyOwnerSafely(activityEvent) {
  try {
    await sendOwnerCampaignNotification(activityEvent);
  } catch (error) {
    console.warn(JSON.stringify({
      push: 'owner_notification_failed',
      eventId: activityEvent?.id || null,
      error: error instanceof Error ? error.message : String(error),
    }));
  }
}

export async function updateCampaignStatus({ accessToken, customerId, campaignId, status }) {
  await incrementCacheMetric('googleAdsMutations');
  const response = await fetch(`https://googleads.googleapis.com/v25/customers/${customerId}/campaigns:mutate`, {
    method: 'POST',
    headers: googleAdsHeaders(accessToken),
    body: JSON.stringify({
      operations: [
        {
          update: {
            resourceName: `customers/${customerId}/campaigns/${campaignId}`,
            status,
          },
          updateMask: 'status',
        },
      ],
    }),
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'Google Ads status update failed.');
  return payload;
}

async function validateClient(clientSlug, token) {
  const clientConfigs = await readServerClientConfigs();
  const config = clientConfigs[clientSlug];
  if (!config || !token) return { error: json(404, { ok: false, message: 'Invalid client portal link.', connected: false }) };

  const tokenHash = config.tokenHash || process.env[config.tokenHashEnv];
  if (!tokenHash) {
    return {
      config,
      notConfigured: true,
    };
  }

  if (!safeEqual(sha256(token), tokenHash)) {
    return { error: json(403, { ok: false, message: 'Invalid client portal token.', connected: false }) };
  }

  return { config };
}

export async function handler(event) {
  connectActivityStore(event);
  const { clientSlug, token } = parsePath(event);
  const validation = await validateClient(clientSlug, token);
  if (validation.error) return validation.error;

  const { config, notConfigured } = validation;
  if (notConfigured) {
    return json(503, {
      ok: false,
      connected: false,
      clientName: config.name,
      campaignName: config.name,
      status: 'UNKNOWN',
      metrics: { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
      lookerEmbedUrl: process.env[config.lookerEnv] || null,
      message: 'Google Ads server configuration is not complete.',
    });
  }

  try {
    if (config.mock) {
      const control = await readClientControl(clientSlug);
      const currentStatus = await readMockCampaignStatus(clientSlug);

      if (event.httpMethod === 'POST') {
        verifyWriteOrigin(event);
        rateLimitAction(clientSlug, token);
        const body = JSON.parse(event.body || '{}');
        const action = body.action;
        if (!['ENABLE', 'PAUSE'].includes(action)) return json(400, { ok: false, message: 'Invalid action.', connected: true });
        if (!control.clientControlEnabled) {
          return json(403, {
            ok: false,
            connected: true,
            clientName: config.name,
            campaignName: config.name,
            status: currentStatus,
            metrics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0, conversionRate: 0 },
            clientControlEnabled: false,
            message: 'تم تعليق التحكم بالحملة من قبل إدارة Media Land. يرجى التواصل مع الإدارة لإجراء أي تغيير.',
          });
        }
        const status = action === 'ENABLE' ? 'ENABLED' : 'PAUSED';
        await setMockCampaignStatus(clientSlug, status);
        const recorded = await recordClientActivity({
          clientSlug,
          clientName: config.name,
          campaignId: 'MOCK',
          eventType: action === 'ENABLE' ? 'CAMPAIGN_ENABLED' : 'CAMPAIGN_PAUSED',
          actor: 'CLIENT',
        });
        if (recorded.event) await notifyOwnerSafely(recorded.event);
        return json(200, {
          ok: true,
          connected: true,
          clientName: config.name,
          campaignName: config.name,
          status,
          dateRange: 'TODAY',
          metrics: { impressions: 1200, clicks: 48, ctr: 4, conversions: 6, conversionRate: 12.5 },
          clientControlEnabled: true,
        });
      }

      if (event.httpMethod !== 'GET') return json(405, { ok: false, message: 'Method not allowed.', connected: true });
      const visitRecorded = await recordClientActivity({
        clientSlug,
        clientName: config.name,
        campaignId: 'MOCK',
        eventType: 'PORTAL_VISIT',
        ipAddress: getRequestIp(event),
        deviceType: getDeviceType(event),
        actor: 'CLIENT',
      });
      if (visitRecorded.event) await notifyOwnerSafely(visitRecorded.event);
      return json(200, {
        ok: true,
        connected: true,
        clientName: config.name,
        campaignName: config.name,
        status: currentStatus,
        dateRange: event.queryStringParameters?.range || 'LAST_7_DAYS',
        metrics: { impressions: 1200, clicks: 48, ctr: 4, conversions: 6, conversionRate: 12.5 },
        clientControlEnabled: control.clientControlEnabled,
        controlUpdatedAt: control.updatedAt,
      });
    }

    const customerId = requireEnv(config.customerIdEnv).replaceAll('-', '');
    const campaignId = requireEnv(config.campaignIdEnv);
    const accessToken = await refreshAccessToken();

    if (event.httpMethod === 'POST') {
      verifyWriteOrigin(event);
      rateLimitAction(clientSlug, token);
      const body = JSON.parse(event.body || '{}');
      const action = body.action;
      if (!['ENABLE', 'PAUSE'].includes(action)) return json(400, { ok: false, message: 'Invalid action.', connected: true });
      const control = await readClientControl(clientSlug);
      if (!control.clientControlEnabled) {
        return json(403, {
          ok: false,
          connected: true,
          clientName: config.name,
          campaignName: config.name,
          status: 'UNKNOWN',
          metrics: { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
          lookerEmbedUrl: process.env[config.lookerEnv] || null,
          clientControlEnabled: false,
          message: 'تم تعليق التحكم بالحملة من قبل إدارة Media Land. يرجى التواصل مع الإدارة لإجراء أي تغيير.',
        });
      }

      const confirmedStatus = action === 'ENABLE' ? 'ENABLED' : 'PAUSED';
      let before = null;
      let after = null;

      try {
        before = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
      } catch (error) {
        console.warn(JSON.stringify({
          client: config.name,
          action,
          stage: 'before_snapshot_unavailable',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        }));
      }

      await updateCampaignStatus({ accessToken, customerId, campaignId, status: confirmedStatus });
      await updateCachedCampaignStatus(customerId, campaignId, confirmedStatus);

      try {
        after = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name, bypassCache: true });
      } catch (error) {
        console.warn(JSON.stringify({
          client: config.name,
          action,
          stage: 'after_snapshot_unavailable',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        }));
      }

      const recorded = await recordClientActivity({
        clientSlug,
        clientName: config.name,
        campaignId,
        eventType: action === 'ENABLE' ? 'CAMPAIGN_ENABLED' : 'CAMPAIGN_PAUSED',
        actor: 'CLIENT',
      });
      if (recorded.event) await notifyOwnerSafely(recorded.event);
      console.info(JSON.stringify({
        client: config.name,
        action,
        previousStatus: before?.status || 'UNKNOWN',
        newStatus: confirmedStatus,
        timestamp: new Date().toISOString(),
        success: true,
      }));

      return json(200, {
        ok: true,
        connected: true,
        clientName: config.name,
        campaignName: after?.campaignName || config.name,
        status: confirmedStatus,
        dateRange: after?.dateRange || 'TODAY',
        metrics: after?.metrics || { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
        liveDataAvailable: after ? after.liveDataAvailable !== false : false,
        lookerEmbedUrl: process.env[config.lookerEnv] || null,
        clientControlEnabled: true,
        message: after?.liveDataAvailable !== false ? undefined : 'تم تنفيذ الطلب في Google Ads. تقارير Google Ads الحية غير متاحة مؤقتاً، وتم تحديث الحالة من الأرشيف.',
      });
    }

    if (event.httpMethod !== 'GET') return json(405, { ok: false, message: 'Method not allowed.', connected: true });

      const events = await readClientActivity(clientSlug);
      const state = await readCampaignState(customerId, campaignId);
      const campaignStatus = state?.status || inferStatusFromEvents(events);
      const snapshot = await getCampaignSnapshot({
        accessToken,
        customerId,
        campaignId,
        dateRange: event.queryStringParameters?.range || 'LAST_7_DAYS',
        startDate: event.queryStringParameters?.startDate,
        endDate: event.queryStringParameters?.endDate,
        fallbackName: config.name,
      });
      const visitRecorded = await recordClientActivity({
        clientSlug,
        clientName: config.name,
        campaignId,
        eventType: 'PORTAL_VISIT',
        ipAddress: getRequestIp(event),
        deviceType: getDeviceType(event),
        actor: 'CLIENT',
      });
      if (visitRecorded.event) await notifyOwnerSafely(visitRecorded.event);
      const control = await readClientControl(clientSlug);

    return json(200, {
      ok: true,
      connected: true,
      clientName: config.name,
      campaignName: snapshot.campaignName,
      status: campaignStatus,
      dateRange: snapshot.dateRange,
      metrics: snapshot.metrics,
      liveDataAvailable: snapshot.liveDataAvailable !== false,
      lookerEmbedUrl: process.env[config.lookerEnv] || null,
      clientControlEnabled: control.clientControlEnabled,
      controlUpdatedAt: control.updatedAt,
    });
  } catch (error) {
    if (event.httpMethod === 'GET' && isQuotaError(error)) {
      const events = await readClientActivity(clientSlug);
      const control = await readClientControl(clientSlug);
      let inferredStatus = inferStatusFromEvents(events);
      try {
        const customerId = process.env[config.customerIdEnv]?.replaceAll('-', '');
        const campaignId = process.env[config.campaignIdEnv];
        const state = customerId && campaignId ? await readCampaignState(customerId, campaignId) : null;
        inferredStatus = state?.status || inferredStatus;
      } catch {
        inferredStatus = inferStatusFromEvents(events);
      }
      console.warn(JSON.stringify({
        client: config.name,
        timestamp: new Date().toISOString(),
        success: false,
        fallback: 'activity_status',
        error: error instanceof Error ? error.message : String(error),
      }));

      return json(200, {
        ok: true,
        connected: true,
        liveDataAvailable: false,
        clientName: config.name,
        campaignName: config.name,
        status: inferredStatus,
        dateRange: event.queryStringParameters?.range || 'LAST_7_DAYS',
        metrics: { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
        lookerEmbedUrl: process.env[config.lookerEnv] || null,
        clientControlEnabled: control.clientControlEnabled,
        controlUpdatedAt: control.updatedAt,
        message: 'بيانات Google Ads الحية غير متاحة مؤقتاً بسبب حد الاستخدام. تظهر آخر حالة مؤكدة من الأرشيف.',
      });
    }

    console.error(JSON.stringify({
      client: config.name,
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }));

    return json(500, {
      ok: false,
      connected: false,
      clientName: config.name,
      campaignName: config.name,
      status: 'UNKNOWN',
      metrics: { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
      lookerEmbedUrl: process.env[config.lookerEnv] || null,
      message: 'Unable to load Google Ads campaign data.',
    });
  }
}

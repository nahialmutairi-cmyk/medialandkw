import crypto from 'node:crypto';
import { connectActivityStore, getDeviceType, getRequestIp, readClientActivity, readClientControl, readMockCampaignStatus, recordClientActivity, setMockCampaignStatus } from './_shared/client-portal-activity.mjs';
import { readServerClientConfigs } from './_shared/client-portal-registry.mjs';
import { sendOwnerCampaignNotification } from './_shared/owner-push-notifications.mjs';

const allowedRanges = new Set(['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'THIS_MONTH', 'LAST_MONTH']);
const actionAttempts = new Map();

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

function adminPortalSecret() {
  return process.env.ADMIN_PORTAL_PASSWORD_SHA256 || '';
}

export function createAdminPortalToken(clientSlug, now = Date.now()) {
  const expiresAt = now + 30 * 60 * 1000;
  const signature = crypto
    .createHmac('sha256', adminPortalSecret())
    .update(`${clientSlug}:${expiresAt}`)
    .digest('hex');
  return `admin-${expiresAt}-${signature}`;
}

function verifyAdminPortalToken(clientSlug, token) {
  const match = /^admin-(\d{12,})-([a-f0-9]{64})$/i.exec(token || '');
  const secret = adminPortalSecret();
  if (!match || !secret) return false;

  const expiresAt = Number(match[1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${clientSlug}:${expiresAt}`)
    .digest('hex');
  return safeEqual(expected, match[2].toLowerCase());
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

export async function getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange, startDate, endDate, fallbackName }) {
  const range = allowedRanges.has(dateRange) ? dateRange : 'LAST_7_DAYS';
  const isCustom = dateRange === 'CUSTOM_DATE' && /^\d{4}-\d{2}-\d{2}$/.test(startDate || '') && /^\d{4}-\d{2}-\d{2}$/.test(endDate || '');
  const dateFilter = isCustom
    ? `segments.date BETWEEN '${startDate}' AND '${endDate}'`
    : `segments.date DURING ${range}`;
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
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

  const rows = await googleAdsSearch({ accessToken, customerId, query });
  const first = rows[0] || {};
  return {
    campaignName: first.campaign?.name || fallbackName,
    status: first.campaign?.status || 'UNKNOWN',
    dateRange: isCustom ? 'CUSTOM_DATE' : range,
    metrics: {
      impressions: Number(first.metrics?.impressions ?? 0),
      clicks: Number(first.metrics?.clicks ?? 0),
      ctr: first.metrics?.ctr === undefined ? null : Number(first.metrics.ctr) * 100,
      conversions: first.metrics?.conversions === undefined ? null : Number(first.metrics.conversions),
      conversionRate: first.metrics?.conversionsFromInteractionsRate === undefined ? null : Number(first.metrics.conversionsFromInteractionsRate) * 100,
    },
  };
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
  return /resource has been exhausted|quota/i.test(message);
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

  if (verifyAdminPortalToken(clientSlug, token)) {
    return { config, adminPreview: true };
  }

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

  const { config, notConfigured, adminPreview = false } = validation;
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
        if (adminPreview) {
          return json(403, {
            ok: false,
            connected: true,
            clientName: config.name,
            campaignName: config.name,
            status: currentStatus,
            metrics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0, conversionRate: 0 },
            clientControlEnabled: false,
            adminPreview: true,
            message: 'هذا رابط معاينة إداري للعرض فقط. استخدم أزرار لوحة الإدارة لتنفيذ التشغيل أو الإيقاف.',
          });
        }
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
          adminPreview,
        });
      }

      if (event.httpMethod !== 'GET') return json(405, { ok: false, message: 'Method not allowed.', connected: true });
      if (!adminPreview) {
        await recordClientActivity({
          clientSlug,
          clientName: config.name,
          campaignId: 'MOCK',
          eventType: 'PORTAL_VISIT',
          ipAddress: getRequestIp(event),
          deviceType: getDeviceType(event),
          actor: 'CLIENT',
        });
      }
      return json(200, {
        ok: true,
        connected: true,
        clientName: config.name,
        campaignName: config.name,
        status: currentStatus,
        dateRange: event.queryStringParameters?.range || 'LAST_7_DAYS',
        metrics: { impressions: 1200, clicks: 48, ctr: 4, conversions: 6, conversionRate: 12.5 },
        clientControlEnabled: adminPreview ? false : control.clientControlEnabled,
        controlUpdatedAt: control.updatedAt,
        adminPreview,
      });
    }

    const customerId = requireEnv(config.customerIdEnv).replaceAll('-', '');
    const campaignId = requireEnv(config.campaignIdEnv);
    const accessToken = await refreshAccessToken();

    if (event.httpMethod === 'POST') {
      if (adminPreview) {
        return json(403, {
          ok: false,
          connected: true,
          clientName: config.name,
          campaignName: config.name,
          status: 'UNKNOWN',
          metrics: { impressions: null, clicks: null, ctr: null, conversions: null, conversionRate: null },
          lookerEmbedUrl: process.env[config.lookerEnv] || null,
          clientControlEnabled: false,
          adminPreview: true,
          message: 'هذا رابط معاينة إداري للعرض فقط. استخدم أزرار لوحة الإدارة لتنفيذ التشغيل أو الإيقاف.',
        });
      }
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

      const before = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
      await updateCampaignStatus({ accessToken, customerId, campaignId, status: action === 'ENABLE' ? 'ENABLED' : 'PAUSED' });
      const after = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
      const confirmedStatus = action === 'ENABLE' ? 'ENABLED' : 'PAUSED';
      if (after.status !== confirmedStatus) {
        console.warn(JSON.stringify({
          client: config.name,
          action,
          previousStatus: before.status,
          newStatus: after.status,
          expectedStatus: confirmedStatus,
          timestamp: new Date().toISOString(),
          success: false,
        }));
        return json(502, {
          ok: false,
          connected: true,
          clientName: config.name,
          campaignName: after.campaignName,
          status: after.status,
          dateRange: after.dateRange,
          metrics: after.metrics,
          lookerEmbedUrl: process.env[config.lookerEnv] || null,
          clientControlEnabled: true,
          adminPreview,
          message: 'Google Ads did not confirm the requested campaign state.',
        });
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
        previousStatus: before.status,
        newStatus: after.status,
        timestamp: new Date().toISOString(),
        success: after.status === confirmedStatus,
      }));

      return json(200, {
        ok: true,
        connected: true,
        clientName: config.name,
        campaignName: after.campaignName,
        status: after.status,
        dateRange: after.dateRange,
        metrics: after.metrics,
        lookerEmbedUrl: process.env[config.lookerEnv] || null,
        clientControlEnabled: true,
        adminPreview,
      });
    }

    if (event.httpMethod !== 'GET') return json(405, { ok: false, message: 'Method not allowed.', connected: true });

      const snapshot = await getCampaignSnapshot({
        accessToken,
        customerId,
        campaignId,
        dateRange: event.queryStringParameters?.range || 'LAST_7_DAYS',
        startDate: event.queryStringParameters?.startDate,
        endDate: event.queryStringParameters?.endDate,
        fallbackName: config.name,
      });
      if (!adminPreview) {
        await recordClientActivity({
          clientSlug,
          clientName: config.name,
          campaignId,
          eventType: 'PORTAL_VISIT',
          ipAddress: getRequestIp(event),
          deviceType: getDeviceType(event),
          actor: 'CLIENT',
        });
      }
      const control = await readClientControl(clientSlug);

    return json(200, {
      ok: true,
      connected: true,
      clientName: config.name,
      campaignName: snapshot.campaignName,
      status: snapshot.status,
      dateRange: snapshot.dateRange,
      metrics: snapshot.metrics,
      lookerEmbedUrl: process.env[config.lookerEnv] || null,
      clientControlEnabled: adminPreview ? false : control.clientControlEnabled,
      controlUpdatedAt: control.updatedAt,
      adminPreview,
    });
  } catch (error) {
    if (event.httpMethod === 'GET' && isQuotaError(error)) {
      const events = await readClientActivity(clientSlug);
      const control = await readClientControl(clientSlug);
      const inferredStatus = inferStatusFromEvents(events);
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
        clientControlEnabled: adminPreview ? false : control.clientControlEnabled,
        controlUpdatedAt: control.updatedAt,
        adminPreview,
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

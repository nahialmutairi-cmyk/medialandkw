import crypto from 'node:crypto';
import { connectActivityStore, recordClientActivity } from './_shared/client-portal-activity.mjs';

const allowedRanges = new Set(['TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'THIS_MONTH', 'LAST_MONTH']);
const actionAttempts = new Map();

export const clientConfigs = {
  'ghaseel-fahad-adel': {
    name: 'غسيل فهد عادل',
    clientKey: 'fahad-car-wash',
    customerIdEnv: 'GOOGLE_ADS_FAHAD_CUSTOMER_ID',
    campaignIdEnv: 'GOOGLE_ADS_FAHAD_CAMPAIGN_ID',
    tokenHashEnv: 'GOOGLE_ADS_FAHAD_PORTAL_TOKEN_SHA256',
    lookerEnv: 'LOOKER_STUDIO_FAHAD_EMBED_URL',
  },
  'lawyer-aisha-alawadhi': {
    name: 'المحامية عايشة العوضي',
    clientKey: 'lawyer-aisha-alawadhi',
    customerIdEnv: 'GOOGLE_ADS_AISHA_CUSTOMER_ID',
    campaignIdEnv: 'GOOGLE_ADS_AISHA_CAMPAIGN_ID',
    tokenHashEnv: 'GOOGLE_ADS_AISHA_PORTAL_TOKEN_SHA256',
    lookerEnv: 'LOOKER_STUDIO_AISHA_EMBED_URL',
  },
};

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

function googleAdsHeaders(accessToken) {
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

async function googleAdsSearch({ accessToken, customerId, query }) {
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

async function updateCampaignStatus({ accessToken, customerId, campaignId, status }) {
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

function validateClient(clientSlug, token) {
  const config = clientConfigs[clientSlug];
  if (!config || !token) return { error: json(404, { ok: false, message: 'Invalid client portal link.', connected: false }) };

  const tokenHash = process.env[config.tokenHashEnv];
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
  const validation = validateClient(clientSlug, token);
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
    const customerId = requireEnv(config.customerIdEnv).replaceAll('-', '');
    const campaignId = requireEnv(config.campaignIdEnv);
    const accessToken = await refreshAccessToken();

    if (event.httpMethod === 'POST') {
      verifyWriteOrigin(event);
      rateLimitAction(clientSlug, token);
      const body = JSON.parse(event.body || '{}');
      const action = body.action;
      if (!['ENABLE', 'PAUSE'].includes(action)) return json(400, { ok: false, message: 'Invalid action.', connected: true });

      const before = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
      await updateCampaignStatus({ accessToken, customerId, campaignId, status: action === 'ENABLE' ? 'ENABLED' : 'PAUSED' });
      const after = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
      const confirmedStatus = action === 'ENABLE' ? 'ENABLED' : 'PAUSED';
      if (after.status === confirmedStatus) {
        await recordClientActivity({
          clientSlug,
          clientName: config.name,
          campaignId,
          eventType: action === 'ENABLE' ? 'CAMPAIGN_ENABLED' : 'CAMPAIGN_PAUSED',
        });
      }
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
      await recordClientActivity({ clientSlug, clientName: config.name, campaignId, eventType: 'PORTAL_VISIT' });

    return json(200, {
      ok: true,
      connected: true,
      clientName: config.name,
      campaignName: snapshot.campaignName,
      status: snapshot.status,
      dateRange: snapshot.dateRange,
      metrics: snapshot.metrics,
      lookerEmbedUrl: process.env[config.lookerEnv] || null,
    });
  } catch (error) {
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

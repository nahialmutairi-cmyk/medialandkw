import { activityEventTypes, connectActivityStore, isAdminAuthorized, readAllActivity } from './_shared/client-portal-activity.mjs';
import { clientConfigs, getCampaignSnapshot, refreshAccessToken } from './google-ads-client-portal.mjs';

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

function startOfKuwaitDayUtc() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kuwait',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return Date.parse(`${year}-${month}-${day}T00:00:00+03:00`);
}

async function safeSnapshot(config, accessToken) {
  try {
    const customerId = process.env[config.customerIdEnv]?.replaceAll('-', '');
    const campaignId = process.env[config.campaignIdEnv];
    if (!customerId || !campaignId || !accessToken) return { status: 'UNKNOWN', campaignName: config.name, connected: false };
    const snapshot = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
    return { status: snapshot.status, campaignName: snapshot.campaignName, connected: true };
  } catch {
    return { status: 'UNKNOWN', campaignName: config.name, connected: false };
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { ok: false, message: 'Method not allowed.' });
  if (!isAdminAuthorized(event)) return json(401, { ok: false, message: 'Unauthorized.' });
  connectActivityStore(event);

  const activities = await readAllActivity(clientConfigs);
  let accessToken = null;
  try {
    accessToken = await refreshAccessToken();
  } catch {
    accessToken = null;
  }

  const todayStart = startOfKuwaitDayUtc();
  const clients = await Promise.all(activities.map(async ({ clientSlug, config, events }) => {
    const snapshot = await safeSnapshot(config, accessToken);
    const latestVisit = events.find((item) => item.eventType === 'PORTAL_VISIT') || null;
    const latestAction = events.find((item) => item.eventType === 'CAMPAIGN_ENABLED' || item.eventType === 'CAMPAIGN_PAUSED') || null;
    const tokenConfigured = Boolean(process.env[config.tokenHashEnv]);

    return {
      clientSlug,
      name: config.name,
      campaignName: snapshot.campaignName,
      campaignStatus: snapshot.status,
      connected: snapshot.connected,
      portalPath: tokenConfigured ? `/portal/${clientSlug}/` : null,
      latestVisitAt: latestVisit?.occurredAt || null,
      latestActionType: latestAction?.eventType || null,
      latestActionAt: latestAction?.occurredAt || null,
      latestActivityAt: events[0]?.occurredAt || null,
      events,
    };
  }));

  const allEvents = clients.flatMap((client) => client.events);
  const todayEvents = allEvents.filter((item) => Date.parse(item.occurredAt) >= todayStart);

  return json(200, {
    ok: true,
    eventTypes: activityEventTypes,
    summary: {
      clients: clients.length,
      visitsToday: todayEvents.filter((item) => item.eventType === 'PORTAL_VISIT').length,
      enabledToday: todayEvents.filter((item) => item.eventType === 'CAMPAIGN_ENABLED').length,
      pausedToday: todayEvents.filter((item) => item.eventType === 'CAMPAIGN_PAUSED').length,
    },
    clients: clients.sort((left, right) => {
      const a = left.latestActivityAt ? Date.parse(left.latestActivityAt) : 0;
      const b = right.latestActivityAt ? Date.parse(right.latestActivityAt) : 0;
      return b - a || left.name.localeCompare(right.name, 'ar');
    }),
  });
}

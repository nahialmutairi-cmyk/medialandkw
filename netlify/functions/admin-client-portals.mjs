import {
  activityEventTypes,
  connectActivityStore,
  isAdminAuthorized,
  readAllActivity,
  readClientControl,
  recordClientActivity,
  setClientControl,
} from './_shared/client-portal-activity.mjs';
import { clientConfigs, getCampaignSnapshot, refreshAccessToken, updateCampaignStatus } from './google-ads-client-portal.mjs';

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

function adminEventType(action) {
  if (action === 'ENABLE') return 'ADMIN_CAMPAIGN_ENABLED';
  if (action === 'PAUSE') return 'ADMIN_CAMPAIGN_PAUSED';
  if (action === 'LOCK') return 'ADMIN_CLIENT_CONTROL_LOCKED';
  if (action === 'UNLOCK') return 'ADMIN_CLIENT_CONTROL_UNLOCKED';
  if (action === 'PAUSE_AND_LOCK') return 'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED';
  return null;
}

async function handleAdminAction(event) {
  const body = JSON.parse(event.body || '{}');
  const action = body.action;
  const clientSlug = body.clientSlug;
  const config = clientConfigs[clientSlug];
  const eventType = adminEventType(action);
  if (!config || !eventType) return json(400, { ok: false, message: 'Invalid admin action.' });

  const customerId = process.env[config.customerIdEnv]?.replaceAll('-', '');
  const campaignId = process.env[config.campaignIdEnv];
  if (!customerId || !campaignId) return json(503, { ok: false, message: 'Google Ads campaign is not configured.' });

  const accessToken = await refreshAccessToken();
  if (action === 'ENABLE') {
    await updateCampaignStatus({ accessToken, customerId, campaignId, status: 'ENABLED' });
  }
  if (action === 'PAUSE' || action === 'PAUSE_AND_LOCK') {
    await updateCampaignStatus({ accessToken, customerId, campaignId, status: 'PAUSED' });
  }
  if (action === 'LOCK' || action === 'PAUSE_AND_LOCK') {
    await setClientControl(clientSlug, false);
  }
  if (action === 'UNLOCK') {
    await setClientControl(clientSlug, true);
  }

  const snapshot = await getCampaignSnapshot({ accessToken, customerId, campaignId, dateRange: 'TODAY', fallbackName: config.name });
  const control = await readClientControl(clientSlug);
  await recordClientActivity({
    clientSlug,
    clientName: config.name,
    campaignId,
    eventType,
    actor: 'ADMIN',
  });

  return json(200, {
    ok: true,
    clientSlug,
    campaignStatus: snapshot.status,
    campaignName: snapshot.campaignName,
    clientControlEnabled: control.clientControlEnabled,
    controlUpdatedAt: control.updatedAt,
  });
}

export async function handler(event) {
  if (!['GET', 'POST'].includes(event.httpMethod)) return json(405, { ok: false, message: 'Method not allowed.' });
  if (!isAdminAuthorized(event)) return json(401, { ok: false, message: 'Unauthorized.' });
  connectActivityStore(event);

  if (event.httpMethod === 'POST') {
    try {
      return await handleAdminAction(event);
    } catch (error) {
      return json(500, { ok: false, message: error instanceof Error ? error.message : 'Admin action failed.' });
    }
  }

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
    const latestAction = events.find((item) => item.eventType !== 'PORTAL_VISIT') || null;
    const tokenConfigured = Boolean(process.env[config.tokenHashEnv]);
    const control = await readClientControl(clientSlug);

    return {
      clientSlug,
      slug: clientSlug,
      name: config.name,
      clientKey: config.clientKey,
      campaignName: snapshot.campaignName,
      campaignStatus: snapshot.status,
      campaignEnabled: snapshot.status === 'ENABLED',
      connected: snapshot.connected,
      portalPath: tokenConfigured ? `/portal/${clientSlug}/` : null,
      clientPagePath: config.clientKey ? `/clients/${config.clientKey}/` : null,
      clientControlEnabled: control.clientControlEnabled,
      controlUpdatedAt: control.updatedAt,
      latestVisitAt: latestVisit?.occurredAt || null,
      lastVisit: latestVisit?.occurredAtKuwait || null,
      latestActionType: latestAction?.eventType || null,
      latestActionAt: latestAction?.occurredAt || null,
      latestActor: latestAction?.actor || null,
      lastAction: latestAction?.eventType || null,
      lastActionAt: latestAction?.occurredAtKuwait || null,
      latestActivityAt: events[0]?.occurredAt || null,
      events,
      activity: events.map((item) => ({
        id: item.id,
        type: item.eventType,
        timestamp: item.occurredAtKuwait || item.occurredAt,
        actor: item.actor || (item.eventType.startsWith('ADMIN_') ? 'ADMIN' : 'CLIENT'),
        deviceType: item.deviceType || null,
        ipAddress: item.ipAddress || null,
      })),
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
      enabledToday: todayEvents.filter((item) => item.eventType === 'CAMPAIGN_ENABLED' || item.eventType === 'ADMIN_CAMPAIGN_ENABLED').length,
      pausedToday: todayEvents.filter((item) => item.eventType === 'CAMPAIGN_PAUSED' || item.eventType === 'ADMIN_CAMPAIGN_PAUSED' || item.eventType === 'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED').length,
      runningCampaigns: clients.filter((client) => client.campaignStatus === 'ENABLED').length,
      pausedCampaigns: clients.filter((client) => client.campaignStatus === 'PAUSED').length,
      lockedClients: clients.filter((client) => !client.clientControlEnabled).length,
      activityToday: todayEvents.length,
    },
    clients: clients.sort((left, right) => {
      const a = left.latestActivityAt ? Date.parse(left.latestActivityAt) : 0;
      const b = right.latestActivityAt ? Date.parse(right.latestActivityAt) : 0;
      return b - a || left.name.localeCompare(right.name, 'ar');
    }),
  });
}

import crypto from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';

export const activityEventTypes = [
  'PORTAL_VISIT',
  'CAMPAIGN_ENABLED',
  'CAMPAIGN_PAUSED',
  'ADMIN_CAMPAIGN_ENABLED',
  'ADMIN_CAMPAIGN_PAUSED',
  'ADMIN_CLIENT_CONTROL_LOCKED',
  'ADMIN_CLIENT_CONTROL_UNLOCKED',
  'ADMIN_CAMPAIGN_PAUSED_AND_LOCKED',
];
const maxEventsPerClient = 1000;
const visitDedupeMs = 60_000;
const clientControlStoreName = 'client-portal-control';

function store() {
  return getStore({ name: 'client-portal-activity', consistency: 'strong' });
}

function controlStore() {
  return getStore({ name: clientControlStoreName, consistency: 'strong' });
}

export function connectActivityStore(event) {
  connectLambda(event);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function isAdminAuthorized(event) {
  const configuredHash = process.env.ADMIN_PORTAL_PASSWORD_SHA256;
  const header = event.headers?.['x-admin-portal-key'] || event.headers?.['X-Admin-Portal-Key'] || '';
  if (!configuredHash || !header) return false;
  const left = Buffer.from(sha256(header));
  const right = Buffer.from(configuredHash);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function kuwaitTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuwait',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function getRequestIp(event) {
  const forwarded = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'] || '';
  const netlifyIp = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['X-Nf-Client-Connection-Ip'] || '';
  const candidate = forwarded.split(',')[0]?.trim() || netlifyIp.trim();
  return candidate || null;
}

export function getDeviceType(event) {
  const userAgent = event.headers?.['user-agent'] || event.headers?.['User-Agent'] || '';
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return 'Tablet';
  if (/mobi|iphone|android.*mobile|windows phone/i.test(userAgent)) return 'Mobile';
  if (userAgent) return 'Desktop';
  return 'Unknown';
}

function controlKey(clientSlug) {
  return `${clientSlug}.json`;
}

export async function readClientControl(clientSlug) {
  const payload = await controlStore().get(controlKey(clientSlug), { type: 'json', consistency: 'strong' });
  if (!payload || typeof payload.clientControlEnabled !== 'boolean') {
    return { clientControlEnabled: true, updatedAt: null };
  }
  return {
    clientControlEnabled: payload.clientControlEnabled,
    updatedAt: payload.updatedAt || null,
  };
}

export async function setClientControl(clientSlug, clientControlEnabled) {
  const payload = {
    clientControlEnabled: Boolean(clientControlEnabled),
    updatedAt: new Date().toISOString(),
  };
  await controlStore().setJSON(controlKey(clientSlug), payload);
  return payload;
}

export async function readMockCampaignStatus(clientSlug) {
  const payload = await controlStore().get(`${clientSlug}.campaign.json`, { type: 'json', consistency: 'strong' });
  return payload?.status || 'PAUSED';
}

export async function setMockCampaignStatus(clientSlug, status) {
  const payload = {
    status,
    updatedAt: new Date().toISOString(),
  };
  await controlStore().setJSON(`${clientSlug}.campaign.json`, payload);
  return payload;
}

function activityKey(clientSlug) {
  return `${clientSlug}.json`;
}

function activityEventPrefix(clientSlug) {
  return `${clientSlug}/events/`;
}

function activityEventKey(clientSlug, event) {
  return `${activityEventPrefix(clientSlug)}${event.occurredAt}-${event.id}.json`;
}

export async function readClientActivity(clientSlug) {
  const payload = await store().get(activityKey(clientSlug), { type: 'json', consistency: 'strong' });
  const legacyEvents = Array.isArray(payload) ? payload : [];
  let eventBlobs = [];

  try {
    const listed = await store().list({ prefix: activityEventPrefix(clientSlug) });
    eventBlobs = await Promise.all(
      (listed.blobs || []).map(async (blob) => store().get(blob.key, { type: 'json', consistency: 'strong' }))
    );
  } catch {
    eventBlobs = [];
  }

  const byId = new Map();
  [...legacyEvents, ...eventBlobs].forEach((event) => {
    if (event?.id) byId.set(event.id, event);
  });

  return [...byId.values()].sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt));
}

export async function recordClientActivity({ clientSlug, clientName, campaignId, eventType, ipAddress = null, deviceType = null, actor = null }) {
  if (!activityEventTypes.includes(eventType)) return { recorded: false };

  const now = new Date();
  const events = await readClientActivity(clientSlug);
  if (eventType === 'PORTAL_VISIT') {
    const lastVisit = events.find((event) => event.eventType === 'PORTAL_VISIT');
    if (lastVisit && now.getTime() - Date.parse(lastVisit.occurredAt) < visitDedupeMs) {
      return { recorded: false, deduped: true };
    }
  }

  const event = {
    id: crypto.randomUUID(),
    clientSlug,
    clientName,
    campaignId: campaignId || null,
    eventType,
    actor: actor || (eventType.startsWith('ADMIN_') ? 'ADMIN' : 'CLIENT'),
    occurredAt: now.toISOString(),
    occurredAtKuwait: kuwaitTimestamp(now),
    ipAddress: eventType === 'PORTAL_VISIT' ? ipAddress : null,
    deviceType: eventType === 'PORTAL_VISIT' ? deviceType : null,
  };

  await Promise.all([
    store().setJSON(activityEventKey(clientSlug, event), event),
    store().setJSON(activityKey(clientSlug), [event, ...events].slice(0, maxEventsPerClient)),
  ]);
  return { recorded: true, event };
}

export async function readAllActivity(clientConfigs) {
  return Promise.all(
    Object.entries(clientConfigs).map(async ([clientSlug, config]) => ({
      clientSlug,
      config,
      events: await readClientActivity(clientSlug),
    }))
  );
}

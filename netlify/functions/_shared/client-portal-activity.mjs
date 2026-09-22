import crypto from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';

export const activityEventTypes = ['PORTAL_VISIT', 'CAMPAIGN_ENABLED', 'CAMPAIGN_PAUSED'];
const maxEventsPerClient = 1000;
const visitDedupeMs = 60_000;

function store() {
  return getStore('client-portal-activity');
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
  const payload = await store().get(activityKey(clientSlug), { type: 'json' });
  const legacyEvents = Array.isArray(payload) ? payload : [];
  let eventBlobs = [];

  try {
    const listed = await store().list({ prefix: activityEventPrefix(clientSlug) });
    eventBlobs = await Promise.all(
      (listed.blobs || []).map(async (blob) => store().get(blob.key, { type: 'json' }))
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

export async function recordClientActivity({ clientSlug, clientName, campaignId, eventType, ipAddress = null, deviceType = null }) {
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

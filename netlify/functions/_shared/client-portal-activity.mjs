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

function activityKey(clientSlug) {
  return `${clientSlug}.json`;
}

export async function readClientActivity(clientSlug) {
  const payload = await store().get(activityKey(clientSlug), { type: 'json' });
  return Array.isArray(payload) ? payload : [];
}

export async function recordClientActivity({ clientSlug, clientName, campaignId, eventType }) {
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
  };

  await store().setJSON(activityKey(clientSlug), [event, ...events].slice(0, maxEventsPerClient));
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

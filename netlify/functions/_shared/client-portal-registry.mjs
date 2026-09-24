import { getStore } from '@netlify/blobs';
import { buildServerClientConfigs, clientPortalRegistry } from '../../../clientPortalRegistry.mjs';

const registryStoreName = 'client-portal-registry';
const registryKey = 'clients.json';

function store() {
  return getStore({ name: registryStoreName, consistency: 'strong' });
}

function normalizeClient(client) {
  return {
    slug: client.slug,
    name: client.name,
    campaignLabel: client.campaignLabel || client.name,
    clientKey: client.clientKey || client.slug,
    status: client.status || 'ACTIVE',
    customerIdEnv: client.customerIdEnv || null,
    campaignIdEnv: client.campaignIdEnv || null,
    tokenHashEnv: client.tokenHashEnv || null,
    tokenHash: client.tokenHash || null,
    lookerEnv: client.lookerEnv || null,
    mock: Boolean(client.mock),
  };
}

export async function readDynamicClientPortalRegistry() {
  const payload = await store().get(registryKey, { type: 'json', consistency: 'strong' });
  return Array.isArray(payload) ? payload.map(normalizeClient) : [];
}

export async function readClientPortalRegistry() {
  const dynamic = await readDynamicClientPortalRegistry();
  const bySlug = new Map(clientPortalRegistry.map((client) => [client.slug, normalizeClient(client)]));
  dynamic.forEach((client) => bySlug.set(client.slug, client));
  return [...bySlug.values()].filter((client) => client.status !== 'DISABLED');
}

export async function readServerClientConfigs() {
  return buildServerClientConfigs(await readClientPortalRegistry());
}

export async function upsertDynamicClientPortal(client) {
  const normalized = normalizeClient(client);
  const current = await readDynamicClientPortalRegistry();
  const next = current.filter((item) => item.slug !== normalized.slug);
  next.push(normalized);
  await store().setJSON(registryKey, next);
  return normalized;
}

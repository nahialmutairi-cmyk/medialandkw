import { activityEventTypes, getDeviceType, getRequestIp, kuwaitTimestamp } from '../netlify/functions/_shared/client-portal-activity.mjs';
import { activeClientPortals, buildServerClientConfigs, clientPortalRegistry } from '../clientPortalRegistry.mjs';

const requiredEvents = ['PORTAL_VISIT', 'CAMPAIGN_ENABLED', 'CAMPAIGN_PAUSED'];
const errors = [];

for (const eventType of requiredEvents) {
  if (!activityEventTypes.includes(eventType)) errors.push(`Missing activity event type: ${eventType}`);
}

const active = activeClientPortals();
const configs = buildServerClientConfigs();

for (const client of active) {
  if (!configs[client.slug]) errors.push(`Active client missing from server configs: ${client.slug}`);
  for (const field of ['customerIdEnv', 'campaignIdEnv', 'tokenHashEnv']) {
    if (!client[field]) errors.push(`${client.slug} missing ${field}`);
  }
}

const testRegistry = [
  ...clientPortalRegistry,
  {
    slug: 'test-client-auto-registration',
    name: 'Test Client Auto Registration',
    campaignLabel: 'Test Campaign',
    clientKey: 'test-client-auto-registration',
    status: 'ACTIVE',
    customerIdEnv: 'TEST_CLIENT_CUSTOMER_ID',
    campaignIdEnv: 'TEST_CLIENT_CAMPAIGN_ID',
    tokenHashEnv: 'TEST_CLIENT_PORTAL_TOKEN_SHA256',
    portalUrlEnv: 'TEST_CLIENT_PORTAL_URL',
    lookerEnv: 'TEST_CLIENT_LOOKER_URL',
  },
];

const testConfigs = buildServerClientConfigs(testRegistry);
if (!testConfigs['test-client-auto-registration']) {
  errors.push('Test client did not auto-register into server configs.');
}
if (testConfigs['test-client-auto-registration']?.clientKey !== 'test-client-auto-registration') {
  errors.push('Test client did not retain its client page key in server configs.');
}
if (testConfigs['test-client-auto-registration']?.portalUrlEnv !== 'TEST_CLIENT_PORTAL_URL') {
  errors.push('Test client did not retain its portal URL environment key in server configs.');
}

const dynamicHashClient = buildServerClientConfigs([
  {
    slug: 'test-dynamic-token-client',
    name: 'Test Dynamic Token Client',
    campaignLabel: 'Test Dynamic Token Campaign',
    clientKey: 'test-dynamic-token-client',
    status: 'ACTIVE',
    tokenHash: '0'.repeat(64),
    portalUrl: 'https://medialandkw.online/portal/test-dynamic-token-client/example-token/',
    mock: true,
  },
]);
if (!dynamicHashClient['test-dynamic-token-client']?.tokenHash) {
  errors.push('Dynamic token-hash client did not retain tokenHash in server configs.');
}
if (!dynamicHashClient['test-dynamic-token-client']?.portalUrl?.includes('/portal/test-dynamic-token-client/')) {
  errors.push('Dynamic token-hash client did not retain its real portal URL in server configs.');
}

const timestamp = kuwaitTimestamp(new Date('2026-09-20T16:32:47.000Z'));
if (!timestamp.includes('19:32:47')) {
  errors.push(`Kuwait timestamp does not include expected seconds/time: ${timestamp}`);
}

const testEvent = {
  headers: {
    'x-forwarded-for': '203.0.113.10, 10.0.0.1',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148',
  },
};
if (getRequestIp(testEvent) !== '203.0.113.10') {
  errors.push('Visit IP extraction failed.');
}
if (getDeviceType(testEvent) !== 'Mobile') {
  errors.push('Visit device type detection failed.');
}

if (errors.length) {
  console.error(`Client portal registry audit failed with ${errors.length} issue(s):`);
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Client portal registry audit passed.');

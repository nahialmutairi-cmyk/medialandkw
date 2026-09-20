import { activityEventTypes, kuwaitTimestamp } from '../netlify/functions/_shared/client-portal-activity.mjs';
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
    lookerEnv: 'TEST_CLIENT_LOOKER_URL',
  },
];

const testConfigs = buildServerClientConfigs(testRegistry);
if (!testConfigs['test-client-auto-registration']) {
  errors.push('Test client did not auto-register into server configs.');
}

const timestamp = kuwaitTimestamp(new Date('2026-09-20T16:32:47.000Z'));
if (!timestamp.includes('19:32:47')) {
  errors.push(`Kuwait timestamp does not include expected seconds/time: ${timestamp}`);
}

if (errors.length) {
  console.error(`Client portal registry audit failed with ${errors.length} issue(s):`);
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Client portal registry audit passed.');

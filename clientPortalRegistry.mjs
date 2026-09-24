export const clientPortalRegistry = [
  {
    slug: 'ghaseel-fahad-adel',
    name: 'غسيل فهد عادل',
    campaignLabel: 'غسيل فهد عادل',
    clientKey: 'fahad-car-wash',
    status: 'ACTIVE',
    customerIdEnv: 'GOOGLE_ADS_FAHAD_CUSTOMER_ID',
    campaignIdEnv: 'GOOGLE_ADS_FAHAD_CAMPAIGN_ID',
    tokenHashEnv: 'GOOGLE_ADS_FAHAD_PORTAL_TOKEN_SHA256',
    portalUrlEnv: 'GOOGLE_ADS_FAHAD_PORTAL_URL',
    lookerEnv: 'LOOKER_STUDIO_FAHAD_EMBED_URL',
  },
  {
    slug: 'lawyer-aisha-alawadhi',
    name: 'المحامية عايشة العوضي',
    campaignLabel: 'المحامية عايشة العوضي',
    clientKey: 'lawyer-aisha-alawadhi',
    status: 'ACTIVE',
    customerIdEnv: 'GOOGLE_ADS_AISHA_CUSTOMER_ID',
    campaignIdEnv: 'GOOGLE_ADS_AISHA_CAMPAIGN_ID',
    tokenHashEnv: 'GOOGLE_ADS_AISHA_PORTAL_TOKEN_SHA256',
    portalUrlEnv: 'GOOGLE_ADS_AISHA_PORTAL_URL',
    lookerEnv: 'LOOKER_STUDIO_AISHA_EMBED_URL',
  },
  {
    slug: 'lawyer-yousef-alabdali',
    name: 'المحامي يوسف العبدلي',
    campaignLabel: 'المحامي يوسف العبدلي',
    clientKey: 'lawyer-yousef-alabdali',
    status: 'ACTIVE',
    customerIdEnv: 'GOOGLE_ADS_YOUSEF_CUSTOMER_ID',
    campaignIdEnv: 'GOOGLE_ADS_YOUSEF_CAMPAIGN_ID',
    tokenHashEnv: 'GOOGLE_ADS_YOUSEF_PORTAL_TOKEN_SHA256',
    portalUrlEnv: 'GOOGLE_ADS_YOUSEF_PORTAL_URL',
    lookerEnv: 'LOOKER_STUDIO_YOUSEF_EMBED_URL',
  },
];

export function activeClientPortals(registry = clientPortalRegistry) {
  return registry.filter((client) => client.status !== 'DISABLED');
}

export function buildServerClientConfigs(registry = clientPortalRegistry) {
  return Object.fromEntries(
    registry.map((client) => [
      client.slug,
      {
        slug: client.slug,
        name: client.name,
        campaignLabel: client.campaignLabel,
        clientKey: client.clientKey,
        status: client.status,
        customerIdEnv: client.customerIdEnv,
        campaignIdEnv: client.campaignIdEnv,
        tokenHashEnv: client.tokenHashEnv,
        tokenHash: client.tokenHash,
        portalUrlEnv: client.portalUrlEnv,
        portalUrl: client.portalUrl,
        lookerEnv: client.lookerEnv,
        mock: Boolean(client.mock),
      },
    ])
  );
}

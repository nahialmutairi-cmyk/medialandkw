export type ClientPortalConfig = {
  slug: string;
  name: string;
  campaignLabel: string;
  apiClientKey: string;
  lookerEmbedUrl?: string;
};

export const clientPortalConfigs: ClientPortalConfig[] = [
  {
    slug: 'ghaseel-fahad-adel',
    name: 'غسيل فهد عادل',
    campaignLabel: 'غسيل فهد عادل',
    apiClientKey: 'fahad-car-wash',
  },
  {
    slug: 'lawyer-aisha-alawadhi',
    name: 'المحامية عايشة العوضي',
    campaignLabel: 'المحامية عايشة العوضي',
    apiClientKey: 'lawyer-aisha-alawadhi',
  },
];

export function getClientPortalConfig(slug?: string): ClientPortalConfig | undefined {
  return clientPortalConfigs.find((client) => client.slug === slug);
}

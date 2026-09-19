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
];

export function getClientPortalConfig(slug?: string): ClientPortalConfig | undefined {
  return clientPortalConfigs.find((client) => client.slug === slug);
}

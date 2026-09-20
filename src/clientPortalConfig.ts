import { activeClientPortals } from '../clientPortalRegistry.mjs';

export type ClientPortalConfig = {
  slug: string;
  name: string;
  campaignLabel: string;
  apiClientKey: string;
  lookerEmbedUrl?: string;
};

export const clientPortalConfigs: ClientPortalConfig[] = activeClientPortals().map((client) => ({
  slug: client.slug,
  name: client.name,
  campaignLabel: client.campaignLabel,
  apiClientKey: client.clientKey,
}));

export function getClientPortalConfig(slug?: string): ClientPortalConfig | undefined {
  return clientPortalConfigs.find((client) => client.slug === slug);
}

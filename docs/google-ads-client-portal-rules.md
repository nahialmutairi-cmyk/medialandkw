# Google Ads Client Portal Rules

This is a permanent project rule for Media Land Google Ads client portals.

Every new Google Ads Client Portal must automatically:

1. Register the client in the central Client Portal Registry: `clientPortalRegistry.mjs`.
2. Appear in the owner Admin Monitoring Portal at `/admin/client-portals/`.
3. Use the shared Client Portal template at `/portal/:clientSlug/:token`.
4. Use central `PORTAL_VISIT` logging.
5. Use central `CAMPAIGN_ENABLED` logging only after Google Ads confirms `ENABLED`.
6. Use central `CAMPAIGN_PAUSED` logging only after Google Ads confirms `PAUSED`.
7. Store timestamps server-side.
8. Display timestamps in `Asia/Kuwait` time with seconds.
9. Preserve client isolation: clients can only access their own token-bound portal.
10. Never expose the Admin Monitoring Portal, activity archive, other clients, secure token hashes, or Google Ads credentials to clients.
11. Require no separate owner/admin registration after the client is added to the registry.
12. Keep disabled clients in the registry with `status: 'DISABLED'` when history should be preserved.

When creating a future portal, add one registry entry with:

- `slug`
- `name`
- `campaignLabel`
- `clientKey`
- `status`
- `customerIdEnv`
- `campaignIdEnv`
- `tokenHashEnv`
- `lookerEnv` when available

Store real Google Ads IDs, token hashes, OAuth credentials, refresh tokens, and developer tokens only in Netlify environment variables. Do not hardcode secrets.

Do not add client portals or admin monitoring routes to sitemap, public navigation, search, or public internal links. They must remain `noindex,nofollow`.

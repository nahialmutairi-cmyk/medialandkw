# Media Land Google Ads Portals

- Keep the public Media Land site, sitemap, canonical tags, robots rules, and redirects unchanged unless the request explicitly targets them.
- Admin and client portal pages must stay unlisted from navigation, sitemap, search, and public internal links, and must keep `noindex,nofollow`.
- New Google Ads client portals must be added through the central client portal registry/API path and surfaced automatically in the Admin Monitoring Portal and Android monitor app. Do not hardcode client cards in the admin UI or Android UI.
- Client campaign controls must be enforced server-side. When `clientControlEnabled` is false, client portal enable/pause requests must be rejected even if the endpoint is called directly.
- Owner/admin actions must require `X-Admin-Portal-Key` and must log permanent events with actor `ADMIN`.
- Client portal visits and client enable/pause actions must log permanent events with actor `CLIENT`, Kuwait time, seconds, and visit IP/device data.
- Do not commit OAuth secrets, Google Ads tokens, developer tokens, client secrets, refresh tokens, signing passwords, keystores, or live portal tokens.

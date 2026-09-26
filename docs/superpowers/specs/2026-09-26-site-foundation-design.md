# CTRL ROOM site foundation

Status: approved by the user on 2026-09-26 after confirming the technology stack and Sanity content relationships. The cockpit direction is accepted for continued development; its visual design is approximately 60% resolved.

## Intent and agreed direction

Build a digital home for CTRL ROOM where editors publish events, sessions and releases without commissioning new pages. Preserve the immersive fixed-POV cockpit, overhead directory, guided section transitions, three screens, Space Mono and black/pink identity established in `prototypes/lobby-comparison/u-cockpit-ux.html`. Further visual iteration must remain possible without rebuilding the content system.

The source brief is `C:\Users\robin\Desktop\ctrl room site.md`. The existing prototypes are references, not the production application. Mobile is a first-class experience; desktop must not simply be shrunk onto a phone.

## Approaches considered

1. **Recommended: Next.js + Sanity + Three.js through React Three Fiber.** One application, an editorial content backend and a separately loaded cockpit renderer. Matches the brief and keeps publishing manageable.
2. **Next.js + Sanity + a SQL database.** Appropriate if future transactional requirements demand SQL. Adds another data store, ownership rules and synchronization work; the current publishing requirements do not establish that need.
3. **Next.js + repository-managed content initially.** Fewer external dependencies, but routine publishing would depend on development tools, conflicting with the team's intended workflow.

Confirmed by the user: connected content in Sanity satisfies the brief's relational data requirement. Use Sanity references; no separate SQL database is required. Sanity is a document store, not a SQL database.

## First implementation milestone

Deliver a reproducible local application, validated content schemas, typed content access, route structure, a persistent cockpit shell, device-appropriate content rendering and automated checks. Use clearly labelled fixtures while external services are unconfigured. Record deployment configuration and the remaining account setup steps.

This milestone does not complete final visual design, real content entry, production launch, editor preview tooling, contact submission processing, public user accounts, payments or newsletter infrastructure. Contact initially uses editorially configured outbound contact links. Video stays on YouTube.

## Application boundaries

- `src/app`: Next.js App Router layouts, public routes, metadata, loading/error states and CMS route.
- `src/features/cockpit`: scene geometry, camera transitions, ring interaction and capability handling. Receives section state and navigation callbacks; never queries Sanity directly.
- `src/features/catalogue`: browse/detail presentations and search/filter controls shared by cockpit and mobile views.
- `src/lib/content`: typed domain objects, content queries, normalization, fixtures and relationship resolution.
- `src/sanity`: schemas, client configuration and editor navigation. The CMS lives at `/cms`, avoiding confusion with the public `/studios` section.
- `tests`: domain/navigation checks and browser journeys. Existing `prototypes/` and `assets/` remain separate.

Use TypeScript, npm with a committed lockfile, local Space Mono fonts and CSS design tokens. Pin compatible package versions during implementation. The current local runtime is Node 24; document and align development and CI on the supported Node 24 release line.

## Routing and the cockpit

Canonical routes: `/`, `/invites`, `/invites/[slug]`, `/studios`, `/studios/[slug]`, `/records`, `/records/[slug]`, `/archive`, `/archive/[slug]`, `/about`, `/contact`.

URLs own section and selected content; query parameters own search and filters. Direct links, refresh and browser Back/Forward must restore the same content. Ring selection changes routes. Camera animation follows navigation and must not block it or override a newer selection.

Keep the desktop cockpit mounted across public route transitions. Use semantic HTML controls and readable content aligned with its screens, with Three.js responsible for the room and motion. The prototype's canvas text and hit regions are not the production accessibility model. Avoid duplicate focusable controls or duplicated screen-reader content.

Mobile uses the same content and routes in a dedicated terminal-inspired layout with comfortably sized controls. Reduced motion suppresses travel/glitches. WebGL failure exposes usable HTML navigation and content. Loading the room must not block access to content. Final mobile visual composition remains a subsequent design task.

## Editorial content

| Document | Core information and relationships |
| --- | --- |
| Artist | Name, stable slug, biography, image, external links |
| Event | Title, slug, event date/time with timezone, venue, location, lineup references, ticket URL, status, media |
| Session | Title, slug, session number, artist references, recording date, location, duration, YouTube ID, artwork/photos |
| Release | Title, slug, catalogue number, artist references, release date, artwork, ordered tracks, credits, listening links |
| Archive entry | Title, slug, date, category, narrative/media, references to relevant artists/events/sessions/releases |
| Site settings | Collective description, About content, contact/social links and site metadata |

References are the shared identity of an artist across the catalogue. Related work is resolved from those references. The archive combines existing events/sessions/releases with standalone archive entries; editors need not duplicate an event to make it appear there. Public artist pages are deferred, but artist records are available from the start.

Require titles, unique slugs within each type, relevant dates and required references. Validate URLs and YouTube identifiers, and require image alternative text unless explicitly decorative. Separate draft/published status from event lifecycle status. Public queries return published documents only.

## Content flow and failure behavior

Server-side content access produces plain typed data for both presentation modes. Public pages expose metadata and meaningful HTML independently of WebGL. Read tokens, if needed, remain server-side. CMS authentication uses Sanity's editor access.

Provide an explicit fixture mode for local development. Live mode requires valid configuration and must never silently substitute fictional content when a query fails. Empty collections show an honest empty state; unknown slugs return a not-found page. Query failures show a recoverable error state. Missing optional media uses a designed placeholder; broken related references are omitted safely.

Initial published-content caching uses a documented 60-second revalidation interval. Authenticated editor previews and signed publish webhooks can follow in the publishing milestone. Lazy-load YouTube embeds on playback intent; do not download or proxy source video files.

## Delivery and verification

Prepare `.env.example`, ignore local secrets/build output, and document clean installation, fixture development, live CMS configuration, build and test commands. Add GitHub Actions for clean install, lint, type checking, relevant tests and production build. Build checks must work with explicit fixtures and no account credentials.

Proposed hosting target: managed Next.js hosting with separate preview and production environments. Provider/account connection remains a deployment step; no paid plan or live launch is implied by this foundation. Use separate CMS development and production datasets when provisioning, keeping fixtures out of production.

Acceptance journeys: open a session directly; refresh it; search/filter and open a result; follow related work; use Back/Forward; rapidly switch ring sections; use keyboard navigation; repeat on mobile, reduced-motion and unavailable-WebGL configurations. Verify published-only data, empty collections, invalid slugs and service failure behavior. Confirm the cockpit chunk and YouTube player are deferred and that the idle scene does not run unnecessary continuous animation.

## Sources checked

- [Next.js server and client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Sanity Content Lake](https://www.sanity.io/docs/content-lake)
- [React Three Fiber installation and compatibility](https://r3f.docs.pmnd.rs/getting-started/installation)

These support the implementation direction; the architecture and scope above are project recommendations.

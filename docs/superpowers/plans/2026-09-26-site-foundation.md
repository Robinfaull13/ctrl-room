# CTRL ROOM Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver a locally runnable, tested site foundation with connected editorial content and the accepted cockpit direction.

**Architecture:** Next.js owns URLs and server-rendered content. A content repository supplies normalized records from explicit fixtures or Sanity; React Three Fiber renders a persistent desktop room around semantic content controls. Mobile and unavailable-WebGL views use the same routes and data.

**Tech Stack:** Next.js App Router, React, TypeScript, Sanity, Three.js, React Three Fiber, CSS, npm, Vitest, Playwright, GitHub Actions, Node 24.

**Spec:** `docs/superpowers/specs/2026-09-26-site-foundation-design.md`

**Status:** Complete on feat/site-foundation. Independent review findings fixed; 21 unit tests and 18 production browser journeys pass.

## Global Constraints

- Use Sanity references; no separate SQL database is required.
- Preserve the immersive fixed-POV cockpit, overhead directory, guided section transitions, three screens, Space Mono and black/pink identity.
- Existing `prototypes/` and `assets/` remain separate.
- Use TypeScript, npm with a committed lockfile, local Space Mono fonts and CSS design tokens.
- Pin compatible package versions during implementation; use Node 24 for development and CI.
- URLs own section and selected content; query parameters own search and filters.
- Public queries return published documents only.
- Live mode requires valid configuration and must never silently substitute fictional content when a query fails.
- Initial published-content caching uses a documented 60-second revalidation interval.
- The CMS lives at `/cms`; the public sessions section is `/studios`.
- This milestone excludes final visual design, production launch, real content entry, editor previews, contact submission processing, user accounts, payments and newsletters.

## Review Focus

1. Missing live configuration or service outage must not display fixtures as real content (Task 3).
2. Deleted related records and optional images must not break detail pages (Tasks 3 and 4).
3. Refresh, Back/Forward and rapid section changes must keep URL, content and ring selection aligned (Tasks 4 and 5).
4. WebGL failure, reduced motion and viewport changes must preserve operable, single-instance controls (Task 5).
5. Drafts and read credentials must never enter public data or browser bundles (Tasks 3 and 6).

## File and responsibility map

| Location | Responsibility |
| --- | --- |
| Root configuration, `.github/workflows/ci.yml` | Reproducible toolchain and checks |
| `src/app/(site)/` | Persistent public layout and route content |
| `src/app/cms/[[...tool]]/page.tsx` | Configured Sanity Studio or setup notice |
| `src/lib/content/` | Shared content contract and server-only providers |
| `src/lib/navigation.ts` | Canonical routes and URL query state |
| `src/sanity/` | Editorial schemas, validation and Studio structure |
| `src/features/catalogue/` | Semantic browse, detail, related-content and player controls |
| `src/features/cockpit/` | Desktop room, transitions and screen alignment |
| `src/styles/`, `public/fonts/` | Design tokens, responsive composition and fonts |
| `tests/unit/`, `tests/e2e/` | Domain rules and user journeys |
| `docs/setup.md` | Local/CMS/deployment setup and known limits |

## Task 1: Runnable application and verification harness

**Files:** Create `package.json`, `package-lock.json`, `.gitignore`, `.nvmrc`, `.env.example`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/styles/globals.css`, `src/styles/tokens.css`, `tests/e2e/smoke.spec.ts`. Copy Space Mono Regular/Bold and OFL license from the prototype into `public/fonts/`.

**Interfaces:** Produces `npm run dev`, `build`, `start`, `lint`, `typecheck`, `test:unit` and `test:e2e`. Environment contract: server-only `CONTENT_SOURCE=fixtures|sanity`, `SANITY_READ_TOKEN` optional; public CMS identifiers `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`; server `SITE_URL`. Invalid content mode fails explicitly in Task 3. CI sets fixture mode explicitly.

- [x] Inspect applicable repository instructions and create implementation isolation using the worktree skill. Preserve the untracked prototypes/assets and ensure the reference prototype and fonts remain accessible from the implementation checkout.
- [x] Resolve current stable compatible package versions using official documentation and package peer dependencies; record exact installed versions in the lockfile. Configure Node 24, TypeScript, explicit ESLint and test scripts. Do not invoke a scaffolder over existing files.
- [x] Add a smoke test asserting `page.goto('/')` returns 200, the page has a main landmark and a visible `CTRL ROOM` heading. Run `npm run test:e2e -- tests/e2e/smoke.spec.ts` and observe failure before creating the application route.
- [x] Implement the minimal root/public layouts and terminal identity using local fonts. Add ignores for secrets, dependencies, builds and test captures; retain `.env.example`. Configure Playwright to start its own fixture-mode application server.
- [x] Run the smoke test, lint, typecheck and build; all must pass. Commit only this task's files with `chore: establish runnable site foundation`.

## Task 2: Editorial schemas and domain contract

**Files:** Create `src/lib/content/types.ts`, `src/sanity/validation.ts`, `src/sanity/schemaTypes/{artist,event,session,release,archiveEntry,siteSettings,media,externalLink,index}.ts`, `src/sanity/structure.ts`, `sanity.config.ts`, `sanity.cli.ts`, `src/app/cms/[[...tool]]/page.tsx`, `src/app/cms/[[...tool]]/studio.tsx`, `tests/unit/editorial-validation.test.ts`.

**Interfaces:** Domain exports:

```ts
type ContentKind = 'event' | 'session' | 'release' | 'archiveEntry';
type Section = 'invites' | 'studios' | 'records' | 'archive' | 'about' | 'contact';
type Artist = { id: string; slug: string; name: string; biography?: string };
type Media = { url: string; alt: string; decorative: boolean; width?: number; height?: number };
type ExternalLink = { label: string; url: string };
type ContentBase = { id: string; slug: string; title: string; date: string; artists: Artist[]; media: Media[] };
type Event = ContentBase & { kind: 'event'; timezone: string; venue: string; location: string; status: 'upcoming' | 'past' | 'cancelled'; ticketUrl?: string };
type Session = ContentBase & { kind: 'session'; number: string; location: string; durationSeconds?: number; youtubeId?: string; format: 'DJ set' | 'Live' };
type Release = ContentBase & { kind: 'release'; catalogueNumber: string; tracks: { title: string; durationSeconds?: number }[]; credits?: string; links: ExternalLink[] };
type ArchiveEntry = ContentBase & { kind: 'archiveEntry'; category: string; body: string; relatedIds: string[] };
type ContentItem = Event | Session | Release | ArchiveEntry;
type SiteSettings = { title: string; description: string; about: string; contactLinks: ExternalLink[]; socialLinks: ExternalLink[] };
```

Editorial documents may use Portable Text; the initial public `body`, `biography` and `about` contract is normalized plain text. Extend both contract and renderer together when rich editorial presentation is needed.

- [x] Write validation tests: reject `javascript:` outbound URLs and malformed YouTube IDs; accept HTTPS and 11-character YouTube IDs; permit `mailto:` only for contact links; reject nondecorative images without alt text. Run `npm run test:unit -- tests/unit/editorial-validation.test.ts` and confirm failure.
- [x] Implement reusable validators consumed by actual schema fields, then the six document types and media/link objects. Use strong artist references, required dates/titles/slugs, type-scoped slug uniqueness, event timezone and lifecycle enum, ordered tracks, and archive references to the four content kinds plus artists. Artist images/links remain editable even if initial public artist pages are deferred.
- [x] Register the schema types and editor sections. Make site settings a singleton with fixed ID `siteSettings`. Mount Studio only with configured identifiers; otherwise `/cms` renders a truthful setup notice, not a broken editor.
- [x] Run validation tests and `npm run typecheck`; build the app in fixture mode without CMS credentials. Verify `/cms` setup notice via browser. Commit `feat: define connected editorial content`.

## Task 3: Typed fixtures and live content access

**Files:** Create `src/lib/content/{config,fixtures,repository,sanity-provider,queries,normalize,relationships}.ts`, `tests/unit/content-repository.test.ts`, `tests/unit/relationships.test.ts`.

**Interfaces:** `ContentQuery = { section: Section; q?: string; format?: 'DJ set' | 'Live' }`; `ContentRepository` exposes `list(query: ContentQuery): Promise<ContentItem[]>`, `get(kind: ContentKind, slug: string): Promise<ContentItem | null>`, `related(id: string): Promise<ContentItem[]>`, `settings(): Promise<SiteSettings>`. Export server-only `getContentRepository(): ContentRepository` and testable provider factories. Fixture IDs: `artist-jaide`, `session-jaide`, `session-live`, `event-001`, `release-ctrl001`, `archive-001`; session slug `jaide`. Fixture records explicitly identify sample content.

- [x] Write repository contract tests for section filtering, case-insensitive search, session format filtering, zero matches, unknown slugs returning null and aggregate archive inclusion without duplicates. Test related items exclude self, deduplicate shared artists and omit missing references. Confirm tests fail.
- [x] Implement fixtures and shared normalization/relationship logic. Live GROQ projections resolve artist references, use published perspective and exclude drafts defensively. Normalize missing optional arrays/media to safe values, while reporting malformed required content as an error.
- [x] Add live-provider tests with mocked transport: configured project/dataset are required, drafts never appear, rejected fetch remains an error, missing references do not throw, fixture IDs never appear as an outage fallback. Assert cache revalidation is 60 seconds and credentials are confined to the server-only provider.
- [x] Implement explicit configuration and the Sanity provider using server-side fetch with 60-second revalidation. Related queries use reverse/shared references and archive explicit links. Keep CMS authentication separate from public content reads.
- [x] Run `npm run test:unit` and typecheck; confirm all contract and failure tests pass. Commit `feat: add fixture and Sanity content providers`.

## Task 4: URL-driven catalogue and accessible presentations

**Files:** Create `src/lib/navigation.ts`, `src/features/catalogue/{CatalogueView,BrowseControls,ContentDetail,RelatedWork,YouTubePlayer}.tsx`; public pages under `src/app/(site)/{invites,studios,records,archive}/page.tsx` and each corresponding `[slug]/page.tsx`; `src/app/(site)/{about,contact}/page.tsx`, `src/app/(site)/{loading,error,not-found}.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`; tests `tests/unit/navigation.test.ts`, `tests/e2e/catalogue.spec.ts`. Update the public homepage/layout.

**Interfaces:** `contentHref(item: Pick<ContentItem,'kind'|'slug'>): string`; `parseBrowseQuery(params: URLSearchParams): {q: string; format?: 'DJ set' | 'Live'}`. `CatalogueView` receives `{section: Section; items: ContentItem[]; selected: ContentItem | null; related: ContentItem[]; q: string; format?: 'DJ set' | 'Live'}` and exposes three semantic regions for browse, main content and context. Query keys are `q` and `format`; unknown format values are ignored. Selecting a result carries its list query to the detail URL. Cross-section related links start with no incompatible filters; browser history restores the prior URL.

- [x] Add tests for correctly encoded slugs/query text and canonical archive result links (events link to `/invites/[slug]`, standalone entries to `/archive/[slug]`). Add a browser journey: `/studios?q=JAIDE` → JAIDE → refresh → related event → browser Back → original session and search. Confirm failures before implementing routes.
- [x] Implement server pages consuming Task 3, metadata using `SITE_URL`, semantic links/forms, useful loading/empty states, not-found handling and retryable errors. Home welcomes visitors into the cockpit and provides immediately usable section links. About/contact read settings; do not invent real contact details.
- [x] Implement browse/detail/context regions, related-content links and explicit sample badges in fixture mode. Load a YouTube iframe only after Watch is activated and only when an ID exists; absent video renders a labelled placeholder. Optional artwork has a designed empty state.
- [x] Add browser assertions for unknown slug 404, no matches and reset, keyboard access, settings content, missing media, and no YouTube iframe before playback. Verify visible page content with JavaScript disabled. Add an accessible Browse link carrying the current query instead of assuming a previous history entry exists.
- [x] Run navigation unit tests and `npm run test:e2e -- tests/e2e/catalogue.spec.ts`; all pass. Commit `feat: implement shareable catalogue routes`.

## Task 5: Persistent cockpit and device handling

**Files:** Create `src/features/cockpit/{CockpitShell,CockpitScene,DirectoryRing,ScreenSurfaces,RoomGeometry,CameraRig,CapabilityBoundary}.tsx`, `src/features/cockpit/motion.ts`, `src/styles/cockpit.css`, `tests/unit/cockpit-motion.test.ts`, `tests/e2e/cockpit.spec.ts`; update public layout and catalogue region composition.

**Interfaces:** `CockpitShell({children}: {children: React.ReactNode})` owns the persistent scene and renders routed semantic content exactly once. `CockpitScene({section,onNavigate,reducedMotion}: {section: Section; onNavigate: (section: Section) => void; reducedMotion: boolean})`; `sectionAngle(section: Section): number`; `nearestTargetAngle(current: number, section: Section): number`. Section ordering matches the six approved labels. Home uses Invites orientation without forcing a URL redirect.

- [x] Add motion tests asserting Studios = `Math.PI/3`, Records = `2*Math.PI/3`, shortest rotation across the wrap boundary and immediate completion for reduced motion. Add browser expectations for one main landmark, one search field and URL/ring agreement following rapid Invites → Records → Studios selection. Confirm failures.
- [x] Rebuild the reference room as focused React Three Fiber components: fixed POV, six-part overhead directory, three screens, keyboard and black/pink materials. Use the original prototype as visual reference. Implement interruptible 1.8-second eased transitions; new route targets supersede old motion without delayed route writes.
- [x] Align the semantic browse/main/context regions to the physical screens. Preserve text selection, input focus, scrolling, link semantics and keyboard access. Canvas geometry must not swallow HTML pointer events. Keep the scene mounted in the public layout while route content changes.
- [x] Dynamically import the scene only on eligible desktop clients (initial threshold 1024 CSS pixels), with an error boundary and WebGL creation/context-loss fallback. SSR and mobile show the terminal layout; do not load a room merely to hide it with CSS. Resizing preserves route/search and renders only one control set. Use demand rendering, invalidating during motion; disable transitions under reduced motion.
- [x] Run browser journeys at 1440×900 and 390×844, with reduced motion and WebGL disabled, plus resizing across the breakpoint. Verify unchanged URLs and usable content after simulated context loss; retain HTML while scene code loads. Assert the persistent scene is not recreated on section navigation. Inspect idle rendering and capture desktop/mobile screenshots for review.
- [x] Run motion tests and cockpit browser tests; compare desktop geometry/composition to `u-cockpit-ux.html`. Commit `feat: integrate persistent cockpit navigation`.

## Task 6: Delivery checks and setup documentation

**Files:** Create `.github/workflows/ci.yml`, `docs/setup.md`, `tests/e2e/delivery.spec.ts`; update `README.md`, `.env.example`, test configuration and the implementation progress checkboxes.

**Interfaces:** CI runs Node 24, `npm ci`, lint, typecheck, unit tests, build, and Playwright Chromium journeys with `CONTENT_SOURCE=fixtures`. No remote CMS credentials are required. Local documentation exposes the same commands.

- [x] Add delivery checks for fixture-mode build/start, meaningful server HTML, sample labelling and no pre-click YouTube request. Inspect built client artifacts with a synthetic test read-token value to confirm it is absent; never use or print a real token for this check.
- [x] Configure GitHub Actions with the browser dependencies and failure-artifact uploads. CI targets the production build for the final acceptance journey, using an explicit fixture environment.
- [x] Write setup instructions for clean install, fixture/live selection, Sanity project/dataset identifiers, editor access/CORS, optional server-only token, and separate development/production datasets. Explain the 60-second publishing cache, excluded preview workflow and CMS setup notice.
- [x] Document managed Next.js hosting requirements, environment separation, `SITE_URL`, domain connection and rollback via previous deployment. Clearly distinguish prepared repository configuration from external projects that have actually been provisioned. Do not create a paid project, publish fixtures or claim a live deployment.
- [x] Run a clean dependency install, lint, typecheck, unit tests, production build and the full browser suite. Review missing-configuration/service-failure tests and mobile/WebGL screenshots. Fix regressions within scope; record any external provisioning limitation explicitly.
- [x] Update README from brief-only status to actual installed commands and capabilities. Commit `chore: add delivery checks and setup guide`. Request final code review using the chosen execution workflow; resolve material findings and rerun affected checks before reporting completion.

## Plan self-review

The six tasks cover the spec's local foundation, schema relationships, content access, all public routes, CMS entry point, persistent cockpit, mobile/fallback behavior and delivery workflow. The five review risks above each have concrete checks in their owning tasks. External account provisioning and final visual polish remain explicitly outside this milestone. Dependency versions are resolved against compatibility at implementation time, then locked; no unverified release numbers are prescribed here.

Recommended execution: **Native**, because the content contract, routes and persistent shell form a closely connected foundation in one repository. Implement in this session, with a fresh review of the completed branch. Subagent-driven execution is also available if independent review after each task is preferred.

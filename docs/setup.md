# Setup and delivery

## Runtime and commands

Install Node 24, then run `npm ci`. Exact direct versions and dependency resolution are committed in `package.json` and `package-lock.json`. Copy `.env.example` to `.env.local`, then run `npm run dev` and open http://localhost:3000.

- `npm run dev`: local development server.
- `npm run lint`: ESLint checks.
- `npm run typecheck`: generate route types and check TypeScript.
- `npm run test:unit`: validation, repository, GROQ, URL and motion contracts.
- `npm run build` and `npm run start`: production build/server.
- `npm run test:e2e`: managed test server on port 3100, explicitly using fixtures.
- `npm run format`: format application code and tests.

Install the browser with `npx playwright install chromium`. Set `E2E_PRODUCTION=1` for the final browser journey against an existing production build. Set `PLAYWRIGHT_CHANNEL=chrome` only when using installed Chrome locally; this was needed during implementation because the managed browser download timed out. CI uses managed Chromium.

## Content modes

`CONTENT_SOURCE` must explicitly be `fixtures` or `sanity`. Missing or invalid selection is an error. Fixtures are labelled **Sample content**, contain no real contact details, and are never substituted after a live query failure. The demonstration video ID is a public sample, not a CTRL ROOM recording.

For live mode configure:

```dotenv
CONTENT_SOURCE=sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=yourprojectid
NEXT_PUBLIC_SANITY_DATASET=development
SITE_URL=https://your-domain.example
```

Use the real project and dataset identifiers. The public identifiers are safe for browser inclusion and are also needed by the embedded Studio. They are build-time variables, so rebuild after changing them. A missing/invalid Studio configuration shows a setup notice at `/cms`. Public sessions live at `/studios`.

For a private dataset, optionally set `SANITY_READ_TOKEN` with read-only access. This variable is server-only; do not add a `NEXT_PUBLIC_` prefix or put it into Studio configuration. Sanity editors authenticate using their own editor access, independently of the public content read token. Never commit `.env.local` or other secrets.

Published queries use Sanity's published perspective, exclude draft/release IDs, resolve strong artist references and omit deleted relationships. Missing optional media renders a placeholder. Malformed required content is reported as an error. Collections may be empty, unknown slugs return 404, and query failures expose Retry. Portable Text is normalized to plain text for this milestone.

Server fetches revalidate after **60 seconds**. This is stale-while-revalidate behavior: an already cached response may be served while the next request refreshes it. Publishing is not instantaneous, and a refresh failure may retain the last successful cached response; it never changes the source to fixtures. Editor previews, signed webhooks and draft access are excluded.

## Provision Sanity separately

No project or dataset was created by this implementation. In your Sanity account, create a project and separate development/production datasets, invite editors, and grant appropriate roles. Add the local origin (`http://localhost:3000`) and each deployed Studio origin to allowed CORS origins, with credentials enabled for Studio authentication. Keep public read access appropriate to your dataset policy. Open `/cms`, sign in, and create artists before referencing them in events, sessions, releases or archive entries.

Site settings is a singleton with ID `siteSettings`. Use its editor section to enter site description, About copy, contact links and social links. Links require HTTPS; only contact links permit `mailto:`. Images require alt text unless decorative. Event lifecycle status is separate from Sanity draft/published state. Do not import fixture records into production.

## Production verification and credentials

CI uses Node 24, a clean install, lint, typechecking, unit tests, a fixture-mode production build and the full Chromium suite. Browser captures and traces are uploaded as artifacts. No remote CMS credentials are required.

The client artifact check uses a deliberately synthetic value, never a real credential. PowerShell:

```powershell
$env:CONTENT_SOURCE='fixtures'
$env:SANITY_READ_TOKEN='ctrl-room-synthetic-build-token-not-a-credential'
npm run build
npm run check:secrets
$env:E2E_PRODUCTION='1'
npm run test:e2e
Remove-Item Env:SANITY_READ_TOKEN
```

The script scans `.next/static`, not server artifacts. `server-only` imports additionally prevent the content provider from being imported into browser components.

## Hosting preparation

Use a managed Next.js host supporting Node 24, App Router server rendering and the Next.js fetch cache. Configure preview and production environments separately, each with its intended Sanity dataset, source mode, optional read token and `SITE_URL`. `SITE_URL` is the canonical origin used by metadata, sitemap and robots; localhost is only the local default. This is not a static export.

After a deployment is reviewed, connect the domain in the chosen host, apply its DNS instructions, verify HTTPS and canonical URLs, and verify Studio CORS for that origin. Keep the previous successful deployment available for rollback. Roll back by promoting that deployment and its matching environment configuration; back up CMS data separately before editorial migrations. These are prepared instructions, not claims of completed external provisioning or launch.

## Implementation choices and limits

The public route tree avoids streaming loading boundaries, and metadata streaming is disabled, so initial HTML is visible with JavaScript disabled and unknown details return actual 404s. Client navigation shows pending feedback while preserving the current content. The tradeoff is waiting for initial content before the response starts.

The desktop scene loads only at 1024 CSS pixels and above with WebGL2 available. HTML stays mounted once across scene loading, viewport changes and context loss. Demand rendering stops drawing when the ring settles; reduced motion skips travel. The geometry follows the accepted prototype, but final visual design and mobile composition remain future design work. React Three Fiber currently emits a Three.Clock deprecation warning with the compatible pinned Three.js release; it is upstream and does not affect checks.

Dependency overrides patch transitive archive/YAML/TOML parsers and the UUID version used by Sanity tooling. Audit was clean at implementation. Reassess overrides when upgrading Sanity rather than forcing a major downgrade through `npm audit fix --force`.

Official references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Sanity query API](https://www.sanity.io/docs/http-reference/query), [Sanity slug uniqueness](https://www.sanity.io/docs/studio/slug-type), [Next.js metadata streaming configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots).

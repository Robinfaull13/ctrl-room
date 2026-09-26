# CTRL ROOM

A locally runnable site foundation for connected events, sessions, releases and editorial archives. Built with Next.js, TypeScript, Sanity and React Three Fiber. The desktop cockpit persists across navigation; mobile and unavailable-WebGL clients use semantic terminal views of the same routes and data.

## Start locally

Use Node 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local`. Open http://localhost:3000. The example explicitly selects labelled sample content. `/cms` shows setup instructions until Sanity identifiers are configured.

## Checks

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:e2e:live
```

Playwright starts its own application on port 3100 with fixture mode. Set `E2E_PRODUCTION=1` to test `npm run start` after building. For local environments unable to download Chromium, set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome. CI installs managed Chromium.

See [setup and delivery](docs/setup.md) for content modes, CMS/editor setup, credential checks and deployment preparation. The [approved spec](docs/superpowers/specs/2026-09-26-site-foundation-design.md) defines this milestone.

No external Sanity project or live deployment has been provisioned. Real content entry, final visual design, previews, contact processing, accounts, payments and newsletters are outside this foundation. Original `prototypes/` and `assets/` are reference material and remain separate from the application.

# NoordTune Power Catalog

Power catalog for NoordTune, designed to run either at `power.noordtune.nl` or mounted beside WordPress at `noordtune.nl/power`. Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, Framer Motion, Recharts, and `next-intl`.

The first working vertical slice is the RDW kenteken lookup:

- `/api/rdw-lookup` accepts `GET ?kenteken=` and `POST { "kenteken": "" }`.
- Plates are normalized by removing spaces/dashes and uppercasing.
- RDW vehicle and fuel datasets are merged into one public response.
- Responses are cached with a 24-48h style TTL, configurable via env.
- In-process rate limiting protects the endpoint during early deployment.
- Raw RDW rows are hidden by default and available with `includeRaw=1`.

## Local Development

This workspace uses a local pnpm binary because the desktop shell did not include a package manager.

```bash
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm install
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm dev --hostname localhost --port 3000
```

Open `http://localhost:3000/nl`.

## Environment

Copy `.env.example` to `.env.local` and fill:

```bash
RDW_APP_TOKEN=your_socrata_app_token
RDW_CACHE_TTL_SECONDS=172800
RDW_RATE_LIMIT_PER_HOUR=60
NEXT_PUBLIC_SITE_URL=https://power.noordtune.nl
NEXT_PUBLIC_BASE_PATH=
```

RDW works without a token for development, but production should use `RDW_APP_TOKEN`.

For main-domain hosting at `https://noordtune.nl/power`, use:

```bash
NEXT_PUBLIC_SITE_URL=https://noordtune.nl
NEXT_PUBLIC_BASE_PATH=/power
```

## Verification

Run:

```bash
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm typecheck
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm lint
PATH="$PWD/.pnpm-home/bin:$PATH" ./.pnpm-home/bin/pnpm build
```

On this Codex macOS runtime, Next falls back to `@next/swc-wasm-nodejs` because the native SWC binary is blocked by local code-signing rules. The warning is local-runtime-specific; the build completes successfully.

## Current Scope

Implemented:

- Premium responsive homepage with RDW plate search as the primary action.
- Dutch, English, and Polish routes at `/nl`, `/en`, and `/pl`.
- Manual car selector with fast text search and brand/model/year/engine steps.
- Expanded searchable database with 58,586 vehicle records focused on popular tunable cars in NL/BE/PL/DE.
- Vehicle detail pages at `/:locale/vehicles/:vehicleId` with graph, packages, options, and price calculator.
- Clean SEO stage routes at `/:locale/:brand/:model/:engine/:stage` which become `/power/:locale/:brand/:model/:engine/:stage` when mounted under `NEXT_PUBLIC_BASE_PATH=/power`.
- RDW lookup API with normalization, error handling, cache headers, TTL cache, rate limiting, and optional raw diagnostics.
- Internal tuning catalog for engines, stages, service options, ECU type, gearbox type, and compatibility.
- Power graph, stage selector, option estimator, and quote-oriented result panel.
- SEO metadata, alternate locale links, XML sitemap, robots.txt, AutoRepair schema.org JSON-LD, and Vehicle/Offer JSON-LD for stage pages.
- NoordTune brand visuals from the supplied package, with the shared header logo using `/brand/v8/header-logo-dark.png` consistently on homepage, vehicle pages, and stage SEO pages.

## WordPress/Main Domain Hosting

Recommended setup for `noordtune.nl/power`:

1. Deploy this Next.js app to Vercel.
2. Set `NEXT_PUBLIC_SITE_URL=https://noordtune.nl` and `NEXT_PUBLIC_BASE_PATH=/power`.
3. Put Cloudflare, Nginx, Apache, or the host reverse proxy in front of WordPress.
4. Forward `/power/*` to the Vercel app and leave the rest of `noordtune.nl/*` on WordPress.
5. Keep RDW lookup server-side in this app; do not proxy RDW from WordPress.

Alternative: keep `power.noordtune.nl` as a Vercel custom domain and add a WordPress menu link. This is simpler operationally, but the `/power` mount is supported by the current code.

Polish step-by-step deployment instructions are available in `docs/instalacja-noordtune-power.md`.

Next phases:

- Replace static catalog data with PayloadCMS or Sanity content collections.
- Add persistent Redis/Supabase cache for serverless multi-instance caching.
- Build browse/filter catalog routes and vehicle detail pages.
- Add quote form persistence, booking/calendar integration, and analytics events.

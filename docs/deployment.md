# Deployment

For a detailed Polish handover guide for `noordtune.nl/power`, see `docs/instalacja-noordtune-power.md`.

## Vercel

1. Create a Vercel project from this repository.
2. Choose either `power.noordtune.nl` or the main-domain mount `noordtune.nl/power`.
3. Add environment variables:

```bash
RDW_APP_TOKEN=your_socrata_app_token
RDW_CACHE_TTL_SECONDS=172800
RDW_RATE_LIMIT_PER_HOUR=60
NEXT_PUBLIC_SITE_URL=https://power.noordtune.nl
NEXT_PUBLIC_BASE_PATH=
```

For `noordtune.nl/power`, use:

```bash
NEXT_PUBLIC_SITE_URL=https://noordtune.nl
NEXT_PUBLIC_BASE_PATH=/power
```

4. Build command:

```bash
pnpm build
```

5. Install command:

```bash
pnpm install
```

## WordPress Path Mount

The catalog can run as a separate high-performance Next.js/Vercel system while WordPress keeps the main site:

1. Keep WordPress serving `noordtune.nl/*`.
2. Reverse proxy only `/power/*` to Vercel.
3. Preserve the original host header so canonical URLs stay on `noordtune.nl`.
4. Forward WebSocket/streaming headers if the host/proxy requires them for Vercel.
5. Do not route `/api/rdw-lookup` through WordPress; with `NEXT_PUBLIC_BASE_PATH=/power` the endpoint is `/power/api/rdw-lookup`.

Cloudflare Worker, Nginx, Apache `ProxyPass`, or a managed host path proxy can all handle this. If the WordPress host cannot proxy a subpath reliably, use `power.noordtune.nl` as the production domain and add a WordPress navigation link.

## RDW Token

Create a free Socrata/RDW app token from the RDW Open Data profile page and store it as `RDW_APP_TOKEN`.

## Shared Cache

The current in-process cache is fine for local development and a phase-one deployment. For production traffic, add one of:

- Vercel KV / Upstash Redis
- Supabase Postgres cache table
- Neon Postgres cache table

Suggested cache table:

```sql
create table rdw_lookup_cache (
  kenteken text primary key,
  response jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## GDPR Notes

- Make plate lookup optional.
- Show the RDW data disclaimer near lookup results.
- Store only fields needed for quote handling.
- Add a privacy notice before quote submission.
- Do not log app tokens or raw RDW request URLs.

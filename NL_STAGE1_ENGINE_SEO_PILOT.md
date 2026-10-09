# NoordTune Power Catalog — NL Stage 1 engine SEO pilot

**Status:** preview-only, follow-up feature branch; do not deploy directly to production.

- Branch: `feature/nl-stage1-engine-pages-20261009`, branched from the visually approved `feature/power-catalog-mobile-ux-20261008` at `cf37971`. It is a *stacked change* and does not alter the production `main` branch.
- Existing rollback tag: `backup/power-catalog-before-redesign-2026-10-08`, production base `0c0bfb9`.
- Existing first-party catalog remains the source of truth for vehicle routing, RDW live lookups and prices.
- Primary audience is **Dutch users in the Netherlands**. No automatically generated English or Polish versions of the new engine pages.

## Published scope

**21 unique Dutch engine / generation topics** derived from **25 owner-reviewed Stage 1 RDW cohorts**, introduced in `src/data/reviewed-rdw-bulk-batch-4.ts`.

- Nissan Qashqai J11 1.2 / 1.3 DIG-T;
- BMW 320i F30/F31 **N20 1997 cc** and **B48 1998 cc** as distinct groups;
- Ford Transit Connect 1.5 EcoBlue 100 and 120; Ford Transit 2.0 EcoBlue 130;
- Volkswagen Crafter II TDI 177, Golf VII 1.0 TSI 110 and GTI Performance 245, four Caddy IV/V TDI configurations plus the distinct older 2KN 110, Tiguan II 2.0 TSI 180, Polo 6R 1.2 TSI 90, Transporter T6 2.0 TDI 204;
- Renault Mégane IV 1.2 TCe 100, Master III dCi 145 and Blue dCi 145.

**Source count:** 46 distinct URL citations *at the per-page level* across 21 engine pages. These are external, tuner-published indications, not measured NoordTune outputs. Repeated publisher URLs on separate pages are acceptable only when those publications actually apply to the engine generation.

### Why not one URL per RDW observation?

- Three group families aggregate genuinely similar reviewed technical scopes: BMW N20 3K/3L, BMW B48 3K/3L, Transit Connect EcoBlue100 2019–2022, and Transit EcoBlue130 2018–2022. Original kW, cc, year and RDW type stay separately listed within the page.
- The first batch `reviewed-rdw-bulk-batch-4.ts` is **strictly whitelisted**. No URL is created from free-form registration strings, VINs, model names or unsupported prediction outputs.
- Different engine generations such as N20/B48 or Caddy IV/V have distinct canonical pages.
- Each page contains its own hand-reviewed NL explanation, eligibility scope, workshop checks, exact factory power and torque references, source-linked Stage 1 power/torque with derived indicative gains, a contact step and links to similar engines.
- Factory horsepower is calculated from the matching RDW registered kW. **Original engine torque is not an RDW field**, therefore the page distinguishes source-published factory Nm values from RDW facts.

## Indexing and acquisition

- `/nl/motoren` is the permanent category index.
- `/nl/motoren/[slug]` is the canonical for each published engine family. There are no EN/PL translations yet; they should 404 rather than create thin automated translations.
- NL landing-page indexing adds **22 URLs**, bringing the existing **219 public catalog paths to 241 total**, without changing any existing canonical or removing Stage URLs.
- Full Dutch home page contains a compact internal-link group featuring six representative engines and a link to the 21-topic hub; hub pages link all 21 individual profiles server-side.
- Every engine profile links back to the RDW lookup and to the official `www.noordtune.nl/nl/chiptuning` service page, plus optional WhatsApp.
- The primary `www.noordtune.nl` website remains the business/appointment destination. Profiles have WebPage + breadcrumb schema, **not** unverified offers, service pricing or fabricated customer testimonials.

## Release quality gates

- `pnpm test:seo`: legacy 219 routes + 22 NL source-backed engine URLs and strict publication audit.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`: ordinary production checks.
- `node scripts/qa-nl-stage1-engine-seo.cjs`: 21 server-rendered canonical pages, source links, 390px mobile and 1440px desktop, exact sitemap / NL-only indexing, redirects/404 for unserved languages, and no horizontal overflow.
- No RDW/Stage resolver, stored customer plate data, pricing or manufacturer figures are modified by this SEO pilot.

## Next controlled rollout

After the **V4 redesign merges**, review this stacked feature PR, then release the 21 NL pages (without force-push and without bypassing Preview protection). Verify Search Console discovery and selected sample URL indexing before increasing the number of published engine groups.

Monitor impressions and queries for exact slug targets, clicks through to `noordtune.nl`, and real WhatsApp/form leads. Do not treat a source-backed Stage 1 *data-coverage result* as proof that Google indexed the page.

Future batches must start with **new reviewed data** and independently useful content. Expand progressively in batches of 15–30 distinct engine families. Duplicate RDW homology codes and vehicle re-registrations belong in existing page tables, not in newly indexed URLs. If the sources disagree beyond safe disclosure or cannot identify ECU/gearbox and generation, keep the vehicle searchable in the catalog and do not publish an SEO landing page.

## Caveats from Search Console

The 28-day window 2026-09-08 to 2026-10-05 showed only 5 Google clicks / 215 impressions for `power.noordtune.nl` (subset of the parent domain-property totals); its listed search queries were sparse and mostly non-NL. Ranking potential is therefore a **hypothesis** until indexed traffic and leads increase. Primary local lead terms belong to the corporate `www.noordtune.nl` SEO workstream.

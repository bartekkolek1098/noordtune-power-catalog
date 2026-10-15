# NoordTune SEO Factory NL — Brand Engine Directory Batch 6 (2026-10-15)

## Baseline
- Power Catalog production main before this change: `8221ab6a4cc10c64a2c67f935ee0707ace320627` (PR #70).
- Main WWW production: `728648ffd246b60b731db4df41b9f3c843d0da62` (PR #27).

## User intent
Netherlands first: a customer should find their exact car or van, compare realistic source-reviewed Stage 1 outputs and request a NoordTune workshop evaluation. Do not pretend the 58,586 raw variants all have verified tuning data; never invent engine power, dyno results or ECU access.

## Change
- 15 independently authored Dutch-only technical make guides under `/nl/merken/[slug]` plus `/nl/merken` directory.
- Brand topics: BMW, Audi, Volkswagen, Mercedes-Benz, Ford, Toyota, Peugeot, Renault, Nissan, Opel, Citroën, Fiat, Iveco, SEAT, Škoda.
- Each unique guide provides manufacturer-specific comparison guidance (ECU generation, original RDW kW/cc, gearbox, emissions and maintenance), two original technical FAQs, an exact listing of approved car engines/van engines, links to existing model comparisons and van model pages, a no-guarantee source disclaimer and commercial-service enquiry CTA.
- Scope is **existing reviewed publications only**: 69/73 passenger SEO engine profiles; all 101 van engine pages; all 25 approved van model pages; all 21 model comparison hubs. Four one-profile makes (Dacia, Hyundai, MINI, Mazda) are intentionally not turned into thin doorway pages.
- Numeric Stage 1 ranges and original factory kW are derived from unchanged reviewed application records. The count of sources refers to de-duplicated outbound tuner publication URLs, not NoordTune measurements. No mass SEO generation from raw RDW variants.
- Brand pages/paths are included in canonical sitemap **443 -> 459** unique URLs. Each is accessible from home /nl and index /nl/motoren; engine detail pages link directly back to the exact make guide.
- Brand guides for vans link to the separate business offer on www.noordtune.nl; published brand service pages for BMW/Audi/VW/Ford/Toyota remain on www, not duplicated as service landing pages.
- Locales EN/PL have no /merken pages (404). Pricing, RDW API matching, vehicle enquiry and legal SCR/AdBlue rules preserved.

## Tests and release gate
- `pnpm typecheck`
- `pnpm test:seo` including `scripts/test-nl-brand-engine-guides.ts`
- `pnpm test:catalog-handoff`
- `pnpm lint`
- `pnpm build`
- `RDW_QA_URL=http://127.0.0.1:3141 pnpm qa:seo:nl-brands`
- Production Playwright, canonical and sitemap verification after preview Ready, PR merge and production Ready.
- Protect original SHA as rollback tag before merge.

## SEO measurement
Publishing 16 crawlable canonical URLs does **not** imply Google has indexed them or that rankings improved. Free Google Search Console remains the appropriate source of impressions, discovered and indexed URL metrics; GSC Wizard paid connector was unavailable previously. Track conversion clicks on WWW/Vercel Analytics separately from indexing.

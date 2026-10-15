# NoordTune SEO Factory NL — batch 7, 2026-10-16

## Baseline production
- Power Catalog main `74f4a6c48a7efd71cb95880c0757309a1d72498e`, PR #71, production READY.
- Main WWW `0d06282b6bab232ecc56fad90bf557c09cba6788`, PR #28, production READY.

## Customer-first improvements
- Added **one on-page, privacy-preserving engine finder** to existing `/nl/motoren` (no new search URL).
- Searches **174 distinct already published engine profiles**: 73 URLs in the general NL motor directory (including 12 historically indexed commercial van topics) and 101 purpose-built van-engine URLs.
- Classified by the **actual audited vehicle model**, not by old directory URL: 61 passenger-car profiles and 113 commercial van profiles.
- Text search supports common make/model/engine terms and accents (e.g. Volkswagen/VW, Škoda, Citroën). Filters include approved make, passenger/commercial vehicle, fuel (petrol/diesel/CNG), **RDW first admission year**, and exact original **RDW kW**, including decimals.
- Filters must match the **same reviewed RDW application** for year and kW. A year gap between cohorts is not filled by interpolation; negative filters do not imply tuning is impossible.
- The client loads only a minimal, serializable subset (brand, model, published slug, original kW, cc, type and year intervals), with pure no-network filter helpers in `src/lib/nl-reviewed-motor-search.ts`. No raw RDW dataset, customer plate, VIN, storage, analytics event or new URL containing a plate.
- Accessible labelled form, live result count, 24-item initial results and functional load-more, reset and manual/RDW fallback. The original SSR engine index remains completely crawlable.

## Three individually authored new Dutch comparison pages
1. `/nl/modellen/bmw-320i-f30-g20`: F30/F31 N20 1997 cc / 135 kW vs F30/F31 B48 1998 cc / 135 kW vs G20/G21 B48 1998 cc / 135 kW. Separate ECU and model-phase checks.
2. `/nl/modellen/volkswagen-golf-6-7`: Golf VI 1.4 TSI 122, Golf VII 1.2 TSI 105, Golf VII 1.0 TSI 110, GTI Performance 245; four existing RDW-checked engine profiles with different ECUs and transmission limits.
3. `/nl/modellen/nissan-juke-f15-f16`: F15 1.2 DIG-T 115 / 85 kW against two F16 1.0 DIG-T 117 / 86 kW and 114 / 84 kW, with motor-generation and transmission cautions.

- All three hubs have unique NL intro, generation differentiation, workshop checks and two original FAQs. All source Stage 1 values and factory RDW kW come from existing verified profiles; no invented Stage 2/3, no borrowed unverified photos.
- Some engines also appear in an original generation hub (F30-only, Golf 7-only, Juke F16-only). The original primary reverse-link is explicitly preserved; `nlModelHubsByEngineSlug` exposes **all** applicable comparisons and each engine page links back to all, preventing orphaned secondary hubs.
- Model comparison hubs: 21 → **24**; number of distinct compared engine topics 52 → **56**. Sitemap: 459 → **462** distinct canonical URLs (+3). NL only; no thin EN/PL mirror pages. Original 73 motor pages, 101 van pages and 15 brand guides retain their canonical URLs.

## Quality and release controls
- `pnpm test:seo` and `pnpm test:catalog-handoff` plus new `scripts/test-nl-reviewed-motor-finder.ts`
- `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Local production Playwright `RDW_QA_URL=http://127.0.0.1:3149 pnpm qa:seo:nl-motor-finder`: filter Juke F15 (2019)/F16 (2020), exact 85/86 kW, no false match; Transit Connect 73.3 kW in 2022 but not 73.5 in that cohort; CNG distinct; Mercedes vans, VW alias, accents, reset, pagination, overlapping engine identity, 3 new comparisons, original+new reverse links, 320/390/1440 mobile/desktop, 462 sitemap, EN/PL 404.
- After GitHub PR preview Ready, merge and verify production exact SHA, run same browser QA against `https://power.noordtune.nl`.
- Keep old release rollback tag `rollback-before-nl-motor-finder-20261016` on pre-merge SHA.

## SEO clarity
These changes make the existing evidence discoverable and add three differentiated technical comparisons. **462 sitemap URLs are not 462 confirmed indexed Google pages**, nor a claim that the full RDW fleet has Stage 1 numbers. Measure Search Console indexing/impressions separately.

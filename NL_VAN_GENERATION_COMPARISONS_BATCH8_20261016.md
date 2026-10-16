# NoordTune NL van-engine generation comparisons — 16 October 2026

## Published baseline
- `bartekkolek1098/noordtune-power-catalog` production main `2f4f6e2cd63fb4544a1053102545201db15209bd` (PR #72, Vercel READY).
- Existing reviewed scopes: 101 individual van engine pages, 25 commercial van model pages, 73 NL general engine pages, 24 passenger model comparison hubs, 15 NL technical brand hubs. 462 unique sitemap URLs. Prices/contact/RDW resolver are frozen.

## Intended customer and search journey
Source-backed Dutch technical comparisons for tradespeople, businesses with vans, fleets, installers and construction customers. A user searching “Sprinter 315 vs 317 CDI chiptuning”, “Transporter T5 T6 T6.1 Stage 1” or “Transit Custom 2.2 TDCi vs 2.0 EcoBlue” should locate their exact **factory kW, displacement, RDW type, application years and independently sourced Stage 1 range**, then open the previously published motor and an exact-engine prefilled enquiry.

## Nine individually written NL technical comparisons (plus index)
1. Mercedes Sprinter 313/314/315/316/317 CDI — `/nl/bedrijfswagens/vergelijken/mercedes-sprinter-313-317-cdi` (7 profiles).
2. Mercedes Vito 114/116/119 CDI, 2020/2023/2024 Euro 6e — `mercedes-vito-114-119-cdi` (6).
3. VW Transporter T5/T6/T6.1 2.0 TDI — `volkswagen-transporter-t5-t6-t61` (8).
4. Ford Transit Custom 2.2 TDCi vs 2.0 EcoBlue — `ford-transit-custom-22-tdci-20-ecoblue` (3).
5. Ford Transit 2.0 EcoBlue 130/165/170, 2016–2024 reviewed cohorts — `ford-transit-ecoblue-130-165-170` (6).
6. VW Crafter 2.0 TDI 102 vs 140, Euro 6/Euro 6d — `volkswagen-crafter-20-tdi-102-140` (3).
7. Toyota Proace 1.5 vs 2.0 D-4D 100/120/122/150/177 — `toyota-proace-15-20-d4d` (5).
8. Peugeot Boxer 2.0 vs 2.2 BlueHDi 120/130/140/165 — `peugeot-boxer-20-22-bluehdi` (4).
9. Fiat Ducato 2.3 MultiJet 120/130, 2013–2021 Euro 6 phases — `fiat-ducato-23-multijet-euro6` (4).

All compare URLs have prefix `/nl/bedrijfswagens/vergelijken/`. New category index at `/nl/bedrijfswagens/vergelijken`; ten new indexable canonical URLs total.

## Data and original editorial guardrails
- **46 distinct existing individual engine pages**, 48 exact reviewed RDW application cohorts. Engines appear in only their exact audited make/model family. At least 2 independent publisher-host sources on each engine.
- Stage 1 pk and Nm numbers and original factory kW/cc/year/type rendered from existing `nlVanEngines.applications`, never hardcoded or inferred across model years. When one motor profile has multiple reviewed admission intervals, show each interval as a separate card; do not imply continuous year coverage or guaranteed ECU compatibility.
- Each of 9 comparison pages has a uniquely written Dutch introduction, generation differences, ECU/maintenance/transmission checks, business workload context and 2 original substantial technical FAQs (18 total). All 46 cards have motor-specific enquiry hash links with **legacy van engine ID unchanged**, plus source links.
- Dutch-only new pages (404 for EN/PL). No copied “chiptuning price” commercial service page, no general-city keyword stuffing, no unlicensed images, no inferred Stage 2/3 values, no DPF/SCR/AdBlue deletes.
- Independent manufacturer context: Ford official 2016 2.2 TDCi -> 2.0 EcoBlue announcement `https://fordmediacenter.nl/nieuwe-ford-transit-biedt-lagere-kosten-en-hogere-prestaties-dankzij-nieuwe-ecoblue-motor/`; only used for editorial context, not for Stage 1 numbers. Other sources are the pre-existing reviewed RDW and tuner datasets.
- Old 25 van model pages, 101 van engine pages, 15 technical brand guides and van directory gain crawlable context links into the new comparisons. Existing original model pages remain the comprehensive model profiles; new comparison URLs intentionally focus on cross-year/version technical differentiation.
- Sitemap **462 -> 472** verified canonical URLs, Next.js expected **480** statically generated routes (count separate from sitemap entries). Previously existing sitemap URLs remain unchanged.
- Rollback tag `rollback-before-nl-van-comparisons-20261016` will point at pre-merge main `2f4f6e2cd63fb4544a1053102545201db15209bd`.

## Release gates and QA
- `pnpm typecheck`, `pnpm lint`, `pnpm test:seo`, `pnpm test:catalog-handoff`, `pnpm build`.
- New `scripts/test-nl-van-comparisons.ts`: unique approved slugs, independent source hosts, engine/app original reference identity, tech text/FAQ uniqueness, 46 exact legacy quote contexts, no new numeric values.
- New `RDW_QA_URL=http://127.0.0.1:3152 pnpm qa:seo:nl-van-comparisons` production browser: nine comparison pages, index, each 46 engine quote, all 48 original kW/cc/RDW cohort rows, 18 FAQ, original van model + engine deep links, featured links in directory, brand hubs, no EN/PL duplicated pages, phone 320/390 and desktop 1440, public sitemap.
- Existing browser suites `qa:seo:nl-vans` and `qa:seo:nl-brands` after adjusted sitemap count.
- Verify GitHub Vercel preview READY and exact SHA, merge safely, verify main production READY, run public host browser checks. A sitemap route is NOT proof that Google indexed it; Search Console needed for that.

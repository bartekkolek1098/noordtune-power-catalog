# NoordTune Power Catalog — Dutch commercial van generation comparisons batch 9 (2026-10-16)

## Baseline
- Previous production: `2fa160b704b83dc3670e868156b4ca651aa6a2fa` (Power Catalog PR #73, READY; 472 canonical sitemap URLs; 9 independently written van engine comparisons).
- Main WWW: `a5e77b8af951512f3ec4c274d15d175d6bb87180` (PR #30; live nine featured van links).
- Priority: commercial vans for installers, tradespeople, fleet operators and construction contractors in the Netherlands; exact engine selection, RDW kW and proper source references before requesting a quote.

## Delivered
Twelve further **hand-written, source-backed, NL-only diesel engine comparisons** based entirely on already published, independently reviewed Stage 1/RDW engine profiles:
1. Iveco Daily **2.3 and 3.0**, Euro 6 and Euro 6Df (6 engine topics; 17 exact RDW body-type/engine variants).
2. Renault Master **2.3 dCi 110/130/145 and Blue dCi 135** (4 engines; five exact RDW applications; separate 2019 and 2022 for 145; no inferred intervening years).
3. Peugeot Expert **2.0 BlueHDi 120/145/177/180** (4 engines; five RDW applications; 145 separate 2022 and 2024 cohorts).
4. Toyota Proace City **1.5 D-4D 75/100/130** (4 engines; 2024 130 separate from 2020–2023).
5. Opel Vivaro B **1.6 CDTI 95/120 and BiTurbo 125/145** (4 engines; same type, distinct original kW).
6. Opel Movano B **2.3 CDTI 150/180** versus C **2.2 diesel 120/140/165** (5 engines; six RDW application rows including distinct old B body types).
7. Citroën Jumpy **1.5/2.0 BlueHDi 100/120/145/177** (4).
8. Citroën Berlingo II **1.6 HDi 75** versus III **1.5 BlueHDi 75/100/130** (4).
9. Peugeot Partner II **1.6 HDi 75** versus III **1.5 BlueHDi 75/100/130** (5; separate 100 source profiles in 2019–2021 and 2022–2024).
10. Fiat Doblò **1.6 MultiJet 100/105/120** (3).
11. Opel Combo E **1.5 diesel 75/100/130** (3).
12. Renault Kangoo II **1.5 dCi 75/90/110** (3; no inferred 2016–2018 for the special 90 cohort, only reviewed 2015 and 2019).

## Source and editorial safeguards
- Prior nine comparison guides remain and keep their URLs. **21 comparison guides total**, with the `/nl/bedrijfswagens/vergelijken` index.
- Across the 21 comparisons: **95 distinct already-published diesel engine pages, 112 exact source-backed RDW scopes**, two independent Stage 1 source publishers minimum per engine and **42 unique Dutch FAQ answers**.
- The new 12 pages have individual, substantive Dutch intro, engine differences, maintenance, ECU/transmission, work-use considerations and two original FAQs each. No copied paragraphs from another brand; no speculative Stage 1 power/torque; all numeric figures and source links are *read from the existing application records* in each engine card.
- Contextual model/engine backlinks and brand guides are driven from the existing approved comparison maps. `21/25` audited van model families now have a unique comparison; the remaining four (Ford Transit Connect, VW Caddy with CNG, Renault Trafic, Opel Vivaro C) intentionally do not spawn thin diesel generation comparisons due to insufficient distinct applicable diesel profiles.
- New indexable URLs: **+12 Dutch-only**, no EN/PL duplicate, sitemap **472 → 484**, expected Next.js **492 static generated pages**.
- Existing 25 van model pages and 101 van engine pages, 73 general engines, RDW resolver, prices, exact-engine lead handoff and www quotes unchanged. No emissions-deletion claims or disabling road-legal DPF/SCR/AdBlue.

## Verification
- New review assertions: Iveco body-type and 114.6 kW, Movano 2.3 versus 2.2 generation, Master 145 gap, Expert 145 2022/2024 gap, Kangoo 90 separate 2015/2019, Proace City 130 2024 software scope and Berlingo II/III distinct types.
- `pnpm test:seo`, `pnpm test:catalog-handoff`, `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- Local production `RDW_QA_URL=http://127.0.0.1:3157 pnpm qa:seo:nl-van-comparisons`: 21 comparison pages + index, 95 exact-engine quote links, 112 RDW applications, source links, FAQ, required marque/model crosslinks, canonical, 484 sitemap, responsive 320/390/1440, EN/PL 404, negative RDW cohort checks.
- Regression `pnpm qa:seo:nl-vans` and `pnpm qa:seo:nl-brands` for old 25 van model pages, 101 engine pages and 15 technical brand pages.
- Rollback tag against previous production main; preview READY and exact head commit; merge tested PR; production READY, public site QA and clean local main.

## Further conversion integration
The WWW commercial-van landing currently features nine curated comparisons from PR #29. Keep that concise curated shortlist; once this expansion is published, improve its copy and add links to newly reviewed Iveco Daily/Master/Expert/Berlingo while retaining the existing quote. Site counts must be measured in Search Console, not assumed from sitemap presence.

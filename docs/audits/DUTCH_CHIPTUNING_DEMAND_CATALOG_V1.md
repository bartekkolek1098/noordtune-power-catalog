# Dutch chiptuning demand and catalog quality audit V1

**RESEARCH ONLY — NO PRODUCT CHANGES**

- Audit date: 2026-10-04
- Baseline: `14a6e5c0456cc7eda82602702fcadf38c3fcfb8a`
- Branch: `audit/dutch-chiptuning-demand-catalog-v1`

## Decision

Start with the BMW 320d B47 public-profile correction. It has the strongest supplied NoordTune visibility signal: approximately 280 impressions. Its F30/F31 label extends to 2022, and its public Stage 1 torque of 470 Nm exceeds the normal references compared here. This is a provisional improvement queue; a measured Netherlands search-demand ranking could not be established.

Recommend **18 configurations: 12 corrections and six expansion candidates**. Correct misleading public facts first. Each expansion needs measured demand or explicit workshop evidence, exact factory/tool applicability, and compatible output references before implementation. The owner must review this audit before any product work.

## Demand evidence and limitations

Semrush returned `no_api_units`; GSC Wizard returned `payment_required`. Neither returned keyword or analytics data. Every exact monthly volume is null with `volume_status=unavailable`. No Google Trends series or localized Google NL autocomplete/SERP snapshot was captured. First-party supplier pages establish commercial supply and terminology, not Google demand or Dutch fleet prevalence. [Semrush connector access](https://www.semrush.com/mcp-access) (2026-10-04; connector); [GSC Wizard connector access](https://tool.gscwizard.com/settings/subscription) (2026-10-04; connector).

The 44 clusters cover the seed families and propose measurements for model, engine, tuning, Stage 1/2, power, ECU, TCU, relevant DSG and local variants. Query plans are explicitly **planned, not measured**. Mini, Peugeot, Renault, Opel and Hyundai/Kia are additional discovery candidates; their supplier presence does not establish high demand. Lower-priority groups received preliminary screening rather than a complete variant audit.

Current NoordTune visibility stays separate from external demand. The owner supplied approximate impressions from a recent 90-day view, with no authenticated export. Exact dates, country, property, deduplication, clicks, CTR, numeric average position and strongest locale are unavailable. A45's supplied 31 impressions concern an EN page; that does not prove EN is its strongest locale. Golf GTI/R weak positions are reported without numeric metrics. Unknown visibility is not treated as zero. [Owner-supplied Search Console baseline](https://search.google.com/search-console) (2026-10-04; owner-supplied).

### Transparent provisional scoring

Weights: Dutch demand 35%, NoordTune visibility 20%, technical weakness 20%, workshop relevance 15%, platform reuse 10%.

- Demand points and total weighted scores remain null for all families.
- Visibility uses disclosed ordinal bands: 20 points for 320d; 12 Focus; 10 A4/Passat/XC60; 8 A45; 6 weak-ranked GTI/R; 4 observed A3/320i queries; otherwise null.
- Weakness, workshop relevance and reuse are subjective audit scores of 0–5, multiplied by 4, 3 and 2.
- Rank uses only known points, then known visibility, then seed order. Missing 35–55 points can reorder the queue; possible intervals are recorded.
- Demand confidence is LOW throughout. Priority confidence is MEDIUM when supplied visibility accompanies a technical finding, otherwise LOW. No HIGH-confidence total score is claimed.

Demand/coverage classes A–D require strong or moderate demand that was not established here. All families receive **E: uncertain demand**, with a hypothetical class if demand is confirmed. Technical truth grades are independent: A customer-ready; B useful with exact confirmation; C too generic/incomplete; D conflicting facts or wrong-family risk. No fully evidenced A-grade configuration was established.

## Top 20 provisional families

| Rank | Family | Supplied visibility | Demand confidence | Public / reference | Grade | Queue | Known points / priority confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | BMW 3 Series diesel / B47 | ~280 | LOW; volume unavailable | 3 / 0 | D | P0 | 61 / MEDIUM |
| 2 | VW Golf 7/7.5 GTI | weak rank reported | LOW; volume unavailable | 1 / 0 | D | P0 | 51 / MEDIUM |
| 3 | BMW 3 Series petrol / B48 | queries only | LOW; volume unavailable | 1 / 0 | D | P0 | 49 / MEDIUM |
| 4 | VW Golf 7/7.5 R | weak rank reported | LOW; volume unavailable | 1 / 0 | D | P0 | 48 / MEDIUM |
| 5 | Audi A4 B8/B9 | ~46 | LOW; volume unavailable | 2 / 0 | C | P0 | 47 / MEDIUM |
| 6 | VW Passat B7/B8 | ~45 | LOW; volume unavailable | 1 / 0 | D | P0 | 47 / MEDIUM |
| 7 | Ford Focus / ST | 48–56 | LOW; volume unavailable | 1 / 0 | C | P0 | 46 / MEDIUM |
| 8 | Volvo XC60 | ~44 | LOW; volume unavailable | 1 / 0 | D | P0 | 46 / MEDIUM |
| 9 | Mercedes A-Class / AMG | ~31 | LOW; volume unavailable | 1 / 0 | D | P0 | 44 / MEDIUM |
| 10 | SEAT Leon / Cupra | unknown | LOW; volume unavailable | 1 / 0 | D | P0 | 42 / LOW |
| 11 | BMW 1 Series 118i/118d/120d/128ti | unknown | LOW; volume unavailable | 3 / 1 | D | P0 | 41 / LOW |
| 12 | VW Golf 7 TDI/GTD | unknown | LOW; volume unavailable | 2 / 0 | D | P0 | 41 / LOW |
| 13 | VW Polo | unknown | LOW; volume unavailable | 0 / 0 | C | P1 | 41 / LOW |
| 14 | Audi A3 / S3 | queries only | LOW; volume unavailable | 2 / 0 | D | P1 | 40 / MEDIUM |
| 15 | BMW 5 Series / 520d | unknown | LOW; volume unavailable | 1 / 0 | D | P1 | 38 / LOW |
| 16 | Skoda Octavia / vRS | unknown | LOW; volume unavailable | 1 / 0 | D | P1 | 38 / LOW |
| 17 | Ford Transit / Custom / Connect | unknown | LOW; volume unavailable | 0 / 2 | B | P0 | 37 / LOW |
| 18 | VW Transporter T5/T6/T6.1 | unknown | LOW; volume unavailable | 0 / 0 | C | P0 | 37 / LOW |
| 19 | BMW B58 M140i / 340i | unknown | LOW; volume unavailable | 0 / 0 | B | P0 | 36 / LOW |
| 20 | BMW X3 E83 diesel | unknown | LOW; volume unavailable | 1 / 0 | D | P0 | 33 / LOW |

Coverage means intentionally public records and conditional reference profiles. Canonical and sourced counts for each family are in `demand-vs-current-coverage.json`; they span all generations and may overlap. They are not exact-variant coverage or measured runtime success. Grades screen listed configurations, not every variant in a family.

## Current released catalog

Read-only approved-main inventory:

- 24 intentionally public vehicles: seven existing curated records and 17 canonical publications.
- 58,586 server-side canonical rows, **not independent verified tuning applications**.
- 1,269 sourced profiles and 3,377 source-index observations.
- Stage 1 in 1,269 profiles; Stage 2 in 271; Stage 3 in four. 187 profiles contain multiple Stage 1 sources.
- Three conditional references: BMW 128ti, Transit Custom EcoBlue 105 and Transit Connect TDCi 100.
- 72 vehicle pages, 216 stage pages and three locale home pages: 291 sitemap entries. All NL/EN/PL vehicle and stage URLs are inventoried from code; this is not a new production HTTP crawl.

All 24 public records include identity, generation, engine/code status, stock pk/Nm, years, fuel, ECU/gearbox/TCU confidence, stage evidence, pricing assignments and publication provenance. Public figures remain internally estimated; the sourced dataset does not automatically validate or replace them.

Nonpublic canonical selector entries resolve as estimates. Only intentionally public IDs supply public detail/stage routes; reference selectors create no SEO routes. Homepage detail-ID relationships are inventoried without registration examples. Source-first RDW matching is separate from static public-profile values.

The inherited V3.2 synthetic receipt reports 1,266 sourced identities: A185/B972/C10/D99/E0. It reports 3,197 canonical distinct identities, including 2,962 supported ICE identities: A24/B92/C1625/D1221/E0. Its normalized profile fingerprint still matches current data:

`63e005fe8658c3b9510a89eacaf37f72f3eaef187dd63eaf4984a9df3de0dc75`

These fixtures were inspected, not rerun. They are not live RDW results or Dutch fleet proportions. Runtime A/B/C/D/E means sourced multi/approved, sourced single, reference/canonical, generic and unavailable; it differs from the audit's demand classes and truth grades. Incomplete displacement and known generated cross-products remain explicit exclusions.

**Stage 3 distinction:** the files retain stored numeric figures for provenance and separately show the hardware presentation policy. Unsupported public Stage 3 numbers are removed by that policy and its quote becomes an individual request. The audit does not claim all retained numbers are currently shown as fixed customer targets.

Local evidence: `src/data/catalog.ts`, `curated-catalog.ts`, `curated-technical.ts`, `tuning-estimates.ts`, `pricing.ts`, `src/lib/stage-hardware-policy.ts`, `src/lib/rdw-tuning-estimate.ts`, `src/app/sitemap.ts` and `data/research/v3-2-coverage-report.json` at the baseline SHA.

## Main technical findings

1. **BMW 320d:** split F30/F31 LCI 190/400 from G20. Compare Stage 1 references of 220–225 pk / 440–460 Nm before adopting a target; current 225/470 remains a conditional internal estimate. [BMW NL 2015 320d stock](https://www.press.bmwgroup.com/netherlands/article/detail/T0216582NL/bmw-presenteert-de-vernieuwde-bmw-3-serie) (2026-10-04; search-index); [Unlimited BMW320d F30/F31](https://www.unlimitedtuning.nl/chiptuning-bmw-320d-f30-f31-190-pk.html) (2026-10-04; search-index).
2. **Golf GTI Performance:** factory 230/350 scope is 2013–2017, distinct from later 245/370 Performance and 230/350 standard GTI. Current 2014–2020 is too broad. Simos applications challenge the Bosch MED17/MG1 label. Stage 1 references are 300/420, 300/440 and retained 305/460. The proposed conservative 300/420–440 comparison is a subset, not a measured consensus. [VW GTI production/output boundaries](https://www.volkswagen-newsroom.com/en/engine-versions-golf-7-gti-profile-20034) (2026-10-04; search-index); [VAGTechniek Golf7 GTI Performance230](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7-/2.0-tsi-gti-performance-230pk/) (2026-10-04; page); [BR-Performance NL GTI Performance230](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/) (2026-10-04; search-index).
3. **G20 320i:** European manufacturer 184/300 conflicts with public 184/270 and inherited tuner/tool 270/290 metadata. Correct exact stock scope first; replacement tuned targets are withheld. [BMW European G20 launch specifications](https://www.press.bmwgroup.com/belux/article/detail/T0285543NL/de-nieuwe-bmw-3-reeks-berline?language=nl) (2026-10-04; search-index).
4. **Golf R:** split pre-facelift 300/380, facelift 310/400 and later GPF 300/400. Current 2017–2018 300/400 is too broad. Matched pre-facelift Stage 1 references show 350/460; do not transfer another package's Stage 2/3 outputs. [Volkswagen Golf VII engine specifications](https://www.volkswagen-newsroom.com/de/motorversionen-golf-7-steckbrief-20040) (2026-10-04; search-index); [BR-Performance NL Golf7 R300 pre-facelift](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/) (2026-10-04; search-index); [BR-Performance NL Golf7.5 R300 GPF](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/9023-vii-facelift-02-2017-2020/10666-2-0-tsi-r-gpf/) (2026-10-04; search-index).
5. **Audi A4 TDI:** normal 190/400 references show 220–225/450–460 versus current 230/470. Early B9 factory/code applicability and longitudinal S tronic mapping remain incomplete. A 2019 manufacturer document is not proof for every early B9 car. [Unlimited Audi A4B9 TDI190](https://www.unlimitedtuning.nl/chiptuning-audi-a4-b9-2-0-tdi-190-pk.html) (2026-10-04; search-index); [Audi A4 2019 upgrade](https://www.audi-mediacenter.com/en/the-audi-a4-major-upgrade-for-the-bestseller-11884/download) (2026-10-04; search-index).
6. **XC60 D5:** manufacturer separates D5244T20 220/440 and D5244T22 220/420. Only one compatible Normal 230/480 reference was captured; no final replacement for current 255/520 is proposed. [Volvo XC60 engine specifications](https://www.volvocars.com/uk/support/car/xc60/16w46/article/d24bb7d1e21ec6e4c0a801e801cf6114/510652ac31fe5b38c0a801e8014486bc/c48f21dbf78fa679c0a801e800b1d372/) (2026-10-04; search-index); [Unlimited XC60 D5 220](https://www.unlimitedtuning.nl/chiptuning-volvo-xc60-2015-2-4-d5-220-pk.html) (2026-10-04; page).
7. **Passat/A3/Golf TDI/Octavia:** inherited tuner stock 320 versus public 340 Nm needs exact factory/type/configuration review. BMW 520d F10 also has retained 380 versus public 400 Nm. These source mismatches do not prove every public torque value is wrong. Do not average or overwrite incompatible scopes.
8. **BMW 118d:** global BMW 150/320 and UK BMW 150/330 disagree. Resolve the Netherlands application before selecting a stock or tuned torque value. [BMW 2015 global 1 Series technical document](https://www.press.bmwgroup.com/global/article/attachment/T0200199EN/302716) (2026-10-04; search-index); [BMW UK 2015 1 Series announcement](https://www.press.bmwgroup.com/united-kingdom/article/detail/T0200962EN_GB/the-bmw-1-series-for-2015) (2026-10-04; search-index).
9. **Focus ST:** early/facelift 250/360 references show 270/430 and 265/440. They are not a fully matched basis for current 285/430. Confirm period, calibration, fuel and hardware independently. [Ford Focus ST EU specification](https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf) (2026-10-04; search-index); [BR-Performance NL FocusIII ST250](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/1124-mk3-2010-2014/1141-st-2-0t-ecoboost/) (2026-10-04; search-index).
10. **Leon Cupra 300:** tuner stock 380 versus public 400 and Simos evidence justify split/correction review. Matched 350/460 references do not validate current 365/480 or 425/540 Stage 2. Factory confirmation remains missing. [VAGTechniek Leon5F Cupra300](https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/) (2026-10-04; search-index); [AutoTuner EA888/Simos 18.x](https://us.autotuner.com/blogs/news/at-one-coverage-expansion-continental-simos-18-x-for-vag) (2026-10-04; search-index).
11. **A45:** separate pre-facelift 360/450 from facelift 381/475 and W177. Retained 400/540 and 410/530 are third-party estimates. Exact pre-facelift factory/ECU mapping is incomplete; a tool row for 381 hp is not proof of the 360 hp unit. [AutoTuner Mercedes compatibility](https://us.autotuner.com/pages/manufacturer/1-mercedes) (2026-10-04; search-index).
12. **X3 E83:** current 177/350 with M47/EDC16 needs correction review. Manufacturer describes a new four-cylinder 177 hp diesel and manual/six-speed automatic, without an exact engine code. Investigate N47 mapping without asserting a suffix or ZF8HP. [BMW X3 model-year 2008 new diesel](https://www.press.bmwgroup.com/global/article/detail/T0011997EN/bmw-x3-best-seller-now-even-more-powerful-and-efficient-bmw-efficientdynamics-in-the-2008-model-year%3A-bmw-x3-2-0d-with-new-four-cylinder-diesel-engine-optional-six-speed-automatic-transmission-fuel-saving-technologies-on-all-variants-of-the-world-s-most-successful-sav-in-the-premium-segment?language=en) (2026-10-04; search-index); [AutoTuner EDC17CP02 compatibility](https://us.autotuner.com/pages/ecu/bosch-edc17cp02-tc1766) (2026-10-04; search-index).

## ECU, TCU and output evidence

The ECU file covers the 18 batch candidates plus top-20 gaps. Each row records model/generation/output, supported code, manufacturer/family/variant/MCU, access methods, transmission/TCU, confidence and source IDs. Every tool claim is **application evidence, not installed-unit confirmation**. Historical FLEX v4.8.0.0 rows require a current protocol check; duplicate/conflicting entries do not justify selecting a convenient variant. [Magic Motorsport FLEX vehicle list v4.8.0.0](https://www.magicmotorsport.com/wp-content/uploads/2020/06/Vehicle-List-Software-Flex-ECU-OBD-Bench-ver.4.8.0.0.pdf) (2026-10-04; page).

Separate Simos 18.x GTI/R/Cupra from Golf 8 Simos 19.6. Diesel EDC17C64/C74, PCR2.1, DCM6.2V and MD1 applications are distinct. Keep DQ200/250/381/500 separate from longitudinal DL382/501. F40 128ti's eight-speed Steptronic does not prove F20-style ZF8HP fitment. [AutoTuner Simos 19.6](https://www.autotuner.com/blogs/news/continental-simos19-6) (2026-10-04; page); [AutoTuner One VAG TCU support](https://us.autotuner.com/blogs/news/autotuner-one-now-supports-tcu-flashing-vag-dq-dl-platfo) (2026-10-04; page); [BMW128ti factory stock](https://www.press.bmwgroup.com/united-kingdom/article/attachment/T0318330EN_GB/507436) (2026-10-04; search-index).

Published Ford SID212/EVO OBD protocols and BMW software-dependent patches make blanket access assumptions unsafe. Identify the ECU and software/build, then check the current tool/subscription. Registration year never proves installed ECU, TCU or lock status. [Alientech KESS3 update 3.32, 2026-07-08](https://www.alientech-tools.com/en/upgrade-3-32/) (2026-10-04; search-index); [Magic Motorsport SID212/SID212EVO](https://www.magicmotorsport.com/en/flex-bench-and-obd-for-ford-continental-sid212-and-sid212evo/) (2026-10-04; search-index); [AutoTuner BMW DME8 OBD patch](https://www.autotuner.com/blogs/news/bmw-dme8-improved-obd-unlock-patch) (2026-10-04; page).

Performance evidence keeps original stock configuration, generation, fuel, hardware, provider, URL and retrieval date. Stage 1/2/3 are evaluated separately; source spreads do not create averaged targets or increasing stage ladders. Six supplemental P1 configurations cover A3, Golf diesel, Polo, 520d and Octavia.

Several configurations still lack two compatible Stage 1 references. Exact targets stay withheld where stock scope, fuel or generation conflicts remain. Provider Normal/Xtreme and Stage 1+ are not relabelled Stage 2. Stage 2 needs its own parts list, fuel and gearbox review.

VAGTechniek's GTI 460/550 Stage 3 lists hybrid turbo, intake, sensors and DSG software. It is recorded as a scoped provider comparison, not a NoordTune target or recommendation for road use. Most other Stage 3 figures lack a validated package here and remain **ON REQUEST**. No DPF/EGR/AdBlue/SCR deletion product is recommended. [VAGTechniek Golf7 GTI Performance230](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7-/2.0-tsi-gti-performance-230pk/) (2026-10-04; page).

## Dutch pricing findings

Current conditional schedules: classic €299/449/699; 2010s €399/549/799; modern €449/599/899; higher complexity €549/699/999; advanced Stage 1 budget from €700 with later stages individual. Reviewed public assignments can override them, commonly €449/549/849. Unsupported Stage 3 remains an individual request. Compare actual `quote.amountCents` and scope; legacy `StageDefinition.price` is not the runtime selling price.

BR Nederland lists VAT-inclusive Stage 1 prices of GTI €650, R €690, Focus ST €650, GTD €650 and M140i €890 with individual dyno calibration. Unlimited Normal B47/A4/XC60 observations are €399 inclusive VAT with dyno options. NoordTune €399 is normal-market for comparable software scope. €449/549 can appear competitive-low against full-dyno packages, but service equivalence remains unproven. [BR-Performance NL GTI Performance230](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/5106-gti-performance-2-0-tsi/) (2026-10-04; search-index); [BR-Performance NL Golf7 R300 pre-facelift](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-vii-2012-2017/7593-r-2-0-tsi/) (2026-10-04; search-index); [BR-Performance NL FocusIII ST250](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/1124-mk3-2010-2014/1141-st-2-0t-ecoboost/) (2026-10-04; search-index); [BR-Performance NL Golf7 GTD184](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-golf-vii-mk1-2012-2017/5833-2-0-tdi-cr-gtd/?stage=4770) (2026-10-04; search-index); [BR-Performance NL M140i340](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/5-bmw/508-serie-1/7080-f2x-lci-2015/8598-m140i/?stage=7455) (2026-10-04; search-index); [Unlimited BMW320d F30/F31](https://www.unlimitedtuning.nl/chiptuning-bmw-320d-f30-f31-190-pk.html) (2026-10-04; search-index); [Unlimited Audi A4B9 TDI190](https://www.unlimitedtuning.nl/chiptuning-audi-a4-b9-2-0-tdi-190-pk.html) (2026-10-04; search-index); [Unlimited XC60 D5 220](https://www.unlimitedtuning.nl/chiptuning-volvo-xc60-2015-2-4-d5-220-pk.html) (2026-10-04; page).

Important unequal scopes:

- BR GTI Stage 2 from €2,825 includes sport-catalyst exhaust, intake and dyno calibration; it is not equivalent to NoordTune's €549 software quote. [BR-Performance NL GTI Performance Stage2](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2968-golf/5104-golf-vii-mk1-2012-2017/5106-2-0-tsi-gti-performance/?stage=5216) (2026-10-04; search-index).
- VAG limited TCU Stage 1 add-on €49, Stage 2 add-on €199 and standalone Stage 2 €399 differ from NoordTune TCU from €249. VAG 1.5 TSI €799 includes walnut cleaning. [VAGTechniek Golf7 GTI Performance230](https://www.vagtechniek.nl/chiptuning/volkswagen/golf/7-/2.0-tsi-gti-performance-230pk/) (2026-10-04; page); [VAGTechniek1.5TSI combined service](https://www.vagtechniek.nl/1-5-tfsi-optimalisatie-tuningspakket/) (2026-10-04; search-index).
- JD's €699 is an index observation for other 2.0 TSI outputs; software VAT is unclear and direct access returned HTTP 418. Its €200 custom-dyno supplement is not a total GTI 230 quote. [JD Engineering 2.0TSI180/220](https://www.jdengineering.nl/2-0-tsi-180-220pk/) (2026-10-04; search-index); [JD Engineering Golf generations custom surcharge](https://www.jdengineering.nl/golf-generaties/) (2026-10-04; search-index).
- Shiftech €559/759 is a European application comparator, not a verified Dutch branch quote; hardware inclusion is incomplete. [Shiftech X3 E83 177](https://www.shiftech.eu/en/chiptuning/car/bmw/x3/2003-e83/diesel/20d-177) (2026-10-04; search-index).

**Keep current prices.** Define VAT, dyno/logging, custom calibration, TCU, access/unlock and hardware inclusions before any future adjustment. This sample cannot establish a whole-market under-market or premium verdict.

## Exact first implementation batch

| ID | Type | Configuration | Stock pk / Nm | Engine boundary / unresolved gate |
| --- | --- | --- | --- | --- |
| c01 | correction | BMW 320d — F30/F31 LCI | 190 / 400 | B47 family; FLEX candidate B47D20A; confirm suffix |
| c02 | correction | Volkswagen Golf GTI Performance — Golf 7 pre-facelift | 230 / 350 | CHHA supported application; confirm ECU ID |
| c03 | correction | BMW 320i — G20/G21 EU launch variant | 184 / 300 | B48 family; exact suffix and ECU unknown |
| c04 | correction | Volkswagen Golf R — Golf 7 pre-facelift | 300 / 380 | CJXC tool application candidate; identify fitted ECU |
| c05 | correction | Audi A4 — B9 early | 190 / 400 | EA288 family candidate; suffix/ECU mapping required |
| c06 | correction | Volkswagen Passat — B8 pre-facelift | 150 / unresolved | Stock torque320 vs current340 conflict; confirm exact output/code |
| c07 | correction | Ford Focus ST — Mk3 2.0 petrol | 250 / 360 | R9DA tool-supported candidate; R9DB/DC/DD differs |
| c08 | correction | Volvo XC60 D5 AWD — XC60 I | 220 / 440 | D5244T20 manufacturer; exclude D5244T22 220/420 |
| c09 | correction | BMW 118d — F20/F21 LCI EU candidate | 150 / unresolved | Global320Nm vs UK330Nm conflict; require NL type data |
| c10 | correction | SEAT Leon Cupra — 5F facelift 300 non-OPF candidate | 300 / 380 | Exact code/gearbox missing; do not inherit GolfR300/400 |
| c11 | correction | Mercedes-Benz A45 AMG — W176 pre-facelift | 360 / 450 | M133 family; suffix not established; separate381/475 facelift and W177 |
| c12 | correction | BMW X3 2.0d — E83 177hp configuration | 177 / 350 | REMOVE unsupported M47 exact label; investigate N47 mapping without asserting suffix |
| e01 | expansion | Volkswagen Golf GTD — Golf 7 pre-facelift | 184 / 380 | CUNA tool application; keep DGCA Golf7.5 separate |
| e02 | expansion | Volkswagen Transporter — T6 pre-T6.1 | 150 / unresolved | 320/340/360 stock-torque disagreements; resolve factory code/transmission before publication |
| e03 | expansion | Ford Transit Custom — I facelift2 reference2019-2022 | 105 / 360 | Exact engine/ECU ID required; SID211/212 are protocol candidates not year assignment |
| e04 | expansion | Ford Transit Connect — II pre-facelift TDCi | 100 / 250 | TDCi confirmation required; 2018 first admission cannot distinguish EcoBlue |
| e05 | expansion | BMW 128ti — F40 | 265 / 400 | Manufacturer output confirmed; suffix/ECU build/software needed |
| e06 | expansion | BMW M140i — F20/F21 2016-2017 non-PP | 340 / 500 | B58 family; original DME vs later MG1 mapping required |

**c01–c12 are P0 corrections. e01–e06 are P0 expansion candidates.** The backlog gives Stage 1/2/3 and pricing actions, ECU/TCU evidence requirements, existing/new public status, synthetic fixtures and sibling reuse for every configuration. Keep prices and unsupported Stage 3 on request. T6, 118d, Passat and several output/tool scopes remain research-gated.

Connect remains conditional without confirmed TDCi/EcoBlue evidence. An admission date cannot resolve engine generation. 128ti stays scoped to 265/400 and its RON98 reference; M140i excludes PP and unrelated 340i calibrations. Expansion priority reflects commercial/reuse opportunities, not demonstrated high Dutch search volume.

## Sources and eight artifacts

External evidence uses source IDs resolving to the central `sources` registry in `dutch-chiptuning-keyword-demand.json`. It records name, URL, retrieval date, method and limitations. Fresh 2026-10-04 page/index observations are separate from inherited September observations inspected now. Provider count is not proof of independent measurement. Owner GSC's URL is the product entry point, not an authenticated data receipt.

- [DUTCH_CHIPTUNING_DEMAND_CATALOG_V1.md](DUTCH_CHIPTUNING_DEMAND_CATALOG_V1.md)
- [dutch-chiptuning-keyword-demand.json](dutch-chiptuning-keyword-demand.json)
- [demand-vs-current-coverage.json](demand-vs-current-coverage.json)
- [top-family-technical-quality.json](top-family-technical-quality.json)
- [top-family-ecu-tcu-evidence.json](top-family-ecu-tcu-evidence.json)
- [top-family-performance-evidence.json](top-family-performance-evidence.json)
- [dutch-pricing-market.json](dutch-pricing-market.json)
- [catalog-priority-backlog.json](catalog-priority-backlog.json)

## Integrity validation

- PASS: seven JSON files parsed; 102 source registry entries and all 581 checked source references resolve to a name, HTTPS URL and retrieval date.
- PASS: 44 demand clusters, 20 unique top ranks, 24 public records with 18 technical dimensions, 72 vehicle URLs and 216 stage URLs; 18 batch IDs comprise 12 corrections and six expansions.
- PASS: every monthly volume and total weighted score stays null; unknown visibility is not imputed. No tool row claims an installed ECU/TCU or lock status. All 24 unsupported public Stage 3 numeric presentations are withheld and quotes are on request.
- PASS: current normalized profile fingerprint matches the inherited receipt. Synthetic coverage was not rerun and no fresh live RDW, authenticated GSC or production smoke result is claimed.
- PASS: known private-identifier scan and review of the constructed artifacts found no owner registration plates. No RDW owner rows or registrations were copied into the research files. Emissions deletion is not recommended.
- PASS: staged tracked diff against origin/main contains exactly the eight listed docs/audits files. No source, message, catalog, pricing, SEO, dependency or deployment file changes. git diff --cached --check passed.
- Pre-commit HEAD and origin/main both equal the exact baseline SHA. No product test suite was rerun because the change is research documents only.

## Stop boundary

Only the eight audit files changed. Runtime, catalog, tuning figures, pricing, SEO, routes, internal links, messages, dependencies, deployment configuration and production remain untouched. PR #12 and noordtune-www were not modified. Draft research PR only; no merge or implementation.

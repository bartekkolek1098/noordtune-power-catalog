# Tuning output, identity and draft pricing — corrective local review

## Local delivery and preserved scope

This corrective change supersedes the blanket restrictions in commit `b19a1c21ab53f505476723519d6feeaca9b74916`. The approved visual and source-data baseline remains `4d12e510953fb57c3f8f84a737880ff860a617e7`.

- Workspace: `C:\Users\barto\Desktop\noordtune-power-catalog`.
- Existing branch: `fix/tuning-identity-year-quote-policy`; HEAD verified as `b19a1c21ab53f505476723519d6feeaca9b74916` before editing.
- No applicable AGENTS.md in the workspace or its ancestors. Initial untracked `.next/` and `node_modules/` were preserved. The generated TypeScript build-info file was returned to its initial tracked content after checks; it contains no implementation change. No unrelated tracked changes were present.
- No new branch/worktree, reset, dependency installation, upgrade or lockfile change. The existing temporary archive of the visual baseline is reused for screenshots.
- No push, PR, merge or deployment. PR #12 and `noordtune-www` remain untouched.
- Git author name/email are not configured. The previous authorization was for one earlier commit only. These corrective changes are **ready to commit** after completed QA; no corrective commit was created and no author identity is saved or reused.

## Actual cause and correction

The first fix made a strict catalog relationship serve as the prerequisite for several independent product decisions. `PlateLookup` took all Stage figures from `result.tuningMatch.variant`. The matcher deliberately withheld that variant for generated applicability and generation boundaries. Consequently, compatible estimates disappeared with the chart, recommendation and details action. Separately, `resolveStageQuote` rejected ambiguous/conflict status, generated provenance, unreviewed configurations and pending ECU access. That reduced numerical public pricing from 24 to six configurations. Missing exact confirmation became missing customer-facing output.

The corrective architecture has four independent decisions:

| Decision | Implementation | Meaning |
| --- | --- | --- |
| Official identity | `normalizeRdwVehicle`, strict RDW date parser | Preserve make/model, fuel, displacement, registered power, first admission and separate first Dutch registration. |
| Applicable estimate | Server-side `resolveTuningEstimate`; selected `TuningEstimateProfile` DTO | Match manufacturer, model/engine family, established generation, fuel, displacement, stock power and year context. Preserve existing estimates and requirements; allow explicitly conditional profiles. |
| Physical ECU/access | `assessVehicleAccess` | Unknown or possible unlock review remains a verification state. It does not erase catalog figures or diagnose an installed lock. |
| Commercial estimate | `resolveStageQuote` plus `addQuoteOptions` | Resolve an explicitly assigned draft scenario, including its scope and integer-cent option total. It does not promote a technical profile to verified. |

`RdwLookupResult` now contains `tuningEstimate` alongside the existing strict `tuningMatch`. The UI consumes the estimate profile for figures, Stages, chart, recommendations and details. Commercial on-request states leave available power data visible. Public vehicle/Stage pages use the client-safe adapter of the same profile; selector, recommendation, calculator, WhatsApp and structured Offers use the same commercial resolver. Only the selected profile is returned to the browser; the reference/canonical resolver remains on the server. The three references are available through both quick search and brand/model/year/engine selection. Their details open inline using the same profile, chart, quote, options and WhatsApp helpers. A manual model-year selection does not fabricate an RDW identity or a first-admission date.

The hard identity checks remain: Transit Custom/Connect/generic Transit are separate; 1.5/1.6/2.0/2.2, petrol/diesel, materially different power and established generations are not interchangeable. Equivalent source/year copies collapse; different output configurations remain ambiguous. Missing catalog coverage is described calmly as an unavailable applicable profile, without customer-facing “configuratieconflict”.

## All 24 before/after states

All 24 retain their baseline stock peaks and all **72 numeric Stage results**, requirements and package items. All 24 receive explicit numerical draft **family software** prices. Compatible synthetic lookup coverage changes from seven to 24; public prices change from six numerical / 18 on request to 24 numerical. The before figures distinguish the approved baseline from the immediately previous restrictive commit.

| Public configuration | Stock hp/Nm | Stage 1 / 2 / 3 hp,Nm (unchanged) | Baseline € S1/S2/S3 | Previous local S1/S2/S3 | Corrected draft S1/S2/S3 | Lookup numeric before→after | Category / ECU state | Provenance | Remaining limitations |
|---|---:|---|---|---|---|---|---|---|---|
| vw-golf-20-tsi-ea888 | 230/350 | 300,450 / 335,500 / 430,560 | 349/499/849 | €349/€499/€849 | €449/€549/€849 | yes→yes | contemporary-standard / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| bmw-320d-b47 | 190/400 | 225,470 / 245,520 / 280,600 | 299/449/699 | request/request/request | €449/€549/€849 | yes→yes | contemporary-standard / possible-unlock-review | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| audi-a3-20-tdi | 150/340 | 185,410 / 205,455 / 240,520 | 299/449/699 | €299/€449/€699 | €449/€549/€849 | yes→yes | contemporary-standard / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| mercedes-a45-amg-m133 | 360/450 | 400,520 / 430,560 / 500,640 | 399/549/999 | €399/€549/€999 | €549/€699/€999 | yes→yes | higher-complexity / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| bmw-x3-e83-20d | 177/350 | 214,420 / 228,455 / 255,520 | 299/449/699 | €299/€449/€699 | €299/€449/€699 | yes→yes | classic-standard-diesel / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| volvo-xc60-d5 | 220/440 | 255,520 / 275,560 / 305,620 | 349/499/849 | €349/€499/€849 | €449/€549/€849 | yes→yes | contemporary-standard / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| ford-focus-st-20-ecoboost | 250/360 | 285,430 / 315,470 / 380,540 | 349/499/849 | €349/€499/€849 | €449/€549/€849 | yes→yes | contemporary-standard / unknown | Existing curated family estimate | ECU/setup/hardware check; existing family estimate, not a physical ECU identification |
| bmw-1-series-f20-f21-118i | 136/220 | 165,260 / 195,300 / 230,340 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified; 1499 cc scope; earlier 1598 cc excluded |
| bmw-1-series-f20-f21-118d | 150/330 | 180,390 / 200,440 / 230,490 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| bmw-1-series-f20-f21-120d | 190/400 | 230,470 / 255,530 / 290,590 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| bmw-3-series-f30-f31-318d | 150/320 | 180,380 / 200,420 / 230,470 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| bmw-3-series-f30-f31-330d | 258/560 | 310,660 / 345,740 / 390,830 | 299/449/699 | request/request/request | €549/€699/€999 | no→yes | higher-complexity / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| bmw-5-series-f10-f11-520d | 190/400 | 230,470 / 255,530 / 290,590 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| bmw-3-series-g20-g21-320i | 184/270 | 225,320 / 260,370 / 315,420 | 299/449/699 | request/request/request | €549/€699/€999 | no→yes | higher-complexity / possible-unlock-review | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified; source stock 270 Nm versus manufacturer 300 Nm; source/gains review |
| volkswagen-golf-7-16-tdi | 115/250 | 140,300 / 155,330 / 175,370 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| volkswagen-golf-7-20-tdi | 150/340 | 180,400 / 200,450 / 230,500 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| volkswagen-golf-7-r-20-tsi | 300/400 | 365,480 / 425,540 / 510,620 | 399/549/999 | request/request/request | €549/€699/€999 | no→yes | higher-complexity / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| volkswagen-passat-b8-20-tdi | 150/340 | 180,400 / 200,450 / 230,500 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| audi-a3-8v-16-tdi | 116/250 | 140,300 / 155,330 / 175,370 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| audi-a4-b9-20-tdi-190 | 190/400 | 230,470 / 255,530 / 290,590 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| audi-a4-b9-20-tfsi | 252/370 | 305,440 / 360,500 / 430,570 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| audi-a6-c7-30-tdi-272 | 272/600 | 325,710 / 365,790 / 415,890 | 299/449/699 | request/request/request | €549/€699/€999 | no→yes | higher-complexity / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| skoda-octavia-5e-20-tdi-150 | 150/340 | 180,400 / 200,450 / 230,500 | 299/449/699 | request/request/request | €449/€549/€849 | no→yes | contemporary-standard / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |
| seat-leon-cupra-5f-20-tsi-300 | 300/400 | 365,480 / 425,540 / 510,620 | 399/549/999 | request/request/request | €549/€699/€999 | no→yes | higher-complexity / unknown | Published canonical/generated estimate | ECU/setup/hardware check; published generated estimate, not verified |

Every price is VAT-inclusive and indicative. “Unknown” means installed ECU unidentified; “possible unlock review” does not mean a confirmed lock. Public family amounts describe the least expensive applicable software configuration. A lookup can display a differently scoped advanced-unlock package budget. Complete executable provenance and reasons: [all-24 JSON](docs/tuning-qa/corrective-all24-before-after.json), [all-24 table](docs/tuning-qa/corrective-all24-before-after.md). Reproduce with `node --no-warnings scripts/report-tuning-coverage.ts`.

## Proposed commercial assignments for local owner review

These are proposed NoordTune figures, not externally verified market prices or newly approved production prices. Historical canonical/source prices and Pricing V2 tier metadata remain unchanged; the active draft resolver does not use them as fallbacks.

| Explicit category | Stage 1 | Stage 2 software | Stage 3+ software | Assigned scope |
| --- | ---: | ---: | ---: | --- |
| Classic standard diesel | €299 | €449 | €699 | X3 E83 2.0d: individually scoped established diesel calibration. |
| Contemporary standard | €449 | €549 | €849 | Explicitly listed road-car/diesel software configurations below. |
| Higher complexity | €549 | €699 | €999 | A45 M133, Golf R, Cupra 300, BMW 330d, G20 320i, A6 3.0 TDI 272; individual performance/platform/high-torque scope. |
| Applicable advanced unlock | €700 package budget | On request | On request | BMW 128ti reference and explicitly applicable BMW plate-specific advanced-unlock scenarios. |

| Public configuration | Draft category | Reason |
| --- | --- | --- |
| vw-golf-20-tsi-ea888 | contemporary-standard | Golf 7 GTI EA888: explicitly scoped standard performance-road-car software calibration. |
| bmw-320d-b47 | contemporary-standard | F30/F31 B47 320d: family software starting scenario; mixed ECU labels require identification, not suppression. |
| audi-a3-20-tdi | contemporary-standard | A3 8V 2.0 TDI: explicitly scoped contemporary diesel calibration. |
| mercedes-a45-amg-m133 | higher-complexity | A45 AMG M133: explicitly assigned high-output performance calibration scope. |
| bmw-x3-e83-20d | classic-standard-diesel | X3 E83 2.0d: individually assigned established EDC16-family diesel calibration; the category does not prove physical ECU access. |
| volvo-xc60-d5 | contemporary-standard | XC60 D5: individually scoped multi-cylinder road-diesel calibration. |
| ford-focus-st-20-ecoboost | contemporary-standard | Manual Focus ST 2.0 EcoBoost: standard road-performance software scope; no TCU included. |
| bmw-1-series-f20-f21-118i | contemporary-standard | F20/F21 118i: explicit family software scope despite estimated source provenance. |
| bmw-1-series-f20-f21-118d | contemporary-standard | F20/F21 118d: explicit family diesel software scope; physical ECU still checked. |
| bmw-1-series-f20-f21-120d | contemporary-standard | F20/F21 120d: explicit family diesel software scope; physical ECU still checked. |
| bmw-3-series-f30-f31-318d | contemporary-standard | F30/F31 318d: explicit family diesel calibration proposal. |
| bmw-3-series-f30-f31-330d | higher-complexity | F30/F31 330d: individually assigned six-cylinder high-torque calibration scope. |
| bmw-5-series-f10-f11-520d | contemporary-standard | F10/F11 520d: explicit family diesel calibration proposal. |
| bmw-3-series-g20-g21-320i | higher-complexity | G20/G21 320i: individually assigned newer-platform calibration scope; advanced unlock not included in family software price. |
| volkswagen-golf-7-16-tdi | contemporary-standard | Golf 7 1.6 TDI: explicit model-engine software scenario. |
| volkswagen-golf-7-20-tdi | contemporary-standard | Golf 7 2.0 TDI: explicit model-engine software scenario. |
| volkswagen-golf-7-r-20-tsi | higher-complexity | Golf 7 R 2.0 TSI: individually assigned high-output all-wheel-drive performance calibration scope. |
| volkswagen-passat-b8-20-tdi | contemporary-standard | Passat B8 2.0 TDI: explicit model-engine software proposal. |
| audi-a3-8v-16-tdi | contemporary-standard | A3 8V 1.6 TDI: explicit model-engine software proposal. |
| audi-a4-b9-20-tdi-190 | contemporary-standard | A4 B9 2.0 TDI 190: explicit model-engine software proposal. |
| audi-a4-b9-20-tfsi | contemporary-standard | A4 B9 2.0 TFSI: explicit model-engine software proposal. |
| audi-a6-c7-30-tdi-272 | higher-complexity | A6 C7 3.0 TDI 272: individually assigned six-cylinder high-torque calibration scope. |
| skoda-octavia-5e-20-tdi-150 | contemporary-standard | Octavia 5E 2.0 TDI 150: explicit model-engine software proposal. |
| seat-leon-cupra-5f-20-tsi-300 | higher-complexity | Leon Cupra 300: individually assigned high-output performance calibration scope. |

Transit Custom 2.0 EcoBlue 105 is explicitly assigned €549 Stage 1 for its commercial-vehicle/torque-management calibration scope; Transit Connect 1.5 TDCi 100 is €449 for the stated TDCi reference. Their Stage 2/3 prices remain on request because those references establish no such commercial or output scope.

Ordinary family/vehicle estimates cover software calibration. Required hardware and advanced unlocking are separately assessed; no fictional inclusive hardware total is implied. Every numerical higher-stage family price is at least its Stage 1 price. A possible/confirmed expensive unlock never falls back to €299. The €700 figure is a conditional **Stage 1 package budget**, not €700 added automatically to another base. Selected compatible options are added once in integer cents; for example €700 + €149 = €849. A genuinely on-request base stays on request after option selection, with selections retained and no option subtotal presented as the whole job price.

BMW family examples: 320d software from €449 and G20 320i software from €549; the corresponding plate-specific possible-unlock scenario is a prominently labeled package budget from €700. If standard access is positively identified, the applicable ordinary software estimate can remain. A broad model/ECU label alone never claims every ECU is locked. Advanced-unlock Stage 2/3 stays on request while existing Stage output remains visible.

Service definitions, prices and compatibility are unchanged, including standalone eligible TCU work at €249. There are no bundles or automatic paid-option selections. Manual Focus ST still excludes TCU work. Reference profiles follow existing fuel eligibility; unknown transmission does not enable TCU.

## BMW and Ford examples and sources

Official minimal RDW facts were retrieved on 2026-09-15 at 09:52:43 UTC from [vehicle resource](https://opendata.rdw.nl/resource/m9d7-ebf2.json) and [fuel resource](https://opendata.rdw.nl/resource/8ys7-d773.json); schema was inspected at 09:52:24 UTC. See [RDW provenance](docs/tuning-qa/rdw-provenance.json). Added reference research was retrieved on 2026-09-15; each profile records source type, URL, scope and page/search-index retrieval method. No third-party plate lookup was used.

| Example | Official first admission / separate first NL date | Official identity | Stock reference | Indicative Stage 1 | Draft Stage 1 scope |
| --- | --- | --- | --- | --- | --- |
| BMW 128ti | 2022-09-14 / 2026-05-29 | BMW 128TI; petrol; 1998 cc; 195 kW ≈265 pk | 265 pk / 400 Nm | 310 pk / 480 Nm, RON98 | From €700 conditional advanced-unlock package budget |
| Transit Custom | 2019-04-29 / 2019-04-29 | FORD TRANSIT CUSTOM; diesel; 1995 cc; 77 kW ≈105 pk | 105 pk / 360 Nm | 190 pk / 440 Nm; reference generation to confirm | From €549 software indication |
| Transit Connect | 2018-10-17 / 2018-10-17 | FORD TRANSIT CONNECT; diesel; 1499 cc; 73.5 kW ≈100 pk | Conditional TDCi reference: 100 pk / 250 Nm | Conditional pre-facelift TDCi: 125 pk / 330 Nm | From €449 for that conditional TDCi profile |

- BMW manufacturer stock reference: [BMW 128ti announcement](https://www.press.bmwgroup.com/united-kingdom/article/detail/T0318330EN_GB/the-new-bmw-128ti). Stage 1: [Mosselman 128ti F40](https://www.mosselmanturbo.com/nl/bmw-128ti-f40-265hp), 310 pk / 480 Nm on RON98. Its Stage 2 headline/body disagree about torque, so neither Stage 2 nor Stage 3 was invented here.
- Custom: [Ford manufacturer brochure](https://www.ford.ie/content/dam/guxeu/ie/Documents/Brochures/CVs/BRO-New_transit_custom.pdf), 105 PS /77 kW and 360 Nm; [BR-Performance 2.0 EcoBlue 105](https://www.br-performance.be/fr-be/reprogrammation/1-voitures/23-ford/12695-transit-custom/14309-i-facelift-2-2019-2022/23049-2-0-ecoblue/), 190 pk /440 Nm for the listed 2019–2022 reference. SID211 remains owner-reported only and is not output as an identified ECU.
- Connect: [Ford 2015 TDCi announcement](https://media.ford.com/content/fordmedia/feu/gb/en/news/2015/06/01/ford-delivers-class-leading-fuel-efficiency--segment-first-techn.html), 100 PS /250 Nm; [BR-Performance 1.5 TDCi](https://www.br-performance.be/nl-be/chiptuning/1-wagens/23-ford/12693-transit-connect/14273-ii-2013-2018/22985-1-5-tdci/), 125 pk /330 Nm. [Ford's July 2018 EcoBlue announcement](https://media.ford.com/content/fordmedia/feu/gb/en/news/2018/07/06/new-ford-transit-connect-cuts-fuel-bills-for-operators-by-up-to-.html) establishes the engine transition. Registration in October 2018 cannot choose between these engines. The UI explicitly conditions the TDCi figures on engine-generation confirmation; an explicitly identified EcoBlue never receives this TDCi estimate.

These are manufacturer stock specifications and third-party tuner peak estimates, not NoordTune measurements. No source price, guarantee, image or measured curve was copied. The chart remains in the approved layout and is labeled as a **catalog illustration of peak values**, not a dyno measurement or RPM curve. Missing Stage 2/3 values remain missing independently, with their controls retained. Reference configurations use expandable inline details with sources, requirements and package information; public profiles retain a valid public-page action.

WhatsApp preserves detected RDW identity, displacement, registered power, first admission/year, selected Stage, available indicative output, chosen options, matching indicative price or package budget, and final verification text. No message was sent. Sanitized executable examples: [RDW/quote/WhatsApp results](docs/tuning-qa/corrective/rdw-result-examples.json).

## Remaining individual limitations

1. **2018 Transit Connect:** actual TDCi versus EcoBlue engine generation is not established by the RDW facts. TDCi figures are explicitly conditional. An identified EcoBlue has no applicable sourced estimate in this small layer.
2. **BMW 118i F20/F21:** the public source is a 2016 template with a broad engine label. Lookup applicability is constrained to 1499 cc; the earlier 1598 cc /136 hp configuration is rejected rather than borrowing its figures. The public figure set remains visible with an individual engine-scope note. [BMW summer 2015 change](https://www.press.bmwgroup.com/poland/article/detail/T0221323PL/zmiany-specyfikacyjne-w-modelach-bmw-w-lecie-2015?language=pl).
3. **BMW G20/G21 320i:** the preserved catalog has 270 Nm stock torque, while the [BMW 2019 specification](https://www.press.bmwgroup.com/poland/article/attachment/T0297058PL/432766) lists 300 Nm. The UI flags this individual source discrepancy. This task deliberately retains source figures; a later source-data correction is needed. Catalog gains involving that stock torque remain provisional.
4. **References:** no adopted Stage 2/3 output or commercial scope; these Stages remain on request without suppressing Stage 1. Missing/conflicting identity, an unrepresented engine and genuinely unscoped custom work remain unavailable/on request.
5. **All public profiles:** source confidence stays estimated and physical ECU/software/transmission, vehicle condition and hardware remain subject to execution checks. No record was globally promoted to verified. Generation-boundary candidates can be conditional instead of silently choosing an exact configuration.
6. Existing audit warning groups are retained and reported: source ID/SEO collisions, broad or missing engine/ECU/TCU information, service manual review, placeholder media and canonical legacy price metadata. They are not silently treated as verified data.

## Actual QA and screenshots

| Check | Actual result |
| --- | --- |
| Catalog audit | PASS: zero critical groups; 18 existing warning groups retained. |
| Protected data | PASS: 24 public vehicles; 58,586 canonical vehicles; 175,758 canonical Stages; 291 sitemap URLs. Canonical data/source figures, public technical fields/routes and service definitions/prices pass the pinned semantic hashes. |
| Matcher tests | PASS: 18 executable cases, including hard identity conflicts and equivalent duplicates. |
| Independent estimate tests | PASS: 19 cases, including all 24 through the identity resolver, all 72 numeric Stages, the three references, scoped manual selection and rejection of wrong search qualifiers. |
| Quote tests | PASS: 20 cases covering all 24 policies, scope, unknown ECU, generated provenance, Stage ordering and integer-cent totals. |
| RDW identity tests | PASS: 17 cases; dates, import separation, official facts and numerical profile/WhatsApp results. |
| Consumer integration | PASS: 491 assertions across all 24 public profiles, selector, Stage Offers, options, WhatsApp and TCU eligibility. |
| Lint / typecheck | PASS: full project, including the manual reference UI. |
| Production build / browser bundle | PASS: Next.js 15.5.19 production build, 298 generated framework/application pages; built sitemap has 291 URLs. All three built reference/search APIs return HTTP 200 with matching figures/prices. The reference SEO URL correctly returns 404. All 25 browser JavaScript chunks (1,410,885 bytes) scanned: zero of 58,562 non-public canonical IDs found. |
| Responsive RDW comparison | PASS: 36 baseline/current pairs (72 lookup renders); BMW 128ti, GTI, Custom and Connect at 320, 360, 390, 430, 768, 1024 and 1440 px; BMW 320d, Golf R and Focus ST at 320/1440; BMW EN/PL at 320. Zero final overflow, internal vertical scrollbars or page errors. |
| Public browser coverage | PASS: 24/24 public profiles with stock/all Stage figures, chart and numerical family quote; eight detailed page/calculator checks and eight Stage/Offer checks. |
| Manual reference browser coverage | PASS: 14 cases: all three references at 320/1440 through quick search and cascading selection, plus Connect EN/PL at 320. Zero overflow or page errors; three Stage controls, option persistence, source details and accessible WhatsApp actions. |
| Local live RDW POST requests | PASS: HTTP 200 for all three examples, correct official dates/identity and their sourced Stage 1 estimates. Sanitized responses saved; no message sent. |

The visual comparison uses the same installed Chrome 152.0.7977.83 and deterministic sanitized RDW facts on both versions. Only the Next development overlay is hidden equally. The existing layout, grid, chart area and controls remain; additional labels and wrapping account for expected height changes. Baseline clipping is recorded rather than masked. Manual testing found an unwrapped choose button at 320 px; it now wraps without changing its action. Search testing found missing stock-power/generation tokens in reference discovery; explicit qualifiers are now tested positively and incompatible qualifiers are rejected. Preliminary manual failures were rerun after the fixes; the complete passing reports below describe the corrected behavior. The manual layout checker excludes the pre-existing absolute decorative background from its root scroll-width measurement while still checking content and document overflow. The pointer is moved off cards before measuring the intentional hover-arrow transform.

- [Baseline/current screenshot comparison](docs/tuning-qa/corrective/visual-comparison.html) and [comparison PNG](docs/tuning-qa/corrective/visual-comparison.png).
- [Visible reference figures, charts and prices](docs/tuning-qa/corrective/corrective-results.html) and [results PNG](docs/tuning-qa/corrective/corrective-results.png).
- Full screenshots: [BMW 128ti](docs/tuning-qa/corrective/final-bmw128ti-1440.png), [Transit Custom](docs/tuning-qa/corrective/final-transit-custom-1440.png), [Transit Connect](docs/tuning-qa/corrective/final-transit-connect-1440.png), [manual BMW at 320 px](docs/tuning-qa/corrective/manual-ref-bmw-128ti-f40-265-nl-search-320.png).
- [Production smoke results](docs/tuning-qa/corrective/production-smoke.json) and [browser-bundle check](docs/tuning-qa/corrective/browser-bundle-check.json). The built local preview is available at http://localhost:3100/nl.
- Machine-readable [responsive/public visual report](docs/tuning-qa/corrective/visual-report.json), [manual reference report](docs/tuning-qa/corrective/manual-reference-report.json), [live local API results](docs/tuning-qa/corrective/live-api-results.json) and [source research](docs/tuning-qa/TUNING_REFERENCE_RESEARCH.md).

The archived first-fix evidence remains in the parent QA folder; the corrected screenshots and live results are in the separate corrective folder.

## Reproduction

- `pnpm catalog:audit`
- `pnpm test:tuning` (matcher, independent estimate, quote, RDW identity and surface integration tests)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `node --no-warnings scripts/report-tuning-coverage.ts`
- `node --no-warnings scripts/test-rdw-identity.ts --baseline <existing-baseline-archive> --report docs/tuning-qa/corrective/rdw-result-examples.json`
- With local final and archived baseline servers: `node --no-warnings scripts/qa-tuning-visual.cjs`, then `node scripts/qa-tuning-contact.cjs`. These use existing Chrome and bundled Playwright; no browser/dependency installation.

Additional checks: `node --no-warnings scripts/check-tuning-build.ts` after the production build; `node --no-warnings scripts/qa-manual-references.cjs` against the running local site.

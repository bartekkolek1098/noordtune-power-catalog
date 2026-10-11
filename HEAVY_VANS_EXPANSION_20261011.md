# NoordTune heavy vans: Daily and Movano — 2026-10-11

Baseline production: `d3f69addf513f7cf3cd0e2e580af34f127de08ea` (PR61). Feature: `feature/heavy-vans-daily-movano-20261011`.

## Incremental coverage measured through the full customer pipeline

The unchanged **810-observation / 174-cell purpose-selected RDW sample** is NOT representative of the Dutch fleet. The previous runtime outputs were frozen before modifications in `data/research/heavy-vans-baseline-20261011.json`. No registration plates, VINs or customer identifiers are stored.

| Measure | Before | After | Net |
|---|---:|---:|---:|
| Source-linked ordinary Stage 1 | 426 | 532 | +106 |
| CITROEN / 270 observations | 156 | 156 | +0 |
| OPEL / 270 observations | 208 | 221 | +13 |
| IVECO / 270 observations | 62 | 155 | +93 |

Every prior source-linked outcome is retained. Movano improvements are counted only where the old full resolver lacked a result. This incremental +106 is separate from the cumulative report starting at281 before PR61; never present the cumulative gain as this release's new contribution. The separate 3,000-case historical denominator is not mixed with this sample.

## Engine identity and independently published ordinary Stage 1

| Family | Years | Original cc / kW | Source-original Nm, not RDW | Stage 1 indications | Exact name/type scopes |
|---|---|---|---:|---|---|
| Iveco Daily 2.3 diesel 156 / 114.6 kW · Euro 6 | 2017–2019 | 2287 / 114.6 | 350 | 185–185 PS / 410–420 Nm | 35S16/IS35SC2AA; 35S16/IS35SI2AA; 35C16/IS35CI2AA; 35C16/IS35CC2AA |
| Iveco Daily 2.3 diesel 156 / 115 kW · Euro 6Df/Dt | 2020–2023 | 2287 / 115 | 400 | 185–185 PS / 410–420 Nm | 35S16/IS35SC2AA; 35S16/IS35SI2AA; 35C16/IS35CI2AA; 35C16/IS35CC2AA |
| Iveco Daily 3.0 diesel 180 / 132 kW · Euro 6 | 2017–2019 | 2998 / 132 | 430 | 200–200 PS / 480–480 Nm | 35S18/IS35SC2AA; 35C18/IS35CI2AA; 35C18/IS35CC2AA |
| Iveco Daily 3.0 diesel 160 / 118 kW · Euro 6Df | 2020–2023 | 2998 / 118 | 380 | 200–200 PS / 420–440 Nm | 35C16/IS35CI2AA |
| Opel Movano 2.3 CDTI 150 / 110 kW · Movano B | 2019–2021 | 2299 / 110 | 385 | 210–210 PS / 480–480 Nm | MOVANO/MR; MOVANO/MS |
| Opel Movano 2.3 CDTI 180 / 132 kW · Movano B | 2019–2021 | 2299 / 132 | 400 | 210–210 PS / 480–480 Nm | MOVANO/MR |

All six engine families appear in **both manual selection and plate lookup**, backed by15 finite observed RDW scopes. Six separately written NL engine pages extend the existing model hubs: engine pages94→100, model-linked reviewed scopes114→129, sitemap368→374; van URLs120→126. Model hubs remain25, NOT a claim that every engine is covered.

## Actual source review

### Iveco Daily 2.3 diesel 156 / 114.6 kW · Euro 6

Only the four enumerated 35S16/35C16 name/type pairs,2287cc114.6kW2017-2019. Preserve the fractional original kW; do not round it into later115kW. EDC17 controller references do not identify the individual installed ECU. Source-original350Nm belongs to this older publication set; later Euro6Df400Nm is separate.

- [Powerconcept Daily 2016–2019 2.3 Euro 6 156](https://www.powerconcept.ma/reprogrammation/iveco/daily/2016-2019/160-23-eur-6-156hp) — 185 PS / 420 Nm. Explicit2016-2019 2287cc156PS/350Nm to ordinary Stage1 185PS/420Nm; no fuel-economy promise inherited.
- [JVK PRO Daily 2.3 Euro 6 156](https://jvkpro.lv/en/services/stage1/iveco/daily/160-2-3-eur-6-156hp) — 185 PS / 410 Nm. Daily2016+2.3 Euro6 156/350 to185/410, EDC17C49/C69; selected only for older bounded2017-19 generation.

### Iveco Daily 2.3 diesel 156 / 115 kW · Euro 6Df/Dt

Only listed35S16/35C16 RDW body/type pairs2287cc115kW2020-2023. Sources label emission phase Eu6Df versus Eu6Dt, both factory156PS/400Nm; precise homologation and ECU must be read on vehicle. Older114.6kW/350Nm publications and the2998cc3.0 are not substituted.

- [Powerconcept Daily 2019–2024 2.3 Euro 6Df 156](https://www.powerconcept.be/reprogrammation/iveco/daily/2019-2024/160-23-eur-6df-156hp) — 185 PS / 420 Nm. 2019-2024 2287cc156PS/400Nm Stage1 185PS/420Nm, explicitly later Euro6Df.
- [ECU-Soft Daily 2019–2024 2.3D Euro 6Dt 156](https://www.ecu-soft.be/chiptuning/iveco/daily/14203/2-3d-eu6dt-156-25771) — 185 PS / 410 Nm. Normally rendered source page156PS to185PS/410Nm; source labels Eu6Dt versus other publisher Eu6Df. No exact installed ECU inferred.

### Iveco Daily 3.0 diesel 180 / 132 kW · Euro 6

Only three listed35S18/35C18 type pairs,2998cc132kW2017-2019. Source-marketed180PS rounds179PS from RDW132kW. The later129kW/176 market name and Euro6Df/2020+ are different evidence scopes, not inherited. F1C/EDC17 source references are not an ECU readout.

- [Powerconcept Daily 2016–2019 3.0 Euro 6 180](https://www.powerconcept.ma/reprogrammation/iveco/daily/2016-2019/180-30-eur-6-180hp) — 200 PS / 480 Nm. 2016-2019 F1C2998cc180PS/430Nm ordinary Stage1 200PS/480Nm.
- [Remap Performance Daily 2016 3.0 Euro 6 180](https://www.remapperformance.com/chiptuning/iveco-daily-2016-180-3-0-eur-6-180cv/) — 200 PS / 480 Nm. Daily2016 onward F1C2998cc180CV/430Nm Stage1 200CV/480Nm, bounded here2017-2019; no supplier fuel-savings promises adopted.

### Iveco Daily 3.0 diesel 160 / 118 kW · Euro 6Df

Only observed35C16/IS35CI2AA2998cc118kW2020-2023, not35C16/2287cc115kW or malformedIS35C12AA. Same35C16 badge has distinct engine sizes; do not decode fuel/calibration from badge alone. Supplier420/440Nm conflict retained.

- [Powerconcept Daily 2019–2024 3.0 Euro 6Df 160](https://www.powerconcept.be/reprogrammation/iveco/daily/2019-2024/160-30-eur-6df-160hp) — 200 PS / 420 Nm. 2019-2024 2998cc160PS/380Nm Stage1 200PS/420Nm.
- [ECU-Soft Daily 2019–2024 3.0 Euro 6Df 160](https://www.ecu-soft.be/chiptuning/iveco/daily/14203/3-0d-eu6df-160-16031) — 200 PS / 440 Nm. Browser-rendered 2019-2024 3.0 Euro6Df160PS to200PS/440Nm; original380Nm from supplier literature, never RDW.

### Opel Movano 2.3 CDTI 150 / 110 kW · Movano B

Only MOVANO MR or MS2299cc110kW2019-2021, not Y2179/2184cc or older2017 2.3. Provider nominal2298cc versus RDW2299cc preserved. Publishers disagree about ECU generation (EDC17 versus SID), so no installed ECU or programming accessibility asserted.210/480 is a high supplier peak, not safe loaded-van torque approval.

- [Startuning Movano 2019–2021 2.3 CDTI 150](https://startuning.de/konfigurator/opel/movano/2019-2021/2-3-cdti-150-ps) — 210 PS / 480 Nm. Explicit2019-2021 Opel Movano150PS/385Nm to210PS/480Nm ordinary Stage1; source ECU claim not independently identified.
- [ECU-Soft Movano 2.3 CDTI150 from2019 to2021](https://www.ecu-soft.be/chiptuning/opel/movano/8976/2-3-cdti-2019-150-21261) — 210 PS / 480 Nm. Explicit2019-onward engine within2016-07/2021 model family,150PS to210PS/480Nm browser-rendered. First admission does not guarantee production date.

### Opel Movano 2.3 CDTI 180 / 132 kW · Movano B

Only MOVANO MR2299cc132kW2019-2021. RDW132kW rounds179PS; provider180 is marketing. Not125kW170, older120kW163,2.2newer180, unknownMS132kW or a Renault borrowed profile. Exact M9T/ECU and mechanical condition require inspection.

- [Startuning Movano 2019–2021 2.3 CDTI180](https://startuning.de/konfigurator/opel/movano/2019-2021/2-3-cdti-180-ps) — 210 PS / 480 Nm. 2019-2021 Opel Movano180PS/400Nm ordinary Stage1 210PS/480Nm.
- [ECU-Soft Movano 2019–2021 2.3 CDTI180](https://ecu-soft.be/chiptuning/opel/movano/8976/2-3-cdti-2019-180-21263) — 210 PS / 480 Nm. Normally rendered source180PS to210PS/480Nm in2019-onward engine and bounded2016-07/2021 model. No guaranteed gearbox rating.

The source audit records successful normal-browser fetches plus HTML/rendered SHA256 hashes for all used pages. Dynamic placeholders were not treated as numbers. A rejected BR-Performance403 and two insufficiently year-scoped176PS pages remain audit records only; they do not support a published new application.

## Preserved boundaries and deliberate holds

- Daily114.6kW/2017–19 and115kW/2020–23 stay separate. The former has350Nm original in its sources, the latter400Nm; no torque gain calculated from the wrong generation.
- A35C16 can be a2287cc2.3 or2998cc3.0; exact capacity/kW/type are required. Unknown or mistyped type codes are not repaired by guessing.
- Daily132kW180-marketed2017–19 is NOT the newer129kW176-marketed generation. The latter remains pending when year-specific evidence cannot be established.
- MovanoB2299ccMR/MS is not MovanoC2179ccY or new2184ccY. The100kW135/136 variant remains pending due differing original torque/generation claims.
- Suppliers' Euro6Df/Euro6Dt labels and EDC/SID/MD1 ECU possibilities are conditional source descriptions, not actual vehicle ECU identification. VIN/engine/ECU scan, gearbox, cooling, maintenance and duty cycle are required before a quote.
- Values are external ordinary Stage1 indications, not NoordTune measurements, guarantees, fuel savings or safe loaded-vehicle torque targets. DPF/EGR/SCR/AdBlue remain functional and road-legal; no numeric Stage2/3 or cross-brand file transfer.

## Release controls

The full data suite now covers15 reviewed manual families /27 total application scopes and405 adversarial identity cases; the incremental test adds90 exactpower boundary checks. Existing manual/header/plate behavior and all previous scope tests remain active. Local lint, TypeScript and optimized build must pass. Browser gate covers45 manual locale journeys +27 plate rendering fixtures and all100 engine pages; these fixtures are not proof of live RDW access. Production validation is recorded in the PR after rollout. Keep the previous known-good SHA as a pushed rollback tag before merge.

## Completed local checks

The exact optimized local build passed manual selector tests, all SEO/data tests, the full 810-observation runtime comparison, 405 negative identity cases plus 90 added power-boundary cases, lint and TypeScript. Browser validation passed 45 manual/locale journeys, 27 anonymous plate-rendering fixtures, the 36 header viewport/language cases, 32 prior compact-van plate journeys and the full 100-engine/25-model NL SEO sweep. The new Daily 115 kW mobile result screenshot was visually reviewed outside the repository. Sitemap has 374 unique addresses, including 126 van URLs. The historical sample still reports 1,854/3,000 and is not combined with the 810-case sample.

`qa-heavy-vans-live.cjs` is an opt-in post-release live-form smoke using four in-memory public RDW records. It writes no plates, captures no screenshots/traces, sends no customer messages, and prints only technical outcomes. Its result must be recorded separately from mocked plate-rendering tests. Production and preview validation results belong in the release PR once actually executed.

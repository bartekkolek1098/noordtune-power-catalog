# V3.1 match recovery — Draft PR #16

## Result on frozen inputs

The same 400 sanitized RDW registrations now produce **168 sourced results**, up from **162**. The fixed historical ordinary ICE A/B/C/D subset stays at **344 IDs** and moves from **162/344 to 168/344**. The original 222-ID subset moves from **88/222 to 89/222**. No previously sourced case was demoted. A/B/C/D/E counts changed from **35/127/15/167/56** to **35/133/15/161/56**.

The same 3,000 sampled RDW identities and 1,862 observed configuration-year scenarios were replayed offline: **714/1,862 → 737/1,862** sourced scenarios, with no mixed scenarios. Strict whole-group coverage for the frozen Top 50 remains **7/50**; **41** other groups have at least one sourced observed or published configuration and **2** have none. Partial groups are not called fully covered. These are purposive samples, not Dutch fleet prevalence estimates. Input SHA-256 hashes, case-level transitions, and the unchanged group memberships are in [v3-1-match-diagnostics.json](../../data/research/v3-1-match-diagnostics.json), [v3-1-results.json](../../data/research/v3-1-results.json), and [v3-1-observed-coverage.json](../../data/research/v3-1-observed-coverage.json).

## Causes and corrections

The 238 previously non-sourced cases received one primary cause each:

| Primary cause | Cases |
| --- | ---: |
| No applicable technical source | 95 |
| Powertrain outside ordinary ICE scope | 52 |
| Conflicting stock observations | 24 |
| Source generation unresolved | 21 |
| No applicable model source | 15 |
| Source period incompatible | 14 |
| Source rejection or review queue still unresolved | 6 |
| Missing registered facts | 4 |
| Reviewed research-queue source recovered | 5 |
| Alfa Romeo administrative model prefix recovered | 1 |
| Engine family unconfirmed | 1 |

Two bounded root-cause fixes were supported:

1. RDW's `ALFA GIULIETTA` has an administrative make prefix. The make-specific model normalizer now removes `ALFA ` for Alfa Romeo before applying the existing fuel, power, displacement, year, and configuration guards. This recovers one Giulietta case without treating Giulia, another make, another fuel, or another engine as equivalent.
2. Four already retrieved, hash-pinned Unlimited Tuning applications were held in the V2 research queue despite matching their retained model category, stock facts, bounded year scope, and numeric Stage 1. [The explicit review ledger](../../data/research/v3-1-reviewed-promotions.json) promotes only those four source IDs through the builder. The original source observations and queue flags remain intact. This recovers one Focus, two Polo, one Peugeot 2008, and one Peugeot 208 QA cases. No new page was retrieved. The accepted dataset has **1,246 profiles** (+4), with no pre-existing profile value or scope changed.

The configuration key still distinguishes generation, engine family, factory torque, and gearbox. Of the **28 V3 sourced demotions**, **22 remain correctly demoted**, **6 remain unresolved**, and **0 were safely recovered**. Material factory-torque conflicts and body/phase boundaries are retained; the unresolved examples include Opel Combo, Renault Master, Peugeot 2008, and Peugeot Partner. Each decision, candidate IDs, rejection fields, and evidence needed are recorded in the diagnostic JSON. Among 45 ambiguous configuration cases, candidate Stage 1 power agrees in 15, torque in 16, and both in 5; this is partial field evidence, never a fully resolved sourced result. V380ST remains conditional pending TDCi/EcoBlue evidence.

For the 400 cases, fully sourced **Stage 1 power and torque** move from **162 to 168**; there are **zero** sourced power-only Stage 1 results. Fully sourced **Stage 2 power and torque** move from **22 to 23**; the other 145 current sourced cases show an explicitly generic Stage 2. Numeric Stage 3 remains zero in this cohort. Candidate-field agreement in an unresolved configuration is reported separately and does not increase these counts.

## Customer values and commercial integrity

| Recovered application | Frozen QA cases | Stage 1 before → after | Stage 2 after |
| --- | ---: | --- | --- |
| Alfa Giulietta 1.4 170 | 1 | generic 170–180 PS → sourced **195 PS / 300 Nm** | sourced **205 PS / 310 Nm** |
| Ford Focus Mk2 2.0 145 | 1 | generic 145–155 PS → sourced **160 PS / 210 Nm** | generic indicative; recalculated from sourced Stage 1 |
| Peugeot 2008 1.6 VTi 120 | 1 | generic 120–125 PS → sourced **135 PS / 180 Nm** | generic indicative; recalculated |
| Peugeot 208 1.6 THP 155 | 1 | generic 155–165 PS → sourced **200 PS / 340 Nm** | generic indicative; recalculated |
| Volkswagen Polo A0 2.0 TSI 200 | 2 | generic 200–210 PS → sourced **235 PS / 420 Nm** | generic indicative; recalculated |

The complete old/new Stage 1 and Stage 2 values for every changed registration are in the results JSON. Existing consensus rounding explains the displayed 210 Nm Focus, 340 Nm Peugeot 208, and all other displayed figures; no target multiplier or estimate range was introduced. Stage 3 remains custom. There were **zero quote changes** and **zero normalized identity changes** across all 400; NoordTune pricing and service scope are unchanged. A valid vehicle-family match still requires workshop confirmation of the installed engine, ECU, and access.

## Next 20 missing technical configurations

Ranked by the **number of observed registrations in the same frozen 3,000-row sample**, then scenario count and frozen priority rank. Each tuple has no accepted matching make/model/fuel/factory-output/displacement profile; these are research leads, not validated tuning claims. Broad year spans may contain more than one generation. [Full ranking and group IDs](../../data/research/v3-1-next20.json).

| Rank | Model | Fuel; cc; factory kW | Observed rows | Admission years |
| ---: | --- | --- | ---: | --- |
| 1 | Mazda MX-5 | Petrol; 1798; 93 | 24 | 2005–2014 |
| 2 | Fiat Doblò | Diesel; 1598; 77 | 22 | 2016–2023 |
| 3 | Peugeot 5008 | Petrol; 1199; 96 | 20 | 2015–2021 |
| 4 | Nissan Micra | Petrol; 1240; 59 | 17 | 2003–2009 |
| 5 | Citroën C5 Aircross | Petrol; 1598; 133 | 16 | 2018–2020 |
| 6 | Škoda Octavia | Petrol; 1395; 103 | 16 | 2013–2015 |
| 7 | Audi A4 | Petrol; 1798; 88 | 13 | 2008–2012 |
| 8 | Renault Clio | Petrol; 1598; 79 | 13 | 2000–2005 |
| 9 | Fiat 500 | Petrol; 875; 63 | 13 | 2010–2017 |
| 10 | Nissan Micra | Petrol; 1198; 59 | 13 | 2010–2017 |
| 11 | Volkswagen T-Roc | Petrol; 1984; 140 | 13 | 2017–2024 |
| 12 | Volkswagen Golf | Diesel; 1896; 77 | 12 | 2005–2009 |
| 13 | BMW 520i | Petrol; 1998; 135 | 12 | 2017–2019 |
| 14 | Škoda Octavia | Petrol; 1595; 75 | 12 | 2005–2009 |
| 15 | Mazda 6 | Petrol; 1798; 88 | 12 | 2005–2009 |
| 16 | Mercedes-Benz B 180 | Petrol; 1595; 90 | 12 | 2011–2014 |
| 17 | Mitsubishi Colt | Petrol; 1499; 80 | 12 | 2005–2009 |
| 18 | Fiat 500 | Petrol; 1242; 51 | 12 | 2010–2014 |
| 19 | Škoda Octavia | Petrol; 1390; 90 | 12 | 2010–2013 |
| 20 | BMW 318i | Petrol; 1998; 115 | 12 | 2020–2024 |

## Validation and limits

The 400-case replay uses committed normalized facts and makes no live RDW request. Positive and neighboring negative regressions cover the two fixes; indexed and exhaustive matcher decisions agree on all 400 frozen cases. `pnpm catalog:audit`, `pnpm test:tuning`, `pnpm test:nl-fleet-v2`, `pnpm test:nl-fleet-v3`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` all passed. Lint was rerun clean after removing two unused diagnostic variables. [Command results](../../data/research/v3-1-validation-results.json).

Local production-browser checks passed **12 genuine HTTP owner-plate cases** for H329XH, V380ST, V978ZF, and KKH27K, plus **16 pre-existing intercepted synthetic cases** and **14 V3.1 intercepted sanitized fixtures**. The latter cover recovered Alfa/Focus/Polo figures, an unresolved Mini conflict, and an unsupported hybrid. Mobile 320 px, desktop 1,440 px, compact EN/PL, selected source figures, chart, layout, quote, WhatsApp, and debug-data absence passed with zero browser errors. The intercepted cases are not live plate lookups. [Sanitized browser result](../../data/research/v3-1-browser-results.json) and [two new screenshots](browser-v3-1/); earlier screenshots remain unchanged.

The catalog audit still reports **24 public vehicles and 291 sitemap URLs**. Canonical source records were not changed; the production browser JavaScript remains **25 chunks / 1,422,757 bytes**, exactly V3's size, with both client dataset-import counters at zero and no sourced profile IDs in browser chunks. [Build boundary](../../data/research/v3-1-build-boundary.json). The six unresolved demotions require better factory configuration or generation evidence; no candidate was selected to improve a coverage number. Hosted Preview browser verification requires access through Vercel SSO and is not claimed from a successful build.

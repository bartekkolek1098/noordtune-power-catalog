# NoordTune Power Catalog — RDW source gap baseline, 8 October 2026

**Status:** read-only, reproducible audit of two *different* aggregate cohorts. No individual plates, VINs, personal data, environment variables, code runtime logic or commercial output values are changed.

Run: `node --no-warnings scripts/report-rdw-source-gaps.cjs --summary`

Machine-readable frozen output: `data/research/rdw-source-gap-audit-2026-10-08.json`.

Regression: `node --no-warnings scripts/test-rdw-source-gaps.cjs`. It compares complete recomputed results against the frozen snapshot and verifies all partitions, source fingerprints, confidentiality and Stage 3 boundary.

## 1. Selector taxonomy vs published source profiles

The input taxonomy is 4,592 provider configurations. It is not a population of RDW registrations or a set of vetted ECU applications. The publication source pool has 1,269 source rows. Every taxonomy petrol/diesel configuration is checked against the existing strict source resolver over calendar years 1990–2026 intersecting its stated source period. Matching uses make, normalized model/trim, fuel, original power, engine displacement, source year and generation/badge constraints.

| Classification | Taxonomy configurations |
| --- | ---: |
| All provider taxonomy rows | 4,592 |
| Fuel marked petrol or diesel | 3,708 |
| Other/unknown/hybrid fuels (excluded from this matching pass) | 884 |
| Has at least one compatible source **candidate** in at least one checked year | 551 |
| Of those: has a candidate in **every** checked year | 194 |
| Petrol/diesel rows without a compatible source candidate | **3,157** |
| Of those, visibly ambiguous sources rather than a chosen profile | 20 |
| Total tested row/year combinations | 26,223 |
| Row/year combinations with a source candidate | 2,547 |
| Distinct source profiles selected as candidates | 512 |

**Candidate does not mean customer tuning coverage.** Factory torque, actual engine code, ECU, software, calibration, fuel grade, hardware and gearbox can still reject any candidate. The synthetic taxonomy is also incomplete/uneven by brand, and unknown fuel rows may in reality include petrol/diesel vehicles.

### First failing filter (sequential diagnostics)

Each of the 3,157 nonmatches is placed in one *first-failed* bucket. Other unresolved restrictions can coexist.

| First missing compatibility evidence | Rows |
| --- | ---: |
| Same make: no published source profile for that manufacturer | 146 |
| Make available, matching fuel absent | 26 |
| Make/fuel available, original power not close | **1,222** |
| Power compatible, nominal displacement differs | **738** |
| Displacement compatible, source years do not overlap | **200** |
| Year compatible, normalized model/engine family differs | **772** |
| Above checks pass but generation, trim/badge or ambiguity vetoes | 53 |
| Invalid checked-year interval | 0 |
| **Total** | **3,157** |

Do **not** fix the 772 model-family rejections by blanket string similarity. A better alias mapping must retain strict generation, fuel, stock horsepower, displacement, VIN-independent identity and manufacturer-specific model-sibling guards.

## 2. Independent RDW Dutch fleet aggregate

The separate RDW aggregate snapshot covers **11,327,762** non-exported passenger and <=3,500 kg light commercial registrations in the recorded population definition. Only the **top 5,000** make/model/cc/cylinders/class/first-admission-band groups are supplied; these represent **10,155,079** registrations in that historical snapshot.

Crucial limitation: there is **no joined factory horsepower or fuel** for these groups. Its comparison tests *only* make/model family, displacement and coarse admission/source-year overlap. It is a loose presence/absence indicator, not a valid numerical tuning eligibility test.

| Aggregate group classification | Groups | Registrations in those groups |
| --- | ---: | ---: |
| Possible same-family/cc/year source exists | 1,082 | 4,348,674 |
| No such potentially related source | 3,918 | 5,806,405 |
| **Top selected cohort** | **5,000** | **10,155,079** |

These counts **must not** be presented as percentages of tunable RDW vehicles. The possible-source groups may contain many untunable engines, hybrids, EVs and other incompatible variants. The unmatched groups can include model-alias false negatives. The dataset excludes ~1.17 million registrations outside the selected top 5,000 groups.

### Examples of high-frequency groups without a matching same-family source

| RDW group | Registered vehicles in group | Source research priority |
| --- | ---: | --- |
| Toyota Aygo 998 cc, 2015–2019 | 40,285 | Factory identification first; often naturally aspirated, no automatic ECU Stage 1 promise |
| Tesla Model Y, 2020–2024 | 39,308 | EV category — **not** a combustion-ECU tuning target |
| Toyota Yaris 1490 cc, 2020–2024 | 35,440 | Fuel/electrification join required; no assumption of non-hybrid |
| Ford Ka 1242 cc, 2010–2014 | 33,140 | Check naturally aspirated engine before any tuning result |
| Peugeot 108 998 cc, 2015–2019 | 33,118 | Factory identification, likely limited conventional Stage 1 |
| Toyota Yaris Hybrid 1497 cc, 2015–2019 | 32,423 | Hybrid system — source-specific verification, no generic power gain |
| Suzuki Alto 996 cc, 2010–2014 | 31,243 | Naturally aspirated candidate; facts + enquiry may be appropriate |
| Toyota Yaris Cross 1490 cc, 2020–2024 | 30,644 | Hybrid/engine join first |
| Lynk & Co 01 1477 cc, 2020–2024 | 29,637 | Electrification/engine calibration evidence required |
| Opel Karl/Viva 999 cc, 2015–2019 | 28,961 | Engine identification and tune feasibility check |

This table is a **gap ranking by registrations, not a recommended tuning sales list**.

## 3. Next product work, ordered by correctness and customer benefit

1. **Complete the aggregate RDW join:** source-compatible grouped make/model, original kW, displacement, fuel, calendar year and cylinder count with source timestamp/precision. Use public aggregate queries, not individual customer plates. Separate BEV/HEV/PHEV/CNG/NA engine classes before counting tuning opportunities.
2. **Review the 772 model naming/alias mismatches:** identify legitimate manufacturer-level model mappings, build a positive reviewed alias table and adversarial sibling/generation tests. No guess based on badge similarity or year alone.
3. **Review the 1,222 missing exact stock-power cases and 738 displacement mismatches:** first confirm manufacturer-factory identity and eliminate generically generated taxonomy cross-products. Gather *actual* model/engine/ECU scoped source evidence where available.
4. **Source priority must be opportunity-based:** intersect Dutch fleet group volume with the validated turbo ICE / engine-fuel-power cohorts after the RDW join, then ingest independent published tuner observations for Stage 1 only after compatible year/fuel/hardware checks. No bulk competitor database copying or percentage-generated gains.
5. **Measure real customer outcomes safely:** track only aggregate classification counters (successful RDW factual detection; direct numerical Stage 1; dated source example; review-only; RDW API unavailable). Do not store plate strings, owner data, VIN or per-customer search traces. Preserve prominent contact CTA for every successful lookup.

## 4. Release invariants

Current published 24 cards: **10 direct Stage 1 figures, 14 separately labeled source examples, 0 blank-only cards**. This is *not* 100% numeric or 100% RDW coverage.

Keep Stage 3 off public UI, sitemap and customer responses. Stage 2 numerical output remains hardware/evidence gated. Keep `power.noordtune.nl` subordinate to `noordtune.nl`. Apply every future runtime change to a separate feature branch with strict matching tests, protected Preview browser QA and production exact-SHA checks.

This audit is a data/research baseline only and requires **no Power Catalog deployment**.

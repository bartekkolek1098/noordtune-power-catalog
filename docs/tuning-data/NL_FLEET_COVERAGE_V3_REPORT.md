# Dutch Fleet Coverage Closure V3

## Result

V3 increases sourced results in the fixed 400-registration comparison from **124 to 162**. Supported ordinary ICE coverage is **162/344 = 47.09%**, below the 65% goal. The larger output sample also exposes gaps hidden by the older group-level estimate. **The Top-50, Top-100 and Top-250 coverage goals were not reached.** No profile, registration, output or generation was invented to meet them.

The research pass retrieved 700 ATM application pages, added 258 profile IDs, corroborated 58 existing profiles with ATM, and explicitly consolidated one duplicate V2 Caddy profile. The cumulative dataset contains **1,242 profiles**, including **179 with independent corroboration**. The owner Transit Connect case remains conditional because its engine family is unconfirmed.

## Delivery and provenance (items 1–3)

- Branch: `feature/nl-fleet-coverage-v3`.
- Stacked base: `feature/nl-fleet-coverage-v2`, V2 SHA `515fb4fa765cefc8f1c8d59a46c6daa7536dc727`.
- Draft PR and post-push verification: to be recorded after normal push.
- Validated dataset/runtime commit: `9093573e3bb07ff82b2bbb10c805a3ec5f347df9`; the subsequent QA/report commit includes the final scripts and artifacts.
- Dataset fingerprint: `cd53d92eab366f636915cd882fafc8332e0bcb8762b371056ca1df85f7f4b0f5`.
- Research and local verification date: 16 September 2026. All output values retain the original factual source record, retrieval date, URL and content hash.

## Dataset and providers (items 4–10, 25–26, 28–30)

| Measure | V2 | V3 |
|---|---:|---:|
| Profiles | 985 | 1,242 |
| Multi-source profiles | 127 | 179 |
| Single-source profiles | 858 | 1,063 |
| Profiles with a source disagreement | 43 | 59 |
| Unmerged stock-torque pairs | 15 | 31 |

V3 has **258 new IDs**, **one reviewed consolidation**, and **257 net additional profiles**. All V1 profile IDs survive. Every V2 profile is retained or has an explicit consolidation mapping with its original source observations preserved.

ATM contributed **700 retrieved pages**, **318 accepted remap observations**, and **312 independent profile votes**: 254 new profiles and 58 previously existing profiles. Its 58 counterpart links preserve independent provider identity; MAN category mirrors count as one ATM provider. Four other new profiles came from targeted Shiftech/ECU-Soft work. Of the 312 ATM-supported profiles, 305 appear among source candidates or selections for the Top-250 groups; this is profile applicability, not a count of fully covered groups.

The cumulative observation ledger contains **3,329 records**: **1,464 accepted remap observations**, **29 supporting manufacturer records**, and **1,836 rejected/deferred records**. Manufacturer evidence does not vote on tuned output. V-Tech's 55 factual observations and external-module fitment evidence remain available, with **zero ordinary ECU-remap votes**.

Stage 1 exists on **1,242 profiles**; Stage 2 has numeric source evidence on **269**. Stage 3 has numeric source evidence on **4** profiles; the other **1,238** retain custom/hardware-dependent Stage 3 treatment. Generic Stage 2 marketing and ATM Stage 1+ controls are not treated as numeric Stage 2 evidence.

The full provider table, including rejected observations, conflicts introduced and access/availability counts, is in [PROVIDER_COVERAGE_V3.md](PROVIDER_COVERAGE_V3.md). Conflict counts overlap across providers and must not be summed as independent incidents.

### Source handling

`pnpm research:atm` uses paced public access, robots checks, cached responses and a review-only refresh/diff workflow. Discovery inspected an actual public sitemap with 11,571 application URLs; the prioritized queue held 1,369 targets and the bounded pass retrieved 700 applications. Every Top-50 gap has actual application retrievals. No competitor prices, descriptions, reviews, images or dyno graphics enter the factual dataset.

ATM parsing checks breadcrumb generation, stock output, stock torque, displacement precision, fuel, published engine/ECU codes, method and exact numeric stage controls. Fuel/engine contradictions remain rejected evidence. Ford's mixed 2.0 TDCi/EcoBlue source labels can be qualified only by the reviewed Transit/Custom manufacturer mapping and matching factory output; that mapping does not resolve a 1.5 Connect.

**21 ATM negative applicability records** preserve unavailable, hybrid or otherwise inapplicable external applications. They prevent that source's positive data crossing the relevant boundary; they do not declare global NoordTune inability to tune a vehicle. The current ATM T6.1 diesel 150 PS page is positive: 150/360 to 195/430, 1,968 cc, 2021–2024, with published ECU facts. This differs from the task's unavailable example and is documented in [v3-availability-discrepancies.json](../../data/research/v3-availability-discrepancies.json). The actual T6.1 petrol 204 PS negative record is retained. T6, T6.1 and T7 remain separate.

## Coverage and sampling (items 11–16)

### How the numbers should be compared

The original RDW group ranks and score weights remain frozen. Coverage uses the least-covered known fuel/output/year/type scenario within each group. One sourced engine output does not make an entire group sourced.

There are now **3,000 actual sampled registrations**: 12 for each of the Top-250 groups, selected as four-row beginning, middle and end admission-date slices. Offsets were fixed from the aggregate population before resolver outcomes. Only those registrations received bounded fuel/power joins, in batches of 40; 3,399 fuel rows were returned. They describe **1,862 observed output variants**, including registered kW, approximate PS, year, cylinders, type, variant and execution. These sample frequencies are not exact fleet frequencies.

The broader sample exposes missing power, electrification and year/generation ambiguity that the old sample did not show. The table therefore keeps the historical V2 metric separate from both runs using the expanded sample. The legacy-sample V3 column uses the old 222 registrations, but new published applications still broaden its source-derived scenarios. It is not a completely fixed scenario denominator.

| Top groups | Historical V2 | V3, legacy sample | V2, expanded sample | V3, expanded sample | Goal |
|---:|---:|---:|---:|---:|---:|
| 50 | 48.0% | 42.0% | 14.0% | **14.0%** | 80% |
| 100 | 42.0% | 42.0% | 10.0% | **15.0%** | 70% |
| 250 | 33.2% | 32.8% | 8.8% | **12.0%** | 55% |
| 500 | 29.8% | 29.2% | 17.6% | **18.8%** | — |
| 1,000 | 26.2% | 26.0% | 20.1% | **20.8%** | — |

The expanded V2 run used the exact V2 runtime and verified V2 dataset fingerprint. All tables use the same frozen ranked groups. Source-derived scenario sets can still change when research discovers another real application; the fixed 400-registration comparison below is the stricter behavioral before/after measurement.

### Weighted conditional reach

| Top groups | Exact group population denominator | Historical V2 | V3, legacy sample | V2, expanded sample | V3, expanded sample |
|---:|---:|---:|---:|---:|---:|
| 50 | 996,135 | 55.35% | 54.75% | 24.41% | **20.36%** |
| 100 | 1,650,461 | 47.59% | 47.29% | 19.25% | **19.09%** |
| 250 | 2,426,441 | 43.15% | 40.54% | 16.22% | **16.47%** |
| 500 | 4,101,000 | 41.23% | 40.25% | 25.30% | **26.01%** |
| 1,000 | 6,359,608 | 35.77% | 35.48% | 25.49% | **26.30%** |

These are conditional model/displacement reach estimates weighted by exact RDW group populations. They are **not counts or percentages of individually verified tunable vehicles**. Variant shares and unseen variants remain unknown. Some formerly sourced groups become ambiguous after genuine conflicting evidence is added; this is why even weighted reach can fall while real-registration coverage rises.

See [NL_OUTPUT_VARIANT_PRIORITY.md](NL_OUTPUT_VARIANT_PRIORITY.md), [nl-top-groups-output-sample.json](../../data/research/nl-top-groups-output-sample.json), [expanded V2](../../data/research/v3-priority-baseline-expanded.json), [expanded V3](../../data/research/nl-technical-priority-v3.json), and [legacy-sample V3](../../data/research/v3-priority-legacy-sample.json).

### Fixed 400-registration QA

The prior 222 rows remain an unchanged regression subset. The other 178 were selected from unseen, verified middle-slice registrations in priority order **before the fuel join and resolver outcomes**. No cases were exchanged to improve the score. All 400 pass the stronger current-registration check: present in the RDW register, nonexport, holder date present and registration possible. In the larger 3,000-row output sample, 27 do not pass that stronger check; their flags remain false and they are not in the added QA cohort.

| Resolution | V2 on the same 400 | V3 on the same 400 |
|---|---:|---:|
| A: corroborated sourced | 17 | 35 |
| B: other applicable sourced | 107 | 127 |
| Sourced total | **124 (31.0%)** | **162 (40.5%)** |
| C: catalog estimate | 12 | 15 |
| D: generic/conditional estimate | 208 | 167 |
| E: unsupported/unresolved | 56 | 56 |

Supported ordinary ICE denominator: **344** (A/B/C/D). V3 reaches **47.09% sourced**, below 65%. E includes electrified/unsupported powertrains, missing power and unresolved identity, and remains included in the overall 400 denominator. This is a purposive breadth sample, not a random population estimate.

There are **66 newly sourced cases and 28 sourced demotions**, net +38. Each demotion records the actual competing engine/generation evidence; none is hidden. In the fixed prior 222, sourced results rise **66 → 88**, with V3 A19/B69/C5/D98/E31. Normalized vehicle identity changes: **0**. Quote changes: **0**. Per-case transitions and reasons are in [v3-rdw-outcomes.json](../../data/research/v3-rdw-outcomes.json).

Only hashes and normalized technical facts are committed. Private plate joins and raw provider HTML remain under `.git`. [v3-privacy-check.json](../../data/research/v3-privacy-check.json) records the privacy check; screenshots capture the result section without the registration input.

## Mandatory family results (items 18–22)

| Family and requested period | Evidence added or checked | Remaining boundary |
|---|---|---|
| Sprinter 1,950 cc, 2020–2024 | ATM 114/150/170/190 PS; manufacturer OM654 chronology; actual observed 150/170 PS applications resolve sourced. | Rank 1 is B across currently evaluated scenarios. Unseen variants are unmeasured; large single-source gains still require owner review. |
| Vito 1,950 cc, 2020–2024 | Separate 136/163/190/239 PS applications and explicit 2021 successor scopes. | Group D: 102 PS application facts remain incomplete/conflicting. ATM publishes petrol and omits displacement on that page; a separate Shiftech nominal-2.0 page and official 2024 1,950 cc diesel specification do not resolve its torque/period conflict. |
| Caddy 1,968 cc, 2015–2019 and 2020–2024 | Output-specific 75/102/122 PS and other published applications; actual 122 PS stock-torque variants retained; one duplicate 75 PS application consolidated. | Both groups D: generation transition and 122 PS stock 250 versus 320 Nm remain unresolved for weak RDW identity. Provider Mk5/Mk6 labels are not silently equated. |
| Crafter 1,968 cc, 2020–2024 | ATM generation/output applications plus ECU-Soft 2021–2026 163/400 → 190/440. | Group D: late 140 PS scope and 177 PS stock 380 versus 410 Nm still need exact applicability evidence. Roman generation identifiers remain distinct. |
| Transporter 1,968 cc, 2020–2024 | T6 and T6.1 tables independently retrieved; positive T6.1 150 PS current evidence and real negative applications retained. | Group D: transition years and competing stock-torque configurations. T6.1 never reuses T6 evidence merely because the model/displacement agrees. |
| Golf 1,498 cc, 2020–2024 | ATM ordinary 1.5 TSI 150/250 → 180/335 and separate source-backed applications. | Group E includes observed electrified variants; eTSI/MHEV evidence never becomes an ordinary ICE remap vote. |
| Master 2,299 cc, 2020–2024 | ATM output/ECU facts and independent existing records for common 130/135/150/163/170 PS applications (RDW approximate PS may round to 131/136). | Group D: 145 PS Blue dCi/BiTurbo alternatives remain ambiguous. Very large gains retain the extra-evidence guard. |
| Trafic 1,997 cc, 2020–2024 | ATM 120/145/150/170 PS; targeted Shiftech 110/130/150 PS applications. | Group D: overlapping stock-torque/generation applications cannot be selected from model and power alone. |
| Transit 1,995 cc, 2020–2024 | Manufacturer-qualified EcoBlue factory identities, including 105/130/170/185 PS; ATM corroboration. | Group D: 130 PS stock-torque disagreement and incomplete output/scope matches. Partial-period Custom pages remain review-only where merging would shorten an existing supported period. |
| Connect 1,499 cc, 2015–2019 and 2020–2024 | Separate TDCi 100 and EcoBlue 100 profiles; EcoBlue 100/250 → 145/340, exact 1,499 cc and Bosch MD1CS005; other sourced 75/120 PS applications retained. | Both groups D: family evidence is required. Manufacturer facts qualify source scope but do not decode opaque RDW types or hardcode an owner registration. The owner case remains conditional. |
| Focus 1,596 cc, 2005–2009 | Retrieved actual stock/output applications around 100 PS; exact registered output preserved. | Group D: overlapping generations/configurations remain ambiguous. |
| Vivaro-B 1,598 cc, 2015–2019 | 95/125/145 PS and other application evidence retained. | Group D: 120 PS stock 300/320 Nm disagreement. Existing valid 2019 scopes are preserved; partial-source consolidation was declined. |
| Partner 1,560 cc, 2015–2019 | Actual 75/90/100 PS source applications and observed outputs. | Group D: overlapping torque/period applicability requires stronger identity. |
| TGE 1,968 cc, 2020–2024 | ATM 102/122/140/177 PS; old 2017 applications bounded before explicit 2020 successors. | Group D: observed 163 PS lacks compatible source evidence. Category mirrors are one provider and are not corroboration. |

Primary manufacturer records, URLs and source-specific qualifiers are retained in [v3-manufacturer-evidence.json](../../data/research/batches/v3-manufacturer-evidence.json) and [source-pages.json](../../data/research/source-pages.json). Each mandatory family also has an output-level review record below.

## Consensus, regressions and customer output (items 23–27)

One independent provider gets at most one vote per profile/stage. Every original source value survives. Compatible evidence follows the existing rounded-median policy; disagreement outside tolerance follows the conservative conflict rule and retains `ownerReviewRequired`. Selecting a more attractive maximum is prohibited.

For Stage 1 power or torque gains above 45%, the builder requires compatible independent corroboration or explicit technical/factory-derating evidence. Otherwise `LARGE_GAIN_REQUIRES_EXTRA_EVIDENCE` enforces owner review and prevents NoordTune-approved promotion. No factory-derating exception was invented for this phase.

Relative to V2, **33 profiles change selected numeric values and 2 change scope**, representing **34 distinct fact-changed profiles**, plus one reviewed consolidation. Relative to V1, the cumulative diff has **15 numeric changes and 16 scope changes across 28 distinct profiles**. Counts overlap; source-only corroborations are also recorded. Every value/scope change has an explicit evidence-backed record in [v3-source-changes.json](../../data/research/v3-source-changes.json) or [v3-v1-source-changes.json](../../data/research/v3-v1-source-changes.json). The historical V1/V2 reports are preserved.

Kia/Hyundai regression: **100 source-backed fixtures, all sourced**, including nonpublic models; **7 hybrid controls pass**. Overall index equivalence verifies 3,726 source comparisons and 77 catalog comparisons with zero failures. These synthetic fixtures measure matcher behavior, separately from actual RDW registrations.

Pricing remains the NoordTune matrix and explicit assignments. The 400-registration comparison has **zero quote changes**; quote policy and surface regressions pass, including **421 sourced-pricing bridge assertions**. No competitor price is imported and no new commercial override was created. Sourced Stage 1 remains preferred; numeric Stage 2 is used when genuinely sourced; custom Stage 3 has no fabricated chart point. Provider names are not added prominently to the main customer card.

## Performance and delivery boundaries (items 31–35)

Node v24.19.0 on Windows; three alternating indexed/exhaustive passes over source-derived fixtures plus 400 normalized real registrations. Network and HTTP costs are excluded from the pure resolver benchmark.

| Measure | Result |
|---|---:|
| Cold source-index construction | 6.00 ms |
| Indexed source match, median / p95 | 0.149 / 0.646 ms |
| Exhaustive source match, median / p95 | 1.151 / 2.279 ms |
| Full resolver, median / p95 | 0.776 / 3.836 ms |
| Retained index heap delta, GC available | 384,192 bytes (375.19 KiB) |
| Process RSS / heap after benchmark | 324.03 / 115.48 MiB |
| Complete RDW normalization, median / p95 | 9.479 / 33.847 ms |
| Serialized API-shape payload, median / p95 / max | 4,943 / 5,460 / 8,632 bytes |
| Actual HTTP payload, median / p95 / max, 23-case browser pass | 4,976 / 5,814 / 7,204 bytes |
| Actual local HTTP round trip, median / p95 | 310.09 / 567.23 ms |
| Production browser JS | 25 chunks, 1,422,757 bytes |
| V2 browser JS / V3 delta | 1,422,708 bytes / **+49 bytes** |
| `CLIENT_IMPORTS_SERVER_CATALOG` | **0** |
| `CLIENT_IMPORTS_SOURCED_PROFILE_DATASET` | **0** |

Process memory includes the canonical catalog, runtime imports, benchmark fixtures and data. It is not isolated dataset memory. The index delta is measured separately. V2 performance used a smaller 222-case cohort, so its timings are not a strict same-input speed comparison. Selected DTOs in HTML/RSC/API are intentional; the complete sourced dataset remains server-only. See [v3-performance.json](../../data/research/v3-performance.json), [v3-rdw-validation.json](../../data/research/v3-rdw-validation.json), and [v3-browser-bundle.json](../../data/research/v3-browser-bundle.json).

## Validation (items 36–40)

| Required check | Result |
|---|---|
| `pnpm catalog:audit` | PASS; 0 critical groups, 18 existing warning groups |
| `pnpm test:tuning` | PASS; includes 31,030 dataset assertions across 1,239 distinct source fixtures, 1,220 nonpublic |
| `pnpm test:nl-fleet-v2` | PASS; Kia/Hyundai, hybrid controls and indexed/exhaustive regression |
| `pnpm test:nl-fleet-v3` | PASS; 190 ATM parser assertions, 22 negative-generation/vote/large-gain assertions, 30 explicit generation/output guards, all 400 registrations and 3,000 output samples |
| Top-50 closure | PASS; all 26 original C/D/E groups plus all 43 current C/D/E groups, 44 distinct review records |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS; production build |
| Browser bundle boundary check | PASS; both client dataset import counters zero |

Local production browser verification: **23 real-registration UI cases across 17 identities**, **28 owner/synthetic UI cases**, and **9 public/manual Stage 3 cases**, all passing with zero errors. The owner cases use real HTTP responses; interception is limited to explicitly synthetic resolver fixtures. Mobile 320 px, desktop 1,440 px, Dutch/English/Polish, quote CTAs, conditional Connect, and custom Stage 3 chart behavior were checked. Result-only screenshots and JSON evidence are in [browser-v3](browser-v3/).

The local server was bound to `localhost:3120`. An initial IPv4-only binding conflicted with the local internationalization proxy and was corrected by the server start command; no application code change was needed. Hosted Preview verification is recorded separately. Machine-readable validation is in [v3-validation-results.json](../../data/research/v3-validation-results.json).

## Review deployment and protected work (items 41–42)

Post-push Vercel Preview status will be recorded here. Local browser checks do not imply access to an authenticated hosted preview.

Read-only verification before push confirms:

| Protected target | Unchanged SHA / state |
|---|---|
| PR #12 | Draft, open; `15d67ae15c3db7e90195b99e167ec4614ec884dd` |
| PR #13 | Draft, open; `3484b24c06491c4305add40067b0ba0e66aba7e5` |
| PR #14 | Draft, open; `d92bcd179813d1587e82e7f3a12ee5f1914648df` |
| PR #15 | Draft, open; `515fb4fa765cefc8f1c8d59a46c6daa7536dc727` |
| main | `4d12e510953fb57c3f8f84a737880ff860a617e7` |

No work was performed in noordtune-www. No merge, Ready transition, force push or production deployment is part of this phase. Public SEO scope remains **24 vehicles and 291 sitemap URLs**; the 58,586-record canonical catalog remains separate from the sourced dataset. Production deployment and final protected-ref verification will be attached after the Draft PR is created.

## Top-50 unresolved review ledger (item 17)

The ledger covers the union of 26 historical V2 C/D/E groups and all 43 currently unresolved groups: **44 records**, including the resolved Sprinter group. Every record contains exact RDW group facts, observed output variants, retrieved application IDs, independent-source review, profiles found and unresolved reasons. Additional sampling exposed 18 groups that were previously counted as sourced; those now have the same documented research pass.

Complete output-level facts: [top50-coverage-closure.json](../../data/research/top50-coverage-closure.json). The following table lists the remaining 43 groups. D denotes a generic/conditional result for at least one known scenario; E denotes at least one unresolved or unsupported scenario. Other variants within those same groups can still receive sourced results.

| Rank | Exact RDW group | Admission band | Observed PS, rounded | Layer | Unresolved reason |
|---:|---|---|---|:---:|---|
| 2 | VOLKSWAGEN TRANSPORTER / 1968 cc | 2010–2014 | missing, 140, 84, 114 | E | missing registered power; competing stock-torque/generation profiles; registration outside retained catalog scope |
| 3 | VOLKSWAGEN CADDY MODIFIED PARTITION WALL / 1968 cc | 2020–2024 | 75, 102, 122 | D | competing stock-torque/generation profiles; registration outside retained catalog scope |
| 4 | VOLKSWAGEN CRAFTER / 1968 cc | 2020–2024 | 140, 177 | D | competing stock-torque/generation profiles; no compatible source for a known output/year; registration outside retained catalog scope |
| 5 | VOLKSWAGEN GOLF / 1197 cc | 2010–2014 | 105, 86 | D | competing stock-torque/generation profiles; catalog configuration ambiguous |
| 6 | VOLKSWAGEN CADDY / 1968 cc | 2015–2019 | 140, 102, 75 | D | competing stock-torque/generation profiles; registration outside retained catalog scope |
| 7 | RENAULT MASTER / 2299 cc | 2020–2024 | 131, 170, 163, 145, 150 | D | competing stock-torque/generation profiles |
| 8 | VOLKSWAGEN TRANSPORTER / 1968 cc | 2020–2024 | 150, 102, 110 | D | competing stock-torque/generation profiles; no compatible source for a known output/year; registration outside retained catalog scope; catalog configuration ambiguous |
| 9 | MERCEDES-BENZ VITO / 1950 cc | 2020–2024 | 163, 190, 136, 237 | D | no compatible source for a known output/year |
| 10 | OPEL VIVARO-B / 1598 cc | 2015–2019 | 120, 121, 125, 95, 145 | D | competing stock-torque/generation profiles |
| 11 | VOLKSWAGEN GOLF / 999 cc | 2015–2019 | 116, 110 | D | competing stock-torque/generation profiles; catalog configuration ambiguous |
| 12 | RENAULT CLIO / 999 cc | 2020–2024 | 101, 91, missing | E | missing registered power; fuel/powertrain unresolved |
| 14 | PEUGEOT PARTNER / 1560 cc | 2015–2019 | 90, 75, 99 | D | competing stock-torque/generation profiles |
| 15 | FORD TRANSIT / 1995 cc | 2020–2024 | 108, 185, 170, 130 | D | competing stock-torque/generation profiles; no compatible source for a known output/year |
| 16 | FORD FOCUS / 1596 cc | 2005–2009 | 101 | D | competing stock-torque/generation profiles |
| 17 | VOLKSWAGEN GOLF / 1498 cc | 2020–2024 | 131, 150, 116 | E | electrified/unsupported application; competing stock-torque/generation profiles; catalog configuration ambiguous |
| 19 | FORD TRANSIT CONNECT / 1499 cc | 2015–2019 | 120, 75, 101, 100 | D | TDCi/EcoBlue identity unconfirmed; no compatible source for a known output/year; registration outside retained catalog scope |
| 20 | FORD TRANSIT CONNECT / 1499 cc | 2020–2024 | 100, 120 | D | TDCi/EcoBlue identity unconfirmed; no compatible source for a known output/year; registration outside retained catalog scope |
| 21 | MAN TGE / 1968 cc | 2020–2024 | 177, 140, 163 | D | no compatible source for a known output/year |
| 22 | RENAULT TRAFIC / 1997 cc | 2020–2024 | 120, 145, 170, 110, 150, 131 | D | competing stock-torque/generation profiles |
| 23 | PEUGEOT 208 / 1199 cc | 2015–2019 | 82, 83, 131, 101 | D | competing stock-torque/generation profiles; catalog configuration ambiguous |
| 24 | PEUGEOT 208 / 1199 cc | 2020–2024 | 101, 131, 136 | E | electrified/unsupported application |
| 25 | OPEL COMBO / 1499 cc | 2020–2024 | 102, 131 | D | competing stock-torque/generation profiles |
| 26 | MERCEDES-BENZ CITAN / 1461 cc | 2015–2019 | 75, 90, 110 | D | no compatible source for a known output/year |
| 28 | PEUGEOT 2008 / 1199 cc | 2015–2019 | 82, 110, 131 | D | competing stock-torque/generation profiles; catalog configuration ambiguous |
| 29 | RENAULT KANGOO / 1461 cc | 2015–2019 | 90, 75, 110, 80 | D | competing stock-torque/generation profiles |
| 30 | VOLKSWAGEN CADDY / 1968 cc | 2020–2024 | 102, 75, 122 | D | competing stock-torque/generation profiles; registration outside retained catalog scope |
| 32 | PEUGEOT 2008 / 1199 cc | 2020–2024 | 155, 131, 101, 136 | E | electrified/unsupported application; competing stock-torque/generation profiles; catalog configuration ambiguous |
| 34 | CITROEN BERLINGO / 1560 cc | 2015–2019 | 90, 75, 99 | D | competing stock-torque/generation profiles |
| 35 | VOLKSWAGEN POLO / 999 cc | 2015–2019 | 75, 95, 116, 80 | D | competing stock-torque/generation profiles |
| 36 | RENAULT MEGANE / 1197 cc | 2015–2019 | 132, 116, 101 | D | competing stock-torque/generation profiles; catalog configuration ambiguous |
| 37 | MAZDA MAZDA CX-5 / 1998 cc | 2015–2019 | 155, 165, 160 | D | no compatible source for a known output/year |
| 38 | VOLKSWAGEN GOLF / 999 cc | 2020–2024 | 116, 110 | E | electrified/unsupported application |
| 39 | FORD FOCUS / 1596 cc | 2000–2004 | 101 | D | competing stock-torque/generation profiles; no compatible source for a known output/year |
| 41 | VOLKSWAGEN GOLF / 1598 cc | 2000–2004 | 105, missing, 116 | E | missing registered power; no compatible source for a known output/year |
| 42 | VOLKSWAGEN UP / 999 cc | 2010–2014 | 60, 75, 68 | E | fuel/powertrain unresolved; no compatible source for a known output/year |
| 43 | CITROEN CITROEN C1 / 998 cc | 2010–2014 | 68, 69 | D | no compatible source for a known output/year |
| 44 | NISSAN NISSAN QASHQAI / 1332 cc | 2020–2024 | 140, 159, 158 | E | electrified/unsupported application |
| 45 | HYUNDAI I20 / 998 cc | 2020–2024 | 100 | E | electrified/unsupported application; competing stock-torque/generation profiles |
| 46 | SKODA OCTAVIA / 1498 cc | 2020–2024 | 150, 116 | E | electrified/unsupported application; no compatible source for a known output/year |
| 47 | FIAT FIAT DUCATO / 2287 cc | 2015–2019 | 131, 148, 177, 120 | D | competing stock-torque/generation profiles |
| 48 | RENAULT TWINGO / 1149 cc | 2010–2014 | 58, 75 | D | no compatible source for a known output/year |
| 49 | KIA PICANTO / 998 cc | 2015–2019 | 69, 67, 100 | D | no compatible source for a known output/year |
| 50 | PEUGEOT 3008 / 1598 cc | 2020–2024 | 200, 181, 150 | E | electrified/unsupported application; competing stock-torque/generation profiles; catalog configuration ambiguous |

# Netherlands Fleet Coverage V2

Research and validation: **16 September 2026**. [Draft PR #15](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/15), **Expand tuning coverage for the Dutch fleet**.

## Outcome and review scope

**705 new accepted technical profiles; 985 cumulative**, compared with V1's 280. Multi-source profiles increase **50 → 127**; single-source profiles **230 → 858**. **48** V1 single-source profiles gain an independent source, and **29** new profiles are multi-source. All 280 V1 IDs remain. The technical count normalizes make/model/generation labels and excludes year endpoints: 985 distinct cumulative / 705 new. Collapsing generation as well yields 885 cumulative / 629 new broader model/engine/output combinations. These are published applications, without generated annual copies.

The Dutch-fleet acceptance goals are **not met**: top-50 sourced coverage is 48%, below the 90% goal. The priority queue retains unresolved output variants, generation ambiguity and unsupported powertrains. Single-source profiles are 87.11% of V2; multi-source coverage increased in absolute count, while the expanded denominator reduced its share from 17.86% to 12.89%. Corroboration remains a large backlog.

Branch: `feature/nl-fleet-coverage-v2`. Base: `feature/tuning-profile-dataset-v1` at `d92bcd179813d1587e82e7f3a12ee5f1914648df`. Five logical commits retain the requested research → provider → dataset → runtime → QA structure. The PR remains Draft, without merge, squash or force push. The latest head is recorded by GitHub; the reproducible validated dataset fingerprint is **`fbcfda2b8bb162cb26e0ad28bfe40ef1b5e03acbe680b4ee965fb277b33d4d40`**.

## 1. Exact RDW counts and derived priority

Official [RDW vehicle data, m9d7-ebf2](https://opendata.rdw.nl/resource/m9d7-ebf2.json) provides exact server-side counts for the recorded predicate: non-exported passenger vehicles, plus non-exported commercial vehicles with permitted maximum mass ≤3,500 kg. Population: **11,327,762** published registrations, comprising **10,185,281 passenger cars** and **1,142,481 light commercial vehicles**. The retained **5,000 largest aggregate groups** cover **10,155,079 registrations**. The two aggregate response bodies total **818,387 bytes**, rather than a complete multi-GB row download. Groups use make, trade name, displacement, cylinders, vehicle class and five-year first-admission band. This population predicate does not prove insurance, road use or active ownership for every aggregate record.

Fuel and registered combustion-engine kW are separately sourced from [8ys7-d773](https://opendata.rdw.nl/resource/8ys7-d773.json). There is no full-fleet power/fuel join. The exact group count is never assigned to each output variant. Technical scenarios combine published profiles, actual bounded RDW samples and explicitly unvalidated canonical hints. Annual canonical copies carry no extra priority.

The frozen priority score is `20 log10(1 + group count) + 20 generic + 20 no sourced result + 10 single-source + 12 van + 8 workshop relevance + 8 ambiguity`. Binary modifiers and baseline ranks remain fixed against V1. Full methodology and SoQL provenance: [NL_FLEET_PRIORITY.md](NL_FLEET_PRIORITY.md), `nl-fleet-model-priority.json` and `nl-technical-priority.json`.

### Identity coverage

A = sourced multi-source/approved; B = sourced single-source; C = compatible retained catalog; D = generic indication; E = unresolved/unsupported. Each group takes its least-covered evaluated distinct fuel/output/year-scope scenario. Unknown variants remain unmeasured. Percentages below describe **derived priority-group coverage**, not exact individual vehicle tuning coverage.

| Top | A | B | C | D | E | Sourced % | V1 sourced % | Goal |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | 1 | 23 | 0 | 26 | 0 | 48.00% | 0.00% | 90% |
| 100 | 1 | 41 | 1 | 56 | 1 | 42.00% | 0.00% | 85% |
| 250 | 3 | 80 | 4 | 160 | 3 | 33.20% | 1.20% | 75% |
| 500 | 5 | 144 | 27 | 281 | 43 | 29.80% | 1.80% | 60% |
| 1000 | 12 | 250 | 96 | 407 | 235 | 26.20% | 3.20% | — |

### Exact counts weighted by derived classes

These are **conditional model/displacement reach counts**, summed once per exact group. They are not counts of verified tunable or source-covered individual vehicles. Output/fuel shares are unknown; `exactTunedVehicleCoverage` remains null.

| Top | A count | B count | C count | D count | E count | Group denominator | Conditional sourced % |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | 19,607 | 531,799 | 0 | 444,729 | 0 | 996,135 | 55.35% |
| 100 | 19,607 | 765,838 | 1,333 | 853,430 | 10,253 | 1,650,461 | 47.59% |
| 250 | 30,477 | 1,016,504 | 31,517 | 1,323,414 | 24,529 | 2,426,441 | 43.15% |
| 500 | 34,020 | 1,656,967 | 232,583 | 1,599,286 | 578,144 | 4,101,000 | 41.23% |
| 1000 | 77,540 | 2,197,189 | 529,422 | 1,720,997 | 1,834,460 | 6,359,608 | 35.77% |

## 2. Providers, observations and provenance

**2,255 new observations**, **2,616 cumulative**. The accepted profiles use **1,141** remap observations; **1,452** observations remain rejected/deferred, plus 23 manufacturer evidence records. Observation count differs from unique URL count because one published page can sit in multiple explicit application categories. Provider profile columns overlap when a profile has multiple providers.

| Provider | New observations | Cumulative observations | New unique URLs | Accepted remap observations | Profiles using provider |
| --- | --- | --- | --- | --- | --- |
| br-performance | 0 | 1 | 0 | 0 | 0 |
| celtic-tuning | 0 | 1 | 0 | 0 | 0 |
| manufacturer | 7 | 23 | 7 | 0 | 0 |
| mosselman | 0 | 36 | 0 | 36 | 36 |
| shiftech | 141 | 420 | 141 | 359 | 356 |
| unlimited-tuning | 2,052 | 2,080 | 1,858 | 746 | 720 |
| vtech | 55 | 55 | 55 | 0 | 0 |

- **V-Tech:** 55 factual application observations and 153 PowerChip package records; **zero ordinary remap profiles/votes**. The current public configurator publishes external-module packages, while legacy chip-tuning routes were unavailable. Stock fitment metadata can narrow an application period without supplying a second tuning vote.
- **Shiftech:** actual retrieved rendered stock/Stage tables supply accepted values. Search snippets and sitemap discovery supply no tuning values. Missing or mismatched tables remain unaccepted.
- **Unlimited:** only Normal / explicit Stage 1 and explicitly named Stage 2 count. Stage 1+, Xtreme and Ecotuning are not relabelled. Category periods/fuel are preserved; an end-only Dutch `t/m` label cannot establish a start. Two below-stock tables and unreviewed mixed TDCi/EcoBlue labels are deferred.
- **Mosselman:** 36 existing BMW source observations remain. BR-Performance and Celtic V1 access stops remain respected; no access bypass was attempted.
- **Manufacturers:** official Toyota/Peugeot/Volkswagen archives bound city-car body periods. Official Suzuki, Nissan and Kia evidence excludes specific electrified applications. Exact RDW registered stock power remains on the customer card.

No raw provider HTML, competitor marketing prose/images/dyno graphs/prices, or raw new QA plates are committed. Refresh commands are independent, paced and cached, compare hashes/facts, and write review-only diffs. They never silently rebuild/promote customer values. See [SOURCE_REFRESH_WORKFLOW.md](SOURCE_REFRESH_WORKFLOW.md).

## 3. V1 preservation and consensus review

**12 V1 profiles change selected numbers**, **16 narrow applicability periods**, with **25 distinct profiles** affected across these overlapping sets. All changed values have new independent Unlimited evidence, original provider observations, timestamps/hashes and before/after records in `v2-source-changes.json`. Remaining V1 selected values are unchanged. Stage 2/3 selected figures stay unchanged for these 12 numeric cases.

| V1 application / stock PS | Old Stage 1 | New Stage 1 |
| --- | --- | --- |
| Hyundai Tucson / 184 | 200 PS / 450 Nm | 205 PS / 450 Nm |
| Hyundai Tucson / 177 | 220 PS / 330 Nm | 215 PS / 340 Nm |
| Kia Ceed / 204 | 235 PS / 340 Nm | 235 PS / 350 Nm |
| Kia Sportage / 136 | 175 PS / 450 Nm | 175 PS / 440 Nm |
| Opel Vivaro / 177 | 210 PS / 450 Nm | 205 PS / 450 Nm |
| Opel Vivaro / 150 | 210 PS / 450 Nm | 205 PS / 450 Nm |
| Opel Vivaro / 122 | 210 PS / 450 Nm | 205 PS / 450 Nm |
| Renault Clio / 130 | 175 PS / 300 Nm | 165 PS / 300 Nm |
| Seat Leon / 105 | 145 PS / 310 Nm | 145 PS / 320 Nm |
| Toyota ProAce / 150 | 210 PS / 450 Nm | 205 PS / 450 Nm |
| Volkswagen Golf / 110 | 185 PS / 370 Nm | 185 PS / 380 Nm |
| Volkswagen Passat / 240 | 290 PS / 580 Nm | 275 PS / 560 Nm |

Consensus remains one vote per provider. Close results use a rounded median (5 PS / 10 Nm, ties downward); spreads above 5% power or 8% torque use the conservative minimum and require owner review. The dataset retains **43 profiles with Stage conflicts** and **15 unresolved stock-torque variant pairs**. Distinct technical identities are not merged just to remove ambiguity. X-Trail's duplicate capitalization is consolidated only because both reviewed generation/period and stock facts match; its separate facelift remains distinct.

## 4. Brand and engine depth

| Make | V1 profiles | New profiles | V2 total |
| --- | --- | --- | --- |
| Alfa Romeo | 7 | 0 | 7 |
| Audi | 12 | 10 | 22 |
| BMW | 40 | 0 | 40 |
| Citroën | 5 | 13 | 18 |
| Dacia | 0 | 9 | 9 |
| Fiat | 7 | 7 | 14 |
| Ford | 35 | 49 | 84 |
| Honda | 0 | 7 | 7 |
| Hyundai | 12 | 23 | 35 |
| Iveco | 0 | 7 | 7 |
| Jaguar | 4 | 0 | 4 |
| Jeep | 4 | 0 | 4 |
| Kia | 27 | 37 | 64 |
| Land Rover | 6 | 0 | 6 |
| MINI | 0 | 31 | 31 |
| Mazda | 0 | 14 | 14 |
| Mercedes-Benz | 20 | 16 | 36 |
| Mitsubishi | 0 | 7 | 7 |
| Nissan | 0 | 21 | 21 |
| Opel | 6 | 48 | 54 |
| Peugeot | 15 | 64 | 79 |
| Renault | 16 | 83 | 99 |
| Seat | 7 | 16 | 23 |
| Skoda | 7 | 16 | 23 |
| Suzuki | 0 | 11 | 11 |
| Toyota | 3 | 16 | 19 |
| Volkswagen | 37 | 178 | 215 |
| Volvo | 10 | 22 | 32 |

Newly represented makes include Nissan, Mazda, Suzuki, Dacia, MINI, Mitsubishi, Honda and Iveco. Toyota passenger applications expand alongside ProAce. **Lexus: researched, zero accepted new profiles**: retrieved ICE pages lacked sufficiently bounded applicability; hybrid claims are excluded. Natural-aspiration gains are accepted only when actually published, without invented turbo-style gains.

BMW: **40** profiles (V1 retained); MINI: **31**, with distinct make/model matching. VAG: **283**; Ford: **84**. Explicit family labels retained: B38: 5; B47: 12; B48: 11; B58: 3; CRDi: 22; EcoBlue: 14; EcoBoost: 20; M133: 1; M139: 1; N47: 8; N57: 3; T-GDI: 15; TDCi: 29. Another **841** profiles do not publish an engine code/family; displacement or badge is not upgraded into a claimed EA189/EA288/EA888 generation or BMW B57/N20 identity. BMW B57/N20/N26 depth, confirmed VAG architecture generations, Mercedes OM details and newer hybrid-adjacent variants remain research gaps. Published displacement/output variants add useful depth without pretending those missing codes are verified.

### Vans

**254** accepted van/commercial applications. Counts retain published model labels; Toyota ProAce / Proace capitalization refers to one model family, and the Transporter multi-model label explicitly includes its published aliases.

| Make / application | Accepted profiles |
| --- | --- |
| Citroën Berlingo | 2 |
| Citroën Jumper | 6 |
| Citroën Jumpy | 10 |
| Fiat Ducato | 2 |
| Fiat Talento | 4 |
| Ford Transit | 16 |
| Ford Transit Connect | 14 |
| Ford Transit Custom | 6 |
| Iveco Daily | 7 |
| Mercedes-Benz Citan | 2 |
| Mercedes-Benz Sprinter | 3 |
| Mercedes-Benz Vito | 5 |
| Opel Combo | 11 |
| Opel Movano | 13 |
| Opel Vivaro | 14 |
| Peugeot Boxer | 7 |
| Peugeot Expert | 12 |
| Peugeot Partner | 5 |
| Renault Kangoo | 11 |
| Renault Master | 16 |
| Renault Trafic | 16 |
| Toyota ProAce | 3 |
| Toyota Proace | 7 |
| Volkswagen Caddy | 31 |
| Volkswagen Crafter | 14 |
| Volkswagen Transporter | 16 |
| Volkswagen Transporter / Multivan / Caravelle | 1 |

Courier, ProAce City and Scudo remain researched gaps without a promoted defensible profile in this batch. Newer Sprinter/Vito 1,950 cc, some 2.0 Crafter/Transporter outputs and 2020+ van stock-torque/generation variants still fall back. No shared Stellantis or Transit sibling is matched merely by displacement and hp. ProAce City cannot borrow a ProAce profile even when no City sibling exists in the dataset.

### Kia / Hyundai

**99 source-backed identities**, all exercised by V2 acceptance. Hyundai Kona: 1; Hyundai Tucson: 11; Hyundai i20: 7; Hyundai i30: 16; Kia Ceed: 20; Kia Picanto: 4; Kia ProCeed: 5; Kia Rio: 3; Kia Sorento: 5; Kia Sportage: 23; Kia Stonic: 2; Kia X-Ceed: 2. The required Sportage, Ceed, ProCeed, Sorento, Stonic, i30, Tucson and Kona applications are present. Niro has no ordinary ICE application: both generations are electrified. Seven dedicated hybrid controls remain unsupported, while the older conventional Suzuki 140 PS application remains usable. Full-suite ambiguity and wrong-model/generation controls remain in force.

## 5. Stages and NoordTune prices

- Sourced Stage 1: **985/985 accepted profiles**. That is dataset availability, not 100% RDW fleet matching.
- Sourced Stage 2: **269**, versus V1's 224. Missing Stage 2 uses the existing compatible-catalog/generic range policy.
- Numerical sourced Stage 3: **4**. Other **981** profiles remain custom/hardware-dependent. Numeric Stage 3 still does not establish an unscoped quote.
- Draft pricing remains €299/449/699 classic; €399/549/799 standard 2010s; €449/599/899 modern; €549/699/999 higher complexity; advanced Stage 1 from €700 with higher stages scoped individually. The existing 27 explicit assignments are unchanged. No competitor-price import or age-only unlock inference.

Real RDW sample price classes: **117 standard 2010s, 38 modern, 33 higher complexity, 3 advanced, 0 classic, 31 on request**. This distribution is identical to V1 on the same sample. Source-derived full-runtime fixture price classes: `{"standard-2010s":452,"contemporary-standard":16,"higher-complexity":245,"advanced-unlock":11,"modern-standard":261}`. These are declared QA cohorts, not population price distributions.

## 6. Real registrations and browser QA

**222 real registrations**, 28 makes, 74 exact groups, 253 fuel rows. Six bounded verification queries confirmed all records remained non-exported with a registration-holder date and transfer permitted. The sample deliberately covers makes/models/vans; it is not random. Only hashed registration IDs or normalized identities persist. No plate-specific runtime override exists.

| Layer | V1 on same sample | V2 |
| --- | --- | --- |
| A | 2 | 12 |
| B | 10 | 54 |
| C | 12 | 5 |
| D | 167 | 120 |
| E | 31 | 31 |

Sourced results rise **12 → 66**: **54 gains, zero losses**. Model errors **0**; registered-stock-output errors **0**; unsupported ordinary-ICE assignments **0**. The report retains every detected identity, selected profile, Stage 1/2/3 result, price category and reason in `v2-rdw-validation.json`.

Production browser checks: **23 cases / 17 real registrations**, plus **28 existing owner/synthetic regressions** and **9 public/manual Stage 3 cases**. NL/EN/PL and 320/1440 px cover numeric/range/custom stages, curves, source copy, actual RDW stock, prices, options, WhatsApp agreement and overflow/runtime errors. WhatsApp links are inspected, not sent. The owner's Transit Connect case retains its conditional TDCi/EcoBlue treatment. Screenshots across all five resolution classes and owner/Stage 3 cases were visually inspected; no overflow or browser errors remained.

The source-derived cohort adds **24857 assertions across 985 distinct identities**, including 966 non-public identities. It is not presented as fleet coverage. The separately reported canonical ICE cohort remains 2,962 identities: `{"A":14,"B":98,"C":1626,"D":1224,"E":0}`; generic fallback declines from V1's 1,251 to 1224. Known canonical cross-products and incomplete displacement remain explicitly flagged.

## 7. Performance and server/client boundary

Same-process alternating matcher benchmark, Node v24.19.0 on Windows, 985 profiles:

| Metric | Median | p95 |
| --- | --- | --- |
| Exhaustive source matcher | 0.716 ms | 1.058 ms |
| Indexed source matcher | 0.097 ms | 0.308 ms |
| Warm full resolver | 0.621 ms | 2.742 ms |
| Production normalizer, 222 records | 6.329 ms | 26.522 ms |
| Actual browser HTTP round trip | 271.413 ms | 586.275 ms |

Cold source-index construction: 3.509 ms. Source index adds 357,272 heap bytes after GC; process RSS/heap after the full benchmark: 320.57 / 113.41 MiB. Runtime imports include the existing large canonical catalog. These are local measurements, not hosted latency promises.

Normalized API-shaped payload: median **4,954 B**, p95 **5,209 B**, max **7,090 B**. Actual HTTP sample: median **5,076 B**, p95 **6,056 B**, max **7,204 B**. Owner-case max 8,748 B. Network/cache and pure-resolver costs are recorded separately.

Browser JS: **1,422,708 bytes / 25 chunks**, **0 bytes versus V1** (1,422,708 B). **CLIENT_IMPORTS_SERVER_CATALOG: 0**. **CLIENT_IMPORTS_SOURCED_PROFILE_DATASET: 0**. Build scan checks 58,562 non-public canonical IDs and 985 sourced IDs. Selected small API/HTML DTOs are intentionally permitted.

Index/exhaustive equivalence: **2955 source comparisons**, **77 complete catalog assessments**. Same-make sibling checks retain model safety even when a sibling has a different fuel/power/year. Identity and ambiguity rules are unchanged by indexing.

## 8. Validation, preview and protected refs

| Command/check | Result |
| --- | --- |
| pnpm catalog:audit | PASS — 0 critical issue groups; 18 existing warning groups |
| pnpm test:tuning | PASS — all existing suites |
| pnpm test:nl-fleet-v2 | PASS — 99 Kia/Hyundai fixtures; 0 failures |
| pnpm lint | PASS — 0 warnings/errors |
| pnpm typecheck | PASS |
| pnpm build | PASS |
| check-tuning-build.ts | PASS — no dataset leaks |
| Live + owner + Stage 3 browser QA | PASS — 60 cases |

Tests/build run in a disposable copy of the actual working-tree snapshot; V1 historical generated audit/coverage documents remain unchanged. New evidence is stored under `v2-*.json` and `browser-v2/`. Public catalog **24**; sitemap **291**. No bulk SEO or UI redesign.

Vercel deployed the Draft PR successfully: [preview](https://noordtune-power-catalog-git-fe-fe6e40-bartekkolek1098s-projects.vercel.app). The public request receives **302 to Vercel SSO**; hosted product/browser QA requires the existing preview access. No authentication bypass was attempted. The production-build browser QA above used the local build. The final GitHub head/check status is rechecked after the QA commit is pushed.

Protected refs remain unchanged: #13 Draft `3484b24c06491c4305add40067b0ba0e66aba7e5`; #14 Draft `d92bcd179813d1587e82e7f3a12ee5f1914648df`; #12 Draft `15d67ae15c3db7e90195b99e167ec4614ec884dd`; main `4d12e510953fb57c3f8f84a737880ff860a617e7`. Latest production deployment remains **5965036463**, 18 August 2026, at that main SHA. No noordtune-www changes, merge, Ready transition, squash or force push.

## 9. Remaining highest-priority Dutch gaps

| Priority | Exact RDW model / cc | Admission band | Exact group count | Derived class |
| --- | --- | --- | --- | --- |
| 1 | MERCEDES-BENZ SPRINTER / 1950 | 2020–2024 | 26,860 | D |
| 3 | VOLKSWAGEN CADDY MODIFIED PARTITION WALL / 1968 | 2020–2024 | 22,215 | D |
| 4 | VOLKSWAGEN CRAFTER / 1968 | 2020–2024 | 21,129 | D |
| 6 | VOLKSWAGEN CADDY / 1968 | 2015–2019 | 19,862 | D |
| 7 | RENAULT MASTER / 2299 | 2020–2024 | 17,697 | D |
| 8 | VOLKSWAGEN TRANSPORTER / 1968 | 2020–2024 | 20,302 | D |
| 9 | MERCEDES-BENZ VITO / 1950 | 2020–2024 | 15,936 | D |
| 10 | OPEL VIVARO-B / 1598 | 2015–2019 | 13,703 | D |
| 14 | PEUGEOT PARTNER / 1560 | 2015–2019 | 11,260 | D |
| 15 | FORD TRANSIT / 1995 | 2020–2024 | 10,632 | D |
| 16 | FORD FOCUS / 1596 | 2005–2009 | 15,329 | D |
| 17 | VOLKSWAGEN GOLF / 1498 | 2020–2024 | 15,182 | D |
| 19 | FORD TRANSIT CONNECT / 1499 | 2015–2019 | 8,902 | D |
| 20 | FORD TRANSIT CONNECT / 1499 | 2020–2024 | 8,817 | D |
| 21 | MAN TGE / 1968 | 2020–2024 | 8,354 | D |
| 22 | RENAULT TRAFIC / 1997 | 2020–2024 | 26,196 | D |

The principal blockers are missing output variants, unresolved generation/stock-torque differences, missing manufacturer engine-family mappings, unsupported hybrids, and unavailable or incomplete public source tables. V-Tech's accessible module products cannot fill remap evidence gaps; BR/Celtic access stops remain in place. Sourced presence for one variant does not cover a model's whole RDW displacement group. The next research work should follow these specific gaps and corroborate the **182 remaining V1 single-source profiles**, rather than grow generated year rows or weaken matching.

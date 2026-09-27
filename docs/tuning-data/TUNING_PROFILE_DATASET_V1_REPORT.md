# Tuning Profile Dataset V1

## Review status

This is the **validated dataset and integration checkpoint** for `feature/tuning-profile-dataset-v1`, stacked on `fix/tuning-identity-year-quote-policy` at `3484b24c06491c4305add40067b0ba0e66aba7e5`. [Stacked Draft PR #14](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/14) is open; implementation commit: `2a6135b`. Generation-boundary corrections, six final VAG source additions, the full automated suite, final production build and 37 browser cases are complete. The final-head Vercel Preview result is recorded in the Draft PR checks and handoff. The figures below describe the frozen artifacts inspected on 16 September 2026.

The dataset contains **280 accepted model/engine/output profiles**, including **50 with independent Stage 1 corroboration**. This materially improves the specifically researched cohort. Across the much larger existing canonical ICE inventory, generic fallback declines only **1,275 → 1,251**. The researched-cohort result must not be presented as fleet-wide coverage or 100% verified tuning support.

### Artifact authority

- [Validation summary](validation-summary.json), [RDW browser acceptance](browser/browser-acceptance.json), [public/manual Stage 3 acceptance](browser/public-stage3-acceptance.json) and [browser bundle check](browser-bundle-check.json).

- [Source observations](../../data/research/source-pages.json): original factual values, identity, retrieval evidence, supporting URLs and exclusions.
- [Normalized server profiles](../../src/data/tuning-profiles/profiles.json) and [consensus manifest](../../data/research/profile-consensus.json): selected values and every accepted Stage source value.
- [Conflicts and rejected observations](../../data/research/unresolved-conflicts.json).
- [Executable coverage output](../../data/research/coverage-report.json): fingerprint `682061ad79e195338c38edac55f9c00688d06cf0767d5496b500c70ad271e718`.
- [Generation boundaries](../../data/research/generation-boundaries.json), [research workflow](../../data/research/README.md), [Ford/Kia applicability notes](../../data/research/ford-kia-hyundai-notes.md) and [Mercedes stock validation](../../data/research/mercedes-stock-validation.json).

## Research and acceptance

| Measure | Checkpoint result |
|---|---:|
| Source observations / distinct source URLs | 361 / 359 |
| Retrieved observations / distinct retrieved URLs | 358 / 356 |
| Accepted tuning-source observations | 333 |
| Manufacturer supporting observations | 16 |
| Rejected or unavailable tuning observations | 12 |
| Accepted profiles | 280 |
| Stage 1 multi-source / single-source profiles | 50 / 230 |
| Profiles with sourced Stage 1 / Stage 2 / Stage 3 | 280 / 224 / 4 |
| Profiles with a material disagreement or anomaly in any Stage | 16 |
| Unmerged stock-variant conflict groups | 8 |
| Profiles requiring owner review | 280 |
| Diesel / petrol profiles | 187 / 93 |
| Exact / nominal displacement profiles | 25 / 255 |
| Profiles with no published/derived final year bound | 44 |
| Profiles with explicitly flagged generation-scope adjustments | 233 |

Observation counts are records in the manifest, not all HTTP requests. Discovery calls, robots checks, category support pages and retries do not become additional tuning profiles. A second provider corroborates a configuration; it does not create another configuration. Manufacturer stock validation supplies no tuning output. All 280 profiles require owner review; none is presented as a measured or owner-approved NoordTune hardware setup.

### Source distribution

| Provider | Observations | Retrieved | Accepted tuning observations |
|---|---:|---:|---:|
| Shiftech | 279 | 278 | 276 |
| Mosselman | 36 | 36 | 36 |
| Unlimited Tuning NL | 28 | 28 | 21 |
| Manufacturer publications | 16 | 16 | 0; stock/support evidence |
| BR-Performance | 1 | 0 | 0; blocked |
| Celtic Tuning | 1 | 0 | 0; blocked |

BR-Performance and Celtic returned access blocks. Requests stopped; no alternate endpoint, proxy, CAPTCHA or authentication bypass was used. Their search snippets are not accepted tuning evidence. Shiftech's direct HTTP response is often an application shell: accepted tables came from actual rendered public pages, and their hashes identify that rendered extraction rather than invented raw HTTP responses. Mosselman, Unlimited and manufacturer evidence use the actual retrieved public pages. Raw HTML/rendered captures remain under `.git/tuning-dataset-v1`, outside committed artifacts.

## Identity, consensus and Stage policy

Profiles retain brand, exact model family, generation, source year scope, fuel, stock output, displacement precision and verified engine details. A nominal label such as `1.5` is not asserted to be exact `1500 cc`. Unknown cylinders, codes, transmission and installed ECU remain unknown. Manufacturer-linked stock fields support 24 profiles; 30 have multi-source stock quality and 226 single-source stock quality. This field-level stock classification does not validate the whole calibration or an individual vehicle.

Counterpart groups require reviewed applicability and retain each original observation. Effective years use the source intersection plus recorded generation-boundary evidence. Each independent provider receives one vote. Close outputs use a conservative rounded consensus; materially different outputs retain conservative values and an owner-review flag. Stage 1 agreement is strong for 36 profiles, acceptable for 230, and conflicting for 14; two further profiles have a conflict or anomaly at another Stage. Eight stock-variant groups remain unmerged. Source values are not silently replaced.

Stage 2 is numerical where a real applicable source supplies it. Where missing, the runtime may retain a compatible catalog estimate or a clearly labelled emergency indication; it does not call that a sourced Stage 2. Unlimited's `Normal` package is mapped to Stage 1 using its retrieved package explanation. `Xtreme`/`Stage 1+` are not relabelled as Stage 2.

Four profiles have published numerical Stage 3 references. They remain hardware-dependent technical references, with no automatic commercial approval. Other customer Stage 3 cards display **“Maatwerk / hardware-afhankelijk”**, **“Custom / hardware-dependent”** or **“Indywidualnie / zależnie od osprzętu”**. Unscoped Stage 3 quotes remain on request, including when an external source publishes an output. Retained original catalog data is unchanged; the presentation policy masks unsupported Stage 3 values.

Runtime order is reviewed/approved applicability, independent sourced consensus, single-source model/engine facts, compatible existing catalog, then emergency generic indication. Identity conflicts are not resolved by choosing the largest source count. Sourced outputs appear as one approximate value; source disagreement remains in technical details. Charts illustrate peak values and are not dyno measurements.

## Brand and family coverage

| Research family | Accepted profiles | Included applications |
|---|---:|---|
| Ford | 35 | Transit, Transit Custom, Transit Connect, Fiesta and Focus; EcoBlue/TDCi and EcoBoost/ST |
| BMW | 40 | B38, B47, B48, B58, N47 and N57; separate model/generation/output scopes |
| VAG | 63 | Volkswagen 37, Audi 12, Seat 7, Skoda 7; 1.6/2.0/3.0 TDI, 1.4/1.5/1.8 TSI and selected performance petrol applications |
| Mercedes-Benz | 20 | A/C/E-Class and Vito; 1.5/1.6/2.0/2.1 diesel, A45 M133/M139 applications |
| PSA/Opel/Toyota commercial group | 29 | Peugeot 15, Citroën 5, Opel 6, Toyota 3; 308, Expert/Traveller, Jumpy, Vivaro, ProAce, Boxer, Jumper and Movano |
| Renault | 16 | Mégane, Clio and Trafic; 1.5/1.6/2.0 dCi and TCe |
| Kia/Hyundai | 39 | Kia 27 and Hyundai 12; Sportage, Ceed, ProCeed, Sorento, i30 and Tucson |
| Volvo | 10 | Selected D3/D4/D5 and turbo-petrol applications |
| Land Rover/Jaguar | 10 | Land Rover 6 and Jaguar 4; researched diesel applications |
| Fiat/Alfa Romeo/Jeep | 18 | Fiat 7, Alfa Romeo 7, Jeep 4; selected MultiJet/JTD and turbo-petrol applications |

These are observed combinations, not cross-products of brands, engines and years. They do not cover every requested family output or all generations. Source generation names and original provider year claims are retained. The regenerated scope corrections use documented generation evidence and flag 233 adjusted profiles for review, without pretending that a category start establishes an exact engine introduction date.

### Mandatory family results and remaining ambiguities

- **Kia/Hyundai:** 39 distinct accepted fixtures resolve to sourced profiles, including 27 Kia fixtures across several models. Sportage 1.6 CRDi 116 and 136, T-GDI 160/177 and Ceed/ProCeed 1.0/1.4/1.6 applications are represented. The fetched Sportage 150 48V observation is retained as research but rejected from ordinary ICE runtime acceptance. A non-hybrid 150 claim is not inferred from it. The 2024-labelled CRDi 136 page supplies 160/340 Stage 1 and 170/360 Stage 2; the 2021-labelled 136 page instead supplies 150/360 and different stock torque. They remain separate scopes, not a single universal Sportage value. Missing electrification detail still requires verification.
- **Ford:** 35 sourced fixtures cover both vans and passenger vehicles. Transit Custom 105 currently uses the external 190/460 Stage 1 reference with explicit NoordTune owner-review wording. Transit Connect TDCi/EcoBlue cannot be distinguished from a 2018 registration or opaque RDW type alone; explicit evidence is required for the sourced family. A missing 2025 Custom page and an inadequately scoped independent Connect counterpart are excluded.
- **BMW:** 40 fixtures, 32 resolving to the sourced layer. Eight fixtures retain generic fallback because stock-torque variants remain ambiguous: two F20/F21 N47 116d, four F30/F31 LCI or G20/G21 B48 320i, and two G30/G31 B58 540i. Corrected generation scopes restore these competing variants instead of hiding the conflict behind an erroneous year exclusion. B38 1499 cc is kept separate from earlier 1598 cc 118i applications. RON 98 conditions and manufacturer support remain attached where sourced. Access/lock status is not inferred solely from registration year.
- **VAG:** 63 fixtures, 59 using the sourced layer. The final six actual pages add Passat B8 1.6 TDI 120, Golf VI 2.0 TDI 110, Transporter/Multivan/Caravelle T6 2.0 TDI 204, Audi A3 8V 1.8 TSI/TFSI 180, source-generation-2005 Octavia 1.8 TSI/TFSI 160 and Leon 5F MK2 2.0 TSI 300. These are literal source identities; EA888 codes or Cupra branding are not inferred. Four Golf GTI 230/245 cases retain compatible catalog or generic fallback when multiple technical variants remain plausible. Publication or a familiar badge does not authorize arbitrary variant selection.
- **Vans:** 46 explicitly named van/commercial fixtures move from C=9/D=37 to A=3/B=43 in the researched cohort. This is a targeted regression cohort, not a Dutch commercial fleet statistic.

## Coverage: two different denominators

Classes: **A** reviewed/multi-source; **B** single-source; **C** existing compatible catalog; **D** generic fallback; **E** unresolved. At this checkpoint A is external corroboration, not proof of NoordTune measurements or owner approval.

| Cohort | Distinct identities | Before A/B/C/D/E | After A/B/C/D/E | Generic before → after |
|---|---:|---|---|---|
| Researched technical fixtures | 280 | 0 / 0 / 69 / 211 / 0 | 50 / 218 / 2 / 10 / 0 | 75.36% → 3.57% |
| Entire canonical supported ICE inventory | 2,962 | 0 / 0 / 1,687 / 1,275 / 0 | 2 / 53 / 1,656 / 1,251 / 0 | 43.05% → 42.23% |
| Canonical complete-identity subset | 2,115 | 0 / 0 / 1,686 / 429 / 0 | 2 / 52 / 1,655 / 406 / 0 | 20.28% → 19.20% |

The 58,586 raw canonical rows collapse to 3,197 technical identities; 235 have unsupported powertrains. Among supported ICE identities, 837 have incomplete displacement and 168 have known cross-product problems, with overlapping exclusions. Generated templates remain unvalidated even when syntactically complete. The canonical cohort uses each identity's median source year as deterministic regression context, not a real first admission. No real plates or owners occur in these synthetic cohorts.

The large researched-cohort reduction is therefore not the all-ICE reduction. The whole supported canonical inventory improves by **24 generic cases**, or **0.81 percentage points**. The 2,907 remaining canonical identities outside the sourced layers still include generated-template problems and broad missing coverage; they form a research backlog, not an approved fitment list. The `exhaustiveCanonicalCohort` section contains the full inventory measurement.

### Researched fixtures by requested group

| Researched group | Fixtures | Before A / B / C / D / E | After A / B / C / D / E |
|---|---:|---|---|
| All supported ICE | 280 | 0 / 0 / 69 / 211 / 0 | 50 / 218 / 2 / 10 / 0 |
| Priority European research brands | 239 | 0 / 0 / 58 / 181 / 0 | 50 / 177 / 2 / 10 / 0 |
| VAG | 63 | 0 / 0 / 16 / 47 / 0 | 9 / 50 / 2 / 2 / 0 |
| BMW | 40 | 0 / 0 / 6 / 34 / 0 | 31 / 1 / 0 / 8 / 0 |
| Mercedes-Benz | 20 | 0 / 0 / 1 / 19 / 0 | 3 / 17 / 0 / 0 / 0 |
| Ford | 35 | 0 / 0 / 3 / 32 / 0 | 1 / 34 / 0 / 0 / 0 |
| Vans/commercial | 46 | 0 / 0 / 9 / 37 / 0 | 3 / 43 / 0 / 0 / 0 |
| PSA/Stellantis | 44 | 0 / 0 / 17 / 27 / 0 | 2 / 42 / 0 / 0 / 0 |
| Kia/Hyundai | 39 | 0 / 0 / 23 / 16 / 0 | 2 / 37 / 0 / 0 / 0 |

### Whole canonical ICE inventory by requested group

This table measures all supported technical identities in the existing inventory, including incomplete and unvalidated generated templates. It is separate from the deliberately researched fixtures above.

| Whole-inventory group | Identities | Before A / B / C / D / E | After A / B / C / D / E |
|---|---:|---|---|
| All supported ICE | 2,962 | 0 / 0 / 1,687 / 1,275 / 0 | 2 / 53 / 1,656 / 1,251 / 0 |
| Priority European research brands | 2,185 | 0 / 0 / 1,191 / 994 / 0 | 2 / 43 / 1,170 / 970 / 0 |
| VAG | 826 | 0 / 0 / 664 / 162 / 0 | 1 / 22 / 654 / 149 / 0 |
| BMW | 362 | 0 / 0 / 2 / 360 / 0 | 1 / 0 / 1 / 360 / 0 |
| Mercedes-Benz | 305 | 0 / 0 / 1 / 304 / 0 | 0 / 0 / 1 / 304 / 0 |
| Ford | 157 | 0 / 0 / 103 / 54 / 0 | 0 / 9 / 100 / 48 / 0 |
| Vans/commercial | 168 | 0 / 0 / 126 / 42 / 0 | 0 / 2 / 124 / 42 / 0 |
| PSA/Stellantis | 452 | 0 / 0 / 374 / 78 / 0 | 0 / 8 / 366 / 78 / 0 |
| Kia/Hyundai | 153 | 0 / 0 / 120 / 33 / 0 | 0 / 9 / 114 / 30 / 0 |

Groups overlap and must not be added. VAG normalizes Volkswagen, Audi, Seat/SEAT, Skoda and Cupra names. The priority group is the explicit research list: Ford, BMW, Volkswagen, Audi, Seat, Skoda, Cupra, Kia, Hyundai, Mercedes-Benz, Peugeot, Citroën, Opel and Renault; it is not a fleet-size or manufacturer-origin claim. PSA/Stellantis includes Peugeot, Citroën, DS Automobiles, Opel, Fiat, Alfa Romeo and Jeep. Toyota commercial profiles belong to vans, not PSA/Stellantis; the separate 29-profile research-family grouping above follows batch ownership. Vans use the declared commercial model-name list in the coverage test, not a claim about every vehicle's registration class.

## NoordTune draft pricing

Technical output and commercial scope are separate. Competitor prices are not used. The [commercial policy](../tuning-qa/runtime/RUNTIME_PRICING_POLICY.md) resolves explicit assignments, access/complexity and platform/category rules. Existing reviewed explicit assignments remain exceptions. Amounts include VAT; final vehicle, ECU and hardware scope require confirmation.

| Draft category | Stage 1 | Stage 2 | Stage 3+ if explicitly scoped |
|---|---:|---:|---:|
| Classic/simple | €299 | €449 | €699 |
| Standard 2010s | €399 | €549 | €799 |
| Modern standard | €449 | €599 | €899 |
| Higher complexity/performance/commercial | €549 | €699 | €999 |
| Applicable advanced-unlock scenario | From €700 | Individual | Individual |

In the 280 researched runtime Stage 1 fixtures: **147 standard-2010s, 34 modern-standard, 13 retained contemporary-standard assignments, 75 higher-complexity and 11 advanced-unlock**. Amounts are €399×147, €449×47, €549×75 and €700×11. No fixture happens to satisfy the full classic rule; the €299 category is still tested separately. These are scenario counts, not expected sales or final quotes. All unscoped runtime Stage 3 work remains on request.

## Validation checkpoint

| Check | Latest reported result |
|---|---|
| Catalog audit | Pass: zero critical findings, 18 warning groups; 24 public vehicles, 58,586 canonical rows, 175,758 retained Stages, 291 sitemap entries |
| Production build | Pass: 298 routes |
| Lint / nonincremental typecheck | Pass |
| Full `test:tuning` suite | Pass, including all matcher, estimate, RDW, consensus, dataset, surface and boundary suites |
| Broad sourced/runtime dataset suite | 7,277 assertions; 280 distinct fixtures, including 264 non-public fixtures; zero recorded failures |
| Surface integration | 672 assertions across public DTOs, charts, Stage policy, Offers, options, locales and WhatsApp, including actual BMW 340i Stage 3 hardware requirements |
| Sourced profile/pricing bridge | 421 assertions |
| Focused VAG matching | 123 assertions |
| Focused quote policy / consensus | 33 quote tests / 17 consensus tests passing |
| Safety coverage | Wrong model/fuel/displacement/year/power, ambiguous Connect family, naturally aspirated fallback, hybrid/EV/LPG controls; no inferred gearbox/TCU eligibility |
| Static client/server boundary | Zero server-catalog imports across 63 reachable client modules |
| Production client bundle | 25 chunks, 1,422,708 bytes; PR #13 baseline 1,419,276 bytes, increase 3,432 bytes (0.24%). Zero leaks across all 280 sourced IDs and 58,562 non-public canonical IDs |
| Final browser QA | Final build: 28 RDW plus 9 public/manual cases passed, zero errors. Numeric chart curves stop before the custom Stage 3 axis position; expanded BMW hardware details and WhatsApp checks pass on mobile and desktop. Six final screenshots reviewed, including the corrected table |
| Stacked Draft PR / implementation SHA / Vercel Preview | [Draft #14](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/14), implementation commit `2a6135b`; this report records the final test/artifact commit. The final-head Preview is tracked in the PR checks; no merge or production deployment |

The original canonical figures, curated membership and sitemap scope remain intact. Customer policy changes do not bulk-publish researched profiles as SEO routes. WhatsApp uses the same selected output and scoped quote as the UI, retaining actual first-registration facts when supplied. Custom work stays selectable without invented output, gain or Offer price.

## Limitations, refresh and next research

1. **Stock-variant ambiguity:** five independent Mercedes/PSA/Renault observations disagree on stock torque and are not merged. The conflict manifest also records eight stock-variant groups. BMW and Golf variants require further technical disambiguation. A source-count advantage is not evidence of the installed engine.
2. **Generation scope:** source category starts are not always engine introduction dates. Corrections now retain the original observations and explicitly flag 233 adjusted profile scopes. Published end bounds, intersections and successor evidence remain reviewable; 44 profiles remain open-ended. These conservative bounds do not establish every engine's exact introduction or withdrawal date.
3. **Powertrain scope:** explicit mild-hybrid evidence is excluded from ordinary ICE acceptance; absent electrification data is unknown. Hybrid/EV/LPG controls do not receive ordinary sourced ICE results.
4. **Stage/hardware anomalies:** real Stage 2 data is absent for 56 profiles. The Expert 95 source table retains lower Stage 2 torque than Stage 1 as an explicit conflict requiring review. A compact localized warning covers source disagreement and inconsistent Stage progression, including WhatsApp. Specific sourced hardware and fuel requirements remain visible in technical details and are carried into the selected Stage's WhatsApp request. Published Stage 3 figures do not establish a NoordTune hardware package or commercial approval.
5. **Source diversity:** Shiftech supplies most applications. Revisit blocked providers only when normal public access is available; do not circumvent the recorded stops. Prioritize independent corroboration for vans, Kia variants, disputed BMW/Golf outputs and missing generation transitions.
6. **Remaining breadth:** extend [the ranked backlog](../tuning-qa/TUNING_PROFILE_BACKLOG.md) using actual applicable pages, especially unrepresented outputs, non-hybrid Sportage 150 evidence, engine-code/cc validation and commercial variants. Validate generated templates before treating their gaps as real market demand. Rankings are qualitative owner/test priorities, not invented fleet statistics.

Refresh bounded provider batches through the shared paced/cache-aware fetcher. Recheck access policy, capture actual page facts and retrieval/hash metadata, compare each change, review counterpart/stock/hardware conflicts, rebuild the dataset and regenerate both coverage cohorts. Never replace an unavailable fact with a search snippet or silently advance a profile's year range. The manifests support a factual diff; raw source pages remain outside Git.

External factual research is reference material, **not NoordTune measurements, a guarantee of achievable output, or proof of vehicle/ECU compatibility**. Competitor prose, images, dyno graphs and pricing are not reproduced as product content. NoordTune wording and draft commercial prices are independent. Provider names and applicability evidence belong in technical/reference details.

## Git and deployment boundary

[Stacked Draft PR #14](https://github.com/bartekkolek1098/noordtune-power-catalog/pull/14), “Build sourced tuning profile dataset V1”, is open with base `fix/tuning-identity-year-quote-policy` and head `feature/tuning-profile-dataset-v1`. Implementation commit is `2a6135b`; the accompanying test/report commit records acceptance evidence. PR #13 remains Draft; main, production, PR #12 and `noordtune-www` remain outside this implementation. The final-head Vercel Preview status is available from the Draft PR checks and handoff. No merge or production change is claimed.

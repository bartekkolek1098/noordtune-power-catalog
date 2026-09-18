# V3.2 release-candidate verification

**BLOCKED.** No product/code/data correction was made. Only neutral review artifacts accompany this audit.

- Main/baseline: `4d12e510953fb57c3f8f84a737880ff860a617e7`.
- Audited candidate: `b3e6f9225cb90948a8d1d60b21967984cc9e6a14` (23 ahead, 0 behind; clean preflight).
- Complete stack: Draft #13 identity/estimates/pricing → #14 dataset V1 → #15 Dutch fleet V2 → #16 V3/V3.1/V3.2. No merge, retarget or Ready action.

## Release blockers

1. **RC-01 — persisted owner identifiers:** 18 tracked QA text files and 12 tracked filenames contain owner plate identifiers. Examples: `docs/tuning-qa/runtime/live-rdw-identities.json`, `docs/tuning-qa/runtime/browser-acceptance.json`, `docs/tuning-data/browser-v3-2/browser-acceptance.json`. This fails the requested source-control privacy condition. New audit artifacts use anonymous cases A–D in request order.
2. **RC-02 — precedence requirement:** `src/lib/rdw-tuning-estimate.ts` checks sourced profiles before retained references. BMW 128ti 1998 cc / 265 PS / 2020 returns sourced **305/490**, not reference **310/480**; Transit Custom 1995 cc / 105 PS / 2019 returns sourced **190/460**, not reference **190/440** (PS/Nm). These are frozen V3.2 results, not new audit regressions. Reference-first ordering and unchanged V3.2 selection cannot both be certified. Legacy hierarchy tests test the fallback resolver, not this production precedence.
3. **RC-03 — absolute URL privacy condition:** WhatsApp hrefs intentionally encode the plate in quote text; the legacy GET lookup also accepts a plate query. The homepage uses POST and its navigation/SEO contains no entered plate; no analytics integration was found in `src`. An explicit exception or follow-up correction is required to satisfy the literal no-plate-in-URLs condition. No message was sent.

## Complete main → candidate scope

23 commits; 337 files; approximately +1,714,180 / −833 text lines. 95 source-code files span product and QA tooling. Exclusive inventory categories: 38 runtime/config, 98 generated/data JSON, 122 documentation/QA, 79 binary screenshots; no unrelated paths found. Two runtime dataset JSON files are counted in data, bringing the runtime/config/data inventory below to 40.

<details><summary>Exact runtime/config/data files in the audited stack</summary>

```text
package.json
src/app/[locale]/[brand]/[model]/[engine]/[stage]/page.tsx
src/app/[locale]/page.tsx
src/app/[locale]/vehicles/[vehicleId]/page.tsx
src/app/api/catalog-selector/route.ts
src/app/api/rdw-lookup/route.ts
src/components/manual-selector.tsx
src/components/plate-lookup.tsx
src/components/power-chart.tsx
src/components/reference-estimate-details.tsx
src/components/seo-info-sections.tsx
src/components/vehicle-detail.tsx
src/data/catalog-matching.ts
src/data/catalog-selector.ts
src/data/catalog-shared.ts
src/data/catalog.ts
src/data/pricing.ts
src/data/runtime-pricing.ts
src/data/tuning-estimates-shared.ts
src/data/tuning-estimates.ts
src/data/tuning-heuristics.ts
src/data/tuning-profiles/consensus.ts
src/data/tuning-profiles/index.ts
src/data/tuning-profiles/schema.ts
src/data/tuning-reference-research.ts
src/lib/catalog-verification-copy.ts
src/lib/estimate-chart.ts
src/lib/estimate-copy.ts
src/lib/quote-offer.ts
src/lib/rdw-date.ts
src/lib/rdw-tuning-estimate.ts
src/lib/rdw.ts
src/lib/seo.ts
src/lib/sourced-powertrain.ts
src/lib/sourced-tuning-match.ts
src/lib/stage-hardware-policy.ts
src/lib/vehicle-services.ts
src/lib/whatsapp.ts
src/data/tuning-profiles/profiles.json
src/data/tuning-profiles/source-index.json
```

</details>

Expected visible changes: first-admission date/year; useful conditional technical figures; per-stage source labels/details; corrected VAT-inclusive software quote tiers; ECU verification notes; custom Stage 3 scope; matching WhatsApp text. Public catalog remains 24 vehicles and sitemap 291 URLs.

## Visual and browser review

Exact main was installed/built in a detached disposable worktree and served on 3119; candidate production build on 3120. Compared **320, 390, 768, 1024, 1440 px**. Homepage header, hero, form, footer and typography/color/border/padding samples match at every width; documents remain within viewport. Result cards, chart, prices, options, warnings and CTA retain the design with expected content and wrapping changes. No unexpected design drift found. Main already clips some hero/navigation content at 320 px; this is unchanged, not repaired here.

145 browser cases passed: 22 genuine owner HTTP cases, 123 explicitly intercepted deterministic sourced-profile cases; NL five widths plus EN/PL compact checks. Actual curves/range bands, all three stage selections, options, quote text, provenance, internal-ID visibility and overflow assertions passed. Zero runtime errors. Six screenshots: [mobile main](release-v3-2/baseline-home-320.png), [mobile candidate](release-v3-2/candidate-home-320.png), [desktop main](release-v3-2/baseline-home-1440.png), [desktop candidate](release-v3-2/candidate-home-1440.png), [result main](release-v3-2/baseline-result-390.png), [result candidate](release-v3-2/candidate-result-390.png).

| Owner case | Official identity / first admission | Registered stock | Stage 1 | Stage 1 quote |
|---|---|---|---|---|
| A | LAND ROVER DEFENDER; 1999 cc; Diesel; 2020-06-12 | 177 kW / 241 PS | 290 PS / 590 Nm | €549, indicative incl. VAT |
| B | FORD TRANSIT CONNECT; 1499 cc; Diesel; 2018-10-17 | 73.5 kW / 100 PS | 125 PS / 330 Nm | €449, indicative incl. VAT |
| C | FORD TRANSIT CUSTOM; 1995 cc; Diesel; 2019-04-29 | 77 kW / 105 PS | 190 PS / 460 Nm | €549, indicative incl. VAT |
| D | BMW 128TI; 1998 cc; Benzine; 2022-09-14 | 195 kW / 265 PS | 305 PS / 490 Nm | €700, indicative incl. VAT |

All four preserve recorded RDW identity and previously reviewed stage/quote outputs; first-admission year, all three cards, technical values/ranges, options and selected-stage WhatsApp agree. **B** remains 1499 cc Connect with conditional TDCi/EcoBlue handling; **C** remains 1995 cc Custom; **D** retains the reviewed V3.2 265-PS-class / 2022 result and conditional unlock wording without claiming an installed lock. **A** retains useful figures. See RC-02 for the distinction between frozen V3.2 outputs and the retained older reference layer.

## Pricing and stages

Pricing tests pass: Stage 1/2 indicative incl. VAT = classic diesel **€299/449**, ordinary 2010s **€399/549**, modern **€449/599**, higher complexity **€549/699**. Explicit BMW advanced-unlock scenario is **€700 / later stages on request**, without inferring installed lock. Unresolved identity conflict and unapproved custom Stage 3 stay on request. Options are added once; unknown ECU does not erase estimates. **No €269 customer quote path found**: surviving catalog literals are legacy inputs; the compatibility mapping resolves 269 to the €299 tier. Stage 3 numeric software schedules require an approved scope and do not invent hardware totals.

Per-stage source facts, canonical/generic fallback, publication-independent coverage, exclusion of Stage 1+ and modules, generic labels and numeric Stage 3 hardware conditions pass existing regressions. The required four-layer precedence fails RC-02. Retained reference profiles currently have Stage 1 only; no claim is made that a real later reference Stage was lost.

## Frozen data, boundary and performance

Reproduced unchanged: **1,269 profiles; 187 multi-source; 184/400 sourced; 184/344 ordinary ICE; 95/222; 863/1,862 observed scenarios; 7/50 strict Top-50**. A/B/C/D/E **38/146/15/145/56**. Cohort sourced S1/S2/numeric S3 **184/23/0**; dataset S2/S3 **271/4**. Versus V3.1: **0 quote changes, 0 normalized identity changes, 0 sourced demotions**.

Browser JS: **25 chunks / 1,422,757 bytes; delta 0/0**. Transitive client catalog/dataset imports: **0/0**. Scanned 58,562 non-public canonical IDs and 1,269 sourced IDs: **zero JS leaks**. Raw RDW and full match candidate data are omitted; selected source URLs are intentional provenance. Privacy cannot pass RC-01/03.

Existing benchmark, same 400 rows and three passes, milliseconds median/p95:

| Run | Indexed source matcher | Full resolver |
|---|---:|---:|
| Recorded V3 | 0.1494 / 0.6457 | 0.7759 / 3.8356 |
| V3 replay on this host | 0.1807 / 0.8123 | 1.1792 / 5.5455 |
| Candidate repeat | 0.1601 / 0.6960 | 0.9518 / 4.7321 |

The initial candidate resolver run was 1.0666/5.3819 ms, above historical V3. The isolated same-host V3 replay was also slower than its historical record; the repeated candidate was faster than that replay. This comparison does not establish a candidate-specific performance regression. Timing varies with host conditions; no new performance gate was invented.

## Validation and limits

**PASS:** `pnpm catalog:audit`, `pnpm test:tuning`, `pnpm test:nl-fleet-v2`, `pnpm test:nl-fleet-v3`, `pnpm test:nl-fleet-v3-2`, `pnpm lint`, `pnpm typecheck`, `pnpm build`; V3.2 cohort replay; built-JS boundary scan; browser acceptance. This includes focused V3.1/V3.2, quote-policy/runtime pricing, current production runtime coverage, matching/identity and transitive client-boundary checks. Historical PR13-only coverage assertions are superseded by the current `test:rdw-coverage` target included in `test:tuning`.

The baseline server is stopped and its worktree registration removed. Windows long paths prevented full file deletion; automatic approval review rejected remaining cleanup (`blocked by policy`). Leftover directory: `C:/Users/barto/.codex/tmp/noordtune-release-baseline-b3e6f92`. Local production-build browser QA is not hosted Preview browser QA; Preview authentication protection remains a limitation. Remote artifact-commit SHA, push and exact-head deployment status are recorded in Draft PR #16. No production change or merge was performed. Status remains **BLOCKED**, pending explicit resolution of RC-01/02/03.

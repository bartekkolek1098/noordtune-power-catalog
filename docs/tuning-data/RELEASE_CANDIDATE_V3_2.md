# V3.2 release-candidate blocker resolution

**SUPERSEDED — current status: READY FOR OWNER REVIEW.** See [Customer flow correction](../../CUSTOMER_FLOW_FIX_REVIEW.md). The owner-reported navigation, Stage presentation and customer-copy defects superseded this earlier audit.

## Historical blocker-resolution result

**RELEASE-CANDIDATE-CLEAN (historical)** — RC-01, RC-02 and RC-03 resolved; all required checks pass. No merge, Ready action, production change, new research or profile addition.

- Starting commit: `d0533b2d2abe1c021136025843f300a768896987`; branch `feature/nl-fleet-coverage-v3`.
- Approved main: `4d12e510953fb57c3f8f84a737880ff860a617e7`. Draft #16 retains base `feature/nl-fleet-coverage-v2`.
- This replaces the initial BLOCKED audit at that starting commit. Final commit/push and exact-head Preview status are recorded in PR #16; this file verifies the product tree included in that commit.

## RC-01 — RESOLVED

Entire tracked-tree inventory: **24 text files / 401 occurrences / 12 owner-bearing filenames** before cleanup. Historical useful text now uses OWNER-A…OWNER-D; registration-only fields and identifying query filters were removed. Twelve redundant owner screenshots were inspected and deleted, and their references removed. Two replacement screenshots below use deterministic synthetic fixtures, not owner registrations. Current text/filenames, built browser JS and static HTML each contain **zero known owner identifiers**.

Live QA accepts only process-local `NOORDTUNE_OWNER_QA_PLATES`, with no real defaults, committed mapping or .env. Reports/error output are sanitized. Without that variable, owner-live QA explicitly reports SKIPPED and all **161 deterministic cases still pass**. See [local QA instructions](OWNER_QA.md), [anonymous before inventory](../../data/research/release-privacy-inventory.json) and [final privacy gate](../../data/research/release-privacy-scan.json).

Earlier feature commits intentionally retain history. The approved later release process uses squash merges; no history rewrite or force push occurred.

## RC-02 — RESOLVED

The actual production resolver now selects **each stage independently**: applicable retained reference → compatible sourced stage → compatible reviewed/public/canonical stage → existing generic conditional indication. Unavailable placeholders do not win. Numeric/ranged reference stages are supported. Tests prove both reference Stage 1 + sourced Stage 2 and sourced Stage 1 + reference Stage 2, canonical/generic fallback, strict make/model/fuel/displacement/year/generation guards, conditional Connect handling and source-order invariance. Stage 1+/modules are still excluded; numeric Stage 3 never approves hardware or a fixed hardware total.

| Case | Before Stage 1 | After Stage 1 | Later stages / quote |
|---|---|---|---|
| OWNER-D — BMW 128ti, registered 265 PS, first admission 2022 | `sourced-bmw-1-series-ae8b9b336dc6`: 305 PS / 490 Nm | `ref-bmw-128ti-f40-265`: **310 PS / 480 Nm** | S2 retains sourced ≈320 PS, torque unconfirmed; S3 custom hardware. S1 €700 indicative scenario; S2/3 on request. No installed-lock claim. |
| OWNER-C — Transit Custom, 1995 cc / 105 PS | `sourced-ford-transit-custom-d463142a0598`: 190 PS / 460 Nm | `ref-ford-transit-custom-20-ecoblue-105`: **190 PS / 440 Nm** | No source/reference S2: existing generic policy gives 190–215 PS / 440–470 Nm; S3 custom hardware. €549/699; S3 on request. |
| OWNER-B — Transit Connect, 1499 cc / 100 PS | Conditional reference ≈125 PS / 330 Nm | Conditional reference retained | Unknown 2018 engine remains TDCi/EcoBlue conditional; known EcoBlue rejects TDCi reference. S2 125–140 PS / 330–340 Nm; S3 custom. €449/549. |
| OWNER-A — Defender, 1999 cc / 241 registered PS | Canonical 290 PS / 590 Nm | Useful output retained | S2 canonical 320 PS / 660 Nm; S3 custom. €549/699. |

All four genuine HTTP cases preserve official identity, displacement, fuel and first admission. BMW/Custom value changes are **intentional**, not V3.2 value preservation. Generic policy constants are unchanged; Custom's generic later-stage lower torque bound follows the newly selected 440-Nm reference instead of 460 Nm.

## RC-03 — RESOLVED

**Registration may be included only in the outbound WhatsApp message created after an explicit user contact action. It is not persisted or used in NoordTune-owned URLs, analytics or browser storage.**

GET lookup returns **405**, `Allow: POST`, `Cache-Control: no-store`; it reads no query, invokes no RDW lookup and does not redirect. Normal lookup uses POST. Lookup CTAs render buttons without a plate-bearing href; the dedicated contact helper creates message/URL only inside the click handler. Generic/manual pages retain registration-free static WhatsApp links.

Tests verify POST, GET rejection and no GET lookup/query access, no plate in application URL/query or analytics requests, empty local/session storage, no plate cookies, no plate-bearing href before click and correct message after simulated click. NL/EN/PL, selected stage, figures, first admission, options, quote and access note are retained. The browser opener is stubbed: **no WhatsApp message or third-party page was sent/opened during QA**.

## Metrics and pricing

| Frozen measurement | After correction |
|---|---:|
| Accepted / multi-source profiles | **1,269 / 187**, dataset unchanged |
| 400 A/B/C/D/E | **38 / 146 / 14 / 146 / 56** |
| Sourced /400; ordinary ICE /344 | **184; 184** |
| Original 222 sourced | **95** |
| Sourced observed scenarios /1,862 | **861** (previously 863) |
| Strict Top-50 | **7/50** |
| Source/reference-backed power AND torque, S1/S2/numeric S3 | **184 / 14 / 0** |
| Legacy cohort non-generic field count, S1/S2/S3 | **184 / 23 / 0**; S2 includes nine canonical estimates |
| Dataset S2 / numeric S3 | **271 / 4**, unchanged |
| Frozen-400 quote / normalized identity changes / sourced demotions | **0 / 0 / 0** |

The 400-row change is one 2022 Connect moving C→D because it is outside the TDCi reference period. In the 3,000 observed rows, 13 out-of-period Connect records move C→D; two Custom records/scenarios move B→C because retained references now win. C includes retained references, so those two source→reference changes are not lost technical coverage. No dataset edits or new research.

**All 1,200 frozen-cohort and 9,000 observed-row stage quotes are identical to the starting commit.** Pricing matrix, service prices, options-once behavior and ECU/hardware policy are unchanged. Existing commercial assignment is retained separately when technical reference eligibility narrows. No generic **€269** customer quote path. Stage 3 without approved scope stays on request.

## Validation and review

**PASS:** `pnpm catalog:audit`, `pnpm test:tuning`, `pnpm test:nl-fleet-v2`, `pnpm test:nl-fleet-v3`, `pnpm test:nl-fleet-v3-2`, `pnpm lint`, `pnpm typecheck`, `pnpm build`. Includes production precedence, quote/runtime pricing, identity, POST/privacy, owner-input sanitization and client/server tests. Frozen replay checks indexed/exhaustive matcher equality on all 400 cases.

Browser: **183 passed** with secrets (22 genuine owner HTTP + 161 deterministic), **161 passed** without secrets (owner-live SKIPPED), and **14 V3.1 cases passed**. Widths **320/390/768/1024/1440**, NL plus compact EN/PL. Zero page errors, clipped result assertions or privacy failures. Actual plotted curves, stage selection, options and contact content checked.

Bundle: **25 chunks / 1,422,932 bytes**; **+175 bytes** for explicit-click contact handling, no chunk increase. Zero client catalog/dataset imports; zero private canonical or sourced-profile IDs in browser JS. Privacy gate separately scans all 27 static JS files and three generated HTML files. Public catalog remains 24 vehicles; sitemap scope remains 291 URLs.

Synthetic review screenshots: [BMW reference](release-v3-2/reference-bmw-1440.png), [Custom reference](release-v3-2/reference-custom-1440.png). Visual style and service wording are unchanged. Hosted Preview may require Vercel authentication; browser evidence is from the local production build.

### Exact product files

- `src/app/api/rdw-lookup/route.ts`
- `src/components/plate-lookup.tsx`
- `src/lib/lookup-contact.ts`
- `src/lib/rdw-tuning-estimate.ts`
- `src/lib/stage-hardware-policy.ts`

### QA/config/artifact inventory

Exact added/modified paths are listed below. Twelve deleted owner-bearing screenshot paths are intentionally not repeated; their anonymized before-inventory and original Git deletion diff retain the audit trail without adding a registration mapping to the release tree.

<details><summary>QA/config/artifact files</summary>

- `data/research/release-candidate-v3-2.json`
- `data/research/release-privacy-inventory.json`
- `data/research/release-privacy-scan.json`
- `data/research/v3-1-browser-results.json`
- `data/research/v3-2-coverage-report.json`
- `data/research/v3-2-verification.json`
- `docs/tuning-data/browser-v3-2/browser-acceptance.json`
- `docs/tuning-data/browser/browser-acceptance.json`
- `docs/tuning-data/OWNER_QA.md`
- `docs/tuning-data/RELEASE_CANDIDATE_V3_2.md`
- `docs/tuning-data/release-v3-2/reference-bmw-1440.png`
- `docs/tuning-data/release-v3-2/reference-custom-1440.png`
- `docs/tuning-data/V3_1_MATCH_RECOVERY.md`
- `docs/tuning-data/V3_2_TARGETED_RECOVERY.md`
- `docs/tuning-qa/artifact-link-audit.json`
- `docs/tuning-qa/final-review/browser-acceptance.json`
- `docs/tuning-qa/final-review/FINAL_ACCURACY_REVIEW.md`
- `docs/tuning-qa/runtime/browser-acceptance.json`
- `docs/tuning-qa/runtime/LIVE_RDW_AND_REFERENCE_RESEARCH.md`
- `docs/tuning-qa/runtime/live-rdw-identities.json`
- `docs/tuning-qa/runtime/RUNTIME_ESTIMATE_REVIEW.md`
- `docs/tuning-qa/runtime/RUNTIME_PRICING_POLICY.md`
- `docs/tuning-qa/runtime/runtime-coverage.json`
- `docs/tuning-qa/runtime/runtime-coverage.md`
- `docs/tuning-qa/runtime/screenshot-inventory.json`
- `docs/tuning-qa/TUNING_PROFILE_BACKLOG.md`
- `package.json`
- `scripts/build-v3-2-review.cjs`
- `scripts/check-owner-privacy.cjs`
- `scripts/lookup-contact-qa.cjs`
- `scripts/owner-qa-inputs.cjs`
- `scripts/qa-nl-fleet-v2-browser.cjs`
- `scripts/qa-rdw-final-review.cjs`
- `scripts/qa-rdw-runtime.cjs`
- `scripts/qa-tuning-dataset-v1.cjs`
- `scripts/qa-tuning-visual.cjs`
- `scripts/qa-v3-1-browser.cjs`
- `scripts/qa-v3-2-browser.cjs`
- `scripts/qa-v3-2-cohorts.cjs`
- `scripts/test-lookup-privacy.ts`
- `scripts/test-owner-qa-inputs.cjs`
- `scripts/test-production-precedence.ts`
- `scripts/test-rdw-runtime-coverage.ts`
- `scripts/test-sourced-pricing-bridge.ts`

</details>

All three blockers are resolved. PRs #13–#16 remain Draft on their existing bases; no merge/Ready/retarget action, main/production change, PR #12 edit or noordtune-www operation is part of this task.

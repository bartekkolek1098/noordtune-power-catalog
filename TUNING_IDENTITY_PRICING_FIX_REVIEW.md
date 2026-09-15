# Tuning identity, first registration and quote policy — local review

## Workspace and scope

- Workspace: `C:\Users\barto\Desktop\noordtune-power-catalog`
- Branch: `fix/tuning-identity-year-quote-policy`
- Pinned base: `4d12e510953fb57c3f8f84a737880ff860a617e7` — Implement NoordTune Pricing V2.
- Preflight matched directory, branch, SHA and remote `https://github.com/bartekkolek1098/noordtune-power-catalog.git`. Node `v24.19.0`, pnpm `11.5.2`. No applicable AGENTS.md was present.
- Existing untracked `.next/` and `node_modules/` were preserved and excluded from the commit. The generated tracked TypeScript build-info file is also excluded/restored to its initial content.
- No dependency installation, version upgrade, lockfile change, new repository, branch or worktree. Visual comparison uses an archive of the pinned source in a temporary QA directory, with the existing dependencies; it is not another Git checkout.
- Local implementation, tests and commit only. No push, PR creation/edit, merge, cherry-pick, deployment, promotion, production configuration, credentials or alias changes. PR #12 and `noordtune-www` were untouched.

## Reproduced root causes

1. `createIndicativeStages` invented Stage 1/2/3 values from generic power/torque multipliers and assigned €269/€399/€749. Missing stock power became 150; stock torque was also invented.
2. `getPublicStagePrice` returned `tier?.priceFrom ?? stage.price`, exposing legacy source amounts for unmapped/generated vehicles. UI calculators treated the base as always numeric and could combine an unknown base with options as a total.
3. The old matcher used substring tokens from model, engine, version and tags, tolerated up to 22% or 35 hp power differences, ignored displacement and registration, selected the first sorted candidate and capped a score at 100.
4. Generated model × trim × year combinations participated like reviewed configurations. Public promotion of 17 generated records did not independently verify model–engine applicability.
5. RDW read only `_dt` registration fields and truncated them without validation. The immediate summary and WhatsApp omitted first admission. Matched WhatsApp identity could substitute the candidate engine for official identity.
6. Vehicle/Stage pages, selector labels, homepage example, recommendations, calculator, messages and Offer data relied on numeric fields independently. Missing gearbox could enable TCU selection.

Executable baseline/current evidence: [matching-results.json](docs/tuning-qa/matching-results.json). The actual pinned baseline chose `ford-transit-custom-1-6-tdci-2012` and `ford-transit-1-6-tdci-2000` for the two Ford examples, each with confidence 100 and €269. The BMW had no match and the UI's €269 fallback.

## Changed files

- Catalog/matching/quote contract: `src/data/catalog.ts`, `catalog-matching.ts`, `catalog-shared.ts`, `catalog-selector.ts`, `pricing.ts`.
- RDW and date normalization: `src/lib/rdw.ts`, `rdw-date.ts`.
- UI: `src/components/plate-lookup.tsx`, `vehicle-detail.tsx`, `manual-selector.tsx`, `seo-info-sections.tsx` (narrow-width wrapping only).
- Existing pages: `src/app/[locale]/page.tsx`, `src/app/[locale]/vehicles/[vehicleId]/page.tsx`, `src/app/[locale]/[brand]/[model]/[engine]/[stage]/page.tsx`.
- Shared consumers: `src/lib/whatsapp.ts`, `seo.ts`, `quote-offer.ts`, `vehicle-services.ts`, `catalog-verification-copy.ts`.
- Executable verification: `package.json` (test script only), `scripts/audit-catalog-data.ts`, `test-catalog-matching.ts`, `test-quote-policy.ts`, `test-rdw-identity.ts`, `test-quote-surfaces.ts`, `qa-tuning-visual.cjs`, `qa-tuning-contact.cjs`.
- Review/evidence: this file; regenerated `CURATED_PRICING_REVIEW.md`, `CURATED_TECHNICAL_SERVICE_REVIEW.md`, `PRICING_V2_REVIEW.md`; `docs/tuning-qa/` JSON results and screenshots. The regenerated `CATALOG_DATA_REPORT.md` is identical to its initial tracked content.

## Official facts and provenance

Official schema retrieved **2026-09-15 09:52:24 UTC**, minimal facts **09:52:43 UTC**. Current local POST endpoint subsequently verified the same facts at 10:02:38–10:03:13 UTC. Both official resources were used: [vehicle schema](https://opendata.rdw.nl/api/views/m9d7-ebf2.json), [fuel schema](https://opendata.rdw.nl/api/views/8ys7-d773.json). No third-party plate websites were used.

| User example | Official RDW identity | Fuel; displacement; power | First admission | First NL registration | Current result |
| --- | --- | --- | --- | --- | --- |
| KKH27K | BMW 128TI | Benzine; 1998 cc; 195 kW ≈ 265 pk; 4 cylinders | 2022-09-14 | 2026-05-29 | Conflict with available catalog configurations; no substituted candidate; request quote |
| V978ZF / V-978-ZF | FORD TRANSIT CUSTOM | Diesel; 1995 cc; 77 kW ≈ 105 pk; 4 cylinders | 2019-04-29 | 2019-04-29 | Catalog conflict; manual review; request quote |
| V380ST | FORD TRANSIT CONNECT | Diesel; 1499 cc; 73.5 kW ≈ 100 pk; 4 cylinders | 2018-10-17 | 2018-10-17 | No model-family match; manual review; request quote |

The BMW identity/power and Ford 2.0 diesel description were initially owner-provided and are now supported by RDW facts above. **SID211 remains owner-reported only**: it is not inserted into the detected facts or outgoing quote as an identified ECU. RDW cannot establish installed ECU, software version, lock state, tuning-tool support, manufacturing date, ECU manufacturing date, or whether the engine/ECU was replaced.

Sanitized provenance and verification times: [rdw-provenance.json](docs/tuning-qa/rdw-provenance.json). Test identifiers and screenshots are synthetic; no production plate-specific exceptions were added. The normal UI submits POST bodies and does not put plates into page URLs, analytics or logs. A user-clicked prefilled WhatsApp URL may contain the supplied plate; nothing is auto-sent.

## Dates and registered power

Verified official fields:

- `datum_eerste_toelating_dt` and `datum_eerste_toelating` (first admission).
- `datum_eerste_tenaamstelling_in_nederland_dt` and `datum_eerste_tenaamstelling_in_nederland` (separate first Dutch registration).
- `nettomaximumvermogen`: the official description explicitly specifies combustion-engine maximum power in **kW**, not hybrid system power.

The pure date parser accepts ISO calendar dates/timestamps and YYYYMMDD, checks month/day/leap-year and time syntax, and does not timezone-shift a civil date. Valid `_dt` wins; invalid/missing `_dt` can fall back to the corresponding raw date field. Missing admission never falls back to import, ownership transfer, or catalog years. Missing/invalid remains unavailable. Manufacturing and ECU manufacturing dates are not inferred.

The existing detected-summary grid displays the first-admission date including year: **Eerste toelating: 14 september 2022**, **First registration: 14 September 2022**, **Pierwsza rejestracja: 14 września 2022**. Ford examples display **29 april 2019** and **17 oktober 2018**. WhatsApp includes the localized numeric date and year, e.g. **14-09-2022 (2022)**.

Power matching converts registered units to metric horsepower with a 3 pk rounding allowance. Multiple power rows do not get summed or promoted to a fabricated system output. Unsupported gas/hydrogen or contradictory fuel combinations require review.

## Matching and generated applicability

Official facts, matching assessment, access assessment and quote resolution remain separate. A returned catalog variant describes a reviewed catalog relationship; it does not verify the physical vehicle or ECU.

- Hard rejection before selection: manufacturer, model family/badge, fuel, displacement, material power differences and established generation/type/variant/execution/cylinder contradictions.
- Transit, Transit Custom, Transit Connect, Transit Courier and Tourneo variants have distinct identities. A shared Transit token is insufficient.
- Nominal decimal engine labels allow at most **49 cc** rounding (1995 → 2.0); 1499 cannot match 1.6, and 1995 cannot match 1.5/1.6/2.2. Exceptional labels need explicit reviewed displacement metadata.
- First registration is context, not manufacture. Boundary/out-of-period dates require review; known earlier incompatibility is rejected. Explicit generation constraints can resolve otherwise ambiguous boundaries.
- Equivalent duplicates collapse; distinct plausible reviewed configurations remain ambiguous. Deterministic ordering is never presented as confidence.
- Statuses: `catalog-match`, `ambiguous`, `conflict`, `no-match`. Diagnostics carry explainable reason codes and bounded candidate/rejection details, never the full database or a probability.
- Only the seven original curated relationships are reviewed for catalog applicability. All generated combinations, including the 17 SEO promotions, remain discovery candidates. Source records/figures were not rewritten.
- Ford inventory remains 324 generated Transit rows and 180 Custom rows, no reviewed relationships and no Connect/Courier/Tourneo family records. No vehicles or SEO routes were added to make a fixture pass.

| Fixture | Outcome/reasons |
| --- | --- |
| BMW 128TI | `conflict`: other BMW badges/power/powertrains/periods do not establish this configuration; no candidate engine shown |
| Transit Custom 1995 cc / 77 kW | `conflict`: displacement/power/fuel/period conflicts; 1.6 candidate rejected |
| Transit Connect 1499 cc / 73.5 kW | `no-match`, `NO_MODEL_FAMILY`; generic Transit is rejected |
| BMW 320d, representative 2017/190 pk | Correct original curated `bmw-320d-b47`; access review still makes price on request |
| Golf GTI, representative 2017/230 pk | Correct `vw-golf-20-tsi-ea888`; assigned from-price |
| Manual Focus ST, representative 2015/250 pk | Correct `ford-focus-st-20-ecoboost`; no TCU option |
| Golf R, representative 2017/300 pk | `ambiguous`: generated applicability, generation boundary and multiple discovery configurations; correct public page remains accessible through manual selection, without choosing an arbitrary RDW match |

## Shared quote policy

All price consumers use `QuoteResolution`, either VAT-inclusive EUR integer-cent `from` pricing with a policy ID and confirmation requirement, or `on-request` with a reason and optional conditional budget. Historical `stage.price`/`sourcePrice` remain source metadata; no public surface uses them to recover a quote. The numeric compatibility helper returns unavailable for request states.

| Priority | Condition | Resolution |
| --- | --- | --- |
| A | Conflict, ambiguity or unresolved applicability | On request |
| B | Confirmed unlock requirement | Approved unlock-inclusive policy only; none exists here, so on request |
| C | Possible unlock/access review | On request; applicable BMW Stage 1 review can carry the conditional €700 budget note |
| D | Reviewed, explicitly assigned existing configuration; no overriding review | Assigned existing VAT-inclusive from-price; physical access remains unconfirmed unless identified |
| E | Generated, unmapped or no-match | On request; no legacy price fallback |
| All | Custom Stage without an approved scope/total | On request |
| All | Options with unknown base | Preserve selections and request state; no €0 or options-only total |

Access is separately `unknown`, `possible-unlock-review`, `confirmed-standard`, `confirmed-bench`, or `confirmed-unlock-required`. Confirmed states require an identified-vehicle evidence reference and identified ECU. A support list/catalog family label alone is insufficient. A price tier never establishes OBD/bench/unlock access. No approved unlock-inclusive total is invented.

Conditional owner budget: **“If ECU unlocking is required, indicative Stage 1 budget from €700. Final quotation after ECU identification.”** It is neither an unlock diagnosis, universal fee, guaranteed total nor an additional €700 surcharge. Registration year alone never triggers a lock conclusion.

### Curated quote changes

**18 configurations, all three Stages, now require an individual quote.** Seventeen lack independently reviewed generated applicability; BMW 320d additionally needs ECU/access review. Eight BMW records have mixed MD1/MG1 family review signals; those labels signal uncertainty, never a physical lock. All nominal tier amounts are retained.

| Changed configuration | Previous Stage 1 / 2 / 3+ from-prices | New public quote |
| --- | --- | --- |
| BMW 320d B47 | €299 / €449 / €699 | On request — ECU/access review |
| BMW F20/F21 118i, 118d, 120d | €299 / €449 / €699 each | On request — generated applicability + BMW review |
| BMW F30/F31 318d, 330d | €299 / €449 / €699 each | On request — generated applicability + BMW review |
| BMW F10/F11 520d; G20/G21 320i | €299 / €449 / €699 each | On request — generated applicability + BMW review |
| Golf 7 1.6 TDI; Golf 7 2.0 TDI | €299 / €449 / €699 each | On request — generated applicability |
| Golf 7 R | €399 / €549 / €999 | On request — generated applicability |
| Passat B8 2.0 TDI | €299 / €449 / €699 | On request — generated applicability |
| Audi A3 8V 1.6 TDI | €299 / €449 / €699 | On request — generated applicability |
| Audi A4 B9 2.0 TDI 190; 2.0 TFSI | €299 / €449 / €699 each | On request — generated applicability |
| Audi A6 C7 3.0 TDI 272 | €299 / €449 / €699 | On request — generated applicability |
| Skoda Octavia 5E 2.0 TDI 150 | €299 / €449 / €699 | On request — generated applicability |
| SEAT Leon Cupra 5F 300 | €399 / €549 / €999 | On request — generated applicability |

Six unchanged assigned configurations: Golf GTI **€349/499/849**, Audi A3 2.0 TDI **€299/449/699**, Mercedes A45 AMG **€399/549/999**, BMW X3 E83 **€299/449/699**, Volvo XC60 D5 **€349/499/849**, manual Focus ST **€349/499/849**. An old diesel's age alone grants no price; X3 uses its explicit existing assignment.

Exact IDs, all 72 old/new Stage states, nominal assignments and evidence notes: [quote-changes.json](docs/tuning-qa/quote-changes.json). Service descriptions and prices are unchanged, including TCU €249. No bundle discount or automatic paid-option selection.

## UI, messages and structured data

The lookup summary uses official identity even when a catalog relationship is found. Matching/debug detail is not exposed as customer certainty. No-match/conflict Stage values use localized “To be confirmed”; the existing chart area remains as a neutral explanation with no invented curve. Catalog source figures remain unchanged and are estimates requiring verification.

Lookup, vehicle/Stage pages, manual selector, homepage example, recommendation prices, calculator, WhatsApp and Offer JSON-LD use the same resolver. Request-state Offers omit `price` and `priceSpecification`; they do not publish €0. Selected paid options stay listed while the quote remains on request. TCU selection requires an explicit compatible automatic transmission; unknown/manual does not qualify.

### Dutch WhatsApp examples (Stage 1, no options selected)

Messages are generated from the same displayed facts and quote state. These examples use the owner's requested identifiers; committed executable fixtures/screenshots use synthetic ones. Nothing was sent.

```text
Hallo NoordTune, ik wil graag een offerte voor deze auto:
Taal: Nederlands
Kenteken: KKH27K
Auto: BMW 128TI
Eerste toelating: 14-09-2022 (2022)
Brandstof: Benzine
Cilinderinhoud: 1998 cc
RDW geregistreerd vermogen: 195 kW (265 pk)
Catalogus: configuratieconflict; handmatige controle
ECU/toegang: ECU/toegang controleren; mogelijke unlock is niet bevestigd
Stage: Stage 1
Extra opties: -
Prijs: op aanvraag na ECU- en voertuigcontrole
Als ECU-unlock nodig is, indicatief Stage 1-budget vanaf € 700. Definitieve offerte na ECU-identificatie.
Exacte motor-/ECU-variant en definitieve setup te bevestigen.
Kunnen jullie dit controleren en advies geven?
```

```text
Hallo NoordTune, ik wil graag een offerte voor deze auto:
Taal: Nederlands
Kenteken: V978ZF
Auto: FORD TRANSIT CUSTOM
Eerste toelating: 29-04-2019 (2019)
Brandstof: Diesel
Cilinderinhoud: 1995 cc
RDW geregistreerd vermogen: 77 kW (105 pk)
Catalogus: configuratieconflict; handmatige controle
ECU/toegang: ECU/toegang te bevestigen
Stage: Stage 1
Extra opties: -
Prijs: op aanvraag na ECU- en voertuigcontrole
Exacte motor-/ECU-variant en definitieve setup te bevestigen.
Kunnen jullie dit controleren en advies geven?
```

## Verification record

- `pnpm test:tuning`: 18 matcher tests, 20 quote-policy tests, 17 RDW/date tests, and 368 cross-surface assertions passed. Includes missing facts, equivalent/different candidates, delayed registration, same power/different cc, Ford families, hybrids/unsupported fuel combinations, generated candidates, BMW/old diesel unknown access, physical standard evidence, confirmed unlock without total, paid options with unknown base, generated verification copy, dates and localized messages.
- `pnpm lint` and `pnpm typecheck`: passed with the final quote/date/matching integration and mobile wrapping changes.
- `pnpm catalog:audit`: 0 critical groups; 18 existing warning groups. Canonical full/commercial hashes, source power/torque, public technical facts, routes, service definitions and service prices remain protected. Count checks retain 24 public vehicles, 58,586 canonical records, 175,758 source Stage definitions and 291 sitemap URLs.
- Audit migration: numeric-only public checks now validate quote DTOs and the shared resolver; Offer/calculator wiring remains checked, with executable integration tests providing behavioral coverage. Matcher equality was replaced by deliberate implementation fingerprints plus behavioral regression checks because matching is the authorized change.
- The pinned baseline audit itself returned one historical matcher hash failure on Windows: raw `Function.toString()` included CRLF (`4ad8598…`); normalizing to LF reproduced its stored `c9c9fda…` exactly. This is documented rather than reported as a baseline pass. New implementation hashes normalize line endings.
- Initial integration typecheck/audit failures reflected replaced numeric DTO fields and old wiring assumptions; those were corrected. Initial baseline rendering under a node_modules cache path failed TypeScript compilation; the temporary source archive outside node_modules rendered successfully with existing dependencies.

### Visual comparison and final production build

**PASS:** 52 lookup browser runs form **26 baseline/final comparisons**, plus eight final vehicle-detail checks and eight Stage-page/Offer checks. Browser: the same installed Chrome **152.0.7977.83**, fonts, viewport environment and controlled payloads for both versions. BMW 128TI and Golf GTI were checked at **320, 360, 390, 430, 768, 1024 and 1440 px**. Both Ford examples, BMW 320d, Golf R and manual Focus ST were checked at 320/1440; English and Polish BMW results were additionally checked at 320.

- Final result/page overflow: **zero**; internal vertical scrollbars: **zero**; browser page errors: **zero**; detail-calculator overflow: **zero**.
- Stage controls, chart container, options/checkboxes, selections through Stage changes, and reachable WhatsApp CTAs were verified. Strong-match full-details links returned HTTP 200. Golf R remains honestly ambiguous; its existing manual-selection/public page remains reachable and quote-only.
- Layout hierarchy/order, cards, typography, colors, chart area and PlateLookup followed by ManualSelector are retained. Mobile fixes add wrapping/minimum-width constraints to existing headings, buttons, table cells and option rows. Baseline already clipped at narrow widths; fixes keep content visible and naturally expandable without a new panel, fixed-height result or internal scrollbar.
- Allowed differences are registration date/year, official identity, conservative matching, quote/access content, generated-applicability notice and neutral no-match values/chart. Result height changes naturally with that content. No claim of pixel identity is made.
- Only the development overlay was hidden identically on both versions; vehicle/price/layout content was not masked. The three mandatory examples use the retrieved official facts with synthetic plate identifiers. Representative curated registration dates are controlled test fixtures. Screenshots contain no credentials or unnecessary real plates.

Evidence: [comparison overview](docs/tuning-qa/visual-comparison.html), [comparison image](docs/tuning-qa/visual-comparison.png), [complete measurements](docs/tuning-qa/visual-report.json). Full images preserve every section; summary previews are only for convenient comparison. Example full results: [BMW 320 px](docs/tuning-qa/final-bmw128ti-320.png), [BMW 1440 px](docs/tuning-qa/final-bmw128ti-1440.png), [GTI 320 px](docs/tuning-qa/final-golf-gti-320.png), [GTI 1440 px](docs/tuning-qa/final-golf-gti-1440.png).

Browser QA is reproducible with `node --no-warnings scripts/qa-tuning-visual.cjs` and the pinned baseline/current local servers. `TUNING_BASELINE_ROOT`, `TUNING_BASELINE_URL`, `TUNING_FINAL_URL`, `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE` can point to existing local installations; the script installs nothing.

`pnpm build`: **PASS**, exit 0, compiled in 16 seconds and completed all **298** generated application/framework pages. The sitemap remains **291** public URLs; framework/system output accounts for the other build entries. No build warnings/errors. First-load JS: home 279 kB, vehicle/Stage 231 kB, shared 102 kB. Both QA dev servers were stopped before building. The final build is available locally at `http://localhost:3100/nl`.

Production chunks: **25 JavaScript chunks scanned, zero generated canonical vehicle IDs**; the source audit also reports zero client imports of the full canonical catalog. [Bundle evidence](docs/tuning-qa/production-bundle-check.json). The canonical catalog remains server-side; selectors return lightweight quote DTOs.

## Remaining verification before a customer quotation

Identify the physical ECU and software, access method and current lock state; confirm engine/configuration and transmission, current hardware/condition, and applicable Stage scope. Independently review generated model–engine applicability before promoting a discovery candidate to a strong match or assigned quote. Approve an applicable unlock-inclusive total where required. The owner-reported SID211 and BMW unlock possibility remain unconfirmed until that work is done.

## Local commit status

The initial local commit attempt was rejected by Git with `Author identity unknown`. The owner then explicitly selected the baseline author identity for this commit only. The requested commit uses invocation-only `git -c user.name=… -c user.email=…` overrides; no local or global Git configuration is saved. Only implementation, tests and evidence are included. Build output, dependencies, lockfile, environment files and TypeScript build-info are excluded. No history is rewritten.

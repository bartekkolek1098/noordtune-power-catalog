# Power Catalog — identity and evidence rebuild

Status: implementation in isolated `fix/rdw-generation-integrity` branch. The current production main and draft UX PR #24 are untouched.

## Why this work is necessary

A 2021 BMW 118i (100 kW / 136 PS, 1499 cc, RDW type F1H) was incorrectly shown as a BMW F20/F21 with withheld Stage 1. RDW registration facts were correct; the fallback accepted an out-of-period F20/F21 public catalogue profile. The researched F40 entry in the prior dataset was for 140 PS, not the 136 PS variant. Similar power and displacement do not establish equivalent generation.

The corrected matching policy rejects a technical profile when the registered year is outside its catalogued period. First registration does not decode an ECU or VIN; explicit conflicting generation is veto evidence. Commercial estimates are evaluated independently from technical output so Stage values never come from a mismatched profile.

## Baseline audit (2026-10-07)

Source: executable `pnpm test:tuning`, `pnpm catalog:audit` and `data/research/v3-2-coverage-report.json`.

| Inventory | Result |
| --- | ---: |
| Generated/canonical raw year records | 58,586 |
| Distinct canonical technical identities | 3,197 |
| Supported ICE canonical identities in coverage cohort | 2,962 |
| Canonical A/B sourced coverage | 23 A / 91 B |
| Canonical C / D (insufficient evidence for public numeric output) | 1,634 C / 1,214 D |
| Known artificial cross-products | 168 |
| Incomplete displacement records | 837 |
| Researched distinct source-derived identities | 1,266 |
| Source-fixture after coverage | 182 A / 972 B / 12 C / 100 D |
| Public SEO vehicles | 24 |
| Real selector taxonomy configurations | 4,592 |

These are structural/fixture coverage counts, **not live verified cars or guaranteed tuning results**. The generated catalogue is not a licensed master vehicle database and must not be used to publish exact Stage 1/Stage 2 output. More than one source with matching model and stock horsepower is not proof of ECU or hardware applicability.

## New controlled technical evidence layer

Every accepted output requires a verifiable `make / model / generation / year band / fuel / displacement / original power` match, with at least one scoped published technical source. Conflict status, confidence level, stage-specific evidence, source date and verification requirements are recorded. Unknown ECU, transmission, octane and hardware remain explicitly unconfirmed.

First reviewed application: **BMW 118i F40 136 PS (2020–2024)**. Separate published 136 PS references give 165–180 PS / 278–280 Nm Stage 1 indications; the source disagreement is exposed as an interval, not silently averaged. Stage 2 has no defensible approved hardware scope, so it stays on request. No public Stage 3. Results are conditional, not NoordTune dyno measurements or a promise of a specific tuning target.

This application is kept separate from F40 140 PS and earlier F20/F21 136 PS. The first regression includes a sanitized RDW fixture and negative cases for conflicting generation, fuel, displacement, year, model and stock power.

## Next work after P0 acceptance

1. Build a normalized vehicle identity register from manufacturer/RDW evidence + licensed/permissioned vehicle-application datasets. Keep `RDW recorded model` separate from `verified generation and engine` and `suspected match`; never infer ECU from plate metadata alone.
2. Reconcile 4,592 real selector configurations against that register; quarantine generated canonical cross-products and implausible all-years templates.
3. Ingest stage-specific source observations with provenance and source-pair independence, not wholesale copies of competitors' databases, prose, images or dyno graphs. Only display numeric Stage 1 / Stage 2 after matching generation, original output, fuel and required hardware. Conflicting sources trigger bounded review rather than automatic gains.
4. Run exhaustive deterministic tests across the 1,266 sourced fixtures and 3,197 distinct canonical identities plus year-boundary, fuel, transmission, model-family, same-power generation and RDW opaque-identifier adversarial cases. Collect anonymized production outcome metrics with no plates or personal data in analytics.
5. Roll out in guarded phases: preview browser tests (all NL/EN/PL), review of priority families, release, production smoke/RDW QA, and error/coverage monitoring. Publish more numeric profiles only after their evidence gates pass.

**Release rule:** Do not merge or deploy a patch unless local regressions, exact Git SHA Vercel deployment and fresh protected-preview QA all pass. Vercel connection presently has a 403 permission blocker for `bartekkolek1098s-projects`; human owner authorization is required for protected-preview browser testing.


## Customer-first RDW recovery (second incident)

Production check of the reported commercial vehicle showed a **2019 Volkswagen Caddy, RDW 1,395 cc / 81 kW / 110 PS / CNG**. The old normalizer returned an unknown powertrain and withheld the entire tuning profile. This is not evidence that CNG tuning is impossible; CNG must simply never receive petrol-only Stage output.

The expanded exact-source layer now has **Caddy IV / 2K facelift, 1.4 TGI CNG, 110 PS, 2015–2020**. Four independently presented public tuning entries support an indicative Stage 1 **135–140 PS / 240–250 Nm**. Scope and installed gas-system / ECU / fuel calibration still need confirmation. Stage 2 is on request. Never assume tuning results from the 1.4 TSI petrol variant or borrow prices from source providers.

Official RDW information is visible first, even if tuning is not confirmed. The compact lookup card now shows the actual RDW first admission (explicitly **not** a guaranteed manufacturing/model year), registered kW and converted metric hp, fuel and capacity. An expandable technical section exposes the source-provided type/variant/execution, APK and Dutch registration date, category/body, dimensions, loading and towing masses, original technical homologation, installed gas-system descriptor, emissions, odometer status and recall indicator when present. No ownership or personal information is passed to analytics. The API continues stripping the raw RDW response.

When a tuning profile has no customer-safe Stage 1 value, a **separate comparable-application panel** can display a reference range only if publicly sourced records agree on make, model family, overlapping year period, fuel, displacement and original power. It explicitly says it is **not** the value for this exact vehicle, carries source URLs, shows generation ambiguity and asks the customer to contact NoordTune. It does not create exact Stage 1/2 values or apply default gain percentages. With no relevant public reference, display all known factory RDW data and a direct enquiry CTA instead of false precision.

Regression coverage includes synthetic CNG and BMW registrations, year/fuel/power/cylinder/model conflict cases, the complete research/canonical audit, and actual browser lookups on the production-build preview across mobile/desktop NL/PL. No real plate or user details are committed to Git.

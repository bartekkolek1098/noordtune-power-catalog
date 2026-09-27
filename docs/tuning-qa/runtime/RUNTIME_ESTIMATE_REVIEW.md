# RDW runtime estimate coverage

This follow-up updates Draft PR #13 on `fix/tuning-identity-year-quote-policy` after checkpoint `5717485c7f7060f3c9722d2253bf9b302dbc3e25`. It changes the data supplied to the existing lookup cards, Stage table, chart and quotation controls. It does not publish additional SEO pages or change the commercial pricing assignments.

## Root causes and architecture

Previously, RDW normalization called `resolveTuningEstimate(identity, engineCatalog)`. Its eligible set comprised only the three reference profiles and the intentionally small public catalog. OWNER-A had no eligible public/reference profile even though the canonical database contained compatible Defender 2.0 SD4 estimates. `PlateLookup` then created pending Stages without power or torque.

OWNER-B selected the conditional Transit Connect reference. That stored reference supplied Stage 1 and explicitly unavailable Stage 2/3 entries. The old path treated the selected profile as a complete answer, so the missing later Stages could not fall through to another source.

The server now calls `resolveRdwTuningEstimate(identity)`:

1. Applicable NoordTune/model-engine references.
2. Applicable public/curated catalog profiles.
3. Canonical candidates shortlisted by registered identity, followed by strict family, displacement, power, fuel, year, generation and available registry evidence checks. Equivalent technical output profiles collapse across year copies; materially different profiles remain ambiguous.
4. Explicit generic RDW heuristic scenarios for supported combustion inputs, using registered stock power. Unknown aspiration uses a conservative table. Hybrid, electric, conflicting/unsupported fuels and missing or invalid power remain unavailable with reasons.

Each Stage independently uses the highest applicable available source. A missing Stage in a reference can use compatible canonical output or a labelled generic scenario. Generated provenance does not erase figures or establish verified ECU support. Runtime transmission options require evidence; a catalog gearbox label alone does not identify the installed gearbox.

The browser receives one detected vehicle, a compact identity assessment, one estimate profile with per-Stage provenance and count-only diagnostics, and the initial Stage 1 quote. Raw RDW rows, rejected vehicles, candidate arrays and the canonical dataset are excluded. Shared pricing functions preserve selected-option and WhatsApp consistency for subsequent Stages.

## Live owner results

Official technical fields, retrieval times, exact type/variant/execution and source comparisons are retained in [live-rdw-identities.json](./live-rdw-identities.json) and [the research report](./LIVE_RDW_AND_REFERENCE_RESEARCH.md). The input plate never selects a special-case profile.

Values below are metric pk / Nm. **C** = conditional canonical estimate, **R** = model/engine reference, **G** = generic indicative scenario. They are not NoordTune measurements or approved final targets.

| Case | RDW identity and first admission | Stage 1 | Stage 2 | Stage 3+ |
|---|---|---|---|---|
| OWNER-A | Land Rover Defender, diesel, 1999 cc, 177 kW / 241 pk; 2020-06-12 | 290 / 590 (C) | 320 / 660 (C) | 365 / 740 (C) |
| OWNER-B | Ford Transit Connect, diesel, 1499 cc, 73.5 kW / 100 pk; 2018-10-17 | 125–140 / 330–340 (R comparison) | 147 / 355–385 (G) | 159 / 415–450 (G) |
| OWNER-C | Ford Transit Custom, diesel, 1995 cc, 77 kW / 105 pk; 2019-04-29 | 190 / 440 (R) | 200 / 460–500 (G) | 216 / 540–585 (G) |
| OWNER-D | BMW 128ti, petrol, 1998 cc, 195 kW / 265 pk; 2022-09-14 | 310 / 480 (R, RON98) | 345 / 505–545 (G) | 373 / 590–635 (G) |

OWNER-A follows registered identity → 134 make/fuel/power/displacement prefilter rows → 2 fully compatible year rows → 1 equivalent technical profile (`land-rover-defender-2-0-sd4-2020`) → three canonical Stages → an on-request quote → numeric browser result. The original source stock value is 240 pk / 500 Nm; the detected stock display and chart use factual RDW conversion, 241 pk. The difference is conversion/source rounding, not a replacement of registered power.

OWNER-B has no canonical Transit Connect profile. The owner confirmed no engine-generation evidence and requested a conditional estimate. The published Stage 1 endpoints remain a comparison; 125/330 is not presented as a universal mechanical limit, and 140/340 is not silently adopted as a measured NoordTune result. Shiftech's EU5-labelled Stage 2 and another tuner's Stage 1+ are not relabelled as interchangeable stages. Proposed workshop targets are separately marked for owner review in the research report.

OWNER-C rejects the canonical 170-pk Custom template because registered stock power is approximately 105 pk. SID211 remains an owner report, not an RDW fact. BMW 128ti rejects other 1 Series badges and retains conditional access/pricing without suppressing power.

## Interpretation of generic estimates

[The heuristic table](../../../src/data/tuning-heuristics.ts) defines power factors and explicit compatible prior-Stage floors. Later generic scenarios may use the upper endpoint of a compatible earlier range to avoid presenting a later package below that earlier scenario. This is a documented planning convention, not additional mechanical evidence. Higher Stages require hardware and workshop review.

Torque ranges are used only when a compatible source supplies stock torque. Wholly generic profiles without that source retain numeric power and an explicit unavailable-torque explanation. No precise stock or tuned torque is invented. The chart plots available point estimates; full ranges appear in the existing table and WhatsApp text.

## Acceptance evidence

- [Runtime coverage report](./runtime-coverage.md): all fixture inputs, resolution levels, selected profiles, Stage values/provenance, quote modes, reasons, counts and timing. Synthetic catalog fixtures test runtime behavior; their success is not a measured fleet applicability rate.
- [Browser acceptance](./browser-acceptance.json): actual local UI submissions to the live RDW path, Stage switching, dates, stock power, ranges, chart, options, quote/WhatsApp consistency, response size/timing and viewport checks.
- [Browser bundle check](./browser-bundle-check.json): canonical ID signatures checked against production browser JavaScript. A separate transitive source-import test rejects any client value-import path reaching the catalog or runtime resolver.
- [Screenshot retention proposal](./SCREENSHOT_RETENTION_PROPOSAL.md): proposed smaller evidence set for owner review. No existing screenshots or reports are deleted.

## Final validation

- `pnpm catalog:audit`: pass, 0 critical groups and 18 existing warning groups. Counts remain 24 public vehicles, 58,586 canonical records, 175,758 Stages and 291 sitemap URLs.
- `pnpm test:tuning`: pass, including 20 focused runtime tests, 78 broader cases with 1,401 assertions, and the existing matcher/estimate/RDW/quote/surface regressions (491 surface assertions).
- Coverage: 64/64 tested normal combustion identities have numeric power for all three Stages. Of 56 non-public fixtures across 14 brands, 31 resolve canonically and 25 use the generic indication. Sourced torque or labelled ranges cover 39/64; the remaining 25 explicitly lack a defensible stock-torque source. Hybrid, EV and missing-power negative controls remain unavailable.
- `pnpm lint`, `pnpm typecheck` and `pnpm build`: pass. Build generates 298 framework/application entries. Checks used a verified source copy with existing dependencies. Typechecking was finalized after build generation completed, avoiding concurrent changes to generated Next.js type files.
- Actual local production UI: 24 cases passed across all four live owner plates (NL 320/390/768/1440; EN/PL 320). Every case preserves the independently retrieved RDW identity and registration date, renders all three Stage powers and a plotted power curve, and passes options, quote/WhatsApp and clipping checks. Eight final screenshots were retained.
- Responses: 4,108–8,519 bytes. Uncached server lookup/resolution times were 462.0–551.9 ms; browser-observed request times were 531–755 ms. Cached server lookups were 0.0–0.2 ms in this local run. These timings are local measurements, not hosted performance guarantees.
- Boundary: 0 transitive client imports of the server catalog/runtime. All 25 production browser JavaScript chunks (1,413,094 bytes) were checked against 58,562 non-public canonical ID signatures; none were present.
- No source catalog, Stage figures, pricing assignments, SEO membership or sitemap code changed. No screenshot deletion was performed.

Handoff details are recorded in Draft PR #13. Main, production, PR #12 and noordtune-www are outside this follow-up's changes.

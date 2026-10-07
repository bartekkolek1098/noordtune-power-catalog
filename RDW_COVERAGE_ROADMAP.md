# NoordTune Power Catalog — whole-RDW customer coverage

Status: evidence-gated coverage extension. This project does **not** yet have 100% numeric tuning coverage of RDW.

## Operational definitions

1. **RDW detection:** if the Dutch registration exists and the RDW API responds, display all factual make/model, first admission, fuel, capacity, registered kW, homologation, mass and available RDW fields. RDW does not certify the actual installed ECU or a model's exact production year. If RDW is temporarily down, show a clear Dutch/English/Polish explanation and direct contact with the registration prefilled; do not call a service outage an invalid plate.
2. **Direct sourced Stage 1:** a customer numeric tuning output is permitted only for matching, credible Stage 1 evidence covering generation, factory engine, stock power, fuel and necessary hardware. Any uncertainty remains visible. No generic gain multipliers, "competitor + 4 hp", copied graphs, fake dyno curves or unsupported Stage 2.
3. **Dated source comparison:** where the public catalogue's old numerical target is not verifiable, display *separately and explicitly* the original stock specification, year band, Stage 1 values and difference published for matching source applications, with independent source URLs and an owner-review warning. This **does not replace** the car's withheld Stage 1 output or prove compatibility with its installed ECU.
4. **Manual-review outcome:** factory RDW / catalogue data is still usable and the customer receives a clear action and a prefilled, optional enquiry. No fabricated numeric Stage 1/2 for unsupported engines, CNG/petrol conversions, hybrids, hardware scopes or ECU versions.

## Current reproducible public-page baseline (unit test)

| Outcome | Public vehicle profiles |
| --- | ---: |
| Direct customer-safe Stage 1 numerical output | 10 |
| No direct value, but dated source-applicable Stage 1 examples | 10 |
| No appropriate published numeric source yet; review/contact | 4 |
| **Total** | **24** |

The previous UI had only 10/24 customer-visible numeric Stage 1 results, because the customer safety adapter intentionally strips legacy-generated output lacking published evidence. A range-sensitive tiles fix did not repair this source-coverage gap. Separate date- and identity-scoped examples now make relevant published evidence visible without inventing or reassigning values.

Evidence examples from the existing reviewed 1,269-source pool cover BMW 118i F20/F21, 120d F20/F21, 318d F30/F31, 330d F30/F31, Golf 7 1.6 TDI and Audi A4 B9 2.0 TFSI. Four newly reviewed comparable applications cover BMW 520d F10, BMW 320i G20, Audi A3 8V 1.6 TDI and Audi A3 8V 2.0 TDI. Their actual application years, original horsepower and original torque are validated; some published targets vary and are represented as source ranges.

**Remaining four public research priorities:** Volvo XC60 D5 220 PS / 440 Nm, VW Golf 7 2.0 TDI 150 PS / 340 Nm, Audi A6 C7 3.0 TDI 272 PS / 600 Nm and Skoda Octavia 5E 2.0 TDI 150 PS / 340 Nm. Existing source listings for these frequently state *different factory torque* (e.g. 150/320 vs 150/340, or 272/580 vs 272/600). They must not be silently promoted onto the public vehicle configuration.

## Broad RDW and canonical scope

- Historical raw canonical rows: **58,586**, representing **3,197 distinct technical identities**, most generated/estimated and not independently verified.
- Selector taxonomy: **4,592 real vehicle configurations** (stock/identity lookup coverage, **not** 4,592 tuned profiles).
- Researched source profiles: **1,269 raw / 1,266 distinct source-derived identities**. Their existing synthetic fixture audit reported **182 A, 972 B, 12 C, 100 D** after matching; these are *source-derived test contexts*, not a representative sample of the actual RDW fleet.
- RDW reports factory registration facts, not source confirmation of an ECU file, tune, installed transmission or fuel grade.

The numerator for true 100% numeric RDW coverage cannot be established from those datasets. The product cannot promise results for every fuel, age, incomplete registration or rare variant until independent source ingestion and owner technical review close the gaps.

## Release and next-iteration plan

- Keep **100% of successful RDW lookup facts visible**, including technical details, regardless of source coverage.
- Classify each customer outcome as direct sourced / dated comparison / factory-only and keep this classification in deterministic QA without retaining license plates in the repository or client analytics.
- Test NL/EN/PL, 320–1440px and the official-source fallbacks, no horizontal overflow or false generation/ECU labels.
- Add version-scoped external evidence and validate original factory torque, fuel, displacement, generation, year band and, for Stage 2, approved hardware. Prioritize common NL passenger cars, vans and owner-provided anonymous problem cases; never import whole competitor catalogues blindly.
- Treat missing evidence as a transparent lead opportunity, not as an exact tuning guarantee.
- Maintain an independent production release gate: exact GitHub head, full tests and build, authorized protected Vercel Preview browser QA, production deployment SHA and fresh production smoke checks. Do not merge unfinished UX PR #24 to deliver coverage.

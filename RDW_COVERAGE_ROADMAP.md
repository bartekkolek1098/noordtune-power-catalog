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
| No direct value, but dated published Stage 1 examples (including one Stage 1+ measured source) | 14 |
| No relevant published example yet; review/contact only | 0 |
| **Total** | **24** |

The previous UI had only 10/24 customer-visible numeric Stage 1 results, because the customer safety adapter intentionally strips legacy-generated output lacking published evidence. A range-sensitive tiles fix did not repair this source-coverage gap. Separate date- and identity-scoped examples now make relevant published evidence visible without inventing or reassigning values.

Evidence examples from the existing reviewed 1,269-source pool cover BMW 118i F20/F21, 120d F20/F21, 318d F30/F31, 330d F30/F31, Golf 7 1.6 TDI and Audi A4 B9 2.0 TFSI. Four newly reviewed comparable applications cover BMW 520d F10, BMW 320i G20, Audi A3 8V 1.6 TDI and Audi A3 8V 2.0 TDI. Their actual application years, original horsepower and original torque are validated; some published targets vary and are represented as source ranges.

**Second evidence-closure pass (2026-10-08):** Volkswagen Golf VII Mk2 2.0 TDI DFGA 150 PS / 340 Nm is now supported by a dated single-source *example*, 2017–2019, stock 150/340 to 185/425. Audi A6 C7 EU6 3.0 TDI 272 PS / 600 Nm is supported by two distinct *examples*, scoped conservatively to 2015–2018: 300–308 PS / 650–668 Nm. They are kept separate from Golf 150/320 and A6 272/580 applications. They remain **source comparisons, not verified tuning outputs of the customer's installed ECU**.

**Third evidence-closure pass (2026-10-08) — two final public example gaps:**

- **Volvo XC60 I D5 AWD D5244T20 220 PS / 440 Nm**, 2016–2017: Volvo's manufacturer engine table explicitly distinguishes D5244T20 220/440 from D5244T22 220/420. BSR independently publishes a **Stage 1+** application **only for D5244T20 AWD**, requiring ECU decoding. Its **measured** baseline is 221 PS / 428 Nm and tuned reading 282 PS / 533 Nm, hence **+61 PS / +105 Nm relative to that measured baseline only**. The source card *separately* displays manufacturer factory 220/440, labels measured baseline, and never reports +62/+93 as though it were measured. Not a NoordTune Stage 1 commitment. Stage 1 and 2 vehicle-specific output remain withheld. Sources: https://www.bsrtuning.nl/tuning-kits/t/3265/volvo-xc60-d5-awd-220hp-2016-2017-d-5244-t20 and Volvo XC60 2016 engine specifications: https://www.volvocars.com/nl/support/car/xc60/16w17/article/d24bb7d1e21ec6e4c0a801e801cf6114/510652ac31fe5b38c0a801e8014486bc/c48f21dbf78fa679c0a801e800b1d372/.
- **Škoda Octavia 5E 2.0 TDI 150 PS / 340 Nm**, restricted to **2017–2018**: NL-market AutoWeek specifications confirm 150/340 for that 5E facelift, and SW-Performance lists separate **DFF/DCY 150/340** and **CKF/CRM/CYK 150/320** variants. Only the DFF/DCY Stage 1 **170 PS / 380 Nm** source example appears. Do not transfer 150/320 older diesel or 2020-on Octavia IV variants. Sources: https://www.swperformance.de/filter/fahrzeugtyp/pkw/marke/skoda/modell/octavia/typ/octavia_iii_-_5e_seit_11.2012/motorisierung/2.0_tdi_cr_-_150ps.html and https://www.autoweek.nl/auto/90479/skoda-octavia-2-0-tdi-150pk-greentech-style/.

**All 24 public pages now have either a numeric Stage 1 figure or at least one separately labeled published tuning application example.** This is **not** 100% direct Stage 1 availability and **not** RDW fleet-wide tuning coverage. Some examples apply only to selected engines, transmissions and years; none prove the user's installed ECU or calibration is supported.

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

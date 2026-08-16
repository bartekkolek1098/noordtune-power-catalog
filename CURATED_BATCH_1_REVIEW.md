# Curated BMW + VAG Catalog Expansion - Batch 1 Review

## Decision framework

This batch promotes a deliberately small set of generated canonical records into stable public vehicle identities. It does not change the canonical selector/RDW dataset and does not treat generated templates as workshop-verified data.

- Source values are copied without changing stock power, stock torque, tuned power, tuned torque, stages, prices or options.
- Every new public record is `estimated` and has `verificationRequired: true`.
- No engine code or exact TCU type is added because neither is stored on the selected source records.
- Generation/platform labels and publication year ranges scope the public page; they do not upgrade the source data to verified status.
- Each public identity has one stable vehicle URL and three Stage URLs per locale. Year-specific selector records are not published.
- All new pages use a generic placeholder image. This is stated explicitly and should be replaced later only with owned or licensed media.

### Service option key

`S9` means the source record currently references all nine existing service IDs: DPF delete, AdBlue off, EGR off, SCR delete, Immo off, Speed limiter removal, Launch control, Pops & Bangs / Crackle and DSG / TCU tuning. This is preserved for compatibility; it is **not** a verified compatibility claim. Fuel filtering, diagnosis, legal review and vehicle-specific confirmation still apply. None of these paid options is selected or recommended by default in the new publishing registry.

## Selected public batch

All selected source records have structurally complete Stage 1, Stage 2 and Stage 3+ definitions, positive prices, no stock-value regression and a unique explicit public SEO identity.

| Canonical source -> public ID | Identity and source data | Stored technical data | Stages and prices | Publishing review |
| --- | --- | --- | --- | --- |
| `bmw-1-serie-118i-2016` -> `bmw-1-series-f20-f21-118i` | BMW 1 Series F20/F21 118i; Petrol; public scope 2015-2019; stock 136 hp / 220 Nm; engine label `BMW turbo petrol`; engine code not stored | ECU `Bosch MG1 / MEVD`; gearbox `ZF`; exact TCU not stored; options S9 | S1 165 hp / 260 Nm / EUR 269 (`stage1-standard`); S2 195 / 300 / EUR 399 (`stage2-standard`); S3+ 230 / 340 / EUR 679 (`stage3-custom`) | Source confidence estimated; verification required; public slug `bmw/1-series-f20-f21/118i` unique; multiple year records collapse intentionally; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-1-serie-118d-2015` -> `bmw-1-series-f20-f21-118d` | BMW 1 Series F20/F21 118d; Diesel; 2015-2019; stock 150 hp / 330 Nm; engine label `2.0d / 3.0d BMW diesel`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `ZF`; exact TCU not stored; options S9 | S1 180 / 390 / EUR 269 (`stage1-standard`); S2 200 / 440 / EUR 399 (`stage2-standard`); S3+ 230 / 490 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/1-series-f20-f21/118d` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-1-serie-120d-2015` -> `bmw-1-series-f20-f21-120d` | BMW 1 Series F20/F21 120d; Diesel; 2015-2019; stock 190 hp / 400 Nm; engine label `2.0d / 3.0d BMW diesel`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `ZF`; exact TCU not stored; options S9 | S1 230 / 470 / EUR 269 (`stage1-standard`); S2 255 / 530 / EUR 399 (`stage2-standard`); S3+ 290 / 590 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/1-series-f20-f21/120d` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-3-serie-318d-2015` -> `bmw-3-series-f30-f31-318d` | BMW 3 Series F30/F31 318d; Diesel; 2015-2019; stock 150 hp / 320 Nm; engine label `2.0d / 3.0d BMW diesel`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `ZF`; exact TCU not stored; options S9 | S1 180 / 380 / EUR 269 (`stage1-standard`); S2 200 / 420 / EUR 399 (`stage2-standard`); S3+ 230 / 470 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/3-series-f30-f31/318d` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-3-serie-330d-2015` -> `bmw-3-series-f30-f31-330d` | BMW 3 Series F30/F31 330d; Diesel; 2012-2019; stock 258 hp / 560 Nm; engine label `2.0d / 3.0d BMW diesel`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `ZF`; exact TCU not stored; options S9 | S1 310 / 660 / EUR 269 (`stage1-standard`); S2 345 / 740 / EUR 399 (`stage2-standard`); S3+ 390 / 830 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/3-series-f30-f31/330d` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-5-serie-520d-2015` -> `bmw-5-series-f10-f11-520d` | BMW 5 Series F10/F11 520d; Diesel; 2014-2017; stock 190 hp / 400 Nm; engine label `2.0d / 3.0d BMW diesel`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `ZF`; exact TCU not stored; options S9 | S1 230 / 470 / EUR 269 (`stage1-standard`); S2 255 / 530 / EUR 399 (`stage2-standard`); S3+ 290 / 590 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/5-series-f10-f11/520d` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `bmw-3-serie-320i-2019` -> `bmw-3-series-g20-g21-320i` | BMW 3 Series G20/G21 320i; Petrol; 2019-2024; stock 184 hp / 270 Nm; engine label `BMW turbo petrol`; engine code not stored | ECU `Bosch MG1 / MEVD`; gearbox `ZF`; exact TCU not stored; options S9 | S1 225 / 320 / EUR 269 (`stage1-standard`); S2 260 / 370 / EUR 399 (`stage2-standard`); S3+ 315 / 420 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `bmw/3-series-g20-g21/320i` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `volkswagen-golf-1-6-tdi-2017` -> `volkswagen-golf-7-16-tdi` | Volkswagen Golf 7 1.6 TDI; Diesel; 2017-2020; stock 115 hp / 250 Nm; engine `1.6 TDI`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 140 / 300 / EUR 269 (`stage1-standard`); S2 155 / 330 / EUR 399 (`stage2-standard`); S3+ 175 / 370 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `volkswagen/golf-7/1-6-tdi` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `volkswagen-golf-2-0-tdi-2015` -> `volkswagen-golf-7-20-tdi` | Volkswagen Golf 7 2.0 TDI; Diesel; 2013-2020; stock 150 hp / 340 Nm; engine `2.0 TDI`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 180 / 400 / EUR 269 (`stage1-standard`); S2 200 / 450 / EUR 399 (`stage2-standard`); S3+ 230 / 500 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `volkswagen/golf-7/2-0-tdi-150` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `volkswagen-golf-r-2-0-tsi-r-2017` -> `volkswagen-golf-7-r-20-tsi` | Volkswagen Golf 7 R 2.0 TSI; Petrol; 2017-2018; stock 300 hp / 400 Nm; engine `2.0 TSI R`; engine code not stored | ECU `Bosch MED17 / MG1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 365 / 480 / EUR 339 (unmapped); S2 425 / 540 / EUR 509 (unmapped); S3+ 510 / 620 / EUR 949 (`stage3-custom`) | Estimated; verification required; slug `volkswagen/golf-7-r/2-0-tsi-300` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `volkswagen-passat-2-0-tdi-2017` -> `volkswagen-passat-b8-20-tdi` | Volkswagen Passat B8 2.0 TDI; Diesel; 2015-2020; stock 150 hp / 340 Nm; engine `2.0 TDI`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 180 / 400 / EUR 269 (`stage1-standard`); S2 200 / 450 / EUR 399 (`stage2-standard`); S3+ 230 / 500 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `volkswagen/passat-b8/2-0-tdi-150` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `audi-a3-1-6-tdi-2017` -> `audi-a3-8v-16-tdi` | Audi A3 8V 1.6 TDI; Diesel; public scope 2017-2020; stock 116 hp / 250 Nm; engine `1.6 TDI`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 140 / 300 / EUR 269 (`stage1-standard`); S2 155 / 330 / EUR 399 (`stage2-standard`); S3+ 175 / 370 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `audi/a3-8v/1-6-tdi` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `audi-a4-2-0-tdi-190-2017` -> `audi-a4-b9-20-tdi-190` | Audi A4 B9 2.0 TDI 190; Diesel; 2016-2020; stock 190 hp / 400 Nm; engine `2.0 TDI 190`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 230 / 470 / EUR 269 (`stage1-standard`); S2 255 / 530 / EUR 399 (`stage2-standard`); S3+ 290 / 590 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `audi/a4-b9/2-0-tdi-190` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `audi-a4-2-0-tfsi-2017` -> `audi-a4-b9-20-tfsi` | Audi A4 B9 2.0 TFSI; Petrol; 2016-2020; stock 252 hp / 370 Nm; engine `2.0 TFSI`; engine code not stored | ECU `Bosch MED17 / MG1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 305 / 440 / EUR 269 (`stage1-standard`); S2 360 / 500 / EUR 399 (`stage2-standard`); S3+ 430 / 570 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `audi/a4-b9/2-0-tfsi-252` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `audi-a6-3-0-tdi-272-2016` -> `audi-a6-c7-30-tdi-272` | Audi A6 C7 3.0 TDI 272; Diesel; 2014-2018; stock 272 hp / 600 Nm; engine `3.0 TDI 272`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 325 / 710 / EUR 269 (`stage1-standard`); S2 365 / 790 / EUR 399 (`stage2-standard`); S3+ 415 / 890 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `audi/a6-c7/3-0-tdi-272` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `skoda-octavia-2-0-tdi-150-2017` -> `skoda-octavia-5e-20-tdi-150` | Skoda Octavia 5E 2.0 TDI 150; Diesel; 2013-2020; stock 150 hp / 340 Nm; engine `2.0 TDI 150`; engine code not stored | ECU `Bosch EDC17 / MD1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 180 / 400 / EUR 269 (`stage1-standard`); S2 200 / 450 / EUR 399 (`stage2-standard`); S3+ 230 / 500 / EUR 679 (`stage3-custom`) | Estimated; verification required; slug `skoda/octavia-5e/2-0-tdi-150` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |
| `seat-leon-cupra-2-0-tsi-cupra-2017` -> `seat-leon-cupra-5f-20-tsi-300` | SEAT Leon Cupra 5F 2.0 TSI 300; Petrol; 2017-2018; stock 300 hp / 400 Nm; engine `2.0 TSI Cupra`; engine code not stored | ECU `Bosch MED17 / MG1`; gearbox `DSG`; exact TCU not stored; options S9 | S1 365 / 480 / EUR 339 (unmapped); S2 425 / 540 / EUR 509 (unmapped); S3+ 510 / 620 / EUR 949 (`stage3-custom`) | Estimated; verification required; slug `seat/leon-cupra-5f/2-0-tsi-300` unique; year records collapse; generic placeholder; **PUBLISH AS ESTIMATED** |

## Candidate families not promoted in Batch 1

These records remain available to the server-side selector/RDW layer where they already existed. None generates a new public page in this batch.

| Candidate | Canonical evidence reviewed | Data/SEO/media status | Recommendation and reason |
| --- | --- | --- | --- |
| BMW F20/F21 116i | No exact 116i canonical trim found | No stock/stage/price/ECU/gearbox identity to publish; no slug assessed | **MANUAL REVIEW** - do not infer from 118i |
| BMW F20/F21 120i | No exact 120i canonical trim found | No complete exact source identity | **MANUAL REVIEW** |
| BMW F30/F31 320d | Existing `bmw-320d-b47`: 190/400; S1 225/470/EUR 269; S2 245/520/EUR 399; S3+ 280/600/EUR 679; EDC17/MD1; ZF; S9 | Already public with active SEO identity and image; generated year records would collapse/compete | **KEEP EXISTING PUBLIC RECORD** - no duplicate page and no value changes |
| BMW F10/F11 530d | `bmw-5-serie-530d-2015`: 265/620; S1 320/730/EUR 269; S2 355/820/EUR 399; S3+ 405/920/EUR 679; generic EDC17/MD1 and ZF; S9 | Generated family template does not bind the 265 hp profile to a specific F10/F11 engine code; placeholder | **MANUAL REVIEW** |
| BMW G20/G21 330i | `bmw-3-serie-330i-2019`: 252/350; S1 305/420/EUR 269; S2 360/480/EUR 399; S3+ 430/540/EUR 679; generic MG1/MEVD and ZF; S9 | Output/generation identity is insufficiently specific and no engine code is stored | **MANUAL REVIEW** |
| BMW G20/G21 320d | Existing broad B47 page plus generated 320d records | A second page would risk overlap with the active `bmw-320d-b47` SEO identity | **KEEP SELECTOR ONLY** until the existing page is split with verified generation evidence |
| Volkswagen Golf 7 GTI | Existing `vw-golf-20-tsi-ea888`: 230/350; S1 300/450/EUR 305; S2 335/500/EUR 439; S3+ 430/560/EUR 799; MED17/MG1; DSG; S9 | Already public; do not alter values or create a competing page | **KEEP EXISTING PUBLIC RECORD** |
| Audi A3 8V 2.0 TDI | Existing `audi-a3-20-tdi`: 150/340; S1 185/410/EUR 269; S2 205/455/EUR 399; S3+ 240/520/EUR 679; EDC17; DSG; S9 | Already public with active SEO identity | **KEEP EXISTING PUBLIC RECORD** |
| Audi A3 8V 2.0 TFSI | `audi-a3-2-0-tfsi-2015`: 252/370; S1 305/440/EUR 269; S2 360/500/EUR 399; S3+ 430/570/EUR 679; MED17/MG1; DSG; S9 | Generic 252 hp template is not tied to a clear A3 8V trim/engine code; placeholder | **MANUAL REVIEW** |
| Audi A4 B8 2.0 TDI | `audi-a4-2-0-tdi-2015`: 150/340; S1 180/400/EUR 269; S2 200/450/EUR 399; S3+ 230/500/EUR 679; EDC17/MD1; DSG; S9 | B8/B9 and output identity are ambiguous; the cleaner B9 190 source is published separately | **KEEP SELECTOR ONLY** |
| Audi A6 C7 2.0 TDI | `audi-a6-2-0-tdi-2016`: 150/340; S1 180/400/EUR 269; S2 200/450/EUR 399; S3+ 230/500/EUR 679; EDC17/MD1; DSG; S9 | Generic 150 hp family template is not enough to bind a C7 engine variant | **MANUAL REVIEW** |
| Skoda Octavia 5E 1.6 TDI | `skoda-octavia-1-6-tdi-2017`: 116/250; S1 140/300/EUR 269; S2 155/330/EUR 399; S3+ 175/370/EUR 679; EDC17/MD1; DSG; S9 | Structurally usable but held to keep this first batch controlled; engine/TCU code and media absent | **KEEP SELECTOR ONLY** |
| Skoda Octavia vRS 2.0 TSI | `skoda-octavia-2-0-tsi-rs-2017`: 245/370; S1 300/440/EUR 269; S2 350/500/EUR 399; S3+ 415/570/EUR 679; MED17/MG1; DSG; S9 | 245 hp profile is not bound to a verified 5E production/engine identity | **MANUAL REVIEW** |
| SEAT Leon 5F 1.6 TDI | `seat-leon-1-6-tdi-2017`: 116/250; S1 140/300/EUR 269; S2 155/330/EUR 399; S3+ 175/370/EUR 679; EDC17/MD1; DSG; S9 | Structurally usable but held for a later verified batch; generic placeholder and no engine/TCU code | **KEEP SELECTOR ONLY** |
| SEAT Leon 5F 2.0 TDI | `seat-leon-2-0-tdi-2017`: 150/340; S1 180/400/EUR 269; S2 200/450/EUR 399; S3+ 230/500/EUR 679; EDC17/MD1; DSG; S9 | Structurally usable but held to cap Batch 1 and avoid publishing adjacent generic templates indiscriminately | **KEEP SELECTOR ONLY** |

## Pricing summary

- 51 new public stage definitions are exposed (17 vehicles x 3 stages).
- 47 have an exact existing tier mapping: 15 standard vehicles x 3 stages plus the Stage 3+ definitions for Golf R and Leon Cupra.
- Four effective prices remain intentionally unmapped: Golf R Stage 1/2 and Leon Cupra Stage 1/2.
- No effective price is changed.

## SEO impact

- Previous public vehicles: 7
- New public vehicles: 24
- Previous sitemap URLs: 87
- New sitemap URLs: 291
- New localized vehicle pages: 51
- New localized Stage pages: 153
- Total new localized SEO pages: 204

## Required follow-up

1. Confirm engine codes and exact ECU/TCU variants from workshop reads before changing any record to `verified`.
2. Build an explicit service compatibility matrix; the preserved S9 source assignment is not proof of support.
3. Replace all 17 generic placeholders with owned or licensed model-family media.
4. Review the four unmapped performance-stage prices before assigning centralized tiers; preserve current prices until approved.
5. Consider the held selector-only candidates in a later, evidence-led batch rather than bulk publishing adjacent templates.

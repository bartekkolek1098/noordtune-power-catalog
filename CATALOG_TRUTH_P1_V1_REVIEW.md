# Catalog Truth P1 V1 Review

## Scope and provenance

- Implementation base: `63974758f1720d89aaeb031f8366f2d0757d6711` (`origin/main`).
- Research reviewed from Draft PR #20 at `7fd1687ad1d20887e084bf01a2372d668ec03f57`.
- PR #20 remained research-only; no merge or cherry-pick was used.
- The existing per-profile, per-Stage truth overlay was extended. The canonical 58,586-record catalog and sourced provider dataset were not changed.
- Controller names below are documented application families. They do not identify the fitted ECU or TCU and do not establish software access.

## Profile decisions

| Profile | Before | Supported identity | Stage 1 before -> after | Stage 2 result | ECU / TCU wording | Price behavior | Final grade | Remaining confirmation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BMW G20/G21 320i | 184 hp / 300 Nm; Stage 1 and 2 withheld | European G20/G21 320i 184/300 | withheld -> withheld | Withheld until identified; no numeric output | Bosch MG1CS201 is a documented application. MG1CS003 184/270 is incompatible. No fitted DME or access claim. | Stage 1 and 2 on request; no automatic €700 unlock quote | C -> C | Installed DME, software/access state, engine/calibration, fuel, catalyst and transmission |
| Volkswagen Passat B8 2.0 TDI 150 | Broad 2015-2020 B8; 150 hp / stock torque unknown; Stage 1 and 2 withheld | 2019-2020 B8 facelift 2.0 TDI Evo, 150 hp / 340 Nm, six-speed manual | withheld -> 190 hp / 420 Nm point | Custom/on request; no numeric output | Bosch MD1CS004 is a documented application. Earlier EDC17C74 remains a separate application family. | Supported Stage 1 software from €449; other identities on request | C -> B | Facelift generation, 340 Nm stock scope, engine family, manual transmission, fitted ECU and access |
| Ford Focus ST Mk3 facelift | Broad 2012-2018 Mk3, 250 hp / 360 Nm; Stage 1 and 2 withheld | 2015-2018 Mk3 facelift 2.0 EcoBoost petrol, 250/360, Euro 6, MMT6 manual, premium petrol, excluding E85 | withheld -> 265-270 hp / 430-440 Nm range | Custom/on request; no numeric output | Bosch MEDG17.0 and MED17.0 are documented applications; fitted variant remains unidentified. Manual scope has no TCU product. | Supported Stage 1 software from €449 | C -> B | Facelift, petrol engine, 360 Nm stock scope, Euro 6, MMT6 manual, suitable premium fuel and vehicle/clutch condition |
| SEAT Leon Cupra 5F 300 | 2017-2018 5F, 300 hp / stock torque unknown; Stage 1 and 2 withheld | 2017-2018 pre-GPF 300 hp / 380 Nm, RON 98, compatible body/drivetrain, manual or six-speed DSG | withheld -> 350 hp / 460 Nm point | Custom/on request; no numeric output | Continental Simos 18.x and DQ250 are documented applications; no exact Simos suffix or fitted TCU claim. | Supported Stage 1 software from €549; TCU from €249 only after DSG/TCU identification | C -> B | Pre-GPF emissions scope, 380 Nm stock scope, RON 98, body, drivetrain, transmission, fitted ECU/TCU and access |
| BMW 118d F20/F21 LCI | F20/F21 150 hp / stock torque unknown; Stage 1 and 2 withheld | Dutch F20/F21 LCI, 1,995 cc B47 diesel, 150 hp / 320 Nm, Euro 6, manual or eight-speed Steptronic | withheld -> 190 hp / 400 Nm point | Custom/on request; no numeric output | Bosch EDC17C50 and ZF 8HPxx are documented applications; fitted ECU, gearbox and TCU remain unidentified. | Supported Stage 1 software from €449; TCU from €249 only after automatic/TCU identification | C -> B | Dutch market, LCI/B47, 1,995 cc, 320 Nm stock scope, Euro 6, transmission and fitted ECU/TCU |

## Identity gates

The supported Stage 1 number and price survive runtime resolution only when every required non-registration fact is present and compatible. A registration year can reject a scope but cannot confirm it.

- Passat: 2019-2020, 340 Nm, B8 facelift, 2.0 TDI Evo and manual transmission.
- Focus: 2015-2018, 360 Nm, Mk3 facelift, 2.0 EcoBoost, manual transmission, Euro 6 and suitable premium petrol; E85 is rejected.
- Leon: 2017-2018, 380 Nm, 5F pre-GPF, 2.0 TSI, RON 98, compatible manual/DQ250 six-speed DSG, body and drivetrain.
- 118d: 2015-2019, 320 Nm, 1,995 cc, F20/F21 LCI, B47, Euro 6, Dutch market and compatible manual/eight-speed transmission.
- G20: remains withheld even when the supplied facts resemble the reviewed 184/300 configuration.

Missing or conflicting facts remove the numeric output and numeric quote. Confirmed manual identities expose no TCU product. A compatible automatic family exposes the €249 TCU service only as conditional and still requires exact gearbox/TCU identification.

## Counts

| Measure | Result |
| --- | ---: |
| Profiles upgraded C -> B | 4 |
| Profiles remaining C | 1 |
| Numeric Stage 1 points | 3 |
| Numeric Stage 1 ranges | 1 |
| Stage 1 withheld | 1 |
| Numeric Stage 2 outputs | 0 |
| Stage 2 custom/on request | 4 |
| Stage 2 withheld | 1 |
| Stage 3+ custom/on request | 5 |
| Route changes | 0 |
| Price-policy changes | 0 |
| Public vehicles | 24 -> 24 |
| Sitemap URLs | 291 -> 291 |

## Surface and boundary results

- Vehicle pages, Stage pages, charts, calculator, recommendation cards, structured Offers, selector/RDW adapters and WhatsApp drafts use the resolved profile.
- Deliberately withheld output cannot be restored from the canonical source ID.
- Customer DTOs remove internal identity-gate data and review vocabulary.
- Client imports of the server catalog and sourced provider dataset remain zero.
- WhatsApp is a generated draft link only; browser QA did not open it or send a message.
- Plate/query data is not added to routes, analytics, storage or tracked artifacts.

## Validation

- `pnpm catalog:audit`: PASS; 24 public vehicles, 58,586 canonical records, 175,758 Stages, 291 sitemap URLs, 0 critical issue groups and 0 client catalog imports.
- `pnpm test:tuning`: PASS; includes 31,695 dataset assertions, 672 quote-surface assertions, 720 retained P0 assertions and 169 focused P1 assertions.
- `pnpm test:seo`: PASS; 291 unique routes, 24 vehicles and localized metadata/offers.
- `pnpm lint`: PASS.
- `pnpm typecheck`: PASS.
- `pnpm build`: PASS; 298 static pages generated.
- Focused browser QA: PASS; five NL vehicle pages, 15 NL Stage routes, EN/PL spot checks, 19 Stage interactions, structured Offers and sitemap 291. No console/page errors, horizontal overflow or outgoing message.

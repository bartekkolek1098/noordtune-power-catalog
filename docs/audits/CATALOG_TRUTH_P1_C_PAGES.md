# Catalog Truth P1 — remaining C-grade public profiles

**Status:** RESEARCH ONLY — NO PRODUCT CHANGES

**Research date:** 2026-10-05

**Baseline:** `origin/main` at `63974758f1720d89aaeb031f8366f2d0757d6711`

**Scope:** the five public profiles left at grade C by Catalog Truth P0

This report recommends narrowly scoped follow-up changes. It does not change catalog data, runtime behavior, prices, routes, structured offers, analytics, storage, or WhatsApp behavior. A tuning-tool application proves that a controller family is supported for some matching vehicles; it does not identify the controller installed in a customer car. Registration year alone is never treated as controller, engine, gearbox, fuel, or emissions evidence.

## Executive decision

| Public profile | P0 grade | P1 proposed grade | Factory identity | Stage 1 decision | Stage 2 decision | Public pricing decision |
| --- | --- | --- | --- | --- | --- | --- |
| BMW G20/G21 320i | C | **C** | European 2019 launch scope: 1,998 cc petrol, 184 hp / 300 Nm, 8-speed Steptronic | **WITHHOLD_UNTIL_IDENTIFIED**; published compatible-looking results diverge too widely | **WITHHOLD_UNTIL_IDENTIFIED**; no numeric output | On request; do not assign a package price before identity and calibration scope are known |
| Volkswagen Passat B8 2.0 TDI 150 | C | **B, conditional** | 2019 facelift split: 150 hp / 340 Nm manual and 150 hp / 360 Nm 7-speed DSG | **190 hp / 420 Nm** only for confirmed 2019–2020 facelift 340 Nm scope | **CUSTOM_ON_REQUEST**; no numeric output | Stage 1 software from **€449** only for the supported 340 Nm scope; otherwise on request |
| Ford Focus ST Mk3 2.0 EcoBoost | C | **B, conditional** | Facelift technical scope: 250 PS / 360 Nm, Euro 6, six-speed manual | **265–270 hp / 430–440 Nm** for identified facelift petrol/manual scope; exclude E85 | **CUSTOM_ON_REQUEST**; no numeric output | Stage 1 software from **€449**; hardware and dyno work remain extra where applicable |
| SEAT Leon Cupra 5F 300 | C | **B, conditional** | 2017 pre-GPF Cupra 300: 300 PS / 380 Nm, RON 98; six-speed manual or six-speed DSG, with ST 4Drive also offered | **350 hp / 460 Nm** for confirmed 2017–2018 pre-GPF 300/380 scope | **CUSTOM_ON_REQUEST**; no numeric output | Stage 1 software from **€549**; TCU from €249 remains conditional; parts and installation extra |
| BMW F20/F21 118d 150 | C | **B, conditional** | 2015 LCI Dutch scope: 1,995 cc diesel, 150 hp / 320 Nm, six-speed manual or optional eight-speed Steptronic, Euro 6 | **190 hp / 400 Nm** for confirmed F20/F21 LCI 150/320 scope | **CUSTOM_ON_REQUEST**; no numeric output | Stage 1 software from **€449**; conditional TCU work from €249 only after transmission identification |

**Grade result:** four profiles can become useful grade-B pages without pretending that the installed ECU, TCU, or hardware has been identified. The G20 remains grade C because correct factory stock data and controller application coverage still do not yield a stable, compatible tuning target. None reaches grade A because all five still require vehicle-specific identity and condition checks.

## Evidence and compatibility rules

1. Manufacturer technical material controls factory identity, output, gearbox, fuel, and generation boundaries.
2. Current official tuning-tool application pages establish documented ECU/TCU application coverage. They never prove the fitted unit, software access state, or unlock method for an individual vehicle.
3. A Stage 1 number is accepted only when at least two independent tuners start from the same compatible factory scope and converge on a useful point or range.
4. A Stage 2 number is accepted only when compatible sources agree on output and sufficiently align on required hardware, fuel, emissions configuration, and transmission limits. A provider label alone is insufficient.
5. Dutch market pages are used for commercial availability and price context. Their numbers are excluded when stock identity is incompatible or materially underspecified.
6. Published output remains an estimate subject to engine health, fuel, installed software/hardware, dyno method, environmental conditions, and gearbox limits. It is not a guaranteed result.

## 1. BMW G20/G21 320i — keep grade C

### Factory identity

[BMW's European G20 launch specification](https://www.press.bmwgroup.com/global/article/attachment/T0285128EN/425810) identifies the 320i as a 1,998 cc four-cylinder petrol model with 184 hp, 300 Nm and eight-speed Steptronic, entering the market in March 2019 and certified to EU6d-TEMP in that launch scope. This confirms the P0 stock correction and excludes the 184/270 starting point found on some tuner pages.

The public route may keep the G20/G21 generation wording, but a customer vehicle still needs engine/software identity, market configuration, fuel and catalyst state confirmed. A model badge and registration date do not resolve those items.

### ECU / transmission application

- [AutoTuner MG1CS201](https://us.autotuner.com/blogs/news/bmw-dde8-dme8-bench-read-write-solution-now-available-no-mail-in-unlock) documents a G20/G21 20i 184/300 application under Bosch MG1CS201 and describes bench read/write coverage.
- [AutoTuner MG1CS003](https://us.autotuner.com/pages/ecu/bosch-mg1cs003-spc5777m) separately lists a G20 20i application beginning at 184/270. That incompatible stock scope is evidence against selecting an exact controller from the model name.
- A secondary-hosted [Dimsport supported-vehicle list](https://tuning-shop.com/media/uploads/en/fileuploads/blocks/7/Dimsport_Supported_Vehicles_Tuning_shop_com_11_03_2025.pdf) also associates a G20/G21 320i 184 application with MG1CS201, but it does not supersede an actual ECU read or part-number check.

**Controller wording:** “Bosch MG1CS201 is a documented application for a 184/300 G20/G21 320i; the installed DME, software/access state and engine suffix require identification.” Do not publish a universal MG1CS201 claim.

### Stage decisions

The current market does not provide a defensible common Stage 1 target. [Ventura Tuning](https://venturatuning.nl/chiptuning-bmw-3-serie-g20-g21-2019-320i-184-pk) advertises several choices up to 235/350 and 260/400, while other exact-badge listings publish materially higher combinations such as 250/440, 280/450, 300/420 or 300/450. Some suppliers are commercially related, and some pages do not establish the same engine, controller, fuel or catalyst scope. A wide envelope would hide incompatibility rather than describe expected variance.

- **Stage 1:** `WITHHOLD_UNTIL_IDENTIFIED`; no public numeric output.
- **Stage 2:** `WITHHOLD_UNTIL_IDENTIFIED`; no public numeric output. Exact engine/DME, fuel, catalyst, hardware bill, transmission and torque limits must be selected before a package can be assessed.
- **Stage 3+:** custom/on request, unchanged.
- **Price:** on request. Do not attach the higher-complexity €549/€699 schedule to an unresolved output/application.

### Exact recommendation

| Field | Before on main | Proposed after owner approval |
| --- | --- | --- |
| Stock | 184 hp / 300 Nm | Keep |
| ECU | Unknown/unconfirmed | Document MG1CS201 as a compatible application, explicitly subject to fitted-DME and access confirmation; retain MG1CS003 184/270 as an incompatible warning |
| Stage 1 | Withheld | Keep withheld until identification |
| Stage 2 | Withheld | Keep withheld until identification; no numeric output or numeric quote |
| Grade | C | Keep C |
| Customer note | 184/300 stock; tuning output after identification | Name engine/DME/access/fuel/catalyst/transmission checks and keep both output and quote non-numeric |
| Tests | Existing P0 withheld checks | Add negative 184/270 fixture, MG1CS201 application-only wording, and no-output/no-quote assertions |

**Evidence still needed:** VIN/build data, engine suffix, ECU hardware/software identifiers, current access/unlock status, fuel expectation, catalyst/emissions configuration, gearbox identity and a second independent output source compatible with that exact scope.

## 2. Volkswagen Passat B8 2.0 TDI 150 — conditional grade B

### Factory identity

Volkswagen's [2019 Passat update technical material](https://www.volkswagen-newsroom.com/en/the-new-passat-the-update-5070/download) establishes a configuration split that explains the earlier conflict: the facelift 2.0 TDI Evo 150 is published at 340 Nm with the manual gearbox and 360 Nm with the seven-speed DSG. The existing public profile spans 2015–2020, so one torque value cannot be assigned to that entire interval.

**Public boundary:** numeric P1 recommendations apply only to an identified 2019–2020 facelift, 150 hp / 340 Nm configuration. The 2015–2018 pre-facelift population and the 150/360 seven-speed DSG configuration remain conditional with output withheld pending their own matching evidence.

### ECU / transmission application

- [AutoTuner MD1CS004](https://us.autotuner.com/pages/ecu/bosch-md1cs004-tc298) lists Passat applications including a 2019+ EU6.2 150/340 configuration. Its listings also show different earlier stock scopes, reinforcing the need for engine/controller identification.
- [AutoTuner's MD1CS004 protocol note](https://www.autotuner.com/blogs/news/bosch-md1cs004) describes current support and access caveats, including hardware-generation differences; it does not prove a particular Passat's access state.
- A legacy [Powergate vehicle list](https://ecufiles.com/assets/downloads/ECUFILES_Powergate3_vehicle_list_01_2024.pdf) associates an earlier B8 150/340 application with Bosch EDC17C74. It is historical, secondary-hosted application evidence and must not be converted into a fitted-controller claim.

**Controller wording:** “Bosch MD1CS004 is documented for the identified facelift 150/340 application; earlier B8 applications may use EDC17C74. Confirm engine code, installed ECU and access before quoting.”

### Stage decisions

[Shiftech's 2019 EU6.2 page](https://www.shiftech.eu/en/chiptuning/car/volkswagen/passat/2019/diesel/2.0-tdi-cr-eu6.2-150) and [RS-Tronic's matching 2019 page](https://rstronic.com/en/chiptuning/volkswagen/passat/2019/2.0-tdi-cr-eu6.2-150) both start at 150/340 and publish Stage 1 at 190/420. That supports a point only within the confirmed facelift 340 Nm scope.

Shiftech advertises Stage 2 at 200/440 but its generic parts text does not define a shared diesel bill of materials, emissions configuration or gearbox limit. A single compatible numeric listing is not enough.

- **Stage 1:** `SUPPORTED_POINT` at **190 hp / 420 Nm**, only for confirmed 2019–2020 facelift 150/340 scope.
- **Stage 2:** `CUSTOM_ON_REQUEST`; no numeric output. Confirm diesel hardware/emissions configuration and manual/DSG limits.
- **Stage 3+:** custom/on request, unchanged.
- **Price:** existing contemporary-standard Stage 1 software from **€449** for the supported scope; otherwise on request. Parts, installation and dyno work are extra where applicable.

### Exact recommendation

| Field | Before on main | Proposed after owner approval |
| --- | --- | --- |
| Scope | 2015–2020 B8, unresolved torque | Split public truth: supported 2019–2020 facelift 150/340 scope; retain older and 150/360 DSG cases as conditional |
| Stock torque | Withheld | 340 Nm only inside the supported facelift/manual evidence scope; otherwise withheld |
| ECU | Unknown | MD1CS004 documented facelift application; EDC17C74 historical earlier application; installed unit required |
| Stage 1 | Withheld | 190 hp / 420 Nm in supported scope only |
| Stage 2 | Withheld | Custom/on request, no numeric output |
| Grade | C | B, conditional |
| Customer note | Stock torque and output unresolved | Explain that 190/420 applies only to the confirmed facelift 150/340 scope; older and 150/360 DSG cases require separate matching |
| Tests | Existing withheld checks | Add 340 manual, 360 DSG and pre-facelift fixtures; only the supported 340 scope receives 190/420 and from-price |

**Evidence still needed:** engine code and production date for earlier cars; exact ECU part/software; manual versus DSG identity; 360 Nm DSG-specific compatible output and torque-limit evidence; emissions hardware and any Stage 2 component list.

## 3. Ford Focus ST Mk3 — conditional grade B

### Factory identity

Ford's [facelift Focus ST technical specification](https://media.ford.com/content/dam/fordmedia/Europe/documents/productReleases/Focus%20ST/FocusST-2014_Technical_Specifications_EU.pdf) records the 2.0 EcoBoost at 250 PS and 360 Nm, Euro 6, with the MMT6 six-speed manual gearbox. It also names Bosch “MEDG17-I4” at the manufacturer-system level. This supports a facelift petrol/manual scope, not every 2012–2018 car under the broad public route.

### ECU / transmission application

- [AutoTuner MEDG17.0 TC1797](https://us.autotuner.com/pages/ecu/bosch-medg17-0-tc1797) lists Focus MkIII/MkIII 2014+ 250/360 applications.
- [AutoTuner MED17.0 TC1767](https://us.autotuner.com/pages/ecu/bosch-med17-0-tc1767) also lists an exact-badge 250/360 application.

The two official application pages show why “Bosch MEDG17.0” cannot be inferred from badge and year alone. The installed ECU identifier must choose the actual protocol path.

### Stage decisions

[BR Performance's facelift page](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/7022-iii-facelift-2014-2018/7872-st-2-0t-ecoboost/) publishes 270/430 from 250/360 and expressly excludes E85. [Shiftech's facelift page](https://www.shiftech.eu/en/chiptuning/car/ford/focus/2014-mkiii/petrol/2.0-t-ecoboost-st-250) publishes 265/440 from the same stock point. Together they support a conservative envelope for an identified facelift petrol/manual vehicle. The Dutch [Unlimited Tuning page](https://www.unlimitedtuning.nl/chiptuning-ford-focus-st-2-0-ecoboost-250-pk.html) provides a local commercial price check, but its 485 Nm claim is an outlier and is excluded from the accepted output range.

Stage 2 packages do not align: [BR's Stage 2](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/23-ford/1123-focus/7022-mk3-facelift-2014-2018/7872-st-2-0t-ecoboost/?stage=6885) publishes 290/450 with intake, intercooler and a sport-catalyst exhaust, whereas Shiftech publishes 278/462 with a more generic package description. A third [Wayside guide](https://wayside-performance.co.uk/pages/mk3-focus-st250-tuning-guide-stage-1-stage-2-wayside-performance) uses still another hardware/output envelope. These are real offerings but do not define one NoordTune numeric package.

- **Stage 1:** `SUPPORTED_RANGE` at **265–270 hp / 430–440 Nm** for identified facelift petrol/manual scope, appropriate premium petrol, excluding E85.
- **Stage 2:** `CUSTOM_ON_REQUEST`; no numeric output. Intake, intercooler and emissions-compliant sport-catalyst exhaust are configuration checks, not automatically included parts.
- **Stage 3+:** custom/on request, unchanged.
- **Price:** existing contemporary-standard Stage 1 software from **€449**. No TCU offer for the manual gearbox. Hardware, installation and dyno work remain extra.

### Exact recommendation

| Field | Before on main | Proposed after owner approval |
| --- | --- | --- |
| Scope | Broad Mk3 2012–2018 | Numeric output limited to facelift 2014/2015–2018 250/360 petrol, six-speed manual; pre-facelift remains withheld |
| ECU | Unknown | MEDG17.0 and MED17.0 are documented applications; fitted ECU required |
| Stage 1 | Withheld | 265–270 hp / 430–440 Nm for supported scope |
| Stage 2 | Withheld | Custom/on request, no numeric output |
| Fuel | Unresolved | Premium petrol appropriate to the calibration; E85 excluded from this recommendation |
| Grade | C | B, conditional |
| Customer note | Output after identification | State the facelift/manual/premium-fuel boundary and that Stage 2 hardware is individually agreed |
| Tests | Existing withheld checks | Add facelift/pre-facelift, E85 exclusion, no-manual-TCU and no-numeric-Stage-2 fixtures |

**Evidence still needed:** build/facelift identity, engine calibration code, fitted ECU, fuel grade, catalyst condition, clutch condition and an agreed Stage 2 hardware bill. Pre-facelift numeric publication needs separately compatible evidence.

## 4. SEAT Leon Cupra 5F 300 — conditional grade B

### Factory identity

SEAT's manufacturer technical sheets for the [Leon ST Cupra 300](https://mundoseat.seat.com/mediacenter_netstor/seat-media-center/global_site/documents/Leon-Cupra/en/CT_new_SEAT_Leon_ST_CUPRA_300_EN.pdf) and [Leon SC Cupra 300](https://mundoseat.seat.com/mediacenter_netstor/seat-media-center/global_site/documents/Leon-Cupra/en/CT_new_SEAT_Leon_SC_CUPRA_300_EN.pdf) specify 300 PS, 380 Nm, RON 98 and Euro 6, with six-speed manual and six-speed DSG configurations; the ST also had a 4Drive configuration. Dutch [AutoWeek catalog data](https://www.autoweek.nl/auto/90879/seat-leon-2-0-tsi-cupra-300/) independently corroborates a Dutch-market 300/380 listing.

The recommendation is limited to the existing 2017–2018 pre-GPF Cupra 300/380 scope. Later 290 hp, DQ381 or GPF configurations are not transferred into it.

### ECU / transmission application

AutoTuner lists exact-badge 300/380 applications under several Continental families: [Simos 18.2](https://us.autotuner.com/pages/ecu/continental-simos18-2-tc1791), [Simos 18.3](https://us.autotuner.com/pages/ecu/continental-simos18-3-tc1791), [Simos 18.6](https://us.autotuner.com/pages/ecu/continental-simos18-6-tc1791) and [Simos 18.10](https://us.autotuner.com/pages/ecu/continental-simos18-10-tc1791). This supports only “Simos 18.x documented application.” [AutoTuner DQ250 MQB](https://us.autotuner.com/pages/ecu/temic-dq250-mqb-tc1766) documents a 2017 300/380 transmission application, but the actual body, drivetrain, gearbox and TCU still require identification.

### Stage decisions

[Shiftech](https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/2.0-tsi-300) and Dutch [VAGTechniek](https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/2.0-tsi-cupra-300pk/) both start at 300/380 and publish Stage 1 at 350/460. Their Stage 2 offerings diverge: Shiftech publishes 368/483 with downpipe/sport catalyst and optional intake/cooling, while VAGTechniek publishes 390/500 with a changed downpipe/filter and separate DSG or clutch decisions. The difference is too large for a common numeric Stage 2.

- **Stage 1:** `SUPPORTED_POINT` at **350 hp / 460 Nm**, RON 98, only for confirmed 2017–2018 pre-GPF 300/380 scope.
- **Stage 2:** `CUSTOM_ON_REQUEST`; no numeric output. Agree body/drivetrain, manual clutch or DSG/TCU, downpipe, emissions-compliant sport catalyst, intake/cooling and fuel. Do not imply catalyst deletion.
- **Stage 3+:** custom/on request, unchanged.
- **Price:** existing higher-complexity Stage 1 software from **€549**. TCU from **€249** remains conditional after identification. Hardware and installation are extra.

### Exact recommendation

| Field | Before on main | Proposed after owner approval |
| --- | --- | --- |
| Stock torque | Withheld | 380 Nm inside confirmed 2017–2018 pre-GPF Cupra 300 scope |
| ECU | Simos 18.x application wording | Keep family wording; add exact installed-suffix requirement |
| Transmission | Unresolved | Manual or six-speed DSG within factory scope; DQ250 is a documented application, not a fitted claim |
| Stage 1 | Withheld | 350 hp / 460 Nm, RON 98, supported scope only |
| Stage 2 | Withheld | Custom/on request, no numeric output |
| Grade | C | B, conditional |
| Customer note | Exact stock/variant still to confirm | State pre-GPF 300/380, RON 98, Simos/body/drivetrain/gearbox checks and individual Stage 2 package |
| Tests | Existing withheld checks | Add later 290/GPF/DQ381 exclusions, Simos-family wording, conditional TCU and no-numeric-Stage-2 fixtures |

**Evidence still needed:** body/drivetrain, engine and emissions/GPF identity, fitted Simos suffix, manual/DSG and TCU identity, fuel, clutch/DSG limits and the exact Stage 2 bill of materials.

## 5. BMW F20/F21 118d 150 — conditional grade B

### Factory identity

BMW Netherlands' [2015 1 Series LCI specification](https://www.press.bmwgroup.com/netherlands/article/attachment/T0200822NL/291912) resolves the earlier market conflict for the Dutch launch scope: the F20/F21 118d uses a 1,995 cc diesel rated at 150 hp and 320 Nm, with a six-speed manual or optional eight-speed Steptronic, and Euro 6 classification. [Mosselman](https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp) identifies its matching Dutch commercial application as B47; the public page should still ask for vehicle-specific engine confirmation rather than infer a suffix from registration year.

### ECU / transmission application

- [AutoTuner EDC17C50 TC1797](https://us.autotuner.com/pages/ecu/bosch-edc17c50-tc1797) lists an F20-LCI 18d 150/320 application.
- [AutoTuner's BMW EDC17 coverage note](https://www.autotuner.com/blogs/news/bosch-edc17-one) documents multiple EDC17 subfamilies and access coverage, so `EDC17C50` must remain application evidence until the fitted unit is read.
- [AutoTuner ZF 8HPxx SH72549](https://us.autotuner.com/pages/ecu/zf-8hpxx-sh72549) and [SH7254x](https://us.autotuner.com/pages/ecu/zf-8hpxx-sh7254x) list matching automatic applications. Neither identifies the TCU installed in a particular car.

### Stage decisions

[Shiftech](https://www.shiftech.eu/en/chiptuning/car/bmw/1-serie/2015-f20-lci/diesel/18d-150), Dutch [Mosselman](https://www.mosselmanturbo.com/nl/bmw-118d-f20-f21-lci-150hp) and [BR Performance](https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/5-bmw/508-serie-1/7080-f2x-lci-2015-2019/7088-118d/) independently converge on 190/400 from 150/320. That supports a point for the confirmed LCI scope.

Shiftech advertises Stage 2 at 200/420, but the retrieved page does not establish a diesel-specific hardware/emissions package or manual/eight-speed limits. One number without a complete compatible package remains insufficient.

- **Stage 1:** `SUPPORTED_POINT` at **190 hp / 400 Nm**, only for confirmed F20/F21 LCI 150/320 scope.
- **Stage 2:** `CUSTOM_ON_REQUEST`; no numeric output. Confirm diesel hardware, retained emissions equipment and manual/eight-speed torque limits.
- **Stage 3+:** custom/on request, unchanged.
- **Price:** existing contemporary-standard Stage 1 software from **€449**. Conditional TCU work from **€249** only for an identified automatic application. Hardware, installation and dyno work remain extra.

### Exact recommendation

| Field | Before on main | Proposed after owner approval |
| --- | --- | --- |
| Stock torque | Withheld after 320/330 conflict | 320 Nm for confirmed Dutch 2015+ F20/F21 LCI 118d 150 scope |
| Engine | Generic 2.0 diesel | F20/F21 LCI 2.0 diesel; B47 is matching application evidence, vehicle-specific engine identity still required |
| ECU | EDC17 application wording | EDC17C50 documented application; fitted ECU and access required |
| Stage 1 | Withheld | 190 hp / 400 Nm in supported scope |
| Stage 2 | Withheld | Custom/on request, no numeric output |
| Grade | C | B, conditional |
| Customer note | Stock torque and output after confirmation | State Dutch LCI 150/320 applicability, 190/400 indication, and engine/ECU/transmission confirmation |
| Tests | Existing withheld checks | Add 320-versus-330 fixture, EDC17C50 application-only wording, conditional automatic TCU and no-numeric-Stage-2 fixtures |

**Evidence still needed:** VIN/build/engine identity, fitted ECU hardware/software, access state, manual or eight-speed transmission/TCU, condition, diesel emissions hardware and a second compatible Stage 2 package before any public Stage 2 number.

## Dutch commercial check

| Profile | Dutch-facing evidence | Observed market behavior | NoordTune recommendation |
| --- | --- | --- | --- |
| G20 320i | Ventura | Multi-level product choices and materially divergent outputs; higher advertised prices do not resolve compatibility | Keep quote and outputs on request |
| Passat facelift 150/340 | RS-Tronic plus broader Dutch market context | Compatible Stage 1 advertised around €390, often with dyno separately charged | Preserve NoordTune Stage 1 from €449 for identified supported scope |
| Focus ST facelift | BR Performance NL and Unlimited Tuning | €650 and €399 examples; Unlimited torque is an excluded outlier; dyno may be separate | Preserve Stage 1 from €449 and disclose extras |
| Leon Cupra 300 | VAGTechniek and Shiftech NL-facing pages | Quote/package pricing varies with DSG, downpipe, filter and dyno decisions | Preserve Stage 1 from €549; TCU from €249 conditional; Stage 2 on request |
| 118d LCI | Mosselman NL plus Shiftech/BR | Exact compatible output is sold in the market; price and dyno model varies | Preserve Stage 1 from €449; TCU conditional; Stage 2 on request |

This comparison supports the existing NoordTune schedules. It does not justify a €269 fallback, silently bundled hardware, a guaranteed dyno result, or a numeric quote for an unresolved package.

## Cross-profile implementation recommendation

If the owner later authorizes product changes:

1. Encode explicit applicability gates, rather than changing the underlying generic catalog templates.
2. Allow numeric stock and Stage 1 values only when the selected public profile plus confirmed identity satisfies the narrow scope above.
3. Keep all five Stage 2 prices on request and all five Stage 2 numeric outputs absent.
4. Keep every Stage 3+ custom/on request.
5. Preserve current price schedules: contemporary-standard Stage 1 from €449; higher-complexity Stage 1 from €549; conditional TCU from €249; conditional advanced unlock from €700.
6. Keep hardware, installation and dyno work outside software price unless explicitly itemized.
7. Require UI, structured `Offer`, selector/calculator, graph and decoded WhatsApp draft to agree. Never send a WhatsApp message during tests.
8. Keep plate data out of routes, query strings, analytics, storage, logs, snapshots and committed fixtures; retain the server-only 58,586-record catalog boundary.

## Required tests for a later implementation PR

- Unit/contract checks for all five exact identities, grade changes and Stage decisions.
- Negative fixtures proving G20 184/270 evidence cannot populate the 184/300 route.
- Passat fixtures for 340 Nm manual, 360 Nm DSG and older pre-facelift cases; only the first receives 190/420.
- Focus facelift versus pre-facelift fixtures; E85 excluded; no TCU product on the manual profile.
- Leon pre-GPF 300/380 versus later 290/GPF/DQ381 fixtures.
- 118d 150/320 LCI versus incompatible 330 Nm/generic templates.
- UI/structured Offer/WhatsApp parity for numeric, range, withheld and custom states in NL/EN/PL.
- Price assertions for €449/€549 schedules, conditional €249 TCU, conditional €700 unlock, no €269 fallback and hardware excluded.
- Sitemap remains exactly 291 unique URLs with 24 public vehicles and no plate/query routes.
- Production bundle/client graph contains no import of the 58,586-record server catalog.
- Synthetic browser interaction only; no real WhatsApp message and no plate persistence.

## Release boundary

This research branch contains only this report and its two JSON companions. It does not implement the recommendations. PR #18 remains a separate research-only body of work and is neither modified nor merged by this task. Any product change, merge, deployment or promotion requires a later explicit owner decision.

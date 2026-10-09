# NoordTune NL van engine coverage — RDW batch 6 (2026-10-09)

**Scope:** technical, vehicle-identity-specific Stage 1 reference data for Dutch light commercial vans. No guarantee or dynamometer claim. All ECU, transmission, engine generation, vehicle condition and Euro/emissions phase require owner-specific workshop confirmation.

**Base release:** `ee12e96` (274 canonical URLs, 1,775/3,000 source-linked Stage 1 in a frozen nonrepresentative RDW cohort). **Feature branch:** `feature/nl-vans-reviewed-rdw-batch6-20261009`. Changes are separate from the main `www.noordtune.nl` services website.

## Batch6: 7 exact RDW applications, 6 engine articles and 1 expanded model

| Subject | Scope from RDW | Marketing power | Ordinary Stage 1 reference | Frozen matches |
|---|---|---|---|---:|
| Fiat Ducato older 2.3 MultiJet 130 | type 250 / 2287 cc / 96 kW, 2013–2015 | 130 pk, RDW arithmetic 131 | **180 pk / 410–420 Nm** | 11 |
| Fiat Ducato later 2.3 MultiJet Euro 6 | type 250 / 2287 cc / 96 kW, 2018–2019 | 130 pk, RDW arithmetic 131 | **160 pk / 400 Nm** | 5 |
| Mercedes Vito 114 CDI (2023 phase) | 639/4 / 1950 cc / 100 kW, 2023 | 136 pk | **195 pk / 435 Nm** | 1 |
| Mercedes Vito 114 CDI (2024 Euro6e source phase) | 639/4 / 1950 cc / 100 kW, 2024 | 136 pk | **190 pk / 430 Nm** | 1 |
| Sprinter 315 CDI 2.0 (2020) | 906BB35 / 1950 cc / 110 kW, 2020 | 150 pk | **190 pk / 430 Nm** | 3 |
| Sprinter 315 CDI 2.0 (2024) | 906BB35 / 1950 cc / 110 kW, 2024 | 150 pk | **190 pk / 430 Nm** | 2 |
| Peugeot Expert 2.0 BlueHDi 180 | V / 1997 cc / 130 kW, 2019–2022 | 180 pk, RDW arithmetic 177 | **205–215 pk / 460–470 Nm** | 3 |

**NET SOURCE-COVERAGE DELTA:** before **1,775 / 3,000 (59.17%)**, after **1,778 / 3,000 (59.27%)**, or **+3**, not +26. The other 23 matching sample observations were already handled by earlier verified-source results. These sample counts must not be presented as a percentage of all Netherlands commercial vans or used to infer Dutch fleet distribution. **1,217** observations still lack a numeric Stage 1 output. Five other numeric results remain in the frozen report as unverified and are excluded from the source-linked statistic. Stage 2 does not inherit any new unsourced values; Stage 3 numeric remains zero.

### Verified source addresses and editorial cautions

- **Ducato older 2011–2016:** [BR-Performance](https://www.br-performance.be/en-be/chiptuning/1-cars/22-fiat/1025-ducato/4048-09-2011-2016/4050-130-multijet/) 180/410, [ATM](https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-130pk/) 180/420, [Revtuning](https://revtuning.eu/nl/product/chiptuning-fiat-ducato-2-3-130-multijet-130hp-2011-2016) 180/420. Distinct old-generation F1AE from Euro6 F1AGL; type 250 does not prove installed ECU.
- **Ducato 2016–2019 Euro6:** [ATM](https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-eur6-130pk/) and [Revtuning](https://revtuning.eu/product/chiptuning-fiat-ducato-2-3-130-multijet-eur6-130hp-2016-2019) both publish 160/400, rather than the older-generation 180/420. Euro and fitted ECU must be checked.
- **Vito 2023 original 100 kW:** [ATM](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-vito-114-cdi-20d-euro-6-2021-136pk/), [NRS](https://www.nrstechniek.nl/vehicle-details/mercedes-benz/vito/2020/114-cdi-2-0d-euro-6-2021-136hp/) and [Dyno-ChiptuningFiles](https://www.dyno-chiptuningfiles.com/chiptuning-file/mercedes-benz-vito-114-cdi-20d-euro-6-2021-136hp/) all refer to 195/435. Other tuner pages cite 220–265 pk for different ECU/software scope; these are **not** imported. RDW type 639/4 does not prove W447 or Euro phase.
- **Vito 2024 Euro6e source group:** [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1892-vito/13011-2024/18071-114-cdi-1-95d-euro-6e/), [ECU-Soft](https://www.ecu-soft.be/chiptuning/mercedes/vito/13011/114-cdi-1-95d-euro-6e-136-21237) and [Bortec](https://bortec-tuning.de/tuning/mercedes-benz/vito/2024/114-cdi-1.95d-euro-6e-136-ps/) publish 190/430. Emissions phase and ECU need physical confirmation.
- **Sprinter 2020:** [ATM](https://www.atm-chiptuning.com/chiptuning/mercedes-benz-sprinter-315-cdi-150pk/), [DTX](https://dtxchiptuning.com/mercedes-benz/sprinter/2018-2020/mercedes-benz-sprinter-2018-2020-315-cdi-150hp/) and [BR](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/9918-w910-06-2018-10-2021/12389-315-cdi-euro-6-d-full/) publish 190/430; RDW type 906BB35 is **not** evidence of W910 chassis.
- **Sprinter 2024:** [Van Drie](https://vandrieperformance.nl/voertuigen/mercedes-sprinter-2021-0-315-cdi-euro-6-d-full-150pk/), [Dyno ChiptuningFiles](https://www.dyno-chiptuningfiles.com/nl/tuning-projecten/stage-1-gereed-voor-de-mercedes-benz-sprinter/) and [KM Tuning](https://www.km-tuning.com/OM654-2.0T-Sprinter-x15-CDI-150-HP-Tuning-Software/SW10138). All publish 190/430, but original torque 330 or 340 Nm differs and ECU unlock remains conditional.
- **Expert III 2019–2022 2.0 BlueHDi 180:** [ECU-Soft](https://www.ecu-soft.be/chiptuning/peugeot/expert-traveller/11175/2-0-bluehdi-180-14955) 205/460, [Unlimited Tuning](https://www.unlimitedtuning.nl/chiptuning-peugeot-expert-2-0-bluehdi-180-pk.html) normal stage 215/470 (eco and extreme not included). No mapping to Proace, Vivaro or a 2024 Euro6e without fresh approval.

The two Vito cohorts and old/new Fiat cohorts have separate indexable engine URLs. The Sprinter 315 two RDW admission-year cohorts share one page with separate exact technical rows. Existing Vito, Sprinter, Expert pages receive updated, model-specific explanatory copy. `Fiat Ducato` is upgraded from browse-only directory item to a dedicated source-backed NL model page; Toyota Proace remains browseable without numeric engine outputs.

## Publication and safety constraints

- Two or more source publishers per original engine application; the page discloses conflicting supplier outputs and market-vs-RDW HP conversions. Similar vehicle brands or common chassis cannot inherit figures without independent approval.
- Fuel/cc/type/kW/year/cylinders must all match exact registered data. Example: Sprinter OM651 2143 cc must NOT inherit OM654 1950 cc numbers; no automatic transfer across W906/W907/W910 without ECU verification.
- No customer registration/VIN is exposed in the report; the frozen sample has 3,000 deliberately sampled observations and is nonrepresentative.
- No automatic Stage 2/3 numbers, no ECU unlock guarantees, no claims of actual NoordTune dyno measurements. Public-road SCR/AdBlue, DPF/EGR emissions remain functional. Legal diagnostics/repair is the only public-road AdBlue path.
- SEO total rises **274 → 281** canonical URLs: six new NL engine URLs and one Fiat Ducato model page; no thin EN/PL versions.
- Runtime vehicle lookup is unchanged except exact reviewed whitelist entries from batch6; NO loosening of the global resolver or price rules.

## Release QA

- Batch6 technical regression: **7 reviewed RDW applications**, **26 frozen positive observations**, **105 adversarial negatives**, zero guessed Stage 2/3 output.
- `pnpm test:seo` including all 281 public canonical routes, engine page data and source integrity.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and optimized browser smoke `pnpm qa:seo:nl-vans`.
- `scripts/report-rdw-evidence-funnel.ts --write`: deterministic aggregate reports updated with true **+3** source-linked delta.
- Release through a draft PR and exact-head Vercel Preview, then one production HTTP + sitemap smoke test.

**Next recommended research:** unresolved Fiat Ducato Euro6 2020+ ECU changes, Vito 116/119 CDI, Sprinter 317 CDI, Peugeot Expert BlueHDi 145, Toyota Proace 2.0 D-4D, all gated by exact RDW data and independent sources. Avoid mass auto-generation.

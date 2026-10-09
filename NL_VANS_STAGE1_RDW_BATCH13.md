# NoordTune Power Catalog — reviewed RDW commercial van Stage 1 batch 13

**Evidence review:** 2026-10-09. **Production baseline:** `4ec0525` (batch #12, Vercel READY). **Feature:** `feature/nl-vans-reviewed-rdw-batch13-20261009`.

## Technical RDW identity and source-published normal Stage 1

All **12** additions require exact **RDW make, handelsbenaming, type, first registration year, factory kW, displacement cc, four cylinders and diesel**. Factory torque (Nm) is **not an RDW field**: it is a sourced supplier/reference claim and may differ by trim/gearbox. Stage 1 values are published external indications, **not NoordTune dyno readings or guaranteed owner outcomes**.

| Separate RDW application | Original RDW cc / kW / first admission | Ordinary external Stage 1 indications |
|---|---|---|
| Renault KANGOO type W, 1.5 dCi110 | 1461 / 81 / 2015 | 130 pk / 300 Nm |
| Renault MASTER type MA, 2.3 dCi110 Euro6 candidate | 2299 / 81 / 2017 | **160–180 pk / 390–420 Nm** |
| Renault MASTER type MA, 2.3 Blue dCi135 candidate | 2299 / 100 / 2019 | **175–180 pk / 420–430 Nm** |
| VW CRAFTER type SYN1E, 2.0 TDI102 | 1968 / 75 / 2018 | **160–175 pk / 350–400 Nm** |
| VW TRANSPORTER type 7J0, T6 2.0 TDI102 candidate | 1968 / 75 / 2020 | **150–164 pk / 330–345 Nm** |
| Fiat FIAT DOBLO' type263, 1.6 MultiJet100 | 1598 / 74 / 2015 | 140 pk / 360 Nm |
| Fiat FIAT DOBLO' type263, 1.6 MultiJet120 | 1598 / 88 / 2021 | 140 pk / 360 Nm |
| Fiat FIAT DUCATO type250, 2.3 MultiJet130 Euro6 | 2287 / 96 / 2020 | **150–160 pk / 360–400 Nm** |
| CITROEN BERLINGO type7, *older* 1.6 HDi75 | 1560 / 55 / 2015 | 115 pk / 260 Nm |
| MERCEDES-BENZ SPRINTER type906BA35, W906 314 CDI143 candidate | 2143 / 105 / 2018 | **200–210 pk / 460–480 Nm** |
| MERCEDES-BENZ SPRINTER type906BB50, W906 316 CDI163 candidate | 2143 / 120 / 2018 | 200 pk / 480 Nm |
| OPEL VIVARO type V, C-generation 2.0 D177 | 1997 / 130 / 2024 | **205–207 pk / 460–465 Nm** |

## Independent-source URLs and crucial generation boundaries

- **Kangoo 110, 2015:** [Revtuning](https://revtuning.eu/product/chiptuning-renault-kangoo-1-5-dci-110hp-2013-2020), [Powerconcept](https://www.powerconcept.be/reprogrammation/renault/kangoo/2013-2020/15-dci-110hp) and [BPT](https://bpt-portal.com/nl/tuning/cars/renault/kangoo/2013-2020/1-5-dci-110hp/); original K9K 81 kW, no transfer from Kangoo90 66 kW.
- **Master 110 Mk4, 2017:** [ATM 160/390](https://www.atm-chiptuning.com/chiptuning/renault-master-23-dci-euro-6-110pk/), [ECU-Soft 180/420](https://www.ecu-soft.be/chiptuning/renault/master/8964/2-3-dci-euro-6-110-11623) and [BR 180/420](https://www.br-performance.be/en-be/chiptuning/1-cars/45-renault/2536-master/8964-mk4-03-2016-2019/8965-2-3-dci-euro-6/). The range is not a safe torque setting for a loaded business vehicle.
- **Master Blue dCi135, 2019:** [Shiftech 180/430](https://www.shiftech.eu/en/chiptuning/car/renault/master/2019-iii-iii/diesel/2.3-bluedci-eu6-135), [Motortech 175/420](https://motortech.fr/reprogrammation/voiture/renault/master/2019-iii-iii/2.3-bluedci-eu6-135) and [RS Tronic 180/430](https://rstronic.com/en/chiptuning/renault/master/2019-iii-iii/2.3-bluedci-eu6-135). 2019 is a Mk4/Mk5 crossover; original 100 kW mathematically rounds to 136 metric pk. Higher 210/480 vendor claims deliberately excluded.
- **Crafter 102, 2018:** [BR 175/400](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/54-volkswagen/2950-crafter/9434-2017-2020/9435-2-0-tdi/), [ATM 160/350](https://www.atm-chiptuning.com/chiptuning/volkswagen-crafter-20-tdi-cr-eur-6-102pk-10872/), [Feno 170/400](https://www.chiptuning-feno.nl/product/crafter-tge-102pk-tdi/). Source-original torque conflict 250 vs 300 Nm. Neither original torque is an RDW datum.
- **Transporter 102, 2020:** [VAGtechniek T6 150/330](https://www.vagtechniek.nl/chiptuning/volkswagen/transporter-multivan/t6/2.0-tdi-102pk/), [RacingLine Delphi-only T6 164/345](https://www.racinglinetuning.com/transporter-t6tdi-software). 2020 crosses T6/T6.1 and Bosch/Delphi ECU generations; if fitted Bosch, RacingLine Delphi mapping may NOT be applied; no automatic matched tune.
- **Doblò 100, 2015:** [GSG](https://gsgperformance.com/car-detail/fiat/doblo/2015-2021/1-6-multijet-100hp), [Powerconcept](https://www.powerconcept.be/reprogrammation/fiat/doblo/2015-2021/16-multijet-100hp), [DB ECU](https://www.dbecuservice.it/chiptuning/fiat-doblo-1-6-multijet-100cv). Registered 74 kW is different from Doblò 105 77 kW and Doblò 120 88 kW.
- **Doblò 120, 2021:** [BPT](https://bpt-portal.com/tuning/cars/fiat/doblo/2015-2021/1-6-multijet-120hp/) and [Revtuning](https://revtuning.eu/nl/product/chiptuning-fiat-doblo-1-6-multijet-120hp-2015-2021). Fiat 263 chassis, **not** later PSA Doblò 2022+ or the 105 PS 77 kW.
- **Ducato 130, 2020:** [Squadra 150/360 to max160/390](https://squadra-tuning.nl/chiptuning/campertuning/ducato/2-3-multijet-16v-130-pk-euro-6/), [ATM 160/400](https://www.atm-chiptuning.com/chiptuning/fiat-ducato-23-130-multijet-eur6-130pk/). Source avoids higher-output camper claims; exact Marelli/Bosch and Euro6 phase must be verified, particularly heavy camper and trailer load.
- **Citroën Berlingo II HDi75, 2015:** [CSC 2012–15](https://www.cscmotors.com/remapping-stats/Citroen/berlingo/2012-2015/berlingo-1-6-hdi-16v-75hp-2135), [Hirsch Racing older HDi](https://www.hirsch-racing.de/chiptuning/citroen/berlingo/mk2-2008-2018/16-hdi-16v-75hp/), [Powerconcept 2012–15](https://www.powerconcept.ma/reprogrammation/citroen/berlingo/2012-2015/16-hdi-16v-75hp-5777). **2015 midyear BlueHDi75 uses a different ECU/emissions/stock torque**, so Stage1 for that engine is withheld until actual hardware identified.
- **Sprinter W906 314 CDI 2018:** [BR 200/480](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8734-214-314-cdi/), [Tuning Service 210/460](https://tuningservice.nl/chiptuning/mercedes-benz/sprinter/2016-2018/214314414514-cdi-143pk/). 2018 first admission may be W906 vs W907, separate installed ECU. High vendor 460–480Nm is NOT certified safe for 3.5-tonne commercial loads.
- **Sprinter W906 316 CDI 2018:** [BR W906](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/37-mercedes/1867-sprinter/8732-w906-2016-2018/8735-216-316-cdi/), [Full Reprog W906](https://full-reprog.com/en/stage1/mercedes/sprinter/216-316-cdi-163ch-163). Original 120 kW/2143cc requires physical W906/OM651 identification; newer W907 profiles not adopted.
- **Opel Vivaro C 2.0D177 2024:** [ECU-Soft](https://www.ecu-soft.be/chiptuning/opel/vivaro/11211/2-0d-177-15039), [Kuzka](https://www.kuzka-performance.de/chiptuning/opel/vivaro/2019-/20d-177ps), [Powermod](https://powermod.de/konfigurator/Opel/Vivaro/2019/2.0-BlueHDI-EU6d/15723). New stand-alone **Opel Vivaro C** model landing page, NOT previous 1598cc **Opel Vivaro B**; no copying Peugeot ECU maps solely because of shared platform.

## Product and road-safety policy

RDW is used to identify original engine kW/cc/cylinder/fuel and admissible type/year; it cannot provide actual stock torque, ECU firmware, operational access, gearbox durability or aftertreatment status. All claims require shop scan, original ECU read, and individual quote. No numbers for Stage2/Stage3 and no disabled exhaust aftertreatment. **SCR/AdBlue, DPF and EGR remain fully working and road-legal on road vehicles**; unusual competitor sales options do not imply NoordTune offers them. No VIN, plates or raw RDW samples in SEO articles.

## Audited frozen cohort and sitemap

- 12 separate application profiles matched 12 frozen positive technical rows and rejected **180** mutated identity tests. This historic 3,000-row RDW sample is **purpose-selected and nonrepresentative**, NOT a valid national Dutch fleet share.
- The deterministic report `pnpm report:rdw-funnel` confirms **1,842 → 1,854 / 3,000 (61.80%, NET +12)** source-linked Stage 1 cases. Every one of 12 exact frozen technical positives was previously uncovered. In the selected van-like subset, 435 → **447 / 492** now source-linked and uncovered decreases 57 → **45**. These values are purpose-selected and **not representative of the Dutch fleet**.
- SEO NL: 19→**21** indexed van models (new Citroën Berlingo II and new Opel Vivaro C), browse-only 4→**3**, 51→**63** manually reviewed individual van-engine articles, 68→**80** linked exact RDW applications; sitemap 319→**333** unique URLs, van URL count 71→**85**.
- Every engine links at least two externally verifiable source URLs, never applies another generation's ECU file without physical verification. No automatic EN/PL van thin translations (404).
- Release gates: SEO tests, 12 positive / 180 negative, lint/tsc, exact sourced coverage report, optimized Next.js build, mobile/desktop browser QA, exact Git SHA Vercel Preview READY, GitHub green PR, production READY and public new routes/sitemap smoke. Rollback baseline `4ec0525`.

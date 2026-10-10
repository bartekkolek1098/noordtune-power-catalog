# NoordTune NL bedrijfswagens — reviewed RDW Stage 1 batch 14

**Source review:** 2026-10-10. **Production rollback base:** `e0a9901` (batch13).

## A separate RDW cohort, not an artificial extension of the 3,000-sample

We acquired public RDW registration/fuel rows for **24 purpose-selected technical cohorts** of Toyota Proace, Toyota Proace City and Peugeot Boxer. The first up-to-45 plate-ordered records per model/type/cc/year were joined to the RDW fuel dataset entirely in process memory. Only anonymized aggregate technical counts were saved; no kenteken/VIN/owner data is written to repository. This sampling method is strongly biased and **not representative of the Dutch vehicle population**.

| Independent selected-cohort check | Observations |
|---|---:|
| Frozen selected RDW power/fuel observations | 1054 |
| Before batch14: source-linked ordinary Stage 1 | 0 |
| After batch14: source-linked ordinary Stage 1 | 766 |
| Net new source-linked observations | +766 |
| Selected-cohort technical coverage | 72.68% |
| Reviewed applications | 13 |
| Negative identity tests | 195 |

The **unchanged separate historical 3,000-case benchmark** is 1,854 / 3,000 (61.80%). Do not sum its numerator with the new sample or present either as nationwide RDW coverage.

## Scope-restricted published ordinary Stage 1 indications

| RDW make / exact name / type | First admission | Engine cc / registered kW / fuel | External Stage1 power / torque |
|---|---|---|---|
| Toyota PROACE / V | 2020–2022 | 1997 cc / 90 kW / Diesel | 205–210 pk / 450–460 Nm |
| Toyota PROACE / V | 2019–2019 | 1997 cc / 110 kW / Diesel | 200–200 pk / 460–460 Nm |
| Toyota PROACE / V | 2020–2024 | 1997 cc / 130 kW / Diesel | 205–210 pk / 450–460 Nm |
| Toyota PROACE / V | 2020–2023 | 1499 cc / 75 kW / Diesel | 140–145 pk / 300–340 Nm |
| Toyota PROACE / V | 2020–2023 | 1499 cc / 88 kW / Diesel | 150–160 pk / 340–360 Nm |
| Toyota PROACE CITY / E | 2020–2022 | 1499 cc / 56 kW / Diesel | 115–115 pk / 300–300 Nm |
| Toyota PROACE CITY / E | 2020–2023 | 1499 cc / 75 kW / Diesel | 140–145 pk / 300–340 Nm |
| Toyota PROACE CITY / E | 2020–2023 | 1499 cc / 96 kW / Diesel | 160–160 pk / 350–360 Nm |
| Toyota PROACE CITY / E | 2024–2024 | 1499 cc / 96 kW / Diesel | 160–160 pk / 350–350 Nm |
| Peugeot BOXER / Y | 2017–2019 | 1997 cc / 96 kW / Diesel | 200–200 pk / 450–450 Nm |
| Peugeot BOXER / Y | 2020–2023 | 2179 cc / 88 kW / Diesel | 185–195 pk / 430–430 Nm |
| Peugeot BOXER / Y | 2020–2023 | 2179 cc / 103 kW / Diesel | 185–195 pk / 430–430 Nm |
| Peugeot BOXER / Y | 2020–2023 | 2179 cc / 121 kW / Diesel | 185–195 pk / 430–430 Nm |

## Two-or-more independent reviewed publisher references per application

**PROACE (1997 cc, 90 kW, 2020–2022)**: [Shiftech ProAce 2020 2.0 D-4D 122](https://www.shiftech.eu/en/chiptuning/car/toyota/proace/2020/diesel/2.0-d-4d-122); [ProCarTuning ProAce 2020+ 2.0 D-4D 122](https://procartuning.nl/toyota-proace-2020-2-0-d-4d-122pk.html).

**PROACE (1997 cc, 110 kW, 2019–2019)**: [BR-Performance Toyota ProAce 2016–2019 D-4D 150](https://www.br-performance.be/en-be/chiptuning/1-cars/53-toyota/6753-proace-proace-verso-proace-city/8520-2016-2019/9743-2-0-d-4d/); [ECU-Soft Toyota ProAce 2016–2019 D-4D 150](https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/8520/2-0-d-4d-150-12727).

**PROACE (1997 cc, 130 kW, 2020–2024)**: [DTX Toyota ProAce 2020+ 2.0 D-4D 177](https://dtxchiptuning.com/toyota/proace/2020/toyota-proace-2020-greater-20-d-4d-177hp/); [Motortech Toyota ProAce 2020 2.0 D-4D 177](https://motortech.fr/reprogrammation/voiture/toyota/proace/2020/2.0-d-4d-177).

**PROACE (1499 cc, 75 kW, 2020–2023)**: [ECU-Soft Toyota ProAce 2019–2023 1.5 D-4D 100](https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-100-16423); [ATM Toyota ProAce 2020+ 1.5 D-4D 100](https://www.atm-chiptuning.com/chiptuning/toyota-proace-15-d-4d-100pk/).

**PROACE (1499 cc, 88 kW, 2020–2023)**: [Shiftech Toyota ProAce 2020 1.5 D-4D 120 Stage1](https://www.shiftech.eu/en/chiptuning/car/toyota/proace/2020/diesel/1.5-d-4d-120); [ATM Toyota ProAce 2020 onward 1.5 D-4D 120](https://www.atm-chiptuning.com/chiptuning/toyota-proace-15-d-4d-120pk/).

**PROACE CITY (1499 cc, 56 kW, 2020–2022)**: [ECU-Soft Toyota ProAce City 2019–2023 1.5 D-4D 75](https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-75-16421); [ATM Toyota ProAce City 1.5 D-4D 75](https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-75pk/).

**PROACE CITY (1499 cc, 75 kW, 2020–2023)**: [ECU-Soft Toyota ProAce City 2019–2023 1.5 D-4D 100](https://www.ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-100-16423); [ATM ProAce City 1.5 D-4D100](https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-100pk/).

**PROACE CITY (1499 cc, 96 kW, 2020–2023)**: [ECU-Soft Toyota ProAce City 2019–23 1.5 D-4D131](https://ecu-soft.be/chiptuning/toyota/proace-proace-verso-proace-city/11203/1-5-d-4d-131-16425); [ATM Toyota ProAce City 1.5 D-4D130](https://www.atm-chiptuning.com/chiptuning/toyota-proace-city-15-d-4d-130pk/).

**PROACE CITY (1499 cc, 96 kW, 2024–2024)**: [BR Performance Toyota ProAce/City 2024+ 1.5 D-4D 130](https://www.br-performance.be/en-be/chiptuning/1-cars/53-toyota/6753-proace-proace-verso-proace-city/13055-2024/19265-1-5-d-4d/); [AMC Toyota ProAce ProAce City 2024 1.5 D-4D130](https://amc-motorsport.ro/configurator/toyota/proace-proace-verso-proace-city/2024/1-5-d-4d-130hp/).

**BOXER (1997 cc, 96 kW, 2017–2019)**: [ATM Peugeot Boxer 2.0 BlueHDi130 pre-2019](https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-20-bluehdi-130pk/); [ECU-Soft Boxer 2014–2019 2.0 BlueHDi130](https://www.ecu-soft.be/chiptuning/peugeot/boxer/5946/2-0-bluehdi-130-12099).

**BOXER (2179 cc, 88 kW, 2020–2023)**: [ATM Peugeot Boxer 2.2 BlueHDi120](https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-120pk/); [BR Peugeot Boxer 2019–2023 2.2 BlueHDi120](https://www.br-performance.be/en-be/chiptuning/1-cars/43-peugeot/2323-boxer/10883-2019-2023/11085-2-2-bluehdi/).

**BOXER (2179 cc, 103 kW, 2020–2023)**: [ATM Peugeot Boxer 2.2 BlueHDi140](https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-140pk/); [Shiftech Peugeot Boxer EU6b 2019 2.2 BlueHDi140](https://www.shiftech.eu/en/chiptuning/car/peugeot/boxer/2019-iii/diesel/2.2-bluehdi-eu6b-140); [BR Boxer 2019–23 2.2 BlueHDi140](https://www.br-performance.be/en-be/chiptuning/1-cars/43-peugeot/2323-boxer/10883-2019-2023/11087-2-2-bluehdi/?stage=9925).

**BOXER (2179 cc, 121 kW, 2020–2023)**: [ATM Peugeot Boxer 2.2 BlueHDi165](https://www.atm-chiptuning.com/chiptuning/peugeot-boxer-22-bluehdi-165pk/); [Shiftech Boxer 2019 2.2 BlueHDi Euro6b 165](https://www.shiftech.eu/en/chiptuning/car/peugeot/boxer/2019-iii/diesel/2.2-bluehdi-eu6b-165); [Powerconcept Peugeot Boxer 2019+ 2.2 BlueHDi165](https://www.powerconcept.be/reprogrammation/peugeot/boxer/2019-g/22-bluehdi-165hp).

## Exclusions, stage restrictions and commercial compliance

- Toyota Proace 2.0 D-4D **145 pk / RDW106 kW** first admitted 2022–2024 is deliberately **not published** as numeric Stage1: no sufficiently exact independent Toyota-specific generation scope was verified.
- Peugeot Boxer **2184cc (2024+)** is a different engine/ECU/emission cohort from the older **2179cc** Boxer. No numeric Stage1 is carried over.
- The Proace (**RDW type V**) and Proace City (**RDW type E**) use separate technical applications even for the same nominal 1.5D-4D marketing output. e-Proace City electric uses no diesel values.
- Original engine torque is from tuners, **not a RDW field**. Especially supplier claims of 200+pk for a formerly 122pk Proace or 185–195pk for a Boxer120 are NOT safe long-term gearbox/loaded-camper targets. The actual VIN, engine code, ECU software/unlock, transmission torque, cooling, servicing and duty cycle must be inspected before quoting.
- All Stage1 figures are **indicative externally published statements**, not measured NoordTune results or guaranteed customer gains. Numeric Stage2/3 are withheld. **DPF, EGR, SCR and AdBlue must remain road-legal and functional** for on-road vehicles; competitors' emission-delete pages are NOT endorsements.
- Sitemap gained **13 new NL engine articles** on three existing curated van model hubs. No new thin placeholder model page; NL-only canonicals, mobile rendering and EN/PL unsupported-locale 404 must be verified.

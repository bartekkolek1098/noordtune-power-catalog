# NoordTune NL business-van Stage 1 — reviewed RDW batch 9

Source inspection date: 2026-10-09. Baseline production commit `7b578d6` (batch8). Feature branch `feature/nl-vans-rdw-gap-priorities-batch9-20261009`.

## Exact 2024 RDW observations and independent *published* Stage 1 indications

| Distinct RDW variant | Original RDW power | Advertised original torque (not RDW) | Stage 1 supplier indications |
|---|---:|---:|---:|
| Ford TRANSIT type FCD, 1996 cc, diesel, 2024, EcoBlue 130 | 95.7 kW (marketing 130 pk) | 360 Nm | 190 pk / 440 Nm |
| Ford TRANSIT type FCD, 1996 cc, diesel, 2024, EcoBlue 165 | 121.3 kW (marketing 165 pk) | 390 Nm* | 190 pk / 440 Nm |
| Ford TRANSIT CONNECT type PU2, 1499 cc, diesel, 2024, EcoBlue 100 | 73.3 kW (marketing 100 pk) | 240–250 Nm* | **145–150 pk / 340 Nm** |

*Important:* torque is not an RDW field. Tuner Ford Transit 165 publications use 390 Nm for the generic/manual or some automatic variants, whereas an ECU-Soft BVA8-specific page advertises 360 Nm stock. Transit Connect 100 independent tuner listings also disagree on original 240 vs 250 Nm. The display source's single stockNm value is a **supplier approximation** and NOT a torque measurement. Physically identify installed transmission, ECU and calibration before providing a quote; do not promise a universal stock torque.

### External sources reviewed

- **Transit 130 2023–2026:** [ECU-Soft](https://www.ecu-soft.be/chiptuning/ford/transit/14301/2-0-ecoblue-130-26109) and independently marketed [BSR](https://www.bsrtuning.nl/tuning-kits/t/6544/ford-transit-20-ecoblue-130hp-2023-2026): 130/360 → 190/440.
- **Transit 165 2024:** [ECU-Soft](https://www.ecu-soft.be/chiptuning/ford/transit/14301/2-0-ecoblue-165-26111) and [TSP 2024+](https://tsp-chiptuning.de/chiptuning/autos-kleintransporter/ford/transit-transit-custom/2024/diesel/20-ecoblue-165ps): 165/390 → 190/440. They are two supplier websites, not proof of independent dynamometer runs, and have matching published values. BVA8 original may be 360 Nm.
- **Transit Connect 100 with 1499cc:** [Van Drie Performance 2018–2024](https://vandrieperformance.nl/voertuigen/ford-transit-connect-2018-2024-1-5-ecoblue-100pk/) 100/240→150/340; [ATM](https://www.atm-chiptuning.com/chiptuning/ford-transit-connect-15-ecoblue-100pk/) 100/250→145/340; [Dyno-ChiptuningFiles](https://www.dyno-chiptuningfiles.com/chiptuning-file/ford-transit-connect-15-ecoblue-100hp/) 100/250→145/340. Only older PU2 1.5 EcoBlue with MD1CS005; NOT the new 2.0 VW-platform Connect or Transit Courier.

## Release and customer-safety gate

All three applications are scoped to the source data's **one admission year: 2024** plus exact make/model, RDW type, original kW, cc, four cylinders and single diesel fuel. Different power trims and software are never merged. Data source values represent **marketing indications**, not NoordTune's individual verified dynamometer results or safe maximum torque when heavily loaded. Check engine condition, ECU unlock, gearbox limits, trailer load, temperature and EURO variant. **DPF/EGR/SCR/AdBlue remain legal and functional**, and no speculative Stage 2/3 numbers are published.

The frozen 3,000-row historical RDW sample is selected by priority groups and is emphatically **not representative** of the registered Dutch fleet. Scripts `scripts/research-nl-van-rdw-gaps.cjs` and `scripts/report-rdw-evidence-funnel.ts` are aggregate-only and output no identifying vehicle data. The selected van-like subset in baseline batch8 had **492** observations, **378** source-linked and **114** not source-linked; batch9 has **15 technically matching rows but only +10 net newly source-linked**: **1,785 → 1,795/3,000 (59.83%)**. Five matching rows (Transit 130) already had a source-backed Stage 1 before this batch. In the van-like subset, source-linked increases 378 → 388 and not-source-linked decreases 114 → 104; this remains a nonrepresentative selected historical cohort. Three new NL engine pages increase sitemap routes 293 → 296 and van URLs 45 → 48, subject to production build and browser QA.

## Candidates deliberately deferred

Crafter 140 2023/24 (SYN1E, 103kW), Doblò 105 2023 (263, 77kW), Fiat Ducato 130 2024 (250, 96kW), and several Sprinter 2023 emission variants need newer ECU-generation and year-specific verification; do not extend older Stage 1 values automatically. Toyota Proace and Proace City require source-backed identity independent of shared PSA applications.

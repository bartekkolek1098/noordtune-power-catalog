# RDW bulk source-backed Stage 1 — reviewed first 15 configurations (2026-10-08)

## Accelerated, *bounded*, documented source recovery

Instead of one PR per engine, this batch uses **15 separately scoped, evidence-reviewed powertrain manifests** compiled into the existing server-only `verifiedRdwApplications` route. Original RDW make/trading name, body/type, first admission, exact factory registered kW, engine cc, cylinder count and single original petrol/diesel fuel are all required. No hash of a customer's plate, VIN, name or owner record is retained. Production UI still withholds numeric Stage 2 and Stage 3 and keeps prices on request pending ECU/gearbox inspection.

**These are independently published Stage 1 indications from multiple tuning providers, never power measured by NoordTune and never a guarantee for an uninspected individual vehicle.**

| Reviewed exact RDW identity / first admission | RDW factory kW → metric PS | External original torque | Indicative Stage 1 PS / Nm | Purpose-selected frozen observations newly resolved |
|---|---:|---:|---|---:|
| Peugeot 2008 I type **C**, 1199cc 3c, 2013–2015 VTi 82 | 60 kW → 82 PS | 118 Nm (some tuner lists 116) | **90 PS / 125 Nm** | **16** |
| Peugeot 2008 II type **U**, 1199cc 3c, 2019–2020 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145–150 / 250–270** | **7** |
| Peugeot 3008 II type **M**, 1199cc 3c, 2020 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145–150 / 250–270** | **4** |
| Peugeot 3008 II type **M**, 1598cc 4c, 2020 PureTech 180 | 133 kW → 181 PS | 250 Nm | **215–220 / 300** | **2** |
| Peugeot 308 II type **L**, 1199cc 3c, 2017 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145 / 270** | **4** |
| Peugeot 308 III type **F**, 1199cc 3c, 2022 PureTech 110 | 81 kW → 110 PS | 205 Nm | **145 / 260** | **2** |
| Peugeot 308 III type **F**, 1199cc 3c, 2022 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145 / 260** | **2** |
| Peugeot 5008 II type **M**, 1199cc 3c, 2020 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145–150 / 270–275** | **4** |
| Peugeot 208 II type **U**, 1199cc 3c, 2019 PureTech 130 | 96 kW → 131 PS | 230 Nm | **145–150 / 250–270** | **1** |
| VW Polo AW, 999cc 3c, 2018–2020 1.0 TSI 95 | 70 kW → 95 PS | 175 Nm (some provider cites 160) | **130–140 / 240** | **9** |
| VW Polo AW, 999cc 3c, 2019–2020 1.0 TSI 115 | 85 kW → 116 PS | 200 Nm | **130 / 240** | **2** |
| Fiat 500 **312**, 875cc 2c, 2015 TwinAir 85 | 63 kW → 86 PS | 145 Nm | **95–100 / 185–190** | **3** |
| MINI Cooper UKL-L, 1499cc 3c, 2015–2017 1.5 B38 | 100 kW → 136 PS | 220 Nm (another provider cites 230) | **165 / 270–310** | **4** |
| VW Tiguan I **5N**, 1968cc 4c, 2014–2015 2.0 TDI 177 | 130 kW → 177 PS | 380 Nm | **215 / 430–460** | **2** |
| VW Transporter **7J0**, 1968cc 4c, 2012–2014 T5 facelift 140 | 103 kW → 140 PS | 340 Nm (another provider cites 320) | **180–185 / 410** | **2** |
| **Total** | | | | **64** |

Factory kW→metric PS is calculated once from RDW original registration, and is deliberately independent from marketing 130/115/85/180 PS conventions. Original torque is not an RDW field. A source provider quoting a stock torque differing by 15–20 Nm **does not prove** one is correct for that particular owner/gearbox.

## Provenance and technical safeguards

The manifest `src/data/reviewed-rdw-bulk-batch.ts` pins **all** identities, source-profile identifiers and source-by-source upper/lower output boundaries. At module load it checks accepted source profile records and each Stage 1 value against the publication archive `src/data/tuning-profiles/source-index.json`, requiring **retrieved factual pages**, no search-index-only profiles, two independent source publishers, compatible original factory output/cc/model/fuel/year/cylinders and no electrified variant. It throws rather than assigning Stage 1 if a source is missing, disagrees on critical identity, or exceeds the reviewed envelope. The broader 1,269-profile source archive is research; it is **not** blindly published as 1,269 supported cars.

Supplementary independently checked publisher references for later Peugeot 308 III include:
- [Powerconcept 308 III 110 PS, 145/260](https://www.powerconcept.be/reprogrammation/peugeot/308/2021-g/12t-puretech-110hp), factory 110/205 and 1199cc.
- [GSG Performance 308 III 130 PS, 145/260](https://gsgperformance.com/car-detail/peugeot/308/2021/1-2t-puretech-130hp), factory 130/230.
- [Powerconcept 308 III 130 PS, 145/260](https://www.powerconcept.be/reprogrammation/peugeot/308/2021-g/12t-puretech-130hp), factory 130/230/1199cc.

Further examples cross-checked in current public sources:
- [Shiftech Peugeot 2008 I 1.2 VTi 82, 90/125](https://www.shiftech.eu/en/chiptuning/car/peugeot/2008/2013/petrol/1.2-vti-puretech-82) — naturally aspirated, **not a turbo conversion**.
- [Volkswagen official 2017 Polo engine range](https://www.volkswagen-newsroom.com/en/the-new-polo-driving-presentation-2574/highly-efficient-mpi-tsi-tgi-tdi-and-dsg-engines-2602) — original 1.0 TSI 95 PS 175 Nm; transmission variants still require confirmation.
- [BR-Performance MINI Cooper F56 1.5 turbo](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/42-mini/3360-cooper/5273-f5x-2014-2018/5275-1-5-turbo/) — confirm real B38 installed engine and gearbox.
- [Shiftech Peugeot 3008 II 1.6 PureTech 180](https://www.shiftech.eu/en/chiptuning/car/peugeot/3008/2016-ii/petrol/1.6-puretech-180) — GPF/PHEV and EAT difference.

**Dry clutch, GPF/wet timing belt, oil history, ECU and transmission:** each application has its own `scope` field plus mandatory general check. Peugeot PureTech petrol engine condition and belt-in-oil/chain versions require inspection; 95/115 PS Polo can use manual/DSG with different torque caps. VW 2.0 TDI remains DPF/emissions-legal, not DPF removal. MINI B38 installed ECU and fuel grade remain unknown. T5 7J0 excludes the **2015 T5/T6 crossover** completely. No numerical Stage 2/3, ethanol-E85, hybrid or unknown PHEV are approved.

**Explicitly NOT auto-recovered this batch:** Ford Transit Connect PU2 1499 cc (TDCi vs EcoBlue, incompatible ECU and stock torque), BMW 320i F30/G20 (B48/N20/stock torque and F/G generation issues), Nissan Qashqai J11 1.2 DIG-T (manual/CVT torque differences), 2018 Sprinter W906 vs W907, 2024 Transporter T6.1 vs T7, Peugeot 5008 crossing into new engines after 2020. They remain discoverable through the RDW lookup, but numerical output must stay conditional/withheld without sufficient technical evidence.

## Privacy, test, release gates

- Same preselected 250 group × 12 fixed historical technical observations = 3,000; no plate lists or per-vehicle records introduced.
- `scripts/test-rdw-bulk-reviewed.ts` asserts **15/15** source-validated specific applications, **64/64** matching purpose-selected original RDW observations and **240** adversarial wrong generation/model/cc/stock kW/fuel/cyl/year tests; Stage 2/3 withheld; every seeded variant must have at least one frozen match. No random outcome-based substitutions.
- Recalculate `docs/rdw-evidence-funnel.{json,md}` with `pnpm report:rdw-funnel`, gate `pnpm test:tuning` includes the same 3,000-row reproducibility check. Baseline source-linked Stage 1 **1,463** / 3,000, new **1,527** / 3,000 (**+64**, purpose-selected, not population inference); withheld **1,532→1,468**. Stage 3 remains zero.
- `scripts/qa-rdw-bulk-browser.cjs` tests **75 real browser workflows**: each of 15 apps in NL/EN/PL at 390px, plus NL 320px and NL 1180px, Chromium screenshots, exact original RDW kW/cc/cylinders, Stage 1/conditional quote, no Stage 3, pageerror, overflow or synthetic plate privacy leak.
- `pnpm typecheck`, `pnpm lint`, `pnpm test:seo`, `pnpm catalog:audit`, `pnpm build`, protected exact HEAD Vercel Preview READY and its authenticated browser QA and real HTTP 200/405/400 are mandatory before squash merge; after production READY/alias exact SHA verify production browser QA and old Audi/Mégane/Octavia suite.

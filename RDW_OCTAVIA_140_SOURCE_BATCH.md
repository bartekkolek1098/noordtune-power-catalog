# NoordTune — Škoda Octavia 5E 1.4 TSI 140 PS source batch (2026-10-08)

## Customer scope and safety

Independent, source-backed **indicative Stage 1**, restricted to **Škoda Octavia III/5E**, first admission **2013–2015**, RDW-registered original **103 kW** (~140 metric PS), **1,395 cc**, **four cylinders** and **petrol only**. RDW `type` must explicitly equal `5E`. No Nissan Qashqai/Juke crossover, no name-only aliases.

Externally published original specification **140 PS / 250 Nm**. The RDW provides original kW and cylinder/displacement/fuel/body facts, **not torque or ECU identification**. Stage 1 external reference interval **170–180 PS / 300–320 Nm**, conditional; approximate gain **+30–40 PS / +50–70 Nm**. No owner-certified engine calibration or dyno result. No numeric Stage 2 or Stage 3.

The interval combines three independently published references to the *same original* 140 PS Octavia 5E; 150 PS variants, 1.4 TGI G-TEC CNG, hybrids, Stage 1+, alternative fuels and 2016+ variants are **excluded**, even if displacement is the same. An RDW model family or year alone never establishes tuning compatibility.

## Reviewed URLs and exact values

| Publisher | Scope | Factory | Published Stage 1 |
| --- | --- | --- | --- |
| [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/49-skoda/2764-octavia/5430-2013-2017/5435-1-4-tsi-chpa/) | Octavia III 2013–2015, 1.4 TSI CHPA | 140 PS / 250 Nm | 170 PS / 300 Nm |
| [Shiftech](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2013/petrol/1.4-tsi-tfsi-ss-140) | Octavia from 2013, 1.4 TSI 140 | 140 PS / 250 Nm | 180 PS / 300 Nm |
| [VAGtechniek](https://www.vagtechniek.nl/chiptuning/skoda/octavia/5e/1.4-tsi-140pk/) | Octavia 5E, 1.4 TSI 140 | 140 PS / 250 Nm | 180 PS / 320 Nm |

**Do not confuse [BR-Performance's different 150 PS engine](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/49-skoda/2764-octavia/5430-2013-2017/8540-1-4-tsi/) with this 140 PS profile.** DSG/manual transmission, clutch condition, ECU/engine code (CHPA as example, not RDW fact), engine health, octane grade, local legal suitability and torque limit all require individual confirmation. VAGtechniek explicitly distinguishes Stage 1 and Stage 1+ and notes that DSG adaptation can be needed.

## Reproducible bounded-sample impact

Existing preselected, frozen `nl-top-groups-output-sample.json` includes **16** compatible observations in two *separately preselected* Škoda Octavia 1395 cc groups: 2013 = 4, 2014 = 8, 2015 = 4. Prior historical group labels were nonnumeric D; exact runtime verification is required before calling them recovered. No registration number, VIN, owner or execution/variant identifier is collected or emitted in test results. This purposive cohort **must not be extrapolated to the entire Dutch fleet**.

`scripts/test-rdw-octavia-140.ts` checks exact RDW identity, positive year scope, 25 adversarial negative conditions (fuel, generation, cc, stock kW, model siblings, torque, inconsistent year), factory and customer-facing power/torque, conditional quote, unpublished Stage 3, Stage 2 withholding, and four unrelated existing applications.

## Release gate

1. Run targeted test and the full `pnpm test:tuning` chain, `pnpm test:seo`, `pnpm catalog:audit`, `pnpm lint`, `pnpm typecheck`, `pnpm build`.
2. Browser QA at 320/390/1180 width and NL/EN/PL with synthetic RDW fixtures. Confirm 103 kW/140 PS, 250 Nm source baseline, Stage 1 **170–180 PS / 300–320 Nm**, correct gains, conditional enquiry, no Stage 3, no overflow.
3. Publish a distinct PR, verify Vercel Preview READY at its **exact SHA** using authenticated/deployment-scoped access; only merge after fresh Preview browser QA.
4. After merge, verify production deployment SHA and live alias `power.noordtune.nl`; repeat synthetic RDW smoke and strict regression. Leave UX PR #24 and research PR #31 draft.

This batch improves verified RDW Stage 1 specificity but is **not a 100% numerical coverage pledge** for RDW registrations or SEO vehicle routes.

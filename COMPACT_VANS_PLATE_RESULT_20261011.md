# Compact diesel family repair and plate-result redesign

Baseline: production commit `5520827581bf5583d003a89e3488f5b58a1d05d0`, PR #58. Reviewed 2026-10-11.

## Customer-impacting defect

A real customer lookup identified a **Citroën Berlingo III, type E, 1499 cc, four-cylinder diesel, original 56 kW, first admission 2021**, but the tuning resolver fell through to a no-number generic record. This was missing engine-family coverage, not a failed RDW registration lookup. No customer registration, VIN or full execution code is stored in this change; the regression fixture uses `QA0000`.

The corrected match preserves **56 kW / 76 converted metric PS** as the registered factory output. The marketed trim is 75 PS. Independently published normal Stage 1 source points are:

| Publisher | Power after ordinary Stage 1 | Torque after ordinary Stage 1 |
|---|---:|---:|
| [ECU-Soft](https://www.ecu-soft.be/chiptuning/citroen/berlingo/9767/1-5-bluehdi-75-12771) | 115 PS | 300 Nm |
| [ATM](https://www.atm-chiptuning.com/chiptuning/citroen-berlingo-15-bluehdi-75pk/) | 125 PS | 320 Nm |
| [Shiftech](https://www.shiftech.eu/fr/reprogrammation-moteur/voiture/citroen/berlingo/2018/diesel/1.5-bluehdi-75) | 130 PS | 300 Nm |

The last page was inspected in a normally rendered browser: **130/300 is Stage 1, 140/320 is Stage 2 and is excluded**. The aggregate display 115–130 PS / 300–320 Nm is a comparison envelope, not a measured paired result or guarantee. Power gain is **+39–54 PS from RDW76**, not a fabricated +55 from rewriting RDW factory power. The supplier factory torque reference is 230 Nm; RDW does not establish torque.

## Family coverage, not a plate exception

Nine explicit application scopes cover Berlingo III 1.5 BlueHDi 75/100/130, Partner III 75/100/130 and Combo E 75/100/130. Each retains its own make, exact RDW trading name, type E, 1499 cc, four cylinders, factory kW, diesel and independently reviewed year interval. Existing Partner 75 kW 2022–2024 scope is not duplicated. Earlier 1560 cc type-7 diesel, later facelift software and missing technical type are not silently accepted. ECU access, exact motor generation, firmware, maintenance, clutch/gearbox and loaded duty remain vehicle-specific checks. DPF/EGR/SCR/AdBlue stay operational and road legal. No new numerical Stage 2/3 result is released.

A new **743-observation, 51-cell purposive sample** was chosen by make/model/year and cc before any coverage change. The complete existing runtime pipeline was measured before integration, not just the strict application matcher. Baseline **431/743** source-linked → **659/743**, **+228** newly source-linked and no loss of previous source-linked outcomes. Berlingo: 0→203/244; Partner: 215→240/255; Combo: 216→216/244 (the change improves exact scope/SEO there, not net coverage). This is NOT representative of all Dutch registrations. The separate historical 3,000-row benchmark remains 1,854/3,000. No denominator merging or nationwide-coverage claim.

The report `docs/compact-van-coverage-20261011.json` records unresolved technical cells and a curated family readiness inventory. Remaining families and generation gaps are visible rather than reported as completed; all-vans/fleet coverage has not been established.

## Plate-result design

A compact official RDW identity header leads directly to three clearly separated cards: **Original / Selected Stage / Gain**, with power and torque separated, gains computed only when both known, and source/measurement caveats next to the result. Original torque remains explicitly supplier-sourced. All displayed copy is localized NL/EN/PL. Full RDW facts and source conditions expand on demand. A prominent contact action preserves the existing quote/WhatsApp flow; the plate is added to a WhatsApp message only after the user clicks, never pre-rendered in a link or sent to analytics.

Unknown output shows a clear vehicle-found/engine-review message, never "tuning impossible", no guessed result and no automatic package recommendation. Numeric Stage 3 or custom-hardware output is withheld in the summary. Existing configuration table, source links and quote controls remain reachable.

## Release gates

`test:compact-vans` verifies every year, 135 wrong-identity cases, no higher-stage numbers and RDW-based arithmetic. `qa:plate-result` runs 32 mocked, privacy-safe real-browser journeys across NL/EN/PL and 320/390/1440 px, including absent profiles and contact clicks. The full legacy RDW browser gate, SEO/data tests, TypeScript, lint and optimized build remain release gates. Expected sitemap: 356 URLs / 108 van URLs; 22 indexable model hubs, 85 distinct NL van-engine pages and 102 model-linked source-reviewed application scopes. These counts mean available pages, not Google indexation or fleet coverage.

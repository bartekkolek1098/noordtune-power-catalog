# NoordTune — Octavia II 1Z 1.4 TSI 122 PS source batch (2026-10-08)

## Reviewed identity, RDW boundaries and customer value

Only the **Škoda Octavia II facelift (1Z)**, first admission **2009–2013**, **petrol**, **1,390 cc**, four cylinders and exact original registered **90 kW (~122 PS)** receives an indicative Stage 1 range. RDW type **1Z** is mandatory; the customer must see the RDW factual stock and never a generic percent-based claim. The provider/manufacturer **200 Nm original torque**, CAXA engine code and Bosch ECU specification are external facts, **not measured or decoded by RDW**.

Independent published Stage 1 example figures range **140–155 PS / 240–270 Nm** (approximately **+18–33 PS / +40–70 Nm** against RDW 122 PS / externally published 200 Nm). This is an external source range, not NoordTune dyno evidence, a fixed achieved output or a quoted product price. Stage 1 requires manual confirmation of installed CAXA/ECU and software, timing chain/engine health, fuel octane, gearbox/clutch and local legality.

**Do not substitute**: Octavia III 5E 1.4 TSI 140 PS (1,395 cc / 103 kW), later 150 PS, 1Z other stock powers, NX, CNG, LPG, hybrids, E85, or Stage 1+. Stage 2 numerical figures and Stage 3 remain unavailable to the customer.

## Source observations, not bulk imported tune profiles

| Source | Exact scope | Factory | Stage 1 |
| --- | --- | --- | --- |
| [VAGtechniek](https://www.vagtechniek.nl/chiptuning/skoda/octavia/1z-facelift/1.4-tsi-122pk/) | Octavia 1Z facelift (2009–2013) | 122 PS / 200 Nm | **145 PS / 250 Nm** |
| [BR-Performance](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/49-skoda/2764-octavia/2765-2004-2012/2767-1-4-tsi/) | Octavia II generation 2004–2012 | 122 PS / 200 Nm | **145 PS / 250 Nm** |
| [Shiftech](https://www.shiftech.eu/en/chiptuning/car/skoda/octavia/2005/petrol/1.4-tsi-tfsi-122) | Octavia II 1.4 TSI 122 | 122 PS / 200 Nm | **140 PS / 240 Nm** |
| [Tuning Service](https://tuningservice.nl/chiptuning/skoda/octavia/2004-2012/14-tsi-122pk/) | Octavia II 1,390 cc CAXA, Bosch MED17.5.20 published ECU scope | 122 PS / 200 Nm | **155 PS / 270 Nm** |

VAGtechniek identifies 1Z facelift as **2009–2013**; other sources apply mainly up to 2012. A 2013 first admission is eligible only with an **explicit RDW type 1Z**, matching original 90 kW, cc and fuel, and a fresh manual engine/ECU review. No year-only cross-generation mapping. The more aggressive independent tuning estimates that cannot be established as compatible are not automatically inherited.

## Reproducibility and release gates

- Original preselected purpose-sampled RDW cohort includes **12 exact 1Z 1.4 TSI 90 kW** observations: 2010 = 4, 2011 = 4, 2013 = 4. This is **not a Dutch-fleet success rate**.
- Regression test `scripts/test-rdw-octavia-122.ts` verifies customer factory/stage fields, 2009–2013 year, original kW, stage gain, source links, condition/quote, adversarial negatives and five previously reviewed application boundaries. Synthetic plate `QA0000`; no real registration or VIN is logged.
- Browser fixture QA `scripts/qa-rdw-octavia-122-browser.cjs` should cover real 320/390/1180px on NL/EN/PL, chart, CTA, stock power, Stage 1 output, no Stage 3 or horizontal overflow. Only an exact authenticated Vercel Preview SHA can pass the release gate.
- Run `pnpm test:tuning`, `pnpm test:seo`, `pnpm catalog:audit`, `pnpm lint`, `pnpm typecheck` and `pnpm build`. Keep unrelated draft redesign #24 and RDW audit #31 isolated.

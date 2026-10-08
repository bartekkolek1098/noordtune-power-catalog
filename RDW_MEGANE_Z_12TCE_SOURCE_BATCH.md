# NoordTune — Renault Mégane III type Z 1.2 TCe 115/130, sourced RDW Stage 1 (2026-10-08)

## Technical identity, not a model-name power guess

Accept only **RENAULT MEGANE**, original RDW **type Z**, **1197 cm³**, four-cylinder **Benzine**, original kW and first-admission year as below. Do **not** import any figures from newer **RFB / Mégane IV**, Nissan Juke DIG-T, other fuel, other stock power, or an engine label without those original facts.

| Reviewed homologated Mégane III identity | RDW original | Independently sourced original torque | Indicative published Stage 1 | Calculated displayed gain |
| --- | --- | --- | --- | --- |
| **1.2 TCe 115**, 2012–2015, type Z | **85 kW ≈ 116 metric PS** (marketing 115 PS) | **190 Nm** | **130–135 PS / 230 Nm** | **+14–19 PS / +40 Nm** |
| **1.2 TCe 130**, 2013–2015, type Z | **97 kW ≈ 132 metric PS** (marketing 130 PS) | **205 Nm** | **140–150 PS / 230–255 Nm** | **+8–18 PS / +25–50 Nm** |

**Rounding / engine caveat:** RDW provides original power in kW. Dutch RDW original 85 or 97 kW converts arithmetically to 116 or 132 metric PS while Renault's marketing names remain 115 and 130 PS. Stock torque 190/205 Nm is not an RDW field. Renault's 2013 manufacturer document says nominal **1,198 cm³** for Energy TCe 130 and Dutch third-party car specifications also quote **1,198 cm³** for 115, whereas this frozen RDW subcohort says **1,197 cm³**. We do not silently overwrite RDW facts or widen the exact-displacement matcher; a workshop must inspect the true H5Ft engine code and ECU before any price or claimed output.

All Stage 1 values are *external provider examples* across different calibrations, **not NoordTune dyno measurements, a guarantee, or a particular uninspected car's safe maximum**. Before quoting, require engine/ECU software identification, fault-code and log check, fuel octane, service history, **oil consumption / timing-chain condition**, and actual manual/EDC transmission/clutch suitability. No public numerical Stage 2, Stage 3, E85/ethanol conversion, turbo or DQ200/TCU option is implied.

## Source observations: 115 (original 85 kW, TCe 115 marketing)

- [BR-Performance Mégane III phase 2, 2012–2013, 1.2 TCe 115](https://www.br-performance.lu/en-lu/chiptuning/1-cars/45-renault/2547-megane/5366-megane-3-ph2-2012-2013/5369-1-2-tce/): published stock **115 PS / 190 Nm**, Stage 1 **130 PS / 230 Nm**, excludes E85.
- [BR-Performance Mégane III phase 3, 2014–2015, 1.2 TCe 115](https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/45-renault/2547-megane/5988-megane-3-ph3-2014-2015/5994-1-2-tce/): stock **115 PS / 190 Nm**, Stage 1 **130 PS / 230 Nm**, not the TCe 130 map.
- [Shiftech Mégane III, 2014, 1.2 TCe 115](https://www.shiftech.eu/en/chiptuning/car/renault/megane/2014-iii-ii/petrol/1.2-tce-115): Stage 1 **135 PS / 230 Nm**, separate E85 application excluded.
- [AutoWeek Dutch original 85 kW specification](https://www.autoweek.nl/auto/69627/renault-megane-tce-115-energy-collection/): secondary original technical reference **85 kW / marketed 115 PS / 190 Nm / nominal 1198 cm³**. **Not a manufacturer publication or a tuning result.** Not included as an authoritative Stage 1 source.

## Source observations: 130 (original 97 kW, TCe 130 marketing)

- [Renault official Geneva briefing, March 2013, pp. 30–31](https://suppliers.renault.com/pfr_visible/Images/20130305_DP_Renault_Geneva_2013_GB_tcm319-1141028.pdf): manufacturer Energy TCe 130 **97 kW at 5,500 rpm**, marketed **130 hp**, **205 Nm**, nominal **1,198 cm³**, in New Mégane III. **Factory specification only.**
- [BR-Performance Mégane III phase 3 2014–2015 1.2 TCe 130](https://www.br-performance.fr/brp-paris/reprogrammation/1-voitures/45-renault/2547-megane/5988-megane-3-ph3-2014-2015/5990-1-2-tce/): Stage 1 **140 PS / 230 Nm**.
- [Shiftech Mégane III 2014 1.2 TCe 130](https://www.shiftech.eu/en/chiptuning/car/renault/megane/2014-iii-ii/petrol/1.2-tce-130): Stage 1 **145 PS / 255 Nm**.
- [GSG Performance Mégane III phase 3 2013–2015 1.2 TCe 130](https://gsgperformance.com/car-detail/renault/megane/3-ph3-2013-2015/1-2-tce-130hp): Stage 1 **150 PS / 240 Nm**.

The 130 PS sources disagree on tuned torque and achieved power. We display the outer sourced envelope with strict original 97-kW identity, and label it illustrative rather than promise to reach the upper value. Do not borrow early phase 2 1.4 TCe 130 data; that is a different displacement/engine.

## Frozen source-backed coverage delta and QA gates

- The previously selected fixed 3,000-observation RDW sample includes **24** Mégane 1.2 TCe rows with the same 1197 cc, four-cylinder petrol identity: type **Z 85kW** 2012=4, 2013=2, 2014=3, 2015=1 (**10**); type **Z 97kW** 2013=2, 2014=1, 2015=3 (**6**). The remaining **eight type RFB Mégane IV** registrations (2017/2019) are not approved by these two new rules.
- `scripts/test-rdw-megane-z.ts`: positive source estimates and exact gains, every frozen matching row, model/type/year/cc/kW/fuel negatives, late RFB gate and 7 previous source application regressions. Synthetic plate only.
- `scripts/qa-rdw-megane-z-browser.cjs`: actual client lookup with injected **synthetic** response, both engines × NL/EN/PL × 320/390/1180px (**18 browser scenarios**), Stage 1 values, RDW original power and displacement, chart, quote, no console exceptions, overflow, Stage 3 or plate in URL.
- Deterministic `docs/rdw-evidence-funnel.json` and `.md` must be regenerated via `pnpm report:rdw-funnel` and verified by full `pnpm test:tuning`; no selected records or owner identifiers are written. Any rise in count describes **only this frozen purpose-selected sample**, never the whole Dutch RDW fleet.
- Release only after Vercel exact-SHA READY protected Preview, authenticated 18/18 Chromium, GET/POST smoke, production SHA verification, and new production 18/18 plus regression QA. Existing draft #24 UX and #31 research are excluded.

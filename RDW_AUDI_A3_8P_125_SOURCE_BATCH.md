# NoordTune — Audi A3 8P 1.4 TFSI 92kW (125 PS) source and safety batch, 2026-10-08

## Strict approval scope

Audi **A3 8P facelift**, **RDW first-admission 2008–2012**, exact **92 kW registered original**, original **1390 cc four-cylinder petrol**, required RDW `type=8P`, trade name `AUDI A3` (or `A3`). The original 92 kW converts to **125 metric PS** (factory 200 Nm is externally published, not RDW torque). The shown **Stage 1 135–150 PS / 230–255 Nm** is the envelope of *different published tuning configurations*, not a claim that one uninspected owner vehicle will reach any bound. Indicative gain **+10–25 PS / +30–55 Nm**. Quote only after physical inspection of true EA111/CAXC engine, ECU version, RON, timing chain/maintenance and manual/DSG DQ200 drivetrain suitability.

These published providers identify model **8P 2008–2012**. In the preselected sample **eight 2010 vehicles receive this conditional reference**, while **four 2013 first admissions remain withheld** even when their RDW body type is 8P. A 2013 first registration is not evidence of a suitable 2012-built ECU; require documentation before expanding scope. Never map newer **8V**/**8Y** or earlier **8L**.

### Source facts — standard Stage 1 only

| Independent source | Original | Published Stage 1 | Exact scope |
| --- | --- | --- | --- |
| [TVS Engineering A3 8P 125 PS](https://tvsengineering.com/tuning/audi-a3-8p-2008-2012-1-4-tfsi-125hp-tuning/) | 125 PS / 200 Nm | **135 PS / 230 Nm** | 8P 2008–2012, CAXC provider engine code and DQ200; *mild* Stage 1 |
| [Shiftech A3 8P 1.4 125](https://www.shiftech.eu/en/chiptuning/car/audi/a3/2008-8p/petrol/1.4-tsi-tfsi-125) | 125 PS / 200 Nm | **140 PS / 240 Nm** | 8P 1.4 TSI petrol; unrelated E85 programmes excluded |
| [VAGtechniek A3 8P facelift 1.4 TFSI](https://www.vagtechniek.nl/chiptuning/audi/a3/8p-facelift/1.4-tfsi-125pk/) | 125 PS / 200 Nm | **145 PS / 250 Nm** | 8P facelift; *separate* Stage 1+ 150/260 is excluded |
| [BR-Performance NL A3 8P facelift 1.4](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/213-a3-a3-berline/214-8p-mk2-2008-2012/5156-1-4-tsi/) | 125 PS / 200 Nm | **145 PS / 250 Nm** | 8P facelift 2008–2012; E85 incompatible |
| [SLS Tuning A3 8P 1.4 TSI Stage 1](https://www.slstuning.de/chiptuning/audi/a3-8p/800-14-tsi/stage-1/) | **92 kW** / 125 PS / 200 Nm | **110 kW / 150 PS / 255 Nm** | Confirms original kW; **110 kW is tuned** not the factory 8P variant |

**Rejected contradictory source:** [Tuning Service nominal A3 8P 1.4 TFSI 125](https://tuningservice.nl/chiptuning/audi/a3/8p-2008-2012/14-tfsi-125pk/) labels its displacement **1197 cc** despite the nominal **1.4 TFSI** engine and 125 PS. That source is **not included** in the approved 1390 cc RDW mapping. Similarly, source examples for Audi A3 **8V 2013 1.4** are not transferable into 8P.

No national/general gain forecast, unsupported Stage 2, Stage 3, E85 conversion, assumed gearbox/TCU option or public price. The external ranges are published potential only, not NoordTune measured output.

### Reproducible QA and coverage delta

- Fixed historical purpose-selected RDW group: **12** original 8P, 1390cc, petrol, 92kW, 4-cylinder registrations; 2010 = 8, 2013 = 4. Preselection independent of tuning output. No individual row or customer plate is disclosed.
- `scripts/test-rdw-audi-a3-8p.ts`: 8/8 positive, 4/4 withheld in 2013, 32 adversarial boundaries (including 1197cc source mistake and 8V/8Y, A1/S1), six previous application regressions, Stage 2/3 numeric withheld.
- `scripts/qa-rdw-audi-a3-8p-browser.cjs`: synthetic `QA03A3` only, NL/EN/PL × 320/390/1180, stock power, exact kW and cc, Stage 1 power/torque, chart, enquiry CTA, no Stage 3, JS errors, horizontal overflow or plate leaks.
- `pnpm report:rdw-funnel` updates aggregate JSON and MD after this source-safe 8-case improvement; `pnpm qa:rdw-funnel` and full `pnpm test:tuning` must pass with identical cohort. The 8/12 result has no whole-fleet meaning.
- Vercel immutable Preview must be READY at exact branch SHA. Test protected browser with same-project OIDC; after merge verify production SHA/domain, smoke API/SEO and previous applications. Leave #24/#31 as drafts.

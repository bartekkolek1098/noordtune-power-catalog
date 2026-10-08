# NoordTune — Audi A1 8X Stage 1 source-backed RDW batch (2026-10-08)

## Scope: two independent factory-power applications, not a fuzzy A1 tuning estimate

Original RDW **make AUDI, handelsbenaming AUDI A1 (or literal A1), type 8X**, petrol only, 2010–2014 first admission, matching engine displacement, four cylinders and original registered kW are *all required*. A1 Sportback with an unreviewed marketing name, S1, A1 GB/8Y, Audi A3, other original powers or model siblings must not inherit either profile.

| Technical application | RDW original | Published original torque* | Indicative, externally published Stage 1 | Relative gain against displayed stock |
| --- | --- | --- | --- | --- |
| A1 8X **1.2 TFSI 63 kW, 1197 cc** | 63 kW → rounded **86 PS**, 4-cylinder petrol | **160 Nm** | **105–130 PS / 175–220 Nm** | **+19–44 PS / +15–60 Nm** |
| A1 8X **1.4 TFSI 90 kW, 1390 cc** | 90 kW → rounded **122 PS**, 4-cylinder petrol | **200 Nm** | **135–155 PS / 230–270 Nm** | **+13–33 PS / +30–70 Nm** |

*RDW does **not** supply original torque or actual ECU. Torque, engine label and installed ECU remain source claims needing confirmation. These are **not** power figures measured by NoordTune, promises, or guaranteed min/max for a customer's uninspected car. Both require individual quotation after ECU/firmware/condition/fuel/manual versus DSG checks.

### Source-backed 1.2 TFSI 86 PS

- [TVS Engineering A1 8X 1.2 TFSI 86 PS](https://tvsengineering.com/tuning/audi-a1-8x-2010-2014-1-2-tfsi-86hp-tuning/) — original 86 PS / 160 Nm, intentionally mild Stage 1 **105 PS / 175 Nm**, CBZA EA111 / DQ200 reference.
- [BR-Performance NL A1 8X 1.2 TFSI](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/203-8x-2010-2014/204-1-2-tfsi/) — original 86 PS / 160 Nm, Stage 1 **130 PS / 215 Nm**.
- [Shiftech A1 8X 1.2 TFSI 85 PS](https://www.shiftech.eu/en/chiptuning/car/audi/a1/2010-8x/petrol/1.2-tsi-tfsi-85) — original **85 PS** (source convention for rounded registered 63 kW), 160 Nm, Stage 1 **130 PS / 220 Nm**.

The output range intentionally spans distinct *mild and stronger Stage 1 calibrations*. For the same 1.2 TFSI, [Tuning Service](https://tuningservice.nl/chiptuning/audi/a1/8x-2010-2014/12-tfsi-86pk/) also publishes a more aggressive **140 PS / 225 Nm** Stage 1 (listed Simos 10/CBZA). This high outlier is *not* automatically offered; workshop confirmation and vehicle hardware/ECU review are mandatory. Other sources occasionally give conflicting ECU families. **Do not infer installed ECU from engine marketing name or quote Stage 2.**

### Source-backed 1.4 TFSI 122 PS

- [Audi official 2010 A1 1.4 TFSI 90 kW specification](https://www.audi.de/dam/nemo/customer-area/more-information/predecessor-models/a1/a1/pdf/AU210_1.4TFSI_119_2010_neu.pdf) — factory **1390 cc / 90 kW (122 PS) / 200 Nm**, S tronic specification; original data only, **not a tuning figure**.
- [TVS Engineering A1 8X 1.4 TFSI 122 PS](https://tvsengineering.com/tuning/audi-a1-8x-2010-2014-1-4-tfsi-122hp-tuning/) — mild Stage 1 **135 PS / 230 Nm**, DQ200 gearbox source.
- [Shiftech A1 8X 1.4 TFSI 122](https://www.shiftech.eu/en/chiptuning/car/audi/a1/2010-8x/petrol/1.4-tsi-tfsi-122) — Stage 1 **140 PS / 240 Nm**.
- [BR-Performance NL A1 8X 1.4 TFSI 122](https://www.br-performance.nl/nl-nl/chiptuning/1-wagens/11-audi/202-a1/203-8x-2010-2014/205-1-4-tfsi/) — Stage 1 **145 PS / 250 Nm**.
- [Tuning Service A1 8X 1.4 TFSI 122](https://tuningservice.nl/chiptuning/audi/a1/8x-2010-2014/14-tfsi-122pk/) — Stage 1 **155 PS / 270 Nm**, listed engine CNVA and Bosch MED17.5.5; engine-code assignment varies between publishers, and an individual ECU must be scanned.

Vehicle's true DSG DQ200 dry clutch/manual transmission and applicable torque limits are *not* identified from registration. The displayed source upper bound is **not approval for the owner's gearbox**, only a research reference. Do not ingest any source E85, Stage 1+, Stage 2, Stage 3, custom exhaust or gearbox tune figures as standard Stage 1.

## Regression and privacy

The previously frozen purposive technical RDW sample, selected before outcomes, contains **12** A1 8X 1.2 TFSI original 63 kW registrations (2010:4, 2011:4, 2013:3, 2014:1) and **10** A1 8X 1.4 TFSI original 90 kW (2010:4, 2011:2, 2013:3, 2014:1). The same broad A1 1.4 cc group also contains two **136 kW / 185 PS** observations explicitly excluded by factory-power guard. **22 of 3000 preselected observations** is not a whole-RDW or Dutch fleet coverage rate.

The standalone `scripts/test-rdw-audi-a1-8x.ts` asserts strict original kW, year, fuel, 8X type, exact RDW model, cc, cylinder count, Stage 1/customer gain, reference URLs, unquoted Stage 2 and regression of six unrelated previous scopes. The browser fixture uses synthetic plate `QA018X`; it does not access live customer licence plates, raw identifiers, VINs, owner records or plate queries in URLs. A test observation is counted, not saved or logged.

## Release gate

Run `pnpm test:tuning`, `pnpm test:seo`, `pnpm catalog:audit`, `pnpm lint`, `pnpm typecheck`, `pnpm build`; protected exact-head Preview QA (NL/EN/PL × 320/390/1180px × both A1 powertrains) and direct authenticated HTTP checks; then only merge after the exact SHA passes. Confirm deployed `power.noordtune.nl` alias SHA, fresh live browser QA and unchanged 219 sitemap URLs/no Stage 3. Leave unrelated redesign PR #24 and research audit PR #31 in draft.

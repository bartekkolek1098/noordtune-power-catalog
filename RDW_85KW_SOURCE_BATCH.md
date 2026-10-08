# NoordTune — verified RDW 85 kW source-coverage batch (2026-10-08)

Scope: exactly two tightly matched petrol turbo powertrain applications, in a separate branch. This is **not** bulk-generated gain data, not a change to 24 public SEO profiles, and not a claim of universal RDW numerical coverage.

## Source-backed entries

| Entry | RDW facts | Original torque reference | External Stage 1 indication | Manual verification |
| --- | --- | --- | --- | --- |
| SEAT Leon III 5F 1.0 TSI / EcoTSI | RDW type **5F**, 999 cc, 3 cyl, petrol, **85 kW** (≈116 metric PS), 2015–2020 | published **115 PS / 200 Nm** | **130–135 PS / 225–240 Nm** | CHZD / ECU Bosch MED17.5.21, original fuel grade and gearbox |
| Nissan Juke I F15 facelift 1.2 DIG-T | RDW type **F15**, 1,197 cc, 4 cyl, petrol, **85 kW** (≈116 metric PS), 2014–2019 | Nissan published **115 PS / 190 Nm**, manual 6-speed | **130–131 PS / 230–231 Nm** | engine HRA2 / HR12DDT, ECU software, gearbox, fuel and engine condition |

RDW **does not provide the stock torque or confirmed ECU**; those are externally published manufacturer/tuner specification facts. They must never be labelled as a direct RDW measurement. Registered 85 kW is deliberately used as a hard input match for both entries. Metric rounding to 116 PS explains the one-PS difference from providers labelling the 85 kW motor 115 PS. The customer-visible gain, if displayed, is computed against RDW 116 PS rather than blindly copying +15/+20 PS from the providers.

### Source observations: Leon 5F

- [BR-Performance Leon III facelift 5F 1.0 TSI](https://www.br-performance.lu/en-lu/chiptuning/1-cars/48-seat/2724-leon/9004-iii-facelift-5f-2016-2020/22357-1-0-tsi/) — factory 115/200, Stage 1 130/240.
- [Shiftech Leon 5F MK2 1.0 TSI 115](https://www.shiftech.eu/en/chiptuning/car/seat/leon/2017-5f-mk2/petrol/1.0-tsi-tfsi-115) — factory 115/200, Stage 1 135/240.
- [VAGtechniek Leon 5F 1.0 EcoTSI 115](https://www.vagtechniek.nl/chiptuning/seat/leon/5f-facelift/1.0-ecotsi-115pk/) — factory 115/200, Stage 1 135/225; separate Stage 1+ 140/240 not imported.

### Source observations: Juke F15

- [Shiftech Nissan Juke F15 1.2 DIG-T](https://www.shiftech.eu/en/chiptuning/car/nissan/juke/2010/petrol/1.2-dig-t-115) — factory 115/190, Stage 1 130/230.
- [RS-Tronic Nissan Juke 1.2 DIG-T](https://rstronic.com/en/chiptuning/nissan/juke/2010/1.2-dig-t-115) — factory 115/190, Stage 1 130/230.
- [KHPTOOLS Juke 1.2 DIG-T 115](https://www.khptools.com/reprogramacion/turismos-furgonetas/nissan/juke/2010-2018/12-dig-t/115/3440/stage-1) — factory 115/190, Stage 1 131/231.
- [Official Nissan News Juke 1.2 DIG-T 85 kW](https://france.nissannews.com/fr-FR/releases/nouveau-nissan-juke-un-crossover-toujours-plus-turbulent?downloadUrl=%2Ffr-FR%2Freleases%2Frelease-117996%2Fdownload&la=1) — original manufacturer 115 PS / 190 Nm and 6-speed manual; this is **not a tuning provider**.

## Why Qashqai J11 is *not* automatically restored in the same batch

The Qashqai 1.2 DIG-T is also registered at 85 kW, and the frozen 3,000 observation sample includes 24 Nissan Qashqai 1.2 DIG-T entries. However [V-Tuning's published Qashqai J11 catalogue](https://www.v-tuning.eu/vehicles/nissan/qashqai/j11) explicitly distinguishes manual versions with **190 Nm original torque** from CVT versions with **165 Nm original torque**. Both may have the same RDW make/model, petrol, 1,197 cc, 85 kW and type J11. RDW's existing lookup does not safely decode the fitted gearbox.

**A Qashqai must never silently inherit the Juke F15 190 Nm figure or manual Qashqai ECU Stage 1 without transmission confirmation.** Restore this group by adding transmission-specific, source-linked examples or a customer gearbox selection step; do not invent a single stock-torque value.

## Regression, scope and safety

- Synthetic RDW fixtures plus 24 existing anonymized and preselected technical observations: **12 Leon 5F** (2015, 2017, 2019) and **12 Juke F15** (2015, 2016, 2019), all originally non-numeric.
- For each reviewed application verify correct make/model, **85 kW** registered, RDW type 5F/F15, compatible first-admission year, cc, cylinders, petrol only and conditional quote.
- At least **36 adversarial negative cases**: other model, year outside scope, wrong body, diesel/CNG/hybrid, wrong 84/86 kW, absent original RDW kW, wrong displacement/cylinders, contradictory dates and known conflicting stock torque.
- Preserve BMW F40 136, VW Caddy 1.4 TGI CNG 110 and earlier SEAT Leon 1P 125 source profiles. Stage 2 remains without unsupported numeric output, Stage 3 never visible.
- Stage 1 values are indicative publisher claims, not NoordTune dyno measurement; actual calibration, engine condition and legality must be reviewed before a quote.
- After local test/tuning/SEO/audit/lint/types/build, perform fresh browser QA on production build, on the exact protected Vercel Preview and then, if release conditions pass, on live `power.noordtune.nl` at exact deployed SHA.

This batch improves **24 observed registrations in one bounded non-random dataset**, not the whole RDW fleet. Other fuel categories must not receive a generic petrol gain.

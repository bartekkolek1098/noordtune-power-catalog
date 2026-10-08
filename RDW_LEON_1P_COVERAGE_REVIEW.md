# RDW source-coverage recovery — SEAT Leon II 1P CAXC 125 PS

**Scope:** one bounded, independently source-backed Stage 1 technical application on the plate-first RDW customer path. It does **not** authorize fleet-wide automatic gains, Stage 2 numeric output, generalized SEAT model aliases or any adjustment to the 24 curated public SEO cards.

## Customer problem

Frozen, purposefully selected earlier RDW observations show 144 SEAT Leon records, only 44 with numeric Stage 1 using the previous production resolver. Some are 2009–2010 petrol 1,390 cc, 92 kW ≈ 125 PS, four cylinders. Those are compatible with a known **Leon II (1P) facelift 1.4 TSI CAXC 125 PS / 200 Nm** published application.

Independent existing public tuner references:
- [VAGtechniek Leon 1P facelift 125](https://www.vagtechniek.nl/chiptuning/seat/leon/1p-facelift/1.4-tsi-125pk/) — Stage 1 145 PS / 250 Nm.
- [Tuning Service Leon 1P 2005–2012](https://tuningservice.nl/chiptuning/seat/leon/1p-2005-2012/14-tsi-125pk/) — 1390 cc, CAXC / Bosch MED17.5.20, Stage 1 150 PS / 265 Nm.
- [BPT Portal Leon 1P](https://bpt-portal.com/nl/tuning/cars/seat/leon/1p-2005-2012/1-4-tsi-125hp/) — CAXC / Bosch MED17.5.20 or MED17.5.5, Stage 1 145 PS / 250 Nm.

Conservative customer-range display: **Stage 1 145–150 PS / 250–265 Nm**, gain **+20–25 PS / +50–65 Nm** from the published factory baseline. These are not dyno measurements of the customer's vehicle. NoordTune must confirm physical engine code, ECU software and compatibility, fuel grade, gearbox and condition. No numerical Stage 2, no public Stage 3, no competitor pricing.

## Strict compatibility

The new application requires:
- Registered SEAT Leon, petrol only, 1,390 cc, ~125 metric PS (including kW conversion) and four cylinders when known
- First admission **2009–2011** conservatively (a registration date is not proof of build year)
- No explicit conflicting earlier 1M or later 5F/KL generation
- Any known torque must match factory 200 Nm
- Exact ECU remains marked manual-review; all quotes remain on-request

No transfer to 1.2 TSI, later Leon III 5F, earlier 1M, LPG/CNG or another engine with the same superficial name.

An independent UI-label bug was found and fixed: generic reviewed profile rendering previously prepended **“1 Series”** to Volkswagen Caddy. That prefix now applies only to the BMW 118i; Caddy and Leon show their correct make/model label.

## Reproducible bounded checks

- `scripts/test-seat-leon-rdw-coverage.ts` asserts 16 explicit incompatible scopes, official RDW identity, date/fuel/displacement/stock-output consistency, source URLs, on-request quote, localized range gains, stage safety and BMW/Caddy regression labels.
- Earlier frozen purposive sample of **144** SEAT Leon records: new scoped application recovers **15** previously non-numeric results (8 from 2009, 7 from 2010). Numeric Stage 1 sample outcomes rise **44 → 59**. This is **not** a representative RDW fleet rate or coverage claim.
- Full existing `test:tuning`, `test:seo`, `catalog:audit`, `lint`, `typecheck` and `build`; then NL/EN/PL browser QA on local production build and exact-SHA Vercel Preview required before merge.
- No private number plate or customer data is included in the patch.

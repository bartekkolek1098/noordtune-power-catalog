# Catalog Data Report

Generated from the current catalog sources by `pnpm catalog:audit`.

## Summary

| Metric | Count |
| --- | ---: |
| Curated vehicles used for static SEO | 24 |
| Newly published vehicles in Batch 1 | 17 |
| Generated source records before canonical dedupe | 65469 |
| Canonical selector/RDW vehicle records | 58586 |
| Stage definitions in canonical database | 175758 |
| Localized Vehicle Check landing pages | 3 |
| Localized vehicle detail pages in sitemap | 72 |
| Localized stage SEO pages in sitemap | 216 |
| Total sitemap URLs | 294 |
| Service options | 9 |
| Brands | 32 |
| Critical issue groups | 0 |
| Warning groups | 18 |
| Client imports of canonical server catalog | 0 |
| Curated technical profiles | 24 |

## Coverage

- Brands: Abarth, Alfa Romeo, Audi, BMW, Citroën, Cupra, DS Automobiles, Dacia, Fiat, Ford, Honda, Hyundai, Jaguar, Jeep, Kia, Land Rover, MINI, Maserati, Mazda, Mercedes-Benz, Mitsubishi, Nissan, Opel, Peugeot, Porsche, Renault, SEAT, Skoda, Subaru, Toyota, Volkswagen, Volvo
- Fuel types: Diesel, Hybrid, Petrol
- Curated confidence levels: {"estimated":24}
- Canonical database confidence levels: {"estimated":58586}
- Pricing tiers: stage1-standard, stage1-advanced, stage1-modern, stage2-standard, stage2-advanced, stage2-performance, stage3-standard, stage3-advanced, stage3-performance, tcu-standard, diagnostics, log-analysis, custom-service, stage1-modern-ecu, stage1-bench, stage3-custom
- Curated service compatibility: {"not-applicable":41,"conditional":76,"manual-review":99}

## Critical Errors

None.

## Warnings

- **SOURCE_ID_COLLISION** (6890): Generated source records contain ID collisions that are currently hidden by dedupeVehicles().
  - bmw-1-serie-118d-2012 (2: bmw-1-serie-118d-2012, bmw-1-serie-118d-2012)
  - bmw-1-serie-118d-2013 (2: bmw-1-serie-118d-2013, bmw-1-serie-118d-2013)
  - bmw-1-serie-118d-2014 (2: bmw-1-serie-118d-2014, bmw-1-serie-118d-2014)
  - bmw-1-serie-118d-2015 (2: bmw-1-serie-118d-2015, bmw-1-serie-118d-2015)
  - bmw-1-serie-118d-2016 (2: bmw-1-serie-118d-2016, bmw-1-serie-118d-2016)
  - bmw-1-serie-118d-2017 (2: bmw-1-serie-118d-2017, bmw-1-serie-118d-2017)
  - bmw-1-serie-118d-2018 (2: bmw-1-serie-118d-2018, bmw-1-serie-118d-2018)
  - bmw-1-serie-118d-2019 (2: bmw-1-serie-118d-2019, bmw-1-serie-118d-2019)
- **SELECTOR_SEO_SLUG_COLLISION** (3131): Year-specific selector records collapse onto shared SEO slugs; do not add all selector records to the sitemap blindly.
  - bmw/3-series/320d (28: bmw-320d-b47, bmw-3-serie-320d-2012, bmw-3-serie-320d-2013, ...)
  - audi/2-0-tdi/a3 (16: audi-a3-20-tdi, audi-a3-2-0-tdi-2012, audi-a3-2-0-tdi-2013, ...)
  - volvo/d5/xc60 (20: volvo-xc60-d5, volvo-xc60-d5-2012, volvo-xc60-d5-2013, ...)
  - bmw/1-series/118d (23: bmw-1-serie-118d-2012, bmw-1-serie-118d-2013, bmw-1-serie-118d-2014, ...)
  - bmw/1-series/120d (23: bmw-1-serie-120d-2012, bmw-1-serie-120d-2013, bmw-1-serie-120d-2014, ...)
  - bmw/1-series/320d (23: bmw-1-serie-320d-2012, bmw-1-serie-320d-2013, bmw-1-serie-320d-2014, ...)
  - bmw/1-series/330d (23: bmw-1-serie-330d-2012, bmw-1-serie-330d-2013, bmw-1-serie-330d-2014, ...)
  - bmw/1-series/330i (23: bmw-1-serie-330i-2012, bmw-1-serie-330i-2013, bmw-1-serie-330i-2014, ...)
- **ESTIMATED_PUBLIC_VEHICLE** (24): Published generated records remain estimates and require vehicle-specific confirmation.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
- **MISSING_PUBLIC_ENGINE_CODE** (20): No engine code is stored; do not claim one until manually verified.
  - audi-a3-20-tdi
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
  - bmw-1-series-f20-f21-118d
  - bmw-1-series-f20-f21-120d
  - bmw-3-series-f30-f31-318d
  - bmw-3-series-f30-f31-330d
- **MISSING_PUBLIC_TCU_TYPE** (23): Automatic gearbox is listed but the exact TCU type is not stored.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - bmw-1-series-f20-f21-118i
  - bmw-1-series-f20-f21-118d
- **PUBLIC_PLACEHOLDER_IMAGE** (24): Published record uses a generic placeholder pending owned/licensed media.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
- **PUBLIC_PRICING_ACCESS_METHOD_UNVERIFIED** (24): Pricing tiers are commercial groups only; the technical ECU access method remains vehicle-specific.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
- **PUBLIC_SERVICE_COMPATIBILITY_REVIEW** (24): Published options remain available only subject to diagnosis, legal review and compatibility confirmation.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
- **BROAD_ECU_FAMILY_ONLY** (7): Broad ECU-family labels are not exact ECU identification.
  - vw-golf-20-tsi-ea888: Bosch MED17 / MG1
  - bmw-320d-b47: Bosch EDC17 / MD1
  - audi-a3-20-tdi: Bosch EDC17
  - mercedes-a45-amg-m133: Bosch MED17
  - bmw-x3-e83-20d: Bosch EDC16
  - volvo-xc60-d5: Bosch EDC17
  - ford-focus-st-20-ecoboost: Bosch MED17
- **CURATED_ENGINE_CODE_REVIEW** (20): No supported engine-family code is stored; manual identification remains required.
  - audi-a3-20-tdi
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
  - bmw-1-series-f20-f21-118d
  - bmw-1-series-f20-f21-120d
  - bmw-3-series-f30-f31-318d
  - bmw-3-series-f30-f31-330d
- **CURATED_TCU_UNKNOWN** (23): Automatic transmission is listed without an evidence-backed exact TCU variant.
  - vw-golf-20-tsi-ea888
  - bmw-320d-b47
  - audi-a3-20-tdi
  - mercedes-a45-amg-m133
  - bmw-x3-e83-20d
  - volvo-xc60-d5
  - bmw-1-series-f20-f21-118i
  - bmw-1-series-f20-f21-118d
- **CURATED_TRANSMISSION_AMBIGUOUS** (20): Transmission identity is estimated or requires manual review.
  - mercedes-a45-amg-m133
  - volvo-xc60-d5
  - ford-focus-st-20-ecoboost
  - bmw-1-series-f20-f21-118i
  - bmw-1-series-f20-f21-118d
  - bmw-1-series-f20-f21-120d
  - bmw-3-series-f30-f31-318d
  - bmw-3-series-f30-f31-330d
- **MANUAL_REVIEW_SERVICE_COMPATIBILITY** (99): Service remains commercially visible only with explicit manual confirmation.
  - vw-golf-20-tsi-ea888: immo
  - vw-golf-20-tsi-ea888: launch
  - bmw-320d-b47: adblue
  - bmw-320d-b47: scr
  - bmw-320d-b47: immo
  - bmw-320d-b47: launch
  - audi-a3-20-tdi: adblue
  - audi-a3-20-tdi: scr
- **OPTION_COMPATIBILITY_NOT_CONFIRMED** (178225): Vehicle option assignments conflict with existing fuel/gearbox hints and require an explicit compatibility matrix.
  - vw-golf-20-tsi-ea888: dpf is not listed for Petrol
  - vw-golf-20-tsi-ea888: adblue is not listed for Petrol
  - vw-golf-20-tsi-ea888: scr is not listed for Petrol
  - bmw-320d-b47: launch is not listed for Diesel
  - bmw-320d-b47: pops is not listed for Diesel
  - audi-a3-20-tdi: launch is not listed for Diesel
  - audi-a3-20-tdi: pops is not listed for Diesel
  - mercedes-a45-amg-m133: dpf is not listed for Petrol
- **MISSING_STAGE_PRICING_TIER** (24124): Canonical stages retain source pricing and may not have a centralized tier.
  - vw-golf-20-tsi-ea888: Stage 1
  - vw-golf-20-tsi-ea888: Stage 2
  - mercedes-a45-amg-m133: Stage 1
  - mercedes-a45-amg-m133: Stage 2
  - volvo-xc60-d5: Stage 1
  - volvo-xc60-d5: Stage 2
  - ford-focus-st-20-ecoboost: Stage 1
  - ford-focus-st-20-ecoboost: Stage 2
- **CANONICAL_LEGACY_STAGE_PRICING** (175758): Generated/non-curated canonical records intentionally retain legacy source prices; Pricing V2 applies only to the curated public layer.
  - vw-golf-20-tsi-ea888: Stage 1: EUR 305
  - vw-golf-20-tsi-ea888: Stage 2: EUR 439
  - vw-golf-20-tsi-ea888: Stage 3+: EUR 799
  - bmw-320d-b47: Stage 1: EUR 269
  - bmw-320d-b47: Stage 2: EUR 399
  - bmw-320d-b47: Stage 3+: EUR 679
  - audi-a3-20-tdi: Stage 1: EUR 269
  - audi-a3-20-tdi: Stage 2: EUR 399
- **SERVICE_PRICE_NOT_MIGRATED_TO_V2** (8): This service keeps its existing public price and is outside the ECU Stage/TCU Pricing V2 scope.
  - dpf: EUR 185
  - adblue: EUR 199
  - egr: EUR 149
  - scr: EUR 219
  - immo: EUR 169
  - speed-limiter: EUR 119
  - launch: EUR 165
  - pops: EUR 149
- **REPEATED_PLACEHOLDER_IMAGE** (1): A small image pool is reused across many vehicle records.
  - 58580 vehicles: https://images.unsplash.com/photo-1769968313283-d6336681ce8b?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200

## Recommended Next Additions

1. Manually verify the Batch 1 public records, prioritizing exact engine codes, ECU/TCU variants, drivetrain and production applicability.
2. Review the held BMW and VAG candidates in CURATED_BATCH_1_REVIEW.md before any later promotion; do not bulk-publish adjacent templates.
3. Replace shared placeholder photography with owned or licensed brand/model-family assets.
4. Keep Pricing V2 commercial groups separate from ECU/TCU access-method claims; confirm exact technical scope before the final quote.

## Interpretation

The canonical selector/RDW database is deduplicated and structurally usable, but most records are template-generated estimates. Static SEO remains intentionally limited to the curated catalog. Do not publish every generated year record as a separate SEO page or treat estimated ECU/stage metadata as verified support.

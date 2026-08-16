# Catalog Data Report

Generated from the current catalog sources by `pnpm catalog:audit`.

## Summary

| Metric | Count |
| --- | ---: |
| Curated vehicles used for static SEO | 7 |
| Generated source records before canonical dedupe | 65469 |
| Canonical selector/RDW vehicle records | 58586 |
| Stage definitions in canonical database | 175758 |
| Localized vehicle detail pages in sitemap | 21 |
| Localized stage SEO pages in sitemap | 63 |
| Total sitemap URLs | 87 |
| Service options | 9 |
| Brands | 32 |
| Critical issue groups | 0 |
| Warning groups | 5 |

## Coverage

- Brands: Abarth, Alfa Romeo, Audi, BMW, Citroën, Cupra, DS Automobiles, Dacia, Fiat, Ford, Honda, Hyundai, Jaguar, Jeep, Kia, Land Rover, MINI, Maserati, Mazda, Mercedes-Benz, Mitsubishi, Nissan, Opel, Peugeot, Porsche, Renault, SEAT, Skoda, Subaru, Toyota, Volkswagen, Volvo
- Fuel types: Diesel, Hybrid, Petrol
- Curated confidence levels: {"estimated":7}
- Canonical database confidence levels: {"estimated":58586}
- Pricing tiers: stage1-standard, stage1-modern-ecu, stage1-bench, stage2-standard, stage3-custom, tcu-standard, diagnostics, log-analysis, custom-service

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
- **OPTION_COMPATIBILITY_NOT_CONFIRMED** (178225): Vehicle option assignments conflict with existing fuel/gearbox hints and require an explicit compatibility matrix.
  - vw-golf-20-tsi-ea888: dpf is not listed for Petrol
  - vw-golf-20-tsi-ea888: adblue is not listed for Petrol
  - vw-golf-20-tsi-ea888: scr is not listed for Petrol
  - bmw-320d-b47: launch is not listed for Diesel
  - bmw-320d-b47: pops is not listed for Diesel
  - audi-a3-20-tdi: launch is not listed for Diesel
  - audi-a3-20-tdi: pops is not listed for Diesel
  - mercedes-a45-amg-m133: dpf is not listed for Petrol
- **MISSING_STAGE_PRICING_TIER** (24124): Stages retain their effective price but are not yet mapped to a verified pricing tier.
  - vw-golf-20-tsi-ea888: Stage 1
  - vw-golf-20-tsi-ea888: Stage 2
  - mercedes-a45-amg-m133: Stage 1
  - mercedes-a45-amg-m133: Stage 2
  - volvo-xc60-d5: Stage 1
  - volvo-xc60-d5: Stage 2
  - ford-focus-st-20-ecoboost: Stage 1
  - ford-focus-st-20-ecoboost: Stage 2
- **REPEATED_PLACEHOLDER_IMAGE** (1): A small image pool is reused across many vehicle records.
  - 58580 vehicles: https://images.unsplash.com/photo-1769968313283-d6336681ce8b?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200

## Recommended Next Additions

1. Manually verify and promote high-demand generated variants into curated records, starting with BMW 3/5 Series diesel, Volkswagen Golf GTI/R and 2.0 TDI, Audi A3/A4 2.0 TDI, Mercedes-Benz C-Class diesel, Volvo V60/XC60 and Ford Focus ST.
2. Split verified records by generation, engine code, ECU/TCU and drivetrain only when workshop evidence is available.
3. Replace shared placeholder photography with licensed brand/model-family assets before exposing generated records as SEO landing pages.
4. Assign remaining pricing tiers only after the workshop confirms the access method and service scope; keep current effective prices unchanged until then.

## Interpretation

The canonical selector/RDW database is deduplicated and structurally usable, but most records are template-generated estimates. Static SEO remains intentionally limited to the curated catalog. Do not publish every generated year record as a separate SEO page or treat estimated ECU/stage metadata as verified support.

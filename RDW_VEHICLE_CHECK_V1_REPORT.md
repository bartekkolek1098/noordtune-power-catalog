# NoordTune Vehicle Check V1 Report

Vehicle Check V1 now exposes two deliberately separate products on top of one hardened, server-side RDW data layer:

1. The Power Catalog uses a minimal tuning lookup contract and keeps the original tuning-first flow.
2. The dedicated Vehicle Check uses a full pre-purchase report contract and contains no Stage calculator, tuning options or tuning quote.

No plate-specific pages, URLs, canonicals, sitemap entries or persistent browser storage were added.

## Product and API separation

| Product | Client component | Public endpoint | Public result |
| --- | --- | --- | --- |
| Power Catalog | `TuningPlateLookup` | `POST /api/rdw-lookup` | Identity, engine/fuel/power fields, catalog match, Pricing V2 stages and freshness only |
| Vehicle Check | `VehicleCheckLookup` + `RdwPurchaseCheck` | `POST /api/rdw-vehicle-check` | Registration, APK, odometer judgement, recalls, official technical data, purchase signals, history and source status |

The components do not share a result UI, tabs or context-dependent result mode. The Vehicle Check DTO removes `tuningMatch`; the tuning DTO does not contain purchase signals, APK history, recalls, source panels or financial/purchase sections.

Both endpoints remain POST-only, rate-limited and `no-store` at the response boundary. They share the lower-level server lookup, SHA-256 cache key, plate-free cache value, six-hour default TTL, bounded RDW queries, partial-source handling and timeout behavior.

## Restored tuning flow

The Power Catalog result again presents:

1. Detected vehicle identity
2. Exact match or premium manual-review state
3. Pricing V2 tuning estimate and primary next action
4. Vehicle-specific verification notice
5. Recommended Stage 1 daily setup
6. Stage selection, power chart and compatible options
7. Live total and tuning WhatsApp quote

It does not render purchase counts, APK cards, odometer cards, recall cards, a full registration report or a purchase-inspection CTA.

Published exact matches link only through `publicVehicleId` to an intentionally published vehicle page. An exact canonical match without a published page uses the localized inline action `View full tuning details` and scrolls to `#rdw-inline-tuning`, so it cannot create a broken public vehicle URL.

## Matching correction

`findCatalogMatch` now requires:

- an exact normalized make (with explicit aliases only)
- compatible model-family tokens
- fuel compatibility
- conservative power tolerance
- nominal displacement compatibility when both values are known
- a non-ambiguous best candidate

Confidence `100` requires aligned power and displacement. A deliberately published variant may win an otherwise equivalent candidate set only after all structural checks pass.

Deterministic fixtures:

| Fixture | Expected | Result |
| --- | --- | --- |
| Ford Transit Connect, diesel, 1499 cc, 100 hp (`V380ST`) | Must not match generic Ford Transit 1.6 TDCi | Manual review / no exact match |
| BMW 320D, diesel, 1995 cc, 190 hp | Preserve deterministic curated match | `bmw-320d-b47`, confidence 100 |

No invented Ford Transit Connect engine record was added.

## Pricing V2 boundary

The canonical 58,586-record database keeps its source prices. The public tuning DTO resolves each matched stage through `getPublicStagePrice` and strips `sourcePrice` before the browser response.

Commercial fallback migration:

- Stage 1: 269 -> 299, 305 -> 349, 339 -> 399
- Stage 2: 399 -> 449, 439 -> 499, 509 -> 549
- Stage 3+: 679 -> 699, 799 -> 849, 949 -> 999

The no-match estimate starts at EUR 299 / EUR 449 / EUR 699. The displayed calculator total and WhatsApp total use the same selected public stage and options.

## Official RDW sources

| Source | Dataset ID | Purpose | Public limit |
| --- | --- | --- | ---: |
| Registered vehicles | `m9d7-ebf2` | Identity, registration, APK, masses, dimensions and official indicators | 1 |
| Registered vehicle fuel | `8ys7-d773` | Fuel, power, consumption, emissions and electric range | 5 |
| Registered vehicle axles | `3huj-srit` | Axle count/details, driven/braked status, track width and axle loads | 10 |
| Registered vehicle body | `vezc-m2t6` | Body code and European body description | 5 |
| Recall status | `t49b-isb7` | Explicit open/clear/unknown status inputs | 20 |
| Recall details | `j9yg-7rg9` | Official defect, remedy and information URL | 20 |
| Observed APK defects | `a34c-vvps` | Recent official APK defect events | 24 queried / 12 returned |
| APK defect reference | `hx2c-gt7k` | Official Dutch defect description | 100 |

Every request has an explicit `$select`, bounded `$limit`, timeout and partial-source fallback. Raw upstream rows are never returned to the browser.

## Vehicle Check fields shown

### A. General information

- make and model
- vehicle type and body
- type, variant and execution
- European vehicle category
- colours, seats and doors
- first admission
- first registration in the Netherlands
- current registration date
- conservative possible-import indication

### B. Engine and environment

- fuel, cylinders and displacement
- official kW / derived hp display
- consumption and WLTP consumption
- CO2 and WLTP CO2
- emission class
- electric consumption and range where supplied
- construction speed where supplied

### C. Dimensions and weights

- length, width, height and wheelbase
- empty and running mass
- payload
- maximum permitted and technical mass
- unbraked/braked towing mass
- maximum combination mass

### D. Body, wheels and axles

- body type and European body description
- number of wheels and axles
- driven/braked axle status
- track width and official axle-load values
- chassis-number location where supplied
- type-approval number and revision

### E. Registration and financial data

- original RDW list price with a historical-price explanation
- gross BPM at registration with a non-payable-amount explanation
- WAM, export, waiting-for-inspection, transfer and taxi indicators

### F. Official timeline

- first admission
- first registration in the Netherlands
- current registration date
- recent APK defect events
- current APK expiry
- current recall status

The current registration date is not described as owner identity.

## Report hierarchy

The dedicated result renders exactly one purchase summary, one count row and one set of four APK/odometer/recall/transfer cards. Critical and attention signals remain immediately visible. Detailed official sections are collapsible for mobile readability. APK history and recall details precede the technical purchase-inspection CTA. The only tuning action is a secondary plate-free link back to the Power Catalog homepage.

## Deliberately not claimed

The report does not claim access to:

- damage history or accident photographs
- complete owner history, owner identity or exact previous-owner count
- individual odometer readings
- current market or trade-in value
- advertisement history
- finance, lien or pandrecht data
- non-RDW theft databases
- tank capacity
- transmission, number of gears or torque
- engine code
- 0-100 km/h performance

Unavailable official values are shown neutrally and are not treated as vehicle defects. A clear RDW report is not a guarantee of mechanical condition.

## Privacy and cache behavior

- Customer input is accepted only through a POST JSON body.
- The plate never appears in a query string or public result route.
- Cache and in-flight values are plate-free `RdwLookupCore` objects.
- Cache keys are SHA-256 hashes.
- The default TTL is six hours and can be overridden with `RDW_CACHE_TTL_SECONDS`.
- `fetchedAt` records the original source-check time and is preserved on cache hits.
- No plate is written to local/session storage or analytics.
- No server RDW implementation is imported by a client component.

## SEO

Localized Vehicle Check routes remain:

- `https://power.noordtune.nl/nl/kentekencheck`
- `https://power.noordtune.nl/en/vehicle-check`
- `https://power.noordtune.nl/pl/sprawdz-auto`

Localized canonicals, hreflang, `WebApplication`, `BreadcrumbList` and `FAQPage` remain in place. The sitemap remains 294 unique URLs and has no plate-specific entry.

## Automated protection

Critical audit checks now prevent:

- a purchase report or purchase/tuning tabs inside `TuningPlateLookup`
- tuning calculator state inside `VehicleCheckLookup`
- V380ST matching a generic Transit 1.6 TDCi
- regression of deterministic BMW matching
- a customer-visible legacy Stage price in the RDW tuning result
- arbitrary canonical IDs in tuning-page CTAs
- duplicate purchase summaries
- a plate-based GET handler
- clear plates in cache values
- plate-specific SEO routes

Local QA covers catalog audit, deterministic Vehicle Check fixtures, ESLint, TypeScript and production build. Authenticated Vercel Preview QA is performed after the corrective commit is pushed and is reported with the PR head verification.

# NoordTune Power Catalog Data Audit

## Scope

This audit covers the data foundation in `src/data/catalog.ts`, its use by manual selection and RDW matching, stage/service pricing, vehicle and stage routes, and sitemap generation. It does not validate tuning figures against workshop logs or external catalogs.

## Current Structure Summary

The catalog currently has two distinct layers:

1. `engineCatalog` contains 7 curated vehicle variants. These records drive static vehicle pages, stage SEO pages and the sitemap.
2. `generatedVehicleCatalog` expands brand/model/trim templates into one record per year. After first-record-wins ID deduplication, `vehicleDatabase` contains 58,586 records used by manual search, vehicle detail lookup and RDW catalog matching.

The canonical `vehicleDatabase` currently contains:

- 58,586 vehicle/year records across 32 brands.
- 175,758 stage definitions (three per vehicle).
- 9 global service options.
- Petrol, Diesel and Hybrid records. The type supports Electric, but no Electric record exists.

The published SEO layer currently contains:

- 7 curated vehicles.
- 21 localized vehicle detail URLs (7 vehicles x 3 locales).
- 63 localized stage URLs (7 vehicles x 3 stages x 3 locales).
- 87 sitemap URLs including the three locale home pages.

## Runtime Data Boundaries

The catalog is split by runtime responsibility so the canonical database is not sent to browsers:

- `src/data/catalog.ts` owns the full canonical `vehicleDatabase`, generated records, RDW matching helpers and curated SEO records. It is imported only by server components, route handlers, metadata/sitemap code and the audit script.
- `src/app/api/catalog-selector/route.ts` performs manual-selector search and Brand -> Model -> Year -> Engine filtering on the server. It returns only the small result set needed for the current interaction.
- `src/data/catalog-selector.ts` defines the lightweight selector response shape. Selector records contain display identity, ECU label, popularity and the unchanged first-stage from-price, but no stages, tags, years, options, power curves or generated templates.
- `src/data/catalog-shared.ts` contains shared TypeScript shapes, the nine global service definitions and the single generated `allServiceOptionIds` source used by both server and client code. It does not import or create vehicle records.
- `engineCatalog` remains the seven-record curated publishing set used for vehicle/stage SEO generation and the 87-URL sitemap.
- `src/data/pricing.ts` contains tier definitions. Existing inline prices remain authoritative until an explicit, verified migration.

The homepage server component serializes only 32 brand names and four popular selector records. RDW matching continues to query the canonical data on the server through the existing RDW route; its matching logic is unchanged.

`pnpm catalog:audit` scans every `"use client"` TypeScript file and raises the critical `CLIENT_IMPORTS_SERVER_CATALOG` error if it imports `@/data/catalog` (or the equivalent relative module). Client-safe imports from `catalog-shared` and `catalog-selector` remain allowed.

The canonical module still materializes all 58,586 records in a server process. That is acceptable for the current API boundary and removes the browser cost, but serverless cold-start memory and latency should be monitored. A future managed-data migration should replace eager in-memory generation with indexed server queries; it should not move this data back into client JavaScript.

## Existing Data Model

### Vehicle / Engine Variant

Required fields before this audit were:

- Identity: `id`, `brand`, `model`, `engine`, `version`.
- Classification: `fuel`, `yearRange`, `years`, `tags`, optional `popular`.
- Technical indication: `stockPowerHp`, `stockTorqueNm`, `ecuType`, optional `gearbox`.
- Relationships: embedded `stages` and service option IDs in `options`.
- Presentation: `image`.

This phase adds optional fields for generation/platform, engine and TCU identifiers, drivetrain, emissions standard, confidence, verification status, notes and a recommended package. Existing required fields and rendered behavior remain unchanged.

### Stages

Each stage is embedded in a vehicle and contains:

- `name`: Stage 1, Stage 2 or Stage 3+.
- Tuned `powerHp` and `torqueNm`.
- Inline numeric `price`.
- Human-readable `requirements` and `packageItems`.

This phase adds optional pricing tier, confidence, recommended use, hardware requirement, TCU recommendation, log-check recommendation and notes fields.

For generated records, stage power and torque are produced by fixed fuel-dependent multipliers in `buildGeneratedStages()`. Those figures are estimates, not workshop-verified calibration results.

### Services / Options

The global service list currently contains:

- DPF off / delete
- AdBlue off
- EGR off
- SCR delete
- Immo off
- Speed limiter removal
- Launch control
- Pops & Bangs / Crackle
- DSG / TCU tuning

Vehicles reference services by string ID. Most curated and generated records use `allServiceOptionIds`, so a listed option is not proof of ECU/TCU compatibility. Fuel and gearbox hints exist on service definitions, but the vehicle assignment itself is not a verified compatibility matrix.

This phase adds optional pricing, diagnosis, legal review, default recommendation and compatibility note fields. Emissions-related options are explicitly marked as requiring diagnosis/legal review and not recommended by default. No service wording or assignment changes were made.

## Pricing Storage

Effective public values currently remain inline:

- Stage prices are stored on each `StageDefinition.price`.
- Service prices are stored on each `ServiceOption.price`.
- RDW no-match indicative stages are separately defined in `plate-lookup.tsx`.

The catalog currently uses Stage 1 values of EUR 269/305/339, Stage 2 values of EUR 399/439/509 and Stage 3+ values of EUR 679/799/949. The no-match fallback includes its own indicative values and must remain independent until deliberately migrated.

`src/data/pricing.ts` now provides a non-invasive tier registry. Existing inline values still render and calculate exactly as before. Only mappings that do not change the effective price are applied; uncertain access-method mappings remain unset and are reported as warnings.

## SEO Slugs and Sitemap

`getVehicleSeoSlugs()` derives:

- brand from normalized `vehicle.brand`;
- model from a normalized model family after attempting to remove an engine token;
- engine from a token inferred from model/engine text.

`stageSlugMap` maps the three supported stage names to `stage-1`, `stage-2` and `stage-3-plus`.

The sitemap deliberately uses only `engineCatalog`, not all 58,586 selector records. This prevents thousands of year records from producing duplicate or thin SEO routes. The audit found no duplicate active SEO slug and confirms the expected 87 sitemap URLs.

Across the full selector database, 3,131 slug groups collide because year-specific records intentionally collapse to the same brand/model/engine route. `getVehicleBySeoSlugs()` currently returns the first matching record. These records must not be added to static SEO generation without a canonical variant strategy.

## RDW Matching Use

`findCatalogMatch()` reads from the canonical `vehicleDatabase`. It:

- normalizes make/model/fuel;
- handles a small make alias table;
- scores model identity from model, version, engine and tags;
- requires compatible fuel when available;
- applies a stock-power tolerance and confidence threshold;
- returns the highest-scoring first match.

Because the generated database is deduplicated in source order, reordering or silently changing duplicate template records can change which vehicle wins a match. This audit does not alter RDW matching logic.

## Main Weaknesses

1. **Generated values are estimates.** Most records derive gains from generic fuel multipliers rather than verified dyno/log evidence.
2. **Source collisions are hidden.** There are 6,890 duplicate source IDs before `dedupeVehicles()` removes later records.
3. **SEO identity is not variant-safe.** Year records collapse into 3,131 shared slug groups and cannot become independent SEO pages safely.
4. **Compatibility is too broad.** `allServiceOptionIds` is attached widely, which is not evidence that each ECU/TCU/service combination is supported.
5. **Technical identity is thin.** Most records lack generation, platform, engine code, TCU type, drivetrain and emissions-standard evidence.
6. **Confidence was implicit.** Before this phase, estimated/generated data was structurally indistinguishable from verified workshop data.
7. **Pricing is fragmented.** Inline stage prices, service prices and RDW fallback estimates are not yet governed by one verified tier assignment.
8. **Media is placeholder-heavy.** One generic image is used by 58,580 canonical records.
9. **No provenance/evidence layer exists.** There is no source reference, verification date, verifier, log/dyno evidence or supported software-version range.

## Recommended Target Model

The next model should separate concepts that are currently embedded together:

- `VehicleFamily`: brand, model, generation, platform and production range.
- `EngineVariant`: engine code, displacement/fuel, stock output, drivetrain, gearbox and emissions standard.
- `ControlUnitSupport`: ECU/TCU type, software/access method, support status and verification evidence.
- `StageResult`: verified output range, requirements, recommended use, confidence and notes.
- `ServiceCompatibility`: vehicle/engine/service relationship with diagnosis and legal-review requirements.
- `PricingTier`: commercial from-price independent from technical support data.
- `Evidence`: source, workshop verification date, logs/dyno reference and reviewer.
- `PublishingState`: manual-review, estimated, verified and whether a record may generate SEO routes.

Keep stable IDs independent from display copy and include enough technical identity to distinguish generation, engine, stock output and transmission without using a separate record for every year when a verified year range is sufficient.

## Migration Plan

1. **Freeze and measure.** Keep current prices, power/torque and route counts unchanged; run `pnpm catalog:audit` in every data-focused change.
2. **Classify current records.** Retain the estimated/manual-review metadata added here. Never bulk-upgrade confidence to verified.
3. **Resolve source collisions.** Compare duplicate template definitions field-by-field before removing any. Prove that canonical output and RDW winners remain unchanged.
4. **Build a verification queue.** Start with high-demand existing variants and record generation, engine code, ECU/TCU, stock output, transmission and evidence.
5. **Promote verified variants.** Move verified records into a curated/published collection and assign service compatibility and pricing tiers explicitly.
6. **Canonicalize SEO.** Generate one useful page per verified engine variant, with intentional year/generation canonicalization.
7. **Move to managed storage when ready.** Only after identifiers and validation rules are stable, migrate the structured model to a database/CMS with review history.

## Risk Notes

- Removing duplicate source templates without comparison can change canonical record order and RDW matches.
- Inferring an ECU/TCU from brand, model, year or power alone can produce unsafe support claims.
- Mapping a stage price to a technical access method based only on the numeric amount can misclassify bench/OBD work.
- Publishing every generated record would create thin, duplicate pages and could recreate the oversized sitemap problem.
- Treating a globally attached option as verified compatibility can create incorrect customer expectations.
- Marking legal/diagnostic services as default recommendations would be inappropriate; they remain opt-in and case-dependent.

## What Must Not Be Automated Blindly

- Tuning power or torque results.
- ECU/TCU type or software support.
- Engine-code and generation matching from display names alone.
- Stage 2/Stage 3+ hardware requirements.
- Service compatibility, especially DPF off / AdBlue off / EGR off / SCR delete.
- Legal suitability or emissions-system recommendations.
- Pricing-tier assignment based only on current price.
- Verification status without workshop evidence.
- SEO publication of generated year records.
- Vehicle photography licensing or model accuracy.

## Recommended First Verification Batch

Verify or split existing high-demand entries rather than adding bulk generated data:

1. BMW 3 Series and 5 Series diesel variants, starting with 320d/330d/530d by generation and engine code.
2. Volkswagen Golf GTI/R and 2.0 TDI variants by Mk generation, stock output and DSG/manual transmission.
3. Audi A3/A4/A6 2.0 TDI and S3 variants by platform, engine output and gearbox.
4. Mercedes-Benz C-Class 220d/250d variants by W-generation, engine family and transmission.
5. Volvo V60/XC60 diesel variants and Ford Focus ST variants where workshop demand and evidence are available.

For each promoted record, require engine code, ECU/TCU confirmation, source evidence, stock values, supported stage data, service compatibility and an explicit confidence level.

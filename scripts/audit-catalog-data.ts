/* eslint-disable @typescript-eslint/no-require-imports */
// Node's built-in TypeScript loader keeps this audit runnable without another dependency.
const {writeFileSync} = require("node:fs") as typeof import("node:fs");
const {resolve} = require("node:path") as typeof import("node:path");
const catalog = require("../src/data/catalog.ts") as typeof import("../src/data/catalog");
const {serviceOptions} = require("../src/data/catalog-shared.ts") as typeof import(
  "../src/data/catalog-shared"
);
const pricing = require("../src/data/pricing.ts") as typeof import("../src/data/pricing");
const {routing} = require("../src/i18n/routing.ts") as typeof import("../src/i18n/routing");

type AuditSeverity = "critical" | "warning";

type AuditIssue = {
  severity: AuditSeverity;
  code: string;
  summary: string;
  count: number;
  samples: string[];
};

type DuplicateGroup = {
  key: string;
  ids: string[];
};

const issues: AuditIssue[] = [];
const sourceVehicles = [...catalog.engineCatalog, ...catalog.generatedVehicleCatalog];
const knownOptionIds = new Set(serviceOptions.map((option) => option.id));
const serviceOptionById = new Map(
  serviceOptions.map((option) => [option.id, option])
);
const knownPricingTierIds = new Set(pricing.pricingTiers.map((tier) => tier.id));
const stageCount = catalog.vehicleDatabase.reduce(
  (total, vehicle) => total + vehicle.stages.length,
  0
);
const seoStageDefinitionCount = catalog.engineCatalog.reduce(
  (total, vehicle) => total + vehicle.stages.length,
  0
);
const localeCount = routing.locales.length;
const sitemapVehiclePageCount = catalog.engineCatalog.length * localeCount;
const sitemapStagePageCount = seoStageDefinitionCount * localeCount;
const sitemapUrlCount = localeCount + sitemapVehiclePageCount + sitemapStagePageCount;
const brands = Array.from(
  new Set(catalog.vehicleDatabase.map((vehicle) => vehicle.brand))
).sort();
const fuelTypes = Array.from(
  new Set(catalog.vehicleDatabase.map((vehicle) => vehicle.fuel))
).sort();

function addIssue(
  severity: AuditSeverity,
  code: string,
  summary: string,
  items: string[]
) {
  if (items.length === 0) {
    return;
  }

  issues.push({
    severity,
    code,
    summary,
    count: items.length,
    samples: items.slice(0, 8)
  });
}

function duplicateGroups<T>(
  items: T[],
  keyFor: (item: T) => string,
  idFor: (item: T) => string
): DuplicateGroup[] {
  const groups = new Map<string, string[]>();

  for (const item of items) {
    const key = keyFor(item);
    const ids = groups.get(key) ?? [];
    ids.push(idFor(item));
    groups.set(key, ids);
  }

  return Array.from(groups, ([key, ids]) => ({key, ids})).filter(
    (group) => group.ids.length > 1
  );
}

function seoSlugKey(vehicle: (typeof catalog.vehicleDatabase)[number]) {
  const slugs = catalog.getVehicleSeoSlugs(vehicle);
  return `${slugs.brand}/${slugs.model}/${slugs.engine}`;
}

function displayDuplicate(group: DuplicateGroup) {
  return `${group.key} (${group.ids.length}: ${group.ids.slice(0, 3).join(", ")}${
    group.ids.length > 3 ? ", ..." : ""
  })`;
}

const canonicalIdDuplicates = duplicateGroups(
  catalog.vehicleDatabase,
  (vehicle) => vehicle.id,
  (vehicle) => vehicle.id
);
addIssue(
  "critical",
  "DUPLICATE_CANONICAL_VEHICLE_ID",
  "Canonical vehicle IDs must be unique.",
  canonicalIdDuplicates.map(displayDuplicate)
);

const sourceIdDuplicates = duplicateGroups(
  sourceVehicles,
  (vehicle) => vehicle.id,
  (vehicle) => vehicle.id
);
addIssue(
  "warning",
  "SOURCE_ID_COLLISION",
  "Generated source records contain ID collisions that are currently hidden by dedupeVehicles().",
  sourceIdDuplicates.map(displayDuplicate)
);

const serviceOptionDuplicates = duplicateGroups(
  serviceOptions,
  (option) => option.id,
  (option) => option.id
);
addIssue(
  "critical",
  "DUPLICATE_SERVICE_OPTION_ID",
  "Service option IDs must be unique.",
  serviceOptionDuplicates.map(displayDuplicate)
);

const pricingTierDuplicates = duplicateGroups(
  [...pricing.pricingTiers],
  (tier) => tier.id,
  (tier) => tier.id
);
addIssue(
  "critical",
  "DUPLICATE_PRICING_TIER_ID",
  "Pricing tier IDs must be unique.",
  pricingTierDuplicates.map(displayDuplicate)
);

const seoRouteDuplicates = duplicateGroups(
  catalog.engineCatalog,
  seoSlugKey,
  (vehicle) => vehicle.id
);
addIssue(
  "critical",
  "DUPLICATE_ACTIVE_SEO_SLUG",
  "Vehicles used for static SEO routes must have unique brand/model/engine slugs.",
  seoRouteDuplicates.map(displayDuplicate)
);

const selectorSeoCollisions = duplicateGroups(
  catalog.vehicleDatabase,
  seoSlugKey,
  (vehicle) => vehicle.id
);
addIssue(
  "warning",
  "SELECTOR_SEO_SLUG_COLLISION",
  "Year-specific selector records collapse onto shared SEO slugs; do not add all selector records to the sitemap blindly.",
  selectorSeoCollisions.map(displayDuplicate)
);

const missingCoreFields: string[] = [];
const missingStockValues: string[] = [];
const vehiclesWithoutStages: string[] = [];
const missingImages: string[] = [];
const missingConfidence: string[] = [];
const missingRecommendedPackage: string[] = [];
const invalidOptionReferences: string[] = [];
const incompatibleOptionAssignments: string[] = [];
const invalidRecommendedOptions: string[] = [];
const invalidRecommendedStages: string[] = [];
const invalidStagePrices: string[] = [];
const lowerStagePower: string[] = [];
const lowerStageTorque: string[] = [];
const incompleteStageContent: string[] = [];
const missingStagePricingTier: string[] = [];
const unknownPricingTierReferences: string[] = [];
const pricingTierConflicts: string[] = [];
const uncoveredStageSlugs: string[] = [];

for (const vehicle of catalog.vehicleDatabase) {
  if (!vehicle.brand || !vehicle.model || !vehicle.engine || !vehicle.yearRange) {
    missingCoreFields.push(vehicle.id);
  }

  if (
    !Number.isFinite(vehicle.stockPowerHp) ||
    vehicle.stockPowerHp <= 0 ||
    !Number.isFinite(vehicle.stockTorqueNm) ||
    vehicle.stockTorqueNm <= 0
  ) {
    missingStockValues.push(vehicle.id);
  }

  if (vehicle.stages.length === 0) {
    vehiclesWithoutStages.push(vehicle.id);
  }

  if (!vehicle.image.trim()) {
    missingImages.push(vehicle.id);
  }

  if (!vehicle.confidenceLevel) {
    missingConfidence.push(vehicle.id);
  }

  if (!vehicle.recommendedPackage) {
    missingRecommendedPackage.push(vehicle.id);
  } else {
    if (!vehicle.stages.some((stage) => stage.name === vehicle.recommendedPackage?.stage)) {
      invalidRecommendedStages.push(`${vehicle.id}: ${vehicle.recommendedPackage.stage}`);
    }

    for (const optionId of vehicle.recommendedPackage.recommendedOptionIds ?? []) {
      if (!knownOptionIds.has(optionId) || !vehicle.options.includes(optionId)) {
        invalidRecommendedOptions.push(`${vehicle.id}: ${optionId}`);
      }
    }
  }

  for (const optionId of vehicle.options) {
    if (!knownOptionIds.has(optionId)) {
      invalidOptionReferences.push(`${vehicle.id}: ${optionId}`);
      continue;
    }

    const option = serviceOptionById.get(optionId);
    if (option?.fuels && !option.fuels.includes(vehicle.fuel)) {
      incompatibleOptionAssignments.push(
        `${vehicle.id}: ${optionId} is not listed for ${vehicle.fuel}`
      );
    }

    if (
      option?.requiresGearbox &&
      (!vehicle.gearbox || vehicle.gearbox === "Manual")
    ) {
      incompatibleOptionAssignments.push(
        `${vehicle.id}: ${optionId} requires a supported automatic gearbox`
      );
    }
  }

  for (const stage of vehicle.stages) {
    const stageId = `${vehicle.id}: ${stage.name}`;

    if (!Number.isFinite(stage.price) || stage.price <= 0) {
      invalidStagePrices.push(stageId);
    }

    if (stage.powerHp < vehicle.stockPowerHp) {
      lowerStagePower.push(stageId);
    }

    if (stage.torqueNm < vehicle.stockTorqueNm) {
      lowerStageTorque.push(stageId);
    }

    if (!stage.requirements.trim() || stage.packageItems.length === 0) {
      incompleteStageContent.push(stageId);
    }

    if (!catalog.stageSlugMap[stage.name]) {
      uncoveredStageSlugs.push(stageId);
    }

    if (!stage.pricingTier) {
      missingStagePricingTier.push(stageId);
    } else if (!knownPricingTierIds.has(stage.pricingTier)) {
      unknownPricingTierReferences.push(`${stageId}: ${stage.pricingTier}`);
    } else {
      const tier = pricing.pricingTierById[stage.pricingTier];
      if (tier.priceFrom !== null && stage.price < tier.priceFrom) {
        pricingTierConflicts.push(
          `${stageId}: EUR ${stage.price} below ${tier.id} EUR ${tier.priceFrom}`
        );
      }
    }
  }
}

for (const option of serviceOptions) {
  if (!option.pricingTier) {
    continue;
  }

  if (!knownPricingTierIds.has(option.pricingTier)) {
    unknownPricingTierReferences.push(`${option.id}: ${option.pricingTier}`);
    continue;
  }

  const tier = pricing.pricingTierById[option.pricingTier];
  if (tier.priceFrom !== null && option.price !== tier.priceFrom) {
    pricingTierConflicts.push(
      `${option.id}: EUR ${option.price} does not match ${tier.id} EUR ${tier.priceFrom}`
    );
  }
}

addIssue("warning", "MISSING_CORE_FIELDS", "Vehicles are missing brand/model/engine/yearRange.", missingCoreFields);
addIssue("warning", "MISSING_STOCK_VALUES", "Vehicles are missing numeric stock power or torque.", missingStockValues);
addIssue("critical", "MISSING_STAGES", "Vehicles must include at least one stage.", vehiclesWithoutStages);
addIssue("warning", "MISSING_IMAGE", "Vehicles are missing an image path.", missingImages);
addIssue("warning", "MISSING_CONFIDENCE", "Vehicles are missing confidenceLevel.", missingConfidence);
addIssue(
  "warning",
  "MISSING_RECOMMENDED_PACKAGE",
  "Vehicles are missing recommendedPackage metadata.",
  missingRecommendedPackage
);
addIssue(
  "warning",
  "UNKNOWN_VEHICLE_OPTION",
  "Vehicles reference options that do not exist in serviceOptions.",
  invalidOptionReferences
);
addIssue(
  "warning",
  "OPTION_COMPATIBILITY_NOT_CONFIRMED",
  "Vehicle option assignments conflict with existing fuel/gearbox hints and require an explicit compatibility matrix.",
  incompatibleOptionAssignments
);
addIssue(
  "warning",
  "INVALID_RECOMMENDED_OPTION",
  "Recommended packages reference unavailable options.",
  invalidRecommendedOptions
);
addIssue(
  "warning",
  "INVALID_RECOMMENDED_STAGE",
  "Recommended packages reference unavailable stages.",
  invalidRecommendedStages
);
addIssue("warning", "INVALID_STAGE_PRICE", "Stages have missing or invalid prices.", invalidStagePrices);
addIssue("warning", "STAGE_POWER_REGRESSION", "Tuned power is lower than stock power.", lowerStagePower);
addIssue("warning", "STAGE_TORQUE_REGRESSION", "Tuned torque is lower than stock torque.", lowerStageTorque);
addIssue(
  "warning",
  "INCOMPLETE_STAGE_CONTENT",
  "Stages are missing requirements or packageItems.",
  incompleteStageContent
);
addIssue(
  "warning",
  "MISSING_STAGE_PRICING_TIER",
  "Stages retain their effective price but are not yet mapped to a verified pricing tier.",
  missingStagePricingTier
);
addIssue(
  "critical",
  "UNKNOWN_PRICING_TIER",
  "Catalog records reference an undefined pricing tier.",
  unknownPricingTierReferences
);
addIssue(
  "critical",
  "PRICING_TIER_CONFLICT",
  "A mapped price conflicts with its centralized tier.",
  pricingTierConflicts
);
addIssue(
  "critical",
  "MISSING_STAGE_SLUG",
  "stageSlugMap does not cover every stage used by the catalog.",
  uncoveredStageSlugs
);

const imageUsage = new Map<string, string[]>();
for (const vehicle of catalog.vehicleDatabase) {
  const vehicleIds = imageUsage.get(vehicle.image) ?? [];
  vehicleIds.push(vehicle.id);
  imageUsage.set(vehicle.image, vehicleIds);
}
const repeatedImages = Array.from(imageUsage, ([image, ids]) => ({image, ids}))
  .filter(({ids}) => ids.length > 20)
  .sort((left, right) => right.ids.length - left.ids.length)
  .map(({image, ids}) => `${ids.length} vehicles: ${image}`);
addIssue(
  "warning",
  "REPEATED_PLACEHOLDER_IMAGE",
  "A small image pool is reused across many vehicle records.",
  repeatedImages
);

const sitemapRouteKeys = routing.locales.flatMap((locale) => [
  `/${locale}`,
  ...catalog.engineCatalog.map((vehicle) => `/${locale}/vehicles/${vehicle.id}`),
  ...catalog.engineCatalog.flatMap((vehicle) => {
    const slugs = catalog.getVehicleSeoSlugs(vehicle);
    return vehicle.stages.map(
      (stage) =>
        `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${catalog.stageSlugMap[stage.name]}`
    );
  })
]);
const duplicateSitemapRoutes = duplicateGroups(
  sitemapRouteKeys,
  (route) => route,
  (route) => route
);
addIssue(
  "critical",
  "DUPLICATE_SITEMAP_URL",
  "Generated sitemap URLs must be unique.",
  duplicateSitemapRoutes.map(displayDuplicate)
);

if (sitemapRouteKeys.length !== sitemapUrlCount) {
  addIssue(
    "critical",
    "SITEMAP_COUNT_MISMATCH",
    "Generated sitemap URL count does not match the calculated route count.",
    [`generated=${sitemapRouteKeys.length}, calculated=${sitemapUrlCount}`]
  );
}

const criticalIssues = issues.filter((issue) => issue.severity === "critical");
const warningIssues = issues.filter((issue) => issue.severity === "warning");
const curatedConfidence = countBy(
  catalog.engineCatalog.map((vehicle) => vehicle.confidenceLevel ?? "missing")
);
const databaseConfidence = countBy(
  catalog.vehicleDatabase.map((vehicle) => vehicle.confidenceLevel ?? "missing")
);

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function issueMarkdown(issue: AuditIssue) {
  const samples = issue.samples.map((sample) => `  - ${sample}`).join("\n");
  return `- **${issue.code}** (${issue.count}): ${issue.summary}${
    samples ? `\n${samples}` : ""
  }`;
}

function issueConsole(issue: AuditIssue) {
  console.log(`  [${issue.severity.toUpperCase()}] ${issue.code}: ${issue.count}`);
  console.log(`    ${issue.summary}`);
  for (const sample of issue.samples.slice(0, 3)) {
    console.log(`    - ${sample}`);
  }
}

const report = `# Catalog Data Report

Generated from the current catalog sources by \`pnpm catalog:audit\`.

## Summary

| Metric | Count |
| --- | ---: |
| Curated vehicles used for static SEO | ${catalog.engineCatalog.length} |
| Generated source records before canonical dedupe | ${catalog.generatedVehicleCatalog.length} |
| Canonical selector/RDW vehicle records | ${catalog.vehicleDatabase.length} |
| Stage definitions in canonical database | ${stageCount} |
| Localized vehicle detail pages in sitemap | ${sitemapVehiclePageCount} |
| Localized stage SEO pages in sitemap | ${sitemapStagePageCount} |
| Total sitemap URLs | ${sitemapUrlCount} |
| Service options | ${serviceOptions.length} |
| Brands | ${brands.length} |
| Critical issue groups | ${criticalIssues.length} |
| Warning groups | ${warningIssues.length} |

## Coverage

- Brands: ${brands.join(", ")}
- Fuel types: ${fuelTypes.join(", ")}
- Curated confidence levels: ${JSON.stringify(curatedConfidence)}
- Canonical database confidence levels: ${JSON.stringify(databaseConfidence)}
- Pricing tiers: ${pricing.pricingTiers.map((tier) => tier.id).join(", ")}

## Critical Errors

${criticalIssues.length > 0 ? criticalIssues.map(issueMarkdown).join("\n") : "None."}

## Warnings

${warningIssues.length > 0 ? warningIssues.map(issueMarkdown).join("\n") : "None."}

## Recommended Next Additions

1. Manually verify and promote high-demand generated variants into curated records, starting with BMW 3/5 Series diesel, Volkswagen Golf GTI/R and 2.0 TDI, Audi A3/A4 2.0 TDI, Mercedes-Benz C-Class diesel, Volvo V60/XC60 and Ford Focus ST.
2. Split verified records by generation, engine code, ECU/TCU and drivetrain only when workshop evidence is available.
3. Replace shared placeholder photography with licensed brand/model-family assets before exposing generated records as SEO landing pages.
4. Assign remaining pricing tiers only after the workshop confirms the access method and service scope; keep current effective prices unchanged until then.

## Interpretation

The canonical selector/RDW database is deduplicated and structurally usable, but most records are template-generated estimates. Static SEO remains intentionally limited to the curated catalog. Do not publish every generated year record as a separate SEO page or treat estimated ECU/stage metadata as verified support.
`;

const reportPath = resolve(process.cwd(), "CATALOG_DATA_REPORT.md");
writeFileSync(reportPath, report, "utf8");

console.log("NoordTune catalog data audit");
console.log(`  Curated SEO vehicles: ${catalog.engineCatalog.length}`);
console.log(`  Canonical selector/RDW vehicles: ${catalog.vehicleDatabase.length}`);
console.log(`  Stage definitions: ${stageCount}`);
console.log(`  Localized stage SEO pages: ${sitemapStagePageCount}`);
console.log(`  Sitemap URLs: ${sitemapUrlCount}`);
console.log(`  Brands: ${brands.length}`);
console.log(`  Critical issue groups: ${criticalIssues.length}`);
console.log(`  Warning groups: ${warningIssues.length}`);

for (const issue of issues) {
  issueConsole(issue);
}

console.log(`  Report: ${reportPath}`);

if (criticalIssues.length > 0) {
  process.exitCode = 1;
}

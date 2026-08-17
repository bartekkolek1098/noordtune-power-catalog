/* eslint-disable @typescript-eslint/no-require-imports */
// Node's built-in TypeScript loader keeps this audit runnable without another dependency.
const {readdirSync, readFileSync, writeFileSync} = require("node:fs") as typeof import(
  "node:fs"
);
const {createHash} = require("node:crypto") as typeof import("node:crypto");
const {dirname, relative, resolve} = require("node:path") as typeof import("node:path");
const catalog = require("../src/data/catalog.ts") as typeof import("../src/data/catalog");
const {curatedVehiclePublications} = require("../src/data/curated-catalog.ts") as typeof import(
  "../src/data/curated-catalog"
);
const {curatedVehicleTechnicalProfiles} = require("../src/data/curated-technical.ts") as typeof import(
  "../src/data/curated-technical"
);
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
const canonicalVehicleById = new Map(
  catalog.vehicleDatabase.map((vehicle) => [vehicle.id, vehicle])
);
const publicVehicleById = new Map(
  catalog.engineCatalog.map((vehicle) => [vehicle.id, vehicle])
);
const technicalProfileById = new Map(
  curatedVehicleTechnicalProfiles.map((profile) => [profile.vehicleId, profile])
);

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

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }

    return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function importedModules(source: string) {
  const patterns = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*(?:\(\s*)?["']([^"']+)["']/g,
    /\brequire\s*\(\s*["']([^"']+)["']/g
  ];

  return patterns.flatMap((pattern) =>
    Array.from(source.matchAll(pattern), (match) => match[1])
  );
}

function importsCanonicalCatalog(file: string, source: string) {
  const canonicalCatalogPath = resolve(process.cwd(), "src/data/catalog");

  return importedModules(source).some((specifier) => {
    const normalized = specifier.replace(/\.(?:ts|tsx|js)$/, "");

    if (normalized === "@/data/catalog") {
      return true;
    }

    return (
      normalized.startsWith(".") &&
      resolve(dirname(file), normalized) === canonicalCatalogPath
    );
  });
}

const clientImportsServerCatalog = listSourceFiles(resolve(process.cwd(), "src"))
  .filter((file) => {
    const source = readFileSync(file, "utf8");

    return (
      /^\s*["']use client["'];/.test(source) &&
      importsCanonicalCatalog(file, source)
    );
  })
  .map((file) => relative(process.cwd(), file));

addIssue(
  "critical",
  "CLIENT_IMPORTS_SERVER_CATALOG",
  "Client components must import only lightweight catalog-shared or catalog-selector modules.",
  clientImportsServerCatalog
);

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

const publicIdDuplicates = duplicateGroups(
  curatedVehiclePublications,
  (publication) => publication.id,
  (publication) => publication.sourceId
);
addIssue(
  "critical",
  "DUPLICATE_PUBLIC_VEHICLE_ID",
  "Explicit curated publication IDs must be unique.",
  publicIdDuplicates.map(displayDuplicate)
);

const missingPublishedSources = curatedVehiclePublications
  .filter((publication) => !canonicalVehicleById.has(publication.sourceId))
  .map((publication) => `${publication.id}: ${publication.sourceId}`);
addIssue(
  "critical",
  "UNRESOLVED_PUBLICATION_SOURCE",
  "Every published vehicle must resolve to its canonical source record.",
  missingPublishedSources
);

const missingPublishedVehicles = curatedVehiclePublications
  .filter((publication) => !publicVehicleById.has(publication.id))
  .map((publication) => publication.id);
addIssue(
  "critical",
  "UNRESOLVED_PUBLIC_VEHICLE",
  "Every explicit publication must resolve through the public catalog.",
  missingPublishedVehicles
);

const publishedValueDrift: string[] = [];
for (const publication of curatedVehiclePublications) {
  const source = canonicalVehicleById.get(publication.sourceId);
  const published = publicVehicleById.get(publication.id);

  if (!source || !published) {
    continue;
  }

  const sourceStages = source.stages.map((stage) => ({
    name: stage.name,
    powerHp: stage.powerHp,
    torqueNm: stage.torqueNm,
    price: stage.price
  }));
  const publishedStages = published.stages.map((stage) => ({
    name: stage.name,
    powerHp: stage.powerHp,
    torqueNm: stage.torqueNm,
    price: stage.price
  }));

  if (
    source.stockPowerHp !== published.stockPowerHp ||
    source.stockTorqueNm !== published.stockTorqueNm ||
    JSON.stringify(sourceStages) !== JSON.stringify(publishedStages) ||
    JSON.stringify(source.options) !== JSON.stringify(published.options)
  ) {
    publishedValueDrift.push(`${publication.id}: ${publication.sourceId}`);
  }
}
addIssue(
  "critical",
  "PUBLISHED_SOURCE_VALUE_DRIFT",
  "Published stock values, stage values, prices and options must match their canonical source.",
  publishedValueDrift
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

const invalidPublicCore: string[] = [];
const invalidPublicStages: string[] = [];
const missingPublicConfidence: string[] = [];
const missingPublicVerificationState: string[] = [];
const missingPublicRecommendedPackage: string[] = [];
const brokenPublicStageSlugs: string[] = [];
const estimatedPublicVehicles: string[] = [];
const missingPublicEngineCodes: string[] = [];
const missingPublicTcuTypes: string[] = [];
const placeholderPublicImages: string[] = [];
const unmappedPublicPricingTiers: string[] = [];
const publicServiceCompatibilityReview: string[] = [];

for (const vehicle of catalog.engineCatalog) {

  if (
    !vehicle.brand ||
    !vehicle.model ||
    !vehicle.engine ||
    !vehicle.yearRange ||
    !Number.isFinite(vehicle.stockPowerHp) ||
    vehicle.stockPowerHp <= 0 ||
    !Number.isFinite(vehicle.stockTorqueNm) ||
    vehicle.stockTorqueNm <= 0
  ) {
    invalidPublicCore.push(vehicle.id);
  }

  if (
    vehicle.stages.length === 0 ||
    vehicle.stages.some(
      (stage) =>
        !Number.isFinite(stage.price) ||
        stage.price <= 0 ||
        stage.powerHp < vehicle.stockPowerHp ||
        stage.torqueNm < vehicle.stockTorqueNm
    )
  ) {
    invalidPublicStages.push(vehicle.id);
  }

  if (!vehicle.confidenceLevel) {
    missingPublicConfidence.push(vehicle.id);
  } else if (vehicle.confidenceLevel === "estimated") {
    estimatedPublicVehicles.push(vehicle.id);
  }

  if (typeof vehicle.verificationRequired !== "boolean") {
    missingPublicVerificationState.push(vehicle.id);
  }

  if (!vehicle.recommendedPackage) {
    missingPublicRecommendedPackage.push(vehicle.id);
  }

  for (const stage of vehicle.stages) {
    if (!catalog.stageSlugMap[stage.name]) {
      brokenPublicStageSlugs.push(`${vehicle.id}: ${stage.name}`);
    }
    if (!stage.pricingTier) {
      unmappedPublicPricingTiers.push(`${vehicle.id}: ${stage.name}`);
    }
  }

  if (!vehicle.engineIdentity?.engineCodes?.length) {
    missingPublicEngineCodes.push(vehicle.id);
  }

  if (
    vehicle.gearbox &&
    vehicle.gearbox !== "Manual" &&
    (!vehicle.tcuSupport || vehicle.tcuSupport.status === "manual-review")
  ) {
    missingPublicTcuTypes.push(vehicle.id);
  }

  if (vehicle.imageStatus === "generic-placeholder") {
    placeholderPublicImages.push(vehicle.id);
  }

  if (
    Object.values(vehicle.serviceCompatibility ?? {}).some(
      (entry) => entry.status === "manual-review"
    )
  ) {
    publicServiceCompatibilityReview.push(vehicle.id);
  }
}

addIssue(
  "critical",
  "INVALID_PUBLIC_VEHICLE_CORE",
  "Published records require brand/model/engine/year and valid stock power/torque.",
  invalidPublicCore
);
addIssue(
  "critical",
  "INVALID_PUBLIC_STAGE",
  "Published records require stages with valid prices and no stock-value regression.",
  invalidPublicStages
);
addIssue(
  "critical",
  "MISSING_PUBLIC_CONFIDENCE",
  "Published records require an explicit confidence level.",
  missingPublicConfidence
);
addIssue(
  "critical",
  "MISSING_PUBLIC_VERIFICATION_STATE",
  "Published records require an explicit verificationRequired state.",
  missingPublicVerificationState
);
addIssue(
  "critical",
  "MISSING_PUBLIC_RECOMMENDED_PACKAGE",
  "Published records require a recommended package.",
  missingPublicRecommendedPackage
);
addIssue(
  "critical",
  "BROKEN_PUBLIC_STAGE_SLUG",
  "Every published stage must be covered by stageSlugMap.",
  brokenPublicStageSlugs
);
addIssue(
  "warning",
  "ESTIMATED_PUBLIC_VEHICLE",
  "Published generated records remain estimates and require vehicle-specific confirmation.",
  estimatedPublicVehicles
);
addIssue(
  "warning",
  "MISSING_PUBLIC_ENGINE_CODE",
  "No engine code is stored; do not claim one until manually verified.",
  missingPublicEngineCodes
);
addIssue(
  "warning",
  "MISSING_PUBLIC_TCU_TYPE",
  "Automatic gearbox is listed but the exact TCU type is not stored.",
  missingPublicTcuTypes
);
addIssue(
  "warning",
  "PUBLIC_PLACEHOLDER_IMAGE",
  "Published record uses a generic placeholder pending owned/licensed media.",
  placeholderPublicImages
);
addIssue(
  "warning",
  "UNMAPPED_PUBLIC_PRICING_TIER",
  "Effective price is preserved, but no exact safe pricing tier mapping exists.",
  unmappedPublicPricingTiers
);
addIssue(
  "warning",
  "PUBLIC_SERVICE_COMPATIBILITY_REVIEW",
  "Published options remain available only subject to diagnosis, legal review and compatibility confirmation.",
  publicServiceCompatibilityReview
);

const technicalProfileDuplicates = duplicateGroups(
  curatedVehicleTechnicalProfiles,
  (profile) => profile.vehicleId,
  (profile) => profile.sourceCanonicalId
);
addIssue(
  "critical",
  "DUPLICATE_CURATED_TECHNICAL_PROFILE",
  "Every public vehicle may have only one curated technical profile.",
  technicalProfileDuplicates.map(displayDuplicate)
);

const missingTechnicalProfiles = catalog.engineCatalog
  .filter((vehicle) => !technicalProfileById.has(vehicle.id))
  .map((vehicle) => vehicle.id);
addIssue(
  "critical",
  "MISSING_CURATED_TECHNICAL_PROFILE",
  "Every public vehicle requires an explicit technical/service profile.",
  missingTechnicalProfiles
);

const orphanTechnicalProfiles = curatedVehicleTechnicalProfiles
  .filter((profile) => !publicVehicleById.has(profile.vehicleId))
  .map((profile) => profile.vehicleId);
addIssue(
  "critical",
  "ORPHAN_CURATED_TECHNICAL_PROFILE",
  "Technical profiles must resolve to an active public vehicle.",
  orphanTechnicalProfiles
);

const missingPublicationSource: string[] = [];
const unresolvedTechnicalSources: string[] = [];
const unknownCompatibilityServices: string[] = [];
const incompleteCompatibilityMatrices: string[] = [];
const prohibitedPetrolCompatibility: string[] = [];
const prohibitedDieselCompatibility: string[] = [];
const prohibitedManualGearboxCompatibility: string[] = [];
const unsupportedVerifiedEcuClaims: string[] = [];
const unsupportedVerifiedTcuClaims: string[] = [];
const broadEcuFamilies: string[] = [];
const missingTechnicalEngineCodes: string[] = [];
const unknownTechnicalTcu: string[] = [];
const ambiguousTransmissions: string[] = [];
const manualReviewCompatibility: string[] = [];
const missingTechnicalProvenance: string[] = [];

function hasVerifiedTechnicalEvidence(
  evidence: (typeof catalog.engineCatalog)[number]["technicalEvidence"]
) {
  return Boolean(
    evidence &&
      evidence.sourceReference &&
      evidence.verifiedAt &&
      evidence.verifiedBy &&
      evidence.sourceType &&
      !["internal", "unknown"].includes(evidence.sourceType)
  );
}

for (const vehicle of catalog.engineCatalog) {
  if (!vehicle.publicationSource || !vehicle.sourceCanonicalId) {
    missingPublicationSource.push(vehicle.id);
  } else if (!canonicalVehicleById.has(vehicle.sourceCanonicalId)) {
    unresolvedTechnicalSources.push(
      `${vehicle.id}: ${vehicle.sourceCanonicalId}`
    );
  }

  const compatibilityEntries = Object.entries(
    vehicle.serviceCompatibility ?? {}
  );
  const compatibilityIds = new Set(compatibilityEntries.map(([id]) => id));

  for (const [optionId, entry] of compatibilityEntries) {
    if (!knownOptionIds.has(optionId)) {
      unknownCompatibilityServices.push(`${vehicle.id}: ${optionId}`);
    }

    if (entry.status === "manual-review") {
      manualReviewCompatibility.push(`${vehicle.id}: ${optionId}`);
    }
  }

  const missingCompatibility = vehicle.options.filter(
    (optionId) => knownOptionIds.has(optionId) && !compatibilityIds.has(optionId)
  );
  if (missingCompatibility.length > 0) {
    incompleteCompatibilityMatrices.push(
      `${vehicle.id}: ${missingCompatibility.join(", ")}`
    );
  }

  if (vehicle.fuel === "Petrol") {
    for (const optionId of ["dpf", "adblue", "scr"]) {
      if (vehicle.serviceCompatibility?.[optionId]?.status === "supported") {
        prohibitedPetrolCompatibility.push(`${vehicle.id}: ${optionId}`);
      }
    }
  }

  if (
    vehicle.fuel === "Diesel" &&
    vehicle.serviceCompatibility?.pops?.status === "supported"
  ) {
    prohibitedDieselCompatibility.push(`${vehicle.id}: pops`);
  }

  if (
    vehicle.gearbox === "Manual" &&
    vehicle.serviceCompatibility?.gearbox?.status === "supported"
  ) {
    prohibitedManualGearboxCompatibility.push(`${vehicle.id}: gearbox`);
  }

  if (
    vehicle.ecuSupport?.status === "verified" &&
    !hasVerifiedTechnicalEvidence(vehicle.technicalEvidence)
  ) {
    unsupportedVerifiedEcuClaims.push(vehicle.id);
  }

  if (
    vehicle.tcuSupport?.status === "verified" &&
    !hasVerifiedTechnicalEvidence(vehicle.technicalEvidence)
  ) {
    unsupportedVerifiedTcuClaims.push(vehicle.id);
  }

  if (vehicle.ecuSupport?.status === "supported-family") {
    broadEcuFamilies.push(
      `${vehicle.id}: ${vehicle.ecuSupport.family ?? vehicle.ecuType}`
    );
  }

  if (!vehicle.engineIdentity?.engineCodes?.length) {
    missingTechnicalEngineCodes.push(vehicle.id);
  }

  if (
    vehicle.gearbox &&
    vehicle.gearbox !== "Manual" &&
    (!vehicle.tcuSupport || vehicle.tcuSupport.status === "manual-review")
  ) {
    unknownTechnicalTcu.push(vehicle.id);
  }

  if (
    !vehicle.transmissionSupport ||
    ["estimated", "manual-review"].includes(vehicle.transmissionSupport.status)
  ) {
    ambiguousTransmissions.push(vehicle.id);
  }

  if (
    !vehicle.technicalEvidence?.sourceReference ||
    !vehicle.technicalEvidence.sourceType
  ) {
    missingTechnicalProvenance.push(vehicle.id);
  }
}

addIssue(
  "critical",
  "MISSING_PUBLICATION_SOURCE",
  "Every public vehicle requires a traceable publication source.",
  missingPublicationSource
);
addIssue(
  "critical",
  "UNRESOLVED_TECHNICAL_SOURCE",
  "Technical profile source IDs must resolve to the unchanged canonical database.",
  unresolvedTechnicalSources
);
addIssue(
  "critical",
  "UNKNOWN_SERVICE_COMPATIBILITY",
  "Service compatibility may reference only canonical service option IDs.",
  unknownCompatibilityServices
);
addIssue(
  "critical",
  "INCOMPLETE_SERVICE_COMPATIBILITY",
  "Every current public option requires an explicit compatibility status.",
  incompleteCompatibilityMatrices
);
addIssue(
  "critical",
  "PETROL_DIESEL_SERVICE_SUPPORTED",
  "Petrol vehicles must not mark DPF, AdBlue or SCR services as supported.",
  prohibitedPetrolCompatibility
);
addIssue(
  "critical",
  "DIESEL_POPS_SUPPORTED",
  "Diesel vehicles must not mark Pops & Bangs as supported.",
  prohibitedDieselCompatibility
);
addIssue(
  "critical",
  "MANUAL_GEARBOX_TCU_SUPPORTED",
  "Manual vehicles must not mark gearbox/TCU tuning as supported.",
  prohibitedManualGearboxCompatibility
);
addIssue(
  "critical",
  "VERIFIED_ECU_WITHOUT_EVIDENCE",
  "Verified ECU claims require dated, attributable primary/tool/workshop evidence.",
  unsupportedVerifiedEcuClaims
);
addIssue(
  "critical",
  "VERIFIED_TCU_WITHOUT_EVIDENCE",
  "Verified TCU claims require dated, attributable primary/tool/workshop evidence.",
  unsupportedVerifiedTcuClaims
);
addIssue(
  "warning",
  "BROAD_ECU_FAMILY_ONLY",
  "Broad ECU-family labels are not exact ECU identification.",
  broadEcuFamilies
);
addIssue(
  "warning",
  "CURATED_ENGINE_CODE_REVIEW",
  "No supported engine-family code is stored; manual identification remains required.",
  missingTechnicalEngineCodes
);
addIssue(
  "warning",
  "CURATED_TCU_UNKNOWN",
  "Automatic transmission is listed without an evidence-backed exact TCU variant.",
  unknownTechnicalTcu
);
addIssue(
  "warning",
  "CURATED_TRANSMISSION_AMBIGUOUS",
  "Transmission identity is estimated or requires manual review.",
  ambiguousTransmissions
);
addIssue(
  "warning",
  "MANUAL_REVIEW_SERVICE_COMPATIBILITY",
  "Service remains commercially visible only with explicit manual confirmation.",
  manualReviewCompatibility
);
addIssue(
  "warning",
  "MISSING_TECHNICAL_PROVENANCE",
  "Public technical metadata requires a traceable, non-fabricated source reference.",
  missingTechnicalProvenance
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

function semanticHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function commercialVehicleProjection(
  vehicle: (typeof catalog.engineCatalog)[number]
) {
  return {
    id: vehicle.id,
    stockPowerHp: vehicle.stockPowerHp,
    stockTorqueNm: vehicle.stockTorqueNm,
    stages: vehicle.stages.map((stage) => ({
      name: stage.name,
      powerHp: stage.powerHp,
      torqueNm: stage.torqueNm,
      price: stage.price
    })),
    options: vehicle.options
  };
}

const productionSemanticBaseline = {
  canonicalFull:
    "780d89bd3c83ef89cf1a9a4f62ebe4dad6f1fae31afbfccbe01f4943def89d6d",
  canonicalCommercial:
    "6bbb5115dbeb201851e4ac356adedb1db5841c526164f5feb5999d4540915ee3",
  publicCommercial:
    "ae7effd261f06a57286a313be70a4629c0205c5965b50b63b80f3eb0b1dc2ec2",
  publicRoutes:
    "dff24cf3c6ff6425ed2c121fb97f5da1959c7dad8ff5f974911a88cb63167775",
  serviceDefinitions:
    "7d1644c1deec54f5c02f454b3ef01bf721e6c798df055b3ad5fce1f18438a886",
  rdwMatcher:
    "c9c9fda79732266e7bf65d3b4b025f71f8d06a66ac914ba2d1340768c1c12df8"
} as const;

const currentSemanticHashes = {
  canonicalFull: semanticHash(catalog.vehicleDatabase),
  canonicalCommercial: semanticHash(
    catalog.vehicleDatabase.map(commercialVehicleProjection)
  ),
  publicCommercial: semanticHash(
    catalog.engineCatalog.map(commercialVehicleProjection)
  ),
  publicRoutes: semanticHash(sitemapRouteKeys),
  serviceDefinitions: semanticHash(serviceOptions),
  rdwMatcher: semanticHash(String(catalog.findCatalogMatch))
} as const;

const semanticIntegrityFailures = Object.entries(productionSemanticBaseline)
  .filter(
    ([key, expected]) =>
      currentSemanticHashes[key as keyof typeof currentSemanticHashes] !== expected
  )
  .map(
    ([key, expected]) =>
      `${key}: expected ${expected}, received ${
        currentSemanticHashes[key as keyof typeof currentSemanticHashes]
      }`
  );

if (
  catalog.engineCatalog.length !== 24 ||
  catalog.vehicleDatabase.length !== 58_586 ||
  stageCount !== 175_758 ||
  sitemapUrlCount !== 291
) {
  semanticIntegrityFailures.push(
    `counts: public=${catalog.engineCatalog.length}, canonical=${catalog.vehicleDatabase.length}, stages=${stageCount}, sitemap=${sitemapUrlCount}`
  );
}

addIssue(
  "critical",
  "PRODUCTION_SEMANTIC_INTEGRITY",
  "Protected catalog values, routes, services and RDW matching must remain identical to production.",
  semanticIntegrityFailures
);

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

function statusLabel(status: string | undefined, fallback = "MANUAL_REVIEW") {
  return (status ?? fallback).replaceAll("-", "_").toUpperCase();
}

function transmissionStatusLabel(
  vehicle: (typeof catalog.engineCatalog)[number]
) {
  if (!vehicle.transmissionSupport) {
    return "AMBIGUOUS";
  }

  return vehicle.transmissionSupport.status === "manual-review"
    ? "AMBIGUOUS"
    : statusLabel(vehicle.transmissionSupport.status);
}

function tcuStatusLabel(vehicle: (typeof catalog.engineCatalog)[number]) {
  if (vehicle.gearbox === "Manual") {
    return "NOT_APPLICABLE";
  }

  return statusLabel(vehicle.tcuSupport?.status);
}

function serviceStatus(
  vehicle: (typeof catalog.engineCatalog)[number],
  optionId: string
) {
  return statusLabel(vehicle.serviceCompatibility?.[optionId]?.status);
}

function pricingMapping(
  vehicle: (typeof catalog.engineCatalog)[number]
) {
  return vehicle.stages
    .map((stage) => {
      const tier = pricing.getPricingTier(stage.pricingTier);
      const exact = Boolean(tier && tier.priceFrom === stage.price);
      return `${stage.name}: ${stage.pricingTier ?? "none"} (${exact ? "EXACT" : "REVIEW"})`;
    })
    .join("; ");
}

function vehiclePricingStatus(
  vehicle: (typeof catalog.engineCatalog)[number]
) {
  if (vehicle.stages.some((stage) => !stage.pricingTier)) {
    return "MISSING_TIER_MAPPING";
  }

  return "TECHNICAL_COMPLEXITY_REVIEW";
}

const compatibilityCounts = countBy(
  catalog.engineCatalog.flatMap((vehicle) =>
    Object.values(vehicle.serviceCompatibility ?? {}).map((entry) => entry.status)
  )
);
const engineIdentityCounts = countBy(
  catalog.engineCatalog.map((vehicle) => vehicle.engineIdentity?.status ?? "missing")
);
const ecuIdentityCounts = countBy(
  catalog.engineCatalog.map((vehicle) => vehicle.ecuSupport?.status ?? "missing")
);
const transmissionIdentityCounts = countBy(
  catalog.engineCatalog.map(
    (vehicle) => vehicle.transmissionSupport?.status ?? "missing"
  )
);
const tcuIdentityCounts = countBy(
  catalog.engineCatalog.map((vehicle) =>
    vehicle.gearbox === "Manual"
      ? "not-applicable"
      : vehicle.tcuSupport?.status ?? "missing"
  )
);

const technicalMatrixRows = catalog.engineCatalog
  .map(
    (vehicle) =>
      `| ${vehicle.brand} ${vehicle.model} | ${statusLabel(vehicle.engineIdentity?.status)} | ${statusLabel(vehicle.ecuSupport?.status)} | ${transmissionStatusLabel(vehicle)} / ${tcuStatusLabel(vehicle)} | ${serviceStatus(vehicle, "dpf")} | ${serviceStatus(vehicle, "adblue")} / ${serviceStatus(vehicle, "scr")} | ${serviceStatus(vehicle, "egr")} | ${serviceStatus(vehicle, "immo")} | ${serviceStatus(vehicle, "speed-limiter")} | ${serviceStatus(vehicle, "launch")} | ${serviceStatus(vehicle, "pops")} | ${serviceStatus(vehicle, "gearbox")} | ${vehiclePricingStatus(vehicle)} | ${statusLabel(vehicle.confidenceLevel)} |`
  )
  .join("\n");

const technicalVehicleDetails = catalog.engineCatalog
  .map((vehicle) => {
    const stageRows = vehicle.stages
      .map(
        (stage) =>
          `| ${stage.name} | ${stage.powerHp} hp | ${stage.torqueNm} Nm | EUR ${stage.price} | ${stage.pricingTier ?? "none"} |`
      )
      .join("\n");
    const compatibility = vehicle.options
      .map(
        (optionId) =>
          `\`${optionId}\`: ${serviceStatus(vehicle, optionId)}`
      )
      .join(", ");
    const provenanceStatus = vehicle.technicalEvidence?.sourceReference
      ? "ESTIMATED"
      : "MANUAL_REVIEW";

    return `### ${vehicle.brand} ${vehicle.model}

| Field | Current reviewed value |
| --- | --- |
| Public ID | \`${vehicle.id}\` |
| Source canonical ID | \`${vehicle.sourceCanonicalId ?? "missing"}\` |
| Generation / platform | ${vehicle.generation ?? "MANUAL_REVIEW"} / ${vehicle.platform ?? "MANUAL_REVIEW"} |
| Fuel / years | ${vehicle.fuel} / ${vehicle.yearRange} |
| Stock output | ${vehicle.stockPowerHp} hp / ${vehicle.stockTorqueNm} Nm |
| Current ECU label | ${vehicle.ecuType} |
| Current gearbox label | ${vehicle.gearbox ?? "MANUAL_REVIEW"} |
| Engine code status | ${statusLabel(vehicle.engineIdentity?.status)}${vehicle.engineIdentity?.engineCodes?.length ? ` (${vehicle.engineIdentity.engineCodes.join(", ")})` : ""} |
| ECU identity status | ${statusLabel(vehicle.ecuSupport?.status)} |
| Transmission identity status | ${transmissionStatusLabel(vehicle)} |
| TCU identity status | ${tcuStatusLabel(vehicle)} |
| confidenceLevel / verificationRequired | ${statusLabel(vehicle.confidenceLevel)} / ${String(vehicle.verificationRequired)} |
| Current service option IDs | ${vehicle.options.map((id) => `\`${id}\``).join(", ")} |
| Service compatibility | ${compatibility} |
| Image status | ${statusLabel(vehicle.imageStatus)} |
| Pricing tier mappings | ${pricingMapping(vehicle)} |
| Provenance status | ${provenanceStatus}: ${vehicle.technicalEvidence?.sourceType ?? "unknown"} / ${vehicle.technicalEvidence?.sourceReference ?? "missing"} |

| Stage | Tuned power | Tuned torque | Current price | Current tier |
| --- | ---: | ---: | ---: | --- |
${stageRows}`;
  })
  .join("\n\n");

const technicalReview = `# Curated Technical and Service Review

This report is generated by \`pnpm catalog:audit\` for the 24 intentionally public vehicles. It documents current evidence boundaries; it does not promote any technical claim to verified status.

## Status Policy

- **VERIFIED** requires dated, attributable manufacturer, official tool or workshop evidence.
- **SUPPORTED_FAMILY** identifies only a broad family already present in curated data.
- **ESTIMATED** is a catalog indication and not proof of the installed component.
- **AMBIGUOUS** means the broad transmission label cannot identify the exact installed variant.
- **MANUAL_REVIEW** requires vehicle-specific confirmation.
- **NOT_APPLICABLE** is hidden on curated customer pages.

## Compact 24-Vehicle Matrix

| Vehicle | Engine identity | ECU | Transmission/TCU | DPF | AdBlue/SCR | EGR | Immo | Vmax | Launch | Pops | TCU tune | Pricing status | Overall confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${technicalMatrixRows}

## Coverage Summary

- Engine identity: ${JSON.stringify(engineIdentityCounts)}
- ECU identity: ${JSON.stringify(ecuIdentityCounts)}
- Transmission identity: ${JSON.stringify(transmissionIdentityCounts)}
- TCU identity: ${JSON.stringify(tcuIdentityCounts)}
- Service compatibility: ${JSON.stringify(compatibilityCounts)}
- No exact ECU or TCU variant is marked VERIFIED.
- Internal/canonical provenance records explain where an estimate came from; they are not used as proof of exact control-unit support.

## Vehicle Details

${technicalVehicleDetails}

## Semantic Integrity Comparison

| Protected area | Production baseline | Current | Result |
| --- | --- | --- | --- |
${Object.entries(productionSemanticBaseline)
  .map(([key, expected]) => {
    const current = currentSemanticHashes[key as keyof typeof currentSemanticHashes];
    return `| ${key} | \`${expected}\` | \`${current}\` | ${current === expected ? "PASS" : "FAIL"} |`;
  })
  .join("\n")}

Protected counts: 24 public vehicles, 58,586 canonical vehicles, 175,758 canonical stage definitions and 291 sitemap URLs.
`;

type PricingReviewRow = {
  category:
    | "A. SAFE_CURRENT"
    | "B. MISSING_TIER_MAPPING"
    | "C. TECHNICAL_COMPLEXITY_REVIEW"
    | "D. OWNER_DECISION_REQUIRED";
  item: string;
  currentPrice: number;
  tier: string;
  exact: boolean;
  complexity: string;
  consistent: boolean;
  manualReview: boolean;
};

const stagePricingRows: PricingReviewRow[] = catalog.engineCatalog.flatMap(
  (vehicle) =>
    vehicle.stages.map((stage) => {
      const tier = pricing.getPricingTier(stage.pricingTier);
      const exact = Boolean(tier && tier.priceFrom === stage.price);
      const consistent = Boolean(
        stage.price > 0 && (!tier?.priceFrom || stage.price >= tier.priceFrom)
      );
      const category: PricingReviewRow["category"] = !stage.pricingTier
        ? "B. MISSING_TIER_MAPPING"
        : stage.name === "Stage 3+"
          ? "D. OWNER_DECISION_REQUIRED"
          : stage.name === "Stage 2"
            ? "C. TECHNICAL_COMPLEXITY_REVIEW"
            : exact
              ? "A. SAFE_CURRENT"
              : "C. TECHNICAL_COMPLEXITY_REVIEW";
      const complexity =
        stage.name === "Stage 1"
          ? "Access method and exact ECU remain unconfirmed; no access method is inferred."
          : stage.name === "Stage 2"
            ? "Hardware, condition, logging and access scope require confirmation."
            : "Custom turbo/fueling/drivetrain scope and access method require an owner quote.";

      return {
        category,
        item: `${vehicle.brand} ${vehicle.model} — ${stage.name}`,
        currentPrice: stage.price,
        tier: stage.pricingTier ?? "none",
        exact,
        complexity,
        consistent,
        manualReview: category !== "A. SAFE_CURRENT"
      };
    })
);

const servicePricingRows: PricingReviewRow[] = serviceOptions.map((option) => {
  const tier = pricing.getPricingTier(option.pricingTier);
  const exact = Boolean(tier && tier.priceFrom === option.price);

  return {
    category: option.pricingTier
      ? exact
        ? "A. SAFE_CURRENT"
        : "C. TECHNICAL_COMPLEXITY_REVIEW"
      : "B. MISSING_TIER_MAPPING",
    item: `Service — ${option.name}`,
    currentPrice: option.price,
    tier: option.pricingTier ?? "none",
    exact,
    complexity:
      option.id === "gearbox"
        ? "Exact transmission/TCU and service scope require confirmation."
        : "Diagnosis, legal/use-case and technical scope remain vehicle-specific.",
    consistent: Boolean(option.price > 0 && (!tier?.priceFrom || option.price >= tier.priceFrom)),
    manualReview: !option.pricingTier || !exact
  };
});

const allPricingRows = [...stagePricingRows, ...servicePricingRows];
const pricingSections = [
  "A. SAFE_CURRENT",
  "B. MISSING_TIER_MAPPING",
  "C. TECHNICAL_COMPLEXITY_REVIEW",
  "D. OWNER_DECISION_REQUIRED"
]
  .map((category) => {
    const rows = allPricingRows.filter((row) => row.category === category);
    return `## ${category}

| Vehicle / service | Current price | Current pricingTier | Exact mapping | Known technical/access complexity | Internally consistent | Manual commercial review |
| --- | ---: | --- | --- | --- | --- | --- |
${rows
  .map(
    (row) =>
      `| ${row.item} | EUR ${row.currentPrice} | ${row.tier} | ${row.exact ? "YES" : "NO"} | ${row.complexity} | ${row.consistent ? "YES" : "NO"} | ${row.manualReview ? "YES" : "NO"} |`
  )
  .join("\n") || "| None | - | - | - | - | - | - |"}`;
  })
  .join("\n\n");

const pricingReview = `# Curated Pricing Review

No public Stage or service price is changed by this review. Exact tier mapping means only that the current price equals the current centralized tier; it does not prove ECU/TCU access complexity.

${pricingSections}

## Suggested Pricing Structure for Owner Review

**PROPOSAL ONLY — NOT IMPLEMENTED**

Future owner-approved pricing may distinguish older OBD-access ECU work, bench-required ECU work, modern MG1/MD1, locked/unlock-required ECU work, standard DSG/TCU, complex TCU, custom Stage 2 and custom Stage 3+. No vehicle is assigned to any of those access categories without primary/tool/workshop evidence. Current effective prices remain unchanged.
`;

const report = `# Catalog Data Report

Generated from the current catalog sources by \`pnpm catalog:audit\`.

## Summary

| Metric | Count |
| --- | ---: |
| Curated vehicles used for static SEO | ${catalog.engineCatalog.length} |
| Newly published vehicles in Batch 1 | ${curatedVehiclePublications.length} |
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
| Client imports of canonical server catalog | ${clientImportsServerCatalog.length} |
| Curated technical profiles | ${curatedVehicleTechnicalProfiles.length} |

## Coverage

- Brands: ${brands.join(", ")}
- Fuel types: ${fuelTypes.join(", ")}
- Curated confidence levels: ${JSON.stringify(curatedConfidence)}
- Canonical database confidence levels: ${JSON.stringify(databaseConfidence)}
- Pricing tiers: ${pricing.pricingTiers.map((tier) => tier.id).join(", ")}
- Curated service compatibility: ${JSON.stringify(compatibilityCounts)}

## Critical Errors

${criticalIssues.length > 0 ? criticalIssues.map(issueMarkdown).join("\n") : "None."}

## Warnings

${warningIssues.length > 0 ? warningIssues.map(issueMarkdown).join("\n") : "None."}

## Recommended Next Additions

1. Manually verify the Batch 1 public records, prioritizing exact engine codes, ECU/TCU variants, drivetrain and production applicability.
2. Review the held BMW and VAG candidates in CURATED_BATCH_1_REVIEW.md before any later promotion; do not bulk-publish adjacent templates.
3. Replace shared placeholder photography with owned or licensed brand/model-family assets.
4. Assign remaining pricing tiers only after the workshop confirms the access method and service scope; keep current effective prices unchanged until then.

## Interpretation

The canonical selector/RDW database is deduplicated and structurally usable, but most records are template-generated estimates. Static SEO remains intentionally limited to the curated catalog. Do not publish every generated year record as a separate SEO page or treat estimated ECU/stage metadata as verified support.
`;

const reportPath = resolve(process.cwd(), "CATALOG_DATA_REPORT.md");
writeFileSync(reportPath, report, "utf8");
const technicalReviewPath = resolve(
  process.cwd(),
  "CURATED_TECHNICAL_SERVICE_REVIEW.md"
);
writeFileSync(technicalReviewPath, technicalReview, "utf8");
const pricingReviewPath = resolve(process.cwd(), "CURATED_PRICING_REVIEW.md");
writeFileSync(pricingReviewPath, pricingReview, "utf8");

console.log("NoordTune catalog data audit");
console.log(`  Curated SEO vehicles: ${catalog.engineCatalog.length}`);
console.log(`  Batch 1 published vehicles: ${curatedVehiclePublications.length}`);
console.log(`  Canonical selector/RDW vehicles: ${catalog.vehicleDatabase.length}`);
console.log(`  Stage definitions: ${stageCount}`);
console.log(`  Localized stage SEO pages: ${sitemapStagePageCount}`);
console.log(`  Sitemap URLs: ${sitemapUrlCount}`);
console.log(`  Brands: ${brands.length}`);
console.log(`  Critical issue groups: ${criticalIssues.length}`);
console.log(`  Warning groups: ${warningIssues.length}`);
console.log(`  Client imports server catalog: ${clientImportsServerCatalog.length}`);
console.log(`  Curated technical profiles: ${curatedVehicleTechnicalProfiles.length}`);
console.log(`  Service compatibility: ${JSON.stringify(compatibilityCounts)}`);

for (const issue of issues) {
  issueConsole(issue);
}

console.log(`  Report: ${reportPath}`);
console.log(`  Technical review: ${technicalReviewPath}`);
console.log(`  Pricing review: ${pricingReviewPath}`);

if (criticalIssues.length > 0) {
  process.exitCode = 1;
}

/* eslint-disable @typescript-eslint/no-require-imports */
// Read historical Git blobs in memory: no checkout, worktree, temporary repository or source edit.
{
const fs = require("node:fs") as typeof import("node:fs");
const path = require("node:path") as typeof import("node:path");
const {execFileSync} = require("node:child_process") as typeof import("node:child_process");
const ts = require("typescript") as typeof import("typescript");
const currentCatalog = require("../src/data/catalog.ts") as typeof import("../src/data/catalog");
const currentPricing = require("../src/data/pricing.ts") as typeof import("../src/data/pricing");
const estimates = require("../src/data/tuning-estimates.ts") as typeof import("../src/data/tuning-estimates");
const adapters = require("../src/data/tuning-estimates-shared.ts") as typeof import("../src/data/tuning-estimates-shared");
const BASELINE = "4d12e510953fb57c3f8f84a737880ff860a617e7";
const RESTRICTIVE = "b19a1c21ab53f505476723519d6feeaca9b74916";
const loaded = new Map<string, {exports: unknown}>();

function revisionModule(sha: string, relativeFile: string): unknown {
  const file = relativeFile.replace(/\\/g, "/");
  const key = `${sha}:${file}`;
  const cached = loaded.get(key);
  if (cached) return cached.exports;
  const source = execFileSync("git", ["show", key], {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]});
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
  const revisionExports = {exports: {} as unknown};
  loaded.set(key, revisionExports);
  const revisionRequire = (specifier: string) => {
    if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return require(specifier);
    const resolved = specifier.startsWith("@/") ? `src/${specifier.slice(2)}` : path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
    return revisionModule(sha, /\.[cm]?[jt]sx?$/.test(resolved) ? resolved : `${resolved}.ts`);
  };
  new Function("require", "module", "exports", compiled)(revisionRequire, revisionExports, revisionExports.exports);
  return revisionExports.exports;
}
const baseline = revisionModule(BASELINE, "src/data/catalog.ts") as typeof currentCatalog;
const restrictive = revisionModule(RESTRICTIVE, "src/data/catalog.ts") as typeof currentCatalog;
const priorPricing = revisionModule(RESTRICTIVE, "src/data/pricing.ts") as typeof currentPricing;
const ccScopes: Record<string, number> = {
  "bmw-1-series-f20-f21-118i": 1499, "bmw-1-series-f20-f21-118d": 1995,
  "bmw-1-series-f20-f21-120d": 1995, "bmw-3-series-f30-f31-318d": 1995,
  "bmw-3-series-f30-f31-330d": 2993, "bmw-5-series-f10-f11-520d": 1995,
  "bmw-3-series-g20-g21-320i": 1998
};
function peakState(vehicle: import("../src/data/catalog-shared").EngineVariant) {
  return {
    stockPowerHp: vehicle.stockPowerHp, stockTorqueNm: vehicle.stockTorqueNm,
    stages: vehicle.stages.map(stage => ({name: stage.name, powerHp: stage.powerHp, torqueNm: stage.torqueNm,
      numericAvailable: Number.isFinite(stage.powerHp) && Number.isFinite(stage.torqueNm), requirements: stage.requirements, packageItems: stage.packageItems}))
  };
}
const configurations = currentCatalog.engineCatalog.map(vehicle => {
  const original = baseline.engineCatalog.find(item => item.id === vehicle.id)!;
  const prior = restrictive.engineCatalog.find(item => item.id === vehicle.id)!;
  const profile = adapters.getCatalogEstimateProfile(vehicle);
  const category = currentPricing.draftVehiclePricingAssignments[vehicle.id];
  const syntheticInput = {
    make: vehicle.brand, model: `${vehicle.model} ${vehicle.generation ?? ""}`.trim(), fuel: vehicle.fuel,
    powerHp: vehicle.stockPowerHp,
    displacementCc: ccScopes[vehicle.id] ?? Math.round(Number(vehicle.engine.match(/\b(\d\.\d)/)?.[1]) * 1000),
    firstRegistrationYear: vehicle.years[Math.floor(vehicle.years.length / 2)]
  };
  const previousLookup = restrictive.findCatalogMatch(syntheticInput);
  const correctedLookup = estimates.resolveTuningEstimate(syntheticInput, currentCatalog.engineCatalog);
  return {
    id: vehicle.id, label: `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`,
    approvedBaseline: {...peakState(original), stages: original.stages.map(stage => ({...peakState(original).stages.find(item => item.name === stage.name), priceMode: "from", amountCents: Math.round(stage.price * 100)}))},
    previousLocal: {...peakState(prior), quotes: prior.stages.map(stage => ({stage: stage.name, quote: priorPricing.resolveStageQuote(prior, stage)})), lookup: {status: previousLookup.status, numericAvailable: Boolean(previousLookup.variant)}},
    correctedLocal: {...peakState(vehicle), quotes: profile.stages.map(stage => ({stage: stage.name, quote: currentPricing.resolveStageQuote(profile, stage)})), lookup: {status: correctedLookup.status, profileId: correctedLookup.profile?.id, numericAvailable: Boolean(correctedLookup.profile?.stages[0]?.powerHp)}},
    sourceFiguresRequirementsPackagesUnchanged: JSON.stringify(peakState(original)) === JSON.stringify(peakState(vehicle)),
    estimateProvenance: {publicationSource: vehicle.publicationSource, canonicalSourceId: vehicle.sourceCanonicalId, references: profile.sourceReferences, confidenceLevel: vehicle.confidenceLevel, conditionCodes: profile.conditionCodes},
    draftAssignment: category,
    ecuVerification: currentPricing.assessVehicleAccess(vehicle),
    scope: "Family starting price: least expensive applicable software configuration, not a universal plate-specific total.",
    limitations: [...profile.conditions, "Draft local commercial proposal, not final owner-approved production pricing. Hardware and advanced unlock excluded from ordinary software scopes."],
    remainingLimitationSummary: ["ECU/setup/hardware check", vehicle.publicationSource === "canonical-publication" ? "published generated estimate, not verified" : "existing family estimate, not a physical ECU identification",
      ...(vehicle.id === "bmw-1-series-f20-f21-118i" ? ["1499 cc scope; earlier 1598 cc excluded"] : []),
      ...(vehicle.id === "bmw-3-series-g20-g21-320i" ? ["source stock 270 Nm versus manufacturer 300 Nm; source/gains review"] : []),
      ...(!vehicle.gearbox ? ["transmission unspecified"] : [])].join("; "),
    syntheticCoverageInput: syntheticInput
  };
});
const report = {
  baselineSha: BASELINE, previousLocalSha: RESTRICTIVE, policyStatus: "draft-local-owner-review",
  publicVehicles: configurations.length,
  publicProfilesWithAllStagesNumeric: configurations.filter(item => item.correctedLocal.stages.every(stage => stage.numericAvailable)).length,
  publicProfilesWithAllStagesPriced: configurations.filter(item => item.correctedLocal.quotes.every(stage => stage.quote.kind === "from")).length,
  sourceFiguresRequirementsPackagesUnchanged: configurations.every(item => item.sourceFiguresRequirementsPackagesUnchanged),
  syntheticCoverageNote: "Synthetic model-specific coverage inputs test positive applicability. Their nominal displacement and midpoint registration year are test context, not facts about any owner's physical vehicle.",
  configurations,
  referenceScenarios: estimates.tuningReferenceProfiles.map(profile => ({id: profile.id, label: `${profile.brand} ${profile.model} ${profile.engine}`, stockPowerHp: profile.stockPowerHp, stockTorqueNm: profile.stockTorqueNm,
    stages: profile.stages.map(stage => ({stage: stage.name, powerHp: stage.powerHp, torqueNm: stage.torqueNm, quote: currentPricing.resolveStageQuote(profile, stage, {scope: "vehicle"})})),
    assignment: currentPricing.draftVehiclePricingAssignments[profile.id], sources: profile.sourceReferences, limitations: profile.conditions}))
};
const out = path.resolve("docs/tuning-qa");
fs.mkdirSync(out, {recursive: true});
fs.writeFileSync(path.join(out, "corrective-all24-before-after.json"), `${JSON.stringify(report, null, 2)}\n`);
function quoteText(quote: import("../src/data/pricing").QuoteResolution) {return quote.kind === "from" ? `€${quote.amountCents / 100}` : "request";}
const table = [
  "# All 24 public profiles: corrective local review", "", `Approved visual baseline: ${BASELINE}. Previous restrictive commit: ${RESTRICTIVE}.`, "",
  "Prices below are VAT-inclusive draft local proposals. Every public source peak, requirement and package item is preserved. Public pages retain existing Stage values; lookup estimates are now independently applicable while physical ECU identification remains pending.", "",
  "| Public configuration | Stock hp/Nm | Stage 1 / 2 / 3 hp,Nm (unchanged) | Baseline € S1/S2/S3 | Previous local S1/S2/S3 | Corrected draft S1/S2/S3 | Lookup numeric before→after | Category / ECU state | Provenance | Remaining limitations |",
  "|---|---:|---|---|---|---|---|---|---|---|",
  ...configurations.map(item => `| ${item.id} | ${item.correctedLocal.stockPowerHp}/${item.correctedLocal.stockTorqueNm} | ${item.correctedLocal.stages.map(stage => `${stage.powerHp},${stage.torqueNm}`).join(" / ")} | ${item.approvedBaseline.stages.map(stage => stage.amountCents / 100).join("/")} | ${item.previousLocal.quotes.map(stage => quoteText(stage.quote)).join("/")} | ${item.correctedLocal.quotes.map(stage => quoteText(stage.quote)).join("/")} | ${item.previousLocal.lookup.numericAvailable ? "yes" : "no"}→${item.correctedLocal.lookup.numericAvailable ? "yes" : "no"} | ${item.draftAssignment.category} / ${item.ecuVerification.status} | ${item.estimateProvenance.publicationSource === "canonical-publication" ? "Published canonical/generated estimate" : "Existing curated family estimate"} | ${item.remainingLimitationSummary} |`),
  "", "Full provenance, proposed category reasons, price scope and remaining limitations for every configuration are in corrective-all24-before-after.json.", ""
];
fs.writeFileSync(path.join(out, "corrective-all24-before-after.md"), table.join("\n"));
console.log(JSON.stringify({publicVehicles: report.publicVehicles, numericProfiles: report.publicProfilesWithAllStagesNumeric, pricedProfiles: report.publicProfilesWithAllStagesPriced,
  unchangedSources: report.sourceFiguresRequirementsPackagesUnchanged, numericLookupsBefore: configurations.filter(item => item.previousLocal.lookup.numericAvailable).length,
  numericLookupsAfter: configurations.filter(item => item.correctedLocal.lookup.numericAvailable).length}));
}

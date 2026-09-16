import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {existsSync, mkdirSync, writeFileSync} from "node:fs";
import {engineCatalog, vehicleDatabase} from "../src/data/catalog.ts";
import {serviceOptions, type EngineVariant} from "../src/data/catalog-shared.ts";
import {nominalEngineDisplacements} from "../src/data/catalog-matching.ts";
import {sourcedTuningProfiles, tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";
import type {SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import type {EstimateResolution} from "../src/data/tuning-estimates-shared.ts";
import {resolveLegacyRdwTuningEstimate, resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import {assessVehicleAccess, formatQuote, resolveStageQuote} from "../src/data/pricing.ts";
import {createLookupQuoteMessage} from "../src/lib/whatsapp.ts";
import {formatEstimatePower, formatEstimateTorque} from "../src/lib/estimate-copy.ts";
import {isVehicleServiceSelectable} from "../src/lib/vehicle-services.ts";

let assertions = 0;
const failures: string[] = [];
const check = (value: unknown, message: string) => { assertions++; if (!value) failures.push(message); };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const technicalKey = (p: SourcedTuningProfile) => JSON.stringify([normalize(p.brand), normalize(p.modelFamily), normalize(p.generation), p.engineFamily, p.fuel, p.displacementCc, p.stockPowerHp, p.stockTorqueNm]);
const publicEquivalent = (p: SourcedTuningProfile) => engineCatalog.some(v => normalize(v.brand) === normalize(p.brand) && v.fuel === p.fuel && Math.abs(v.stockPowerHp - p.stockPowerHp) <= 3 && (normalize(v.model).includes(normalize(p.modelFamily)) || normalize(p.modelFamily).includes(normalize(v.model))));
const profiles = [...new Map(sourcedTuningProfiles.map(p => [technicalKey(p), p])).values()];
const brandGroup = (brand: string) => ["kia", "hyundai"].includes(normalize(brand)) ? "Kia/Hyundai" : ["volkswagen", "audi", "seat", "skoda", "cupra"].includes(normalize(brand)) ? "VAG" : brand;
function fixture(p: SourcedTuningProfile): EstimateMatchInput {
  const year = Math.min(p.yearFrom + 1, p.yearTo ?? Number(p.retrievedAt.slice(0, 4)));
  const input: EstimateMatchInput = {make: p.brand, model: p.modelFamily + " " + p.engineMarketingName, fuel: p.fuel,
    displacementCc: p.displacementCc, powerHp: p.stockPowerHp, firstRegistrationYear: year,
    type: p.generation, variant: p.engineFamily, cylinders: p.cylinders};
  if (p.modelFamily === "Transit Connect" && p.engineFamily === "EcoBlue") {
    input.firstRegistrationYear = Math.max(2018, year);
    input.engineGenerationEvidence = {family: "ecoblue", sourceReference: "Synthetic fixture with explicit reviewed EcoBlue evidence, separate from the registration date."};
  }
  return input;
}
function coverage(result: EstimateResolution) { return result.coverageClass ?? (result.profile ? result.resolutionLevel === 4 ? "D" : "C" : "E"); }
const counts = () => ({A: 0, B: 0, C: 0, D: 0, E: 0});
type CoverageGroup = {identities: number; before: ReturnType<typeof counts>; after: ReturnType<typeof counts>};
const researchedGroups: Record<string, CoverageGroup> = {}, inventoryGroups: Record<string, CoverageGroup> = {};
function recordGroups(target: Record<string, CoverageGroup>, brand: string, model: string, prior: keyof ReturnType<typeof counts>, current: keyof ReturnType<typeof counts>) {
  const make = normalize(brand), groups = ["all-supported-ICE"];
  if (["ford", "bmw", "volkswagen", "audi", "seat", "skoda", "cupra", "kia", "hyundai", "mercedesbenz", "peugeot", "citroen", "opel", "renault"].includes(make)) groups.push("priority-European-research-brands");
  if (["Kia/Hyundai", "VAG", "Ford", "BMW", "Mercedes-Benz"].includes(brandGroup(brand))) groups.push(brandGroup(brand));
  if (["peugeot", "citroen", "dsautomobiles", "opel", "fiat", "alfaromeo", "jeep"].includes(make)) groups.push("PSA/Stellantis");
  if (/\b(?:Transit|Connect|Custom|Courier|Transporter|Multivan|Caravelle|Caddy|Vito|Sprinter|Expert|Traveller|Jumpy|SpaceTourer|Vivaro|ProAce|Boxer|Jumper|Movano|Trafic|Master|Ducato|Doblo)\b/i.test(model)) groups.push("vans-commercial");
  for (const key of groups) {
    const group = target[key] ??= {identities: 0, before: counts(), after: counts()};
    group.identities++; group.before[prior]++; group.after[current]++;
  }
}
const before = counts(), after = counts();
const perBrand: Record<string, {fixtures: number; sourced: number; nonPublic: number; before: ReturnType<typeof counts>; after: ReturnType<typeof counts>}> = {};
const rows: unknown[] = [], unresolved: unknown[] = [];
const canonicalBefore = createHash("sha256").update(JSON.stringify(vehicleDatabase)).digest("hex");
for (const source of profiles) {
  const input = fixture(source);
  const isolated = resolveRdwTuningEstimate(input, {sourcedProfiles: [source], references: [], publicVehicles: [], canonicalVehicles: []});
  check(isolated.profile?.id === source.id, source.id + ": source identity matches in isolation");
  const selected = isolated.profile!;
  const stage1 = selected.stages.find(s => s.name === "Stage 1")!;
  const stage2 = selected.stages.find(s => s.name === "Stage 2")!;
  const stage3 = selected.stages.find(s => s.name === "Stage 3+")!;
  check(stage1.powerHp === source.stage1.selectedPowerHp && stage1.torqueNm === source.stage1.selectedTorqueNm, source.id + ": consensus Stage 1 preserved");
  check(stage1.approximate === true && !stage1.powerRangeHp, source.id + ": one approximate sourced value");
  if (source.stage2) check(stage2.powerHp === source.stage2.selectedPowerHp && stage2.torqueNm === source.stage2.selectedTorqueNm, source.id + ": sourced Stage 2 preserved");
  if (!source.stage3) check(stage3.customHardware === true && !stage3.powerHp && !stage3.powerRangeHp && !stage3.torqueNm && !stage3.torqueRangeNm, source.id + ": no fabricated Stage 3");
  check(selected.gearbox === undefined && !selected.options.includes("gearbox"), source.id + ": no installed transmission inferred");
  check(!isVehicleServiceSelectable(selected, serviceOptions.find(o => o.id === "gearbox")!), source.id + ": no TCU eligibility");
  check(selected.ecuSupport?.status === "manual-review", source.id + ": ECU identification remains pending");
  check(selected.sourceReferences.every(s => Boolean(s.url && s.retrievedAt)), source.id + ": source metadata present");

  const prior = resolveLegacyRdwTuningEstimate(input), current = resolveRdwTuningEstimate(input);
  const oldClass = coverage(prior), newClass = coverage(current);
  before[oldClass]++; after[newClass]++;
  recordGroups(researchedGroups, source.brand, source.modelFamily, oldClass, newClass);
  const key = brandGroup(source.brand), stats = perBrand[key] ??= {fixtures: 0, sourced: 0, nonPublic: 0, before: counts(), after: counts()};
  stats.fixtures++; stats.before[oldClass]++; stats.after[newClass]++;
  const nonPublic = !publicEquivalent(source); if (nonPublic) stats.nonPublic++;
  if (current.profile?.provenance === "sourced-profile") stats.sourced++;
  else unresolved.push({sourceProfileId: source.id, input, after: newClass, reasons: current.reasonCodes});
  const actual = current.profile!;
  check(Boolean(actual), source.id + ": complete ICE retains estimate");
  const actualStage = actual.stages[0], quote = resolveStageQuote(actual, actualStage, {access: assessVehicleAccess(actual)});
  check(quote.kind === "from" && quote.amountCents > 0, source.id + ": ordinary Stage 1 numeric price");
  for (const locale of ["nl", "en", "pl"] as const) {
    const message = createLookupQuoteMessage({locale, plate: "SYNTHETIC", vehicle: input.make + " " + input.model, fuel: input.fuel,
      firstAdmissionYear: input.firstRegistrationYear, registeredPower: {value: input.powerHp!, unit: "PS"}, displacementCc: input.displacementCc,
      stage: actualStage.name, options: [], quote, access: assessVehicleAccess(actual), engine: actual.engine,
      estimateSource: actual.sourceConfidence, indicativeOutput: actualStage});
    check(message.includes(formatQuote(quote, locale)), source.id + "/" + locale + ": WhatsApp quote");
    check(message.includes(formatEstimatePower(actualStage, locale)), source.id + "/" + locale + ": WhatsApp power");
    if (actualStage.torqueNm || actualStage.torqueRangeNm) check(message.includes(formatEstimateTorque(actualStage, locale)), source.id + "/" + locale + ": WhatsApp torque");
    check(message.includes(String(input.firstRegistrationYear)), source.id + "/" + locale + ": admission year");
    check(!/undefined|NaN/.test(message), source.id + "/" + locale + ": no broken fields");
  }
  rows.push({sourceProfileId: source.id, input, nonPublic, isolatedSourceMatched: true, before: oldClass, after: newClass, selectedProfileId: actual.id,
    stages: actual.stages.map(s => ({name: s.name, powerHp: s.powerHp, torqueNm: s.torqueNm, powerRangeHp: s.powerRangeHp,
      customHardware: s.customHardware ?? false, provenance: s.provenance, sourceConfidence: s.sourceConfidence})), quote});
}
check(profiles.length >= 100, "At least 100 distinct sourced identities");
const nonPublicCount = Object.values(perBrand).reduce((sum, row) => sum + row.nonPublic, 0);
check(nonPublicCount >= 50, "At least 50 non-public identities");
for (const brand of ["Kia/Hyundai", "Ford", "BMW", "VAG"]) check((perBrand[brand]?.fixtures ?? 0) >= 25, "At least 25 distinct fixtures: " + brand);
const safety: {name: string; pass: boolean; reasons: string[]}[] = [];
function control(name: string, input: EstimateMatchInput, predicate: (r: EstimateResolution) => boolean) {
 const result = resolveRdwTuningEstimate(input); const pass = predicate(result); safety.push({name, pass, reasons: result.reasonCodes}); check(pass, name);
}
for (const source of ["Ford", "Kia", "BMW", "Volkswagen"].flatMap(brand => profiles.filter(p => p.brand === brand).slice(0, 3))) {
 const input = fixture(source);
 for (const [name, update] of [["wrong model", {model: "Unrelated Synthetic Model"}], ["wrong displacement", {displacementCc: 7777}], ["pre-generation", {firstRegistrationYear: 1980}], ["wrong stock power", {powerHp: 19}]] as const) {
  check(!matchSourcedProfile({...input, ...update}, [source]).profile, source.id + ": " + name + " rejects source");
 }
}
const ford: EstimateMatchInput = {make: "Ford", model: "Transit Connect", fuel: "Diesel", displacementCc: 1499, powerHp: 100, firstRegistrationYear: 2018};
control("Connect never borrows Transit/Custom", ford, r => !r.profile || r.profile.model.toLowerCase().includes("connect"));
control("wrong fuel cannot borrow diesel", {...ford, fuel: "Petrol"}, r => r.profile?.fuel !== "Diesel");
control("hybrid unsupported", {...ford, fuel: "Benzine / Elektriciteit"}, r => !r.profile && r.coverageClass === "E");
control("EV unsupported", {...ford, fuel: "Elektriciteit"}, r => !r.profile && r.coverageClass === "E");
control("LPG conversion unresolved", {...ford, fuel: "Benzine / LPG"}, r => !r.profile);
control("future year does not extend source scope", {...ford, firstRegistrationYear: 2040}, r => r.profile?.provenance !== "sourced-profile");
control("opaque type does not prove engine family", {...ford, type: "PU2", variant: "Z2GA1BFX"}, r => r.profile?.provenance !== "sourced-profile");
control("2016 EcoBlue label alone insufficient", {...ford, model: "Transit Connect EcoBlue", firstRegistrationYear: 2016}, r => r.profile?.provenance !== "sourced-profile");
control("generic fallback labelled, Stage 3 custom", {make: "Synthetic", model: "Unknown turbo diesel", fuel: "Diesel", displacementCc: 1900, powerHp: 120, firstRegistrationYear: 2010},
 r => r.coverageClass === "D" && r.profile?.stages[0].provenance === "generic-indicative" && r.profile.stages[2].customHardware === true);
control("naturally aspirated remains a conservative NA estimate", {make: "Synthetic", model: "Naturally aspirated petrol", fuel: "Petrol", displacementCc: 1600, powerHp: 100, firstRegistrationYear: 2010},
 r => r.coverageClass === "D" && r.profile?.stages[0].genericCategory === "naturally-aspirated" && (r.profile.stages[0].powerRangeHp?.[1] ?? 999) <= 115);

type CanonicalGroup = {vehicle: EngineVariant; years: Set<number>; copies: number};
const canonicalGroups = new Map<string, CanonicalGroup>();
for (const v of vehicleDatabase) {
  const key = JSON.stringify([normalize(v.brand), normalize(v.model), normalize(v.engine), v.fuel, v.stockPowerHp, v.stockTorqueNm]);
  const entry = canonicalGroups.get(key) ?? {vehicle: v, years: new Set<number>(), copies: 0};
  for (const year of v.years) entry.years.add(year);
  entry.copies++; canonicalGroups.set(key, entry);
}
const inventoryBefore = counts(), inventoryAfter = counts(), completeBefore = counts(), completeAfter = counts();
const inventoryByBrand: Record<string, {identities: number; rawYearCopies: number; completeTechnicalIdentity: number; unvalidatedGenerated: number; excludedCrossProducts: number; incompleteDisplacement: number; before: ReturnType<typeof counts>; after: ReturnType<typeof counts>}> = {};
const inventoryExclusions: Record<string, number> = {};
const backlog: {brand: string; model: string; engine: string; fuel: string; stockPowerHp: number; stockTorqueNm: number; yearFrom: number; yearTo: number; sourceCopies: number; coverageClass: string; flags: string[]; priority: number}[] = [];
const familyBacklog = new Map<string, {brand: string; family: string; unsourcedIdentities: number; completeIdentity: number; generatedCrossProduct: number}>();
// The runtime shortlist rejects other makes before any profile assessment.
// Preserve every possible candidate while avoiding repeated scans of unrelated makes.
const canonicalByMake = new Map<string, EngineVariant[]>();
for (const vehicle of vehicleDatabase) {
  const list = canonicalByMake.get(vehicle.brand) ?? [];
  list.push(vehicle); canonicalByMake.set(vehicle.brand, list);
}
let supportedIce = 0, incompleteDisplacement = 0, crossProducts = 0;
for (const entry of canonicalGroups.values()) {
 const v = entry.vehicle, years = [...entry.years].filter(Number.isInteger).sort((a, b) => a - b);
 if (!["Petrol", "Diesel"].includes(v.fuel)) { inventoryExclusions["unsupported-powertrain"] = (inventoryExclusions["unsupported-powertrain"] ?? 0) + 1; continue; }
 supportedIce++;
 const nominal = nominalEngineDisplacements(v.engine), modelNominal = nominalEngineDisplacements(v.model);
 const flags: string[] = ["GENERATED_SOURCE_APPLICABILITY_UNVALIDATED"];
 if (nominal.length !== 1) { flags.push("SOURCE_DISPLACEMENT_AMBIGUOUS"); incompleteDisplacement++; }
 if (nominal.length === 1 && modelNominal.length === 1 && Math.abs(nominal[0] - modelNominal[0]) > 49) flags.push("MODEL_ENGINE_DISPLACEMENT_CROSS_PRODUCT");
 if (v.fuel === "Petrol" && /\b(?:TDI|TDCi|CDI|dCi|HDi|CRDi|MultiJet)\b/i.test(v.model)) flags.push("MODEL_FUEL_CROSS_PRODUCT");
 if (v.fuel === "Diesel" && /\b(?:TSI|TFSI|EcoBoost|T-GDI|GTI)\b/i.test(v.model)) flags.push("MODEL_FUEL_CROSS_PRODUCT");
 const bmw = v.brand === "BMW" ? v.model.match(/\b([1-8])\s+Serie[s]?\s+(?:M)?([1-8])\d{2}[ide]\b/i) : null;
 if (bmw && bmw[1] !== bmw[2]) flags.push("MODEL_BADGE_SERIES_CROSS_PRODUCT");
 if (/Golf GTI 3\.0 TDI|Vito AMG|X3 125d|Z4 M340i|Clio RS 2\.0 dCi|Tucson N/.test(v.model)) flags.push("KNOWN_IMPLAUSIBLE_CROSS_PRODUCT");
 const crossProduct = flags.some(flag => /CROSS_PRODUCT/.test(flag));
 if (crossProduct) crossProducts++;
 const complete = nominal.length === 1 && !crossProduct;
 const year = years[Math.floor(years.length / 2)] ?? Number(v.yearRange.slice(0, 4));
 const input: EstimateMatchInput = {make: v.brand, model: v.model, fuel: v.fuel, powerHp: v.stockPowerHp,
   displacementCc: nominal.length === 1 ? nominal[0] : undefined, firstRegistrationYear: year};
 const sources = {canonicalVehicles: canonicalByMake.get(v.brand)};
 const previousResult = resolveLegacyRdwTuningEstimate(input, sources), currentResult = resolveRdwTuningEstimate(input, sources);
 if (supportedIce % 300 === 1) {
   check(JSON.stringify(resolveRdwTuningEstimate(input)) === JSON.stringify(currentResult), "Make partition preserves full-production result");
   check(JSON.stringify(resolveLegacyRdwTuningEstimate(input)) === JSON.stringify(previousResult), "Make partition preserves checkpoint result");
 }
 const prior = coverage(previousResult), current = coverage(currentResult);
 inventoryBefore[prior]++; inventoryAfter[current]++;
 recordGroups(inventoryGroups, v.brand, v.model, prior, current);
 if (complete) { completeBefore[prior]++; completeAfter[current]++; }
 const key = brandGroup(v.brand), stats = inventoryByBrand[key] ??= {identities: 0, rawYearCopies: 0, completeTechnicalIdentity: 0, unvalidatedGenerated: 0, excludedCrossProducts: 0, incompleteDisplacement: 0, before: counts(), after: counts()};
 stats.identities++; stats.rawYearCopies += entry.copies; stats.unvalidatedGenerated++; stats.before[prior]++; stats.after[current]++;
 if (complete) stats.completeTechnicalIdentity++;
 if (crossProduct) stats.excludedCrossProducts++;
 if (nominal.length !== 1) stats.incompleteDisplacement++;
 if (current === "C" || current === "D" || current === "E") {
   const priority = (complete ? 100 : crossProduct ? 0 : 20) + (["Ford", "Kia", "Hyundai", "BMW", "Volkswagen", "Audi", "Renault", "Peugeot", "Citroën", "Opel"].includes(v.brand) ? 20 : 0) + (/\b(?:Transit|Connect|Custom|Sportage|Ceed|Focus|Fiesta|Golf|Octavia|308|Expert|Jumpy|Vivaro|Trafic)\b/i.test(v.model) ? 10 : 0);
   backlog.push({brand: v.brand, model: v.model, engine: v.engine, fuel: v.fuel, stockPowerHp: v.stockPowerHp, stockTorqueNm: v.stockTorqueNm,
     yearFrom: years[0], yearTo: years.at(-1)!, sourceCopies: entry.copies, coverageClass: current, flags, priority});
   const family = v.model.replace(/\s+\d\.\d.*$/, ""), familyKey = v.brand + "|" + family;
   const familyRow = familyBacklog.get(familyKey) ?? {brand: v.brand, family, unsourcedIdentities: 0, completeIdentity: 0, generatedCrossProduct: 0};
   familyRow.unsourcedIdentities++; if (complete) familyRow.completeIdentity++; if (crossProduct) familyRow.generatedCrossProduct++;
   familyBacklog.set(familyKey, familyRow);
 }
}
backlog.sort((a, b) => b.priority - a.priority || a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model) || a.stockPowerHp - b.stockPowerHp);
const exhaustiveCanonicalCohort = {
 method: "Every distinct canonical make/model/engine/fuel/stock-power/stock-torque identity, with year copies collapsed and their complete source year band retained. The median source year is a deterministic regression context, not a real first registration.",
 optimisation: "Canonical candidates are partitioned by the same exact make required by the runtime shortlist; all other source sets remain complete. Periodic full-production comparisons verify identical results.",
 limitation: "Generated templates are not independently validated factory configurations or a representative vehicle fleet. All are measured, but known cross-products and missing displacement are separately excluded from the complete-identity coverage denominator.",
 rawRows: vehicleDatabase.length, distinctIdentities: canonicalGroups.size, supportedIce, incompleteDisplacement, knownCrossProducts: crossProducts, unsupported: inventoryExclusions,
 before: inventoryBefore, after: inventoryAfter, completeIdentityBefore: completeBefore, completeIdentityAfter: completeAfter, perBrand: inventoryByBrand,
 requestedGroups: inventoryGroups,
 rankedBacklog: backlog, backlogByFamily: [...familyBacklog.values()].sort((a, b) => b.completeIdentity - a.completeIdentity || b.unsourcedIdentities - a.unsourcedIdentities)
};
check(Object.values(inventoryAfter).reduce((sum, value) => sum + value, 0) === supportedIce, "Exhaustive canonical denominator closes");

check(createHash("sha256").update(JSON.stringify(vehicleDatabase)).digest("hex") === canonicalBefore, "Canonical source unchanged");
check(engineCatalog.length === 24, "Public catalog remains 24");
const distinctCanonical = new Set(vehicleDatabase.map(v => JSON.stringify([normalize(v.brand), normalize(v.model), normalize(v.engine), v.fuel, v.stockPowerHp, v.stockTorqueNm]))).size;
const report = {schemaVersion: 1, fixtureNature: "Synthetic source-derived technical identities, not live RDW outcomes. Nominal source displacement is explicitly retained. No real plates or owners.",
 datasetFingerprint: tuningDatasetFingerprint, assertions, fixtureCount: rows.length, nonPublicFixtureCount: nonPublicCount,
 scope: {rawCanonicalCount: vehicleDatabase.length, distinctCanonicalTechnicalIdentities: distinctCanonical,
 distinctSourcedTechnicalIdentities: profiles.length, publicCatalogCount: engineCatalog.length,
 canonicalBacklog: "All distinct canonical identities are measured in exhaustiveCanonicalCohort; generated templates remain unvalidated. Raw year copies are excluded from distinct coverage denominators."},
 before, after, perBrand, requestedGroups: researchedGroups,
 groupMethod: "Groups overlap. Priority brands are the explicitly targeted European/NL research brands, not an invented fleet ranking. Vans use explicit commercial model names. PSA/Stellantis includes Peugeot, Citroen, DS, Opel, Fiat, Alfa Romeo and Jeep; Toyota commercial applications are counted under vans.",
 unresolved, safety, failures, exhaustiveCanonicalCohort, fixtures: rows};
mkdirSync("data/research", {recursive: true});
const outputIndex=process.argv.indexOf("--output");
writeFileSync(outputIndex>=0?process.argv[outputIndex+1]:existsSync("data/research/v3-1-reviewed-promotions.json")?"data/research/v3-1-coverage-report.json":existsSync("data/research/v2-consensus-checkpoint.json")?"data/research/v3-coverage-report.json":"data/research/coverage-report.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({assertions, fixtures: rows.length, nonPublic: nonPublicCount, before, after, unresolved: unresolved.length, safety: safety.length, canonical: {identities: canonicalGroups.size, before: inventoryBefore, after: inventoryAfter, completeTechnicalAfter: completeAfter, knownCrossProducts: crossProducts, incompleteDisplacement}, failures: failures.slice(0, 15)}, null, 2));
assert.equal(failures.length, 0, failures.slice(0, 30).join("\n"));

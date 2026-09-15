import assert from "node:assert/strict";
import {engineCatalog} from "../src/data/catalog.ts";
import {getCatalogEstimateProfile, type TuningEstimateProfile} from "../src/data/tuning-estimates-shared.ts";
import {tuningReferenceProfiles, type EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import type {SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";
import {assessVehicleAccess, resolveStageQuote} from "../src/data/pricing.ts";
import {resolveRdwTuningEstimate, resolveSourcedPricingProfileId} from "../src/lib/rdw-tuning-estimate.ts";

let checks = 0;
function equal(actual: unknown, expected: unknown, message: string) { assert.deepEqual(actual, expected, message); checks++; }
const capacities: Record<string, number> = {
  "vw-golf-20-tsi-ea888": 1984, "bmw-320d-b47": 1995, "audi-a3-20-tdi": 1968,
  "mercedes-a45-amg-m133": 1991, "bmw-x3-e83-20d": 1995, "volvo-xc60-d5": 2400,
  "ford-focus-st-20-ecoboost": 1999, "bmw-1-series-f20-f21-118i": 1499,
  "bmw-1-series-f20-f21-118d": 1995, "bmw-1-series-f20-f21-120d": 1995,
  "bmw-3-series-f30-f31-318d": 1995, "bmw-3-series-f30-f31-330d": 2993,
  "bmw-5-series-f10-f11-520d": 1995, "bmw-3-series-g20-g21-320i": 1998,
  "volkswagen-golf-7-16-tdi": 1598, "volkswagen-golf-7-20-tdi": 1968,
  "volkswagen-golf-7-r-20-tsi": 1984, "volkswagen-passat-b8-20-tdi": 1968,
  "audi-a3-8v-16-tdi": 1598, "audi-a4-b9-20-tdi-190": 1968, "audi-a4-b9-20-tfsi": 1984,
  "audi-a6-c7-30-tdi-272": 2967, "skoda-octavia-5e-20-tdi-150": 1968,
  "seat-leon-cupra-5f-20-tsi-300": 1984, "ref-bmw-128ti-f40-265": 1998,
  "ref-ford-transit-custom-20-ecoblue-105": 1995, "ref-ford-transit-connect-15-tdci-100": 1499
};
const trusted = [...engineCatalog.map(getCatalogEstimateProfile), ...tuningReferenceProfiles];
const original = JSON.stringify([engineCatalog, tuningReferenceProfiles, sourcedTuningProfiles]);
const syntheticBmwFamilies: Record<string, string> = {
  "ref-bmw-128ti-f40-265": "B48", "bmw-1-series-f20-f21-118i": "B38",
  "bmw-1-series-f20-f21-118d": "B47", "bmw-1-series-f20-f21-120d": "B47",
  "bmw-3-series-f30-f31-318d": "B47", "bmw-3-series-f30-f31-330d": "N57",
  "bmw-5-series-f10-f11-520d": "B47", "bmw-3-series-g20-g21-320i": "B48"
};

// Synthetic counterparts test the provenance transition for each existing
// assignment, including configurations not yet covered by fetched source pages.
function counterpart(profile: TuningEstimateProfile): SourcedTuningProfile {
  const range = profile.yearRange.match(/\d{4}/g)!.map(Number);
  const family = syntheticBmwFamilies[profile.id]
    ?? (/EcoBlue/i.test(profile.engine) ? "EcoBlue" : /TDCi/i.test(profile.engine) ? "TDCi" : undefined);
  return {...sourcedTuningProfiles[0], id: "synthetic-counterpart-" + profile.id,
    brand: profile.brand, modelFamily: profile.model, engineMarketingName: profile.engine,
    generation: profile.generation!, aliases: [], engineFamily: family, engineCodes: undefined,
    fuel: profile.fuel as "Petrol" | "Diesel", displacementCc: capacities[profile.id], displacementPrecision: "exact",
    stockPowerHp: profile.stockPowerHp, stockTorqueNm: profile.stockTorqueNm,
    yearFrom: range[0], yearTo: range[1], electrification: "none", cylinders: undefined,
    gearbox: undefined, ecuFamily: undefined, conditions: [], reviewStatus: "source-reviewed", ownerReviewRequired: false,
    stage1: {...sourcedTuningProfiles[0].stage1, selectedPowerHp: profile.stages[0].powerHp! + 7,
      selectedTorqueNm: profile.stages[0].torqueNm! + 9, conditions: []}, stage2: undefined, stage3: undefined};
}
equal(trusted.length, 27, "the bridge is bounded to 24 public plus three reference assignments");
for (const profile of trusted) {
  const source = counterpart(profile);
  const input: EstimateMatchInput = {make: profile.brand, model: profile.model + " " + profile.engine,
    fuel: profile.fuel, powerHp: profile.stockPowerHp, displacementCc: capacities[profile.id],
    firstRegistrationYear: Math.floor((source.yearFrom + source.yearTo!) / 2), type: profile.generation};
  const pricingProfileId = resolveSourcedPricingProfileId(input, source);
  equal(pricingProfileId, profile.id, profile.id + " keeps its reviewed commercial assignment");
  const runtime = resolveRdwTuningEstimate(input, {sourcedProfiles: [source], references: [], publicVehicles: [], canonicalVehicles: []});
  equal(runtime.profile?.pricingProfileId, profile.id, profile.id + " survives the sourced DTO boundary");
  equal(runtime.profile?.id, source.id, profile.id + " source ID remains separate");
  equal([runtime.profile?.stages[0].powerHp, runtime.profile?.stages[0].torqueNm],
    [source.stage1.selectedPowerHp, source.stage1.selectedTorqueNm], profile.id + " changed technical source outputs remain selected");
  equal(runtime.profile?.vehicleId, undefined, profile.id + " commercial link does not become an SEO link");
  for (const scope of ["family", "vehicle"] as const) {
    const commercialDto = {id: source.id, pricingProfileId, brand: source.brand,
      model: source.modelFamily, engine: source.engineMarketingName, generation: source.generation,
      ecuType: "To be identified"};
    equal(resolveStageQuote(commercialDto, {name: "Stage 1"}, {scope}),
      resolveStageQuote(profile, {name: "Stage 1"}, {scope}), profile.id + " price remains identical in " + scope + " scope");
  }
  for (const [label, changed] of [
    ["manufacturer", {...input, make: "Unrelated brand"}], ["model", {...input, model: "Unrelated model"}],
    ["fuel", {...input, fuel: profile.fuel === "Diesel" ? "Petrol" : "Diesel"}],
    ["capacity", {...input, displacementCc: capacities[profile.id] + 400}],
    ["power", {...input, powerHp: profile.stockPowerHp + 30}],
    ["year", {...input, firstRegistrationYear: source.yearTo! + 1}],
    ["missing year", {...input, firstRegistrationYear: undefined}]
  ] as const) equal(resolveSourcedPricingProfileId(changed, source), undefined, profile.id + " rejects wrong " + label);
}

const connect = sourcedTuningProfiles.find(p => p.brand === "Ford" && p.modelFamily === "Transit Connect" && p.engineFamily === "TDCi" && p.stockPowerHp === 100)!;
const bmw = sourcedTuningProfiles.find(p => p.brand === "BMW" && p.modelFamily === "3 Series" && p.engineFamily === "B47" && p.stockPowerHp === 190 && p.generation.startsWith("F30"))!;
const custom = sourcedTuningProfiles.find(p => p.brand === "Ford" && p.modelFamily === "Transit Custom" && p.stockPowerHp === 105)!;
const concrete: [SourcedTuningProfile, EstimateMatchInput, string, number, number][] = [
  [connect, {make: "Ford", model: "Transit Connect 1.5 TDCi", fuel: "Diesel", powerHp: 100, displacementCc: 1499, firstRegistrationYear: 2017}, "ref-ford-transit-connect-15-tdci-100", 44900, 44900],
  [bmw, {make: "BMW", model: "320d", fuel: "Diesel", powerHp: 190, displacementCc: 1995, firstRegistrationYear: 2017}, "bmw-320d-b47", 44900, 70000],
  [custom, {make: "Ford", model: "Transit Custom", fuel: "Diesel", registeredPower: {value: 77, unit: "kW"}, displacementCc: 1995, firstRegistrationYear: 2019}, "ref-ford-transit-custom-20-ecoblue-105", 54900, 54900]
];
for (const [source, input, pricingId, familyCents, vehicleCents] of concrete) {
  const result = resolveRdwTuningEstimate(input);
  equal(result.profile?.id, source.id, pricingId + " keeps selected sourced identity");
  equal(result.profile?.pricingProfileId, pricingId, pricingId + " runtime bridge");
  equal(result.profile?.provenance, "sourced-profile", pricingId + " keeps sourced provenance");
  equal(result.profile?.vehicleId, undefined, pricingId + " does not invent a public page");
  equal([result.profile?.stages[0].powerHp, result.profile?.stages[0].torqueNm],
    [source.stage1.selectedPowerHp, source.stage1.selectedTorqueNm], pricingId + " keeps source output");
  equal(result.profile?.ecuSupport?.status, "manual-review", pricingId + " ECU stays unconfirmed");
  equal(result.profile?.gearbox, undefined, pricingId + " transmission stays unidentified");
  for (const [scope, amountCents] of [["family", familyCents], ["vehicle", vehicleCents]] as const) {
    const quote = resolveStageQuote(result.profile, result.profile?.stages[0], {scope});
    equal(quote.kind === "from" ? quote.amountCents : undefined, amountCents, pricingId + " explicit " + scope + " quote");
  }
  equal(resolveStageQuote(result.profile, result.profile?.stages[2]).kind, "on-request", "commercial bridge cannot approve custom hardware");
}
const connectInput = concrete[0][1];
const bmwInput = concrete[1][1];
equal(resolveSourcedPricingProfileId({...connectInput, firstRegistrationYear: 2019}, connect), undefined, "later source scope cannot extend retained TDCi commercial years");
equal(resolveSourcedPricingProfileId({...connectInput, model: "Transit Custom 1.5 TDCi"}, connect), undefined, "Connect cannot inherit Custom assignment");
equal(resolveSourcedPricingProfileId({...connectInput, model: "Transit Connect 1.5 EcoBlue"}, {...connect, engineFamily: "EcoBlue", engineMarketingName: "1.5 EcoBlue", conditions: []}), undefined, "EcoBlue cannot inherit same-output TDCi assignment");
equal(resolveSourcedPricingProfileId({...connectInput, model: "Transit Connect"}, connect), undefined, "opaque Connect identity does not prove TDCi");
equal(resolveSourcedPricingProfileId(bmwInput, {...bmw, engineFamily: "N47"}), undefined, "a different BMW engine family cannot inherit B47 pricing");
equal(resolveSourcedPricingProfileId(bmwInput, {...bmw, generation: "G20/G21"}), undefined, "same badge and stock output cannot cross BMW generations");
equal(resolveSourcedPricingProfileId({...bmwInput, type: "G20"}, bmw), undefined, "documented RDW generation conflict cannot inherit public pricing");
equal(resolveSourcedPricingProfileId(bmwInput, {...bmw, generation: "Unknown"}), undefined, "unknown source generation cannot inherit explicit assignment");
const coarse118d = trusted.find(profile => profile.id === "bmw-1-series-f20-f21-118d")!;
const source118d = counterpart(coarse118d);
const input118d: EstimateMatchInput = {make: "BMW", model: "118d", fuel: "Diesel", powerHp: 150, displacementCc: 1995, firstRegistrationYear: 2017};
equal(resolveSourcedPricingProfileId(input118d, {...source118d, engineFamily: "N47"}), undefined, "coarse old label does not allow a conflicting source engine family");
equal(resolveSourcedPricingProfileId(input118d, {...source118d, engineFamily: undefined}), undefined, "coarse old label needs a reviewed source engine family");
equal(assessVehicleAccess(resolveRdwTuningEstimate(bmwInput).profile).status, "possible-unlock-review", "BMW quote scope raises review, not ECU certainty");
equal(JSON.stringify([engineCatalog, tuningReferenceProfiles, sourcedTuningProfiles]), original, "all technical source and public data remain untouched");
console.log("PASS sourced commercial pricing bridge: " + checks + " assertions; 27 assignments, live-source regressions and identity conflicts.");

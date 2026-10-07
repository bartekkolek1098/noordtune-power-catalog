import assert from "node:assert/strict";
import {engineCatalog} from "../src/data/catalog.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {getComparableSourceStage1} from "../src/lib/rdw-source-comparison.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";

const fixture: EstimateMatchInput = {
  make: "BMW", model: "118I", fuel: "Benzine",
  displacementCc: 1499, registeredPower: {value: 100, unit: "kW"},
  firstRegistrationDate: "2021-06-18", firstRegistrationYear: 2021,
  type: "F1H", variant: "7K31", execution: "IAW508LG",
  cylinders: 3
};
const result = resolveRdwTuningEstimate(fixture);
assert.equal(result.coverageClass, "B");
assert.equal(result.profile?.generation, "F40");
assert.equal(result.profile?.id, "rdw-bmw-118i-f40-136");
assert.ok(!result.profile?.model.includes("F20"));
const stages = customerProfile(result.profile!).stages;
assert.deepEqual(stages.map(s => s.name), ["Stage 1", "Stage 2"]);
assert.deepEqual(stages[0].powerRangeHp, [165, 180]);
assert.deepEqual(stages[0].torqueRangeNm, [278, 280]);
assert.equal(stages[0].quoteRequired, true);
assert.equal(stages[1].powerHp, undefined);
assert.equal(stages[1].torqueNm, undefined);
assert.equal(stages[1].powerRangeHp, undefined);
assert.equal(stages[1].torqueRangeNm, undefined);
assert.equal(resolveStageQuote(result.profile, stages[0]).kind, "on-request");

const normalized = normalizeRdwVehicle({
  merk: "BMW", handelsbenaming: "118I", cilinderinhoud: "1499",
  aantal_cilinders: "3", datum_eerste_toelating_dt: "2021-06-18T00:00:00.000",
  type: "F1H", variant: "7K31", uitvoering: "IAW508LG"
}, [{brandstof_omschrijving: "Benzine", nettomaximumvermogen: "100"}], "SYN118");
assert.equal(normalized.vehicle.engine.powerHp, 136);
assert.equal(normalized.tuningEstimate.profile?.generation, "F40");
assert.deepEqual(normalized.tuningEstimate.profile?.stages[0].powerRangeHp, [165, 180]);

for (const [label, change] of [
  ["F20 explicit generation", {type: "F20", variant: ""}],
  ["F21 explicit generation", {model: "118i F21"}],
  ["wrong stock power", {registeredPower: {value: 103, unit: "kW"}}],
  ["wrong cc", {displacementCc: 1598}],
  ["wrong cylinders", {cylinders: 4}],
  ["contradictory admission dates", {firstRegistrationDate: "2018-06-18"}],
  ["invalid admission date", {firstRegistrationYear: undefined, firstRegistrationDate: "2021-02-30"}],
  ["wrong model", {model: "120i"}],
  ["wrong fuel", {fuel: "Diesel"}],
  ["before F40 scope", {firstRegistrationYear: 2018, firstRegistrationDate: "2018-06-18"}],
  ["after F40 scope", {firstRegistrationYear: 2025, firstRegistrationDate: "2025-06-18"}],
  ["different make", {make: "MINI"}]
] as const) {
  const other = resolveRdwTuningEstimate({...fixture, ...change});
  assert.notEqual(other.profile?.id, "rdw-bmw-118i-f40-136", label);
  if (label === "F20 explicit generation" || label === "F21 explicit generation" || label === "after F40 scope") {
    assert.notEqual(other.profile?.id, "bmw-1-series-f20-f21-118i", label + " must not borrow older profile");
  }
}

const crossGeneration = resolveRdwTuningEstimate({...fixture, type: "", variant: ""}, {
  references: [], sourcedProfiles: [], canonicalVehicles: [], publicVehicles: engineCatalog
});
assert.equal(crossGeneration.profile?.generation, "F40", "unverified F20 public source must not mask the newer matched application");

// Global year-scope safety: no published profile may be borrowed after its listed period.
for (const publicVehicle of engineCatalog) {
  const year = Math.max(...publicVehicle.years) + 5;
  const generic: EstimateMatchInput = {
    make: publicVehicle.brand, model: publicVehicle.model, fuel: publicVehicle.fuel,
    powerHp: publicVehicle.stockPowerHp,
    firstRegistrationYear: year
  };
  const resolution = resolveRdwTuningEstimate(generic, {
    references: [], sourcedProfiles: [], canonicalVehicles: [], publicVehicles: [publicVehicle]
  });
  assert.notEqual(resolution.profile?.id, publicVehicle.id, publicVehicle.id + " out-of-scope year");
}

// Gas-only Caddy must never inherit a petrol-only TSI target. These RDW values are
// synthetic equivalents of a public technical configuration, never a real plate.
const gasInput: EstimateMatchInput = {
  make: "Volkswagen", model: "CADDY", fuel: "CNG",
  registeredPower: {value: 81, unit: "kW"}, displacementCc: 1395,
  firstRegistrationDate: "2019-06-25", firstRegistrationYear: 2019,
  type: "2KN", variant: "BBCPWAX0", cylinders: 4
};
const cng = resolveRdwTuningEstimate(gasInput);
assert.equal(cng.profile?.id, "rdw-vw-caddy-iv-14-tgi-cng-110");
assert.equal(cng.profile?.fuel, "CNG");
assert.equal(cng.profile?.generation, "IV (2K facelift, 2015–2020)");
assert.deepEqual(customerProfile(cng.profile!).stages.map(s=>s.name), ["Stage 1","Stage 2"]);
assert.deepEqual(customerProfile(cng.profile!).stages[0].powerRangeHp, [135, 140]);
assert.deepEqual(customerProfile(cng.profile!).stages[0].torqueRangeNm, [240, 250]);
assert.equal(customerProfile(cng.profile!).stages[0].quoteRequired, true);
assert.equal(customerProfile(cng.profile!).stages[1].powerHp, undefined);
assert.equal(resolveStageQuote(cng.profile, cng.profile!.stages[0]).kind, "on-request");

const normalizedCng = normalizeRdwVehicle({
  merk: "VOLKSWAGEN", handelsbenaming: "CADDY", voertuigsoort: "Bedrijfsauto",
  inrichting: "gesloten opbouw", type: "2KN", variant: "BBCPWAX0",
  aantal_cilinders: "4", cilinderinhoud: "1395", aantal_zitplaatsen: "2",
  massa_ledig_voertuig: "1564", massa_rijklaar: "1664",
  lengte: "488", breedte: "179", hoogte_voertuig: "184", wielbasis: "301",
  laadvermogen: "500", toegestane_maximum_massa_voertuig: "2064",
  aanhangwagen_middenas_geremd: "1300", maximum_massa_trekken_ongeremd: "750",
  type_gasinstallatie: "Af-fabriek gasinstallatie", europese_voertuigcategorie: "N1",
  datum_eerste_toelating_dt: "2019-06-25T00:00:00.000",
  datum_eerste_tenaamstelling_in_nederland_dt: "2019-06-25T00:00:00.000",
  vervaldatum_apk_dt: "2026-09-29T00:00:00.000"
}, [{brandstof_omschrijving:"CNG",nettomaximumvermogen:"81",co2_uitstoot_gecombineerd:"119",emissiecode_omschrijving:"6"}], "SYN-GAS");
assert.equal(normalizedCng.vehicle.fuel, "CNG");
assert.equal(normalizedCng.vehicle.registration.firstAdmissionYear, 2019);
assert.equal(normalizedCng.vehicle.weights.payloadKg, 500);
assert.equal(normalizedCng.vehicle.weights.brakedTrailerKg, 1300);
assert.equal(normalizedCng.vehicle.dimensions.wheelbaseCm, 301);
assert.equal(normalizedCng.vehicle.approval.gasInstallationType, "Af-fabriek gasinstallatie");
assert.equal(normalizedCng.tuningEstimate.profile?.id, "rdw-vw-caddy-iv-14-tgi-cng-110");
assert.deepEqual(normalizedCng.tuningEstimate.profile?.stages[0].powerRangeHp, [135, 140]);
for(const change of [
  {fuel:"Petrol"}, {fuel:"Benzine / CNG"}, {fuel:"Diesel"},
  {registeredPower:{value:100,unit:"kW" as const}}, {displacementCc:1390},
  {model:"Touran"}, {cylinders:3},
  {firstRegistrationYear:2021,firstRegistrationDate:"2021-06-25"}
]){
  const rejected=resolveRdwTuningEstimate({...gasInput,...change});
  assert.notEqual(rejected.profile?.id, "rdw-vw-caddy-iv-14-tgi-cng-110", JSON.stringify(change));
}
// Separate source comparisons help conversion without misrepresenting a
// different generation's power as a verified Stage 1 for this exact car.
const comparable = sourcedTuningProfiles.find(source=>source.id==="sourced-bmw-1-series-d2f9ef15e2da")!;
const comparisonInput: EstimateMatchInput = {
  make:"BMW",model:"118i",fuel:"Petrol",displacementCc:1499,powerHp:140,
  firstRegistrationYear:2021,firstRegistrationDate:"2021-04-12",cylinders:3
};
const example = getComparableSourceStage1(comparisonInput,[comparable]);
assert.deepEqual(example?.powerRangeHp,[170,170]);
assert.deepEqual(example?.torqueRangeNm,[260,260]);
assert.equal(example?.matchedApplications,1);
assert.equal(getComparableSourceStage1({...comparisonInput,firstRegistrationYear:2013,firstRegistrationDate:"2013-04-12"},[comparable]),undefined);
assert.equal(getComparableSourceStage1({...comparisonInput,model:"520d"},[comparable]),undefined);
assert.equal(getComparableSourceStage1({...comparisonInput,fuel:"CNG"},[comparable]),undefined);
assert.equal(getComparableSourceStage1({...comparisonInput,displacementCc:1998},[comparable]),undefined);
assert.equal(getComparableSourceStage1({...comparisonInput,model:"118i F20"},[comparable]),undefined);

console.log("RDW generation integrity PASS: F40 136 PS + Caddy IV 1.4 TGI CNG sources, comparison guard, 24 public-year guards.");

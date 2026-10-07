import assert from "node:assert/strict";
import {engineCatalog} from "../src/data/catalog.ts";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {customerProfile} from "../src/lib/customer-profile.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
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

console.log("RDW generation integrity PASS: F40 136 PS Stage 1 source range; no F20 substitution; Stage 2 withheld; 24 public year-scope guards.");

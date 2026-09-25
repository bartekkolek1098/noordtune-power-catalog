import assert from "node:assert/strict";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
const examples=[
  {brand:"Ford",model:"Focus",sourceGeneration:"MkIV",wrong:"MkIII",same:"Mk4",power:182,cc:1500,fuel:"Petrol",year:2019},
  {brand:"Kia",model:"Sportage",sourceGeneration:"QL",wrong:"SL",same:"QL",power:115,cc:1700,fuel:"Diesel",year:2016},
  {brand:"Hyundai",model:"Tucson",sourceGeneration:"NX4",wrong:"TL",same:"NX4",power:136,cc:1600,fuel:"Diesel",year:2021}
];
for(const example of examples) {
  const profile=sourcedTuningProfiles.find(p=>p.brand===example.brand&&p.modelFamily===example.model&&p.generation.includes(example.sourceGeneration)&&p.stockPowerHp===example.power&&p.displacementCc===example.cc)!;
  assert.ok(profile,"Actual researched profile must exist");
  const input:EstimateMatchInput={make:example.brand,model:example.model,fuel:example.fuel,powerHp:example.power,displacementCc:example.cc,firstRegistrationYear:example.year};
  assert.equal(matchSourcedProfile({...input,model:example.model+" "+example.wrong,type:example.wrong},[profile]).profile,undefined,"Explicit earlier generation must reject the later profile despite registration year");
  assert.equal(matchSourcedProfile({...input,model:example.model+" "+example.same,type:example.same},[profile]).profile?.id,profile.id,"Equivalent explicit generation remains compatible");
  assert.equal(matchSourcedProfile({...input,type:"X"+example.wrong+"123XYZ"},[profile]).profile?.id,profile.id,"Opaque type strings are not decoded");
}
const vagExamples = [
  {brand: "Volkswagen", model: "Golf", generation: "VII MKI", power: 125, cc: 1400, fuel: "Petrol", year: 2014,
    wrong: ["Golf VI", "Golf IV", "Golf VIII", "Golf VII MKII", "Golf 7 Phase 2"],
    same: ["Golf VII", "Golf VII MKI", "Golf 7 Phase 1", "Golf Mk7", "Golf 1.4 TSI"]},
  {brand: "Volkswagen", model: "Golf", generation: "VII MKII", power: 115, cc: 1600, fuel: "Diesel", year: 2018,
    wrong: ["Golf VI MKII", "Golf VII MKI", "Golf VIII", "Golf 7 pre-facelift"],
    same: ["Golf VII", "Golf VII MKII", "Golf 7 Phase 2", "Golf 7 facelift", "Golf MkVII", "Golf 1.6 TDI"]},
  {brand: "Volkswagen", model: "Golf", generation: "VI", power: 105, cc: 1600, fuel: "Diesel", year: 2010,
    wrong: ["Golf IV", "Golf VII", "Golf Mk7"], same: ["Golf VI", "Golf Mk6", "Golf 6", "Golf 1.6 TDI"]},
  {brand: "Volkswagen", model: "Golf", generation: "IV", power: 115, cc: 1900, fuel: "Diesel", year: 2000,
    wrong: ["Golf VI", "Golf VII", "Golf Mk6"], same: ["Golf IV", "Golf Mk4", "Golf 4", "Golf 1.9 TDI"]},
  {brand: "Seat", model: "Leon", generation: "5F MK1", power: 150, cc: 2000, fuel: "Diesel", year: 2014,
    wrong: ["Leon 1P", "Leon KL", "Leon 5F MK2", "Leon 5F Phase II"],
    same: ["Leon 5F", "Leon 5F MKI", "Leon 5F Phase 1", "Leon 2.0 TDI"]},
  {brand: "Seat", model: "Leon", generation: "5F MK2", power: 150, cc: 1500, fuel: "Petrol", year: 2018,
    wrong: ["Leon 1P MK2", "Leon KL", "Leon 5F MKI"],
    same: ["Leon 5F", "Leon 5F MKII", "Leon 5F Phase 2", "Leon 1.5 TSI"]},
  {brand: "Audi", model: "A6", generation: "C7", power: 272, cc: 3000, fuel: "Diesel", year: 2016,
    wrong: ["A6 C6", "A6 C8"], same: ["A6 C7", "A6 3.0 TDI"]},
  {brand: "Audi", model: "A3", generation: "8V-FL", power: 150, cc: 1500, fuel: "Petrol", year: 2017,
    wrong: ["A3 8P", "A3 8Y", "A3 8V pre-facelift"], same: ["A3 8V", "A3 8V FL", "A3 1.5 TSI"]},
  {brand: "Volkswagen", model: "Passat", generation: "B8", power: 150, cc: 2000, fuel: "Diesel", year: 2016,
    wrong: ["Passat B7", "Passat B9"], same: ["Passat B8", "Passat 2.0 TDI"]}
];
let vagChecks = 0;
for (const example of vagExamples) {
  const profile = sourcedTuningProfiles.find(p => p.brand === example.brand && p.modelFamily === example.model
    && p.generation === example.generation && p.stockPowerHp === example.power && p.displacementCc === example.cc)!;
  assert.ok(profile, "Actual researched VAG profile exists: " + example.model + " " + example.generation);
  const input: EstimateMatchInput = {make: example.brand, model: example.model, fuel: example.fuel,
    powerHp: example.power, displacementCc: example.cc, firstRegistrationYear: example.year};
  for (const model of example.wrong) {
    assert.equal(matchSourcedProfile({...input, model}, [profile]).profile, undefined, "Reject conflicting body/phase: " + model + " versus " + profile.generation);
    vagChecks++;
  }
  for (const model of example.same) {
    assert.equal(matchSourcedProfile({...input, model}, [profile]).profile?.id, profile.id, "Equivalent or unspecified body/phase: " + model);
    vagChecks++;
  }
  for (const type of ["XVI123XYZ", "ABC5F123", "A8Y999", "2017", "NO-GENERATION-EVIDENCE"]) {
    assert.equal(matchSourcedProfile({...input, type}, [profile]).profile?.id, profile.id, "Opaque/year-only registry type is not a generation: " + type);
    vagChecks++;
  }
}
// The three originally observed failures must also be rejected against the full
// current dataset, rather than merely displaced by another wrong-body source.
for (const input of [
  {make: "Volkswagen", model: "Golf VI", fuel: "Petrol", powerHp: 125, displacementCc: 1400, firstRegistrationYear: 2014},
  {make: "Volkswagen", model: "Golf VII MKII", fuel: "Petrol", powerHp: 125, displacementCc: 1400, firstRegistrationYear: 2014},
  {make: "Seat", model: "Leon 1P", fuel: "Diesel", powerHp: 150, displacementCc: 2000, firstRegistrationYear: 2014}
]) {
  assert.equal(matchSourcedProfile(input, sourcedTuningProfiles).profile, undefined, "Production source pool respects explicit generation: " + input.model);
  vagChecks++;
}
const van = sourcedTuningProfiles.find(profile => profile.brand === "Volkswagen"
  && profile.modelFamily === "Transporter / Multivan / Caravelle" && profile.generation === "T6"
  && profile.stockPowerHp === 204 && profile.displacementCc === 2000)!;
assert.ok(van, "Actual fetched combined T6 source must exist");
for (const model of ["Transporter", "Multivan", "Caravelle"]) {
  const input: EstimateMatchInput = {make: "Volkswagen", model, fuel: "Diesel", powerHp: 204,
    displacementCc: 1968, firstRegistrationYear: 2018};
  assert.equal(matchSourcedProfile({...input, type: "T5"}, [van]).profile, undefined, model + " T5 must not use T6 source");
  assert.equal(matchSourcedProfile({...input, model: model + " T7"}, [van]).profile, undefined, model + " T7 must not use T6 source");
  assert.equal(matchSourcedProfile({...input, model: model + " T6", type: "T6"}, [van]).profile?.id, van.id, model + " T6 uses verified source alias");
  assert.equal(matchSourcedProfile({...input, type: "ABT5123XYZ"}, [van]).profile?.id, van.id, model + " opaque type is not decoded as T5");
  vagChecks += 4;
}
console.log("Sourced generation matching: existing Ford/Kia/Hyundai checks plus " + vagChecks + " VAG body/phase, numeric-engine-label and opaque-identity checks passed.");

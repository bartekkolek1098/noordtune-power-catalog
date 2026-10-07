/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const {auditModelSiblingRejections}=require("./report-model-sibling-rejections.cjs");
const {sourcedTuningProfiles}=require("../src/data/tuning-profiles/index.ts");
const {matchSourcedProfile}=require("../src/lib/sourced-tuning-match.ts");

const report=auditModelSiblingRejections();
assert.equal(report.reportVersion,"model-sibling-review-v1");
assert.equal(report.modelFamilyRejections,772);
assert.equal(report.superficiallySimilarNameRows,108);
assert.ok(report.superficiallySimilarNameRows<report.modelFamilyRejections);
assert.ok(report.warning.includes("NOT evidence"));
assert.equal(report.inputTaxonomyRows,4592);
assert.equal(report.publishedSourceRows,1269);
assert.ok(report.topModelSiblingPairs.some(p=>p.make==="Volkswagen"&&p.taxonomyModel==="Passat"&&p.otherSourceModel==="Golf"));
assert.ok(report.topModelSiblingPairs.some(p=>p.make==="Audi"&&p.taxonomyModel==="A5"&&p.otherSourceModel==="A4"));
assert.ok(report.topModelSiblingPairs.some(p=>p.make==="BMW"&&p.taxonomyModel==="4"&&p.otherSourceModel==="3 Series"));
assert.ok(report.topModelSiblingPairs.some(p=>p.make==="Ford"&&p.taxonomyModel==="Tourneo Custom"&&p.otherSourceModel==="Transit Custom"));

let guardChecks=0;
for(const [sourceMake,sourceFamily,wrongFamily] of [
  ["BMW","3 Series","4 Series"],
  ["Audi","A4","A5"],
  ["Volkswagen","Golf","Passat"],
  ["Citroën","C4 Picasso","C4"],
  ["Ford","Transit Custom","Tourneo Custom"],
  ["Peugeot","308","3008"],
  ["Volvo","V40","V70"]
]){
  const source=sourcedTuningProfiles.find(p=>p.brand===sourceMake&&p.modelFamily===sourceFamily
    && p.stockPowerHp>0&&p.displacementCc>0&&p.electrification!=="hybrid"&&p.electrification!=="mild-hybrid");
  assert.ok(source,"Sourced family must exist: "+sourceMake+" "+sourceFamily);
  const input={
    make:sourceMake,
    model:wrongFamily,
    fuel:source.fuel,
    powerHp:source.stockPowerHp,
    displacementCc:source.displacementCc,
    firstRegistrationYear:source.yearFrom
  };
  assert.equal(matchSourcedProfile(input,[source]).profile,undefined,
    "Never auto-assign a different manufacturer's body model based on shared engine power: "+wrongFamily+" -> "+sourceFamily);
  guardChecks++;
}
// A provider that explicitly names all three variants is a separate, already
// reviewed positive case. Do not mistake it for a fuzzy sibling merge.
const explicit=sourcedTuningProfiles.find(p=>p.brand==="Volkswagen"&&
  p.modelFamily==="Transporter / Multivan / Caravelle"&&p.generation==="T6"&&p.stockPowerHp===204);
assert.ok(explicit);
assert.deepEqual(explicit.aliases,["Transporter","Multivan","Caravelle"]);
for(const family of explicit.aliases){
  assert.equal(matchSourcedProfile({
    make:"Volkswagen",model:family+" T6",fuel:"Diesel",powerHp:204,
    displacementCc:1968,firstRegistrationYear:2017,type:"T6"
  },[explicit]).profile?.id,explicit.id);
  guardChecks++;
}
for(const family of ["California T6","Multivan T6.1","Caravelle T7","Multivan T5"]){
  assert.equal(matchSourcedProfile({
    make:"Volkswagen",model:family,fuel:"Diesel",powerHp:204,
    displacementCc:1968,firstRegistrationYear:2017,type:family.split(" ").at(-1)
  },[explicit]).profile,undefined,"Explicit provider group does not include "+family);
  guardChecks++;
}
console.log("MODEL_SIBLING_GUARD_PASS: 772 model-family rejections, 108 superficial near-names, "+guardChecks+" safe negative/positive examples.");

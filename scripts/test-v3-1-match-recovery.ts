import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {normalizeRdwVehicle} from "../src/lib/rdw.ts";
import {matchSourcedProfile,sourceModelFamily} from "../src/lib/sourced-tuning-match.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";

const read=(path:string)=>JSON.parse(readFileSync(path,"utf8"));
const baseline=read("data/research/v3-rdw-validation.json").rows.find((row:{sampleId:string})=>row.sampleId==="rdw-3dea08368f3f876bae58");
const raw=read("data/research/nl-rdw-v3-qa-sample.json").rows.find((row:{sampleId:string})=>row.sampleId===baseline.sampleId);
assert.equal(baseline.layer,"D","The frozen V3 failure is reproduced from the same real registration");
assert.ok(baseline.reasons.includes("NO_COMPATIBLE_SOURCED_PROFILE"));
assert.equal(sourceModelFamily("alfa romeo","ALFA GIULIETTA"),"giulietta","RDW uses a shortened administrative make prefix");
const estimate=normalizeRdwVehicle(raw.vehicle,raw.fuels,"SAMPLE");
assert.equal(estimate.tuningEstimate.coverageClass,"B");
assert.equal(estimate.tuningEstimate.profile?.id,"sourced-alfa-romeo-giulietta-0851d5529e26");
assert.equal(estimate.tuningEstimate.profile?.stages.find(stage=>stage.name==="Stage 1")?.powerHp,195);
assert.equal(estimate.tuningEstimate.profile?.stages.find(stage=>stage.name==="Stage 1")?.torqueNm,300);
assert.equal(estimate.tuningEstimate.profile?.stages.find(stage=>stage.name==="Stage 2")?.powerHp,205);
assert.equal(estimate.tuningEstimate.profile?.stages.find(stage=>stage.name==="Stage 3+")?.powerHp,undefined);
assert.deepEqual(estimate.tuningQuote,baseline.quote,"Recovering a profile does not change this NoordTune quote");
const identity={make:"Alfa Romeo",model:"ALFA GIULIETTA",fuel:"Benzine",registeredPower:{value:125,unit:"kW" as const},displacementCc:1368,firstRegistrationYear:2010,cylinders:4,type:"940"};
for(const [change,value] of [["model","ALFA GIULIA"],["make","Fiat"],["fuel","Diesel"],["firstRegistrationYear",2024],["displacementCc",1998],["registeredPower",{value:173,unit:"kW"}] ] as const){
  const negative=matchSourcedProfile({...identity,[change]:value},sourcedTuningProfiles);
  assert.equal(negative.profile,undefined,`Different ${change} cannot inherit Giulietta data`);
}
const indexed=matchSourcedProfile(identity,sourcedTuningProfiles);
const exhaustive=matchSourcedProfile(identity,sourcedTuningProfiles,{indexed:false});
assert.deepEqual(indexed,exhaustive,"Indexed and exhaustive decisions agree");
const reviewedCases=[
  {id:"rdw-752a71303519e8377dcf",sourceId:"unlimited-v2-d165a625068a240d",wrongModel:"FIESTA"},
  {id:"rdw-3f8cdb0b400e8b135413",sourceId:"unlimited-v2-7e3222da8a7f2aa0",wrongModel:"TIGUAN"},
  {id:"rdw-c939a7aed96a449acc71",sourceId:"unlimited-v2-7e3222da8a7f2aa0",wrongModel:"TIGUAN"},
  {id:"rdw-200538a9716dc40b0825",sourceId:"unlimited-v2-2226cb9b6e05c9dc",wrongModel:"3008"},
  {id:"rdw-70c1c16131f87826b971",sourceId:"unlimited-v2-4e5dc33a1025ea18",wrongModel:"308"}
];
for(const item of reviewedCases){
  const before=read("data/research/v3-rdw-validation.json").rows.find((row:{sampleId:string})=>row.sampleId===item.id);
  const row=read("data/research/nl-rdw-v3-qa-sample.json").rows.find((row:{sampleId:string})=>row.sampleId===item.id);
  assert.equal(before.layer,"D","Targeted source was deferred in the frozen V3 result");
  const profile=sourcedTuningProfiles.find(candidate=>candidate.sourceIds.includes(item.sourceId));
  assert.ok(profile,`${item.sourceId} must have an explicitly reviewed promotion`);
  const actual=normalizeRdwVehicle(row.vehicle,row.fuels,"SAMPLE");
  assert.equal(actual.tuningEstimate.coverageClass,"B");
  assert.equal(actual.tuningEstimate.profile?.id,profile.id);
  const input={make:before.identity.make,model:before.identity.model,fuel:before.identity.fuel,
    registeredPower:{value:before.identity.registeredPowerKw,unit:"kW" as const},displacementCc:before.identity.displacementCc,
    firstRegistrationYear:before.identity.firstAdmissionYear,cylinders:before.identity.cylinders,type:before.identity.type,
    variant:before.identity.variant,execution:before.identity.execution};
  assert.notEqual(matchSourcedProfile({...input,model:item.wrongModel},sourcedTuningProfiles).profile?.id,profile.id,"Sibling model must not inherit the new source");
  assert.notEqual(matchSourcedProfile({...input,firstRegistrationYear:2027},sourcedTuningProfiles).profile?.id,profile.id,"Outside source period must stay ineligible");
  assert.notEqual(matchSourcedProfile({...input,fuel:"Diesel"},sourcedTuningProfiles).profile?.id,profile.id,"Other fuel must stay ineligible");
  assert.deepEqual(matchSourcedProfile(input,sourcedTuningProfiles),matchSourcedProfile(input,sourcedTuningProfiles,{indexed:false}));
}
const frozenRows=read("data/research/v3-rdw-validation.json").rows;
assert.equal(frozenRows.length,400);
for(const row of frozenRows){
  const vehicle=row.identity;
  if(!vehicle.fuel||vehicle.registeredPowerKw===null)continue;
  const input={make:vehicle.make,model:vehicle.model,fuel:vehicle.fuel,
    registeredPower:{value:vehicle.registeredPowerKw,unit:"kW" as const},displacementCc:vehicle.displacementCc,
    firstRegistrationYear:vehicle.firstAdmissionYear,cylinders:vehicle.cylinders,type:vehicle.type,
    variant:vehicle.variant,execution:vehicle.execution};
  assert.deepEqual(matchSourcedProfile(input,sourcedTuningProfiles),matchSourcedProfile(input,sourcedTuningProfiles,{indexed:false}),`Indexed match differs for ${row.sampleId}`);
}
console.log(JSON.stringify({suite:"V3.1 match recovery",administrativeAliasCase:baseline.sampleId,reviewedSourceCases:reviewedCases.length,quoteUnchangedForAlias:true,negativeGuards:6+reviewedCases.length*3,indexedExhaustiveCases:400}));

import assert from "node:assert/strict";
import {resolveRdwTuningEstimate as resolve} from "../src/lib/rdw-tuning-estimate.ts";
import {tuningReferenceProfiles, type EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {sourcedTuningProfiles} from "../src/data/tuning-profiles/index.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import {resolveStageQuote} from "../src/data/pricing.ts";
import {applyStageHardwarePolicy} from "../src/lib/stage-hardware-policy.ts";

const bmw: EstimateMatchInput = {make:"BMW",model:"128ti",fuel:"Petrol",displacementCc:1998,powerHp:265,firstRegistrationYear:2022};
const custom: EstimateMatchInput = {make:"Ford",model:"Transit Custom",fuel:"Diesel",displacementCc:1995,powerHp:105,firstRegistrationYear:2019};
const connect: EstimateMatchInput = {make:"Ford",model:"Transit Connect",fuel:"Diesel",displacementCc:1499,powerHp:100,firstRegistrationYear:2018};
const facts = (input:EstimateMatchInput) => resolve(input).profile!.stages[0];
for (const [input, id, hp, nm] of [[bmw,"ref-bmw-128ti-f40-265",310,480],[custom,"ref-ford-transit-custom-20-ecoblue-105",190,440]] as const) {
  const result=resolve(input), stage=result.profile!.stages[0];
  assert.equal(stage.sourceProfileId,id);assert.equal(stage.provenance,"reference");
  assert.equal(stage.powerHp,hp);assert.equal(stage.torqueNm,nm);
  assert.deepEqual(resolve(input,{sourcedProfiles:[...sourcedTuningProfiles].reverse()}),result);
  const without=resolve(input,{references:[]}).profile!;
  for(let i=0;i<3;i++)assert.deepEqual(resolveStageQuote(result.profile!,result.profile!.stages[i],{scope:"vehicle"}),resolveStageQuote(without,without.stages[i],{scope:"vehicle"}));
}
const source=matchSourcedProfile(bmw,sourcedTuningProfiles).profile!;
const ref=tuningReferenceProfiles.find(p=>p.id==="ref-bmw-128ti-f40-265")!;
const sourceStage2={...source.stage1,selectedPowerHp:335,selectedTorqueNm:510};
const options={sourcedProfiles:[{...source,stage2:sourceStage2}],references:[ref],publicVehicles:[],canonicalVehicles:[]};
const composed=resolve(bmw,options).profile!;
assert.equal(composed.stages[0].powerHp,310);assert.equal(composed.stages[1].powerHp,335);
assert.equal(composed.stages[1].sourceProfileId,source.id);
// A source Stage 1 must not erase an independently supported reference Stage 2.
const laterReference={...ref,stages:[{...ref.stages[0],name:"Stage 2" as const,powerHp:345,torqueNm:520}]};
const inverse=resolve(bmw,{...options,references:[laterReference]}).profile!;
assert.equal(inverse.stages[0].sourceProfileId,source.id);assert.equal(inverse.stages[1].powerHp,345);
assert.equal(inverse.stages[1].provenance,"reference");
const missing=resolve(bmw,{...options,sourcedProfiles:[{...source,stage2:undefined}]}).profile!;
assert.equal(missing.stages[1].provenance,"generic-indicative");assert.ok(missing.stages[1].powerRangeHp);
assert.equal(missing.stages[2].customHardware,true);
const canonical={id:"synthetic-bmw-128ti",brand:"BMW",model:"128ti",engine:"2.0 petrol",generation:"F40",version:"F40",yearRange:"2022",years:[2022],fuel:"Petrol" as const,
  stockPowerHp:265,stockTorqueNm:400,ecuType:"Unconfirmed",options:[],image:"",tags:[],stages:[{name:"Stage 2" as const,powerHp:340,torqueNm:510,price:1,requirements:"Synthetic compatible canonical stage",packageItems:[]}]};
const canonicalFallback=resolve(bmw,{...options,sourcedProfiles:[{...source,stage2:undefined}],canonicalVehicles:[canonical]}).profile!;
assert.equal(canonicalFallback.stages[0].sourceProfileId,ref.id);
assert.deepEqual([canonicalFallback.stages[1].powerHp,canonicalFallback.stages[1].torqueNm,canonicalFallback.stages[1].provenance],[340,510,"canonical-estimated"]);
const sourcedThird=resolve(bmw,{...options,sourcedProfiles:[{...source,stage3:{...source.stage1,selectedPowerHp:380,selectedTorqueNm:540}}]}).profile!;
assert.equal(sourcedThird.stages[0].sourceProfileId,ref.id);assert.equal(sourcedThird.stages[2].powerHp,380);
assert.equal(resolveStageQuote(sourcedThird,sourcedThird.stages[2]).kind,"on-request");
const rangeRef={...laterReference,stages:[{...laterReference.stages[0],powerHp:undefined,powerRangeHp:[340,350] as [number,number]}]};
assert.deepEqual(resolve(bmw,{...options,references:[rangeRef]}).profile!.stages[1].powerRangeHp,[340,350]);
const stage3={...ref.stages[0],name:"Stage 3+" as const,powerHp:380,torqueNm:540,hardwareRequired:true};
const withStage3=resolve(bmw,{...options,references:[{...ref,stages:[stage3]}]}).profile!;
assert.equal(applyStageHardwarePolicy(withStage3.stages)[2].powerHp,380);
assert.equal(resolveStageQuote(withStage3,withStage3.stages[2]).kind,"on-request");
for(const invalid of [
  {...bmw,displacementCc:1499},{...bmw,model:"118i"},{...bmw,fuel:"Diesel"},{...bmw,firstRegistrationYear:2018},{...bmw,model:"128ti F20"},
  {...custom,displacementCc:1499},{...custom,model:"Transit Connect"},{...custom,model:"Transit"},{...custom,model:"Transit Courier"},{...custom,fuel:"Petrol"},{...custom,firstRegistrationYear:2016},
  {...connect,displacementCc:1596},{...connect,firstRegistrationYear:2021},{...connect,model:"Transit Connect EcoBlue"},
  {...connect,engineGenerationEvidence:{family:"ecoblue" as const,sourceReference:"synthetic-workshop-evidence"}}
]) assert.notEqual(facts(invalid)?.provenance,"reference",JSON.stringify(invalid));
const unknown=resolve(connect);assert.ok(unknown.reasonCodes.includes("CONNECT_ENGINE_GENERATION_REVIEW"));assert.equal(unknown.status,"conditional");
assert.equal(unknown.profile!.stages[0].powerHp,125);assert.equal(unknown.profile!.ecuSupport?.status,"manual-review");
const laterConnect=resolve({...connect,firstRegistrationYear:2022}).profile!;
assert.notEqual(laterConnect.stages[0].provenance,"reference");
assert.equal(laterConnect.pricingProfileId,"ref-ford-transit-connect-15-tdci-100");
for (const [index,cents] of [[0,44900],[1,54900]] as const) {
  const quote=resolveStageQuote(laterConnect,laterConnect.stages[index],{scope:"vehicle"});
  assert.equal(quote.kind==='from'&&quote.amountCents,cents);
}
console.log("Production per-stage precedence: reference/source composition, placeholders, ranges, hardware, pricing, strict identity/year/family guards and source-order invariance PASS.");

import assert from "node:assert/strict";
import {existsSync,readFileSync,writeFileSync} from "node:fs";
import {sourcedTuningProfiles,tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";
import type {SourceObservation,SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";
import type {EstimateMatchInput} from "../src/data/tuning-estimates.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import {findCatalogMatch,engineCatalog} from "../src/data/catalog.ts";
import {assessVehicleAccess,resolveStageQuote} from "../src/data/pricing.ts";

const read=(file:string)=>JSON.parse(readFileSync("data/research/"+file,"utf8"));
const baseline=read("v1-consensus-checkpoint.json");
const changes=read(existsSync("data/research/v3-v1-source-changes.json")?"v3-v1-source-changes.json":"v2-source-changes.json");
const sources=read("source-pages.json") as SourceObservation[];
const sourceById=new Map(sources.map(source=>[source.id,source]));
const newProfiles=sourcedTuningProfiles.filter(p=>!baseline.profiles.some((b:{id:string})=>b.id===p.id));
assert.ok(newProfiles.length>=400,"400 new accepted profiles; no generated year copies");
const normalize=(value:string)=>value.normalize('NFD').toLowerCase().replace(/[^a-z0-9]/g,'');
const technicalKey=(p:SourcedTuningProfile)=>JSON.stringify([normalize(p.brand),normalize(p.modelFamily),normalize(p.generation),p.fuel,p.displacementCc,p.stockPowerHp,p.stockTorqueNm??null,p.engineFamily??null]);
const distinctNewTechnicalProfiles=new Set(newProfiles.map(technicalKey)).size;
assert.ok(distinctNewTechnicalProfiles>=400,"At least 400 distinct technical identities without using year endpoints to inflate the count");
assert.equal(new Set(sourcedTuningProfiles.map(p=>JSON.stringify([technicalKey(p),p.yearFrom,p.yearTo??null]))).size,sourcedTuningProfiles.length,"No duplicate technical profiles with identical effective periods");
assert.equal(engineCatalog.length,24,"Public catalog stays 24");
const selectedFacts=(p:SourcedTuningProfile)=>Object.fromEntries((["stage1","stage2","stage3"] as const).map(key=>[key,p[key]?{powerHp:p[key]!.selectedPowerHp,...(p[key]!.selectedTorqueNm===undefined?{}:{torqueNm:p[key]!.selectedTorqueNm})}:null]));
let changedV1=0;
for(const before of baseline.profiles){
  const after=sourcedTuningProfiles.find(p=>p.id===before.id);assert.ok(after,"Keep V1 ID "+before.id);
  const different=JSON.stringify(before.stages)!==JSON.stringify(selectedFacts(after))||before.yearFrom!==after.yearFrom||before.yearTo!==after.yearTo;
  const record=changes.records.find((r:{profileId:string})=>r.profileId===before.id);
  if(different){changedV1++;assert.ok(record?.changedFields.length&&record.evidence.length,"Every V1 change has evidence");assert.deepEqual(record.before,before);assert.deepEqual(record.after.stages,selectedFacts(after));}
  else assert.ok(!record?.numericChanged,"No spurious V1 numeric change");
}
for(const p of sourcedTuningProfiles){
  assert.ok(!["hybrid","mild-hybrid"].includes(p.electrification??""));
  if(!baseline.profiles.some((b:{id:string})=>b.id===p.id)&&p.brand==="Ford"&&/\bTDCi\b/i.test(p.engineMarketingName)&&/\bEcoBlue\b/i.test(p.engineMarketingName))assert.ok(p.sourceIds.some(id=>sources.find(s=>s.id===id)?.engineFamilyEvidence),"Conflicting Ford labels require explicit manufacturer mapping; Connect remains separate");
  for(const id of p.sourceIds){const source=sourceById.get(id);assert.ok(source?.identity&&source.status==="retrieved"&&source.retrievalMethod!=="search-index");assert.match(source.contentSha256??"",/^[a-f0-9]{64}$/);assert.ok(!source.packages?.length,"External module is not a remap vote");
    if(source.identityEvidence)for(const evidence of source.identityEvidence){assert.equal(evidence.value,source.identity.fuel);assert.match(evidence.sourceUrl,/^https:\/\//);assert.ok(evidence.applicationUrls.length);assert.equal(evidence.contentSha256.length,64);}
  }
}
function fixture(p:SourcedTuningProfile):EstimateMatchInput{return {make:p.brand,model:p.modelFamily+" "+p.engineMarketingName,fuel:p.fuel,powerHp:p.stockPowerHp,displacementCc:p.displacementCc,firstRegistrationYear:p.yearFrom+Math.min(1,(p.yearTo??2026)-p.yearFrom),type:p.generation,variant:p.engineFamily,...(p.brand==="Ford"&&p.modelFamily==="Transit Connect"&&p.engineFamily==="EcoBlue"?{engineGenerationEvidence:{family:"ecoblue" as const,sourceReference:"Source-backed QA fixture; not inferred from the registration."}}:{})};}
const summarize=(result:ReturnType<typeof matchSourcedProfile>)=>({profile:result.profile?.id,candidates:result.candidates.map(p=>p.id),reasons:result.reasonCodes});
let indexComparisons=0;
for(const p of sourcedTuningProfiles){
  const input=fixture(p);
  for(const value of [input,{...input,displacementCc:7777},{...input,firstRegistrationYear:1980}]){
    assert.deepEqual(summarize(matchSourcedProfile(value,sourcedTuningProfiles)),summarize(matchSourcedProfile(value,sourcedTuningProfiles,{indexed:false})),"Index equals exhaustive matching: "+p.id);indexComparisons++;
  }
}
// Exhaustive catalog control includes all makes, diagnostics and rejection count.
const live=read("nl-rdw-live-sample.json");
const catalogInputs:EstimateMatchInput[]=live.rows.filter((_:unknown,i:number)=>i%3===0).map((row:{vehicle:Record<string,string>;fuels:{brandstof_omschrijving:string;nettomaximumvermogen:string}[]})=>({make:row.vehicle.merk,model:row.vehicle.handelsbenaming,fuel:row.fuels.map(f=>f.brandstof_omschrijving).join(" / "),registeredPower:{value:Number(row.fuels[0]?.nettomaximumvermogen),unit:"kW" as const},displacementCc:Number(row.vehicle.cilinderinhoud),firstRegistrationYear:Number(row.vehicle.datum_eerste_toelating.slice(0,4)),type:row.vehicle.type,variant:row.vehicle.variant,execution:row.vehicle.uitvoering}));
catalogInputs.push({},{make:"Unknown",model:"Unknown",fuel:"Petrol"},{make:"VW",model:"Golf",fuel:"Diesel",powerHp:105,displacementCc:1598,firstRegistrationYear:2011});
for(const input of catalogInputs)assert.deepEqual(findCatalogMatch(input),findCatalogMatch(input,{indexed:false}),"Catalog make index preserves full assessment");
const kiaHyundai=sourcedTuningProfiles.filter(p=>["Kia","Hyundai"].includes(p.brand));
const distinct=new Map(kiaHyundai.map(p=>[JSON.stringify([p.brand,p.modelFamily,p.generation,p.fuel,p.displacementCc,p.stockPowerHp,p.stockTorqueNm]),p]));
assert.ok(distinct.size>=50,"50 distinct source-backed Kia/Hyundai identities");
for(const model of ["Sportage","Ceed","ProCeed","Sorento","Stonic","i30","Tucson","Kona"])assert.ok(kiaHyundai.some(p=>p.modelFamily===model),"Required model: "+model);
const acceptance=[...distinct.values()].map(p=>{
  const input=fixture(p),isolated=resolveRdwTuningEstimate(input,{sourcedProfiles:[p],references:[],publicVehicles:[],canonicalVehicles:[]});
  assert.equal(isolated.profile?.id,p.id,"Applicable source-backed identity in isolation");
  const result=resolveRdwTuningEstimate(input),profile=result.profile;
  assert.ok(profile,"Retain useful ICE estimate");
  const quote=resolveStageQuote(profile,profile.stages[0],{access:assessVehicleAccess(profile)});
  assert.equal(quote.kind,"from");
  return {sourceProfileId:p.id,input,layer:result.coverageClass,selectedProfileId:profile.id,stage1:profile.stages[0],stage2:profile.stages[1],quote,reasons:result.reasonCodes};
});
const controls:EstimateMatchInput[]=[
  {make:"Kia",model:"Niro",fuel:"Petrol",powerHp:105,displacementCc:1580,firstRegistrationYear:2018},
  {make:"Kia",model:"Niro",fuel:"Petrol",powerHp:105,displacementCc:1580,firstRegistrationYear:2023},
  {make:"Hyundai",model:"Kona Hybrid",fuel:"Petrol",powerHp:105,displacementCc:1580,firstRegistrationYear:2020},
  {make:"Kia",model:"Sportage 48V",fuel:"Petrol",powerHp:150,displacementCc:1598,firstRegistrationYear:2024},
  {make:"Suzuki",model:"Vitara",fuel:"Petrol",powerHp:129,displacementCc:1373,firstRegistrationYear:2021},
  {make:"Nissan",model:"Qashqai",fuel:"Petrol",powerHp:158,displacementCc:1332,firstRegistrationYear:2022},
  {make:"Nissan",model:"Qashqai",type:"J12",fuel:"Petrol",powerHp:140,displacementCc:1332,firstRegistrationYear:2022}
];
for(const input of controls)assert.ok(!resolveRdwTuningEstimate(input).profile,"Electrified applications never get ordinary ICE profiles");
const plainSuzuki:EstimateMatchInput={make:"Suzuki",model:"Vitara",fuel:"Petrol",powerHp:140,displacementCc:1373,firstRegistrationYear:2018};
assert.ok(resolveRdwTuningEstimate(plainSuzuki).profile,"Conventional BoosterJet stays supported");
const proace=sourcedTuningProfiles.find(p=>p.brand==="Toyota"&&p.modelFamily.toLowerCase()==="proace")!;
assert.ok(proace);assert.ok(!matchSourcedProfile({...fixture(proace),model:"Proace City"},[proace]).profile,"Proace City never borrows Proace when sibling is absent");
const report={datasetFingerprint:tuningDatasetFingerprint,sourceBackedFixtures:distinct.size,newProfiles:newProfiles.length,distinctNewTechnicalProfiles,changedV1,indexComparisons,catalogIndexComparisons:catalogInputs.length,hybridControls:controls.length,failures:0,fixtures:acceptance};
const outputIndex=process.argv.indexOf("--output");
writeFileSync(outputIndex>=0?process.argv[outputIndex+1]:existsSync("data/research/v2-consensus-checkpoint.json")?"data/research/v3-kia-hyundai-acceptance.json":"data/research/v2-kia-hyundai-acceptance.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({...report,fixtures:undefined}));

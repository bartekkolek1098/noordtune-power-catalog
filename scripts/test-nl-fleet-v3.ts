import assert from "node:assert/strict";
import {existsSync,readFileSync,writeFileSync} from "node:fs";
import {sourcedTuningProfiles,tuningDatasetFingerprint} from "../src/data/tuning-profiles/index.ts";
import type {SourceObservation,SourcedTuningProfile} from "../src/data/tuning-profiles/schema.ts";
import {matchSourcedProfile} from "../src/lib/sourced-tuning-match.ts";
import {hasReviewedEngineFamily} from "./tuning-source-evidence.ts";
const read=(f:string)=>JSON.parse(readFileSync('data/research/'+f,'utf8'));
const sample=read('nl-rdw-v3-qa-sample.json'),prior=read('nl-rdw-live-sample.json'),outputs=read('nl-top-groups-output-sample.json');
assert.equal(sample.rows.length,400);assert.equal(new Set(sample.rows.map((r:{sampleId:string})=>r.sampleId)).size,400);
for(const row of prior.rows)assert.deepEqual(sample.rows.find((r:{sampleId:string})=>r.sampleId===row.sampleId),row,'Prior 222 fixed facts retained');
assert.equal(read('v3-rdw-qa-selection.json').selectedBeforeFuelJoin,true);
assert.equal(outputs.groups.length,250);assert.equal(outputs.rows.length,3000);
for(const group of outputs.groups){assert.equal(group.sampleSize,12);assert.equal(group.observedOutputVariants.reduce((sum:number,v:{observedCount:number})=>sum+v.observedCount,0),12);}
for(const row of sample.rows)assert.equal(row.registrationVerified,true,'All 400 QA records meet the stronger current registration check');
for(const row of outputs.rows){assert.equal(row.vehicle.export_indicator,'Nee');assert.equal(typeof row.registrationVerified,'boolean');assert.ok(!Object.hasOwn(row.vehicle,'kenteken'));for(const fuel of row.fuels)assert.ok(!Object.hasOwn(fuel,'kenteken'));}
const queue=read('nl-output-variant-priority.json');
assert.equal(queue.groups.length,250);
assert.equal(queue.datasetFingerprint,read('v3-acceptance.json').datasetFingerprint,'Frozen V3 queue retains its original dataset fingerprint');
for(const group of queue.groups){
  const original=outputs.groups.find((g:{groupId:string})=>g.groupId===group.groupId);
  assert.equal(group.observedOutputVariants.length,original.observedOutputVariants.length,'Retain distinct RDW type/variant/execution scenarios');
  for(const v of group.observedOutputVariants){assert.ok(v.sampleIds.length===v.observedCount);assert.ok(['A','B','C','D','E'].includes(v.layer));if(!v.registeredPowerKw)assert.equal(v.layer,'E','Missing registered power never inferred');}
}
const closure=read('top50-coverage-closure.json'),baseline=read('v3-priority-baseline.json'),currentPriority=read('nl-technical-priority-v3.json');
const requiredClosure=new Set<string>();
for(const snapshot of [baseline,currentPriority])for(const group of snapshot.groups.slice(0,50))if(!['A','B'].includes(group.layer))requiredClosure.add(group.groupId);
assert.deepEqual(closure.records.map((r:{groupId:string})=>r.groupId).sort(),[...requiredClosure].sort(),'Every historical and current top50 C/D/E group has a research record');
for(const row of closure.records){assert.ok(row.observedOutputVariants.length);assert.ok(row.sourceSearchPerformed[0].sitemapContentSha256);assert.ok(row.sourceSearchPerformed[0].discoveredApplicationUrls.length,'ATM inventory search recorded');if(!['A','B'].includes(row.afterLayer))assert.ok(row.unresolvedReasons.length);}
const sources=read('source-pages.json') as SourceObservation[];
for(const p of sourcedTuningProfiles){
  if(p.stage1.selectedPowerHp/p.stockPowerHp>1.45+1e-8||(p.stockTorqueNm&&p.stage1.selectedTorqueNm&&p.stage1.selectedTorqueNm/p.stockTorqueNm>1.45+1e-8)){
    assert.ok(p.stage1.conditions.some(c=>c.startsWith('LARGE_GAIN_')));
    if(p.stage1.conditions.includes('LARGE_GAIN_REQUIRES_EXTRA_EVIDENCE')){assert.equal(p.ownerReviewRequired,true);assert.notEqual(p.reviewStatus,'noordtune-approved');}
  }
  const observations=p.sourceIds.map(id=>sources.find(o=>o.id===id)!);
  for(const source of observations){assert.ok(!source.availability||source.availability.status==='available');if(source.conditions?.includes('ENGINE_FAMILY_LABEL_CONFLICT'))assert.ok(hasReviewedEngineFamily(source,sources));}
}
const reviewed=sources.find(o=>o.engineFamilyEvidence)!;assert.ok(hasReviewedEngineFamily(reviewed,sources));
assert.equal(hasReviewedEngineFamily({...reviewed,identity:{...reviewed.identity!,modelFamily:'Transit Connect',displacementCc:1499}},sources),false,'2.0 Transit manufacturer mapping never resolves 1.5 Connect');
assert.equal(hasReviewedEngineFamily(reviewed,sources.filter(o=>o.id!==reviewed.engineFamilyEvidence!.sourceId)),false,'Missing manufacturer evidence fails closed');
const base=sourcedTuningProfiles.find(p=>p.brand==='Volkswagen'&&p.modelFamily==='Caddy')!;
let generationChecks=0;
for(const [brand,model,older,newer] of [['Volkswagen','Caddy','Mk4','Mk5'],['Volkswagen','Crafter','I','II'],['Volkswagen','Transporter','T6','T6.1'],['Mercedes-Benz','Sprinter','W906','W907'],['Mercedes-Benz','Vito','W639','W447']]){
  // Synthetic overlapping years isolate the explicit body-generation guard.
  const pair=[older,newer].map((generation,i)=>({...base,id:'synthetic-'+i,brand,modelFamily:model,aliases:[],generation,yearFrom:2015,yearTo:2024,engineMarketingName:'2.0 diesel',engineFamily:undefined,engineCodes:undefined,conditions:[]} as SourcedTuningProfile));
  for(const generation of [older,newer]){const input={make:brand,model,fuel:base.fuel,powerHp:base.stockPowerHp,displacementCc:base.displacementCc,firstRegistrationYear:2021,type:generation};
    assert.equal(matchSourcedProfile(input,pair).profile?.generation,generation);generationChecks++;
    assert.equal(matchSourcedProfile({...input,powerHp:20},pair).profile,undefined,'No wrong stock-output match');generationChecks++;
    assert.equal(matchSourcedProfile({...input,displacementCc:7777},pair).profile,undefined,'No cross-displacement match');generationChecks++;
  }
}
const connect=sourcedTuningProfiles.filter(p=>p.brand==='Ford'&&p.modelFamily==='Transit Connect'&&p.displacementCc===1499&&p.stockPowerHp===100);
assert.ok(connect.some(p=>p.engineFamily==='TDCi'));assert.ok(connect.some(p=>p.engineFamily==='EcoBlue'));
const connectInput={make:'Ford',model:'Transit Connect',fuel:'Diesel',powerHp:100,displacementCc:1499,firstRegistrationYear:2019};
assert.equal(matchSourcedProfile(connectInput,connect).profile,undefined,'Plate facts alone cannot choose Connect family');
for(const family of ['ecoblue','tdci-pre-facelift'] as const){const result=matchSourcedProfile({...connectInput,firstRegistrationYear:family==='ecoblue'?2019:2015,engineGenerationEvidence:{family,sourceReference:'Synthetic independently verified engine-code fixture'}},connect);
  assert.ok(result.candidates.length>0);assert.ok(result.candidates.every(p=>p.engineFamily===(family==='ecoblue'?'EcoBlue':'TDCi')));}
for(const file of ['v3-source-changes.json','v3-v1-source-changes.json']){const changes=read(file);for(const row of changes.records)assert.ok(row.evidence.length,'Every selected V1/V2 change or corroboration has retrieved source evidence');}
const v2Changes=read('v3-source-changes.json');
for(const before of read('v2-consensus-checkpoint.json').profiles){const record=v2Changes.records.find((r:{profileId:string})=>r.profileId===before.id);
  const after=sourcedTuningProfiles.find(p=>p.id===(record?.retainedProfileId??before.id));assert.ok(after,'Every V2 profile retained or explicitly consolidated');
  const stages=Object.fromEntries((['stage1','stage2','stage3'] as const).map(k=>[k,after[k]?{powerHp:after[k]!.selectedPowerHp,...(after[k]!.selectedTorqueNm===undefined?{}:{torqueNm:after[k]!.selectedTorqueNm})}:null]));
  if(JSON.stringify(stages)!==JSON.stringify(before.stages)||before.yearFrom!==after.yearFrom||before.yearTo!==after.yearTo){assert.ok(record?.changedFields.length&&record.evidence.length);assert.deepEqual(record.after.stages,stages);}
}
const qa=read('v3-rdw-outcomes.json');assert.equal(qa.sampleSize,400);assert.equal(qa.pricingChanges.length,0);assert.equal(qa.identityChanges.length,0);
for(const row of qa.transitions.filter((r:{before:string;after:string})=>['A','B'].includes(r.before)&&!['A','B'].includes(r.after)))assert.ok(row.reasons.some((r:string)=>/MULTIPLE|CONFLICT|GENERATION/.test(r)),'Demotion must expose identity uncertainty, never silently lose data');
const report={datasetFingerprint:tuningDatasetFingerprint,sampleSize:400,priorFixedSubset:222,outputSampleSize:3000,outputGroups:250,top50ClosureRecords:closure.records.length,explicitGenerationAndOutputGuards:generationChecks,largeGainChecks:true,connectSeparation:true,pricingChanges:0,identityChanges:0,failures:0};
writeFileSync(existsSync('data/research/v3-2-next20-decisions.json')?'data/research/v3-2-acceptance.json':existsSync('data/research/v3-1-reviewed-promotions.json')?'data/research/v3-1-acceptance.json':'data/research/v3-acceptance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));

/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const sourced=layer=>['A','B'].includes(layer);
const counts=rows=>rows.reduce((out,row)=>(out[row.layer]++,out),{A:0,B:0,C:0,D:0,E:0});
async function main(){
 const baselineMode=process.argv.includes('--baseline');
 const argument=(name,fallback)=>{const index=process.argv.indexOf(name);return index<0?fallback:process.argv[index+1]};
 const {normalizeRdwVehicle}=await import('../src/lib/rdw.ts');
 const {resolveRdwTuningEstimate}=await import('../src/lib/rdw-tuning-estimate.ts');
 const {matchSourcedProfile}=await import('../src/lib/sourced-tuning-match.ts');
 const {sourcedTuningProfiles:profiles,tuningDatasetFingerprint}=await import('../src/data/tuning-profiles/index.ts');
 const samples=read('data/research/nl-rdw-v3-qa-sample.json'),outputs=read('data/research/nl-top-groups-output-sample.json');
 const queue=read('data/research/nl-output-variant-priority.json'),priority=read('data/research/nl-technical-priority-v3.json');
 const fleet=new Map(read('data/research/nl-fleet-model-priority.json').groups.map(g=>[g.id,g]));
 const original222=new Set(read('data/research/nl-rdw-live-sample.json').rows.map(r=>r.sampleId));
 const v3=read('data/research/v3-rdw-validation.json');
 const fixed344=new Set(v3.rows.filter(r=>r.layer!=='E').map(r=>r.sampleId));
 const stageSummary=profile=>Object.fromEntries(['stage1','stage2','stage3'].map((key,index)=>{
  const s=profile?.stages[index];return [key,s?{powerHp:s.powerHp,torqueNm:s.torqueNm,powerRangeHp:s.powerRangeHp,torqueRangeNm:s.torqueRangeNm,provenance:s.provenance,customHardware:Boolean(s.customHardware)}:null];
 }));
 const replay=(row,indexedCheck=false)=>{
  const value=normalizeRdwVehicle(row.vehicle,row.fuels,'SAMPLE'),v=value.vehicle;
  const identity={make:v.make,model:v.model,fuel:v.fuel??'',registeredPowerKw:v.engine.powerKw,stockPowerHp:v.engine.powerHp,displacementCc:v.engine.displacementCc,cylinders:v.engine.cylinders,firstAdmissionYear:v.registration.firstAdmissionYear,type:v.type,variant:v.variant,execution:v.execution};
  if(indexedCheck){const input={make:v.make,model:v.model,fuel:v.fuel,registeredPower:v.engine.powerKw?{value:v.engine.powerKw,unit:'kW'}:undefined,displacementCc:v.engine.displacementCc,cylinders:v.engine.cylinders,firstRegistrationYear:v.registration.firstAdmissionYear,type:v.type,variant:v.variant,execution:v.execution};assert.deepEqual(matchSourcedProfile(input,profiles),matchSourcedProfile(input,profiles,{indexed:false}),row.sampleId);}
  return {sampleId:row.sampleId,groupId:row.groupId,identity,layer:value.tuningEstimate.coverageClass??'E',selectedProfile:value.tuningEstimate.profile?.id,...stageSummary(value.tuningEstimate.profile),quote:value.tuningQuote,reasons:value.tuningEstimate.reasonCodes};
 };
 const rows=samples.rows.map(row=>replay(row,true));
 const observedRows=outputs.rows.map(row=>{const r=replay(row);return {sampleId:r.sampleId,layer:r.layer,selectedProfile:r.selectedProfile}});
 const byId=new Map(observedRows.map(r=>[r.sampleId,r]));
 const observedScenarios=queue.groups.flatMap(g=>g.observedOutputVariants.map((v,index)=>({groupId:g.groupId,index,sampleIds:v.sampleIds,sourced:v.sampleIds.every(id=>sourced(byId.get(id).layer))})));
 const top50=priority.groups.filter(g=>g.priorityRank<=50).map(g=>{
  const variants=g.variants.map(v=>{const r=resolveRdwTuningEstimate({make:g.make,model:g.model,fuel:v.fuel,displacementCc:g.displacementCc,powerHp:v.stockPowerHp,firstRegistrationYear:v.scenarioYear,cylinders:fleet.get(g.groupId)?.cylinders,type:v.type,variant:v.variant,execution:v.execution,...(v.registeredPowerKw?{registeredPower:{value:v.registeredPowerKw,unit:'kW'}}:{})});return r.coverageClass??'E'});
  return {groupId:g.groupId,rank:g.priorityRank,scenarioCount:variants.length,layer:variants.length?variants.sort().at(-1):'E'};
 });
 const fieldScope=rows.filter(r=>sourced(r.layer)).reduce((a,r)=>{for(const key of ['stage1','stage2','stage3'])if(r[key]?.powerHp!==undefined&&r[key]?.torqueNm!==undefined&&r[key]?.provenance!=='generic-indicative')a[key]++;return a},{stage1:0,stage2:0,stage3:0});
 const inputFiles=['nl-rdw-v3-qa-sample.json','nl-rdw-live-sample.json','nl-top-groups-output-sample.json','nl-technical-priority-v3.json','nl-output-variant-priority.json','v3-1-next20.json'];
 const inputSha256=Object.fromEntries(inputFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync('data/research/'+file)).digest('hex')]));
 const summary={profiles:profiles.length,multiSourceProfiles:profiles.filter(p=>p.stage1SourceCount>1).length,datasetNumericStages:{stage1:profiles.length,stage2:profiles.filter(p=>p.stage2).length,stage3:profiles.filter(p=>p.stage3).length},layers:counts(rows),sourced400:rows.filter(r=>sourced(r.layer)).length,ordinaryIce:{size:fixed344.size,sourced:rows.filter(r=>fixed344.has(r.sampleId)&&sourced(r.layer)).length},original222:rows.filter(r=>original222.has(r.sampleId)&&sourced(r.layer)).length,observedSampleRows:observedRows.length,observedScenarioCount:observedScenarios.length,sourcedScenarios:observedScenarios.filter(s=>s.sourced).length,strictTop50:top50.filter(g=>sourced(g.layer)).length,fieldScope};
 summary.sourcedOrReferenceStages=Object.fromEntries(['stage1','stage2','stage3'].map(key=>[key,rows.filter(r=>['reference','multi-source','single-source'].includes(r[key]?.provenance)&&((r[key].powerHp>0&&r[key].torqueNm>0)||(r[key].powerRangeHp&&r[key].torqueRangeNm))).length]));
 assert.equal(rows.length,400);assert.equal(observedRows.length,3000);assert.equal(observedScenarios.length,1862);assert.equal(fixed344.size,344);assert.equal(original222.size,222);assert.equal(top50.length,50);
 let transitions=[];
 if(baselineMode){assert.equal(summary.profiles,1246);assert.deepEqual(summary.layers,{A:35,B:133,C:15,D:161,E:56});assert.equal(summary.sourcedScenarios,737);assert.equal(summary.strictTop50,7);assert.equal(summary.original222,89);
  assert.equal(rows.filter((r,i)=>JSON.stringify(r.quote)!==JSON.stringify(v3.rows[i].quote)).length,0);assert.equal(rows.filter((r,i)=>JSON.stringify(r.identity)!==JSON.stringify(v3.rows[i].identity)).length,0);
 }else{
  const before=read(argument('--compare','data/research/v3-2-baseline.json'));assert.deepEqual(inputSha256,before.inputSha256,'Frozen cohort files changed');
  const beforeMap=new Map(before.rows.map(r=>[r.sampleId,r]));
  transitions=rows.flatMap(r=>JSON.stringify(r)===JSON.stringify(beforeMap.get(r.sampleId))?[]:[{sampleId:r.sampleId,before:beforeMap.get(r.sampleId),after:r}]);
  summary.quoteChanges=transitions.filter(t=>JSON.stringify(t.before.quote)!==JSON.stringify(t.after.quote)).length;
  summary.identityChanges=transitions.filter(t=>JSON.stringify(t.before.identity)!==JSON.stringify(t.after.identity)).length;
  summary.gains=transitions.filter(t=>!sourced(t.before.layer)&&sourced(t.after.layer)).length;
  summary.demotions=transitions.filter(t=>sourced(t.before.layer)&&!sourced(t.after.layer)).length;
  summary.referencePromotions=transitions.filter(t=>sourced(t.before.layer)&&t.after.stage1?.provenance==='reference').length;
  summary.stageValueChanges=transitions.filter(t=>['stage1','stage2','stage3'].some(key=>JSON.stringify(t.before[key])!==JSON.stringify(t.after[key]))).length;
  summary.newlyUnresolved=transitions.filter(t=>!t.before.reasons.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS')&&t.after.reasons.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS')).length;
  assert.equal(summary.quoteChanges,0,'STOP: inspect every quote difference individually');assert.equal(summary.identityChanges,0);
 }
 const result={baselineHead:'14ca5b91044fb29f2747c2079df5aca9781fba9f',datasetFingerprint:tuningDatasetFingerprint,method:'Offline production resolver over unchanged sanitized inputs. Frozen Top-50 published/live scenario membership is reevaluated without rebuilding or reranking it. These purposive samples do not estimate fleet prevalence.',inputSha256,summary,top50,rows,observedRows,observedScenarios,...(!baselineMode?{transitions}:{})};
 const file=argument('--output',`data/research/v3-2-${baselineMode?'baseline':'results'}.json`);
 if(baselineMode&&fs.existsSync(file))throw Error('Baseline already frozen; do not overwrite');
 fs.writeFileSync(file,JSON.stringify(result)+'\n');console.log(JSON.stringify(summary,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});

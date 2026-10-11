import assert from 'node:assert/strict';
import fs from 'node:fs';
import snapshot from '../data/research/nl-compact-vans-20261011.json' with {type:'json'};
import {reviewedCompactVanApplications} from '../src/data/reviewed-rdw-compact-vans.ts';
import {resolveVerifiedRdwApplication} from '../src/data/verified-rdw-applications.ts';
import {normalizeRdwVehicle} from '../src/lib/rdw.ts';
import {platePerformanceSummary,formatPerformanceRange} from '../src/lib/plate-performance-summary.ts';
import type {EstimateMatchInput} from '../src/data/tuning-estimates.ts';
import {nlVanModels,nlVanPending} from '../src/data/nl-vans-seo.ts';

assert.equal(reviewedCompactVanApplications.length,9);
assert.equal(new Set(reviewedCompactVanApplications.map(a=>a.id)).size,9);
assert.equal(snapshot.baselineCommit,'5520827581bf5583d003a89e3488f5b58a1d05d0');
assert.equal(snapshot.baselineCounts.rows,743);
assert.equal(snapshot.baselineCounts.linked,431);
assert.equal(snapshot.groups.length,snapshot.baseline.length);
const sourceLinked=(r:ReturnType<typeof normalizeRdwVehicle>)=>{
 const p=r.tuningEstimate.profile,s=p?.stages.find(x=>x.name==='Stage 1');
 return !!(s&&(s.powerHp||s.powerRangeHp)&&p?.sourceReferences.some(x=>x.url?.startsWith('https://')));
};
function normalized(g:{make:string;model:string;type:string|null;cc:number|null;cylinders:number|null;year:number;kw:number|null;fuel:string}){
 return normalizeRdwVehicle({merk:g.make,handelsbenaming:g.model,type:g.type??undefined,
  cilinderinhoud:g.cc==null?undefined:String(g.cc),aantal_cilinders:g.cylinders==null?undefined:String(g.cylinders),
  datum_eerste_toelating:g.year+'0615',datum_eerste_toelating_dt:g.year+'-06-15T00:00:00'},
  [{brandstof_omschrijving:g.fuel,nettomaximumvermogen:g.kw==null?undefined:String(g.kw)}],'QA0000');
}
let total=0,after=0,newlyLinked=0,negative=0;
const perModel=new Map<string,{observations:number;before:number;after:number}>();
const unresolved:typeof snapshot.groups=[];
for(let i=0;i<snapshot.groups.length;i++){
 const g=snapshot.groups[i],old=snapshot.baseline[i],result=normalized(g),linked=sourceLinked(result);
 assert.ok(!('kenteken' in g)&&!('vin' in g)&&!('execution' in g),'No customer identity in frozen aggregate');
 if(old.linked)assert.ok(linked,'Previously source-linked technical identity regressed: '+JSON.stringify(g));
 total+=g.observed;if(linked)after+=g.observed;if(linked&&!old.linked)newlyLinked+=g.observed;
 const key=g.make+' '+g.model,stats=perModel.get(key)||{observations:0,before:0,after:0};
 stats.observations+=g.observed;if(old.linked)stats.before+=g.observed;if(linked)stats.after+=g.observed;
 perModel.set(key,stats);if(!linked)unresolved.push(g);
}
assert.equal(total,743);
assert.ok(newlyLinked>0);
assert.equal(after-snapshot.baselineCounts.linked,newlyLinked);
for(const app of reviewedCompactVanApplications){
 assert.equal(app.sources.length>=2,true);
 assert.ok(new Set(app.sources.map(s=>new URL(s.url??'').hostname.replace(/^www\./,''))).size>=2);
 assert.ok(app.sources.every(s=>s.sourceType==='tuner'&&s.retrievalMethod==='page'&&s.url?.startsWith('https://')));
 const base:EstimateMatchInput={make:app.make,model:app.allowedRdwModels[0],type:app.requiredRdwType,
  firstRegistrationYear:app.yearFrom,firstRegistrationDate:app.yearFrom+'-06-15',displacementCc:app.displacementCc,
  cylinders:4,registeredPower:{value:app.registeredPowerKw,unit:'kW'},fuel:'Diesel'};
 const r=resolveVerifiedRdwApplication(base);
 assert.equal(r?.profile?.id,app.id);
 assert.deepEqual(r?.profile?.stages[0].powerRangeHp,app.powerRangeHp);
 assert.equal(r?.profile?.verificationRequired,true);
 for(const stage of r?.profile?.stages.slice(1)??[]){assert.equal(stage.powerHp,undefined);assert.equal(stage.powerRangeHp,undefined);assert.equal(stage.torqueNm,undefined);assert.equal(stage.torqueRangeNm,undefined);}
 for(let y=app.yearFrom;y<=app.yearTo;y++)assert.equal(resolveVerifiedRdwApplication({...base,firstRegistrationYear:y,firstRegistrationDate:y+'-06-15'})?.profile?.id,app.id);
 const mutations:Partial<EstimateMatchInput>[]=[
  {firstRegistrationYear:app.yearFrom-1,firstRegistrationDate:(app.yearFrom-1)+'-06-15'},
  {firstRegistrationYear:app.yearTo+1,firstRegistrationDate:(app.yearTo+1)+'-06-15'},
  {type:undefined},{type:'7'},{displacementCc:1560},{cylinders:3},
  {registeredPower:{value:app.registeredPowerKw+1,unit:'kW'}},{registeredPower:{value:app.registeredPowerKw-1,unit:'kW'}},
  {registeredPower:undefined},{fuel:'Benzine'},{fuel:'CNG'},{fuel:'Diesel / Elektriciteit'},
  {make:'OTHER BRAND'},{model:'UNKNOWN VAN'},{stockTorqueNm:app.stockTorqueNm+40}];
 for(const patch of mutations){assert.notEqual(resolveVerifiedRdwApplication({...base,...patch})?.profile?.id,app.id,'Unsafe technical match '+JSON.stringify(patch));negative++;}
}
assert.equal(negative,135);
// Anonymous reproduction of the reported vehicle's engine facts, never a plate rule.
const customer=normalized({make:'CITROEN',model:'BERLINGO',type:'E',cc:1499,cylinders:4,year:2021,kw:56,fuel:'Diesel'});
assert.equal(customer.vehicle.engine.powerKw,56);assert.equal(customer.vehicle.engine.powerHp,76);
assert.equal(customer.tuningEstimate.profile?.id,'rdw-bulk-15-citroen-berlingo-e-15bluehdi75-2019-23');
const summary=platePerformanceSummary(customer.tuningEstimate.profile,customer.tuningEstimate.profile?.stages[0],customer.vehicle.engine.powerHp);
assert.deepEqual(summary.power,[115,130]);assert.deepEqual(summary.powerGain,[39,54]);
assert.deepEqual(summary.torque,[300,320]);assert.deepEqual(summary.torqueGain,[70,90]);
assert.equal(formatPerformanceRange(summary.powerGain,'pl','KM',true),'+39–54 KM');
assert.equal(formatPerformanceRange(summary.power,'nl','pk'),'115–130 pk');
assert.equal(formatPerformanceRange([160,160],'en','hp'),'160 hp');
assert.equal(platePerformanceSummary(undefined,undefined,76).power,undefined);
assert.equal(platePerformanceSummary(undefined,undefined,undefined).stockPower,undefined);
assert.equal(platePerformanceSummary(customer.tuningEstimate.profile,undefined,76).powerGain,undefined);
assert.equal(formatPerformanceRange(undefined,'pl','KM'),undefined);
assert.equal(platePerformanceSummary(customer.tuningEstimate.profile,{...customer.tuningEstimate.profile!.stages[0],name:'Stage 3+'},76).numeric,false);
assert.equal(platePerformanceSummary(customer.tuningEstimate.profile,{...customer.tuningEstimate.profile!.stages[0],customHardware:true},76).numeric,false);
const report={date:'2026-10-11',method:snapshot.method,baselineCommit:snapshot.baselineCommit,
 sampleRows:total,sourceLinkedBefore:431,sourceLinkedAfter:after,netNewSourceLinked:newlyLinked,negativeIdentityChecks:negative,
 byModel:Object.fromEntries(perModel),unresolved,
 familyReadiness:nlVanModels.map(m=>({make:m.make,model:m.model,slug:m.slug,reviewedApplications:m.applications.length})),
 pendingFamilies:nlVanPending.map(m=>m.make+' '+m.model),
 limits:'This is a purposive technical regression sample, not Netherlands-wide coverage. All-van/fleet coverage remains unmeasured. A missing numeric result is not a claim that tuning is impossible.',
 privacy:'No customer plates, VINs or full execution codes are stored.'};
if(process.argv.includes('--write'))fs.writeFileSync('docs/compact-van-coverage-20261011.json',JSON.stringify(report,null,2)+'\n');
console.log('COMPACT_VAN_COVERAGE_PASS',JSON.stringify({...report,familyReadiness:undefined,unresolved:undefined}));

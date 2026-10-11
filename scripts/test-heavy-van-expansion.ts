import assert from 'node:assert/strict';
import fs from 'node:fs';
import snapshot from '../data/research/nl-commercial-vans-20261011.json' with {type:'json'};
import baseline from '../data/research/heavy-vans-baseline-20261011.json' with {type:'json'};
import audit from '../data/research/heavy-van-source-audit-20261011.json' with {type:'json'};
import {heavyVanFamilies} from '../src/data/reviewed-heavy-van-families.ts';
import {commercialApplicationId,reviewedCommercialVanApplications} from '../src/data/reviewed-commercial-vans.ts';
import {normalizeRdwVehicle} from '../src/lib/rdw.ts';
import {resolveVerifiedRdwApplication} from '../src/data/verified-rdw-applications.ts';
import {getManualCatalogResult} from '../src/lib/manual-catalog-result.ts';
import type {EstimateMatchInput} from '../src/data/tuning-estimates.ts';
assert.equal(baseline.baselineCommit,'d3f69addf513f7cf3cd0e2e580af34f127de08ea');
assert.equal(baseline.rows,810);assert.equal(baseline.linked,426);
assert.equal(baseline.baseline.length,snapshot.groups.length);
assert.equal(heavyVanFamilies.length,6);
const newIds=new Set(heavyVanFamilies.flatMap(f=>f.scopes.map(s=>commercialApplicationId(f,s))));
const apps=reviewedCommercialVanApplications.filter(a=>newIds.has(a.id));assert.equal(apps.length,15);
const sourced=(r:ReturnType<typeof normalizeRdwVehicle>)=>{const p=r.tuningEstimate.profile,s=p?.stages.find(s=>s.name==='Stage 1');return !!(s&&(s.powerHp||s.powerRangeHp)&&p?.sourceReferences.some(x=>x.url?.startsWith('https://')));};
let after=0,net=0,observations=0;const counts=new Map<string,number>(),perMake=new Map<string,{rows:number;before:number;after:number}>();const unresolved=[];
for(let i=0;i<snapshot.groups.length;i++){
 const g=snapshot.groups[i],old=baseline.baseline[i];
 const r=normalizeRdwVehicle({merk:g.make,handelsbenaming:g.model,type:g.type??undefined,cilinderinhoud:g.cc==null?undefined:String(g.cc),aantal_cilinders:g.cylinders==null?undefined:String(g.cylinders),datum_eerste_toelating:g.year+'0615'},[{brandstof_omschrijving:g.fuel,nettomaximumvermogen:g.kw==null?undefined:String(g.kw)}],'QA0000');
 const linked=sourced(r),id=r.tuningEstimate.profile?.id;
 observations+=g.observed;if(linked)after+=g.observed;if(linked&&!old.linked)net+=g.observed;
 if(old.linked)assert.ok(linked,'Regression in an existing sourced lookup: '+JSON.stringify(g));
 if(id&&newIds.has(id)){counts.set(id,(counts.get(id)||0)+g.observed);assert.equal(g.fuel,'Diesel');}
 const p=perMake.get(g.make)||{rows:0,before:0,after:0};p.rows+=g.observed;p.before+=old.linked?g.observed:0;p.after+=linked?g.observed:0;perMake.set(g.make,p);
 if(!linked)unresolved.push(g);
}
assert.equal(observations,810);assert.equal(after-426,net);assert.ok(net>0);assert.equal(counts.size,15,'Each new finite scope must have positive observed RDW evidence');
let strictCases=0;
for(const a of apps){
 const b:EstimateMatchInput={make:a.make,model:a.allowedRdwModels[0],type:a.requiredRdwType,firstRegistrationYear:a.yearFrom,firstRegistrationDate:a.yearFrom+'-06-15',displacementCc:a.displacementCc,cylinders:a.cylinders,registeredPower:{unit:'kW',value:a.registeredPowerKw},fuel:'Diesel'};
 assert.equal(resolveVerifiedRdwApplication(b)?.profile?.id,a.id);
 for(const power of [114.6,115,118,129,132,100,110]){if(Math.abs(power-a.registeredPowerKw)<0.26)continue;assert.notEqual(resolveVerifiedRdwApplication({...b,registeredPower:{unit:'kW',value:power}})?.profile?.id,a.id);strictCases++;}
 for(const s of a.sources){const seen=audit.find(x=>x.url===s.url);assert.equal(seen?.status,200);assert.ok(seen?.sha256&&seen?.renderedSha256,'Must review rendered source, not a placeholder');}
}
for(const f of heavyVanFamilies){const r=getManualCatalogResult('reviewed-van-'+f.id,f.from);assert.equal(r?.status,'source-comparison');assert.equal(r?.vehicle.stockPowerKw,f.kw);assert.deepEqual(r?.sources.map(s=>[s.powerHp,s.torqueNm]),f.sources.map(s=>[s.stage1Hp,s.stage1Nm]));assert.ok(!('type' in r!.vehicle)&&!('plate' in r!.vehicle));assert.equal(r?.stage1?.stockTorqueNm,f.stockNm);}
const old=getManualCatalogResult('reviewed-van-daily-23-156-euro6',2019),later=getManualCatalogResult('reviewed-van-daily-23-156-euro6df',2021);
assert.equal(old?.stage1?.stockTorqueNm,350);assert.equal(later?.stage1?.stockTorqueNm,400);
assert.equal(getManualCatalogResult('reviewed-van-daily-30-180-euro6',2022),undefined,'No earlier 132kW source copied into newer 129kW family');
const report={date:'2026-10-11',baselineCommit:baseline.baselineCommit,method:snapshot.method,sampleObservations:observations,beforeSourceLinked:426,afterSourceLinked:after,netNewSourceLinked:net,perMake:Object.fromEntries(perMake),newEngineFamilies:6,newExactScopes:15,extraPowerBoundaryChecks:strictCases,matchedScopes:Object.fromEntries(counts),unresolved,holds:['Daily 129kW new-generation evidence not proven by pages explicitly labelled2019','Movano 100kW 135/136: source original torque and variant conflict; no forced match','2024+ engine/ECU versions and unobserved types','Electric,CNG and unknown fuel/engine remain separate'],limits:'The unchanged810-observation selected quota sample is NOT national fleet coverage. Counts are not summed across previous samples.'};
if(process.argv.includes('--write'))fs.writeFileSync('docs/heavy-van-expansion-20261011.json',JSON.stringify(report,null,2)+'\n');
console.log('HEAVY_VAN_EXPANSION_PASS',JSON.stringify({...report,matchedScopes:undefined,unresolved:undefined}));

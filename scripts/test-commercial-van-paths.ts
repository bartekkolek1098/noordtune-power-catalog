import assert from 'node:assert/strict';
import fs from 'node:fs';
import snapshot from '../data/research/nl-commercial-vans-20261011.json' with {type:'json'};
import audit from '../data/research/commercial-van-source-audit-20261011.json' with {type:'json'};
import {commercialVanFamilies,commercialApplicationId,reviewedCommercialVanApplications} from '../src/data/reviewed-commercial-vans.ts';
import {normalizeRdwVehicle} from '../src/lib/rdw.ts';
import {resolveVerifiedRdwApplication} from '../src/data/verified-rdw-applications.ts';
import {getManualCatalogResult} from '../src/lib/manual-catalog-result.ts';
import {getBrands,getModelsForBrand,getYearsForModel,getVehicleSelectorItems,searchVehicleSelectorItems} from '../src/data/catalog.ts';
import type {EstimateMatchInput} from '../src/data/tuning-estimates.ts';

assert.equal(snapshot.baselineCommit,'dfd6c110dfd0a8d62207e9179090fccf4c6b69be');
assert.deepEqual(snapshot.baselineCounts,{rows:810,linked:281});
assert.equal(snapshot.groups.length,174);assert.equal(snapshot.baseline.length,174);
assert.equal(commercialVanFamilies.length,9);assert.equal(reviewedCommercialVanApplications.length,12);
const numeric=(r:ReturnType<typeof normalizeRdwVehicle>)=>{const p=r.tuningEstimate.profile,s=p?.stages.find(x=>x.name==='Stage 1');return !!(s&&(s.powerHp||s.powerRangeHp)&&p?.sourceReferences.some(x=>x.url?.startsWith('https://')));};
function normalized(g:typeof snapshot.groups[number]){return normalizeRdwVehicle({merk:g.make,handelsbenaming:g.model,type:g.type??undefined,cilinderinhoud:g.cc==null?undefined:String(g.cc),aantal_cilinders:g.cylinders==null?undefined:String(g.cylinders),datum_eerste_toelating:g.year+'0615',datum_eerste_toelating_dt:g.year+'-06-15T00:00:00'},[{brandstof_omschrijving:g.fuel,nettomaximumvermogen:g.kw==null?undefined:String(g.kw)}],'QA0000');}
const addedIds=new Set(reviewedCommercialVanApplications.map(x=>x.id)),matched=new Map<string,number>();
let after=0,net=0,negative=0;
const perMake=new Map<string,{observations:number;before:number;after:number;electric:number}>(),unresolved:typeof snapshot.groups=[];
for(let i=0;i<snapshot.groups.length;i++){
 const g=snapshot.groups[i],before=snapshot.baseline[i],r=normalized(g),linked=numeric(r);
 assert.ok(!('kenteken'in g)&&!('vin'in g)&&!('execution'in g));
 if(before.linked)assert.ok(linked,'Existing sourced runtime outcome lost: '+JSON.stringify(g));
 if(linked)after+=g.observed;if(linked&&!before.linked)net+=g.observed;
 const stats=perMake.get(g.make)||{observations:0,before:0,after:0,electric:0};stats.observations+=g.observed;if(before.linked)stats.before+=g.observed;if(linked)stats.after+=g.observed;if(g.fuel==='Elektriciteit')stats.electric+=g.observed;perMake.set(g.make,stats);
 const id=r.tuningEstimate.profile?.id;if(id&&addedIds.has(id))matched.set(id,(matched.get(id)||0)+g.observed);
 if(!linked)unresolved.push(g);
 if(g.fuel!=='Diesel')assert.ok(!id||!addedIds.has(id),'Diesel reference inherited by non-diesel van');
}
assert.equal(after-281,net);assert.ok(net>0);assert.equal(matched.size,12,'Every new application must match a frozen observed cell');
for(const a of reviewedCommercialVanApplications){
 const b:EstimateMatchInput={make:a.make,model:a.allowedRdwModels[0],type:a.requiredRdwType,firstRegistrationYear:a.yearFrom,firstRegistrationDate:a.yearFrom+'-06-15',displacementCc:a.displacementCc,cylinders:4,registeredPower:{unit:'kW',value:a.registeredPowerKw},fuel:'Diesel'};
 assert.ok(a.sources.length>=2);assert.ok(new Set(a.sources.map(s=>new URL(s.url??'').hostname.replace(/^www\./,''))).size>=2);
 for(const s of a.sources){const seen=audit.find(x=>x.url===s.url);assert.ok(seen?.status===200&&seen.sha256,'Source not fetched successfully');if(s.url?.includes('ecu-soft'))assert.ok(seen&&'renderedSha256'in seen,'Dynamic source not rendered');}
 const p=resolveVerifiedRdwApplication(b)?.profile;assert.equal(p?.id,a.id);assert.equal(p?.verificationRequired,true);assert.deepEqual(p?.stages[0].powerRangeHp,a.powerRangeHp);
 for(const s of p?.stages.slice(1)??[]){assert.equal(s.powerHp,undefined);assert.equal(s.powerRangeHp,undefined);assert.equal(s.torqueNm,undefined);assert.equal(s.torqueRangeNm,undefined);}
 for(let y=a.yearFrom;y<=a.yearTo;y++)assert.equal(resolveVerifiedRdwApplication({...b,firstRegistrationYear:y,firstRegistrationDate:y+'-06-15'})?.profile?.id,a.id);
 const mutations:Partial<EstimateMatchInput>[]=[{firstRegistrationYear:a.yearFrom-1,firstRegistrationDate:(a.yearFrom-1)+'-06-15'},{firstRegistrationYear:a.yearTo+1,firstRegistrationDate:(a.yearTo+1)+'-06-15'},{type:undefined},{type:'DIFFERENT'},{displacementCc:a.displacementCc+5},{cylinders:3},{registeredPower:{unit:'kW',value:a.registeredPowerKw+1}},{registeredPower:{unit:'kW',value:a.registeredPowerKw-1}},{registeredPower:undefined},{fuel:'Benzine'},{fuel:'CNG'},{fuel:'Diesel / Elektriciteit'},{make:'OTHER MAKE'},{model:'UNKNOWN VAN'},{stockTorqueNm:a.stockTorqueNm+40}];
 for(const x of mutations){assert.notEqual(resolveVerifiedRdwApplication({...b,...x})?.profile?.id,a.id,'Unsafe match '+JSON.stringify(x));negative++;}
}
assert.equal(negative,180);
for(const f of commercialVanFamilies){
 const id='reviewed-van-'+f.id;
 assert.ok(getBrands().includes(f.selectorBrand));assert.ok(getModelsForBrand(f.selectorBrand).includes(f.model));
 for(let y=f.from;y<=f.to;y++){
  assert.ok(getYearsForModel(f.selectorBrand,f.model).includes(y));
  assert.ok(getVehicleSelectorItems({brand:f.selectorBrand,model:f.model,year:y},60).some(x=>x.id===id&&x.kind==='reviewed'));
  const r=getManualCatalogResult(id,y);assert.equal(r?.status,'source-comparison');assert.equal(r?.vehicle.stockPowerKw,f.kw);assert.equal(r?.vehicle.stockPowerHp,Math.round(f.kw*1.359621617));assert.equal(r?.vehicle.selectedYear,y);
  assert.deepEqual(r?.sources.map(x=>[x.url,x.powerHp,x.torqueNm]),f.sources.map(x=>[x.url,x.stage1Hp,x.stage1Nm]));
  assert.ok(r?.reviewConditions?.nl);assert.ok(!('plate'in r!.vehicle)&&!('type'in r!.vehicle)&&!('vin'in r!.vehicle));
 }
 assert.ok(searchVehicleSelectorItems(f.selectorBrand+' '+f.model+' '+f.engine,60).some(x=>x.id===id));
 const missingYear=getManualCatalogResult(id);assert.equal(missingYear?.status,'select-year');assert.equal(missingYear?.stage1,undefined);
 assert.equal(getManualCatalogResult(id,f.from-1),undefined);assert.equal(getManualCatalogResult(id,f.to+1),undefined);assert.equal(getManualCatalogResult(id,NaN),undefined);
 if(f.hideManualStockTorque)assert.equal(getManualCatalogResult(id,f.from)?.stage1?.stockTorqueNm,undefined);
 for(const s of f.scopes)assert.ok(matched.has(commercialApplicationId(f,s)));
}
assert.equal(getManualCatalogResult('reviewed-van-forged-id',2021),undefined);
const oldDaily=getManualCatalogResult('reviewed-van-daily-23-136-euro6',2019),newDaily=getManualCatalogResult('reviewed-van-daily-23-136-euro6df',2021);
assert.deepEqual(oldDaily?.stage1?.powerHp,[170,190]);assert.deepEqual(newDaily?.stage1?.powerHp,[165,165]);
const report={date:'2026-10-11',baselineCommit:snapshot.baselineCommit,method:snapshot.method,sampleObservations:810,beforeSourceLinked:281,afterSourceLinked:after,netNewSourceLinked:net,byMake:Object.fromEntries(perMake),reviewedEngineFamilies:9,exactRdwScopes:12,negativeIdentityChecks:negative,observationsByNewApplication:Object.fromEntries(matched),unresolved,manualFamiliesVerified:9,disclaimer:'Purposive, nonrepresentative sample. 25 model pages do not mean all van engines are covered. No customer plates or VINs stored.'};
if(process.argv.includes('--write'))fs.writeFileSync('docs/commercial-van-paths-20261011.json',JSON.stringify(report,null,2)+'\n');
console.log('COMMERCIAL_VAN_PATHS_PASS',JSON.stringify({...report,unresolved:undefined,observationsByNewApplication:undefined}));

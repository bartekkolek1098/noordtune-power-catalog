import assert from 'node:assert/strict';
import fs from 'node:fs';
import {engineCatalog} from '../src/data/catalog.ts';
import {normalizeRdwVehicle} from '../src/lib/rdw.ts';
import {resolveRdwTuningEstimate} from '../src/lib/rdw-tuning-estimate.ts';
import {getCatalogEstimateProfile, type TuningEstimateProfile} from '../src/data/tuning-estimates-shared.ts';
import {sourcedTuningProfiles} from '../src/data/tuning-profiles/index.ts';
import {compareStages} from '../src/lib/stage-presentation.ts';
import {resolveStageQuote} from '../src/data/pricing.ts';
const sample=JSON.parse(fs.readFileSync('data/research/nl-rdw-v3-qa-sample.json','utf8'));
const rows: {id:string;profile?:TuningEstimateProfile;quote:ReturnType<typeof resolveStageQuote>}[]=sample.rows.map((row: {sampleId:string;vehicle:Parameters<typeof normalizeRdwVehicle>[0];fuels:Parameters<typeof normalizeRdwVehicle>[1]})=>{
 const normalized=normalizeRdwVehicle(row.vehicle,row.fuels,'SYNTHETIC'),v=normalized.vehicle;
 const result=resolveRdwTuningEstimate({make:v.make,model:v.model,fuel:v.fuel,registeredPower:v.engine.powerKw?{value:v.engine.powerKw,unit:'kW'}:undefined,displacementCc:v.engine.displacementCc,cylinders:v.engine.cylinders,firstRegistrationYear:v.registration.firstAdmissionYear,type:v.type,variant:v.variant,execution:v.execution});
 return {id:row.sampleId,profile:result.profile,quote:normalized.tuningQuote};
});
function audit(items:typeof rows){return items.map(({id,profile})=>{
 const first=profile?.stages[0],second=profile?.stages[1];
 const source=sourcedTuningProfiles.find(p=>p.id===second?.sourceProfileId);
 const expected=source?.stage2&&['single-source','multi-source'].includes(second?.provenance??'')?{powerHp:source.stage2.selectedPowerHp,torqueNm:source.stage2.selectedTorqueNm}:undefined;
 const comparison=second?compareStages(first,second,expected):{power:'unavailable',torque:'unavailable'};
 return {id,profile:profile?.id,stage1:first?{power:first.powerRangeHp??first.powerHp,torque:first.torqueRangeNm??first.torqueNm,provenance:first.provenance}:null,stage2:second?{power:second.powerRangeHp??second.powerHp,torque:second.torqueRangeNm??second.torqueNm,provenance:second.provenance,planningBasis:second.planningBasis}:null,comparison};
});}
const cohort=audit(rows),published=audit(engineCatalog.map(v=>({id:v.id,profile:getCatalogEstimateProfile(v),quote:resolveStageQuote(v,v.stages[0])})));
const categories=['A-sourced-equal','B-rounding','C-generic-overlap','D-clamped','E-scope-difference','F-mapping-error','catalog-equal','distinct','unavailable'];
const counts=(r:typeof cohort)=>Object.fromEntries(['power','torque'].map(field=>[field,Object.fromEntries(categories.map(c=>[c,r.filter(row=>row.comparison[field as 'power'|'torque']===c).length]))]));
assert.equal(rows.length,400);assert.equal(published.length,24);
const overlaps=(items:typeof cohort)=>Object.fromEntries(['power','torque'].map(field=>[field,{identicalIntervals:items.filter(r=>r.stage1?.[field as 'power'|'torque']!==undefined&&r.stage2?.[field as 'power'|'torque']!==undefined&&JSON.stringify(r.stage1[field as 'power'|'torque'])===JSON.stringify(r.stage2[field as 'power'|'torque'])).length,clampedFlatPeaks:items.filter(r=>{const value=r.stage2?.[field as 'power'|'torque'];return r.comparison[field as 'power'|'torque']==='D-clamped'&&Array.isArray(value)&&value[0]===value[1]}).length}]));
const file=process.argv[2]??'data/research/customer-flow-stage-audit.json';
const report={method:'Disjoint cause counts per field. Equality/interval intersection is inclusive. D has priority over C; E flags differing fuel or independent source identity, not proof of incompatibility. Distinct and unavailable complete the denominator. All existing numeric fields remain unchanged; generic intervals are displayed as unconfirmed configuration scenarios.',cohort:{size:400,counts:counts(cohort),overlaps:overlaps(cohort),rows:cohort},public:{size:24,counts:counts(published),overlaps:overlaps(published),rows:published}};
fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cohort:report.cohort.counts,public:report.public.counts}));

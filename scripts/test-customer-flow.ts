import assert from 'node:assert/strict';
import {engineCatalog, getVehicleSelectorItems, searchVehicleSelectorItems} from '../src/data/catalog.ts';
import {getCatalogEstimateProfile, type EstimateStage} from '../src/data/tuning-estimates-shared.ts';
import {resolveDetailsAction, detailsActionLabel} from '../src/lib/details-action.ts';
import {customerStageNotes, stageScope, compareStages} from '../src/lib/stage-presentation.ts';
import {customerProfile, customerVehicle} from '../src/lib/customer-profile.ts';
import {resolveRdwTuningEstimate} from '../src/lib/rdw-tuning-estimate.ts';
import {createVehicleQuoteMessage} from '../src/lib/whatsapp.ts';
import {resolveStageQuote} from '../src/data/pricing.ts';
import {estimateChartData} from '../src/lib/estimate-chart.ts';

const vehicle=engineCatalog[0],profile=getCatalogEstimateProfile(vehicle);
assert.equal(resolveDetailsAction(profile,engineCatalog).kind,'vehicle-page');
for(const changed of [{vehicleId:'missing'},{vehicleId:undefined,pricingProfileId:vehicle.id},{provenance:'sourced-profile' as const},{engine:'Wrong engine'},{stockPowerHp:99},{stages:profile.stages.map(s=>({...s,powerHp:999}))}]) assert.equal(resolveDetailsAction({...profile,...changed},engineCatalog).kind,'inline-configurator');
assert.equal(resolveDetailsAction(undefined,engineCatalog).kind,'unavailable');
for(const item of [...searchVehicleSelectorItems('Golf',100),...getVehicleSelectorItems({brand:'Ford',model:'Transit Connect',year:2018})]) {
 if(item.pagePath)assert(engineCatalog.some(v=>item.pagePath===`/vehicles/${v.id}`));else assert(item.kind==='reference'||item.kind==='estimate');
}
const base:EstimateStage={name:'Stage 1',powerHp:200,torqueNm:400,provenance:'single-source',sourceProfileId:'same',requirements:'RON 98',packageItems:[]};
const equal:EstimateStage={...base,name:'Stage 2',powerHp:220};
assert.equal(compareStages(base,equal).torque,'A-sourced-equal');
const generic:EstimateStage={name:'Stage 2',provenance:'generic-indicative',powerRangeHp:[200,230],torqueRangeNm:[400,400],requirements:'internal prose',packageItems:[],planningBasis:{power:{raw:[202,228],rounded:[200,230],clamped:false},torque:{raw:[350,390],rounded:[350,390],clamped:true}}};
assert.equal(compareStages(base,generic).power,'B-rounding');
assert.equal(compareStages(base,generic).torque,'D-clamped');
assert.equal(compareStages(base,{...generic,planningBasis:undefined}).power,'C-generic-overlap');
assert.equal(compareStages(base,{...equal,requirements:'RON 102'}).torque,'E-scope-difference');
assert.equal(compareStages(base,equal,{powerHp:225}).power,'F-mapping-error');
assert.equal(compareStages(base,equal).additionalTorqueEstablished,false);
assert.equal(compareStages(base,generic).additionalPowerEstablished,false);
const forbidden=/unknown-aspiration|NoordTune generic RDW indication policy|recursive Stage|Rounded local|earlier bounds|No defensible|OWNER_REVIEW|owner of NoordTune|internal prose|SOURCE_CONSENSUS/;
for(const locale of ['nl','en','pl'] as const) {
 assert(detailsActionLabel({kind:'vehicle-page',path:'/vehicles/example'},locale));
 for(const stage of [base,equal,generic,{...generic,notes:['unknown-aspiration','NEW_UNKNOWN_REASON: do not show this','No defensible stock torque source'],torqueRangeNm:undefined}]) {
  const p={...profile,stages:[base,stage]};
  const notes=customerStageNotes(stage,locale,p);
  assert.doesNotMatch(notes.join(' '),forbidden);
  const message=createVehicleQuoteMessage({locale,vehicle:'Synthetic fixture',stage:stage.name,options:[],indicativeOutput:stage,estimateNotes:notes,quote:resolveStageQuote(p,stage)});
  assert.doesNotMatch(message,forbidden);notes.forEach(note=>assert(message.includes(note)));
 }
 assert(customerStageNotes(equal,locale,{...profile,stages:[base,equal]}).some(n=>/Stage 1/.test(n)));
}
const scope=stageScope({...base,name:'Stage 2',requirements:'Stage 2 requires a sport-catalyst/downpipe and RON 98; gearbox software is recommended for automatic cars.',notes:['Provider specifically limits torque to 320 Nm for DSG7.']});
assert.deepEqual(scope.fuelRon,[98]);assert.equal(scope.hardware.find(p=>p.part==='downpipe')?.requirement,'required');assert.equal(scope.transmission,'dsg7-320');
const resolved=resolveRdwTuningEstimate({make:'BMW',model:'128ti',fuel:'Petrol',powerHp:265,displacementCc:1998,firstRegistrationYear:2022}).profile!;
const safe=customerProfile(resolved);assert.equal(safe.stages[0].powerHp,310);assert.equal(safe.stages[0].torqueNm,480);assert.equal(safe.stages[1].powerHp,320);assert.equal(safe.stages[1].torqueNm,undefined);
assert.equal(estimateChartData(safe.stages,265)[2].pk,320);assert.equal(estimateChartData(safe.stages,265)[2].nm,null);
assert.doesNotMatch(JSON.stringify(safe),/NoordTune generic RDW indication policy|no recursive Stage|Rounded local planning range|No defensible stock torque source/);
for(const v of engineCatalog){const p=getCatalogEstimateProfile(customerVehicle(v));assert.deepEqual(p.stages.map(s=>[s.powerHp,s.torqueNm]),v.stages.map(s=>[s.powerHp,s.torqueNm]));}
console.log('Customer flow: verified navigation, six comparison causes, localized scope, independent field availability and shared message/chart values PASS.');

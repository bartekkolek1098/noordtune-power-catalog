/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const profiles=read('src/data/tuning-profiles/profiles.json'),sources=read('data/research/source-pages.json');
const batch=read('data/research/batches/v3-2-targeted.json'),addedIds=new Set(batch.map(s=>s.id));
const checkpoint=read('data/research/v3-2-preservation-checkpoint.json');
const priorProfiles=profiles.filter(p=>!p.sourceIds.some(id=>addedIds.has(id)));
assert.equal(priorProfiles.length,checkpoint.profiles);
assert.equal(hash(priorProfiles),checkpoint.profilesSha256,'Every pre-existing profile, all stages and applicability must remain identical');
assert.equal(hash(sources.filter(s=>!addedIds.has(s.id))),checkpoint.sourceObservationsSha256,'Every prior observation remains identical');
const ledger=read('data/research/v3-2-next20-decisions.json');
assert.deepEqual(ledger.decisions.map(d=>d.rank),Array.from({length:20},(_,i)=>i+1));
for(const d of ledger.decisions)for(const review of d.sourcesChecked){
 const s=sources.find(s=>s.id===review.sourceId);assert.ok(s);
 assert.equal(s.url,review.url);assert.equal(s.contentSha256,review.contentSha256);assert.equal(s.retrievedAt,review.retrievedAt);
 const matches=profiles.filter(p=>p.sourceIds.includes(s.id));
 assert.equal(matches.length,review.decision==='accepted'?1:0,'Only reviewed promotions enter profiles');
 if(review.decision==='accepted')assert.ok(s.status==='retrieved'&&s.retrievalMethod!=='search-index'&&s.reviewedScope);
}
const bySource=id=>profiles.find(p=>p.sourceIds.includes(id));
assert.equal(bySource('atm-v3-2f5194f080d1abcf').stage2.selectedPowerHp,220,'Audi Stage 2 survives Stage 1-only counterpart');
assert.equal(bySource('atm-v3-3e247e3e7e5306b2').stage2.selectedPowerHp,150,'Golf Stage 2 survives Stage 1-only counterpart');
assert.equal(profiles.filter(p=>p.stage3).length,4,'No numeric Stage 3 invented or lost');
const {matchSourcedProfile}=require('../src/lib/sourced-tuning-match.ts');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const sample=read('data/research/nl-top-groups-output-sample.json');
const current=read('data/research/v3-2-results.json');
const {tuningDatasetFingerprint}=require('../src/data/tuning-profiles/index.ts');
assert.equal(current.datasetFingerprint,tuningDatasetFingerprint,'Coverage evidence must describe the current dataset');
const resolved=new Map(current.observedRows.map(r=>[r.sampleId,r]));
let recovered=0,negativeChecks=0;
for(const d of ledger.decisions.filter(d=>d.disposition==='accepted-with-bounded-scope')){
 const ids=new Set(d.sourcesChecked.filter(s=>s.decision==='accepted').map(s=>s.sourceId));
 const profileIds=new Set(profiles.filter(p=>p.sourceIds.some(id=>ids.has(id))).map(p=>p.id));
 assert.deepEqual(d.selectedProfiles.map(p=>p.id).sort(),[...profileIds].sort(),'Ledger must enumerate every promoted profile');
 for(const selected of d.selectedProfiles){const actual=profiles.find(p=>p.id===selected.id);for(const key of ['stage1','stage2','stage3'])assert.deepEqual(selected[key],actual[key],'Ledger Stage selection must match runtime data');}
 const row=sample.rows.find(r=>profileIds.has(resolved.get(r.sampleId)?.selectedProfile));assert.ok(row,`Rank ${d.rank}: at least one real frozen tuple must resolve`);
 const actual=normalizeRdwVehicle(row.vehicle,row.fuels,'SAMPLE'),v=actual.vehicle;
 assert.ok(['A','B'].includes(actual.tuningEstimate.coverageClass));recovered++;
 const input={make:v.make,model:v.model,fuel:v.fuel,registeredPower:{value:v.engine.powerKw,unit:'kW'},displacementCc:v.engine.displacementCc,firstRegistrationYear:v.registration.firstAdmissionYear,cylinders:v.engine.cylinders,type:v.type,variant:v.variant,execution:v.execution};
 for(const change of [{model:'UNRELATED SIBLING'},{fuel:v.fuel==='Diesel'?'Petrol':'Diesel'},{displacementCc:7777},{firstRegistrationYear:1990},{registeredPower:{value:777,unit:'kW'}}]){
  assert.ok(!profileIds.has(matchSourcedProfile({...input,...change},profiles).profile?.id),`Rank ${d.rank} must reject ${JSON.stringify(change)}`);negativeChecks++;
 }
}
for(const input of [
 {make:'Peugeot',model:'5008',fuel:'Petrol',displacementCc:1199,powerHp:130,firstRegistrationYear:2020},
 {make:'Fiat',model:'500',fuel:'Petrol',displacementCc:875,powerHp:85,firstRegistrationYear:2015},
 {make:'Ford',model:'Transit Connect',fuel:'Diesel',displacementCc:1499,powerHp:100,firstRegistrationYear:2019}
])assert.equal(matchSourcedProfile(input,profiles).profile,undefined,'Overlapping generations remain conditional');
assert.equal(bySource('atm-v3-b92f3d7d57449e16').stockTorqueNm,290);
assert.equal(bySource('shiftech-v2-5cc3dfcd393df5e1'),undefined,'Conflicting 300 Nm BMW application is not merged');
assert.ok(bySource('shiftech-v2-d6fc4520e5152921').stage1.conditions.includes('LARGE_GAIN_REQUIRES_EXTRA_EVIDENCE'));
assert.equal(bySource('atm-v3-46df01faaa17f8c4').yearTo,2021);
assert.equal(bySource('shiftech-v2-d6fc4520e5152921').yearFrom,2022);
assert.equal(bySource('atm-v3-bf23d490c8d1b889'),undefined);
assert.equal(current.summary.quoteChanges,0);assert.equal(current.summary.identityChanges,0);assert.equal(current.summary.demotions,0);
const beforeObserved=new Map(read('data/research/v3-2-baseline.json').observedRows.map(r=>[r.sampleId,r]));
const gainedObserved=current.observedRows.filter(r=>['A','B'].includes(r.layer)&&!['A','B'].includes(beforeObserved.get(r.sampleId).layer)).map(r=>r.sampleId).sort();
assert.deepEqual(gainedObserved,ledger.decisions.flatMap(d=>d.observedEffect.recoveredSampleIds).sort(),'All observed gains must belong to the fixed next-20 inputs');
console.log(JSON.stringify({suite:'V3.2 targeted recovery',preservedProfiles:priorProfiles.length,reviewedInputs:ledger.decisions.length,recoveredConfigurations:recovered,negativeChecks,stage2Preservation:true,overlapGuards:3,quoteChanges:0,identityChanges:0}));

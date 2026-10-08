/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const {planBrowserQa,viewportPattern}=require("./rdw-browser-qa-plan.cjs");
const {reviewedBulkRdwApplications}=require("../src/data/reviewed-rdw-bulk-batch.ts");
const {reviewedRdwBulkBatch2}=require("../src/data/reviewed-rdw-bulk-batch-2.ts");
const {reviewedRdwBulkBatch3}=require("../src/data/reviewed-rdw-bulk-batch-3.ts");
const {reviewedRdwBulkBatch4}=require("../src/data/reviewed-rdw-bulk-batch-4.ts");

for(const [name,apps,count] of [
  ["first bulk",reviewedBulkRdwApplications,15],
  ["second bulk",reviewedRdwBulkBatch2,20],
  ["third bulk",reviewedRdwBulkBatch3,15],
  ["fourth bulk",reviewedRdwBulkBatch4,25]
]){
  assert.equal(apps.length,count,name);
  const full=planBrowserQa(apps,{mode:"full"});
  assert.equal(full.expectedJourneys,count*5,name+" full coverage unchanged");
  assert.equal(full.selectedApps.length,count);
  assert.deepEqual([...new Set(full.scenarios.map(s=>s.locale))].sort(),["en","nl","pl"]);
  assert.deepEqual([...new Set(full.scenarios.map(s=>s.width))].sort((a,b)=>a-b),[320,390,1180]);
  for(const app of apps)assert.equal(full.scenarios.filter(s=>s.app===app).length,5);
  const smoke=planBrowserQa(apps,{mode:"smoke"});
  assert.equal(smoke.expectedJourneys,count,name+" must run at least one browser UI check per engine");
  assert.deepEqual(smoke.selectedApps.map(a=>a.id),apps.map(a=>a.id));
  assert.deepEqual(smoke.scenarios.map(x=>[x.locale,x.width]).slice(0,5),
    viewportPattern.map(x=>[x.locale,x.width]));
  for(const app of apps)assert.equal(smoke.scenarios.filter(s=>s.app===app).length,1);
  const regression=planBrowserQa(apps,{mode:"regression"});
  assert.ok(regression.expectedJourneys>=3&&regression.expectedJourneys<=6);
  assert.equal(regression.selectedApps[0],apps[0]);
  assert.equal(regression.selectedApps.at(-1),apps.at(-1));
  const diesel=apps.find(a=>a.fuel==="Diesel");
  if(diesel)assert.ok(regression.selectedApps.includes(diesel),name+" keeps representative diesel");
  const fractional=apps.find(a=>a.registeredPowerKw%1!==0);
  if(fractional)assert.ok(regression.selectedApps.includes(fractional),name+" keeps decimal RDW kW");
  const twoCylinder=apps.find(a=>a.cylinders===2);
  if(twoCylinder)assert.ok(regression.selectedApps.includes(twoCylinder),name+" keeps rare 2-cylinder");
  const only=planBrowserQa(apps,{mode:"full",only:apps[0].id});
  assert.equal(only.expectedJourneys,5);
  const onlySmoke=planBrowserQa(apps,{mode:"smoke",only:apps[0].id});
  assert.equal(onlySmoke.expectedJourneys,1);
  assert.throws(()=>planBrowserQa(apps,{mode:"smke"}),/Unknown QA mode/);
  assert.throws(()=>planBrowserQa(apps,{mode:"regression",only:"invented-identity"}),/Unknown single-engine/);
  console.log("RDW_QA_RISK_PLAN_PASS "+name+": full "+full.expectedJourneys+
    ", smoke "+smoke.expectedJourneys+", old-cohort regression "+regression.expectedJourneys+
    "; all reviewed engine IDs preserved in smoke mode");
}

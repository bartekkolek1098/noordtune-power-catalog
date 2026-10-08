/* eslint-disable @typescript-eslint/no-require-imports */
// Deterministic, fail-closed browser coverage plan.
// Full = all languages & viewports per engine. Smoke = every engine once,
// rotating 3 locales / mobile / desktop. Regression = bounded representative
// cases from an unchanged older cohort. Hard original-kW/cc/type/fuel/source
// gates for EVERY engine live in the complete executable unit suite.
const assert = require("node:assert/strict");

const viewportPattern = Object.freeze([
  {locale:"nl",width:390},
  {locale:"en",width:390},
  {locale:"pl",width:390},
  {locale:"nl",width:320},
  {locale:"nl",width:1180}
]);

function planBrowserQa(apps, {mode="full",only=""}={}){
  assert.ok(Array.isArray(apps)&&apps.length>0,"Reviewed source batch must not be empty");
  assert.ok(["full","smoke","regression"].includes(mode),"Unknown QA mode must fail closed");
  const allIds=apps.map(app=>app.id);
  assert.equal(new Set(allIds).size,apps.length,"Duplicate reviewed application IDs");
  assert.ok(!only||allIds.includes(only),"Unknown single-engine override must fail closed");
  let indices=apps.map((_,i)=>i);
  if(only)indices=indices.filter(i=>apps[i].id===only);
  else if(mode==="regression"){
    const firstDiesel=apps.findIndex(app=>app.fuel==="Diesel");
    const firstFractionalKw=apps.findIndex(app=>app.registeredPowerKw%1!==0);
    const firstTwoCyl=apps.findIndex(app=>app.cylinders===2);
    indices=[...new Set([0,Math.floor(apps.length/2),apps.length-1,
      firstDiesel,firstFractionalKw,firstTwoCyl].filter(i=>i>=0))].sort((a,b)=>a-b);
  }
  const selectedApps=indices.map(i=>apps[i]);
  assert.ok(selectedApps.length>0,"No QA engines selected");
  const scenarios=selectedApps.flatMap((app,index)=>
    mode==="full"
      ? viewportPattern.map(({locale,width})=>({app,index,locale,width}))
      : [{app,index,...viewportPattern[index%viewportPattern.length]}]);
  const expectedJourneys=mode==="full"?selectedApps.length*5:selectedApps.length;
  assert.equal(scenarios.length,expectedJourneys);
  if(mode==="smoke"&&!only)assert.equal(selectedApps.length,apps.length,
    "Quick smoke MUST check each changed-application identity at least once");
  return {mode,selectedApps,scenarios,expectedJourneys,allApplications:apps.length};
}

module.exports={planBrowserQa,viewportPattern};

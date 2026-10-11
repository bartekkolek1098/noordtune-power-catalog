/* eslint-disable @typescript-eslint/no-require-imports */
// Explicit opt-in live smoke: public RDW records stay in memory only, no screenshots/traces/plates in output.
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {heavyVanFamilies}=require('../src/data/reviewed-heavy-van-families.ts');
const {commercialApplicationId}=require('../src/data/reviewed-commercial-vans.ts');
const {formatPerformanceRange}=require('../src/lib/plate-performance-summary.ts');
const base=process.env.RDW_QA_URL||'https://power.noordtune.nl';
async function query(dataset,params){const url=new URL('https://opendata.rdw.nl/resource/'+dataset+'.json');for(const[k,v]of Object.entries(params))url.searchParams.set(k,v);const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('RDW '+dataset+' HTTP '+response.status);return response.json();}
(async()=>{
 if(process.env.ALLOW_LIVE_RDW_SMOKE!=='1')throw Error('Set ALLOW_LIVE_RDW_SMOKE=1 to allow live public-record lookups; no customer plate argument is accepted');
 assert.ok(['https://power.noordtune.nl','http://127.0.0.1:31127'].includes(base),'Unexpected test target');
 const tests=[['daily-23-156-euro6',2017],['daily-23-156-euro6df',2021],['daily-30-160-euro6df',2021],['movano-b-23-cdti150',2021]];
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 let verified=0;
 try{for(const[id,year]of tests){const f=heavyVanFamilies.find(x=>x.id===id),s=f.scopes[0];let phase='RDW technical selection';const page=await browser.newPage({viewport:{width:390,height:950},reducedMotion:'reduce'});
 try{
  const rows=await query('m9d7-ebf2',{'$select':'kenteken', '$where':`merk='${f.make.toUpperCase()}' AND handelsbenaming='${s.model}' AND type='${s.type}' AND cilinderinhoud='${f.cc}' AND aantal_cilinders='4' AND voertuigsoort='Bedrijfsauto' AND datum_eerste_toelating_dt between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`,'$order':'kenteken','$limit':'35'});
  assert.ok(rows.length,'No live rows in the declared technical scope');
  const fuel=await query('8ys7-d773',{'$select':'kenteken,brandstof_omschrijving,nettomaximumvermogen','$where':'kenteken in('+rows.map(r=>"'"+r.kenteken+"'").join(',')+')','$limit':'200'});
  const selected=rows.find(row=>{const ff=fuel.filter(v=>v.kenteken===row.kenteken);return ff.length===1&&ff[0].brandstof_omschrijving==='Diesel'&&Math.abs(Number(ff[0].nettomaximumvermogen)-f.kw)<0.01;});assert.ok(selected,'No live exact single-diesel kW match');
  phase='public form';await page.goto(base+'/nl',{waitUntil:'domcontentloaded',timeout:45000});await page.waitForFunction(()=>{const el=document.querySelector('input[maxlength="10"]');return el&&Object.keys(el).some(k=>k.startsWith('__reactFiber$'));});
  await page.locator('input[maxlength="10"]').fill(selected.kenteken);
  const [response]=await Promise.all([page.waitForResponse(r=>r.url().includes('/api/rdw-lookup')&&r.request().method()==='POST',{timeout:45000}),page.locator('input[maxlength="10"]').locator('xpath=ancestor::form').locator('button[type="submit"]').click()]);
  assert.equal(response.status(),200);const result=await response.json();assert.equal(result.vehicle.engine.powerKw,f.kw);assert.equal(result.tuningEstimate.profile?.id,commercialApplicationId(f,s));
  phase='rendered result';const power=[Math.min(...f.sources.map(x=>x.stage1Hp)),Math.max(...f.sources.map(x=>x.stage1Hp))],torque=[Math.min(...f.sources.map(x=>x.stage1Nm)),Math.max(...f.sources.map(x=>x.stage1Nm))];
  await page.getByTestId('rdw-performance-summary').waitFor({state:'visible'});assert.equal(await page.getByTestId('rdw-stage-power').innerText(),formatPerformanceRange(power,'nl','pk'));assert.equal(await page.getByTestId('rdw-stage-torque').innerText(),formatPerformanceRange(torque,'nl','Nm'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  verified++;console.log('HEAVY_LIVE_UNMOCKED_PASS',JSON.stringify({family:id,model:s.model,type:s.type,year,kw:f.kw,cc:f.cc,stage1Power:power,stage1Torque:torque,plateSaved:false,mocked:false}));
 }catch{throw Error('Live heavy-van validation failed: '+id+' during '+phase+'; identifiers deliberately omitted');}finally{await page.close();}}
 }finally{await browser.close();}
 assert.equal(verified,4);console.log('HEAVY_LIVE_UNMOCKED_ALL_PASS',verified);
})().catch(e=>{console.error(e.message);process.exitCode=1;});

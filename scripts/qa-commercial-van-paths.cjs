/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {commercialVanFamilies:families,reviewedCommercialVanApplications:apps}=require('../src/data/reviewed-commercial-vans.ts');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const {platePerformanceSummary,formatPerformanceRange}=require('../src/lib/plate-performance-summary.ts');
const base=process.env.RDW_QA_URL||'http://127.0.0.1:31116';
const output=process.env.RDW_QA_OUTPUT||'C:/Users/barto/Desktop/noordtune-commercial-qa-20261011';
async function hydrate(page){await page.waitForFunction(()=>{const e=document.querySelector('input[maxlength="10"]');return e&&Object.keys(e).some(k=>k.startsWith('__reactFiber$'));},null,{timeout:30000});}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const records=[];fs.mkdirSync(output,{recursive:true});try{
 for(const locale of ['nl','pl','en']){
  const page=await browser.newPage({viewport:{width:locale==='en'?1440:390,height:1000},reducedMotion:'reduce'});const errors=[],rdw=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/rdw-lookup'))rdw.push(r.url());});
  await page.goto(base+'/'+locale,{waitUntil:'domcontentloaded'});await hydrate(page);
  await page.addInitScript(()=>{window.__contacts=[];window.open=url=>{window.__contacts.push(String(url));return null;};});
  await page.evaluate(()=>{window.__contacts=[];window.open=url=>{window.__contacts.push(String(url));return null;};});
  for(const f of families){
   const fields=page.getByTestId('manual-vehicle-filters').locator('select');
   // Only the first four selects are the parent filters; the result may contain its own year field.
   if(await fields.nth(0).inputValue()!==f.selectorBrand)await fields.nth(0).selectOption(f.selectorBrand);if(await fields.nth(1).inputValue()!==f.model)await fields.nth(1).selectOption(f.model);if(await fields.nth(2).inputValue()!==String(f.from))await fields.nth(2).selectOption(String(f.from));
   const id='reviewed-van-'+f.id;
   await fields.nth(3).selectOption(id);
   const result=page.locator('[data-testid="manual-catalog-details"][data-selection-id="'+id+'"]');await result.waitFor({state:'visible'});
   await page.waitForFunction(id=>document.querySelector('[data-selection-id="'+id+'"]')?.getAttribute('data-result-status')==='source-comparison',id);
   const actual=await page.request.get(base+'/api/catalog-selector?mode=selection&id='+encodeURIComponent(id)+'&year='+f.from);assert.equal(actual.status(),200);const payload=(await actual.json()).result;
   assert.deepEqual(payload.sources.map(x=>[x.url,x.powerHp,x.torqueNm]),f.sources.map(x=>[x.url,x.stage1Hp,x.stage1Nm]));
   const unit=locale==='nl'?'pk':locale==='pl'?'KM':'hp';
   assert.equal(await result.getByTestId('manual-stock-power').innerText(),Math.round(f.kw*1.359621617)+' '+unit);
   assert.equal(await result.getByTestId('manual-stage1-power').innerText(),formatPerformanceRange(payload.stage1.powerHp,locale,unit));
   assert.ok(await result.getByTestId('manual-reviewed-conditions').isVisible());
   await result.getByTestId('manual-catalog-sources').locator('summary').click();assert.equal(await result.getByTestId('manual-catalog-sources').locator('a').count(),f.sources.length);
   await result.getByTestId('manual-catalog-contact').click();const contact=await page.evaluate(()=>window.__contacts.at(-1));assert.ok(decodeURIComponent(contact).includes(f.model)&&decodeURIComponent(contact).includes(String(f.from)));assert.ok(!contact.includes('QA0000'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(f.id==='daily-23-136-euro6df'&&locale==='nl'){await page.evaluate(()=>document.getElementById('manual-taxonomy-result')?.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:path.join(output,'manual-daily-mobile.png'),fullPage:false});}
   const invalid=await page.request.get(base+'/api/catalog-selector?mode=selection&id='+id+'&year='+(f.to+1));assert.equal(invalid.status(),400);
   records.push({flow:'manual',family:f.id,locale});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(rdw,[],'Manual selection must never submit an invented plate');await page.close();
 }
 for(const [index,app]of apps.entries()){
  const locale=['nl','pl','en'][index%3],width=index%4===0?320:390;
  const page=await browser.newPage({viewport:{width,height:920},reducedMotion:'reduce'}),errors=[],leaks=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('QA0000'))leaks.push(r.url());});
  const payload=normalizeRdwVehicle({merk:app.make.toUpperCase(),handelsbenaming:app.allowedRdwModels[0],type:app.requiredRdwType,cilinderinhoud:String(app.displacementCc),aantal_cilinders:'4',datum_eerste_toelating:app.yearFrom+'0615',datum_eerste_toelating_dt:app.yearFrom+'-06-15T00:00:00'},[{brandstof_omschrijving:'Diesel',nettomaximumvermogen:String(app.registeredPowerKw)}],'QA0000');
  assert.equal(payload.tuningEstimate.profile?.id,app.id);
  await page.route('**/api/rdw-lookup',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)}));
  await page.goto(base+'/'+locale,{waitUntil:'domcontentloaded'});await hydrate(page);const field=page.locator('input[maxlength="10"]');await field.fill('QA0000');await field.locator('xpath=ancestor::form').locator('button[type="submit"]').click();
  await page.getByTestId('rdw-performance-summary').waitFor({state:'visible'});const unit=locale==='nl'?'pk':locale==='pl'?'KM':'hp';const math=platePerformanceSummary(payload.tuningEstimate.profile,payload.tuningEstimate.profile.stages[0],payload.vehicle.engine.powerHp);
  assert.equal(await page.getByTestId('rdw-stage-power').innerText(),formatPerformanceRange(math.power,locale,unit));assert.equal(await page.getByTestId('rdw-stage-torque').innerText(),formatPerformanceRange(math.torque,locale,'Nm'));
  assert.equal(await page.getByTestId('rdw-power-gain').innerText(),formatPerformanceRange(math.powerGain,locale,unit,true));
  assert.ok((await page.getByTestId('rdw-vehicle-facts').innerText()).includes(app.allowedRdwModels[0]));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);assert.deepEqual(leaks,[]);assert.equal(await page.locator('a[href*="QA0000"]').count(),0);
  records.push({flow:'plate-fixture',application:app.id,locale,width});await page.close();
 }
 assert.equal(records.length,39);fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({base,checks:records,realCustomerPlatesUsed:false},null,2)+'\n');console.log('COMMERCIAL_BOTH_PATHS_BROWSER_PASS',JSON.stringify({manual:27,plateFixtures:12,realCustomerPlatesUsed:false}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

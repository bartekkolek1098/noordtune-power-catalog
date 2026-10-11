/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const {reviewedCompactVanApplications}=require('../src/data/reviewed-rdw-compact-vans.ts');
const {platePerformanceSummary,formatPerformanceRange}=require('../src/lib/plate-performance-summary.ts');
const base=process.env.RDW_QA_URL||'http://127.0.0.1:52921';
const output=process.env.RDW_QA_OUTPUT||'C:/Users/barto/Desktop/noordtune-compact-qa-20261011';
function fixture(app){return normalizeRdwVehicle({merk:app.make.toUpperCase(),handelsbenaming:app.allowedRdwModels[0],type:app.requiredRdwType,
 cilinderinhoud:String(app.displacementCc),aantal_cilinders:String(app.cylinders),datum_eerste_toelating:app.yearFrom+'0615',datum_eerste_toelating_dt:app.yearFrom+'-06-15T00:00:00'},
 [{brandstof_omschrijving:app.fuel,nettomaximumvermogen:String(app.registeredPowerKw)}],'QA0000');}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const exe=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
 const browser=await chromium.launch({headless:true,...(exe?{executablePath:exe}:{})});
 const checks=[];
 try{
  const cases=reviewedCompactVanApplications.flatMap((app,index)=>['nl','en','pl'].map(locale=>({app,index,locale,width:390,pending:false})));
  for(const width of [320,1440])cases.push({app:reviewedCompactVanApplications[0],index:0,locale:'nl',width,pending:false});
  for(const locale of ['nl','en','pl'])cases.push({app:{...reviewedCompactVanApplications[0],registeredPowerKw:57},index:-1,locale,width:320,pending:true});
  for(const c of cases){
   const page=await browser.newPage({viewport:{width:c.width,height:920},reducedMotion:'reduce'});
   const errors=[],leaks=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('QA0000'))leaks.push(r.url());});
   await page.addInitScript(()=>{window.__qaContacts=[];window.open=(url)=>{window.__qaContacts.push(String(url));return null;};});
   const payload=fixture(c.app);
   if(c.pending){payload.tuningEstimate.profile=undefined;payload.tuningEstimate.status='conditional';}
   await page.route('**/api/rdw-lookup',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(payload)}));
   try{
    const res=await page.goto(base+'/'+c.locale,{waitUntil:'domcontentloaded',timeout:45000});assert.equal(res.status(),200);
    await page.waitForFunction(()=>{const e=document.querySelector('input[maxlength="10"]');return e&&Object.keys(e).some(k=>k.startsWith('__reactFiber$'));},null,{timeout:30000});
    const field=page.locator('input[maxlength="10"]');await field.fill('QA0000');await field.locator('xpath=ancestor::form').locator('button[type="submit"]').click();
    const result=page.getByTestId('rdw-result');await result.waitFor({state:'visible'});
    const summary=page.getByTestId('rdw-performance-summary');await summary.waitFor({state:'visible'});
    const unit=c.locale==='nl'?'pk':c.locale==='pl'?'KM':'hp';
    const math=platePerformanceSummary(payload.tuningEstimate.profile,payload.tuningEstimate.profile?.stages[0],payload.vehicle.engine.powerHp);
    assert.ok((await page.getByTestId('rdw-stock-power').innerText()).includes(String(payload.vehicle.engine.powerHp)));
    if(!c.pending){
     assert.equal(await page.getByTestId('rdw-stage-power').innerText(),formatPerformanceRange(math.power,c.locale,unit));
     assert.equal(await page.getByTestId('rdw-power-gain').innerText(),formatPerformanceRange(math.powerGain,c.locale,unit,true));
     assert.equal(await page.getByTestId('rdw-stage-torque').innerText(),formatPerformanceRange(math.torque,c.locale,'Nm'));
     assert.equal(await page.getByTestId('rdw-torque-gain').innerText(),formatPerformanceRange(math.torqueGain,c.locale,'Nm',true));
     if(c.index===0){assert.equal(await page.getByTestId('rdw-stock-power').innerText(),'76 '+unit);assert.equal(await page.getByTestId('rdw-power-gain').innerText(),'+39–54 '+unit);}
     assert.equal(await page.getByTestId('rdw-pending-chart').count(),0);
     await page.locator('#rdw-estimate-details summary').click();
     assert.ok(await page.locator('#rdw-estimate-details a').count()>=2);
    }else{
     assert.equal(await page.getByTestId('rdw-recommended-package').count(),0,'No automatic package recommendation for unknown output');
     assert.equal(await page.getByTestId('rdw-pending-chart').count(),1);
     assert.ok(!/\d/.test(await page.getByTestId('rdw-stage-power').innerText()),'No fabricated tuning number');
    }
    assert.equal(await page.locator('a[href*="QA0000"]').count(),0);
    const st1=await result.innerText();assert.ok(!/NaN|Infinity|undefined/.test(st1));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(overflow<=1,c.app.id+' '+c.locale+' overflow '+overflow);
    await page.getByTestId('rdw-summary-contact').click();const contacts=await page.evaluate(()=>window.__qaContacts);
    assert.equal(contacts.length,1);assert.ok(decodeURIComponent(contacts[0]).includes('QA0000'),'Plate only included after explicit contact action');
    assert.deepEqual(errors,[]);assert.deepEqual(leaks,[]);
    if(c.index===0&&c.locale==='nl'){await page.evaluate(()=>{const el=document.querySelector('[data-testid="rdw-result"]');window.scrollTo({top:el.getBoundingClientRect().top+scrollY-84,behavior:'instant'});});await page.waitForTimeout(120);await page.screenshot({path:path.join(output,'plate-result-'+c.width+'.png'),fullPage:false});}
    checks.push({app:c.app.id,locale:c.locale,width:c.width,pending:c.pending,overflow});
    console.log('PLATE_RESULT_V2_PASS',c.app.id,c.locale,c.width,c.pending?'pending':'sourced');
   }finally{await page.close();}
  }
 }finally{await browser.close();}
 assert.equal(checks.length,32);fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({checks,customerPlateStored:false},null,2)+'\n');
 console.log('PLATE_RESULT_V2_ALL_PASS',checks.length);
})().catch(e=>{console.error(e);process.exitCode=1});

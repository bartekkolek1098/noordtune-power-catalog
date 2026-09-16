/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const {formatEstimatePower,formatEstimateTorque,formatEstimateSource}=require('../src/lib/estimate-copy.ts');
const {resolveStageQuote,assessVehicleAccess,formatQuote}=require('../src/data/pricing.ts');
const base=process.env.RDW_QA_URL||'http://localhost:3120';
const output=path.resolve('docs/tuning-data/browser-v3-1');
const sample=JSON.parse(fs.readFileSync('data/research/nl-rdw-v3-qa-sample.json','utf8'));
const diagnostics=JSON.parse(fs.readFileSync('data/research/v3-1-match-diagnostics.json','utf8'));
const definitions=[
  ['alfa','rdw-3dea08368f3f876bae58','B'],
  ['focus','rdw-752a71303519e8377dcf','B'],
  ['polo','rdw-3f8cdb0b400e8b135413','B'],
  ['mini-conflict','rdw-def544a330924ae8d803','D'],
  ['hybrid-unsupported','rdw-0bfeda53da6910e3e343','E']
];
const fixtures=definitions.map(([name,id,layer],index)=>{
  const row=sample.rows.find(item=>item.sampleId===id);assert.ok(row,id);
  const plate=`QA31${String(index+1).padStart(2,'0')}`;
  const payload=normalizeRdwVehicle(row.vehicle,row.fuels,plate);delete payload.raw;
  assert.equal(payload.tuningEstimate.coverageClass,layer,name);
  if(layer==='B')assert.equal(payload.tuningEstimate.profile?.id,diagnostics.cases.find(item=>item.sampleId===id)?.selectedProfileId);
  if(layer==='D')assert.ok(payload.tuningEstimate.reasonCodes?.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS')||payload.tuningMatch?.reasonCodes?.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS'));
  return{name,id,plate,layer,payload};
});
const cases=[...fixtures.flatMap(fixture=>[320,1440].map(width=>({...fixture,width,locale:'nl'}))),
  ...['en','pl'].flatMap(locale=>[fixtures[0],fixtures[3]].map(fixture=>({...fixture,width:320,locale})))];
const report={checkedAt:new Date().toISOString(),base,method:'Local production UI with intercepted deterministic DTOs produced by the real server normalizer from the committed sanitized RDW cohort. QA31xx inputs are synthetic, not live registrations. The four owner plates are tested separately using genuine HTTP requests.',cases:[],screenshots:[],errors:[]};
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
    for(const fixture of cases){
      const page=await browser.newPage({viewport:{width:fixture.width,height:1000},deviceScaleFactor:1});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      try{
        await page.route('**/api/rdw-lookup',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixture.payload)}));
        await page.goto(`${base}/${fixture.locale}`,{waitUntil:'networkidle'});
        const input=page.locator('input[maxlength="10"]');await input.fill(fixture.plate);
        const responsePromise=page.waitForResponse(response=>response.url().includes('/api/rdw-lookup')&&response.request().method()==='POST');
        await input.locator('xpath=ancestor::form').locator('button[type="submit"]').click();
        const response=await responsePromise;assert.equal(response.status(),200);
        const payload=await response.json();assert.equal(payload.tuningEstimate.coverageClass,fixture.layer);
        assert.equal(payload.raw,undefined);assert.equal(payload.tuningMatch.candidates,undefined);
        const root=page.getByTestId('rdw-result');await root.waitFor({state:'visible'});
        const profile=payload.tuningEstimate.profile,stages=[];
        if(fixture.layer==='E'){
          assert.equal(profile,undefined);assert.equal(payload.tuningQuote.kind,'on-request');
          assert.equal(await root.getByTestId('catalog-power-chart').count(),0);
          assert.equal(await root.locator('input[type="checkbox"]').count(),0);
          const message=new URL(await root.getByTestId('rdw-manual-review-quote').getAttribute('href')).searchParams.get('text');
          assert.ok(message.includes(fixture.plate));
        }else{
          assert.equal(await root.locator('tbody tr').count(),3);
          for(const stage of profile.stages){
            const row=root.locator('tbody tr').nth(stages.length);
            const power=formatEstimatePower(stage,fixture.locale),torque=formatEstimateTorque(stage,fixture.locale);
            assert.ok((await row.innerText()).includes(power));await row.click();
            assert.ok((await root.getByTestId('rdw-estimate-output').innerText()).includes(power));
            const message=new URL(await root.getByTestId('rdw-exact-quote').getAttribute('href')).searchParams.get('text');
            assert.ok(message.includes(fixture.plate)&&message.includes(power)&&message.includes(formatEstimateSource(stage,fixture.locale)));
            if(stage.torqueNm!==undefined||stage.torqueRangeNm)assert.ok(message.includes(torque));
            const quote=resolveStageQuote(profile,stage,{scope:'vehicle',estimateApplicable:true,access:assessVehicleAccess(profile)});
            assert.ok((await root.innerText()).includes(formatQuote(quote,fixture.locale)));
            if(quote.kind==='from')assert.ok(message.includes(formatQuote(quote,fixture.locale)));
            stages.push({name:stage.name,power,torque,provenance:stage.provenance,quote});
          }
          if(fixture.name==='mini-conflict')assert.ok(payload.tuningEstimate.reasonCodes?.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS')||payload.tuningMatch?.reasonCodes?.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS'));
          if(fixture.layer==='B')assert.equal(profile.stages[0].provenance,'single-source');
          await root.locator('tbody tr').first().click();
          await page.waitForTimeout(1800);
          assert.ok(await root.locator('.recharts-area-curve').first().evaluate(element=>(element.getAttribute('d')||'').length>40&&element.getBoundingClientRect().width>50));
        }
        const layout=await root.evaluate(element=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,overflow:[...element.querySelectorAll('p,td,th,label,a,button,section')].filter(child=>{const box=child.getBoundingClientRect(),parent=element.getBoundingClientRect(),style=getComputedStyle(child);return box.width>0&&box.height>0&&!['absolute','fixed'].includes(style.position)&&(box.left<parent.left-2||box.right>parent.right+2||child.scrollWidth>child.clientWidth+2)}).map(child=>child.tagName)}));
        assert.ok(layout.documentWidth<=fixture.width);assert.deepEqual(layout.overflow,[]);assert.deepEqual(errors,[]);
        if(fixture.width===320&&fixture.locale==='nl'&&['alfa','mini-conflict'].includes(fixture.name)){
          const file=`${fixture.name}-320.png`;await root.screenshot({path:path.join(output,file),style:'header, [class~="fixed"] {visibility:hidden !important;}'});report.screenshots.push(file);
        }
        report.cases.push({name:fixture.name,sampleId:fixture.id,layer:fixture.layer,width:fixture.width,locale:fixture.locale,profile:profile?.id,stages,quote:payload.tuningQuote,layout,whatsapp:true,intercepted:true});
        console.log(`PASS intercepted ${fixture.name} ${fixture.locale} ${fixture.width}px`);
      }catch(error){report.errors.push({name:fixture.name,locale:fixture.locale,width:fixture.width,error:String(error.stack||error)});throw error}
      finally{await page.close()}
    }
  }finally{fs.writeFileSync(path.join(output,'browser-acceptance.json'),JSON.stringify(report,null,2)+'\n');await browser.close()}
  console.log(JSON.stringify({cases:report.cases.length,screenshots:report.screenshots.length,errors:report.errors.length}));
})().catch(error=>{console.error(error);process.exitCode=1});

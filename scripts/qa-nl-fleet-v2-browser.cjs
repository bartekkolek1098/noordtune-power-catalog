/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {formatEstimatePower,formatEstimateTorque,formatEstimateSource} = require('../src/lib/estimate-copy.ts');
const {resolveStageQuote,assessVehicleAccess,formatQuote} = require('../src/data/pricing.ts');
const base = process.env.RDW_QA_URL || 'http://localhost:3118';
const output = path.resolve(process.env.RDW_QA_OUTPUT || 'docs/tuning-data/browser-v2');
const privateFile = process.env.RDW_QA_PRIVATE_SAMPLE || '.git/nl-fleet-v2/rdw-live-private.json';
const privateRows = JSON.parse(fs.readFileSync(privateFile,'utf8'));
const validation = JSON.parse(fs.readFileSync(process.env.RDW_QA_VALIDATION || 'data/research/v2-rdw-validation.json','utf8'));
const selected = new Map();
const add = row => {if(row)selected.set(row.sampleId,row);};
// A purposive browser subset covers all resolution layers and diverse actual
// RDW identities. It never creates plate-specific application overrides.
for(const layer of ['A','B','C','D','E'])add(validation.rows.find(row=>row.layer===layer));
for(const make of ['KIA','HYUNDAI','TOYOTA','VOLKSWAGEN','FORD','BMW','RENAULT','NISSAN','OPEL','MERCEDES-BENZ']){
  add(validation.rows.find(row=>row.identity.make===make&&['A','B'].includes(row.layer))
    ||validation.rows.find(row=>row.identity.make===make));
}
for(const model of ['TRANSIT CUSTOM','VIVARO','DAILY','CADDY'])add(validation.rows.find(row=>row.identity.model===model));
assert.ok(selected.size>=12,'At least 12 distinct real browser identities');
const fixtures=[...selected.values()].map(row=>{
  const privateRow=privateRows.find(value=>'rdw-'+crypto.createHash('sha256').update(value.vehicle.kenteken).digest('hex').slice(0,20)===row.sampleId);
  assert.ok(privateRow,row.sampleId+': private plate available');
  return {...row,plate:privateRow.vehicle.kenteken};
});
const cases=[...fixtures.map(f=>({...f,width:320,locale:'nl'})),
  ...['en','pl'].flatMap(locale=>[fixtures.find(f=>['A','B'].includes(f.layer)),fixtures.find(f=>f.layer==='E')].filter(Boolean).map(f=>({...f,width:320,locale}))),
  ...fixtures.filter(f=>['A','B'].includes(f.layer)).slice(0,2).map(f=>({...f,width:1440,locale:'nl'}))];
const report={checkedAt:new Date().toISOString(),datasetFingerprint:validation.datasetFingerprint,base,
  method:'Actual local production HTTP RDW route and real registered plates. Fresh response identity/layer/stages checked against the independently collected sample. No API interception. Only hashed plate IDs and normalized identities persist; WhatsApp URLs/messages and raw plates do not.',
  distinctIdentities:fixtures.length,results:[],screenshots:[],errors:[]};
const summarize=values=>{const sorted=[...values].sort((a,b)=>a-b);return{median:sorted[Math.floor(sorted.length/2)],p95:sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))],max:sorted.at(-1)};};

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
    for(const fixture of cases){
      const {plate,sampleId,width,locale}=fixture;
      const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      try{
        await page.goto(`${base}/${locale}`,{waitUntil:'networkidle'});
        const input=page.locator('input[maxlength="10"]');await input.fill(plate);
        const responsePromise=page.waitForResponse(response=>response.url().includes('/api/rdw-lookup')&&response.request().method()==='POST');
        const started=performance.now();
        await input.locator('xpath=ancestor::form').locator('button[type="submit"]').click();
        const response=await responsePromise;assert.equal(response.status(),200,sampleId+': HTTP status');
        const payload=await response.json(),requestMs=performance.now()-started;
        assert.equal(payload.vehicle.make,fixture.identity.make);
        assert.equal(payload.vehicle.model,fixture.identity.model);
        assert.equal(payload.vehicle.engine.powerKw,fixture.identity.registeredPowerKw,'Actual RDW stock kW retained');
        assert.equal(payload.vehicle.engine.displacementCc,fixture.identity.displacementCc);
        assert.equal(payload.tuningEstimate.coverageClass,fixture.layer);
        assert.equal(payload.tuningEstimate.profile?.id,fixture.selectedProfile);
        assert.equal(payload.raw,undefined);assert.equal(payload.tuningMatch.candidates,undefined);
        const responseBytes=Buffer.byteLength(JSON.stringify(payload));assert.ok(responseBytes<25000);
        const root=page.getByTestId('rdw-result');await root.waitFor();
        assert.ok((await root.innerText()).includes(`${payload.vehicle.make} ${payload.vehicle.model}`));
        const profile=payload.tuningEstimate.profile,stages=[];
        if(profile){
          const rows=root.locator('tbody tr');assert.equal(await rows.count(),3);
          for(let index=0;index<3;index++){
            const stage=profile.stages[index],row=rows.nth(index);
            const expected=fixture['stage'+(index+1)];
            assert.equal(stage.powerHp,expected.powerHp);assert.deepEqual(stage.powerRangeHp,expected.powerRangeHp);
            assert.equal(stage.torqueNm,expected.torqueNm);assert.deepEqual(stage.torqueRangeNm,expected.torqueRangeNm);
            const power=formatEstimatePower(stage,locale),torque=formatEstimateTorque(stage,locale);
            assert.ok((await row.innerText()).includes(power));await row.click();
            assert.ok((await root.getByTestId('rdw-estimate-output').innerText()).includes(power));
            const message=new URL(await root.getByTestId('rdw-exact-quote').getAttribute('href')).searchParams.get('text');
            assert.ok(message.includes(plate)&&message.includes(`${payload.vehicle.make} ${payload.vehicle.model}`));
            assert.ok(message.includes(`${payload.vehicle.engine.powerKw} kW`)&&message.includes(power));
            assert.ok(message.includes(formatEstimateSource(stage,locale)));
            if(stage.torqueNm!==undefined||stage.torqueRangeNm)assert.ok(message.includes(torque));
            const quote=resolveStageQuote(profile,stage,{scope:'vehicle',estimateApplicable:true,access:assessVehicleAccess(profile)});
            assert.ok((await root.innerText()).includes(formatQuote(quote,locale)));
            if(quote.kind==='from')assert.ok(message.includes(formatQuote(quote,locale)));
            else assert.ok(message.includes({nl:'Prijs: op aanvraag',en:'Price: on request',pl:'Cena: wycena indywidualna'}[locale]));
            if(stage.customHardware)assert.equal(stage.powerHp,undefined);
            stages.push({name:stage.name,power,torque,provenance:stage.provenance,quote});
          }
          await rows.first().click();await page.waitForTimeout(1800);
          const curve=root.locator('.recharts-area-curve').first();await curve.waitFor({state:'visible'});
          assert.ok(await curve.evaluate(element=>(element.getAttribute('d')||'').length>40&&element.getBoundingClientRect().width>50));
        }else{
          assert.equal(fixture.layer,'E');assert.equal(payload.tuningQuote.kind,'on-request');
          assert.equal(await root.getByTestId('catalog-power-chart').count(),0);
          assert.equal(await root.locator('input[type="checkbox"]').count(),0);
          const message=new URL(await root.getByTestId('rdw-manual-review-quote').getAttribute('href')).searchParams.get('text');
          assert.ok(message.includes(plate));
        }
        const layout=await root.evaluate(element=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,
          overflow:[...element.querySelectorAll('p,td,th,label,a,button,section')].filter(child=>{
            const box=child.getBoundingClientRect(),container=element.getBoundingClientRect(),style=getComputedStyle(child);
            return box.width>0&&box.height>0&&!['absolute','fixed'].includes(style.position)&&(box.left<container.left-2||box.right>container.right+2||child.scrollWidth>child.clientWidth+2);
          }).map(child=>({tag:child.tagName,text:child.textContent.trim().slice(0,60)}))}));
        assert.ok(layout.documentWidth<=width);assert.deepEqual(layout.overflow,[]);assert.deepEqual(errors,[]);
        if(locale==='nl'&&width===320&&!report.screenshots.some(s=>s.layer===fixture.layer)){
          // Input is outside the captured result. Mask any visible registration
          // text if this component later starts displaying it inside the card.
          const name=`${sampleId}-${fixture.layer}-320.png`;
          await root.screenshot({path:path.join(output,name),mask:[root.getByText(plate,{exact:true})],style:'header, [class~="fixed"] {visibility:hidden !important;}'});
          report.screenshots.push({file:name,layer:fixture.layer});
        }
        report.results.push({sampleId,locale,width,identity:fixture.identity,layer:fixture.layer,profile:profile?.id,stages,quote:payload.tuningQuote,responseBytes,requestMs,serverTiming:response.headers()['server-timing'],cache:response.headers()['x-rdw-cache'],layout,whatsapp:true,stockRetained:true});
        console.log(`PASS real ${sampleId} ${fixture.identity.make} ${fixture.identity.model} ${fixture.layer} ${locale} ${width}px`);
      }catch(error){
        const safe=String(error.stack||error).replaceAll(plate,sampleId);report.errors.push({sampleId,locale,width,error:safe});throw new Error(safe);
      }finally{await page.close();}
    }
  }finally{
    report.httpResponseBytes=summarize(report.results.map(r=>r.responseBytes));report.httpRoundTripMs=summarize(report.results.map(r=>r.requestMs));
    fs.writeFileSync(path.join(output,'nl-fleet-browser-acceptance.json'),JSON.stringify(report,null,2)+'\n');await browser.close();
  }
  console.log(JSON.stringify({cases:report.results.length,identities:report.distinctIdentities,errors:report.errors.length,httpResponseBytes:report.httpResponseBytes,httpRoundTripMs:report.httpRoundTripMs}));
})().catch(error=>{console.error(error);process.exitCode=1;});

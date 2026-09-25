/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const {engineCatalog}=require('../src/data/catalog.ts');
const {getCatalogEstimateProfile}=require('../src/data/tuning-estimates-shared.ts');
const {resolveDetailsAction,detailsActionLabel}=require('../src/lib/details-action.ts');
const {customerProfile}=require('../src/lib/customer-profile.ts');
const {customerStageNotes}=require('../src/lib/stage-presentation.ts');
const {formatEstimatePower,formatEstimateTorque}=require('../src/lib/estimate-copy.ts');
const {lookupContactMessage}=require('./lookup-contact-qa.cjs');
const base=process.env.RDW_QA_URL||'http://localhost:3130';
const output=process.env.FLOW_QA_OUTPUT||'docs/tuning-data/customer-flow/browser-acceptance.json';
const forbidden=/Published Stage 1 reference|unknown-aspiration|NoordTune generic RDW indication policy|no recursive Stage multipliers|Rounded local planning range|earlier bounds prevent regression|No defensible stock torque source|owner of NoordTune|SOURCE_OWNER_REVIEW|HARDWARE_SCOPE_REVIEW/i;
const fixtures=[['source','Volkswagen','Golf',1598,77,2014,'Diesel'],['reference-bmw','BMW','128ti',1998,195,2022,'Benzine'],['reference-custom','Ford','Transit Custom',1995,77,2019,'Diesel'],['canonical','Land Rover','Defender',1999,177,2020,'Diesel'],['generic','Unknown','Test',1600,80,2015,'Benzine'],['published','Volkswagen','Golf GTI',1984,169,2016,'Benzine'],['invalid','Volkswagen','Golf GTI',1984,169,2016,'Benzine'],['equal-source','Suzuki','Vitara 1.4 Boosterjet',1373,103,2017,'Benzine']].map(([id,make,model,cc,kw,year,fuel],index)=>{
 const plate='QF'+String(index+1).padStart(4,'0');const payload=normalizeRdwVehicle({merk:make,handelsbenaming:model,cilinderinhoud:String(cc),aantal_cilinders:'4',datum_eerste_toelating:year+'0101'},[{brandstof_omschrijving:fuel,nettomaximumvermogen:String(kw)}],plate);delete payload.raw;
 if(['published','invalid'].includes(id)){const p=getCatalogEstimateProfile(engineCatalog[0]);if(id==='invalid')p.vehicleId='missing-vehicle';payload.tuningEstimate={status:'applicable',profile:customerProfile(p),reasonCodes:[],detailsAction:resolveDetailsAction(p,engineCatalog)};}
 assert(payload.tuningEstimate.profile,id);if(id==='equal-source')assert.equal(payload.tuningEstimate.profile.stages[1].torqueNm,290);
 return {id,plate,payload};
});
const report={method:'Synthetic registrations intercepted with production-normalized DTOs; published and invalid-route fixtures explicitly exercise the verified action contract. Public route content and manual selection use genuine local server responses. Contact opener is stubbed; no WhatsApp navigation/message.',cases:[],routes:[],manual:[],errors:[],screenshots:[]};
if(process.env.FLOW_QA_PHASE==='manual'){const previous=JSON.parse(fs.readFileSync(output));assert.equal(previous.cases.length,120);assert.equal(previous.routes.length,72);report.cases=previous.cases;report.routes=previous.routes;report.screenshots=previous.screenshots;}
async function checkCopy(page){assert.doesNotMatch(await page.locator('body').innerText(),forbidden);assert.doesNotMatch(await page.locator('body').evaluate(el=>[...el.querySelectorAll('[title],[aria-label]')].map(n=>(n.title||'')+' '+(n.getAttribute('aria-label')||'')).join(' ')),forbidden);}
async function focused(page,id){await page.waitForFunction(target=>{const el=document.getElementById(target);return document.activeElement===el&&el.getBoundingClientRect().top>=0&&el.getBoundingClientRect().top<250;},id);const metrics=await page.locator('#'+id).evaluate(el=>({top:el.getBoundingClientRect().top,targetWidth:el.getBoundingClientRect().width,overflow:el.scrollWidth>el.clientWidth+2}));assert(!metrics.overflow);const header=await page.locator('header').first().boundingBox();assert(metrics.top>=header.y+header.height+4,'sticky header clearance');return metrics;}
async function finishingChecks(browser) {
  report.method = 'Finishing diff only: genuine local production selector/routes and two synthetic intercepted RDW lookups per locale/width; no owner-live inputs or outgoing messages. Checkpoint evidence remains in separate, unchanged artifacts.';
  report.ownerLiveStatus = 'SKIPPED';
  report.startingHead = 'f77e3529c9f588d3f47bf62f1150c486f3445940';
  const labels = {nl:'Referentie voor Stage 1', en:'Stage 1 reference', pl:'Profil referencyjny Stage 1'};
  for (const locale of ['nl','en','pl']) for (const width of [320,1440]) {
    const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
    const selector = page.locator('#manual-selector');
    const search = selector.locator('input').first();
    async function quick(query) {
      const response = page.waitForResponse(r => r.url().includes('/api/catalog-selector') && new URL(r.url()).searchParams.get('q') === query);
      await search.fill(query);
      await response;
    }
    await quick('BMW 128ti');
    const reference = selector.locator('button[data-testid="manual-result-action"]').filter({hasText:'128ti'}).first();
    await reference.waitFor();
    assert((await reference.innerText()).includes(labels[locale]));
    await checkCopy(page);
    await reference.click();
    await page.getByTestId('manual-reference-details').waitFor();
    const focus = await focused(page,'manual-reference-result');
    assert((await page.getByTestId('manual-reference-details').innerText()).includes('F40'));
    await page.getByTestId('manual-reference-stage').nth(1).click();
    const option = page.locator('#manual-reference-result input[type=checkbox]').first();
    await option.check();
    const quoteBefore = await page.getByTestId('manual-reference-quote').getAttribute('href');
    await reference.click();
    await focused(page,'manual-reference-result');
    assert.equal(await page.getByTestId('manual-reference-stage').nth(1).getAttribute('aria-pressed'),'true');
    assert(await option.isChecked());
    assert.equal(await page.getByTestId('manual-reference-quote').getAttribute('href'),quoteBefore);
    await page.getByTestId('manual-reference-sources').locator('summary').click();
    await checkCopy(page);
    const referenceStage2 = await page.getByTestId('manual-reference-output').innerText();
    const referencePrice = await page.getByTestId('manual-reference-price').innerText();
    await quick('Giulietta');
    const unpublished = selector.locator('button[data-testid="manual-result-action"]').filter({hasText:'Giulietta'}).first();
    await unpublished.waitFor();
    await unpublished.click();
    await page.getByTestId('manual-reference-details').filter({hasText:'Giulietta'}).waitFor();
    await focused(page,'manual-reference-result');
    await checkCopy(page);
    // Cascade checks the actual option text and selected summary, not just search cards.
    const selects = selector.locator('select');
    await selects.nth(0).selectOption('BMW');
    await selects.nth(1).locator('option[value="128ti"]').waitFor({state:'attached'});
    await selects.nth(1).selectOption('128ti');
    await selects.nth(2).locator('option[value="2022"]').waitFor({state:'attached'});
    await selects.nth(2).selectOption('2022');
    const engineOption = selects.nth(3).locator('option[value="ref-bmw-128ti-f40-265"]');
    await engineOption.waitFor({state:'attached'});
    assert((await engineOption.textContent()).includes(labels[locale]));
    await selects.nth(3).selectOption('ref-bmw-128ti-f40-265');
    await page.getByTestId('manual-reference-details').filter({hasText:'128ti'}).waitFor();
    await focused(page,'manual-reference-result');
    await checkCopy(page);
    assert((await selector.innerText()).includes(labels[locale]));
    const clippedControls = await selector.locator('input,select,button,a').evaluateAll(nodes => nodes.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
    }).map(el => el.tagName));
    assert.deepEqual(clippedControls,[],'visible controls remain within viewport; decorative background is intentionally clipped');
    if(locale==='nl') {
      await selects.nth(3).scrollIntoViewIfNeeded();
      const file='docs/tuning-data/customer-flow/finishing-manual-'+width+'.png';
      await page.screenshot({path:file});
      report.screenshots.push(file);
    }
    await quick('Golf GTI');
    const published = selector.locator('a[data-testid="manual-result-action"]').filter({hasText:'GTI Performance'}).first();
    await published.waitFor();
    assert((await published.innerText()).includes('2.0 TSI EA888'));
    const href = await published.getAttribute('href');
    await published.click();
    await page.waitForURL('**'+href);
    assert.equal((await page.locator('h1').textContent()).trim(),'Volkswagen Golf GTI');
    assert((await page.locator('body').innerText()).includes('2.0 TSI EA888'));
    await checkCopy(page);
    await page.goBack({waitUntil:'networkidle'});
    // Existing production-normalized fixtures exercise new-search disclosure reset and retained quote.
    let selected;
    await page.route('**/api/rdw-lookup',route=>{assert.equal(route.request().method(),'POST');return route.fulfill({json:selected.payload});});
    for (const id of ['reference-bmw','reference-custom']) {
      selected = fixtures.find(fixture=>fixture.id===id);
      const input = page.locator('input[maxlength="10"]');
      const response = page.waitForResponse(r=>r.url().endsWith('/api/rdw-lookup'));
      await input.fill(selected.plate);
      await input.locator('xpath=ancestor::form').locator('button[type=submit]').click();
      await response;
      await page.getByTestId('rdw-details-action').waitFor();
      assert.equal(await page.locator('#rdw-estimate-details[open]').count(),0);
      const stage = page.locator('tr[data-stage-name="Stage 2"]');
      await stage.click();
      const extra = page.locator('#rdw-configurator input[type=checkbox]').first();
      await extra.check();
      const before = await lookupContactMessage(page,page.getByTestId('rdw-exact-quote'));
      const action = page.getByTestId('rdw-details-action');
      await action.click();
      await focused(page,'rdw-configurator');
      await action.focus();
      await page.keyboard.press('Enter');
      await focused(page,'rdw-configurator');
      assert.equal(await stage.getAttribute('aria-selected'),'true');
      assert(await extra.isChecked());
      assert.equal(await lookupContactMessage(page,page.getByTestId('rdw-exact-quote')),before);
      await page.locator('#rdw-estimate-details summary').click();
      await checkCopy(page);
    }
    assert.deepEqual(errors,[]);
    report.manual.push({locale,width,label:labels[locale],referenceStage2,referencePrice,quickReference:true,cascadeReference:true,engineGenerationPreserved:'F40',catalogTrimPreserved:'GTI Performance',catalogEnginePreserved:'2.0 TSI EA888',publishedClick:true,back:true,unpublishedInline:true,retainedStageOptionsQuote:true,twoLookupsResetSources:true,noClipping:true,...focus});
    await page.close();
  }
}

(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 if(process.env.FLOW_QA_PHASE==='finishing'){await finishingChecks(browser);return;}
 const work=(process.env.FLOW_QA_PHASE==='manual'?[]:['nl','en','pl']).flatMap(locale=>[320,390,768,1024,1440].map(width=>({locale,width})));
 await Promise.all([0,1,2].map(async()=>{while(work.length){const {locale,width}=work.shift();const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));let selected;
 await page.route('**/api/rdw-lookup',r=>{assert.equal(r.request().method(),'POST');return r.fulfill({json:selected.payload});});await page.goto(base+'/'+locale,{waitUntil:'networkidle'});
 for(const fixture of fixtures){selected=fixture;const input=page.locator('input[maxlength="10"]');await input.fill(fixture.plate);await input.locator('xpath=ancestor::form').locator('button[type=submit]').click();await page.getByTestId('rdw-details-action').waitFor();const p=fixture.payload.tuningEstimate.profile;
 const row=page.locator('tr[data-stage-name="Stage 2"]');await row.click();const checkbox=page.locator('#rdw-configurator input[type=checkbox]').first();await checkbox.check();const before=await lookupContactMessage(page,page.getByTestId('rdw-exact-quote'));const cta=page.getByTestId('rdw-details-action');const action=fixture.payload.tuningEstimate.detailsAction;assert.equal((await cta.innerText()).trim(),detailsActionLabel(action,locale));
 if(action.kind==='vehicle-page'){assert.equal(await cta.evaluate(e=>e.tagName),'A');await cta.click();await page.waitForURL('**/'+locale+action.path);assert.equal((await page.locator('h1').textContent()).trim(),engineCatalog[0].brand+' '+engineCatalog[0].model);assert((await page.locator('body').innerText()).includes(engineCatalog[0].engine));await checkCopy(page);await page.goBack({waitUntil:'networkidle'});report.cases.push({id:fixture.id,locale,width,action:'vehicle-page',correctModel:true,back:true});continue;}
 assert.equal(await cta.evaluate(e=>e.tagName),'BUTTON');await cta.click();const metrics=await focused(page,'rdw-configurator');await cta.focus();await page.keyboard.press('Enter');await focused(page,'rdw-configurator');assert.equal(await page.locator('#rdw-estimate-details[open]').count(),0);assert.equal(await row.getAttribute('aria-selected'),'true');assert(await checkbox.isChecked());assert.equal(await lookupContactMessage(page,page.getByTestId('rdw-exact-quote')),before);assert.equal(page.url(),base+'/'+locale);
 await page.locator('#rdw-estimate-details summary').click();await checkCopy(page);const stage=p.stages[1];const expected=customerStageNotes(stage,locale,p);for(const note of expected)assert(before.includes(note),fixture.id+' '+note);assert(before.includes(formatEstimatePower(stage,locale)));if(stage.torqueNm!==undefined||stage.torqueRangeNm)assert(before.includes(formatEstimateTorque(stage,locale)));assert.doesNotMatch(before,forbidden);assert(before.includes(fixture.plate));assert.equal(await page.locator('a[href*="wa.me"]').evaluateAll((links,plate)=>links.some(a=>decodeURIComponent(a.href).includes(plate)),fixture.plate),false);
 const storage=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage),cookies:document.cookie}));assert.deepEqual(storage.local,[]);assert.deepEqual(storage.session,[]);assert(!storage.cookies.includes(fixture.plate));assert.match(storage.cookies,/^(?:NEXT_LOCALE=(?:nl|en|pl))?$/);
 if(locale==='nl'&&[320,1440].includes(width)&&['reference-custom','reference-bmw'].includes(fixture.id)){const file='docs/tuning-data/customer-flow/'+fixture.id+'-'+width+'.png';await page.locator('#rdw-configurator').screenshot({path:file});report.screenshots.push(file);}
 report.cases.push({id:fixture.id,locale,width,action:'inline-configurator',repeatedKeyboardClick:true,selectionRetained:true,copy:true,...metrics});}
 assert.deepEqual(errors,[]);await page.close();}}));
 const routes=(process.env.FLOW_QA_PHASE==='manual'?[]:engineCatalog).flatMap(vehicle=>['nl','en','pl'].map(locale=>({vehicle,locale})));
 await Promise.all([0,1,2].map(async()=>{const page=await browser.newPage({viewport:{width:1024,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));while(routes.length){const {vehicle,locale}=routes.shift();const response=await page.goto(base+'/'+locale+'/vehicles/'+vehicle.id,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.equal(await page.locator('h1').textContent(),vehicle.brand+' '+vehicle.model);const body=await page.locator('body').innerText();assert(body.includes(vehicle.engine));assert(body.includes(String(vehicle.stages[0].powerHp)));assert.equal(await page.getByTestId('catalog-power-chart').count(),1);await checkCopy(page);assert.doesNotMatch(await response.text(),forbidden);report.routes.push({id:vehicle.id,locale,content:true,status:response.status()});}assert.deepEqual(errors,[]);await page.close();}));
 for(const locale of ['nl','en','pl']){const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});await page.goto(base+'/'+locale,{waitUntil:'networkidle'});const search=page.locator('#manual-selector input').first();for(const query of ['BMW 128ti','Giulietta']){const searched=page.waitForResponse(r=>r.url().includes('/api/catalog-selector')&&new URL(r.url()).searchParams.get('q')===query);await search.fill(query);await searched;const button=page.locator('#manual-selector button[data-testid="manual-result-action"]').filter({hasText:query.split(' ').at(-1)}).first();await button.waitFor();await button.click();await page.getByTestId('manual-reference-details').waitFor();await focused(page,'manual-reference-result');await page.getByTestId('manual-reference-stage').nth(1).click();const option=page.locator('#manual-reference-result input[type=checkbox]').first();await option.check();await button.click();await focused(page,'manual-reference-result');assert(await option.isChecked());assert.equal(await page.getByTestId('manual-reference-stage').nth(1).getAttribute('aria-pressed'),'true');await page.getByTestId('manual-reference-sources').locator('summary').click();await checkCopy(page);report.manual.push({locale,query,inline:true,repeatedSelectionRetained:true});}
 await search.fill('Golf GTI');const link=page.locator('#manual-selector a[data-testid="manual-result-action"]').first();await link.waitFor();const href=await link.getAttribute('href');await link.click();await page.waitForURL('**'+href);assert((await page.locator('h1').textContent()).includes('Golf'));await page.goBack({waitUntil:'networkidle'});report.manual.push({locale,publishedClick:true,back:true});await page.close();}
 }catch(e){report.errors.push(e.stack);throw e;}finally{fs.mkdirSync(require('path').dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({cases:report.cases.length,routes:report.routes.length,manual:report.manual.length,errors:report.errors.length}));}})().catch(e=>{console.error(e);process.exitCode=1});

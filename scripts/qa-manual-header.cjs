/* eslint-disable @typescript-eslint/no-require-imports */
// Browser regression for desktop navigation and manual catalog results. No real plates.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.RDW_QA_URL || 'http://127.0.0.1:31105';
const output = process.env.RDW_QA_OUTPUT || 'C:/Users/barto/Desktop/noordtune-manual-header-qa-20261011';
const bmw = 'tax-99f71fb1a966f40d', alternate = 'tax-69fb3bfd789d9843';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 fs.mkdirSync(output, {recursive:true});
 const observations=[];
 try {
  for (const locale of ['pl','nl','en']) {
   const page = await browser.newPage({viewport:{width:1536,height:1050},reducedMotion:'reduce'});
   const errors=[],rdwRequests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(r.url().includes('/api/rdw-lookup'))rdwRequests.push(r.url());});
   assert.equal((await page.goto(base+'/'+locale,{waitUntil:'networkidle',timeout:60000})).status(),200);
   await page.waitForFunction(()=>{const node=document.getElementById('manual-quick-search');return node&&Object.keys(node).some(k=>k.startsWith('__reactFiber$'));});
   for (const width of [320,390,768,1024,1279,1280,1366,1440,1535,1536,1920,2560]) {
    await page.setViewportSize({width,height:1050});
    await page.evaluate(()=>window.scrollTo(0,0)); await pause(80);
    const layout = await page.locator('.ux-site-header').evaluate(h=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
     const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
     const nav=h.querySelector('nav[aria-label="Main menu"]');
     const logo=h.querySelector('.site-header-shell > a');
     const languages=[...h.querySelectorAll('[data-testid="language-switcher"]')].find(visible);
     const links=nav&&visible(nav)?[...nav.querySelectorAll('a')].map(e=>({text:e.textContent,box:rect(e),clickable:(()=>{const r=e.getBoundingClientRect();const at=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return at===e||e.contains(at);})()})):[];
     return {width:innerWidth,logo:rect(logo),flags:languages?rect(languages):null,links,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    assert.ok(layout.overflow<=1,locale+' '+width+' horizontal overflow');
    assert.ok(layout.flags&&layout.flags.left>=layout.logo.right-1,locale+' '+width+' flags overlap logo');
    if(width>=1280){
     assert.equal(layout.links.length,10,'Complete desktop menu');
     assert.ok(layout.links[0].box.left>=layout.logo.right+2,locale+' '+width+' menu overlaps logo');
     assert.ok(layout.links.at(-1).box.right<=layout.flags.left-2,locale+' '+width+' menu overlaps language controls');
     for(let i=0;i<layout.links.length;i++){
      assert.ok(layout.links[i].clickable,locale+' '+width+' obscured navigation '+layout.links[i].text);
      if(i)assert.ok(layout.links[i].box.left>=layout.links[i-1].box.right+1,'Menu item overlap');
     }
    }else assert.equal(layout.links.length,0,'Use mobile menu below desktop breakpoint');
    observations.push({locale,width,header:'pass'});
   }
   await page.setViewportSize({width:390,height:900});
   const trigger=page.locator('[aria-controls="catalog-mobile-navigation"]');
   await trigger.click(); await page.locator('#catalog-mobile-navigation').waitFor({state:'visible'});
   await page.keyboard.press('Escape'); await page.locator('#catalog-mobile-navigation').waitFor({state:'hidden'});
   await page.setViewportSize({width:1440,height:1050});
   const filters=page.getByTestId('manual-vehicle-filters'),selects=filters.locator('select');
   await selects.nth(0).selectOption('BMW');
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-testid="manual-vehicle-filters"] select')][1]?.querySelector('option[value="1"]'));
   await selects.nth(1).selectOption('1');
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-testid="manual-vehicle-filters"] select')][2]?.querySelector('option[value="2021"]'));
   await selects.nth(2).selectOption('2021');
   await page.waitForFunction(id=>[...document.querySelectorAll('[data-testid="manual-vehicle-filters"] select')][3]?.querySelector('option[value="'+id+'"]'),bmw);
   await selects.nth(3).selectOption(bmw);
   const details=page.getByTestId('manual-catalog-details');
   await page.waitForFunction(id=>document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-selection-id')===id&&document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-result-status')==='source-comparison',bmw);
   assert.ok((await details.getByTestId('manual-stock-power').innerText()).includes('140'));
   assert.ok((await details.getByTestId('manual-stage1-power').innerText()).includes('170'));
   assert.ok((await details.getByTestId('manual-stage1-power').innerText()).includes('180'));
   assert.ok((await details.getByTestId('manual-power-gain').innerText()).includes('30'));
   assert.ok((await details.innerText()).includes('2021')||(await details.getByTestId('manual-result-year').inputValue())==='2021');
   const search=page.getByTestId('manual-search-action');
   assert.equal((await search.textContent()).trim(),{pl:'Szukaj',nl:'Bekijk resultaten',en:'View results'}[locale]);
   await search.click();
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'manual-taxonomy-result','The red button focuses a real visible result');
   await details.getByTestId('manual-catalog-sources').locator('summary').click();
   assert.equal(await details.getByTestId('manual-catalog-sources').locator('a').count(),2);
   assert.ok((await details.getByTestId('manual-fuel-condition').innerText()).includes('98'));
   await page.evaluate(()=>{window.__manualOpen=[];window.open=(...args)=>{window.__manualOpen.push(args[0]);return null;};});
   await details.getByTestId('manual-catalog-contact').click();
   const message=await page.evaluate(()=>decodeURIComponent(window.__manualOpen[0]||''));
   assert.ok(message.includes('118i')&&message.includes('2021')&&message.includes('F40'),'Contact retains chosen engine and year');
   await details.getByTestId('manual-optional-plate').click();
   assert.equal(await page.evaluate(()=>document.activeElement?.closest('#rdw-check')?.id),'rdw-check','Optional registration link focuses existing input, not unmounted results');
   for(const width of [320,390,1024,1440]){
    await page.setViewportSize({width,height:1050});await details.scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1),locale+' '+width+' manual result overflow');
    if(locale==='pl'&&(width===390||width===1440))await filters.screenshot({path:path.join(output,'manual-bmw-'+width+'.png')});
   }
   await details.getByTestId('manual-result-year').selectOption('2026');
   await page.waitForFunction(()=>document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-result-status')==='needs-review');
   assert.equal(await details.getByTestId('manual-catalog-sources').count(),0,'Outside source year: no misleading stage figure');
   assert.ok(!(await details.getByTestId('manual-stage1-power').innerText()).match(/\d/));
   // Change the engine while an old request is pending. Old figures must never win.
   await page.route('**/api/catalog-selector?*',async route=>{const u=new URL(route.request().url());if(u.searchParams.get('mode')==='selection'&&u.searchParams.get('id')===bmw)await pause(300);await route.continue().catch(()=>{});});
   await selects.nth(3).selectOption('');await selects.nth(3).selectOption(bmw);await selects.nth(3).selectOption(alternate);
   await page.waitForFunction(id=>document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-selection-id')===id,alternate);
   await pause(450);assert.equal(await details.getAttribute('data-selection-id'),alternate);
   await page.unroute('**/api/catalog-selector?*');
   await selects.nth(0).selectOption('');assert.equal(await details.count(),0,'Clearing parent removes previous result');
   const quick=page.locator('#manual-quick-search');await quick.fill('BMW F40 118i 140');
   const quickItem=page.locator('[data-selector-id="'+bmw+'"]');await quickItem.waitFor({state:'visible'});await quickItem.click();
   await page.waitForFunction(()=>document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-result-status')==='select-year');
   await details.getByTestId('manual-result-year').selectOption('2021');
   await page.waitForFunction(()=>document.querySelector('[data-testid="manual-catalog-details"]')?.getAttribute('data-result-status')==='source-comparison');
   // Explicit retry after one failed response must recover.
   let failOnce=true;
   await page.route('**/api/catalog-selector?*',async route=>{const u=new URL(route.request().url());if(u.searchParams.get('mode')==='selection'&&failOnce){failOnce=false;return route.fulfill({status:503,contentType:'application/json',body:'{"error":"temporary"}'});}return route.continue();});
   await details.getByTestId('manual-result-year').selectOption('2020');
   await page.locator('#manual-taxonomy-result [role="alert"]').waitFor({state:'visible'});
   await page.locator('#manual-taxonomy-result [role="alert"] button').click();
   await details.waitFor({state:'visible'});await page.unroute('**/api/catalog-selector?*');
   assert.equal(await details.getByTestId('manual-result-year').inputValue(),'2020');
   assert.deepEqual(rdwRequests,[],'Manual browsing must never request or require a registration');
   assert.deepEqual(errors,[],locale+' browser exceptions');
   console.log('MANUAL_HEADER_BROWSER_PASS',locale);await page.close();
  }
  const request=await browser.newContext();
  for(const query of ['mode=selection&id=invalid&year=2021','mode=selection&id='+bmw+'&year=2018','mode=selection&id='+bmw+'&year=bad'])assert.equal((await request.request.get(base+'/api/catalog-selector?'+query)).status(),400);
  const ok=await request.request.get(base+'/api/catalog-selector?mode=selection&id='+bmw+'&year=2021');assert.equal(ok.status(),200);
  assert.ok((await ok.json()).result.sources.length===2);await request.close();
  fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({base,headerCases:observations.length,locales:['pl','nl','en'],manualBMW:true,quickSearch:true,pending:true,retry:true,races:true,plateOptional:true,apiValidation:true},null,2));
  console.log('MANUAL_HEADER_ALL_PASS',observations.length,'header widths/locales; selection, quick search, pending, retry, stale-response, contact and optional plate flows');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

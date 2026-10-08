/* eslint-disable @typescript-eslint/no-require-imports */
// Exact-release synthetic RDW browser QA. No real plate, VIN or customer data.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE ||
  "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const {normalizeRdwVehicle} = require("../src/lib/rdw.ts");
const frozen = require("../data/research/nl-top-groups-output-sample.json");
const root = process.env.RDW_QA_URL || "http://127.0.0.1:3147";
const share = process.env.RDW_QA_ACCESS_URL || "";
const output = process.env.RDW_QA_OUTPUT || "C:/Users/barto/Desktop/noordtune-octavia-122-qa";
const plate = "QA0122";
const original = frozen.rows.find(row =>
  row.vehicle.merk==="SKODA" && row.vehicle.handelsbenaming==="OCTAVIA" &&
  row.vehicle.type==="1Z" && Number(row.vehicle.cilinderinhoud)===1390 &&
  row.vehicle.datum_eerste_toelating_dt?.startsWith("2011") &&
  row.fuels.some(f=>f.brandstof_omschrijving==="Benzine"&&Number(f.nettomaximumvermogen)===90));
assert.ok(original, "Fixed Octavia 1Z 90kW / 2011 observation exists");
const payload = normalizeRdwVehicle(original.vehicle, original.fuels, plate);
delete payload.raw;
assert.equal(payload.tuningEstimate.profile?.id,"rdw-skoda-octavia-1z-14-tsi-122");
assert.deepEqual(payload.tuningEstimate.profile.stages[0].powerRangeHp,[140,155]);
assert.deepEqual(payload.tuningEstimate.profile.stages[0].torqueRangeNm,[240,270]);
const cases = ["nl","en","pl"].flatMap(locale=>[320,390,1180].map(width=>({locale,width})));
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(fs.existsSync);
  const browser = await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{})});
  const report = [];
  const ctx = await browser.newContext({viewport:{width:390,height:900},reducedMotion:"reduce"});
  const oidcToken = process.env.VERCEL_OIDC_TOKEN || "";
  if (oidcToken) {
    // Never expose the short-lived token to other origins or in browser state.
    const previewOrigin = new URL(root).origin;
    await ctx.route(url => url.origin === previewOrigin, route => route.continue({
      headers: {...route.request().headers(), "x-vercel-trusted-oidc-idp-token":oidcToken}
    }));
  }
  try {
    if (share) {
      const authPage = await ctx.newPage();
      const auth = await authPage.goto(share,{waitUntil:"domcontentloaded"});
      assert.ok(auth && auth.status()<400,"temporary Preview access failed");
      await authPage.close();
    }
    for (const {locale,width} of cases) {
      const page = await ctx.newPage();
      await page.setViewportSize({width,height:950});
      const errors = [];
      const requests = [];
      page.on("pageerror",e=>errors.push(e.message));
      page.on("request",request=>{
        if (request.url().toUpperCase().includes(plate))requests.push("plate in URL");
        if ((request.postData()||"").includes(plate) &&
           !(request.url().includes("/api/rdw-lookup") && request.method()==="POST"))
          requests.push("plate beyond RDW POST");
      });
      await page.route("**/api/rdw-lookup",route=>route.fulfill({
        status:200,contentType:"application/json",body:JSON.stringify(payload)
      }));
      const target=`${root}/${locale}`;
      const nav=await page.goto(target,{waitUntil:"domcontentloaded"});
      assert.ok(nav?.status()===200,`${locale}/${width}: expected HTTP 200 got ${nav?.status()}`);
      const input=page.locator('input[maxlength="10"]');
      await input.waitFor({state:"visible"});
      await input.fill(plate);
      const promise=page.waitForResponse(response=>response.url().includes("/api/rdw-lookup") && response.request().method()==="POST");
      await input.locator("xpath=ancestor::form").locator('button[type="submit"]').click();
      assert.equal((await promise).status(),200);
      const card=page.getByTestId("rdw-result");
      await card.waitFor({state:"visible"});
      const display=await card.innerText();
      assert.ok(display.includes("SKODA OCTAVIA"),"Real RDW make/model preserved");
      assert.ok(display.includes("90 kW") && display.includes("1390 cc"),"Registered power and displacement shown");
      assert.ok(display.includes("122"),"122 PS factory visible");
      assert.ok(display.includes("140") && display.includes("155"),"Stage 1 PS source range visible");
      assert.ok(display.includes("240") && display.includes("270"),"Stage 1 Nm source range visible");
      const stage=card.locator("tbody tr").first();
      assert.ok((await stage.innerText()).includes("140"));
      await stage.click();
      const quote=card.getByTestId("rdw-exact-quote");
      assert.ok(await quote.isVisible(),"Conditional enquiry CTA");
      const href=await quote.getAttribute("href");
      assert.ok(!href || !href.toUpperCase().includes(plate),"Plate is not in a contact URL");
      assert.equal(await card.getByTestId("catalog-power-chart").count(),1,"Power chart present");
      assert.equal(await card.getByTestId("rdw-pending-chart").count(),0,"Numeric reference not replaced with pending");
      assert.ok(!display.includes("Stage 3+"),"Stage 3 is not a customer option");
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert.ok(overflow<=1,`${locale}/${width}: horizontal overflow ${overflow}`);
      assert.deepEqual(errors,[],`browser runtime ${locale}/${width}`);
      assert.deepEqual(requests,[],`no URL leakage ${locale}/${width}`);
      if (width===390) await card.screenshot({path:path.join(output,`octavia-1z-${locale}-390.png`)});
      report.push({locale,width,stockKw:90,stage1Hp:[140,155],stage1Nm:[240,270],pageStatus:nav.status(),overflow,errorCount:errors.length});
      console.log(`PASS OCTAVIA_1Z_BROWSER ${locale} ${width}px`);
      await page.close();
    }
  } finally {
    await ctx.close();
    await browser.close();
  }
  assert.equal(report.length,9);
  fs.writeFileSync(path.join(output,"qa-summary.json"),JSON.stringify({checkedAt:new Date().toISOString(),cases:report,errors:[]},null,2)+"\n");
  console.log("OCTAVIA_1Z_BROWSER_QA_PASS: 9/9 NL/EN/PL × 320/390/1180, synthetic RDW; preview auth "+(share||oidcToken?"yes":"no"));
})().catch(e=>{console.error(e);process.exitCode=1});

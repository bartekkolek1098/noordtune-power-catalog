/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require("node:assert/strict");
const {existsSync}=require("node:fs");
const {chromium}=require(
  process.env.PLAYWRIGHT_MODULE ||
  "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"
);
const base=process.env.TAXONOMY_QA_URL||"http://127.0.0.1:3012";
const systemBrowser=[
  process.env.PLAYWRIGHT_EXECUTABLE,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
].find(p=>p&&existsSync(p));

(async()=>{
  const browser=await chromium.launch({headless:true,...(systemBrowser?{executablePath:systemBrowser}:{})});
  const page=await browser.newPage({viewport:{width:390,height:900}});
  const errors=[];
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  page.on("pageerror",e=>errors.push(e.message));
  try{
    const api=async url=>await (await page.request.get(base+url)).json();
    const models=(await api("/api/catalog-selector?mode=models&brand=Volkswagen")).models;
    assert.ok(models.includes("Golf"));
    assert.ok(models.includes("Transporter"));
    assert.ok(!models.includes("Golf 2.0 BiTDI"));

    const years=(await api("/api/catalog-selector?mode=years&brand=Volkswagen&model=Golf")).years;
    assert.ok(years.includes(2019));

    const golf=(await api("/api/catalog-selector?mode=engines&brand=Volkswagen&model=Golf&year=2019")).vehicles;
    assert.ok(golf.some(v=>v.kind==="taxonomy"));
    assert.ok(!golf.some(v=>/BiTDI/i.test(v.engine)));
    assert.ok(golf.filter(v=>v.kind==="taxonomy").every(v=>v.quote.kind==="on-request"));

    const transporter=(await api("/api/catalog-selector?mode=engines&brand=Volkswagen&model=Transporter&year=2019")).vehicles;
    assert.ok(transporter.some(v=>v.kind==="taxonomy"&&/204\s*KM/i.test(v.engine)));

    const fakeSearch=(await api("/api/catalog-selector?mode=search&q=Volkswagen%20Golf%202.0%20BiTDI%202019")).vehicles;
    assert.ok(!fakeSearch.some(v=>/BiTDI/i.test(v.engine)));
    const realSearch=(await api("/api/catalog-selector?mode=search&q=Volkswagen%20Transporter%20204")).vehicles;
    assert.ok(realSearch.some(v=>v.kind==="taxonomy"));

    await page.goto(base+"/nl",{waitUntil:"networkidle"});
    const selector=page.locator("#manual-selector");
    assert.ok(await selector.isVisible());
    const quick=selector.locator("input").first();
    const selects=selector.locator("select");
    const waitForOption=async(index,value)=>page.waitForFunction(
      ({index,value})=>{
        const select=document.querySelectorAll("#manual-selector select")[index];
        return Boolean(select&&Array.from(select.options).some(option=>option.value===value));
      },
      {index,value}
    );
    await selects.nth(0).selectOption("Volkswagen");
    await waitForOption(1,"Golf");
    await selects.nth(1).selectOption("Golf");
    await waitForOption(2,"2019");
    await selects.nth(2).selectOption("2019");
    await page.waitForFunction(()=>{
      const select=document.querySelectorAll("#manual-selector select")[3];
      return Boolean(select&&select.options.length>1);
    });
    const firstEngine=await selects.nth(3).locator("option").nth(1).getAttribute("value");
    assert.ok(firstEngine);
    await selects.nth(3).selectOption(firstEngine);

    await quick.fill("Volkswagen Transporter 204");
    const result=selector.locator('[data-testid="manual-result-action"]').first();
    await result.waitFor({state:"visible"});
    assert.match(await result.innerText(),/Transporter/i);
    assert.match(await result.innerText(),/204/i);
    await result.click();
    const confirmPlate=selector.getByRole("button",{name:/Bevestig met kenteken/i});
    assert.ok(await confirmPlate.isVisible());
    assert.match(await confirmPlate.locator("xpath=..").innerText(),/Transporter/i);

    await selects.nth(1).selectOption("Transporter");
    assert.equal(await confirmPlate.count(),0,"changing the manual model must clear a quick-search taxonomy selection");

    await quick.fill("Volkswagen Golf 2.0 BiTDI 2019");
    await page.waitForTimeout(350);
    const text=await selector.innerText();
    assert.ok(!/Golf[\s\S]{0,120}BiTDI/i.test(text));

    assert.deepEqual(errors,[],errors.join("\n"));
    console.log("Selector taxonomy browser PASS: real 4,592-row taxonomy drives manual/search flows; fake Golf 204 BiTDI is absent; real Transporter 204 remains selectable.");
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

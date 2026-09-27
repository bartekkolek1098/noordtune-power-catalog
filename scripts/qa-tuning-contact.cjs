/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const directory = path.resolve("docs/tuning-qa/corrective");
const pairs = [
  {name: "BMW 128ti · 320 px", id: "bmw128ti", width: 320},
  {name: "Golf GTI · 320 px", id: "golf-gti", width: 320},
  {name: "BMW 128ti · 1440 px", id: "bmw128ti", width: 1440},
  {name: "Golf GTI · 1440 px", id: "golf-gti", width: 1440}
  ,{name: "Transit Custom · 1440 px", id: "transit-custom", width: 1440}
  ,{name: "Transit Connect · 1440 px", id: "transit-connect", width: 1440}
];
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Tuning interface visual comparison</title><style>
body{background:#101216;color:#ecedf1;font:14px Arial,sans-serif;margin:24px}h1{font-size:26px;margin-bottom:8px}p{color:#adb5c2;max-width:980px;line-height:1.5}.pairs{display:grid;grid-template-columns:1fr 1fr;gap:20px}section{background:#191d24;border:1px solid #353d49;border-radius:6px;padding:16px;min-width:0}h2{font-size:17px;margin:0 0 12px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0;min-width:0}figcaption{font-size:13px;margin-bottom:10px;color:#b9c3d2}img{display:block;max-width:100%;height:auto;margin:auto}a{color:#f27e89;font-size:12px;display:inline-block;margin-top:10px}.mobile img{height:850px;width:auto}
</style><h1>Approved baseline and corrective local tuning result</h1><p>Same Chrome 152, same viewport, same sanitized vehicle facts. The corrected result retains compatible tuning figures independently of ECU verification or price mode. Sourced reference figures, peak-value chart captions and scoped draft pricing are intentional. Full screenshots include every Stage, option and quote control. No production deployment was changed.</p><div class="pairs">${pairs.map(({name,id,width}) => `<section class="${width === 320 ? "mobile" : "desktop"}"><h2>${name}</h2><div class="pair">${["baseline","final"].map((version) => `<figure><figcaption>${version === "baseline" ? "Pinned baseline 4d12e510" : "Local correction"}</figcaption><img src="${version}-${id}-${width}-summary.png" alt="${version} ${name} summary"><a href="${version}-${id}-${width}.png">Open full result screenshot</a></figure>`).join("")}</div></section>`).join("")}</div>`;
const destination = path.join(directory, "visual-comparison.html");
fs.writeFileSync(destination, html);
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1180, height: 1100}, deviceScaleFactor: 1});
    await page.goto(pathToFileURL(destination).href, {waitUntil: "load"});
    await page.screenshot({path: path.join(directory, "visual-comparison.png"), fullPage: true});
    const resultsHtml = `<!doctype html><html><meta charset="utf-8"><title>Sourced local tuning estimates</title><style>body{background:#101216;color:#fff;font:18px Arial;margin:24px}main{display:grid;grid-template-columns:repeat(3,640px);gap:24px}h1{font-size:28px}h2{font-size:21px}p{max-width:1900px;color:#bbc3cf;line-height:1.5}img{width:640px;height:auto}a{color:#f17e88}</style><h1>Compatible Stage 1 output, scoped draft prices and catalog illustrations</h1><p>Sanitized official vehicle facts. The added power and torque figures are tuner-published references, not NoordTune measurements. Transit Connect is explicitly conditional on confirming the pre-facelift 1.5 TDCi engine. Higher stages without published figures stay unfilled while Stage 1 remains available.</p><main>${[{id:"bmw128ti",title:"BMW 128ti · 310 pk / 480 Nm"},{id:"transit-custom",title:"Transit Custom · 190 pk / 440 Nm"},{id:"transit-connect",title:"Transit Connect · 125 pk / 330 Nm"}].map(({id,title})=>`<section><h2>${title}</h2><a href="final-${id}-1440.png"><img src="final-${id}-1440.png" alt="${title} full local tuning result"></a></section>`).join("")}</main>`;
    const resultsPath = path.join(directory, "corrective-results.html");
    fs.writeFileSync(resultsPath, resultsHtml);
    await page.setViewportSize({width: 2020, height: 1100});
    await page.goto(pathToFileURL(resultsPath).href, {waitUntil: "load"});
    await page.screenshot({path: path.join(directory, "corrective-results.png"), fullPage: true});
    console.log("Saved corrective visual comparison and sourced-results contact sheets.");
  } finally {
    await browser.close();
  }
})();

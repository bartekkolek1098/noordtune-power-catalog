/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/barto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const directory = path.resolve("docs/tuning-qa");
const pairs = [
  {name: "BMW 128ti · 320 px", id: "bmw128ti", width: 320},
  {name: "Golf GTI · 320 px", id: "golf-gti", width: 320},
  {name: "BMW 128ti · 1440 px", id: "bmw128ti", width: 1440},
  {name: "Golf GTI · 1440 px", id: "golf-gti", width: 1440}
];
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Tuning interface visual comparison</title><style>
body{background:#101216;color:#ecedf1;font:14px Arial,sans-serif;margin:24px}h1{font-size:26px;margin-bottom:8px}p{color:#adb5c2;max-width:980px;line-height:1.5}.pairs{display:grid;grid-template-columns:1fr 1fr;gap:20px}section{background:#191d24;border:1px solid #353d49;border-radius:6px;padding:16px;min-width:0}h2{font-size:17px;margin:0 0 12px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}figure{margin:0;min-width:0}figcaption{font-size:13px;margin-bottom:10px;color:#b9c3d2}img{display:block;max-width:100%;height:auto;margin:auto}a{color:#f27e89;font-size:12px;display:inline-block;margin-top:10px}.mobile img{height:850px;width:auto}
</style><h1>Approved baseline and local tuning fix</h1><p>Same Chrome 152, same viewport, same sanitized vehicle facts. The new date, quote/access wording and conservative matching are intentional. Narrow text wraps now prevent existing baseline clipping. Full result screenshots include every Stage, option and quote control. No production deployment was changed.</p><div class="pairs">${pairs.map(({name,id,width}) => `<section class="${width === 320 ? "mobile" : "desktop"}"><h2>${name}</h2><div class="pair">${["baseline","final"].map((version) => `<figure><figcaption>${version === "baseline" ? "Pinned baseline 4d12e510" : "Local fix"}</figcaption><img src="${version}-${id}-${width}-summary.png" alt="${version} ${name} summary"><a href="${version}-${id}-${width}.png">Open full result screenshot</a></figure>`).join("")}</div></section>`).join("")}</div>`;
const destination = path.join(directory, "visual-comparison.html");
fs.writeFileSync(destination, html);
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1180, height: 1100}, deviceScaleFactor: 1});
    await page.goto(pathToFileURL(destination).href, {waitUntil: "load"});
    await page.screenshot({path: path.join(directory, "visual-comparison.png"), fullPage: true});
    console.log("Saved visual-comparison.html and visual-comparison.png");
  } finally {
    await browser.close();
  }
})();

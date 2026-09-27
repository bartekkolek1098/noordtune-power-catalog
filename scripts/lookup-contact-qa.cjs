/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const captures = new WeakMap();

async function lookupContactMessage(page, button) {
  if (!captures.has(page)) {
    const capture = {resolve: undefined};
    captures.set(page, capture);
    await page.exposeFunction("__qaLookupContact", url => capture.resolve?.(url));
  }
  // Replace only the browser opener, never the production message builder or API.
  // The URL stays in the Node test process; no third-party page/message is opened.
  await page.evaluate(() => {window.open = url => {window.__qaLookupContact(String(url)); return null;};});
  assert.equal(await button.getAttribute("href"), null, "No prebuilt lookup contact href");
  const url = new Promise(resolve => {captures.get(page).resolve = resolve;});
  await button.click();
  const value = await url;
  captures.get(page).resolve = undefined;
  assert.equal(new URL(value).hostname, "wa.me");
  return new URL(value).searchParams.get("text");
}
module.exports = {lookupContactMessage};

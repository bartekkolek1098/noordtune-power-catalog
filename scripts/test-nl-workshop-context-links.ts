import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dutchBrandChiptuningHref,dutchBusinessVansHref,chiptuningHref,MAIN_SITE_URL} from "../src/lib/noordtune-links.ts";

const published=[
 ["BMW","bmw-chiptuning"],
 ["Audi","audi-chiptuning"],
 ["Volkswagen","volkswagen-chiptuning"],
 ["Ford","ford-chiptuning"],
 ["Toyota","toyota-chiptuning"]
] as const;

for(const [make,slug]of published){
 const u=new URL(dutchBrandChiptuningHref(make));
 assert.equal(u.origin,MAIN_SITE_URL);
 assert.equal(u.pathname,"/nl/"+slug);
 assert.equal(u.search+u.hash,"");
 assert.equal(dutchBrandChiptuningHref(make.toUpperCase()),u.href);
 assert.equal(dutchBrandChiptuningHref(" "+make+" "),u.href);
}
for(const make of ["Citroen","Citroën","Peugeot","Renault","Nissan","Seat","Mercedes-Benz","Opel","MINI",""]) {
 assert.equal(dutchBrandChiptuningHref(make),chiptuningHref("nl"),"No fictitious brand landing "+make);
}
const vans=new URL(dutchBusinessVansHref());
assert.equal(vans.origin,MAIN_SITE_URL);
assert.equal(vans.pathname,"/nl/bedrijfswagens");
assert.equal(vans.search+vans.hash,"");

const engine=readFileSync("src/app/[locale]/motoren/[slug]/page.tsx","utf8");
const model=readFileSync("src/app/[locale]/modellen/[slug]/page.tsx","utf8");
const vanIndex=readFileSync("src/app/[locale]/bedrijfswagens/page.tsx","utf8");
const vanModel=readFileSync("src/app/[locale]/bedrijfswagens/[slug]/page.tsx","utf8");
const vanEngine=readFileSync("src/app/[locale]/bedrijfswagens/motoren/[slug]/page.tsx","utf8");
assert.ok(engine.includes("dutchBrandChiptuningHref(p.applications[0].make)"));
assert.ok(model.includes("dutchBrandChiptuningHref(m.brand)"));
for(const [name,page] of [["van-index",vanIndex],["van-model",vanModel],["van-engine",vanEngine]]) {
 assert.ok(page.includes("href={dutchBusinessVansHref()}"),name+": direct commercial-van service CTA");
 assert.ok(!page.includes('href={chiptuningHref("nl")}'),name+": generic link should be replaced");
}
assert.ok(engine.includes('sitePath("/nl#rdw-check")'));
assert.ok(vanEngine.includes("CatalogEnquiryLink"),"Full engine context handoff must remain");
assert.ok(vanEngine.includes("whatsappHref("),"Van WhatsApp handoff remains");

console.log("NL_WORKSHOP_CONTEXT_LINKS_PASS",JSON.stringify({publishedBrandLandings:published.length,serviceLanding:"/nl/bedrijfswagens",sourceRoutes:5,unpublishedBrandsFallback:true,rdwPreserved:true,quoteHandoffPreserved:true}));

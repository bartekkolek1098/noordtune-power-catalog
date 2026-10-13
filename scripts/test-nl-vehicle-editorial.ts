import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {engineCatalog} from "../src/data/catalog.ts";
import {nlVehicleEditorials,nlVehicleEditorialById,nlVehiclePhoto,nlVehicleDirectoryPath} from "../src/data/nl-vehicle-editorial.ts";
import photoDocument from "../src/data/nl-vehicle-photo-library.json" with {type:"json"};

assert.equal(nlVehicleDirectoryPath,"/nl/voertuigen");
assert.equal(nlVehicleEditorials.length,24,"All existing curated /vehicles/ pages receive unique editorial");
assert.equal(engineCatalog.length,24,"No unchecked batch-published routes");
assert.deepEqual(new Set(nlVehicleEditorials.map(p=>p.id)),new Set(engineCatalog.map(v=>v.id)));
assert.equal(Object.keys(photoDocument.images).length,15);
const sectionFields=["intro","difference","checks","usage"] as const;
const observedFAQ=new Set<string>();
for(const article of nlVehicleEditorials){
 const vehicle=engineCatalog.find(x=>x.id===article.id)!;
 assert.ok(vehicle,"Unknown catalog profile "+article.id);
 assert.equal(nlVehicleEditorialById.get(article.id),article);
 assert.ok(article.faq.length===2);
 for(const [q,a] of article.faq){
  assert.ok(q.length>=25&&a.length>=68,"Unreviewed or thin FAQ "+article.id);
  assert.ok(!observedFAQ.has(q),"Duplicated boilerplate FAQ "+q);
  observedFAQ.add(q);
 }
 for(const field of sectionFields){
   assert.ok(article[field].length>145,"Thin editoral "+article.id+" "+field);
   assert.ok(!/NoordTune heeft dit voertuig getuned/i.test(article[field]),"Unproven NoordTune work");
 }
 assert.ok(article.related.every(x=>nlVehicleEditorialById.has(x)&&x!==article.id),"Wrong contextual links "+article.id);
 const photo=nlVehiclePhoto(article);
 assert.ok(photo.source.startsWith("https://commons.wikimedia.org/wiki/File:"));
 assert.match(photo.license,/^CC BY(?:-SA)? [234]\.0$/);
 assert.ok(photo.licenseUrl.startsWith("https://creativecommons.org/licenses/"));
 assert.ok(photo.author.length>=2&&!photo.author.includes("<"));
 assert.ok(photo.width>=550&&photo.height>=350&&photo.bytes>=20000);
 const bytes=readFileSync("public"+photo.src);
 assert.equal(bytes.length,photo.bytes);
 assert.equal(createHash("sha256").update(bytes).digest("hex"),photo.sha256);
 assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);
}
const source=readFileSync("src/app/[locale]/vehicles/[vehicleId]/page.tsx","utf8");
const component=readFileSync("src/components/nl-vehicle-knowledge.tsx","utf8");
const index=readFileSync("src/app/[locale]/voertuigen/page.tsx","utf8");
const sitemap=readFileSync("src/app/sitemap.ts","utf8");
const footer=readFileSync("src/components/catalog-footer.tsx","utf8");
assert.match(source,/NlVehicleKnowledge/);
assert.match(source,/nlVehicleEditorialById/);
assert.match(source,/assetPath\(licensedPhoto\?\.src\?\?vehicle\.image\)/);
assert.match(component,/Modelafbeelding ter illustratie, geen NoordTune-klantauto/);
assert.match(component,/photo\.source/);
assert.match(component,/photo\.licenseUrl/);
assert.match(component,/quality=\{78\}/,"Next image optimizer only permits configured quality 78/82/90");
assert.match(index,/generateStaticParams\(\).*locale:"nl"/);
assert.match(index,/24 apart beoordeelde motorprofielen/);
assert.match(sitemap,/reviewedVehicleDirectory/);
assert.match(footer,/Alle motorprofielen vergelijken/);
assert.ok(!source.includes("generateStaticParams() {\n  return vehicleDatabase.map("),"No 58k generated vehicle pages");
const imgs=new Set(nlVehicleEditorials.map(x=>x.photoKey));
assert.equal(imgs.size,15);
console.log("NL_VEHICLE_SEO_FACTORY_1_PASS",JSON.stringify({reviewedVehiclePages:24,uniqueEditorials:24,uniqueFAQ:observedFAQ.size,licensedCommonsPhotos:imgs.size,indexDirectory:1,automaticMassIndexing:false}));

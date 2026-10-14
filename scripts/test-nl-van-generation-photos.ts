import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {nlVanEngines} from "../src/data/nl-van-engines-seo.ts";
import {nlVanPhotos,nlVanPhotoByEngineSlug,getNlVanGenerationPhoto} from "../src/data/nl-van-generation-photos.ts";
import manifest from "../src/data/nl-van-generation-photos.json" with {type:"json"};
assert.equal(manifest.schemaVersion,1);
assert.equal(nlVanEngines.length,101,"Van SEO engine pages must preserve 100 originals plus reviewed Caddy");
assert.equal(Object.keys(nlVanPhotos).length,27,"All 27 manually chosen van-generation photos retained");
assert.equal(nlVanPhotoByEngineSlug.size,86,"Existing 85 plus same-generation approved Caddy 2KN photo");
const allowedLicensed=/^CC BY(?:-SA)? [234]\.0$/;
for(const [key,photo] of Object.entries(nlVanPhotos)){
 assert.equal(photo.src,"/images/seo-vans/"+key+".jpg","Photo key cannot leak a wrong-generation path");
 assert.ok(photo.source.startsWith("https://commons.wikimedia.org/wiki/File:"));
 assert.ok(photo.licenseUrl.startsWith("https://creativecommons.org/licenses/"));
 assert.match(photo.license,allowedLicensed);
 assert.ok(photo.author.length>=2&&!photo.author.includes("<"));
 assert.ok(photo.width>=850&&photo.height>390&&photo.bytes>=25000);
 const file=readFileSync("public"+photo.src);
 assert.equal(file.length,photo.bytes,key+": local image bytes");
 assert.equal(createHash("sha256").update(file).digest("hex"),photo.sha256,key+": provenance mismatch");
 assert.equal(file[0],255);assert.equal(file[1],216);
}
const uncovered=nlVanEngines.filter(e=>!getNlVanGenerationPhoto(e));
assert.equal(uncovered.length,15,"The additional 2KN Caddy uses a reviewed matching-generation image");
const required=[
 ["volkswagen-transporter-t5-20-tdi-140","/vw-transporter-t5.jpg"],
 ["volkswagen-caddy-2kn-20-tdi-140-2013-14","/vw-caddy-2kn.jpg"],
 ["volkswagen-transporter-t6-20-tdi-204","/vw-transporter-t6.jpg"],
 ["volkswagen-transporter-t61-20-tdi-150-2020-21","/vw-transporter-t61.jpg"],
 ["citroen-berlingo-16-hdi-75-2015","/citroen-berlingo-ii.jpg"],
 ["citroen-berlingo-iii-15-bluehdi-75-2019-23","/citroen-berlingo-iii.jpg"],
 ["opel-vivaro-c-20-d-177-2024","/opel-vivaro-c.jpg"],
 ["mercedes-sprinter-w906-21-cdi-143","/mb-sprinter-w906.jpg"],
 ["toyota-proace-city-15-d4d-100-2020-23","/toyota-proace-city.jpg"]
] as const;
for(const [slug,end] of required){
 const e=nlVanEngines.find(x=>x.slug===slug);assert.ok(e);
 const p=getNlVanGenerationPhoto(e);
 assert.ok(p?.src.endsWith(end),"Specific photo must match van generation "+slug);
}
const withheld=[
 "opel-vivaro-b-16-cdti-95-euro6-2017-19",
 "fiat-doblo-16-multijet-100-2015",
 "opel-movano-c-22-diesel-140-2021-23",
 "renault-master-23-bluedci-135-2019",
 "fiat-ducato-23-multijet-130-2013-15"
];
for(const slug of withheld){const e=nlVanEngines.find(x=>x.slug===slug);assert.ok(e);assert.equal(getNlVanGenerationPhoto(e),undefined);}
const page=readFileSync("src/app/[locale]/bedrijfswagens/motoren/[slug]/page.tsx","utf8");
const comp=readFileSync("src/components/nl-van-generation-photo.tsx","utf8");
assert.match(page,/<NlVanGenerationPhoto engine=\{e\} model=\{m\}/);
assert.match(page,/getNlVanGenerationPhoto\(e\)/);
assert.match(page,/a\.fuel==="CNG"\?"Aardgas \(CNG\)"/,"CNG must not display as petrol");
assert.match(comp,/Modelgeneratie ter illustratie, geen NoordTune-klantauto/);
assert.match(comp,/photo\.source/);
assert.match(comp,/photo\.licenseUrl/);
assert.match(comp,/quality=\{78\}/);
console.log("NL_VAN_GENERATION_IMAGES_PASS",JSON.stringify({enginePages:101,licensedGenerationImages:27,correctlyMatchedEnginePages:86,withheldUncertainPages:15,selectedAdversarialScopeChecks:required.length+withheld.length,existingStage1Preserved:true}));

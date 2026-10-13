/** Individually reviewed Dutch vehicle page editorial; no automatic RDW-page indexing.
 * Every public entry is paired with a Commons generation photo and explicit licence.
 */
import {engineCatalog} from "./catalog.ts";
import editorial from "./nl-vehicle-editorial.json" with {type:"json"};
import photoLibrary from "./nl-vehicle-photo-library.json" with {type:"json"};

export type NlVehicleEditorial={
 id:string;
 photoKey:string;
 intro:string;
 difference:string;
 checks:string;
 usage:string;
 faq:[string,string][];
 related:string[];
};
export type NlVehiclePhoto={
 src:string;file:string;source:string;author:string;license:string;licenseUrl:string;
 width:number;height:number;sha256:string;bytes:number;altGeneration:string;
};

const entries=editorial.items as NlVehicleEditorial[];
const photos=photoLibrary.images as Record<string,NlVehiclePhoto>;
const ids=new Set(engineCatalog.map(v=>v.id));
if(editorial.schemaVersion!==1||photoLibrary.schemaVersion!==1)throw Error("NL SEO Factory schema not reviewed");
if(entries.length!==engineCatalog.length||entries.length!==24)throw Error("NL SEO Factory: one original article per curated engine required");
if(Object.keys(photos).length!==15)throw Error("NL SEO Factory photo list changed without review");
const unique=new Set<string>();
for(const article of entries){
 if(!ids.has(article.id)||unique.has(article.id))throw Error("Unapproved/duplicate indexed NL article "+article.id);
 unique.add(article.id);
 for(const [field,min] of [["intro",160],["difference",145],["checks",155],["usage",150]] as const){
  if(article[field].length<min)throw Error("Short/unreviewed editorial "+article.id+"."+field);
 }
 if(article.faq.length!==2||article.faq.some(([q,a])=>q.length<25||a.length<68))throw Error("FAQ review missing "+article.id);
 const photo=photos[article.photoKey];
 if(!photo||!photo.source.startsWith("https://commons.wikimedia.org/wiki/File:")||
   !/^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/.test(photo.license)||!photo.licenseUrl.startsWith("https://creativecommons.org/licenses/")||
   !photo.author||!/^\/images\/seo-vehicles\/[a-z0-9-]+\.jpg$/.test(photo.src))throw Error("Unsafe/unlicensed model photo "+article.id);
 if(article.related.some(x=>x===article.id||!ids.has(x))||new Set(article.related).size!==article.related.length)throw Error("Invalid related vehicle "+article.id);
}
export const nlVehicleEditorials:readonly NlVehicleEditorial[]=entries;
export const nlVehicleEditorialById=new Map(entries.map(v=>[v.id,v] as const));
export const nlVehiclePhotoByKey=new Map(Object.entries(photos));
export function nlVehiclePhoto(article:NlVehicleEditorial){return nlVehiclePhotoByKey.get(article.photoKey)!;}
export const nlVehicleDirectoryPath="/nl/voertuigen";

/** Disambiguate coarse legacy engine labels only when a reviewed displacement exists. */
const preciseEngineLabels:Record<string,string>={
 "bmw-1-series-f20-f21-118i":"1.5 turbo benzine · B38-variant",
 "bmw-1-series-f20-f21-120d":"2.0 diesel · 1995 cc",
 "bmw-3-series-f30-f31-318d":"2.0 diesel · 1995 cc",
 "bmw-3-series-f30-f31-330d":"3.0 zescilinder-diesel · 2993 cc",
 "bmw-5-series-f10-f11-520d":"2.0 diesel · 1995 cc",
 "bmw-3-series-g20-g21-320i":"2.0 turbobenzine · 1998 cc"
};
export function nlVehicleEngineTitle(id:string,defaultEngine:string):string{return preciseEngineLabels[id]??defaultEngine;}

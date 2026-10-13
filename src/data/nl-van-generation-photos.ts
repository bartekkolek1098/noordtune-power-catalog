/** 27 individually reviewed Commons van-generation photos, assigned by real NL van family.
 * Photos do not imply the pictured van is a customer vehicle or the same powertrain.
 * IMPORTANT: no fallback to an unrelated image if a family is not reviewed.
 */
import {nlVanEngines,type NlVanEngine} from "./nl-van-engines-seo.ts";
import gallery from "./nl-van-generation-photos.json" with {type:"json"};

export type NlVanPhoto={
 src:string;file:string;source:string;author:string;license:string;licenseUrl:string;
 width:number;height:number;sha256:string;bytes:number;
};
const galleryPhotos=gallery.photos as Record<string,NlVanPhoto>;
if(gallery.schemaVersion!==1||Object.keys(galleryPhotos).length!==27)throw Error("Van image library needs manual review");

function reviewedPhotoKey(e:NlVanEngine):string|undefined {
 switch(e.modelSlug){
  case "ford-transit":return "ford-transit-mk8";
  case "ford-transit-custom":return "ford-transit-custom-mk1";
  case "ford-transit-connect":return "ford-transit-connect-mk2";
  case "volkswagen-transporter":
   return e.slug.includes("-t5-")?"vw-transporter-t5":e.slug.includes("-t61-")?"vw-transporter-t61":"vw-transporter-t6";
  case "volkswagen-crafter":return "vw-crafter-mk2";
  case "volkswagen-caddy":return "vw-caddy-2kn";
  case "mercedes-sprinter":return e.slug.includes("w906")?"mb-sprinter-w906":"mb-sprinter-w907";
  case "mercedes-vito":return "mb-vito-w447";
  case "toyota-proace":return "toyota-proace-ii";
  case "toyota-proace-city":return "toyota-proace-city";
  case "peugeot-partner":return e.slug.includes("-16-hdi-75-2015")?"peugeot-partner-ii":"peugeot-partner-iii";
  case "peugeot-expert":return "peugeot-expert-iii";
  case "peugeot-boxer":return "peugeot-boxer";
  case "renault-master":
   // The reviewed photograph shows the earlier Master III front; do not silently use it on 2019+ facelifts.
   return e.applications.every(a=>a.yearTo<=2018)?"renault-master-iii":undefined;
  case "renault-kangoo":return "renault-kangoo-ii";
  case "renault-trafic":return "renault-trafic-iii";
  case "fiat-ducato":
   // Early 2013–15 Ducato fronts are different from the 2017 reviewed photograph.
   return e.slug.includes("2013-15")?undefined:"fiat-ducato";
  case "opel-vivaro-c":return "opel-vivaro-c";
  case "citroen-berlingo":return e.slug.includes("-16-hdi-75-2015")?"citroen-berlingo-ii":"citroen-berlingo-iii";
  case "opel-combo":return "opel-combo-e";
  case "citroen-jumpy":return "citroen-jumpy-iii";
  case "iveco-daily":return "iveco-daily-vi";
  // Doblò, Opel Vivaro B and Movano have no safely selected generation photo.
  default:return undefined;
 }
}
const approvedImageKeys=new Set(Object.keys(galleryPhotos));
export const nlVanPhotoByEngineSlug=new Map(nlVanEngines.flatMap(e=>{
 const key=reviewedPhotoKey(e);
 if(!key)return [];
 const photo=galleryPhotos[key];
 if(!approvedImageKeys.has(key)||!photo)throw Error("Van image without copyright review: "+key);
 return [[e.slug,photo] as const];
}));
export const nlVanPhotos=galleryPhotos;
export function getNlVanGenerationPhoto(e:NlVanEngine):NlVanPhoto|undefined{return nlVanPhotoByEngineSlug.get(e.slug);}

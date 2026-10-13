/* eslint-disable @typescript-eslint/no-require-imports */
/* Research-only Wikimedia Commons metadata for model-generation photographs.
 * Do not use search results automatically: exact generation and license must be manually reviewed.
 */
const fs=require("node:fs");
const targets={
"bmw-f30":"BMW F30 3 Series",
"bmw-e83":"BMW X3 E83",
"bmw-f20":"BMW F20 1 Series",
"bmw-f10":"BMW F10 5 Series",
"bmw-g20":"BMW G20 3 Series",
"vw-golf-7":"Volkswagen Golf Mk7",
"vw-passat-b8":"Volkswagen Passat B8",
"audi-a3-8v":"Audi A3 8V",
"audi-a4-b9":"Audi A4 B9",
"audi-a6-c7":"Audi A6 C7",
"mercedes-w176":"Mercedes W176 A45 AMG",
"volvo-xc60":"Volvo XC60 first generation",
"ford-focus-st3":"Ford Focus ST Mk3",
"skoda-5e":"Skoda Octavia 5E",
"seat-leon-5f":"SEAT Leon Cupra 5F"
};
const clean=s=>String(s??"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#\d+;/g," ").replace(/\s+/g," ").trim();
const output={date:"2026-10-12",provider:"Wikimedia Commons imageinfo extmetadata",queries:{}};
async function search(query){
 const url=new URL("https://commons.wikimedia.org/w/api.php");
 for(const [k,v] of Object.entries({action:"query",format:"json",generator:"search",gsrsearch:query,gsrnamespace:"6",gsrlimit:"12",prop:"imageinfo",iiprop:"url|extmetadata",iiurlwidth:"1200"}))url.searchParams.set(k,v);
 const rsp=await fetch(url,{headers:{"User-Agent":"NoordTuneImageResearch/1.0 (info@noordtune.nl)"}});
 if(!rsp.ok)throw Error(query+" HTTP "+rsp.status);
 const data=await rsp.json();
 return Object.values(data.query?.pages??{}).filter(x=>/\.(jpe?g)$/i.test(x.title)).map(x=>{
 const i=x.imageinfo?.[0],m=i?.extmetadata??{};
 return {title:x.title,thumb:i?.thumburl,description:clean(m.ImageDescription?.value).slice(0,160),source:i?.descriptionurl,artist:clean(m.Artist?.value).slice(0,120),license:m.LicenseShortName?.value,licenseUrl:m.LicenseUrl?.value,attributionRequired:m.AttributionRequired?.value,restricted:clean(m.Restrictions?.value).slice(0,140)};
 }).filter(x=>/^(CC BY(?:-SA)? (?:2\.0|3\.0|4\.0))$/.test(x.license??""));
}
(async()=>{for(const [key,q] of Object.entries(targets)){try{let a=await search(q);output.queries[key]=a;console.log("COMMONS",key,"valid="+a.length);console.log(a.slice(0,5).map(x=>x.title+" ["+x.license+"]").join(" || "));}catch(err){console.log("COMMONS_ERROR",key,String(err));output.queries[key]=[]}}
 fs.mkdirSync("data/research",{recursive:true});fs.writeFileSync("data/research/commons-model-candidates.json",JSON.stringify(output,null,2)+"\n");console.log("COMMONS_RESEARCH_SAVED")})().catch(e=>{console.error(e);process.exitCode=1;});

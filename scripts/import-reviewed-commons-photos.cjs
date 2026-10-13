/* eslint-disable @typescript-eslint/no-require-imports */
/** Download preselected Wikimedia Commons CC BY / BY-SA thumbnail images.
 * SOURCE_FILE mapping reviewed by image title and generation; do not run for arbitrary sites.
 * Commercial reuse only where imageinfo extmetadata provides approved CC license.
 */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const sourceFiles={
  "bmw-f30": "File:BMW 3-Series F30 China 2015-04-12.jpg",
  "bmw-e83": "File:BMW X3 (E83) China.jpg",
  "bmw-f20": "File:BMW 1 SERIES (F20) China.jpg",
  "bmw-f10": "File:BMW 5 SERIES LWB SEDAN (F10) China (5).jpg",
  "bmw-g20": "File:BMW 3 SERIES SEDAN (G20) China.jpg",
  "vw-golf-7": "File:VOLKSWAGEN GOLF (Mk7, Typ 5G) China.jpg",
  "vw-passat-b8": "File:VW Passat B8 Limousine 2.0 TDI Highline.JPG",
  "audi-a3-8v": "File:Audi A3 SportBack 2017 (front).jpg",
  "audi-a4-b9": "File:2018 Audi A4 Sport TDi Quattro S-A 2.0.jpg",
  "audi-a6-c7": "File:AUDI A6 AVANT C7 China.jpg",
  "mercedes-w176": "File:Mercedes-AMG A45 4MATIC (W176) front.JPG",
  "volvo-xc60": "File:2009-2011 Volvo XC60 D5 Teknik wagon (2016-01-24) 02.jpg",
  "ford-focus-st3": "File:2015 Ford Focus ST (17143620067).jpg",
  "skoda-5e": "File:ŠKODA OCTAVIA (5E) China.jpg",
  "seat-leon-5f": "File:Seat Leon 5F Cupra 300 (Phase 2).jpg"
};
const strip=s=>String(s||"").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&#(?:\d+|x[0-9a-f]+);/gi," ").replace(/\s+/g," ").trim();
const localDir="public/images/seo-vehicles";
const output={schemaVersion:1,source:"Wikimedia Commons",reviewedDate:"2026-10-12",images:{}};
fs.mkdirSync(localDir,{recursive:true});
async function run(){
 for(const [key,title] of Object.entries(sourceFiles)){
   const u=new URL("https://commons.wikimedia.org/w/api.php");
   for(const [k,v] of Object.entries({action:"query",format:"json",titles:title,prop:"imageinfo",iiprop:"url|extmetadata|size",iiurlwidth:"1200"}))u.searchParams.set(k,v);
   const r=await fetch(u,{headers:{"User-Agent":"NoordTuneImageResearch/1.0 (info@noordtune.nl)"}});
   if(!r.ok)throw Error(key+" Commons API HTTP "+r.status);
   const j=await r.json(),p=Object.values(j.query?.pages||{})[0],info=p?.imageinfo?.[0],m=info?.extmetadata||{};
   if(!info || p.title!==title)throw Error(key+" file unknown "+title);
   const license=m.LicenseShortName?.value,licenseUrl=m.LicenseUrl?.value;
   if(!/^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/.test(license||""))throw Error(key+" restricted "+license);
   if(!/^https:\/\/(?:creativecommons.org|www.creativecommons.org)\/licenses\//.test(licenseUrl||""))throw Error(key+" license URL invalid "+licenseUrl);
   const source=info.descriptionurl,url=info.thumburl;
   if(!source?.startsWith("https://commons.wikimedia.org/wiki/File:")||!/^https:\/\/(?:thumb|upload)\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?/.test(url||""))throw Error(key+" unexpected Commons URL");
   const image=await fetch(url,{headers:{"User-Agent":"NoordTuneImageResearch/1.0 (info@noordtune.nl)"}});
   if(!image.ok)throw Error(key+" image fetch HTTP "+image.status);
   const bytes=Buffer.from(await image.arrayBuffer());
   if(bytes.length<20000||bytes.length>2500000||bytes[0]!==0xff||bytes[1]!==0xd8)throw Error(key+" image invalid size/type "+bytes.length);
   const pathname=path.posix.join(localDir,key+".jpg");fs.writeFileSync(pathname,bytes);
   const artist=strip(m.Artist?.value);
   if(!artist||artist.length>240)throw Error(key+" attribution missing");
   output.images[key]={src:"/"+pathname.replace(/^public\//,"").replace(/\\/g,"/"),file:title,source,author:artist,license,licenseUrl,width:info.thumbwidth,height:info.thumbheight,sha256:crypto.createHash("sha256").update(bytes).digest("hex"),bytes:bytes.length,altGeneration:key};
   console.log("VERIFIED_CC_ASSET",key,license,artist.slice(0,55),info.thumbwidth,info.thumbheight,bytes.length);
 }
 fs.writeFileSync("src/data/nl-vehicle-photo-library.json",JSON.stringify(output,null,2)+"\n");
 const doc=["# NoordTune — model photography from Wikimedia Commons (2026-10-12)","","These are **illustrative model-generation photographs** from the Internet, NOT customer projects or photos made by NoordTune. Each file was downloaded from its Wikimedia Commons file page at 1200-px width without recompression; thumbnails may be resized by Commons. Licence and creator link are visible beside the image in our NL editorial component.","","Only reviewed images with CC BY / CC BY-SA licence URLs were admitted. File, author, licence, source, SHA256 and dimensions are recorded in src/data/nl-vehicle-photo-library.json. If an attribution or licence disappears in a later update, reject the image, do not silently substitute a search thumbnail.","","| Key | Source | Licence | Author |","|---|---|---|---|"];
 for(const [key,info] of Object.entries(output.images))doc.push("| "+key+" | ["+info.file.replace(/\|/g," ")+"]("+info.source+") | ["+info.license+"]("+info.licenseUrl+") | "+info.author.replace(/\|/g," " ).replace(/\[/g,"(").replace(/\]/g,")")+" |");
 fs.mkdirSync("docs",{recursive:true});fs.writeFileSync("docs/NL_VEHICLE_IMAGE_LICENCES_20261012.md",doc.join("\n")+"\n");
 console.log("COMMONS_LICENSED_PHOTOS_IMPORT_PASS",Object.keys(output.images).length);
}
run().catch(err=>{console.error(String(err));process.exitCode=1;});

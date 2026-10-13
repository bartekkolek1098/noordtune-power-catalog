/* eslint-disable @typescript-eslint/no-require-imports */
/* Human-reviewed Commons van generation photos for NL pages.
 * Only explicit approved filenames; licences checked via exact Commons source page.
 */
const fs=require("node:fs"),crypto=require("node:crypto"),path=require("node:path");
const base="C:/Users/barto/Desktop/noordtune-van-photo-review";
const reviewed=JSON.parse(fs.readFileSync(path.join(base,"candidates.json"),"utf8")).selected;
const replacements={"vw-caddy-2kn":"File:VW Caddy Kasten 1.6 TDI Facelift.JPG","citroen-berlingo-ii":"File:Citroën Berlingo II 1.6 BlueHDi 120 (2016) (53049792160).jpg","opel-vivaro-c":"File:Opel Vivaro C IMG 2456.jpg"};
const excluded=new Set(["fiat-doblo-263","opel-vivaro-b","opel-movano-b"]);
const files=Object.fromEntries(Object.entries(reviewed).filter(([key])=>!excluded.has(key)).map(([key,v])=>[key,replacements[key]||v.title]));
const clean=s=>String(s||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#(?:\d+|x[0-9a-f]+);/gi," ").replace(/\s+/g," ").trim();
(async()=>{
 const result={schemaVersion:1,reviewedDate:"2026-10-13",provider:"Wikimedia Commons",purpose:"Illustrative exterior photographs of the same reviewed van model/generation, not tuning customers or exact photographed engines",photos:{}};
 const out="public/images/seo-vans";fs.mkdirSync(out,{recursive:true});
 for(const [key,title] of Object.entries(files)){
   const u=new URL("https://commons.wikimedia.org/w/api.php");
   for(const [k,v] of Object.entries({action:"query",format:"json",titles:title,prop:"imageinfo",iiprop:"url|extmetadata|size",iiurlwidth:"1200"}))u.searchParams.set(k,v);
   const r=await fetch(u,{signal:AbortSignal.timeout(25000),headers:{"User-Agent":"NoordTuneCopyrightReview/1.0 (info@noordtune.nl)"}});
   if(!r.ok)throw Error(key+" Commons API "+r.status);
   const d=await r.json(),p=Object.values(d.query?.pages||{})[0],i=p?.imageinfo?.[0],m=i?.extmetadata||{};
   if(!i||p.title!==title)throw Error(key+" source mismatch");
   const license=m.LicenseShortName?.value,licenseUrl=m.LicenseUrl?.value,author=clean(m.Artist?.value);
   if(!/^CC BY(?:-SA)? [234]\.0$/.test(license||"")||!/^https:\/\/(?:www\.)?creativecommons\.org\/licenses\//.test(licenseUrl||"")||!author||author.length>260)throw Error(key+" INVALID COPYRIGHT "+license+" "+author);
   if(!i.descriptionurl?.startsWith("https://commons.wikimedia.org/wiki/File:")||!/^https:\/\/(?:upload|thumb)\.wikimedia\.org\/wikipedia\/commons\//.test(i.thumburl||""))throw Error(key+" unsafe URL");
   const rsp=await fetch(i.thumburl,{signal:AbortSignal.timeout(35000),headers:{"User-Agent":"NoordTuneCopyrightReview/1.0 (info@noordtune.nl)"}});
   const bytes=Buffer.from(await rsp.arrayBuffer());
   if(!rsp.ok||bytes.length<25000||bytes.length>3000000||bytes[0]!==255||bytes[1]!==216)throw Error(key+" incorrect jpg "+bytes.length);
   const full=path.join(out,key+".jpg");fs.writeFileSync(full,bytes);
   result.photos[key]={src:"/images/seo-vans/"+key+".jpg",file:title,source:i.descriptionurl,author,license,licenseUrl,width:i.thumbwidth,height:i.thumbheight,sha256:crypto.createHash("sha256").update(bytes).digest("hex"),bytes:bytes.length};
   console.log("REVIEWED_VAN_IMAGE",key,license,i.thumbwidth+"x"+i.thumbheight,bytes.length);
 }
 fs.writeFileSync("src/data/nl-van-generation-photos.json",JSON.stringify(result,null,2)+"\n");
 const md=["# NoordTune NL van photography licences — 2026-10-13","","Every asset in `public/images/seo-vans` is an **illustrative photograph of the van model/generation**, not a NoordTune customer vehicle nor a demonstration of the engine under the bonnet. Licences are reviewed and creators credited visibly per image on the public site.","","All photos are retrieved through Wikimedia Commons from specific **manually selected** file titles and are resized thumbnail derivatives. Source, author, licence and direct licensing URL are recorded in `src/data/nl-van-generation-photos.json` with SHA256 for integrity checking.","","| Model family | Source | Creative Commons licence | Photographer |","|---|---|---|---|"];
 for(const [key,v] of Object.entries(result.photos))md.push("| "+key+" | ["+v.file.replace(/\|/g," ")+"]("+v.source+") | ["+v.license+"]("+v.licenseUrl+") | "+v.author.replace(/\|/g," ")+ " |");
 fs.writeFileSync("docs/NL_VAN_IMAGE_LICENCES_20261013.md",md.join("\n")+"\n");
 console.log("VAN_LICENSED_IMAGE_IMPORT_READY",Object.keys(result.photos).length);
})().catch(e=>{console.error(e);process.exitCode=1});

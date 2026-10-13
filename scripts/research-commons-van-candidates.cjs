/* eslint-disable @typescript-eslint/no-require-imports */
/* Research-only media discovery: NEVER automatically publish search hits. */
const fs=require("node:fs");
const queries={"ford-transit-mk8":"Ford Transit Mk8 2016 van","ford-transit-custom-mk1":"Ford Transit Custom 2017","ford-transit-connect-mk2":"Ford Transit Connect 2015","vw-transporter-t5":"Volkswagen Transporter T5 2014","vw-transporter-t6":"Volkswagen Transporter T6 2018","vw-transporter-t61":"Volkswagen Transporter T6.1 2020","vw-crafter-mk2":"Volkswagen Crafter 2018","vw-caddy-2kn":"Volkswagen Caddy 2KN 2014","mb-sprinter-w906":"Mercedes Sprinter W906 2015","mb-sprinter-w907":"Mercedes Sprinter W907 2021","mb-vito-w447":"Mercedes Vito W447 2018","toyota-proace-ii":"Toyota Proace 2019","toyota-proace-city":"Toyota Proace City 2020","peugeot-partner-iii":"Peugeot Partner 2019 2020","peugeot-partner-ii":"Peugeot Partner 2013","peugeot-expert-iii":"Peugeot Expert 2019","peugeot-boxer":"Peugeot Boxer 2018","renault-master-iii":"Renault Master III 2018","renault-kangoo-ii":"Renault Kangoo II 2017","renault-trafic-iii":"Renault Trafic III 2019","fiat-ducato":"Fiat Ducato 2018","fiat-doblo-263":"Fiat Doblo 2016","opel-vivaro-b":"Opel Vivaro B 2017","opel-vivaro-c":"Opel Vivaro C 2020","citroen-berlingo-ii":"Citroen Berlingo II 2015","citroen-berlingo-iii":"Citroen Berlingo III 2019","opel-combo-e":"Opel Combo E 2019","citroen-jumpy-iii":"Citroen Jumpy III 2019","opel-movano-b":"Opel Movano B 2017","opel-movano-c":"Opel Movano 2022","iveco-daily-vi":"Iveco Daily 2017"};
const clean=s=>String(s??"").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&#\d+;/g," ").replace(/\s+/g," ").trim();
(async()=>{
 const all={reviewedAt:"2026-10-13",provider:"Wikimedia Commons",queries:{}};
 for(const [key,search] of Object.entries(queries)){
  try{
  const u=new URL("https://commons.wikimedia.org/w/api.php");
  for(const [k,v] of Object.entries({action:"query",format:"json",generator:"search",gsrsearch:search,gsrnamespace:"6",gsrlimit:"28",prop:"imageinfo",iiprop:"url|extmetadata|size",iiurlwidth:"750"}))u.searchParams.set(k,v);
  const response=await fetch(u,{signal:AbortSignal.timeout(22000),headers:{"User-Agent":"NoordTuneLegalImageReview/1.0 (info@noordtune.nl)"}});
  if(!response.ok)throw Error("HTTP"+response.status);
  const json=await response.json();
  const results=Object.values(json.query?.pages||{}).filter(p=>/\.(?:jpe?g)$/i.test(p.title)).map(p=>{
   const i=p.imageinfo?.[0],meta=i?.extmetadata||{};
   return {file:p.title,thumbnail:i?.thumburl,source:i?.descriptionurl,author:clean(meta.Artist?.value),license:meta.LicenseShortName?.value,licenseUrl:meta.LicenseUrl?.value};
  }).filter(i=>/^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/.test(i.license||"")&&i.author&&i.thumbnail).slice(0,12);
  all.queries[key]=results;
  console.log("VAN_PHOTO_CANDIDATES",key,results.length,results.slice(0,6).map(x=>x.file).join(" || "));
  }catch(e){all.queries[key]=[];console.log("PHOTO_RESEARCH_FAILED",key,String(e.message))}
 }
 fs.mkdirSync("data/research",{recursive:true});
 fs.writeFileSync("data/research/nl-van-commons-candidates.json",JSON.stringify(all,null,2)+"\n");
 console.log("VAN_PHOTO_RESEARCH_COMPLETE",Object.values(all.queries).reduce((n,v)=>n+v.length,0),"across",Object.keys(all.queries).length,"families");
})().catch(e=>{console.error(e);process.exitCode=1});

/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");

const input=process.argv[2];
if(!input||!fs.existsSync(input)) throw new Error("Usage: node scripts/build-selector-taxonomy-v2.cjs <vtech-discovery-v2.json>");
const source=JSON.parse(fs.readFileSync(input,"utf8"));
const brandMap={"Mercedes":"Mercedes-Benz","Seat":"SEAT","Mini":"MINI","Citroen":"Citroën","Alfa":"Alfa Romeo"};
const fuel=(label,brand)=>{
  const s=String(label??"").toLowerCase();
  const b=String(brand??"").toLowerCase();

  if(/\b(?:gte|e-hybrid|ehybrid|phev|hybrid|mhev|mild hybrid|etsi|e-tsi|t8)\b/.test(s))return "Hybrid";
  if(/\b(?:electric|bev|ev|e-tron|e tron|id\.?\s*[3-9]|born)\b/.test(s))return "Electric";

  if(
    /\b(?:tdi|tdci|ecoblue|cdi|cdti|dci|bluehdi|hdi|crdi|multijet|diesel|d-4d|jtd|jtdm|turbo\s*d|td4|sd4|tdv6|sdv6)\b/.test(s) ||
    /\b\d{2,3}d\b/.test(s) ||
    /\b(?:d2|d3|d4|d5|d6)\b/.test(s)
  )return "Diesel";

  if(
    /\b(?:tsi|tfsi|fsi|ecoboost|tce|t-gdi|gdi|benzine|petrol|puretech|thp|multiair|skyactiv-g|vvt-i|vvt|si4|t-jet|tbi|twin\s*spark|jts|mpi|vtec|wrx|sti)\b/.test(s) ||
    /\b\d{2,3}(?:i|ti)\b/.test(s) ||
    /\b(?:t3|t4|t5|t6)\b/.test(s) ||
    /\b(?:gti|gtd|amg|cupra|nismo|jcw|cooper)\b/.test(s) ||
    /\bv[568]\b/.test(s) ||
    /\b\d[.,]\d\s*t\b/.test(s)
  )return "Petrol";

  if(b==="bmw" && /\b(?:m\d{2,3}i|\d{2,3}i)\b/.test(s))return "Petrol";
  if(b==="bmw" && /\b\d{2,3}d\b/.test(s))return "Diesel";
  if(b.includes("mercedes") && /\bamg\b/.test(s))return "Petrol";

  return "Unknown";
};
const displacement=label=>{
  const m=String(label??"").match(/\b(\d)[.,](\d{1,2})\b/);
  return m?Math.round(Number(`${m[1]}.${m[2]}`)*1000):undefined;
};
const power=label=>{
  const m=String(label??"").match(/\b(\d{2,4})\s*(?:KM|PK|PS|HP)\b/i);
  return m?Number(m[1]):undefined;
};
const rows=source.variants.map(row=>{
  const years=(row.years??[]).filter(Number.isInteger);
  const normalizedBrand=brandMap[row.brand]??row.brand;
  const seed=[normalizedBrand,row.modelFamily,row.generation,row.engineMarketingName,Math.min(...years),Math.max(...years),row.url].join("|");
  return {
    id:"tax-"+crypto.createHash("sha256").update(seed).digest("hex").slice(0,16),
    brand:normalizedBrand,
    model:row.modelFamily,
    generation:row.generation,
    yearFrom:years.length?Math.min(...years):undefined,
    yearTo:years.length?Math.max(...years):undefined,
    engine:row.engineMarketingName,
    fuel:fuel(row.engineMarketingName,normalizedBrand),
    displacementCc:displacement(row.engineMarketingName),
    stockPowerHp:power(row.engineMarketingName),
    sourceUrl:row.url
  };
}).filter(row=>row.brand&&row.model&&row.engine&&row.yearFrom&&row.yearTo);

const seen=new Set();
const unique=[];
for(const row of rows){
  const key=[row.brand,row.model,row.generation,row.yearFrom,row.yearTo,row.engine].join("|");
  if(seen.has(key))continue;
  seen.add(key);unique.push(row);
}
unique.sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model)||a.yearFrom-b.yearFrom||a.engine.localeCompare(b.engine));
const out={
  schemaVersion:1,
  kind:"selector-taxonomy-discovery",
  source:{
    provider:"V-Tech",
    role:"taxonomy-only",
    discoveryUrl:source.url,
    retrievedAt:source.retrievedAt,
    contentSha256:source.contentSha256
  },
  policy:"Discovery identity only. No PowerChip gain or competitor value is used as a NoordTune Stage target. Installed ECU/TCU and tuning applicability require independent evidence.",
  count:unique.length,
  rows:unique
};
const target=path.resolve("src/data/catalog-taxonomy-v2.json");
const meta={...out};delete meta.rows;
const head=JSON.stringify(meta,null,2).slice(0,-2);
fs.writeFileSync(target,head+',\n  "rows": [\n'+unique.map(row=>"    "+JSON.stringify(row)).join(",\n")+'\n  ]\n}\n');
console.log(JSON.stringify({target,count:unique.length,brands:new Set(unique.map(r=>r.brand)).size,models:new Set(unique.map(r=>r.brand+"|"+r.model)).size},null,2));

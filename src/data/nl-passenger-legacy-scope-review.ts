/**
 * Five previously reviewed Stage 1 records now receive an *editorial SEO-only*
 * RDW identity boundary. Their base RDW resolver/application data is unchanged.
 *
 * Evidence:
 * - scripts/test-seat-leon-rdw-coverage.ts (2009-11 1P/92 kW)
 * - scripts/test-rdw-85kw-coverage.ts (Seat 5F and Nissan Juke F15, 85 kW)
 * - scripts/test-rdw-octavia-122.ts (1Z/90 kW)
 * - scripts/test-rdw-octavia-140.ts (5E/103 kW)
 * These tests include frozen, purposive RDW observations and wrong-generation
 * negative guards; neither plates nor VINs are copied into the SEO dataset.
 *
 * Do not broaden this list from model guesses or infer an ECU from RDW alone.
 */
import {verifiedRdwApplications} from "./verified-rdw-applications.ts";
import type {ReviewedRdwApplication} from "./nl-stage1-engine-seo.ts";

type Identity = {
  id:string; make:string; model:string; type:string; registeredPowerKw:number;
  displacementCc:number; yearFrom:number; yearTo:number; fuel:"Petrol"|"Diesel";
  allowedRdwModels:readonly string[];
};
const approved:readonly Identity[]=[
  {id:"rdw-seat-leon-1p-14-tsi-125",make:"Seat",model:"Leon",type:"1P",registeredPowerKw:92,displacementCc:1390,yearFrom:2009,yearTo:2011,fuel:"Petrol",allowedRdwModels:["LEON"]},
  {id:"rdw-seat-leon-5f-10-tsi-85kw",make:"Seat",model:"Leon",type:"5F",registeredPowerKw:85,displacementCc:999,yearFrom:2015,yearTo:2020,fuel:"Petrol",allowedRdwModels:["LEON"]},
  {id:"rdw-nissan-juke-f15-12-digt-85kw",make:"Nissan",model:"Juke",type:"F15",registeredPowerKw:85,displacementCc:1197,yearFrom:2014,yearTo:2019,fuel:"Petrol",allowedRdwModels:["NISSAN JUKE"]},
  {id:"rdw-skoda-octavia-1z-14-tsi-122",make:"Skoda",model:"Octavia",type:"1Z",registeredPowerKw:90,displacementCc:1390,yearFrom:2009,yearTo:2013,fuel:"Petrol",allowedRdwModels:["OCTAVIA"]},
  {id:"rdw-skoda-octavia-5e-14-tsi-140",make:"Skoda",model:"Octavia",type:"5E",registeredPowerKw:103,displacementCc:1395,yearFrom:2013,yearTo:2015,fuel:"Petrol",allowedRdwModels:["OCTAVIA"]}
];
const byId=new Map(verifiedRdwApplications.map(a=>[a.id,a]));
const used=new Set<string>();
export const nlLegacyPassengerSeoScopedApplications:readonly ReviewedRdwApplication[]=approved.map(scope=>{
 const a=byId.get(scope.id);
 if(!a||used.has(scope.id))throw Error("Unknown/duplicate manually reviewed NL SEO boundary "+scope.id);
 used.add(scope.id);
 for(const key of ["make","model","displacementCc","yearFrom","yearTo","fuel"] as const){
  if(a[key]!==scope[key])throw Error("Verified RDW identity changed: "+scope.id+" "+key);
 }
 const prior=a as typeof a&{requiredRdwType?:string;registeredPowerKw?:number;allowedRdwModels?:readonly string[]};
 if(prior.requiredRdwType&&prior.requiredRdwType!==scope.type)throw Error("Conflicting reviewed RDW type "+scope.id);
 if(prior.registeredPowerKw&&prior.registeredPowerKw!==scope.registeredPowerKw)throw Error("Conflicting reviewed RDW kW "+scope.id);
 if(prior.allowedRdwModels?.length&&
   (prior.allowedRdwModels.length!==scope.allowedRdwModels.length||
   prior.allowedRdwModels.some(name=>!scope.allowedRdwModels.includes(name))))
  throw Error("Conflicting reviewed RDW model names "+scope.id);
 if(a.fuel!=="Petrol"&&a.fuel!=="Diesel")throw Error("Special fuel not approved "+scope.id);
 const tunerHosts=new Set(a.sources.filter(s=>s.sourceType==="tuner"&&s.retrievalMethod==="page"&&s.url?.startsWith("https://"))
   .map(s=>new URL(s.url!).hostname.replace(/^www\./,"")));
 if(tunerHosts.size<2)throw Error("SEO page requires 2 independent Stage 1 tuner hosts "+scope.id);
 return {...a,requiredRdwType:scope.type,registeredPowerKw:scope.registeredPowerKw,
  allowedRdwModels:[...scope.allowedRdwModels]} as ReviewedRdwApplication;
});
if(nlLegacyPassengerSeoScopedApplications.length!==5||used.size!==5)throw Error("NL legacy scope completeness changed");
export const nlLegacyPassengerSeoScopedById=new Map(nlLegacyPassengerSeoScopedApplications.map(a=>[a.id,a]));

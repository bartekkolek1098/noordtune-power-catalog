/* eslint-disable @typescript-eslint/no-require-imports */
/* Privacy-safe RDW cohort discovery for missing commercial-vans family.
 * Live RDW API rows and plates are held in memory only. Output only aggregated technical identities.
 * This is a selected SAMPLE, not complete population or fleet representativeness.
 */
const fs=require("node:fs");
const path=require("node:path");
const candidates=[
 {make:"TOYOTA",name:"PROACE",type:"V",cc:1997,years:[2019,2020,2021,2022,2023,2024]},
 {make:"TOYOTA",name:"PROACE",type:"V",cc:1499,years:[2020,2021,2022,2023]},
 {make:"TOYOTA",name:"PROACE CITY",type:"E",cc:1499,years:[2020,2021,2022,2023,2024]},
 {make:"PEUGEOT",name:"BOXER",type:"Y",cc:2179,years:[2020,2021,2022,2023]},
 {make:"PEUGEOT",name:"BOXER",type:"Y",cc:1997,years:[2017,2018,2019]},
 {make:"PEUGEOT",name:"BOXER",type:"Y",cc:2184,years:[2024,2025]},
];
async function request(resource,parameters){
 const url=new URL("https://opendata.rdw.nl/resource/"+resource+".json");
 for(const [key,value] of Object.entries(parameters))url.searchParams.set(key,String(value));
 const response=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{"Accept":"application/json"}});
 if(!response.ok)throw Error("RDW "+resource+": "+response.status);
 return response.json();
}
const safeWhere=c=>"merk='"+c.make+"' AND handelsbenaming='"+c.name+"' AND type='"+c.type+"' AND cilinderinhoud='"+c.cc+"' AND aantal_cilinders='4' AND voertuigsoort='Bedrijfsauto'";
async function main(){
 const groups=[];
 for(const c of candidates){
  for(const year of c.years){
   const where=safeWhere(c)+" AND datum_eerste_toelating_dt between '"+year+"-01-01T00:00:00' and '"+year+"-12-31T23:59:59'";
   try{
    const vehicles=await request("m9d7-ebf2",{"$select":"kenteken,merk,handelsbenaming,type,cilinderinhoud,aantal_cilinders,datum_eerste_toelating_dt","$where":where,"$order":"kenteken","$limit":45});
    if(!vehicles.length)continue;
    const ids=vehicles.map(v=>v.kenteken);
    const inList=ids.map(x=>"'"+x.replace(/'/g,"")+"'" ).join(",");
    const fuelRows=await request("8ys7-d773",{"$select":"kenteken,brandstof_omschrijving,nettomaximumvermogen","$where":"kenteken in("+inList+")","$limit":300});
    const fuelsByVehicle=new Map();
    for(const f of fuelRows){const old=fuelsByVehicle.get(f.kenteken)||[];old.push(f);fuelsByVehicle.set(f.kenteken,old);}
    const values=new Map();
    let verified=0;
    for(const v of vehicles){
      const ff=fuelsByVehicle.get(v.kenteken)||[];
      if(ff.length!==1)continue;
      const fuel=ff[0].brandstof_omschrijving;
      const kw=Number(ff[0].nettomaximumvermogen);
      if(!Number.isFinite(kw)||!fuel)continue;
      const k=fuel+"/"+kw;
      values.set(k,(values.get(k)||0)+1);
      verified++;
    }
    const g={make:c.make,model:c.name,type:c.type,cc:c.cc,cylinders:4,year,checkedVehicleRows:vehicles.length,verifiedSingleFuelRows:verified,
      outputs:[...values].map(([key,n])=>({fuel:key.split("/")[0],kw:Number(key.split("/")[1]),observed:n})).sort((a,b)=>b.observed-a.observed||a.kw-b.kw)};
    groups.push(g);
    console.log("RDW_SAFE_GROUP",JSON.stringify(g));
   }catch(e){console.log("RDW_GROUP_FETCH_FAILED",JSON.stringify({make:c.make,model:c.name,cc:c.cc,year,reason:String(e.message).slice(0,130)}));}
  }
 }
 const result={schemaVersion:1,createdAt:"2026-10-10",purpose:"Targeted underrepresented NL vans RDW technical identity validation sample, NOT population coverage",method:"First <=45 lexicographically ordered RDW public plates per make/model/type/cc/admission year; plates joined to fuel in memory then discarded; only aggregated counts retained. Bias means NO national prevalence inference. Selected before Stage 1 matching.",datasets:{vehicles:"m9d7-ebf2",fuels:"8ys7-d773"},groups};
 const p=path.join("data","research","nl-vans-expansion-rdw-cohorts.json");
 fs.writeFileSync(p,JSON.stringify(result,null,2)+"\n");
 console.log("RDW_COHORT_SNAPSHOT",JSON.stringify({path:p,technicalGroups:groups.length,observed:groups.reduce((n,g)=>n+g.verifiedSingleFuelRows,0)}));
}
main().catch(e=>{console.error(String(e));process.exitCode=1;});

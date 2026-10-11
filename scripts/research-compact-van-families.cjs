/* eslint-disable @typescript-eslint/no-require-imports */
/** Repeatable, aggregate-only RDW sampling of complete compact-van generations.
 * Never persist plates, VINs or customer-linked execution codes. This is a
 * deterministic purposive technical sample, NOT Dutch-fleet prevalence.
 */
const fs = require('node:fs');
const families = [['CITROEN','BERLINGO'],['PEUGEOT','PARTNER'],['OPEL','COMBO']];
async function query(dataset,params){
 const u = new URL('https://opendata.rdw.nl/resource/'+dataset+'.json');
 for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);
 const r=await fetch(u,{signal:AbortSignal.timeout(30000)});
 if(!r.ok)throw Error('RDW '+dataset+' HTTP '+r.status);
 return r.json();
}
(async()=>{
 const groups=[];
 for(const [make,model] of families)for(let year=2018;year<=2024;year++){
  const rows=await query('m9d7-ebf2',{'$select':'kenteken,type,cilinderinhoud,aantal_cilinders',
   '$where':`merk='${make}' AND handelsbenaming='${model}' AND cilinderinhoud='1499' AND voertuigsoort='Bedrijfsauto' AND datum_eerste_toelating_dt between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`,
   '$order':'kenteken','$limit':'40'});
  if(!rows.length)continue;
  const fuel=await query('8ys7-d773',{'$select':'kenteken,brandstof_omschrijving,nettomaximumvermogen',
   '$where':'kenteken in('+rows.map(v=>"'"+v.kenteken+"'").join(',')+')','$limit':'300'});
  const byPlate=new Map();for(const f of fuel){const a=byPlate.get(f.kenteken)||[];a.push(f);byPlate.set(f.kenteken,a);}
  const cells=new Map();
  for(const v of rows){const ff=byPlate.get(v.kenteken)||[];
   const key=JSON.stringify([v.type||null,Number(v.cilinderinhoud)||null,Number(v.aantal_cilinders)||null,ff.length===1?ff[0].brandstof_omschrijving:'unknown/mixed',ff.length===1?Number(ff[0].nettomaximumvermogen)||null:null]);
   cells.set(key,(cells.get(key)||0)+1);
  }
  for(const [key,observed] of cells){const [type,cc,cylinders,fuel,kw]=JSON.parse(key);groups.push({make,model,type,cc,cylinders,fuel,kw,year,observed});}
  console.log('COHORT',make,model,year,rows.length,JSON.stringify([...cells].map(([k,n])=>[JSON.parse(k),n])));
 }
 const snapshot={schemaVersion:1,collectedOn:new Date().toISOString().slice(0,10),method:'First <=40 plate-ordered light commercial RDW records per selected model/1499cc/admission-year, sampled before profile matching; join by plate in memory only; no population prevalence inference.',datasets:['m9d7-ebf2','8ys7-d773'],groups};
 fs.writeFileSync('data/research/nl-compact-vans-20261011.json',JSON.stringify(snapshot,null,2)+'\n');
 console.log('COMPACT_SNAPSHOT',groups.length,groups.reduce((n,g)=>n+g.observed,0));
})().catch(e=>{console.error(e.message);process.exitCode=1});

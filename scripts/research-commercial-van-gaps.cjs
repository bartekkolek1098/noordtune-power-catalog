/* eslint-disable @typescript-eslint/no-require-imports */
/** Read-only public RDW research; plates only join tables in memory.
 * Freeze a quota-selected technical sample before code changes. No plate/VIN stored.
 */
const fs=require('node:fs');
const cp=require('node:child_process');
const {normalizeRdwVehicle}=require('../src/lib/rdw.ts');
const output='data/research/nl-commercial-vans-20261011.json';
const families=[['CITROEN',"handelsbenaming='JUMPY'"],['OPEL',"handelsbenaming like 'MOVANO%'"],['IVECO',"(handelsbenaming like '%DAILY%' OR handelsbenaming like '35S%' OR handelsbenaming like '35C%')"]];
async function query(dataset,params){const u=new URL('https://opendata.rdw.nl/resource/'+dataset+'.json');for(const [k,v]of Object.entries(params))u.searchParams.set(k,v);const r=await fetch(u,{signal:AbortSignal.timeout(40000)});if(!r.ok)throw Error(dataset+' HTTP '+r.status);return r.json();}
(async()=>{
 if(fs.existsSync(output))throw Error('Frozen snapshot exists; do not overwrite baseline');
 const groups=[];
 for(const [make,filter]of families){
  const filterBase="merk='"+make+"' AND ("+filter+") AND voertuigsoort='Bedrijfsauto'";
  const aggregated=await query('m9d7-ebf2',{'$select':'handelsbenaming,type,cilinderinhoud,count(*) as aantal','$where':filterBase,'$group':'handelsbenaming,type,cilinderinhoud','$order':'aantal DESC','$limit':'16'});
  console.log('RDW_POPULATION_TECHNICAL_GROUPS',make,JSON.stringify(aggregated));
  for(const year of [2017,2019,2021,2022,2023,2024]){
   const rows=await query('m9d7-ebf2',{'$select':'kenteken,handelsbenaming,type,cilinderinhoud,aantal_cilinders',
    '$where':filterBase+" AND datum_eerste_toelating_dt between '"+year+"-01-01T00:00:00' and '"+year+"-12-31T23:59:59'",'$order':'kenteken','$limit':'45'});
   if(!rows.length)continue;
   if(!rows.every(v=>/^[A-Z0-9]{6}$/.test(v.kenteken)))throw Error('Unexpected RDW join identifier');
   const fuels=await query('8ys7-d773',{'$select':'kenteken,brandstof_omschrijving,nettomaximumvermogen','$where':'kenteken in('+rows.map(v=>"'"+v.kenteken+"'").join(',')+')','$limit':'300'});
   const ff=new Map();for(const f of fuels){const z=ff.get(f.kenteken)||[];z.push(f);ff.set(f.kenteken,z);}
   const cells=new Map();for(const v of rows){const f=ff.get(v.kenteken)||[];const key=JSON.stringify([v.handelsbenaming,v.type||null,Number(v.cilinderinhoud)||null,Number(v.aantal_cilinders)||null,f.length===1?f[0].brandstof_omschrijving:'unknown/mixed',f.length===1?Number(f[0].nettomaximumvermogen)||null:null]);cells.set(key,(cells.get(key)||0)+1);}
   for(const [key,observed]of cells){const [model,type,cc,cylinders,fuel,kw]=JSON.parse(key);groups.push({make,model,type,cc,cylinders,fuel,kw,year,observed});}
   console.log('SAMPLED_TECH',make,year,rows.length,JSON.stringify([...cells].map(([k,n])=>[JSON.parse(k),n])));
  }
 }
 const baseline=groups.map(g=>{const r=normalizeRdwVehicle({merk:g.make,handelsbenaming:g.model,type:g.type??undefined,cilinderinhoud:g.cc==null?undefined:String(g.cc),aantal_cilinders:g.cylinders==null?undefined:String(g.cylinders),datum_eerste_toelating:g.year+'0615',datum_eerste_toelating_dt:g.year+'-06-15T00:00:00'},[{brandstof_omschrijving:g.fuel,nettomaximumvermogen:g.kw==null?undefined:String(g.kw)}],'QA0000');const p=r.tuningEstimate.profile,s=p?.stages.find(x=>x.name==='Stage 1');return {linked:!!(s&&(s.powerHp||s.powerRangeHp)&&p.sourceReferences.some(x=>x.url?.startsWith('https://'))),profileId:p?.id??null};});
 const snapshot={schemaVersion:1,collectedOn:'2026-10-11',baselineCommit:cp.execSync('git rev-parse HEAD',{encoding:'utf8'}).trim(),method:'First <=45 plate-ordered light commercial public RDW records per selected make/model-family/admission-year; groups frozen before new matching. Join by plate in memory only. Nonrepresentative technical quota sample, NOT Dutch-fleet prevalence.',datasets:['m9d7-ebf2','8ys7-d773'],groups,baseline,baselineCounts:{rows:groups.reduce((s,g)=>s+g.observed,0),linked:groups.reduce((s,g,i)=>s+(baseline[i].linked?g.observed:0),0)}};
 fs.writeFileSync(output,JSON.stringify(snapshot,null,2)+'\n');console.log('VAN_BASELINE_FROZEN',JSON.stringify({cells:groups.length,...snapshot.baselineCounts}));
})().catch(e=>{console.error(e.message);process.exitCode=1});
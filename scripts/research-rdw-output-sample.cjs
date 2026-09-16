/* eslint-disable @typescript-eslint/no-require-imports */
// Fixed, bounded sampling plan; no tuning result or fuel lookup influences selection.
const fs=require('node:fs'),crypto=require('node:crypto');
const {POPULATION,VEHICLE_DATASET,FUEL_DATASET,queryUrl,getJson}=require('./research-rdw-fleet.cjs');
const privateRoot='.git/nl-fleet-v3';
const quote=value=>"'"+value.replace(/'/g,"''")+"'";
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const strip=row=>Object.fromEntries(Object.entries(row).filter(([key])=>key!=='kenteken'));
const sampleId=plate=>'rdw-'+digest(plate).slice(0,20);
const registered=vehicle=>Boolean(vehicle.export_indicator==='Nee'&&vehicle.datum_tenaamstelling&&vehicle.tenaamstellen_mogelijk==='Ja');
const fields='kenteken,merk,handelsbenaming,voertuigsoort,aantal_cilinders,cilinderinhoud,datum_eerste_toelating,datum_eerste_toelating_dt,type,variant,uitvoering,export_indicator,toegestane_maximum_massa_voertuig,datum_tenaamstelling,tenaamstellen_mogelijk';
function samplePlan(){
  const priority=read('data/research/v3-priority-baseline.json');
  const fleet=new Map(read('data/research/nl-fleet-model-priority.json').groups.map(g=>[g.id,g]));
  return {schemaVersion:1,baselineHead:priority.head,createdAt:new Date().toISOString(),
    method:'Top 250 frozen V2 priority groups. Three four-registration slices at the beginning, middle and end of the group ordered by first admission and then registration. Offsets use the frozen aggregate count; at most 12 registrations per group (3000 total). No source/profile outcome is used. A bounded purposive diversity sample, not a random or complete output census.',
    qaSelection:'Keep all prior 222 records. Add the first unseen verified middle-slice registration in priority order, then beginning/end as needed, until 400. Preselected before the fuel join and before V3 profile promotion. No substitutions based on tuning outcome. Prior rows retain their original facts and verification.',
    populationWhere:POPULATION,groups:priority.groups.slice(0,250).map(row=>{const g=fleet.get(row.groupId);return {...g,priorityRank:row.priorityRank,baselineLayer:row.layer,offsets:[...new Set([0,Math.max(0,Math.floor(g.vehicles/2)-2),Math.max(0,g.vehicles-4)])]};})};
}
async function main(){
  fs.mkdirSync(privateRoot,{recursive:true});
  const planFile='data/research/v3-rdw-sampling-plan.json';
  const plan=fs.existsSync(planFile)?read(planFile):samplePlan();
  if(!fs.existsSync(planFile))write(planFile,plan);
  const raw=[],queries=[];
  for(const group of plan.groups){
    for(const [slice,offset] of group.offsets.entries()){
      const where=`${POPULATION} AND merk = ${quote(group.make)} AND handelsbenaming = ${quote(group.model)} AND cilinderinhoud = ${group.displacementCc} AND aantal_cilinders = ${group.cylinders} AND voertuigsoort = ${quote(group.vehicleClass)} AND date_extract_y(datum_eerste_toelating_dt) BETWEEN ${group.yearBandFrom} AND ${group.yearBandTo}`;
      const result=await getJson(queryUrl(VEHICLE_DATASET,{select:fields,where,order:'datum_eerste_toelating_dt,kenteken',offset,limit:4}));
      queries.push({groupId:group.id,slice,offset,limit:4,rows:result.rows.length,url:result.response.url,retrievedAt:result.response.retrievedAt,contentSha256:result.response.contentSha256});
      raw.push(...result.rows.map(vehicle=>({groupId:group.id,slice,vehicle,retrievedAt:result.response.retrievedAt})));
    }
    write(privateRoot+'/output-sample-progress.json',{completedPriorityRank:group.priorityRank,rows:raw.length,queries:queries.length});
    if(group.priorityRank%10===0)console.log(JSON.stringify({groups:group.priorityRank,vehicleRows:raw.length}));
  }
  const unique=[...new Map(raw.map(row=>[row.vehicle.kenteken,row])).values()];
  const prior=read('data/research/nl-rdw-live-sample.json');
  const selected=new Set(prior.rows.map(row=>row.sampleId)),qaAdd=[];
  for(const group of plan.groups){
    const choices=unique.filter(row=>row.groupId===group.id&&registered(row.vehicle)).sort((a,b)=>Math.abs(a.slice-1)-Math.abs(b.slice-1));
    const row=choices.find(item=>!selected.has(sampleId(item.vehicle.kenteken)));
    if(row&&selected.size<400){selected.add(sampleId(row.vehicle.kenteken));qaAdd.push(sampleId(row.vehicle.kenteken));}
  }
  if(selected.size<400)throw Error('Insufficient verified preselected registrations; preserve the plan and report shortfall.');
  write('data/research/v3-rdw-qa-selection.json',{baselineHead:plan.baselineHead,selectedBeforeFuelJoin:true,method:plan.qaSelection,priorSampleSize:prior.rows.length,addedSampleIds:qaAdd,sampleSize:selected.size});
  const fuels=[],fuelQueries=[];
  for(let offset=0;offset<unique.length;offset+=40){
    const plates=unique.slice(offset,offset+40).map(row=>row.vehicle.kenteken);
    const result=await getJson(queryUrl(FUEL_DATASET,{where:`kenteken in (${plates.map(quote).join(',')})`,limit:200}));
    fuels.push(...result.rows);
    fuelQueries.push({dataset:FUEL_DATASET,selectedRegistrations:plates.length,rows:result.rows.length,retrievedAt:result.response.retrievedAt,contentSha256:result.response.contentSha256});
  }
  const privateRows=unique.map(row=>({...row,fuels:fuels.filter(f=>f.kenteken===row.vehicle.kenteken)}));
  write(privateRoot+'/rdw-output-private.json',privateRows);
  const rows=privateRows.map(row=>({sampleId:sampleId(row.vehicle.kenteken),groupId:row.groupId,slice:row.slice,retrievedAt:row.retrievedAt,registrationVerified:registered(row.vehicle),vehicle:strip(row.vehicle),fuels:row.fuels.map(strip)}));
  const groups=plan.groups.map(group=>{
    const sample=rows.filter(row=>row.groupId===group.id),observed=new Map();
    for(const row of sample){
      const powerRows=row.fuels.map(f=>Number(f.nettomaximumvermogen)).filter(n=>n>0),kw=powerRows.length===1?powerRows[0]:null;
      const fact={fuel:row.fuels.map(f=>f.brandstof_omschrijving).join(' / '),registeredPowerKw:kw,approximatePowerPs:kw?Number((kw*1.359621617).toFixed(2)):null,firstAdmissionYear:Number(row.vehicle.datum_eerste_toelating?.slice(0,4))||null,cylinders:Number(row.vehicle.aantal_cilinders)||null,type:row.vehicle.type??null,variant:row.vehicle.variant??null,execution:row.vehicle.uitvoering??null};
      const key=JSON.stringify(fact),entry=observed.get(key)??{...fact,observedCount:0,sampleIds:[]};entry.observedCount++;entry.sampleIds.push(row.sampleId);observed.set(key,entry);
    }
    return {groupId:group.id,priorityRank:group.priorityRank,make:group.make,model:group.model,displacementCc:group.displacementCc,yearBandFrom:group.yearBandFrom,yearBandTo:group.yearBandTo,vehicleClass:group.vehicleClass,sampleSize:sample.length,observedOutputVariants:[...observed.values()],variantCensusComplete:false};
  });
  const report={schemaVersion:1,method:plan.method,baselineHead:plan.baselineHead,populationWhere:POPULATION,join:'Exact registration fuel join restricted to this sample. Query URLs containing registrations and all raw registrations remain private.',sampleSize:rows.length,groupsSampled:groups.length,vehicleQueries:queries,fuelQueries,groups,rows};
  write('data/research/nl-top-groups-output-sample.json',report);
  const qaRows=[...prior.rows,...rows.filter(row=>qaAdd.includes(row.sampleId))];
  write('data/research/nl-rdw-v3-qa-sample.json',{schemaVersion:1,method:plan.qaSelection,sampleSize:qaRows.length,priorFixedSubset:prior.rows.map(row=>row.sampleId),registrationVerification:{prior:prior.registrationVerification,added:qaAdd.length,method:'Current main-dataset response includes registration state, nonexport flag and holder date; no separate full fleet join.'},rows:qaRows});
  console.log(JSON.stringify({output:'data/research/nl-top-groups-output-sample.json',sample:rows.length,groups:groups.length,qa:qaRows.length,fuelRows:fuels.length}));
}
module.exports={samplePlan,sampleId,registered};
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});

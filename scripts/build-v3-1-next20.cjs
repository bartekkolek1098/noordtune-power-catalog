/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
async function main(){
  const {sourceMake,sourceModelFamily}=await import('../src/lib/sourced-tuning-match.ts');
  const {normalizeCatalogFuel,nominalDisplacementMatches}=await import('../src/data/catalog-matching.ts');
  const queue=read('data/research/nl-output-variant-priority.json');
  const observed=read('data/research/v3-1-observed-coverage.json');
  const profiles=read('src/data/tuning-profiles/profiles.json');
  const recovered=new Set(observed.changedScenarios.flatMap(item=>item.sampleIds));
  const grouped=new Map();
  for(const group of queue.groups)for(const variant of group.observedOutputVariants){
    if(variant.layer!=='D'||!variant.reasons.includes('NO_COMPATIBLE_SOURCED_PROFILE')||variant.sampleIds.some(id=>recovered.has(id)))continue;
    if(!['Benzine','Diesel'].includes(variant.fuel)||!variant.registeredPowerKw||!group.displacementCc)continue;
    const make=sourceMake(group.make),model=sourceModelFamily(make,group.model),fuel=normalizeCatalogFuel(variant.fuel);
    const power=variant.registeredPowerKw/.73549875;
    const accepted=profiles.some(profile=>sourceMake(profile.brand)===make&&profile.fuel===fuel
      &&[profile.modelFamily,...(profile.aliases??[])].some(label=>{const candidate=sourceModelFamily(make,label);return candidate===model||model.startsWith(candidate+' ')})
      &&Math.abs(profile.stockPowerHp-power)<=3
      &&(profile.displacementPrecision==='exact'?Math.abs(profile.displacementCc-group.displacementCc)<=2:nominalDisplacementMatches(group.displacementCc,profile.displacementCc)));
    if(accepted)continue;
    const key=[make,model,group.displacementCc,fuel,variant.registeredPowerKw].join('|');
    if(!grouped.has(key))grouped.set(key,{make:group.make,model:group.model,displacementCc:group.displacementCc,fuel,
      registeredPowerKw:variant.registeredPowerKw,approximatePowerPs:Math.round(power),observedRegistrations:0,
      observedScenarioCount:0,firstAdmissionYears:[],groupIds:[],bestPriorityRank:group.priorityRank});
    const item=grouped.get(key);
    item.observedRegistrations+=variant.observedCount;item.observedScenarioCount++;
    item.firstAdmissionYears.push(variant.firstAdmissionYear);
    if(!item.groupIds.includes(group.groupId))item.groupIds.push(group.groupId);
    item.bestPriorityRank=Math.min(item.bestPriorityRank,group.priorityRank);
  }
  const ranked=[...grouped.values()].map(item=>({...item,firstAdmissionYears:[Math.min(...item.firstAdmissionYears),Math.max(...item.firstAdmissionYears)]}))
    .sort((a,b)=>b.observedRegistrations-a.observedRegistrations||b.observedScenarioCount-a.observedScenarioCount||a.bestPriorityRank-b.bestPriorityRank);
  const next20=ranked.slice(0,20).map((item,index)=>({rank:index+1,...item,evidenceNeeded:'Dated exact model/fuel/factory-output/displacement application with Stage 1 values and engine/generation applicability.'}));
  if(next20.length!==20)throw Error('Expected 20 missing configurations');
  fs.writeFileSync('data/research/v3-1-next20.json',JSON.stringify({schemaVersion:1,method:'Frozen 3,000-row purposive sample. Group exact make/model/displacement/fuel/registered-power combinations still at D after V3.1; exclude any accepted profile with the same technical tuple, even if its year scope differs. Rank by observed sampled registrations, then scenario count and frozen group rank. Counts are sample observations, not Dutch fleet population estimates.',totalEligibleConfigurations:ranked.length,next20},null,2)+'\n');
  console.log(JSON.stringify(next20.map(item=>({rank:item.rank,make:item.make,model:item.model,cc:item.displacementCc,fuel:item.fuel,kW:item.registeredPowerKw,count:item.observedRegistrations,years:item.firstAdmissionYears})),null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

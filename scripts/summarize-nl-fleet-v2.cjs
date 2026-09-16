/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const profiles=read('src/data/tuning-profiles/profiles.json');
const sources=read('data/research/source-pages.json');
const baseline=read('data/research/v1-consensus-checkpoint.json');
const baselineIds=new Set(baseline.profiles.map(p=>p.id));
const added=profiles.filter(p=>!baselineIds.has(p.id));
const sourceById=new Map(sources.map(s=>[s.id,s]));
const isNew=s=>s.id.includes('-v2-');
const countBy=(items,key)=>Object.fromEntries([...new Set(items.map(key))].sort().map(value=>[value,items.filter(item=>key(item)===value).length]));
const multi=p=>p.stage1SourceCount>=2;
const normalize=value=>value.normalize('NFD').toLowerCase().replace(/[^a-z0-9]/g,'');
const technicalKey=p=>JSON.stringify([normalize(p.brand),normalize(p.modelFamily),normalize(p.generation),p.fuel,p.displacementCc,p.stockPowerHp,p.stockTorqueNm??null,p.engineFamily??null]);
const broadKey=p=>JSON.stringify([normalize(p.brand),normalize(p.modelFamily),p.fuel,p.displacementCc,p.stockPowerHp,p.stockTorqueNm??null,p.engineFamily??null]);
const van=p=>/transit|courier|caddy|crafter|transporter|vito|sprinter|citan|trafic|master|kangoo|vivaro|movano|combo|expert|boxer|partner|jumpy|jumper|berlingo|proace|ducato|talento|scudo|daily/i.test(p.modelFamily);
const acceptedIds=new Set(profiles.flatMap(p=>p.sourceIds));
const providerCounts=[...new Set(sources.map(s=>s.provider))].sort().map(provider=>{
  const all=sources.filter(s=>s.provider===provider),fresh=all.filter(isNew),oldUrls=new Set(all.filter(s=>!isNew(s)).map(s=>s.url));
  return {provider,observations:all.length,newObservations:fresh.length,uniqueUrls:new Set(all.map(s=>s.url)).size,newUniqueUrls:new Set(fresh.filter(s=>!oldUrls.has(s.url)).map(s=>s.url)).size,
    acceptedRemapObservations:all.filter(s=>acceptedIds.has(s.id)).length,newAcceptedRemapObservations:fresh.filter(s=>acceptedIds.has(s.id)).length,
    profiles:profiles.filter(p=>p.sourceIds.some(id=>sourceById.get(id)?.provider===provider)).length,
    newProfiles:added.filter(p=>p.sourceIds.some(id=>sourceById.get(id)?.provider===provider)).length,
    packages:all.reduce((sum,s)=>sum+(s.packages?.length??0),0)};
});
const change=read('data/research/v2-source-changes.json');
const result={baselineHead:baseline.head,baseline:{profiles:baseline.profiles.length,multiSource:50,singleSource:230,stage2:224,stage3:4,observations:361},
  cumulativeProfiles:profiles.length,newProfiles:added.length,
  distinctTechnicalProfiles:new Set(profiles.map(technicalKey)).size,newDistinctTechnicalProfiles:new Set(added.map(technicalKey)).size,
  distinctWithoutGeneration:new Set(profiles.map(broadKey)).size,newDistinctWithoutGeneration:new Set(added.map(broadKey)).size,
  identityCountNote:'A technical key includes the published generation but excludes year endpoints; there are no generated annual copies. The broader count deliberately collapses genuinely different generations with the same model/fuel/displacement/output/torque/family and is shown separately.',
  multiSource:profiles.filter(multi).length,singleSource:profiles.filter(p=>!multi(p)).length,
  newlyCorroboratedV1:profiles.filter(p=>baselineIds.has(p.id)&&p.sourceIds.some(id=>isNew(sourceById.get(id)))).length,
  v1NumericChanges:change.numericChanged,v1ScopeChanges:change.scopeChanged,v1ProfilesWithAnyChangedFact:change.records.filter(r=>r.changedFields.length).length,
  stage1:profiles.filter(p=>p.stage1).length,stage2:profiles.filter(p=>p.stage2).length,stage3:profiles.filter(p=>p.stage3).length,stage3Custom:profiles.filter(p=>!p.stage3).length,
  providerCounts,brands:countBy(profiles,p=>p.brand),newBrands:countBy(added,p=>p.brand),fuel:countBy(profiles,p=>p.fuel),
  vanProfiles:profiles.filter(van).length,vanModels:countBy(profiles.filter(van),p=>p.brand+' '+p.modelFamily),
  kiaHyundaiProfiles:profiles.filter(p=>['Kia','Hyundai'].includes(p.brand)).length,
  kiaHyundaiModels:countBy(profiles.filter(p=>['Kia','Hyundai'].includes(p.brand)),p=>p.brand+' '+p.modelFamily),
  bmw:profiles.filter(p=>p.brand==='BMW').length,mini:profiles.filter(p=>p.brand==='MINI').length,
  vag:profiles.filter(p=>['Volkswagen','Audi','Skoda','Seat'].includes(p.brand)).length,ford:profiles.filter(p=>p.brand==='Ford').length,
  explicitEngineFamilies:countBy(profiles,p=>p.engineFamily??'not-published'),
  acceptedObservationIds:acceptedIds.size,rejectedObservations:read('data/research/unresolved-conflicts.json').rejected?.length};
fs.writeFileSync('data/research/v2-summary.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));

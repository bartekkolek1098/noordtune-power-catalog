/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const save=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const count=rows=>rows.reduce((totals,row)=>(totals[row.layer]++,totals),{A:0,B:0,C:0,D:0,E:0});
async function main(){
  const {sourceMake,sourceModelFamily}=await import('../src/lib/sourced-tuning-match.ts');
  const family=(make,model)=>sourceModelFamily(sourceMake(make),model);
  const baseline=read('data/research/v3-priority-baseline.json');
  const priority=read('data/research/nl-technical-priority-v3.json');
  const samples=read('data/research/nl-top-groups-output-sample.json');
  const observations=read('data/research/source-pages.json');
  const profiles=read('src/data/tuning-profiles/profiles.json');
  const reviews=read('data/research/v3-applicability-review.json');
  const discovery=read('data/research/v3-research-discovery.json');
  const baselineProfiles=read('data/research/v2-consensus-checkpoint.json').profiles;
  const sourceById=new Map(observations.map(o=>[o.id,o]));
  const selectedSources=new Set(profiles.flatMap(p=>p.sourceIds));
  const equal=(a,b)=>(a??null)===(b??null);
  const groups=samples.groups.map(sample=>{
    const current=priority.groups.find(g=>g.groupId===sample.groupId);
    const observedOutputVariants=sample.observedOutputVariants.map(v=>{
      const result=current.variants.find(x=>x.origin==='live-rdw'&&x.fuel===v.fuel&&x.stockPowerHp===(v.approximatePowerPs?Math.round(v.registeredPowerKw*1.359621617):0)
        &&x.scenarioYear===v.firstAdmissionYear&&equal(x.registeredPowerKw,v.registeredPowerKw)&&equal(x.type,v.type)&&equal(x.variant,v.variant)&&equal(x.execution,v.execution));
      if(!result)throw Error('Missing observed output scenario: '+sample.groupId+' '+JSON.stringify(v));
      return {...v,layer:result.layer,selectedProfileId:result.selectedProfileId,reasons:result.reasons};
    });
    return {...sample,groupLayer:current.layer,observedOutputVariants,
      sourceSupportedTargets:current.variants.filter(v=>v.origin==='source-profile').map(v=>({profileId:v.profileId,fuel:v.fuel,stockPowerHp:v.stockPowerHp,yearFrom:v.yearFrom,yearTo:v.yearTo,engine:v.engine,layer:v.layer})),
      exactRdwVehicles:current.exactRdwVehicles};
  });
  const queue={schemaVersion:1,datasetFingerprint:priority.datasetFingerprint,baselineHead:baseline.head,
    policy:'Frozen V2 top250 ranking. Observed variants retain RDW fuel, kW, first-admission year, type, variant and execution. Source-supported targets are separate, with real profile IDs. No invented output/year/model cross-products. Counts describe this bounded sample only; no full-fleet output frequency inference.',groups};
  save('data/research/nl-output-variant-priority.json',queue);
  const top50=baseline.groups.slice(0,50);
  const needsReview=layer=>!['A','B'].includes(layer);
  const records=top50.filter(g=>needsReview(g.layer)||needsReview(priority.groups.find(current=>current.groupId===g.groupId).layer)).map(before=>{
    const sample=groups.find(g=>g.groupId===before.groupId),current=priority.groups.find(g=>g.groupId===before.groupId);
    const candidateUrls=discovery.queue.filter(q=>q.groupIds.includes(before.groupId)).map(q=>q.url);
    const actual=observations.filter(o=>candidateUrls.includes(o.url));
    const applicable=observations.filter(o=>{const i=o.identity??o.unresolvedIdentity;return i?.brand&&i.modelFamily&&sourceMake(i.brand)===sourceMake(before.make)
      &&family(i.brand,i.modelFamily)===family(before.make,before.model)&&Math.abs(i.displacementCc-before.displacementCc)<=(i.displacementPrecision==='nominal'?49:2);});
    const matchingProfiles=profiles.filter(p=>applicable.some(o=>p.sourceIds.includes(o.id))&&p.yearFrom<=before.yearBandTo&&(p.yearTo??2026)>=before.yearBandFrom);
    const unresolved=current.variants.filter(v=>!['A','B'].includes(v.layer));
    return {groupId:before.groupId,priorityRank:before.priorityRank,make:before.make,model:before.model,displacementCc:before.displacementCc,
      yearBandFrom:before.yearBandFrom,yearBandTo:before.yearBandTo,exactRdwVehicles:before.exactRdwVehicles,beforeLayer:before.layer,afterLayer:current.layer,
      sampleSize:sample.sampleSize,observedOutputVariants:sample.observedOutputVariants,
      sourceSearchPerformed:[{provider:'atm-chiptuning',method:'Screened factual application sitemap by frozen make/model/displacement target; retrieved public application pages through paced cache before reviewing actual tables.',sitemap:discovery.sitemap,sitemapRetrievedAt:discovery.retrievedAt,sitemapContentSha256:discovery.contentSha256,discoveredApplicationUrls:candidateUrls,retrievedSourceIds:actual.filter(o=>o.status==='retrieved').map(o=>o.id),blockedSourceIds:actual.filter(o=>o.status!=='retrieved').map(o=>o.id)},
        {provider:'existing-and-targeted-independent-sources',method:'Reviewed retained Shiftech, Unlimited, Mosselman and manufacturer facts for the same technical family; targeted additional current van applications where the ATM pass left gaps. A source is counted only when its retrieved factual record exists.',sourceIds:applicable.filter(o=>o.provider!=='atm-chiptuning').map(o=>o.id)}],
      profilesFound:matchingProfiles.map(p=>({id:p.id,stockPowerHp:p.stockPowerHp,stockTorqueNm:p.stockTorqueNm,generation:p.generation,yearFrom:p.yearFrom,yearTo:p.yearTo,sourceIds:p.sourceIds})),
      sourceReviews:reviews.records.filter(r=>r.groupIds.includes(before.groupId)),
      unresolvedVariants:unresolved,unresolvedReasons:[...new Set(unresolved.flatMap(v=>v.reasons))],
      conclusion:unresolved.length?'Partial evidence only. The group remains open because at least one known output/application is unresolved. Do not substitute another stock torque, generation, powertrain or missing registered power.':'All currently evaluated scenarios have sourced output; unseen variants remain unmeasured.'};
  });
  save('data/research/top50-coverage-closure.json',{schemaVersion:1,datasetFingerprint:priority.datasetFingerprint,baselineHead:baseline.head,
    reviewPolicy:'Union of the historical V2 Top-50 C/D/E groups and the current expanded-sample Top-50 C/D/E groups. Every currently unresolved Top-50 group has a research record; the resolved original gap is retained for comparison.',
    baselineUnresolvedGroups:top50.filter(g=>needsReview(g.layer)).length,
    currentUnresolvedGroups:top50.filter(g=>needsReview(priority.groups.find(current=>current.groupId===g.groupId).layer)).length,
    requiredGroups:records.length,records});
  const qa=read('data/research/v3-rdw-validation.json'),oldQa=read('data/research/v3-rdw-baseline-validation.json');
  const subset=new Set(read('data/research/nl-rdw-live-sample.json').rows.map(r=>r.sampleId));
  const transitions=qa.rows.map(r=>{const b=oldQa.rows.find(o=>o.sampleId===r.sampleId);return {sampleId:r.sampleId,groupId:r.groupId,inPrior222:subset.has(r.sampleId),before:b.layer,after:r.layer,pricingUnchanged:JSON.stringify(b.quote)===JSON.stringify(r.quote),identityUnchanged:JSON.stringify(b.identity)===JSON.stringify(r.identity),reasons:r.reasons};});
  const eligible=qa.rows.filter(r=>r.layer!=='E');
  const outcomes={datasetFingerprint:qa.datasetFingerprint,sampleSize:qa.sampleSize,before:oldQa.layers,after:qa.layers,
    supportedOrdinaryIceDenominator:eligible.length,supportedOrdinaryIceSourced:eligible.filter(r=>['A','B'].includes(r.layer)).length,
    supportedOrdinaryIceSourcedPercent:100*eligible.filter(r=>['A','B'].includes(r.layer)).length/eligible.length,
    eligibility:'Production resolver can support an ordinary ICE estimate (A/B/C/D). E includes electrified/non-supported powertrains, missing power and unresolvable identity. All 400 remain in the overall denominator.',
    prior222:{before:count(oldQa.rows.filter(r=>subset.has(r.sampleId))),after:count(qa.rows.filter(r=>subset.has(r.sampleId)))},
    sourcedGains:transitions.filter(r=>!['A','B'].includes(r.before)&&['A','B'].includes(r.after)).length,
    sourcedDemotions:transitions.filter(r=>['A','B'].includes(r.before)&&!['A','B'].includes(r.after)).length,
    pricingChanges:transitions.filter(r=>!r.pricingUnchanged),identityChanges:transitions.filter(r=>!r.identityUnchanged),transitions};
  save('data/research/v3-rdw-outcomes.json',outcomes);
  const topIds=new Set(priority.groups.slice(0,250).flatMap(g=>g.variants.flatMap(v=>[v.profileId,v.selectedProfileId].filter(Boolean))));
  const oldIds=new Set(baselineProfiles.map(p=>p.id));
  const oldConflicts=new Set(read('data/research/v3-provider-baseline.json').profiles.filter(p=>p.conflicting).map(p=>p.id));
  const providers=[...new Set(observations.map(o=>o.provider))].sort().map(provider=>{
    const obs=observations.filter(o=>o.provider===provider),accepted=obs.filter(o=>selectedSources.has(o.id)),used=profiles.filter(p=>p.sourceIds.some(id=>sourceById.get(id)?.provider===provider));
    return {provider,observations:obs.length,retrievedPages:new Set(obs.filter(o=>o.status==='retrieved'&&o.retrievalMethod!=='search-index').map(o=>o.url)).size,
      acceptedObservations:accepted.length,supportingObservations:provider==='manufacturer'?obs.filter(o=>o.status==='retrieved').length:0,
      rejectedObservations:obs.length-accepted.length-(provider==='manufacturer'?obs.filter(o=>o.status==='retrieved').length:0),independentProfileVotes:used.length,top250Profiles:used.filter(p=>topIds.has(p.id)).length,
      conflictingProfiles:used.filter(p=>[p.stage1,p.stage2,p.stage3].some(s=>s?.sourceAgreement==='conflict')).length,
      newConflictingProfiles:used.filter(p=>!oldIds.has(p.id)&&[p.stage1,p.stage2,p.stage3].some(s=>s?.sourceAgreement==='conflict')).length,
      conflictsIntroduced:used.filter(p=>!oldConflicts.has(p.id)&&[p.stage1,p.stage2,p.stage3].some(s=>s?.sourceAgreement==='conflict')).length,
      blockedOrUnavailable:obs.filter(o=>o.status!=='retrieved'||(o.availability&&o.availability.status!=='available')).length};
  });
  save('data/research/v3-provider-coverage.json',{datasetFingerprint:priority.datasetFingerprint,providers});
  const md=['# Dutch observed output priority — V3','','Frozen V2 ranking; 250 groups × 12 registrations = 3,000 sampled registrations. The three slices cover early, middle and late admission dates. Counts are **observed output variants**, not fleet shares.','',
    'The complete queue is [nl-output-variant-priority.json](../../data/research/nl-output-variant-priority.json). It preserves fuel, registered kW, approximate PS, admission year, cylinders and RDW type/variant/execution. Source-only targets retain real profile IDs. Missing power remains unresolved.','',
    'Group coverage requires every evaluated known scenario to be sourced. Additional observations can reveal a gap in a group that passed the smaller V2 sample. Compare the expanded V2 baseline with V3 using the same sample, and keep the historical V2 KPI separate.','',
    '| Rank | RDW group | Years | Observed PS (rounded) | Layer |','|---:|---|---|---|---|',...groups.map(g=>`| ${g.priorityRank} | ${g.make} ${g.model} / ${g.displacementCc} cc | ${g.yearBandFrom}–${g.yearBandTo} | ${[...new Set(g.observedOutputVariants.map(v=>v.approximatePowerPs?Math.round(v.approximatePowerPs):'missing'))].join(', ')} | ${g.groupLayer} |`),''];
  fs.writeFileSync('docs/tuning-data/NL_OUTPUT_VARIANT_PRIORITY.md',md.join('\n'));
  const providerMd=['# Provider coverage — V3','','Counts are cumulative observations, not scraped vehicle or year cross-products. Each independent provider contributes at most one vote per profile/stage. Supporting manufacturer facts and review-only observations do not supply remap votes.','',
    '| Provider | Retrieved pages | Accepted remap observations | Supporting facts | Rejected/deferred | Profile votes | Top 250 profiles | Conflicting profiles | Conflicts introduced | Blocked/unavailable |','|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',...providers.map(p=>`| ${p.provider} | ${p.retrievedPages} | ${p.acceptedObservations} | ${p.supportingObservations} | ${p.rejectedObservations} | ${p.independentProfileVotes} | ${p.top250Profiles} | ${p.conflictingProfiles} | ${p.conflictsIntroduced} | ${p.blockedOrUnavailable} |`),'',
    'ATM applications were checked before independent follow-up. Both MAN category mirrors remain one ATM vote. Partial-period corroboration stays in the review queue when merging it would shrink an existing supported period. Stock-torque conflicts and unresolved generation equivalence remain separate. V-Tech external modules retain their factual records and zero ordinary remap votes.','',
    'No prices, marketing copy, customer reviews, images or dyno graphics enter the dataset. Negative availability applies only to the relevant external source/application and retrieval date. Fresh ATM T6.1 diesel 150 PS evidence is currently positive; the discrepancy with the prompt example is recorded separately.','',
    'See [v3-provider-coverage.json](../../data/research/v3-provider-coverage.json), [source-pages.json](../../data/research/source-pages.json), [top50-coverage-closure.json](../../data/research/top50-coverage-closure.json), [v3-source-changes.json](../../data/research/v3-source-changes.json), and [v3-negative-applicability.json](../../data/research/v3-negative-applicability.json).',''];
  fs.writeFileSync('docs/tuning-data/PROVIDER_COVERAGE_V3.md',providerMd.join('\n'));
  console.log(JSON.stringify({groups:groups.length,observedVariants:groups.reduce((n,g)=>n+g.observedOutputVariants.length,0),top50Closure:records.length,qa:outcomes.after,icePercent:outcomes.supportedOrdinaryIceSourcedPercent,pricingChanges:outcomes.pricingChanges.length,identityChanges:outcomes.identityChanges.length}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

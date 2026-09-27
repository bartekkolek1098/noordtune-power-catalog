/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:child_process');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const save=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourced=layer=>layer==='A'||layer==='B';
const unique=values=>[...new Set(values.filter(value=>value!==undefined&&value!==null))];
const differ=(candidates,field)=>{const values=unique(candidates.map(field));return values.length>1?values:undefined;};
async function main(){
 const {matchSourcedProfile,sourceMake,sourceModelFamily}=await import('../src/lib/sourced-tuning-match.ts');
 const {normalizeCatalogFuel,nominalDisplacementMatches}=await import('../src/data/catalog-matching.ts');
 const profiles=read('src/data/tuning-profiles/profiles.json'),observations=read('data/research/source-pages.json');
 const baseline=read('data/research/v3-rdw-validation.json'),after=read('.git/v3-1/qa-after.json'),v3Outcomes=read('data/research/v3-rdw-outcomes.json');
 const promotions=read('data/research/v3-1-reviewed-promotions.json'),promoted=new Set(promotions.reviews.map(review=>review.sourceId));
 const previousProfiles=JSON.parse(cp.execFileSync('git',['show',`${promotions.baselineHead}:src/data/tuning-profiles/profiles.json`],{encoding:'utf8',maxBuffer:20e6}));
 const afterById=new Map(after.rows.map(row=>[row.sampleId,row]));
 const demotedIds=new Set(v3Outcomes.transitions.filter(row=>sourced(row.before)&&!sourced(row.after)).map(row=>row.sampleId));
 const input=row=>({make:row.identity.make,model:row.identity.model,fuel:row.identity.fuel,
  registeredPower:row.identity.registeredPowerKw?{value:row.identity.registeredPowerKw,unit:'kW'}:undefined,
  displacementCc:row.identity.displacementCc,firstRegistrationYear:row.identity.firstAdmissionYear,cylinders:row.identity.cylinders,
  type:row.identity.type,variant:row.identity.variant,execution:row.identity.execution});
 const cases=[];
 for(const row of baseline.rows){
  if(sourced(row.layer)&&!demotedIds.has(row.sampleId))continue;
  const next=afterById.get(row.sampleId),matched=matchSourcedProfile(input(row),profiles),identity=row.identity;
  const make=sourceMake(identity.make),fuel=normalizeCatalogFuel(identity.fuel),power=(identity.registeredPowerKw??0)/.73549875;
  const near=profiles.filter(profile=>sourceMake(profile.brand)===make&&profile.fuel===fuel&&Math.abs(profile.stockPowerHp-power)<=3
    &&identity.displacementCc&&(profile.displacementPrecision==='exact'?Math.abs(profile.displacementCc-identity.displacementCc)<=2:nominalDisplacementMatches(identity.displacementCc,profile.displacementCc)));
  const model=sourceModelFamily(make,identity.model);
  const sameModel=profile=>[profile.modelFamily,...(profile.aliases??[])].map(name=>sourceModelFamily(make,name)).some(name=>model===name||model.startsWith(name+' '));
  const modelNear=near.filter(sameModel),inYear=modelNear.filter(profile=>identity.firstAdmissionYear>=profile.yearFrom&&identity.firstAdmissionYear<=(profile.yearTo??Number(profile.retrievedAt.slice(0,4))));
  const relevantRejected=observations.filter(source=>source.conditions?.some(c=>/RESEARCH_QUEUE_NOT_PROMOTED/.test(c))
    &&source.identity&&sourceMake(source.identity.brand)===make&&source.identity.fuel===fuel
    &&sourceModelFamily(make,source.identity.modelFamily)===model
    &&Math.abs(source.identity.stockPowerHp-power)<=3&&identity.displacementCc
    &&Math.abs(source.identity.displacementCc-identity.displacementCc)<=(source.identity.displacementPrecision==='nominal'?49:2)
    &&identity.firstAdmissionYear>=source.identity.yearFrom&&identity.firstAdmissionYear<=(source.identity.yearTo??2026));
  const candidates=matched.candidates;
  const differingFields={generation:differ(candidates,p=>p.generation),engineFamily:differ(candidates,p=>p.engineFamily??''),stockTorqueNm:differ(candidates,p=>p.stockTorqueNm),gearbox:differ(candidates,p=>p.gearbox??''),stage1PowerHp:differ(candidates,p=>p.stage1.selectedPowerHp),stage1TorqueNm:differ(candidates,p=>p.stage1.selectedTorqueNm)};
  for(const key of Object.keys(differingFields))if(!differingFields[key])delete differingFields[key];
  const recovered=sourced(next.layer)&&!sourced(row.layer),selected=profiles.find(profile=>profile.id===matched.profile?.id);
  let category,stage,evidence,disposition;
  if(recovered){
    category=selected?.sourceIds.some(id=>promoted.has(id))?'reviewed-research-queue-promotion':'administrative-model-normalization';
    stage=category==='reviewed-research-queue-promotion'?'source-builder-queue':'model-family-normalization';
    evidence=category==='reviewed-research-queue-promotion'?'Pinned retrieved application, bounded category/year scope and exact source review ledger.':'Make-specific RDW administrative prefix with matching stock, fuel, cc and year.';
    disposition='safely-recovered';
  }else if(row.reasons.includes('UNSUPPORTED_POWERTRAIN_ESTIMATE')){category='outside-ordinary-ice-scope';stage='powertrain';evidence='Ordinary ICE applicability cannot be inferred from this powertrain.';disposition='unsupported';}
  else if(row.reasons.includes('MISSING_OR_INVALID_REGISTERED_POWER')){category='missing-registered-facts';stage='input-validation';evidence='Independent factory output or complete RDW power facts for this exact vehicle.';disposition='missing-data';}
  else if(row.reasons.includes('MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS')){
    category=differingFields.stockTorqueNm?'conflicting-stock-observations':'source-generation-unresolved';stage='configuration-key';
    evidence=differingFields.stockTorqueNm?'Manufacturer factory torque and transmission/engine-variant mapping for the exact registration.':'Reviewed body/phase equivalence and RDW generation evidence; retain both provider labels and stage values.';
    disposition='genuinely-ambiguous';
  }else if(row.reasons.includes('CONNECT_ENGINE_GENERATION_REVIEW')){category='engine-family-unconfirmed';stage='engine-family-guard';evidence='Engine code, ECU identification or workshop record confirming TDCi versus EcoBlue.';disposition='genuinely-ambiguous';}
  else if(relevantRejected.length){category='source-rejection-or-review-queue';stage='source-builder-queue';evidence='Resolve the recorded research/availability reason without relaxing output, period or engine-family guards.';disposition='unresolved-review';}
  else if(modelNear.length&&!inYear.length){category='source-period-incompatible';stage='published-year-scope';evidence='Dated source or manufacturer proof covering the observed admission year and body generation.';disposition='unresolved-scope';}
  else if(near.length){category='no-applicable-model-source';stage='model-family';evidence='An exact-model source or verified model/trim identity; same-output sibling models are not aliases.';disposition='unsupported-by-existing-profiles';}
  else{category='no-applicable-technical-source';stage='fuel-output-displacement';evidence='Actual application page for this model/fuel/output/displacement/year, with ordinary remap scope.';disposition='unsupported-by-existing-profiles';}
  const displayIdentity={make:identity.make,model:identity.model,fuel:identity.fuel,registeredPowerKw:identity.registeredPowerKw,stockPowerHp:identity.stockPowerHp,
    displacementCc:identity.displacementCc,firstAdmissionYear:identity.firstAdmissionYear,cylinders:identity.cylinders,type:identity.type,variant:identity.variant,execution:identity.execution};
  const record={sampleId:row.sampleId,groupId:row.groupId,identity:displayIdentity,baselineLayer:row.layer,currentLayer:next.layer,
    primaryCategory:category,secondaryReasonCodes:row.reasons,rejectionStage:stage,candidateIds:candidates.map(profile=>profile.id),
    ...(selected?{selectedProfileId:selected.id}:{}),
    ...(near.length?{nearProfileIds:near.filter(sameModel).map(profile=>profile.id).slice(0,8)}:{}),
    ...(relevantRejected.length?{reviewOnlySourceIds:relevantRejected.map(source=>source.id)}:{}),
    ...(Object.keys(differingFields).length?{differingFields}:{}),evidenceNeeded:evidence,disposition,
    ...(demotedIds.has(row.sampleId)?{v3Demotion:true}:{}),
    ...(recovered?{stage1Before:row.stage1,stage1After:next.stage1,stage2Before:row.stage2,stage2After:next.stage2}:{}),
    ...(JSON.stringify(row.quote)!==JSON.stringify(next.quote)?{quoteBefore:row.quote,quoteAfter:next.quote}:{})};
  cases.push(record);
 }
 const baselineNonSourced=baseline.rows.filter(row=>!sourced(row.layer));
 const casesById=new Map(cases.map(record=>[record.sampleId,record]));
 const decisions=v3Outcomes.transitions.filter(row=>demotedIds.has(row.sampleId)).map(transition=>{
  const caseRecord=casesById.get(transition.sampleId),torques=caseRecord.differingFields?.stockTorqueNm??[];
  const spread=torques.length?Math.max(...torques)-Math.min(...torques):0;
  const id=caseRecord.identity,gen=caseRecord.differingFields?.generation??[];
  const clearGenerationBoundary=(id.make==='VOLKSWAGEN'&&id.model==='GOLF'&&gen.length>1)
    ||(id.make==='MERCEDES-BENZ'&&id.model==='SPRINTER'&&gen.length>1)
    ||(id.make==='PEUGEOT'&&id.model==='308'&&gen.length>1)
    ||(id.make==='RENAULT'&&id.model==='MEGANE'&&id.stockPowerHp===116&&gen.length>1);
  const decision=sourced(caseRecord.currentLayer)?'safely-recovered':spread>=10||clearGenerationBoundary?'correctly-demoted-and-retained':'still-unresolved';
  return {sampleId:transition.sampleId,groupId:caseRecord.groupId,identity:caseRecord.identity,v2Layer:transition.before,v3Layer:transition.after,v3_1Layer:caseRecord.currentLayer,
    decision,reason:decision==='correctly-demoted-and-retained'?(spread>=10?`Published factory torque differs by ${spread} Nm; opaque RDW fields do not select one.`:'Published body/phase scopes meet at an unresolved admission-year boundary.')
      :'Source generation/stock metadata or Stage values differ without enough factory identity evidence to select or merge them.',candidateIds:caseRecord.candidateIds,differingFields:caseRecord.differingFields};
 });
 const rootCounts=cases.filter(record=>!sourced(record.baselineLayer)).reduce((totals,record)=>(totals[record.primaryCategory]=(totals[record.primaryCategory]??0)+1,totals),{});
 const decisionCounts=decisions.reduce((totals,record)=>(totals[record.decision]=(totals[record.decision]??0)+1,totals),{});
 const ambiguous=cases.filter(record=>record.rejectionStage==='configuration-key');
 const partialPower=ambiguous.filter(record=>!record.differingFields?.stage1PowerHp).length;
 const partialTorque=ambiguous.filter(record=>!record.differingFields?.stage1TorqueNm).length;
 const bothFields=ambiguous.filter(record=>!record.differingFields?.stage1PowerHp&&!record.differingFields?.stage1TorqueNm).length;
 const changed=baseline.rows.flatMap(old=>{const next=afterById.get(old.sampleId);return old.layer!==next.layer||JSON.stringify(old.stage1)!==JSON.stringify(next.stage1)||JSON.stringify(old.stage2)!==JSON.stringify(next.stage2)||JSON.stringify(old.quote)!==JSON.stringify(next.quote)
   ?[{sampleId:old.sampleId,groupId:old.groupId,before:old.layer,after:next.layer,stage1Before:old.stage1,stage1After:next.stage1,stage2Before:old.stage2,stage2After:next.stage2,
       ...(JSON.stringify(old.quote)!==JSON.stringify(next.quote)?{quoteBefore:old.quote,quoteAfter:next.quote}:{})}]:[];});
 const frozen344=new Set(baseline.rows.filter(row=>row.layer!=='E').map(row=>row.sampleId));
 const prior222=new Set(v3Outcomes.transitions.filter(row=>row.inPrior222).map(row=>row.sampleId));
 const afterProfileById=new Map(profiles.map(profile=>[profile.id,profile]));
 const profileChanges=previousProfiles.filter(profile=>JSON.stringify(profile)!==JSON.stringify(afterProfileById.get(profile.id))).map(profile=>profile.id);
 const newProfiles=profiles.filter(profile=>!previousProfiles.some(old=>old.id===profile.id)).map(profile=>({id:profile.id,sourceIds:profile.sourceIds,modelFamily:profile.modelFamily,stockPowerHp:profile.stockPowerHp}));
 const fieldScope=rows=>rows.reduce((counts,row)=>{
  if(!sourced(row.layer))return counts;
  if(row.stage1?.powerHp!==undefined&&row.stage1?.torqueNm!==undefined)counts.sourcedStage1PowerAndTorque++;
  else if(row.stage1?.powerHp!==undefined)counts.sourcedStage1PowerOnly++;
  if(row.stage2?.powerHp!==undefined&&row.stage2?.torqueNm!==undefined&&row.stage2.provenance!=='generic-indicative')counts.sourcedStage2PowerAndTorque++;
  if(row.stage2?.provenance==='generic-indicative')counts.genericStage2++;
  if(row.stage3?.powerHp!==undefined)counts.numericStage3++;
  return counts;
 },{sourcedStage1PowerAndTorque:0,sourcedStage1PowerOnly:0,sourcedStage2PowerAndTorque:0,genericStage2:0,numericStage3:0});
 const hashes=Object.fromEntries(['data/research/nl-rdw-v3-qa-sample.json','data/research/nl-rdw-live-sample.json','data/research/nl-top-groups-output-sample.json','data/research/nl-technical-priority-v3.json','data/research/nl-output-variant-priority.json','data/research/v3-rdw-validation.json'].map(file=>[file,sha(file)]));
 const summary={schemaVersion:1,baselineHead:promotions.baselineHead,baselineFingerprint:baseline.datasetFingerprint,currentFingerprint:after.datasetFingerprint,inputSha256:hashes,
  method:'Fixed 400 and original 222 replayed from committed sanitized RDW rows. No live RDW calls. Existing source observations and V3 strict group/scenario membership remain frozen; only explicitly reviewed promotions and model normalization can change resolution.',
  baseline400:baseline.layers,current400:after.layers,baselineSourced400:baseline.rows.filter(row=>sourced(row.layer)).length,currentSourced400:after.rows.filter(row=>sourced(row.layer)).length,
  fixed344:{size:frozen344.size,baselineSourced:baseline.rows.filter(row=>frozen344.has(row.sampleId)&&sourced(row.layer)).length,currentSourced:after.rows.filter(row=>frozen344.has(row.sampleId)&&sourced(row.layer)).length},
  prior222:{size:prior222.size,baselineSourced:baseline.rows.filter(row=>prior222.has(row.sampleId)&&sourced(row.layer)).length,currentSourced:after.rows.filter(row=>prior222.has(row.sampleId)&&sourced(row.layer)).length},
  rootCounts,demotionDecisions:decisionCounts,fieldScope:{baseline:fieldScope(baseline.rows),current:fieldScope(after.rows)},partialCandidateFields:{ambiguousCases:ambiguous.length,stage1PowerConcordant:partialPower,stage1TorqueConcordant:partialTorque,bothConcordant:bothFields,note:'Concordance among candidates is partial field evidence only. These cases remain C/D and are not counted as resolved sourced profiles.'},
  profileChanges:{newProfiles,existingProfileValueOrScopeChanges:profileChanges,missingPreviousProfiles:previousProfiles.filter(profile=>!afterProfileById.has(profile.id)).map(profile=>profile.id)},
  changedRegistrations:changed,quoteChanges:changed.filter(row=>row.quoteBefore).length,identityChanges:baseline.rows.filter(row=>JSON.stringify(row.identity)!==JSON.stringify(afterById.get(row.sampleId).identity)).length,
  demotions:decisions};
 if(baselineNonSourced.length!==238||cases.length!==238||decisions.length!==28||Object.values(rootCounts).reduce((a,b)=>a+b,0)!==238)throw Error('Frozen case accounting mismatch');
 if(summary.profileChanges.existingProfileValueOrScopeChanges.length||summary.profileChanges.missingPreviousProfiles.length)throw Error('Existing V3 profile changed or disappeared');
 save('data/research/v3-1-match-diagnostics.json',{...summary,cases});
 save('data/research/v3-1-results.json',Object.fromEntries(Object.entries(summary).filter(([key])=>!['inputSha256','demotions'].includes(key))));
 console.log(JSON.stringify({rootCounts,decisions:decisionCounts,baselineSourced400:summary.baselineSourced400,currentSourced400:summary.currentSourced400,fixed344:summary.fixed344,prior222:summary.prior222,partialCandidateFields:summary.partialCandidateFields,profileChanges:summary.profileChanges,quoteChanges:summary.quoteChanges,identityChanges:summary.identityChanges}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

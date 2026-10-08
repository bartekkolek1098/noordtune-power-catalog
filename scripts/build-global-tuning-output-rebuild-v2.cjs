/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {vehicleDatabase, engineCatalog} = require("../src/data/catalog.ts");
const {sourcedTuningProfiles} = require("../src/data/tuning-profiles/index.ts");

const root = path.resolve("docs/audits");
fs.mkdirSync(root, {recursive: true});

const vtech = JSON.parse(fs.readFileSync("data/research/vtech-discovery-v2.json", "utf8"));
const sources = JSON.parse(fs.readFileSync("data/research/source-pages.json", "utf8"));

const norm = (value) => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/\b(?:serie|series)\b/g, "series")
  .replace(/\bklasse\b/g, "class")
  .replace(/[^a-z0-9]+/g, " ").trim();

const slug = value => norm(value).replace(/\s+/g, "-");
const round = (n, digits=2) => Number(n.toFixed(digits));
const median = values => {
  if (!values.length) return undefined;
  const a=[...values].sort((x,y)=>x-y), m=Math.floor(a.length/2);
  return a.length%2 ? a[m] : (a[m-1]+a[m])/2;
};
const fuelFrom = label => {
  const s=norm(label);
  if (/\b(?:tdi|tdci|ecoblue|cdi|dci|hdi|crdi|multijet|diesel|d4d|jtd)\b/.test(s)) return "Diesel";
  if (/\b(?:gte|ehybrid|e hybrid|phev|hybrid|mhev|etsi)\b/.test(s)) return "Hybrid";
  if (/\b(?:tsi|tfsi|ecoboost|tce|tgdi|gdi|petrol|benzine|turbo)\b/.test(s)) return "Petrol";
  return undefined;
};
const displacementFrom = label => {
  const m=String(label??"").match(/\b(\d)[.,](\d{1,2})\b/);
  return m ? Math.round(Number(`${m[1]}.${m[2]}`)*1000) : undefined;
};
const hpFrom = label => {
  const m=String(label??"").match(/\b(\d{2,4})\s*(?:KM|PK|PS|HP)\b/i);
  return m ? Number(m[1]) : undefined;
};
const providerPriority = new Map([
  ["manufacturer",0],["mosselman",1],["shiftech",2],["unlimited-tuning",3],
  ["atm-chiptuning",4],["br-performance",5],["other",9],["vtech",99]
]);

const taxonomyRows = vtech.variants.map((row,index) => {
  const years=(row.years??[]).filter(Number.isInteger);
  const fuel=fuelFrom(row.engineMarketingName);
  const displacementCc=displacementFrom(row.engineMarketingName);
  const stockPowerHp=hpFrom(row.engineMarketingName);
  return {
    id:`vtech-taxonomy-${String(index+1).padStart(5,"0")}`,
    provider:"vtech",
    sourceRole:"taxonomy-only",
    brand:row.brand,
    modelFamily:row.modelFamily,
    generation:row.generation,
    yearFrom:years.length?Math.min(...years):undefined,
    yearTo:years.length?Math.max(...years):undefined,
    engineMarketingName:row.engineMarketingName,
    fuel,
    displacementCc,
    stockPowerHp,
    url:row.url
  };
});

const stageObs = sources
  .filter(source => source.status === "retrieved" && source.provider !== "vtech")
  .flatMap(source => {
    const identity=source.identity ?? source.unresolvedIdentity;
    if (!identity?.brand || !identity?.modelFamily || !identity?.stockPowerHp) return [];
    const base={
      sourceId:source.id,provider:source.provider,url:source.url,retrievedAt:source.retrievedAt,
      brand:identity.brand,modelFamily:identity.modelFamily,generation:identity.generation,
      yearFrom:identity.yearFrom,yearTo:identity.yearTo,fuel:identity.fuel,
      engineMarketingName:identity.engineMarketingName,engineCodes:identity.engineCodes,
      displacementCc:identity.displacementCc,stockPowerHp:identity.stockPowerHp,
      stockTorqueNm:identity.stockTorqueNm,ecuFamily:identity.ecuFamily
    };
    return ["stage1","stage2"].flatMap(stage => source.stages?.[stage]?.powerHp
      ? [{...base,stage:stage==="stage1"?"Stage 1":"Stage 2",
          tunedPowerHp:source.stages[stage].powerHp,
          tunedTorqueNm:source.stages[stage].torqueNm,
          conditions:source.stages[stage].conditions ?? source.conditions ?? []}]
      : []);
  });

function baseKey(row) {
  return [
    norm(row.brand),norm(row.modelFamily),norm(row.generation),
    row.fuel ?? "?",Math.round((row.displacementCc??0)/10)*10,row.stockPowerHp
  ].join("|");
}
const sourceGroups=new Map();
for (const obs of stageObs) {
  const key=baseKey(obs);
  const group=sourceGroups.get(key)??[];
  group.push(obs); sourceGroups.set(key,group);
}

const stage1Consensus=[];
const stage2Analysis=[];
for (const [key, rows] of sourceGroups) {
  const s1=rows.filter(r=>r.stage==="Stage 1");
  if (s1.length) {
    const providers=[...new Set(s1.map(r=>r.provider))];
    const providerVotes=providers.map(provider => {
      const votes=s1.filter(r=>r.provider===provider).sort((a,b)=>a.tunedPowerHp-b.tunedPowerHp);
      return votes[0];
    });
    const powers=providerVotes.map(r=>r.tunedPowerHp);
    const torques=providerVotes.map(r=>r.tunedTorqueNm).filter(Number.isFinite);
    const stockTorqueValues=[...new Set(providerVotes.map(r=>r.stockTorqueNm).filter(Number.isFinite))];
    const torqueConflict=stockTorqueValues.length>1 && Math.max(...stockTorqueValues)-Math.min(...stockTorqueValues)>10;
    const powerSpread=(Math.max(...powers)-Math.min(...powers))/Math.max(1,median(powers));
    const torqueSpread=torques.length>1?(Math.max(...torques)-Math.min(...torques))/Math.max(1,median(torques)):0;
    const close=providers.length>=2 && powerSpread<=0.06 && torqueSpread<=0.10 && !torqueConflict;
    const status=providers.length<2?"SINGLE_SOURCE_CONDITIONAL":close?"SUPPORTED_RANGE":"CONFLICT_REVIEW";
    stage1Consensus.push({
      configurationKey:key,
      identity:Object.fromEntries(["brand","modelFamily","generation","yearFrom","yearTo","fuel","engineMarketingName","displacementCc","stockPowerHp","stockTorqueNm"].map(k=>[k,providerVotes.find(x=>x[k]!==undefined)?.[k]])),
      providers,
      observations:providerVotes.map(r=>({sourceId:r.sourceId,provider:r.provider,url:r.url,tunedPowerHp:r.tunedPowerHp,tunedTorqueNm:r.tunedTorqueNm})),
      status,
      powerRangeHp:[Math.min(...powers),Math.max(...powers)],
      torqueRangeNm:torques.length?[Math.min(...torques),Math.max(...torques)]:undefined,
      conservativePointHp:status==="SUPPORTED_RANGE"?Math.min(...powers):undefined,
      conservativePointNm:status==="SUPPORTED_RANGE"&&torques.length?Math.min(...torques):undefined,
      powerSpreadPct:round(powerSpread*100),torqueSpreadPct:round(torqueSpread*100),
      stockTorqueConflict:torqueConflict
    });
  }
  const s2=rows.filter(r=>r.stage==="Stage 2");
  if (s2.length) {
    const providers=[...new Set(s2.map(r=>r.provider))];
    const hardwareTerms=/\b(?:intake|intercooler|downpipe|catalyst|cataly|fuel|cooling|clutch|tcu|dsg|exhaust|hardware)\b/i;
    const explicitHardware=s2.some(r=>r.conditions.some(x=>hardwareTerms.test(x)));
    stage2Analysis.push({
      configurationKey:key,
      identity:Object.fromEntries(["brand","modelFamily","generation","fuel","displacementCc","stockPowerHp","stockTorqueNm"].map(k=>[k,s2.find(x=>x[k]!==undefined)?.[k]])),
      providers,
      observations:s2.map(r=>({sourceId:r.sourceId,provider:r.provider,url:r.url,tunedPowerHp:r.tunedPowerHp,tunedTorqueNm:r.tunedTorqueNm,conditions:r.conditions})),
      evidenceCount:s2.length,
      hardwareScopeExplicit:explicitHardware,
      recommendedPublicAction:providers.length>=2&&explicitHardware?"OWNER_REVIEW_FOR_SUPPORTED_STAGE2":"CUSTOM_ON_REQUEST"
    });
  }
}

const stage2Ratios = stageObs.filter(r=>r.stage==="Stage 2").flatMap(s2 => {
  const s1=stageObs.find(r=>r.stage==="Stage 1" && r.sourceId===s2.sourceId);
  if(!s1) return [];
  const stock=s2.stockPowerHp;
  if(!(stock>0)||!(s1.tunedPowerHp>stock)||!(s2.tunedPowerHp>=s1.tunedPowerHp)) return [];
  return [{
    provider:s2.provider,fuel:s2.fuel??"Unknown",
    stage1GainPct:round((s1.tunedPowerHp-stock)/stock*100),
    stage2GainPct:round((s2.tunedPowerHp-stock)/stock*100),
    additionalStage2VsStage1Pct:round((s2.tunedPowerHp-s1.tunedPowerHp)/s1.tunedPowerHp*100)
  }];
});
const ratioGroups=Object.values(stage2Ratios.reduce((acc,row)=>{
  const k=row.fuel; const g=acc[k]??={fuel:k,rows:[]};g.rows.push(row);acc[k]=g;return acc;
},{})).map(g=>({
  fuel:g.fuel,count:g.rows.length,
  stage1GainPctMedian:round(median(g.rows.map(r=>r.stage1GainPct))??0),
  stage2GainPctMedian:round(median(g.rows.map(r=>r.stage2GainPct))??0),
  additionalStage2VsStage1PctMedian:round(median(g.rows.map(r=>r.additionalStage2VsStage1Pct))??0),
  minAdditionalPct:round(Math.min(...g.rows.map(r=>r.additionalStage2VsStage1Pct))),
  maxAdditionalPct:round(Math.max(...g.rows.map(r=>r.additionalStage2VsStage1Pct)))
}));

const vtechIndex=new Map();
for(const row of taxonomyRows){
  const key=[norm(row.brand),norm(row.modelFamily)].join("|");
  const arr=vtechIndex.get(key)??[];arr.push(row);vtechIndex.set(key,arr);
}
const generatedRiskRows=[];
const generatedModelFamily = vehicle => {
  const model=String(vehicle.model??"").trim(), engine=String(vehicle.engine??"").trim();
  return engine && model.toLowerCase().endsWith((" "+engine).toLowerCase())
    ? model.slice(0, -(engine.length+1)).trim()
    : model;
};
for(const vehicle of vehicleDatabase){
  if(vehicle.publicationSource==="existing-curated") continue;
  const modelFamily=generatedModelFamily(vehicle);
  const tax=vtechIndex.get([norm(vehicle.brand),norm(modelFamily)].join("|"));
  if(!tax?.length) continue;
  const cc=displacementFrom(vehicle.engine);
  const fuel=vehicle.fuel;
  const years=vehicle.years??[];
  const yearMin=years.length?Math.min(...years):undefined,yearMax=years.length?Math.max(...years):undefined;
  const matches=tax.filter(row =>
    row.stockPowerHp===vehicle.stockPowerHp &&
    (!row.fuel||!fuel||row.fuel===fuel) &&
    (!row.displacementCc||!cc||Math.abs(row.displacementCc-cc)<=80) &&
    (!row.yearFrom||!yearMax||row.yearFrom<=yearMax) &&
    (!row.yearTo||!yearMin||row.yearTo>=yearMin)
  );
  if(!matches.length){
    generatedRiskRows.push({
      id:vehicle.id,brand:vehicle.brand,model:modelFamily,rawModel:vehicle.model,engine:vehicle.engine,fuel:vehicle.fuel,
      yearRange:vehicle.yearRange,stockPowerHp:vehicle.stockPowerHp,stockTorqueNm:vehicle.stockTorqueNm,
      stage1:vehicle.stages.find(s=>s.name==="Stage 1")?.powerHp,
      stage2:vehicle.stages.find(s=>s.name==="Stage 2")?.powerHp,
      reason:"GENERATED_CROSS_PRODUCT_WITHOUT_VTECH_TAXONOMY_MATCH"
    });
  }
}
const generatedRiskMap=new Map();
for(const row of generatedRiskRows){
  const key=[row.brand,row.model,row.engine,row.fuel,row.stockPowerHp,row.stockTorqueNm,row.stage1,row.stage2].join("|");
  const match=String(row.yearRange).match(/(?:19|20)[0-9]{2}/);
  const year=match?Number(match[0]):undefined;
  const current=generatedRiskMap.get(key)??{...row,yearFrom:year,yearTo:year,canonicalRows:0,exampleIds:[]};
  current.canonicalRows++;
  if(Number.isInteger(year)){
    current.yearFrom=Math.min(current.yearFrom??year,year);
    current.yearTo=Math.max(current.yearTo??year,year);
  }
  if(current.exampleIds.length<3)current.exampleIds.push(row.id);
  delete current.id;
  delete current.yearRange;
  generatedRiskMap.set(key,current);
}
const generatedRisk=[...generatedRiskMap.values()];
const makePriority=["Volkswagen","BMW","Audi","Mercedes-Benz","Ford","Volvo","SEAT","Skoda","Cupra"];
generatedRisk.sort((a,b)=>{
  const ai=makePriority.indexOf(a.brand),bi=makePriority.indexOf(b.brand);
  return (ai<0?99:ai)-(bi<0?99:bi)||a.model.localeCompare(b.model)||a.stockPowerHp-b.stockPowerHp;
});

const vw204Taxonomy=taxonomyRows.filter(r=>norm(r.brand)==="volkswagen"&&r.stockPowerHp===204);
const vw204Canonical=vehicleDatabase.filter(v=>norm(v.brand)==="volkswagen"&&v.stockPowerHp===204).map(v=>({
  id:v.id,model:v.model,engine:v.engine,fuel:v.fuel,yearRange:v.yearRange,
  stockPowerHp:v.stockPowerHp,stockTorqueNm:v.stockTorqueNm,
  stage1:v.stages.find(s=>s.name==="Stage 1")?.powerHp,
  stage2:v.stages.find(s=>s.name==="Stage 2")?.powerHp
}));
const fakeGolf=vw204Canonical.find(v=>norm(v.model).startsWith("golf")&&/bitdi/i.test(v.engine));
const vw204={
  finding:"Stock power alone is not an identity key. Current generated-family construction forms model × trim cross-products, creating unsupported combinations.",
  vtechConfigurations:vw204Taxonomy,
  currentCanonical204Count:vw204Canonical.length,
  currentCanonical204Sample:vw204Canonical.slice(0,60),
  reproducedCustomerRisk:fakeGolf,
  rootCause:fakeGolf?{
    type:"MODEL_TRIM_CROSS_PRODUCT",
    detail:`Generated Volkswagen families apply the 2.0 BiTDI 204 trim across unrelated models. This creates ${fakeGolf.model} ${fakeGolf.engine} with internal Stage 2 ${fakeGolf.stage2} hp even though V-Tech's public taxonomy places 204 hp 2.0 TDI in T6/T6.1 commercial-vehicle families, while Golf 204 hp is a materially different 2.8 V6 configuration in its older generation.`,
    emergencyGuard:"Do not expose numeric generated/canonical-estimated outputs to customers. Require a reviewed/reference/source-backed compatible profile."
  }:undefined
};

const uniqueSourceConfigs=new Set(stageObs.map(baseKey));
const multiSourceStage1=stage1Consensus.filter(x=>x.providers.length>=2);
const gapAudit={
  createdAt:new Date().toISOString(),
  current:{publicVehicles:engineCatalog.length,canonicalVehicles:vehicleDatabase.length,sourcedProfiles:sourcedTuningProfiles.length},
  competitor:{vtechTaxonomyRows:taxonomyRows.length,vtechBrands:new Set(taxonomyRows.map(x=>x.brand)).size,vtechModels:new Set(taxonomyRows.map(x=>`${x.brand}|${x.modelFamily}`)).size,
    sourceObservations:sources.length,stageObservations:stageObs.length,uniqueSourceConfigurations:uniqueSourceConfigs.size},
  stage1:{groups:stage1Consensus.length,multiSource:multiSourceStage1.length,supportedRange:stage1Consensus.filter(x=>x.status==="SUPPORTED_RANGE").length,
    singleSource:stage1Consensus.filter(x=>x.status==="SINGLE_SOURCE_CONDITIONAL").length,conflicts:stage1Consensus.filter(x=>x.status==="CONFLICT_REVIEW").length},
  stage2:{groups:stage2Analysis.length,ownerReviewCandidates:stage2Analysis.filter(x=>x.recommendedPublicAction==="OWNER_REVIEW_FOR_SUPPORTED_STAGE2").length,
    customOnRequest:stage2Analysis.filter(x=>x.recommendedPublicAction==="CUSTOM_ON_REQUEST").length},
  generatedCrossProductRiskCandidates:generatedRisk.length,
  top50RedCustomerRiskCandidates:generatedRisk.slice(0,50),
  note:"Absence from one competitor taxonomy is a risk signal, not proof a vehicle does not exist. Cross-product architecture plus incompatible known examples is the actionable root cause."
};

const backlog={
  p0:[
    {id:"customer-output-guard",status:"IMPLEMENT_IN_PR22",action:"Block customer numeric output from generic/canonical-estimated profiles; preserve source-backed/reviewed values."},
    {id:"stage3-public-removal",status:"IMPLEMENT_IN_PR22",action:"Publish Stage 1/2 only; redirect legacy Stage 3+ URLs."},
    {id:"replace-cross-product-generator",status:"NEXT",action:"Stop generating model × trim Cartesian products as customer-identifiable vehicles. Build selector identity rows from discovered competitor/manufacturer taxonomy."}
  ],
  p1:[
    {id:"import-vtech-taxonomy",count:taxonomyRows.length,action:"Use V-Tech as discovery/taxonomy only; do not use PowerChip module gains as remap votes."},
    {id:"stage1-consensus",count:stage1Consensus.filter(x=>x.status==="SUPPORTED_RANGE").length,action:"Promote bounded multi-source Stage 1 ranges after identity checks."},
    {id:"single-source-review",count:stage1Consensus.filter(x=>x.status==="SINGLE_SOURCE_CONDITIONAL").length,action:"Add independent corroboration or keep customer output on request."},
    {id:"stage1-conflicts",count:stage1Consensus.filter(x=>x.status==="CONFLICT_REVIEW").length,action:"Split identity or withhold; never average incompatible variants."}
  ],
  p2:[
    {id:"stage2-hardware-review",count:stage2Analysis.length,action:"Stage 2 requires exact compatible source plus defined hardware/fuel/transmission scope. Ratios remain QA-only."},
    {id:"seo-publication",action:"Only publish SEO pages after identity + Stage 1 confidence gates. Full lookup taxonomy may be much larger than SEO page set."}
  ]
};

const taxonomyArtifact={createdAt:new Date().toISOString(),source:{provider:"V-Tech",url:vtech.url,retrievedAt:vtech.retrievedAt,contentSha256:vtech.contentSha256,role:"taxonomy-only"},counts:{rows:taxonomyRows.length,brands:new Set(taxonomyRows.map(x=>x.brand)).size,models:new Set(taxonomyRows.map(x=>`${x.brand}|${x.modelFamily}`)).size},rows:taxonomyRows};
const obsArtifact={createdAt:new Date().toISOString(),providers:Object.fromEntries([...new Set(stageObs.map(x=>x.provider))].sort().map(p=>[p,stageObs.filter(x=>x.provider===p).length])),count:stageObs.length,rows:stageObs};
const stage1Artifact={createdAt:new Date().toISOString(),policy:{minimumIndependentProviders:2,closePowerSpreadPct:6,closeTorqueSpreadPct:10,publicPointPolicy:"lower defensible bound, never competitor + arbitrary uplift",singleSource:"conditional",conflict:"withhold/split identity"},counts:gapAudit.stage1,groups:stage1Consensus.sort((a,b)=>a.configurationKey.localeCompare(b.configurationKey))};
const stage2Artifact={createdAt:new Date().toISOString(),policy:{numericPublicStage2:"requires compatible independent evidence and defined hardware/fuel/transmission scope",ratioUsage:"QA anomaly detection only, never value generation"},counts:gapAudit.stage2,groups:stage2Analysis.sort((a,b)=>a.configurationKey.localeCompare(b.configurationKey))};
const ratioArtifact={createdAt:new Date().toISOString(),policy:"QA ONLY — never derive a customer Stage 2 from these ratios.",count:stage2Ratios.length,groups:ratioGroups};

function writeCompactRows(file,value,arrayKey){
  const meta={...value};
  const rows=meta[arrayKey]??[];
  delete meta[arrayKey];
  const head=JSON.stringify(meta,null,2).slice(0,-2);
  const comma=Object.keys(meta).length?",\n":"";
  fs.writeFileSync(path.join(root,file),head+comma+`  "${arrayKey}": [\n`+
    rows.map(row=>"    "+JSON.stringify(row)).join(",\n")+"\n  ]\n}\n");
}
writeCompactRows("competitor-vehicle-taxonomy.json",taxonomyArtifact,"rows");
writeCompactRows("competitor-stage-observations.json",obsArtifact,"rows");
writeCompactRows("stage1-consensus-analysis.json",stage1Artifact,"groups");
writeCompactRows("stage2-hardware-analysis.json",stage2Artifact,"groups");
for(const [file,value] of [
  ["noordtune-output-gap-audit.json",gapAudit],
  ["vw-204hp-diagnostic.json",vw204],
  ["stage2-ratio-qa.json",ratioArtifact],
  ["global-rebuild-backlog.json",backlog]
]) fs.writeFileSync(path.join(root,file),JSON.stringify(value,null,2)+"\n");

const topBrands=[...taxonomyRows.reduce((m,r)=>m.set(r.brand,(m.get(r.brand)||0)+1),new Map())].sort((a,b)=>b[1]-a[1]).slice(0,15);
const md=`# Global Tuning Output Rebuild V2

Baseline: current production main before customer-safety PR22.

## What the scan established

- V-Tech public configurator taxonomy: **${taxonomyRows.length.toLocaleString("en-US")} exact discovered configuration URLs**, **${taxonomyArtifact.counts.brands} brands**, **${taxonomyArtifact.counts.models} make/model families**.
- Existing September competitor evidence: **${sources.length.toLocaleString("en-US")} source pages** and **${stageObs.length.toLocaleString("en-US")} Stage 1/2 observations**.
- Existing NoordTune source-backed tuning profiles: **${sourcedTuningProfiles.length.toLocaleString("en-US")}**.
- Current canonical selector/RDW rows: **${vehicleDatabase.length.toLocaleString("en-US")}**.
- Multi-source Stage 1 configuration groups: **${multiSourceStage1.length.toLocaleString("en-US")}**.
- Stage 1 groups currently suitable for a conservative bounded range under the V2 policy: **${gapAudit.stage1.supportedRange.toLocaleString("en-US")}**.
- Stage 1 single-source conditional groups: **${gapAudit.stage1.singleSource.toLocaleString("en-US")}**.
- Stage 1 conflict/review groups: **${gapAudit.stage1.conflicts.toLocaleString("en-US")}**.
- Stage 2 evidence groups: **${gapAudit.stage2.groups.toLocaleString("en-US")}**. These are not automatically publishable because hardware/fuel/transmission scope must be reviewed.
- Generated cross-product risk candidates without a matching V-Tech taxonomy row: **${generatedRisk.length.toLocaleString("en-US")}**. Absence is a risk signal, not proof of non-existence.

## Root cause of the 204 hp Volkswagen problem

The current generated catalog builds large make-level model × trim Cartesian products. A Volkswagen trim such as '2.0 BiTDI 204' can therefore be attached to models for which that configuration was never established.

The scan reproduces the problematic generated Golf 204 hp BiTDI row: **${fakeGolf ? `${fakeGolf.id}: Stage 1 ${fakeGolf.stage1} hp, Stage 2 ${fakeGolf.stage2} hp` : "not reproduced"}**.

V-Tech taxonomy independently shows that Volkswagen 204 hp spans materially different vehicles and engines, including T6/T6.1 2.0 TDI commercial vehicles, Touareg 3.0 TDI, Golf IV 2.8 V6 and Multivan T7 2.0 TSI. **204 hp cannot be a tuning identity key.**

## Stage 1 policy

1. Match exact compatible vehicle configuration first.
2. Keep each provider observation independently traceable.
3. Require at least two independent compatible providers for an automatic public range.
4. If compatible source spread is within 6% power and 10% torque, publish a conservative range; if a point is required, use the lower defensible bound.
5. Never use 'competitor + 4 hp'.
6. Single-source evidence stays conditional.
7. Material source conflict means split identity or withhold — never average incompatible variants.
8. Generic/canonical multiplier output is never customer-facing.

## Stage 2 policy

Stage 2 is retained as a product, but numeric publication is stricter than Stage 1.

A public Stage 2 number requires compatible vehicle identity **and** actual Stage 2 source evidence **and** sufficiently defined hardware/fuel/transmission scope. Otherwise it stays custom/on request.

The ratio analysis is kept only as QA to find outliers. It must never generate customer values.

## Database rebuild architecture

- **Discovery layer:** competitor/manufacturer taxonomy; V-Tech is useful here even when its product is an external PowerChip module.
- **Identity layer:** make/model/generation/year/engine/fuel/displacement/stock output/engine code where evidenced.
- **Technical layer:** ECU/TCU application evidence, never fitted-unit inference.
- **Observation layer:** raw provider Stage 1/2 facts.
- **Consensus layer:** NoordTune approved Stage 1/2 output + confidence.
- **Commercial layer:** NoordTune software/hardware/TCU price scope.
- **SEO publication layer:** only identities passing confidence gates.

The full lookup database should be broad; the SEO-public page set should remain curated.

## Largest taxonomy providers / makes

${topBrands.map(([brand,count])=>`- ${brand}: ${count}`).join("\n")}

## Immediate order

1. Release PR22 customer-safety guard and public Stage 3 removal after owner approval.
2. Replace model × trim cross-product generation with real discovered vehicle configurations.
3. Import the V-Tech taxonomy as discovery-only rows.
4. Attach existing Unlimited / ATM / Shiftech / Mosselman evidence to exact identities.
5. Promote multi-source conservative Stage 1 ranges.
6. Research Stage 2 hardware scope family by family.
7. Expand public SEO pages only after data gates pass.

No production data, pricing or SEO page expansion is changed by this research branch.
`;
fs.writeFileSync(path.join(root,"GLOBAL_TUNING_OUTPUT_REBUILD_V2.md"),md+"\n");

console.log(JSON.stringify({
  taxonomyRows:taxonomyRows.length,
  taxonomyBrands:taxonomyArtifact.counts.brands,
  taxonomyModels:taxonomyArtifact.counts.models,
  sourcePages:sources.length,
  stageObservations:stageObs.length,
  stage1:gapAudit.stage1,
  stage2:gapAudit.stage2,
  generatedRiskCandidates:generatedRisk.length,
  vw204Taxonomy:vw204Taxonomy.length,
  fakeGolf,
  files:9
},null,2));

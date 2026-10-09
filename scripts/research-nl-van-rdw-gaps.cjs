/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Deterministic, privacy-safe aggregate of unresolved NL utility-van RDW rows.
 * Historical selected cohort only: not a measure of Dutch fleet prevalence.
 * Never output a plate, VIN, raw vehicle, group ID or precise admission date.
 */
const assert=require("node:assert/strict");
const sample=require("../data/research/nl-top-groups-output-sample.json");
const {normalizeRdwVehicle}=require("../src/lib/rdw.ts");
const models=/\b(PROACE|SPRINTER|VITO|BOXER|EXPERT|TRANSPORTER|TRANSIT|DUCATO|VIVARO|CRAFTER|MASTER|TRAFIC|JUMPY|JUMPER|PARTNER|BERLINGO|CADDY|KANGOO|DOBLO|TALENTO|MOVANO|DAILY|INTERSTAR)\b/i;
const goodNumber=(v)=>typeof v==="number"&&Number.isFinite(v)&&v>0;
const hasNumbers=(s)=>Boolean(s&&(goodNumber(s.powerHp)||Array.isArray(s.powerRangeHp)&&s.powerRangeHp.length===2&&s.powerRangeHp.every(goodNumber)));
const sourced=(profile)=>{
 const stage=profile?.stages?.find(s=>s.name==="Stage 1");
 if(!hasNumbers(stage)||stage.provenance==="generic-indicative"||stage.provenance==="canonical-estimated"||stage.sourceConfidence==="canonical-existing"||profile.coverageClass==="D")return false;
 return Boolean(profile.sourceReferences?.some(s=>s.url?.startsWith("https://")&&s.sourceType!=="heuristic")&&
 (stage.evidenceSourceIds?.length||stage.provenance==="reference"||profile.provenance==="sourced-profile"));
};
const groups=new Map(); let selected=0,linked=0;
for(const row of sample.rows){
 const v=row.vehicle,fs=row.fuels||[];
 if(!models.test(v.handelsbenaming||""))continue;
 selected++;
 const resolved=normalizeRdwVehicle(v,fs,"QA0000");
 const covered=sourced(resolved.tuningEstimate.profile);
 if(covered)linked++;
 const engine=resolved.vehicle.engine,reg=resolved.vehicle.registration;
 const year=reg.firstAdmissionYear||null;
 const fuel=fs.length===1?fs[0].brandstof_omschrijving:"unknown/mixed";
 const identity=[v.merk,v.handelsbenaming,v.type||null,engine.displacementCc||null,engine.cylinders||null,engine.powerKw||null,fuel,year];
 const key=JSON.stringify(identity);
 const group=groups.get(key)||{identity,count:0,sourceLinked:0};
 group.count++; if(covered)group.sourceLinked++;
 groups.set(key,group);
}
assert.equal(sample.rows.length,3000,"Frozen cohort changed");
assert.equal([...groups.values()].reduce((n,g)=>n+g.count,0),selected);
const uncovered=[...groups.values()].map(g=>({
 make:g.identity[0],model:g.identity[1],type:g.identity[2],cc:g.identity[3],
 cylinders:g.identity[4],kw:g.identity[5],fuel:g.identity[6],year:g.identity[7],
 n:g.count,sourceLinked:g.sourceLinked,missing:g.count-g.sourceLinked
})).filter(g=>g.missing>0).sort((a,b)=>b.missing-a.missing||String(a.make).localeCompare(String(b.make))||String(a.model).localeCompare(String(b.model)));
const result={sampleSize:3000,method:"purpose-selected nonrandom historical RDW rows; NOT Dutch-fleet prevalence",
 vansInSelectedSample:selected,sourceLinked:linked,uncovered:selected-linked,
 distinctTechnicalCohorts:groups.size,uncoveredTechnicalCohorts:uncovered.length,
 topUncovered:uncovered.slice(0,100)};
const showJson=process.argv.includes("--json");
if(showJson)console.log(JSON.stringify(result,null,2));
else {
 console.log("RDW_VAN_GAP_SUMMARY",JSON.stringify({...result,topUncovered:undefined}));
 for(const r of result.topUncovered)console.log("RDW_VAN_UNCOVERED",JSON.stringify(r));
}

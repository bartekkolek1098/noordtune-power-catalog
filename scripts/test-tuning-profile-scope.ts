import assert from "node:assert/strict";
import {compatibleGeneration,effectiveGenerationScope,flagNonMonotonicStages,type GenerationBoundary} from "./tuning-profile-scope.ts";
import type {ProfileStage,ResearchIdentity} from "../src/data/tuning-profiles/schema.ts";
const identity:ResearchIdentity={brand:"BMW",modelFamily:"1 Series",generation:"F20/F21",yearFrom:2010,yearTo:2015,fuel:"Diesel",engineMarketingName:"116d",displacementCc:2000,displacementPrecision:"nominal",stockPowerHp:116,powerUnit:"PS"};
const boundary=(generation:string,yearFrom:number,yearTo:number):GenerationBoundary=>({brand:"BMW",modelFamily:"1-serie",generation,yearFrom,yearTo,sourceUrl:"https://example.com/observed-successor",retrievedAt:"2026-09-15T00:00:00Z"});
const boundaries=[boundary("2007 - E81-E87-LCI",2007,2010),boundary("2011 - F20",2011,2014),boundary("2015 - F20-LCI - F52",2015,2018)];
const scoped=effectiveGenerationScope([identity],boundaries);
assert.equal(scoped.yearFrom,2011);assert.equal(scoped.yearTo,2014);assert.equal(scoped.boundary?.generation,"2011 - F20");assert.equal(scoped.adjusted,true);
assert.equal(identity.yearFrom,2010);assert.equal(identity.yearTo,2015);
assert.equal(compatibleGeneration("F20/F21","E81-E87-LCI",2010,2007),false);
assert.equal(compatibleGeneration("F20/F21","F20-LCI - F52",2010,2015),false);
assert.equal(compatibleGeneration("F30/F31 LCI","F30-F31-F35-LCI",2015,2015),true);
assert.equal(compatibleGeneration("IV","IV (II)",2012,2016),false);
for(const [generation,modelFamily,rawFrom,expectedFrom,bounds] of [
  ["F10/F11","5 Series",2009,2010,[{...boundary("2003 - E60",2003,2009),modelFamily:"5-serie"},{...boundary("2010 - F10-F11",2010,2015),modelFamily:"5-serie"}]],
  ["G30/G31","5 Series",2015,2016,[{...boundary("2010 - F10-F11",2010,2015),modelFamily:"5-serie"},{...boundary("2016 - G30-G31",2016,2019),modelFamily:"5-serie"}]]
] as const){const result=effectiveGenerationScope([{...identity,generation,modelFamily,yearFrom:rawFrom,yearTo:2020}],bounds);assert.equal(result.yearFrom,expectedFrom);assert.ok(result.yearTo!>result.yearFrom);}
const stage=(hp:number,nm:number):ProfileStage=>({selectedPowerHp:hp,selectedTorqueNm:nm,sourceValues:[],confidence:"single-source",sourceAgreement:"acceptable",ownerReviewRequired:true,conditions:[]});
const one=stage(130,300),two=stage(140,280);
assert.equal(flagNonMonotonicStages([one,two]),true);assert.equal(two.selectedTorqueNm,280);assert.equal(two.sourceAgreement,"conflict");assert.ok(two.conditions.includes("NON_MONOTONIC_SOURCED_STAGE"));
assert.equal(flagNonMonotonicStages([stage(130,300),stage(140,330)]),false);
console.log("Profile scope: generation-safe intersection and unmodified non-monotonic sourced-stage regressions passed.");

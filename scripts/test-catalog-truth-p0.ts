import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {engineCatalog, getVehicleBySeoSlugs, getVehicleSeoSlugs, getVehicleSelectorItems, vehicleDatabaseCount} from "../src/data/catalog.ts";
import {assessCatalogMatch} from "../src/data/catalog-matching.ts";
import {getCatalogEstimateProfile, getCatalogEstimateProfileForRegistration} from "../src/data/tuning-estimates-shared.ts";
import {resolveTuningEstimate} from "../src/data/tuning-estimates.ts";
import {resolveRdwTuningEstimate} from "../src/lib/rdw-tuning-estimate.ts";
import {resolveStageQuote, formatQuote, addQuoteOptions, assessVehicleAccess, getPublicServicePrice} from "../src/data/pricing.ts";
import {formatEstimatePower, formatEstimateTorque} from "../src/lib/estimate-copy.ts";
import {createVehicleQuoteMessage, whatsappHref} from "../src/lib/whatsapp.ts";
import {customerVehicle} from "../src/lib/customer-profile.ts";
import {customerStageNotes} from "../src/lib/stage-presentation.ts";
import {publicCatalogTruthReviews} from "../src/data/public-catalog-truth.ts";
import {technicalFamilyLabel} from "../src/lib/technical-identity-copy.ts";
import {estimateChartData} from "../src/lib/estimate-chart.ts";
import {resolveDetailsAction} from "../src/lib/details-action.ts";
import {quoteOfferFields} from "../src/lib/quote-offer.ts";
import type {EngineVariant} from "../src/data/catalog-shared.ts";

type Fixture = {id: string; action: string; slugs: {brand: string; model: string; engine: string};
  stockHp: number; stockNm: number | null; years: [number, number]; generation: string;
  capacity: number; wrongGeneration: string; stage1: [[number, number], [number, number]] | null; stage1Cents: number | null;
  stage2Action: "SUPPORTED_POINT" | "CUSTOM_ON_REQUEST" | "WITHHOLD_UNTIL_IDENTIFIED";
  stage2: [number, number] | null; stage2Cents: number | null; stage2Hardware: NonNullable<EngineVariant["stages"][number]["customerScope"]>["hardware"]};
const fixtures: Fixture[] = JSON.parse(readFileSync(new URL("./fixtures/catalog-truth-p0.json", import.meta.url), "utf8"));
const protectedHashes: Record<string, string> = {
  "audi-a3-20-tdi": "f49381dafcc9b78164b8ff0d9438165f8840b6f24c74f74e5378ead061c1bc6a",
  "bmw-1-series-f20-f21-118i": "ffac0d2f3688d25cfb7c618b71f97e5c4c028ee966480846997c816face59d5f",
  "bmw-1-series-f20-f21-120d": "a01de45990708363320e19f6d9edbde23052afbb85fdaf1a6555e8fc87c82371",
  "bmw-3-series-f30-f31-318d": "30a7e331cf716f2beebef070c5523a235d4b5cc76f36cfffb769095bbc15a4a1",
  "bmw-3-series-f30-f31-330d": "cb3d449f2d603f019b8adffee63aeadf13434ba0805fab1d3b409b9ce5e7e75c",
  "bmw-5-series-f10-f11-520d": "e36ae678093352c2f5d89511e960481791f9e7f401fae8b9b5c5506fd06ca4b2",
  "volkswagen-golf-7-16-tdi": "90352637a2891dbb5acdfbe480f7bc8c82105add3a6e5333b554de6337907a0c",
  "volkswagen-golf-7-20-tdi": "04257fb1d25d8326a7b4ce3d67dce45482f5e58f83194f1b049497ea6f939437",
  "audi-a3-8v-16-tdi": "3e31b03505f47831ba536aea440251f2557a4c8ac29f126173f6363d75d09b44",
  "audi-a4-b9-20-tfsi": "ec9d71893994ec67a950985a090693090caa43cb9e6d0f5940c0a4c7bb1e5e54",
  "audi-a6-c7-30-tdi-272": "92bceb5bd2cfcf848760ab8fb2a89c85f1db4fb47c4ebb969d9ac21931d522aa",
  "skoda-octavia-5e-20-tdi-150": "b1d2304d6669c4043f122157fe294aa48162cd11b53c9adf0f4fca0d4f89ba85"
};
assert.equal(fixtures.length, 12);
assert.equal(new Set(fixtures.map(f => f.id)).size, 12);
assert.equal(engineCatalog.length, 24);
assert.equal(vehicleDatabaseCount, 58586);
assert.equal(3 + engineCatalog.length * 3 + engineCatalog.reduce((n, v) => n + v.stages.length * 3, 0), 291);
for (const v of engineCatalog.filter(v => !fixtures.some(f => f.id === v.id))) {
  assert.equal(createHash("sha256").update(JSON.stringify(v)).digest("hex"), protectedHashes[v.id], `${v.id}: unrelated public profile stays byte-equivalent as JSON`);
}
let checks = 0;
function equal(a: unknown, b: unknown, label: string) { assert.deepEqual(a, b, label); checks++; }
for (const f of fixtures) {
  const v = engineCatalog.find(v => v.id === f.id)!;
  equal(v.stockPowerHp, f.stockHp, f.id + " stock power");
  equal(v.stockTorqueNm ?? null, f.stockNm, f.id + " stock torque");
  equal(v.generation, f.generation, f.id + " generation");
  equal([v.years[0], v.years.at(-1)], f.years, f.id + " period");
  equal(getVehicleSeoSlugs(v), f.slugs, f.id + " existing URL");
  equal(getVehicleBySeoSlugs(f.slugs.brand, f.slugs.model, f.slugs.engine)?.id, f.id, f.id + " route resolves");
  equal(v.stages.map(s => s.name), ["Stage 1","Stage 2","Stage 3+"], f.id + " selectable stages");
  assert.notEqual(v.ecuSupport?.status, "verified");
  assert.notEqual(v.tcuSupport?.status, "verified");
  equal(v.tcuSupport?.variants, undefined, f.id + " no installed TCU inferred");
  const baseModel = v.model.replace(/\b(?:[efg]\d{2,3}|b[5-9]|5f|kl)\b/gi, "").replace(/\//g, " ").replace(/Golf\s7/gi, "Golf").replace(/XC60\sI\b/gi, "XC60");
  const input = {make: v.brand, model: baseModel + " " + v.generation, fuel: v.fuel,
    displacementCc: f.capacity, powerHp: f.stockHp, firstRegistrationYear: f.stage2 ? 2016 : Math.floor((f.years[0]+f.years[1])/2)};
  const candidate = {variant: v, applicability: "reviewed" as const};
  const good = assessCatalogMatch(input, [candidate]);
  assert.ok(good.candidates.some(c => c.id === f.id), f.id + " compatible synthetic identity");
  for (const bad of [{...input, model: baseModel + " " + f.wrongGeneration}, {...input, powerHp: f.stockHp + 40}]) {
    equal(assessCatalogMatch(bad, [candidate]).candidates.length, 0, f.id + " reject known identity conflict");
    equal(resolveTuningEstimate(bad, [v]).profile, undefined, f.id + " no output for conflicting profile");
  }
  const profile = getCatalogEstimateProfile(v);
  const runtime = resolveRdwTuningEstimate(input, {publicVehicles: [v]}).profile!;
  equal(runtime.vehicleId, f.id, f.id + " RDW uses corrected public profile");
  equal(runtime.stages.map(s => [s.name,s.powerHp,s.torqueNm,s.powerRangeHp,s.torqueRangeNm,s.customHardware,s.quoteRequired]),
    profile.stages.map(s => [s.name,s.powerHp,s.torqueNm,s.powerRangeHp,s.torqueRangeNm,s.customHardware,s.quoteRequired]), f.id + " no historical fallback restores precision");
  equal(runtime.stockTorqueNm, v.stockTorqueNm, f.id + " RDW stock torque");
  equal(runtime.ecuSupport, profile.ecuSupport, f.id + " controller uncertainty survives RDW");
  equal(v.stages[0].powerRangeHp ?? null, f.stage1?.[0] ?? null, f.id + " Stage 1 power");
  equal(v.stages[0].torqueRangeNm ?? null, f.stage1?.[1] ?? null, f.id + " Stage 1 torque");
  equal([v.stages[1].powerHp ?? null, v.stages[1].torqueNm ?? null], f.stage2 ?? [null,null], f.id + " independent Stage 2 point");
  equal(v.stages[1].customHardware, f.stage2Action === "CUSTOM_ON_REQUEST", f.id + " custom is separate from identity withholding");
  equal(v.stages[1].customerScope?.hardware, f.stage2Hardware, f.id + " explicit hardware scope");
  const review = publicCatalogTruthReviews.find(row => row.id === f.id)!;
  equal(Object.keys(review.stages), ["Stage 1","Stage 2","Stage 3+"], f.id + " all stage decisions explicit");
  for (const s of v.stages) {
    equal([s.powerHp,s.torqueNm], s.name === "Stage 2" && f.stage2 ? f.stage2 : [undefined,undefined], f.id + " no stale point output");
    const q = resolveStageQuote(v,s);
    equal(s.quote, q, f.id + " stored quote");
    equal(resolveStageQuote(profile,profile.stages.find(p=>p.name===s.name)),q,f.id + " DTO quote");
    const expectedCents = s.name === "Stage 1" ? f.stage1Cents : s.name === "Stage 2" ? f.stage2Cents : null;
    equal(q.kind === "from" ? q.amountCents : null, expectedCents, f.id + " scoped amount");
    equal(Object.hasOwn(quoteOfferFields(q,"en"),"price"), expectedCents !== null, f.id + " structured offer");
    if (s.name !== "Stage 1") {
      equal(s.customHardware, s.name === "Stage 3+" || f.stage2Action === "CUSTOM_ON_REQUEST", f.id + " per-stage hardware decision");
      if (expectedCents === null) equal(addQuoteOptions(q,24900), q, f.id + " options cannot create a priced package");
      equal([s.powerRangeHp,s.torqueRangeNm],[undefined,undefined],f.id+" later Stage ranges withheld");
    }
    for (const locale of ["nl","en","pl"] as const) {
      const message = createVehicleQuoteMessage({locale,vehicle:"Synthetic vehicle fixture",stage:s.name,options:[],quote:q,indicativeOutput:s});
      assert.ok(message.includes(formatEstimatePower(s,locale)), f.id+" displayed power agrees with WhatsApp");
      if (!s.customHardware && (s.torqueRangeNm || s.torqueNm)) assert.ok(message.includes(formatEstimateTorque(s,locale)));
      if (q.kind === "from") assert.ok(message.includes(formatQuote(q,locale)));
      else assert.doesNotMatch(message, /€\s*(269|299|449|549|699|700|849|999)/);
      equal(new URL(whatsappHref({locale,message})).searchParams.get("text"),message,f.id+" message roundtrip");
      const label = technicalFamilyLabel(v.ecuSupport,v.ecuType,locale);
      assert.ok(label.length > 0);
      assert.doesNotMatch(label, /verified|geverifieerd|potwierdzony/);
      if (s.customerNote) {
        const notes = customerStageNotes(profile.stages.find(stage => stage.name === s.name)!,locale,profile);
        assert.ok(notes.includes(s.customerNote[locale]), f.id + " stage-specific customer explanation reaches quote notes");
        assert.doesNotMatch(notes.join(" "), /\b(?:decat|DPF off|EGR off|GPF delete|source-voting|CUSTOM_ON_REQUEST|WITHHOLD_UNTIL_IDENTIFIED)\b/i);
      }
    }
  }
  const selector = getVehicleSelectorItems({brand:v.brand,model:v.model,year:input.firstRegistrationYear}).find(s=>s.id===v.id);
  equal(selector?.quote, v.stages[0].quote, f.id+" selector quote");
  const safe = customerVehicle(v);
  equal(resolveDetailsAction(getCatalogEstimateProfile(safe),engineCatalog).kind,"vehicle-page",f.id+" corrected details route");
  assert.doesNotMatch(JSON.stringify(safe.outputReferences), /factory-|shiftech-|SOURCE_|source-voting/);
  const chart = estimateChartData(profile.stages,v.stockPowerHp,v.stockTorqueNm);
  equal(chart.slice(2).map(p=>[p.pk,p.nm]),[f.stage2 ?? [null,null],[null,null]],f.id+" chart plots only supported Stage 2 and leaves gaps");
  if (!f.stage1) equal([chart[1].pk,chart[1].nm],[null,null],f.id+" withheld Stage 1 not plotted");
  if (f.stockNm === null) equal(chart[0].nm,null,f.id+" unknown stock torque not plotted as zero");
  // Controller identity and access cannot become verified from a registration-year change.
  for (const year of f.years) {
    const changed = {...v, years:[year],yearRange:String(year)} as EngineVariant;
    equal(changed.ecuSupport,v.ecuSupport,f.id+" year does not decode ECU");
    assert.ok(!assessVehicleAccess(changed).status.startsWith("confirmed-"));
  }
}
const xc60 = engineCatalog.find(vehicle => vehicle.id === "volvo-xc60-d5")!;
equal([xc60.stages[0].quoteRequired,xc60.stages[1].quoteRequired], [true,false], "Stage 1 withholding cannot withhold independently supported Stage 2");
for (const year of [2014,2015,undefined]) {
  const adapted = getCatalogEstimateProfileForRegistration(xc60,year);
  equal([adapted.stages[1].powerHp,adapted.stages[1].torqueNm],[undefined,undefined],"Stage 2 narrower reference year cannot be bypassed");
  equal(resolveStageQuote(adapted,adapted.stages[1]).kind,"on-request","outside/unknown year quote has no software price");
  equal(adapted.stages[1].customerScope?.hardware,[],"outside/unknown year cannot prescribe the reference hardware");
  if (year !== undefined) {
    const injected = {...getCatalogEstimateProfile(xc60),id:"historical-xc60",stages:xc60.stages.map(stage=>({...stage,powerHp:999,torqueNm:999,quoteRequired:false,customHardware:false}))};
    const result = resolveRdwTuningEstimate({make:"Volvo",model:"XC60 I D5",fuel:"Diesel",powerHp:220,displacementCc:2400,firstRegistrationYear:year},
      {publicVehicles:[xc60],references:[injected],sourcedProfiles:[],canonicalVehicles:[]}).profile!;
    equal([result.stages[1].powerHp,result.stages[1].torqueNm,result.stages[1].quoteRequired],[undefined,undefined,true],"historical fallback cannot restore year-withheld Stage 2");
  }
}
equal(fixtures.filter(f=>f.stage2).length,1,"one supported Stage 2 reference");
equal(fixtures.filter(f=>f.stage2Action==="CUSTOM_ON_REQUEST").length,6,"six separately reviewed custom scopes");
equal(fixtures.filter(f=>f.stage2Action==="WITHHOLD_UNTIL_IDENTIFIED").length,5,"five unresolved identity scopes");
for (const [id, year] of [["bmw-320d-b47",2022],["vw-golf-20-tsi-ea888",2020],["volkswagen-golf-7-r-20-tsi",2018]] as const) {
  const v=engineCatalog.find(v=>v.id===id)!;
  equal(getVehicleSelectorItems({brand:v.brand,model:v.model,year}).some(s=>s.id===id),false,id+" outside-period selector cannot claim corrected URL");
}
equal(getPublicServicePrice({price:239,pricingTier:"tcu-standard"}),249,"TCU conditional from-price unchanged");
console.log(`P0 truth matrix: ${checks} assertions across 12 public profiles, 3 Stages, NL/EN/PL; 12 other profiles protected; 291 routes preserved.`);

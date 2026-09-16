// Server-only identity matching: the source database never enters client imports.
import {createHash} from "node:crypto";
import {normalizeCatalogFuel, registeredPowerToMetricHp, nominalDisplacementMatches} from "../data/catalog-matching.ts";
import type {EstimateMatchInput} from "../data/tuning-estimates.ts";
import type {SourcedTuningProfile} from "../data/tuning-profiles/schema.ts";

export const normalizeSourceIdentity = (text?: string) => (text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
export function sourceMake(text?: string) {
  const value = normalizeSourceIdentity(text);
  return ({vw: "volkswagen", mercedes: "mercedes benz", alfa: "alfa romeo"} as Record<string, string>)[value] ?? value;
}
export function sourceModelFamily(make: string, text: string) {
  let value = normalizeSourceIdentity(text);
  // RDW sometimes repeats the registered make in handelsbenaming (TOYOTA AYGO,
  // PEUGEOT 308). Only an exact, separate make prefix is removed.
  const prefixes = [...new Set([make, make === "mercedes benz" ? "mercedes" : make])];
  for (const prefix of prefixes) if (value.startsWith(`${prefix} `)) { value = value.slice(prefix.length + 1); break; }
  if (make === "mazda") value = value.replace(/^mazda(?=[236](?:\s|$))/, "");
  if (make === "honda") value = value.replace(/^cr\s*v\b/, "cr v");
  if (make === "bmw") {
    const suv = value.match(/\b(x[1-7]|z[1-4])\b/)?.[1];
    const series = value.match(/\b([1-8])\s*(?:series|serie|er)\b/)?.[1] ?? value.match(/\b(?:m)?([1-8])\d{2}(?:ti|[ide])\b/)?.[1];
    return suv ?? (series ? `${series} series` : value);
  }
  if (make === "mercedes benz") return value.replace(/^([abces])\s*(?:class|klasse)\b/, "$1").replace(/^([abces])\s*\d{2,3}\b.*$/, "$1");
  return value;
}
const modelFamily = sourceModelFamily;
function badge(text: string, make: string) {
  const value = normalizeSourceIdentity(text);
  return make === "bmw" ? value.match(/\b(m?\d{3}(?:ti|[ide]))\b/)?.[1]
    : make === "mercedes benz" ? value.match(/\b(?:[abces]\s*)?(\d{2,3})\s*(?:cdi|d|amg)?\b/)?.[1]
    : value.match(/\b(gti|gtd|cupra|st|rs|type r)\b/)?.[1];
}
type GenerationIdentity = {body: string[]; phase: string[]};
function generations(text: string, make: string, model: string): GenerationIdentity {
  // Decimal engine sizes ("Golf 1.4 TSI") are not numeric generations.
  const normalized=normalizeSourceIdentity(text.replace(/\b\d+[.,]\d+\b/g, " "));
  const family=normalizeSourceIdentity(model);
  const roman:Record<string,string>={i:"1",ii:"2",iii:"3",iv:"4",v:"5",vi:"6",vii:"7",viii:"8",ix:"9",x:"10"};
  const bodyOnly = (body: string[]): GenerationIdentity => ({body, phase: []});
  // Only explicit, separate body-generation tokens are compared. Substrings of
  // opaque RDW type/variant/execution identifiers are never decoded.
  if(make==="ford") {
    return bodyOnly([...normalized.matchAll(/\bmk\s*(\d{1,2}|[ivx]+)\b/g)].map(match=>"mk"+(roman[match[1]]??match[1])));
  }
  if(make==="kia") {
    const expression=/\bsportage\b/.test(family)?/\b(?:je|km|sl|ql|nq5)\b/g
      : /\bsorento\b/.test(family)?/\b(?:bl|xm|um|mq4)\b/g
      : /\bceed\b/.test(family)?/\b(?:ed|jd|cd)\b/g:undefined;
    return bodyOnly(expression?normalized.match(expression)??[]:[]);
  }
  if(make==="hyundai") {
    const expression=/\btucson\b/.test(family)?/\b(?:jm|lm|tl|nx4)\b/g
      : /\bi30\b/.test(family)?/\b(?:fd|gd|pd)\b/g:undefined;
    return bodyOnly(expression?normalized.match(expression)??[]:[]);
  }
  // VAG source labels distinguish the body (Golf VII, Leon 5F) from a
  // within-body phase (MKI/MKII). A shared body cannot erase a phase conflict,
  // and a shared phase cannot make different bodies compatible.
  const phase = (withMk: boolean) => {
    const values = [...normalized.matchAll(/\bphase\s*([12]|i{1,2})\b/g)]
      .map(match => roman[match[1]] ?? match[1]);
    if (withMk) values.push(...[...normalized.matchAll(/\bmk\s*([12]|i{1,2})\b/g)]
      .map(match => roman[match[1]] ?? match[1]));
    if (/\bpre\s*(?:facelift|fl)\b/.test(normalized)) values.push("1");
    else if (/\b(?:facelift|fl)\b/.test(normalized)) values.push("2");
    return [...new Set(values)];
  };
  if (make === "volkswagen" && /\bgolf\b/.test(family)) {
    const withoutMk = normalized.replace(/\bmk\s*(\d{1,2}|[ivx]+)\b/g, " ");
    const body = [...withoutMk.matchAll(/\b(?:golf\s+([1-8])|([ivx]+))\b/g)]
      .flatMap(match => { const number = match[1] ?? roman[match[2]]; return number ? ["golf" + number] : []; });
    const explicitBody = body.length > 0;
    if (!explicitBody) body.push(...[...normalized.matchAll(/\bmk\s*([1-8]|[ivx]+)\b/g)]
      .flatMap(match => { const number = roman[match[1]] ?? match[1]; return number ? ["golf" + number] : []; }));
    return {body: [...new Set(body)], phase: phase(explicitBody)};
  }
  if (make === "seat" && /\bleon\b/.test(family)) {
    const body = normalized.match(/\b(?:1m|1p|5f|kl)\b/g) ?? [];
    return {body, phase: phase(body.length > 0)};
  }
  if (make === "skoda" && /\boctavia\b/.test(family)) {
    const body = normalized.match(/\b(?:1u|1z|5e|nx)\b/g) ?? [];
    return {body, phase: phase(body.length > 0)};
  }
  if (make === "volkswagen" && /\bpassat\b/.test(family)) {
    return {body: normalized.match(/\bb[5-9]\b/g) ?? [], phase: phase(false)};
  }
  if (make === "volkswagen" && /\b(?:transporter|multivan|caravelle)\b/.test(family)) {
    return {body: normalized.match(/\bt[4-7]\b/g) ?? [], phase: phase(false)};
  }
  if (make === "audi") {
    const expression = /\ba3\b/.test(family) ? /\b8[lpvy]\b/g
      : /\ba4\b/.test(family) ? /\bb[5-9]\b/g
      : /\ba6\b/.test(family) ? /\bc[4-8]\b/g : undefined;
    return {body: expression ? normalized.match(expression) ?? [] : [], phase: phase(false)};
  }
  return bodyOnly(normalized.match(/\b(?:[efg]\d{2,3}|[wcra]\d{3}|mk\s?\d|8[plvy]|b[5-9])\b/g) ?? []);
}
function explicitFamily(input: EstimateMatchInput) {
  if (input.engineGenerationEvidence?.sourceReference.trim()) return input.engineGenerationEvidence.family === "ecoblue" ? "ecoblue" : "tdci";
  const text = normalizeSourceIdentity([input.model, input.type, input.variant, input.execution].join(" "));
  if (/\becoblue\b/.test(text)) return "ecoblue";
  return text.match(/\b(?:ecoblue|tdci|[bmn][134567][0478])\b/)?.[0];
}
export function sourceRegistrationYear(input: EstimateMatchInput) {
  if (Number.isInteger(input.firstRegistrationYear) && input.firstRegistrationYear! > 1885) return input.firstRegistrationYear!;
  const date = input.firstRegistrationDate;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? parsed.getUTCFullYear() : undefined;
}
type SourceIndex={length:number;byMake:Map<string,SourcedTuningProfile[]>;byPower:Map<string,{profile:SourcedTuningProfile;position:number}[]>};
const sourceIndexes=new WeakMap<readonly SourcedTuningProfile[],SourceIndex>();
function sourceIndex(profiles:readonly SourcedTuningProfile[]){
  const existing=sourceIndexes.get(profiles);
  if(existing?.length===profiles.length)return existing;
  const index:SourceIndex={length:profiles.length,byMake:new Map(),byPower:new Map()};
  profiles.forEach((profile,position)=>{
    const make=sourceMake(profile.brand),key=[make,profile.fuel,Math.floor(profile.stockPowerHp)].join("|");
    const family=index.byMake.get(make)??[];family.push(profile);index.byMake.set(make,family);
    const bucket=index.byPower.get(key)??[];bucket.push({profile,position});index.byPower.set(key,bucket);
  });
  sourceIndexes.set(profiles,index);return index;
}
/** Profiles are immutable snapshots. indexed:false is the exhaustive QA control. */
export function matchSourcedProfile(input: EstimateMatchInput, profiles: readonly SourcedTuningProfile[], options:{indexed?:boolean}={}) {
  const make = sourceMake(input.make);
  const fuel = normalizeCatalogFuel(input.fuel);
  const power = registeredPowerToMetricHp(input);
  const year = sourceRegistrationYear(input);
  if (!make || !input.model?.trim() || !power || !year || !input.displacementCc || !["Petrol", "Diesel"].includes(fuel ?? "")) return {reasonCodes: ["SOURCED_IDENTITY_INCOMPLETE"], candidates: []};
  const index=options.indexed===false?undefined:sourceIndex(profiles);
  const buckets=index?Array.from({length:Math.floor(power+3)-Math.floor(power-3)+1},(_,i)=>Math.floor(power-3)+i)
    .flatMap(value=>index.byPower.get([make,fuel,value].join("|"))??[]).sort((a,b)=>a.position-b.position).map(item=>item.profile):profiles;
  // Keep all same-make model siblings, even if their power/fuel/year differs.
  // Narrowing this guard to the power bucket would let Transit borrow Custom.
  const siblings=index?.byMake.get(make)??profiles;
  const model = modelFamily(make, input.model);
  const inputBadge = badge(input.model, make);
  const inputGenerations = generations([input.model, input.type, input.variant, input.execution].join(" "),make,input.model);
  const family = explicitFamily(input);
  const compatible = buckets.filter(profile => {
    if (sourceMake(profile.brand) !== make || profile.fuel !== fuel || Math.abs(profile.stockPowerHp - power) > 3) return false;
    if (profile.electrification === "hybrid" || profile.electrification === "mild-hybrid") return false;
    if (profile.displacementPrecision === "exact" ? Math.abs(profile.displacementCc - input.displacementCc!) > 2 : !nominalDisplacementMatches(input.displacementCc!, profile.displacementCc)) return false;
    if (input.cylinders && profile.cylinders && input.cylinders !== profile.cylinders) return false;
    if (year < profile.yearFrom || year > (profile.yearTo ?? Number(profile.retrievedAt.slice(0, 4)))) return false;
    if (profile.conditions.includes("SOURCE_GENERATION_YEAR_CONFLICT") && (year < 2018 || !input.engineGenerationEvidence?.sourceReference.trim())) return false;
    if (make === "ford" && profile.modelFamily === "Transit Connect" && Math.abs(profile.displacementCc - 1500) <= 49 && !family) return false;
    const models = [profile.modelFamily, ...(profile.aliases ?? [])].map(value => modelFamily(make, value));
    // The most specific published family owns the identity. Prefix matching only
    // permits engine/badge suffixes, never a sibling model such as Connect/Custom.
    const matches = models.some(value => model === value || model.startsWith(`${value} `));
    if (!matches) return false;
    const moreSpecificSibling = siblings.some(other => sourceMake(other.brand) === make && other.modelFamily !== profile.modelFamily
      && modelFamily(make, other.modelFamily).length > modelFamily(make, profile.modelFamily).length
      && (model === modelFamily(make, other.modelFamily) || model.startsWith(`${modelFamily(make, other.modelFamily)} `)));
    if (moreSpecificSibling) return false;
    // Ford family names remain strict even when no sibling was researched.
    if (make === "ford" && /^(transit|tourneo)\b/.test(model)) {
      const van = model.match(/^(transit|tourneo)(?: (connect|custom|courier))?/)?.[0];
      if (!models.includes(van ?? "")) return false;
    }
    if(make==="toyota"&&/^pro\s?ace\b/.test(model)){
      const van=model.match(/^pro\s?ace(?: city)?/)?.[0]?.replace(/^pro ace/,"proace");
      if(!models.some(value=>value.replace(/^pro ace/,"proace")===van))return false;
    }
    const profileBadge = badge(`${profile.modelFamily} ${profile.engineMarketingName}`, make);
    if (inputBadge && profileBadge && inputBadge !== profileBadge) return false;
    const knownFamily = normalizeSourceIdentity(profile.engineFamily ?? profile.engineMarketingName).match(/\b(?:ecoblue|tdci|[bmn][134567][0478])\b/)?.[0];
    if (family && knownFamily && family !== knownFamily) return false;
    const profileGenerations = generations(profile.generation,make,profile.modelFamily);
    for (const dimension of ["body", "phase"] as const) {
      if (inputGenerations[dimension].length && profileGenerations[dimension].length
        && !inputGenerations[dimension].some(value => profileGenerations[dimension].includes(value))) return false;
    }
    return true;
  });
  // An exact whole-PS factory output distinguishes e.g. Golf 122 from 125.
  // Keep the tolerance for kW conversion, but do not turn its edge into a tie.
  const exactStock = compatible.filter(profile => Math.abs(profile.stockPowerHp - power) <= .51);
  const candidates = exactStock.length ? exactStock : compatible;
  // Different engine generations or stock-torque variants cannot be selected by
  // popularity/source count. An opaque RDW type is never decoded speculatively.
  const identities = new Set(candidates.map(profile => JSON.stringify([normalizeSourceIdentity(profile.generation), profile.engineFamily ?? "", profile.stockTorqueNm, profile.gearbox ?? ""])));
  if (identities.size > 1) return {reasonCodes: ["MULTIPLE_SOURCED_ENGINE_CONFIGURATIONS"], candidates};
  const ranked = [...candidates].sort((a, b) => Number(b.reviewStatus === "noordtune-approved") - Number(a.reviewStatus === "noordtune-approved") || b.stage1SourceCount - a.stage1SourceCount || a.id.localeCompare(b.id));
  if (!ranked.length) return {reasonCodes: ["NO_COMPATIBLE_SOURCED_PROFILE"], candidates};
  const best = ranked[0];
  const equals = ranked.filter(profile => profile.stage1SourceCount === best.stage1SourceCount && profile.reviewStatus === best.reviewStatus);
  const outputs = new Set(equals.map(profile => createHash("sha256").update(JSON.stringify([profile.stage1.selectedPowerHp, profile.stage1.selectedTorqueNm])).digest("hex")));
  if (outputs.size > 1) return {reasonCodes: ["UNREVIEWED_SOURCE_COUNTERPART_CONFLICT"], candidates};
  return {profile: best, candidates, reasonCodes: ["SOURCED_MODEL_ENGINE_MATCH", ...(best.yearTo === undefined ? ["SOURCE_GENERATION_END_UNCONFIRMED"] : []), ...(best.ownerReviewRequired ? ["SOURCE_OWNER_REVIEW_REQUIRED"] : [])]};
}

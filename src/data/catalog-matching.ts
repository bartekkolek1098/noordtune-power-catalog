import type {EngineVariant, FuelType} from "./catalog-shared.ts";

export type CatalogMatchStatus = "catalog-match" | "ambiguous" | "conflict" | "no-match";
export type CatalogMatchReasonCode =
  | "MISSING_MAKE_OR_MODEL" | "MISSING_FUEL" | "UNKNOWN_FUEL"
  | "MISSING_POWER" | "UNKNOWN_POWER_UNIT" | "MISSING_DISPLACEMENT" | "MISSING_REGISTRATION_YEAR"
  | "MANUFACTURER_CONFLICT" | "MODEL_FAMILY_CONFLICT" | "MODEL_VARIANT_CONFLICT"
  | "FUEL_CONFLICT" | "DISPLACEMENT_CONFLICT" | "POWER_CONFLICT"
  | "GENERATION_CONFLICT" | "REGISTRY_TYPE_CONFLICT" | "REGISTRY_VARIANT_CONFLICT"
  | "REGISTRY_EXECUTION_CONFLICT" | "CYLINDER_CONFLICT"
  | "REGISTRATION_PREDATES_CONFIGURATION" | "REGISTRATION_OUTSIDE_CATALOG_PERIOD"
  | "GENERATION_BOUNDARY_REVIEW" | "GENERATION_UNCONFIRMED"
  | "CATALOG_DISPLACEMENT_UNRESOLVED" | "GENERATED_APPLICABILITY_UNREVIEWED"
  | "MULTIPLE_CONFIGURATIONS" | "EQUIVALENT_DUPLICATES_COLLAPSED"
  | "REVIEWED_CATALOG_APPLICABILITY" | "NO_MODEL_FAMILY";

export type CatalogMatchInput = {
  make?: string;
  model?: string;
  fuel?: string;
  registeredPower?: {value: number; unit: "kW" | "hp" | "pk" | "PS"} | null;
  /** Backward-compatible metric horsepower; RDW callers should pass the registered unit. */
  powerHp?: number | null;
  displacementCc?: number | null;
  firstRegistrationYear?: number | null;
  firstRegistrationDate?: string | null;
  type?: string;
  variant?: string;
  execution?: string;
  cylinders?: number | null;
};

/** This reviews a catalog relationship, never the installed engine or ECU. */
export type CatalogCandidate = {
  variant: EngineVariant;
  applicability: "reviewed" | "generated";
  displacementCc?: readonly number[];
  cylinders?: number;
  registryTypes?: readonly string[];
  registryVariants?: readonly string[];
  registryExecutions?: readonly string[];
};

type CandidateDiagnostic = {id: string; reasonCodes: CatalogMatchReasonCode[]};
export type CatalogMatchAssessment = {
  status: CatalogMatchStatus;
  reasonCodes: CatalogMatchReasonCode[];
  /** Present only for one defensible reviewed catalog relationship. */
  variant?: EngineVariant;
  candidates: CandidateDiagnostic[];
  rejections: CandidateDiagnostic[];
  candidateCount: number;
  rejectionCount: number;
};

function normalize(value?: string) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function manufacturer(value?: string) {
  const key = normalize(value);
  const aliases: Record<string, string> = {
    vw: "volkswagen", mercedes: "mercedes benz", alfa: "alfa romeo", "bmw mini": "mini"
  };
  return aliases[key] ?? key;
}

export function normalizeCatalogFuel(value?: string): FuelType | undefined {
  const fuel = normalize(value);
  // The catalog has no gas/conversion/hydrogen applicability. Do not erase those
  // registry facts by selecting the petrol part of an unrepresented powertrain.
  if (/\b(?:lpg|cng|lng|waterstof|hydrogen|gas)\b/.test(fuel)
    || (/benzine|petrol/.test(fuel) && /diesel/.test(fuel))) return undefined;
  // A petrol/electric combination describes a hybrid powertrain, not a petrol-only engine.
  if (/hybrid|hybride/.test(fuel) || (/benzine|petrol|diesel/.test(fuel) && /elektr|electric/.test(fuel))) return "Hybrid";
  if (/diesel/.test(fuel)) return "Diesel";
  if (/benzine|petrol/.test(fuel)) return "Petrol";
  if (/elektr|electric/.test(fuel)) return "Electric";
  return undefined;
}

/** Catalog hp uses metric horsepower (pk/PS). Never combine motor ratings here. */
export function registeredPowerToMetricHp(input: CatalogMatchInput) {
  if (input.registeredPower) {
    const {value, unit} = input.registeredPower;
    if (!Number.isFinite(value) || value <= 0) return undefined;
    if (unit === "kW") return value / 0.73549875;
    if (unit === "hp") return value * 1.0138696654;
    if (unit === "pk" || unit === "PS") return value;
    return undefined;
  }
  return input.powerHp && Number.isFinite(input.powerHp) && input.powerHp > 0 ? input.powerHp : undefined;
}

/** Nominal decimal labels permit at most 49 cc rounding, never a percent tolerance.
 * Broader/exceptional marketing labels require an explicit reviewed displacement list.
 */
export function nominalEngineDisplacements(engine: string) {
  return [...new Set([...engine.matchAll(/\b(\d[.,]\d{1,2})(?=[^\d]|$)/g)]
    .map((match) => Math.round(Number(match[1].replace(",", ".")) * 1000)))];
}

export function nominalDisplacementMatches(displacementCc: number, nominalCc: number) {
  return Number.isFinite(displacementCc) && displacementCc > 0 && Math.abs(displacementCc - nominalCc) <= 49;
}

function modelIdentity(make: string, model: string) {
  const text = normalize(model);
  if (make === "ford") {
    const van = text.match(/\b(transit|tourneo)(?:\s+(custom|connect|courier))?\b/);
    if (van) return {family: [van[1], van[2]].filter(Boolean).join(" "), badge: ""};
  }
  if (make === "bmw") {
    const suv = text.match(/\b(x[1-7]|z[1-4])\b/)?.[1];
    const badge = text.match(/\b(m?\d{3}(?:ti|[die]))\b/)?.[1] ?? "";
    const series = text.match(/\b([1-8])\s*(?:serie|series|er)\b/)?.[1];
    const seriesNumber = series ?? badge.match(/\d/)?.[0];
    return {family: suv ?? (seriesNumber ? `${seriesNumber} series` : text.split(" ")[0]), badge};
  }
  const words = text.split(" ");
  const badge = text.match(/\b(gti|gtd|cupra|type r|st|rs|amg)\b/)?.[1]
    ?? (/\b(golf|polo|scirocco)\b/.test(text) && /\br\b/.test(text) ? "r" : "");
  // Distinct multiple-word families must not collapse to the first shared token.
  const multiword = text.match(/\b(grand cherokee|range rover(?: sport| evoque| velar)?|land cruiser|a klasse|b klasse|c klasse|e klasse|s klasse)\b/)?.[1];
  const family = multiword ?? words[0];
  return {family, badge};
}

function generations(make: string, value: string) {
  const text = normalize(value);
  if (make === "bmw") return text.match(/\b[efg]\d{2,3}\b/g) ?? [];
  if (make === "mercedes benz") return text.match(/\b[wcra]\d{3}\b/g) ?? [];
  const result = text.match(/\bmk\s?\d\b/g)?.map((value) => value.replace(" ", "")) ?? [];
  if (make === "volkswagen") result.push(...(text.match(/\bgolf\s[5-8]\b/g) ?? []), ...(text.match(/\bb[5-9]\b/g) ?? []));
  if (make === "audi") result.push(...(text.match(/\b(?:8[plvy]|b[5-9]|c[5-8])\b/g) ?? []));
  return result;
}

function registrationYear(input: CatalogMatchInput) {
  if (input.firstRegistrationYear && Number.isInteger(input.firstRegistrationYear)) return input.firstRegistrationYear;
  // The RDW parser is authoritative; accept only an already-normalized valid calendar date here.
  const date = input.firstRegistrationDate;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? parsed.getUTCFullYear() : undefined;
}

function equivalentKey(candidate: CatalogCandidate) {
  const vehicle = candidate.variant;
  return JSON.stringify([
    manufacturer(vehicle.brand), normalize(vehicle.model), normalize(vehicle.engine), vehicle.fuel,
    vehicle.stockPowerHp, vehicle.stockTorqueNm, vehicle.gearbox, vehicle.generation,
    vehicle.engineIdentity?.engineCodes, vehicle.ecuType, candidate.displacementCc, candidate.cylinders,
    candidate.registryTypes, candidate.registryVariants, candidate.registryExecutions,
    vehicle.stages.map((stage) => [stage.name, stage.powerHp, stage.torqueNm])
  ]);
}

export function assessCatalogMatch(input: CatalogMatchInput, catalog: readonly CatalogCandidate[]): CatalogMatchAssessment {
  const make = manufacturer(input.make);
  const model = normalize(input.model);
  const empty = {candidates: [], rejections: [], candidateCount: 0, rejectionCount: 0};
  if (!make || !model) return {...empty, status: "no-match", reasonCodes: ["MISSING_MAKE_OR_MODEL"]};
  const identity = modelIdentity(make, model);
  const fuel = normalizeCatalogFuel(input.fuel);
  const power = registeredPowerToMetricHp(input);
  const year = registrationYear(input);
  const inputGeneration = generations(make, [model, input.type, input.variant, input.execution].filter(Boolean).join(" "));
  const missing: CatalogMatchReasonCode[] = [];
  if (!fuel) missing.push(input.fuel ? "UNKNOWN_FUEL" : "MISSING_FUEL");
  if (!power) missing.push(input.registeredPower ? "UNKNOWN_POWER_UNIT" : "MISSING_POWER");
  if (!(input.displacementCc && input.displacementCc > 0)) missing.push("MISSING_DISPLACEMENT");
  if (!year) missing.push("MISSING_REGISTRATION_YEAR");

  const accepted: {candidate: CatalogCandidate; reasons: CatalogMatchReasonCode[]}[] = [];
  const rejected: CandidateDiagnostic[] = [];
  let sameFamilyCount = 0;
  const relevantRejections: CatalogMatchReasonCode[] = [];

  for (const candidate of catalog) {
    const vehicle = candidate.variant;
    const reasons: CatalogMatchReasonCode[] = [];
    const hard: CatalogMatchReasonCode[] = [];
    const candidateMake = manufacturer(vehicle.brand);
    const candidateIdentity = modelIdentity(candidateMake, vehicle.model);
    if (make !== candidateMake) hard.push("MANUFACTURER_CONFLICT");
    if (identity.family !== candidateIdentity.family) hard.push("MODEL_FAMILY_CONFLICT");
    const sameFamily = !hard.length;
    if (sameFamily) sameFamilyCount++;
    if (identity.badge && candidateIdentity.badge && identity.badge !== candidateIdentity.badge) hard.push("MODEL_VARIANT_CONFLICT");
    // A generated BMW 3 Series/118d cross product is internally conflicting too.
    if (candidateMake === "bmw" && candidateIdentity.family.endsWith(" series") && candidateIdentity.badge
      && !candidateIdentity.badge.replace(/^m/, "").startsWith(candidateIdentity.family[0])) hard.push("MODEL_VARIANT_CONFLICT");
    if (fuel && vehicle.fuel !== fuel) hard.push("FUEL_CONFLICT");
    const nominal = candidate.displacementCc ? [] : nominalEngineDisplacements(vehicle.engine);
    if (input.displacementCc && input.displacementCc > 0) {
      if (candidate.displacementCc?.length) {
        if (!candidate.displacementCc.includes(input.displacementCc)) hard.push("DISPLACEMENT_CONFLICT");
      } else if (!nominal.length) reasons.push("CATALOG_DISPLACEMENT_UNRESOLVED");
      else if (!nominal.some((value) => nominalDisplacementMatches(input.displacementCc!, value))) hard.push("DISPLACEMENT_CONFLICT");
      else if (nominal.length > 1) reasons.push("CATALOG_DISPLACEMENT_UNRESOLVED");
    }
    // Three metric horsepower covers RDW/catalog rounding, not another output variant.
    if (power && Math.abs(power - vehicle.stockPowerHp) > 3) hard.push("POWER_CONFLICT");
    if (input.cylinders && candidate.cylinders && input.cylinders !== candidate.cylinders) hard.push("CYLINDER_CONFLICT");
    for (const [value, expected, code] of [
      [input.type, candidate.registryTypes, "REGISTRY_TYPE_CONFLICT"],
      [input.variant, candidate.registryVariants, "REGISTRY_VARIANT_CONFLICT"],
      [input.execution, candidate.registryExecutions, "REGISTRY_EXECUTION_CONFLICT"]
    ] as const) {
      if (value && expected?.length && !expected.map(normalize).includes(normalize(value))) hard.push(code);
    }
    const candidateGeneration = generations(make, vehicle.generation || vehicle.version);
    const generationConfirmed = inputGeneration.length > 0 && candidateGeneration.some((value) => inputGeneration.includes(value));
    if (inputGeneration.length && candidateGeneration.length && !generationConfirmed) hard.push("GENERATION_CONFLICT");
    if (inputGeneration.length && !candidateGeneration.length) reasons.push("GENERATION_UNCONFIRMED");
    const start = Math.min(...vehicle.years);
    const end = Math.max(...vehicle.years);
    if (year && vehicle.years.length) {
      if (year < start - 1) hard.push("REGISTRATION_PREDATES_CONFIGURATION");
      else if (year < start || year > end) reasons.push("REGISTRATION_OUTSIDE_CATALOG_PERIOD");
      else if (!generationConfirmed && (year === start || year === end)) reasons.push("GENERATION_BOUNDARY_REVIEW");
    }
    if (hard.length) {
      if (sameFamily) relevantRejections.push(...hard);
      // Only the first bounded diagnostics are returned; no full database DTO leaks.
      rejected.push({id: vehicle.id, reasonCodes: [...new Set(hard)]});
    } else {
      if (candidate.applicability === "generated") reasons.push("GENERATED_APPLICABILITY_UNREVIEWED");
      accepted.push({candidate, reasons: [...missing, ...reasons]});
    }
  }

  // Generated discovery rows do not establish alternative configurations against reviewed
  // applicability. Multiple different reviewed configurations still require review.
  const reviewed = accepted.filter(({candidate}) => candidate.applicability === "reviewed");
  const pool = reviewed.length ? reviewed : accepted;
  const groups = new Map<string, typeof pool>();
  for (const item of pool) {
    const key = equivalentKey(item.candidate);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const unique = [...groups.values()].map((items) => items.sort((a, b) => a.reasons.length - b.reasons.length || a.candidate.variant.id.localeCompare(b.candidate.variant.id))[0]);
  const collapsed = pool.length > unique.length;
  const diagnostic = {
    candidates: unique.slice(0, 8).map(({candidate, reasons}) => ({id: candidate.variant.id, reasonCodes: reasons})),
    rejections: rejected.filter((item) => !item.reasonCodes.includes("MANUFACTURER_CONFLICT")).slice(0, 16),
    candidateCount: unique.length,
    rejectionCount: rejected.length
  };
  if (!unique.length) return {
    ...diagnostic, status: sameFamilyCount ? "conflict" : "no-match",
    reasonCodes: sameFamilyCount ? [...new Set(relevantRejections)] : ["NO_MODEL_FAMILY"]
  };
  const only = unique[0];
  if (unique.length === 1 && only.candidate.applicability === "reviewed" && !only.reasons.length) return {
    ...diagnostic, status: "catalog-match", variant: only.candidate.variant,
    reasonCodes: ["REVIEWED_CATALOG_APPLICABILITY", ...(collapsed ? ["EQUIVALENT_DUPLICATES_COLLAPSED" as const] : [])]
  };
  return {
    ...diagnostic, status: "ambiguous",
    reasonCodes: [...new Set([
      ...unique.flatMap((item) => item.reasons),
      ...(unique.length > 1 ? ["MULTIPLE_CONFIGURATIONS" as const] : []),
      ...(collapsed ? ["EQUIVALENT_DUPLICATES_COLLAPSED" as const] : [])
    ])]
  };
}

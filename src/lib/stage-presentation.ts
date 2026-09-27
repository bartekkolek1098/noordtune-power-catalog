import type {EstimateStage, TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import type {Locale} from "../i18n/routing.ts";

export type HardwarePart = "downpipe" | "sport-catalyst" | "intercooler" | "intake" | "spark-plugs" | "turbo" | "b58-turbo" | "fuel-pump" | "fuel-system" | "cooling" | "exhaust";
export type StageScope = {
  fuelRon: number[];
  hardware: {part: HardwarePart; requirement: "required" | "recommended" | "check"}[];
  transmission?: "dsg7-320" | "automatic-software";
  lowerOctaneOutput?: "95-165-170";
};
export type ComparisonCause = "A-sourced-equal" | "B-rounding" | "C-generic-overlap" | "D-clamped" | "E-scope-difference" | "F-mapping-error" | "catalog-equal" | "distinct" | "unavailable";
export type StageComparison = {
  power: ComparisonCause; torque: ComparisonCause;
  additionalPowerEstablished: boolean; additionalTorqueEstablished: boolean;
  comparability: "same-reference" | "different-scope" | "unconfirmed";
};

/** Whitelisted technical facts only. Unknown prose is never passed through to customers. */
export function stageScope(stage: EstimateStage): StageScope {
  if (stage.customerScope) return stage.customerScope;
  const records = [stage.requirements, ...(stage.notes ?? [])].flatMap(text => text.split(/[.;]/)).filter(Boolean);
  const fuelRon = [...new Set(records.flatMap(text => [...text.matchAll(/(?:RON\s*(9[5-9]|100|102))|(?:(9[5-9]|100|102)\s*RON)/gi)].map(m => Number(m[1] ?? m[2]))))].filter(n => n !== 95 || !records.some(t => /165.?170/.test(t)));
  const hardware: StageScope["hardware"] = [];
  const parts: [HardwarePart, RegExp][] = [["downpipe",/downpipe/i],["sport-catalyst",/sport.?catal|sports catalyst/i],["intercooler",/intercooler/i],["intake",/intake/i],["spark-plugs",/spark plugs|bougies/i],["turbo",/(?:upgraded|hybrid|hybride) .?turbo|turbo.?upgrade|upgraded B58 turbo/i],["b58-turbo",/upgraded B58 turbo/i],["fuel-pump",/B58TU|high.pressure fuel pump/i],["fuel-system",/brandstofupgrade|fueling and drivetrain/i],["cooling",/koeling|cooling/i],["exhaust",/uitlaatflow|changed exhaust/i]];
  for (const [part, pattern] of parts) {
    // Negative applicability and research caveats cannot establish installed parts.
    const matching = records.filter(t => pattern.test(t) && !/must not be transferred|no .*parts list|not specified|not identify/i.test(t));
    if (!matching.length) continue;
    if (part === "turbo" && matching.some(t => /upgraded B58 turbo/i.test(t))) continue;
    const requirement = matching.some(t => /\brequires?\b|\brequired\b|assumes|specifies|Downpipe, intake en bougies/i.test(t) && !/may|recommended|aanbevolen|needs? checking/i.test(t)) ? "required"
      : matching.some(t => /recommended|aanbevolen/i.test(t)) ? "recommended" : "check";
    hardware.push({part, requirement});
  }
  return {fuelRon, hardware,
    ...(records.some(t => /DSG7/.test(t) && /320/.test(t)) ? {transmission: "dsg7-320" as const} : records.some(t => /gearbox software.*automatic/i.test(t)) ? {transmission: "automatic-software" as const} : {}),
    ...(records.some(t => /165.?170.*95 RON/i.test(t)) ? {lowerOctaneOutput: "95-165-170" as const} : {})};
}

function range(stage: EstimateStage, field: "power" | "torque"): [number, number] | undefined {
  const values = field === "power" ? stage.powerRangeHp : stage.torqueRangeNm;
  const value = field === "power" ? stage.powerHp : stage.torqueNm;
  return stage.customHardware ? undefined : values ?? (value === undefined ? undefined : [value, value]);
}
const backed = (s: EstimateStage) => ["reference", "single-source", "multi-source"].includes(s.provenance ?? "");

export function compareStages(first: EstimateStage | undefined, second: EstimateStage, expectedStage2?: {powerHp?: number; torqueNm?: number}): StageComparison {
  const aScope = first ? stageScope(first) : undefined, bScope = stageScope(second);
  const fuelDifference = Boolean(aScope?.fuelRon.length && bScope.fuelRon.length && !aScope.fuelRon.some(n => bScope.fuelRon.includes(n)));
  const differentSource = Boolean(first?.sourceProfileId && second.sourceProfileId && first.sourceProfileId !== second.sourceProfileId);
  const comparability = fuelDifference ? "different-scope" : differentSource ? "unconfirmed" : "same-reference";
  const cause = (field: "power" | "torque"): ComparisonCause => {
    const a = first && range(first, field), b = range(second, field);
    if (!a || !b) return "unavailable";
    const expected = field === "power" ? expectedStage2?.powerHp : expectedStage2?.torqueNm;
    if (expected !== undefined && (b[0] !== expected || b[1] !== expected)) return "F-mapping-error";
    const overlaps = b[0] <= a[1] && a[0] <= b[1];
    if (!overlaps) return "distinct";
    if (fuelDifference || (differentSource && backed(second))) return "E-scope-difference";
    if (second.provenance === "generic-indicative") {
      if (second.planningBasis?.[field]?.clamped || (field === "power" && second.genericScenario === "strong-stage1-conditional")) return "D-clamped";
      const raw = second.planningBasis?.[field]?.raw;
      const firstRaw = first?.planningBasis?.[field]?.raw;
      if (raw && raw[0] > (firstRaw?.[1] ?? a[1])) return "B-rounding";
      return "C-generic-overlap";
    }
    return backed(second) ? "A-sourced-equal" : "catalog-equal";
  };
  const established = (field: "power" | "torque") => {
    const a = first && range(first, field), b = range(second, field);
    return Boolean(a && b && b[0] > a[1] && backed(second) && comparability === "same-reference" && cause(field) !== "F-mapping-error");
  };
  return {power: cause("power"), torque: cause("torque"), comparability,
    additionalPowerEstablished: established("power"), additionalTorqueEstablished: established("torque")};
}

const copy = {
  nl: {
    heading: "Details van deze Stage", general: "Algemene schatting, geen meting of bevestigde modelvariant. De exacte configuratie wordt vóór uitvoering gecontroleerd.",
    indicative: "Indicatieve waarden. De exacte configuratie wordt vóór uitvoering bevestigd.",
    scenario: "Geschat hardware- en kalibratiescenario; extra winst ten opzichte van Stage 1 is niet vastgesteld.",
    floor: "De band kan dezelfde piekwaarde als Stage 1 bevatten; dit is geen afzonderlijk bevestigd Stage 2-doel.",
    equal: "Het gepubliceerde piekkoppel is gelijk aan Stage 1. Een hoger piekkoppel is hiermee niet aangetoond.",
    equalPower: "Het gepubliceerde piekvermogen is gelijk aan Stage 1. Extra piekvermogen is hiermee niet aangetoond.",
    scopes: "De Stages hebben verschillende of niet bevestigde bronconfiguraties. Vergelijk ze niet als één oplopend pakket.",
    hardware: "Passende hardware en kalibratie moeten vóór uitvoering worden bevestigd.", custom: "Hardware en kalibratie op maat; vermogen, koppel en prijs na beoordeling van de configuratie.",
    software: "Motor, voertuigconditie en ECU-toegang controleren vóór uitvoering.", torque: "Koppel: te bevestigen.",
    connect: "TDCi/EcoBlue-motorgeneratie nog te bevestigen. Registratie in 2018 alleen bepaalt de motorvariant niet.",
    conflict: "Bronwaarden verschillen; de toepasselijke configuratie moet worden bevestigd.",
    dsg: "De bron beperkt DSG7 tot 320 Nm; de gemonteerde versnellingsbak moet worden bevestigd.", automatic: "Versnellingsbaksoftware aanbevolen bij een automaat.",
    lower: "De bron vermeldt 165–170 pk op RON 95; hogere waarden vragen brandstof met een hoger octaangetal.",
    fuel: "Brandstof voor deze bronconfiguratie", required: "Vereist", recommended: "Aanbevolen", check: "Te controleren",
    parts: {downpipe:"Downpipe", "sport-catalyst":"Sportkatalysator", intercooler:"Intercooler", intake:"Inlaat", "spark-plugs":"Bougies", turbo:"Turbo-upgrade", "b58-turbo":"B58 turbo-upgrade", "fuel-pump":"B58TU hogedrukbrandstofpomp", "fuel-system":"Brandstofsysteem", cooling:"Koeling", exhaust:"Uitlaatflow"}
  },
  en: {
    heading: "Details of this Stage", general: "General estimate, not a measurement or a confirmed model variant. The exact configuration is checked before work.",
    indicative: "Indicative values. The exact configuration is confirmed before work.",
    scenario: "Estimated hardware and calibration scenario; extra gain over Stage 1 has not been established.",
    floor: "The range may include the same peak as Stage 1; it is not a separately confirmed Stage 2 target.",
    equal: "Published peak torque equals Stage 1. This does not establish higher peak torque.", equalPower: "Published peak power equals Stage 1. This does not establish extra peak power.",
    scopes: "The Stages use different or unconfirmed source configurations. Do not compare them as one increasing package ladder.",
    hardware: "Applicable hardware and calibration must be confirmed before work.", custom: "Custom hardware and calibration; power, torque and price after configuration review.",
    software: "Check engine, vehicle condition and ECU access before work.", torque: "Torque: to be confirmed.",
    connect: "TDCi/EcoBlue engine generation still needs confirmation. Registration in 2018 alone does not identify the engine variant.",
    conflict: "Source figures differ; the applicable configuration needs confirmation.",
    dsg: "The source limits DSG7 to 320 Nm; the installed transmission must be confirmed.", automatic: "Transmission software recommended for automatic cars.",
    lower: "The source lists 165–170 hp on RON 95; higher figures need higher-octane fuel.",
    fuel: "Fuel for this source configuration", required: "Required", recommended: "Recommended", check: "To check",
    parts: {downpipe:"Downpipe", "sport-catalyst":"Sport catalyst", intercooler:"Intercooler", intake:"Intake", "spark-plugs":"Spark plugs", turbo:"Turbo upgrade", "b58-turbo":"Upgraded B58 turbo", "fuel-pump":"B58TU high-pressure fuel pump", "fuel-system":"Fuel system", cooling:"Cooling", exhaust:"Exhaust flow"}
  },
  pl: {
    heading: "Szczegóły tego Stage", general: "Ogólna estymacja, nie pomiar ani wynik dla potwierdzonej wersji silnika. Dokładną konfigurację sprawdzimy przed realizacją.",
    indicative: "Wartości orientacyjne. Dokładną konfigurację potwierdzimy przed realizacją.",
    scenario: "Szacowany wariant osprzętu i kalibracji; dodatkowy przyrost względem Stage 1 nie jest potwierdzony.",
    floor: "Zakres może obejmować ten sam wynik szczytowy co Stage 1; nie jest osobno potwierdzonym celem Stage 2.",
    equal: "Opublikowany maksymalny moment jest taki sam jak w Stage 1. Nie potwierdza to wyższego momentu.", equalPower: "Opublikowana moc maksymalna jest taka sama jak w Stage 1. Nie potwierdza to dodatkowej mocy.",
    scopes: "Stage dotyczą różnych lub niepotwierdzonych konfiguracji źródłowych. Nie należy traktować ich jako jednego pakietu o rosnących osiągach.",
    hardware: "Odpowiedni osprzęt i kalibrację trzeba potwierdzić przed realizacją.", custom: "Indywidualny osprzęt i kalibracja; moc, moment i cena po ocenie konfiguracji.",
    software: "Przed realizacją sprawdzimy silnik, stan pojazdu i dostęp do ECU.", torque: "Moment obrotowy: do potwierdzenia.",
    connect: "Generacja silnika TDCi/EcoBlue wymaga potwierdzenia. Sama rejestracja w 2018 r. nie określa wersji silnika.",
    conflict: "Dane źródłowe różnią się; właściwa konfiguracja wymaga potwierdzenia.",
    dsg: "Źródło ogranicza DSG7 do 320 Nm; trzeba potwierdzić zamontowaną skrzynię biegów.", automatic: "Zalecane oprogramowanie skrzyni w autach z automatem.",
    lower: "Źródło podaje 165–170 KM na RON 95; wyższe wartości wymagają paliwa o wyższej liczbie oktanowej.",
    fuel: "Paliwo dla tej konfiguracji źródłowej", required: "Wymagane", recommended: "Zalecane", check: "Do sprawdzenia",
    parts: {downpipe:"Downpipe", "sport-catalyst":"Katalizator sportowy", intercooler:"Intercooler", intake:"Dolot", "spark-plugs":"Świece", turbo:"Modyfikacja turbosprężarki", "b58-turbo":"Zmodyfikowana turbosprężarka B58", "fuel-pump":"Wysokociśnieniowa pompa paliwa B58TU", "fuel-system":"Układ paliwowy", cooling:"Chłodzenie", exhaust:"Przepływ spalin"}
  }
} as const;

export function customerStagePresentation(stage: EstimateStage, locale: Locale, profile?: TuningEstimateProfile) {
  const t = copy[locale], scope = stageScope(stage);
  const comparison = stage.comparison ?? compareStages(profile?.stages.find(s => s.name === "Stage 1"), stage);
  const generic = stage.provenance === "generic-indicative";
  const category = stage.customHardware ? "custom" : generic ? "general" : "indicative";
  const requirements = [stage.customHardware ? t.custom : stage.name === "Stage 1" ? t.software : t.hardware,
    ...(scope.fuelRon.length ? [`${t.fuel}: ${scope.fuelRon.map(n => `RON ${n}`).join(" / ")}.`] : []),
    ...scope.hardware.map(h => `${t[h.requirement]}: ${t.parts[h.part]}.`),
    ...(scope.transmission ? [scope.transmission === "dsg7-320" ? t.dsg : t.automatic] : []),
    ...(scope.lowerOctaneOutput ? [t.lower] : [])];
  const limitations = [
    ...(stage.name === "Stage 2" && generic ? [t.scenario, ...([comparison.power, comparison.torque].some(c => /^(B|C|D)-/.test(c)) ? [t.floor] : [])] : []),
    ...(stage.name === "Stage 2" && comparison.torque === "A-sourced-equal" ? [t.equal] : []),
    ...(stage.name === "Stage 2" && comparison.power === "A-sourced-equal" ? [t.equalPower] : []),
    ...(stage.name !== "Stage 1" && comparison.comparability !== "same-reference" && !generic ? [t.scopes] : []),
    ...(stage.torqueNm === undefined && !stage.torqueRangeNm && !stage.customHardware ? [t.torque] : []),
    ...(profile?.conditionCodes?.includes("CONNECT_ENGINE_GENERATION_REVIEW") ? [t.connect] : []),
    ...(profile?.conditionCodes?.includes("SOURCE_CONSENSUS_CONFLICT") ? [t.conflict] : [])];
  return {category, heading: t.heading, summary: t[category], scope, comparison,
    requirements: [...new Set(requirements)], limitations: [...new Set(limitations)]};
}

export function customerStageNotes(stage: EstimateStage, locale: Locale, profile?: TuningEstimateProfile) {
  const p = customerStagePresentation(stage, locale, profile);
  return [...new Set([p.summary, ...p.requirements, ...p.limitations])];
}

/** Disclosure contains only a provider/domain label and link, never internal scope paragraphs. */
export function customerSources(profile: TuningEstimateProfile, stage: EstimateStage) {
  if (stage.provenance === "generic-indicative") return [];
  return [...new Map(profile.sourceReferences.flatMap(source => {
    if (!source.url || source.sourceType === "heuristic") return [];
    try { const url = new URL(source.url); if (url.protocol !== "https:") return [];
      return [[url.href, {url: url.href, label: url.hostname.replace(/^www\./, "")} ] as const];
    } catch { return []; }
  })).values()];
}

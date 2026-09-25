import {customerStagePresentation} from "./stage-presentation.ts";
import type {EstimateStage, TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import type {Locale} from "../i18n/routing.ts";

export function customHardwareLabel(locale: Locale) {
  return {nl: "Maatwerk / hardware-afhankelijk", en: "Custom / hardware-dependent", pl: "Indywidualnie / zależnie od osprzętu"}[locale];
}

export function formatEstimatePower(stage: Pick<EstimateStage, "powerHp" | "powerRangeHp" | "approximate" | "customHardware">, locale: Locale) {
  if (stage.customHardware) return customHardwareLabel(locale);
  const unit = {nl: "pk", en: "hp", pl: "KM"}[locale];
  if (stage.powerRangeHp) return `${stage.powerRangeHp[0]}–${stage.powerRangeHp[1]} ${unit}`;
  return stage.powerHp === undefined ? {nl: "Te bevestigen", en: "To be confirmed", pl: "Do potwierdzenia"}[locale] : `${stage.approximate ? "≈" : ""}${stage.powerHp} ${unit}`;
}

export function formatEstimateTorque(stage: Pick<EstimateStage, "torqueNm" | "torqueRangeNm" | "approximate" | "customHardware">, locale: Locale) {
  if (stage.customHardware) return customHardwareLabel(locale);
  if (stage.torqueRangeNm) return `${stage.torqueRangeNm[0]}–${stage.torqueRangeNm[1]} Nm (${{nl: "schatting", en: "estimate", pl: "szacunek"}[locale]})`;
  return stage.torqueNm === undefined ? {nl: "Te bevestigen", en: "To be confirmed", pl: "Do potwierdzenia"}[locale] : `${stage.approximate ? "≈" : ""}${stage.torqueNm} Nm`;
}

export function formatEstimateSource(stage: EstimateStage, locale: Locale) {
  if (stage.customHardware) return {nl: "Maatwerk", en: "Custom setup", pl: "Indywidualny tuning"}[locale];
  const source = stage.provenance ?? "reviewed";
  return {
    reviewed: {nl: "Catalogusindicatie", en: "Catalog estimate", pl: "Szacunek katalogowy"},
    reference: {nl: "Model-/motorreferentie", en: "Model/engine reference", pl: "Referencja modelu/silnika"},
    "multi-source": {nl: "Catalogusindicatie", en: "Catalog estimate", pl: "Szacunek katalogowy"},
    "single-source": {nl: "Indicatieve tuningwaarde", en: "Indicative tuning figure", pl: "Orientacyjna wartość tuningu"},
    "canonical-estimated": {nl: "Geschatte catalogusindicatie", en: "Estimated catalog indication", pl: "Orientacyjne dane katalogowe"},
    "generic-indicative": {nl: "Algemene indicatie", en: "General estimate", pl: "Ogólna prognoza"}
  }[source][locale];
}

/** Individual source limitations are displayed without invalidating a whole profile group. */
export function genericEstimateNote(locale: Locale) {
  return {
    nl: "Algemene schatting, geen meting of bevestigde modelvariant. De exacte configuratie wordt vóór uitvoering gecontroleerd.",
    en: "General estimate, not a measurement or a confirmed model variant. The exact configuration is checked before work.",
    pl: "Ogólna estymacja, nie pomiar ani wynik dla potwierdzonej wersji silnika. Dokładną konfigurację sprawdzimy przed realizacją."
  }[locale];
}

/** Stage notes carry source-specific fuel/hardware scope; machine status codes stay internal. */
export function estimateStageTechnicalNotes(stage: Pick<EstimateStage, "notes"> & Partial<EstimateStage>, locale: Locale = "en") {
  return customerStagePresentation({name: "Stage 1", requirements: "", packageItems: [], ...stage}, locale).requirements;
}

export function estimateLimitations(profile: TuningEstimateProfile, locale: Locale) {
  const codes = profile.conditionCodes ?? [];
  const messages: Record<string, Record<Locale, string>> = {
    SOURCE_CONSENSUS_CONFLICT: {
      nl: "Bronnen verschillen of Stage-waarden sluiten niet op elkaar aan. Controle van de gekozen tuningwaarde en hardware is nodig vóór uitvoering.",
      en: "Sources disagree or Stage figures are inconsistent. The selected tuning figure and hardware need review before work.",
      pl: "Źródła różnią się lub wartości poszczególnych Stage są niespójne. Przed realizacją trzeba zweryfikować wybrane parametry i osprzęt."
    },
    NOORDTUNE_TARGET_REVIEW_REQUIRED: {
      nl: "De getoonde waarde is indicatief. De exacte configuratie wordt vóór uitvoering bevestigd.",
      en: "The displayed value is indicative. The exact configuration is confirmed before work.",
      pl: "Wartość jest orientacyjna. Dokładną konfigurację potwierdzimy przed realizacją."
    },
    GENERIC_TORQUE_UNAVAILABLE: {
      nl: "Het stockvermogen komt uit RDW. Zonder betrouwbare bron voor het stockkoppel tonen we geen verzonnen Nm; het koppel vereist voertuigcontrole.",
      en: "Stock power comes from RDW. Without a reliable stock-torque source, we do not invent Nm figures; torque requires vehicle verification.",
      pl: "Moc seryjna pochodzi z RDW. Bez wiarygodnego źródła momentu seryjnego nie podajemy wymyślonych Nm; moment wymaga sprawdzenia pojazdu."
    },
    SOURCE_STOCK_TORQUE_DISCREPANCY: {
      nl: "Bronverschil stockkoppel: de catalogus noemt 270 Nm, BMW noemt 300 Nm. Het brongetal blijft zichtbaar; controle van deze uitvoering is nodig.",
      en: "Stock-torque source difference: the catalog lists 270 Nm; BMW lists 300 Nm. The source value is retained; this configuration needs verification.",
      pl: "Rozbieżność momentu seryjnego: katalog podaje 270 Nm, BMW 300 Nm. Zachowano wartość źródłową; ta konfiguracja wymaga sprawdzenia."
    },
    ENGINE_DISPLACEMENT_SCOPE_1499: {
      nl: "Deze 118i-referentie geldt voor 1499 cc. De eerdere 1598 cc-uitvoering vereist een eigen tuningreferentie.",
      en: "This 118i reference applies to 1499 cc. The earlier 1598 cc configuration requires its own tuning reference.",
      pl: "Ta referencja 118i dotyczy 1499 cm³. Wcześniejsza wersja 1598 cm³ wymaga osobnej referencji tuningu."
    }
  };
  return codes.flatMap((code) => messages[code] ? [messages[code][locale]] : []);
}

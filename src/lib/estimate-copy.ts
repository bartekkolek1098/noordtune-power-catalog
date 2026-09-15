import type {EstimateStage, TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import type {Locale} from "../i18n/routing.ts";

export function formatEstimatePower(stage: Pick<EstimateStage, "powerHp" | "powerRangeHp">, locale: Locale) {
  const unit = {nl: "pk", en: "hp", pl: "KM"}[locale];
  if (stage.powerRangeHp) return `${stage.powerRangeHp[0]}–${stage.powerRangeHp[1]} ${unit}`;
  return stage.powerHp === undefined ? {nl: "Te bevestigen", en: "To be confirmed", pl: "Do potwierdzenia"}[locale] : `${stage.powerHp} ${unit}`;
}

export function formatEstimateTorque(stage: Pick<EstimateStage, "torqueNm" | "torqueRangeNm">, locale: Locale) {
  if (stage.torqueRangeNm) return `${stage.torqueRangeNm[0]}–${stage.torqueRangeNm[1]} Nm (${{nl: "schatting", en: "estimate", pl: "szacunek"}[locale]})`;
  return stage.torqueNm === undefined ? {nl: "Te bevestigen", en: "To be confirmed", pl: "Do potwierdzenia"}[locale] : `${stage.torqueNm} Nm`;
}

export function formatEstimateSource(stage: EstimateStage, locale: Locale) {
  const source = stage.provenance ?? "reviewed";
  return {
    reviewed: {nl: "Catalogusindicatie", en: "Catalog estimate", pl: "Szacunek katalogowy"},
    reference: {nl: "Model-/motorreferentie", en: "Model/engine reference", pl: "Referencja modelu/silnika"},
    "canonical-estimated": {nl: "Geschatte catalogusindicatie", en: "Estimated catalog indication", pl: "Orientacyjne dane katalogowe"},
    "generic-indicative": {nl: "Generieke RDW-indicatie", en: "Generic RDW indication", pl: "Ogólna prognoza na podstawie RDW"}
  }[source][locale];
}

/** Individual source limitations are displayed without invalidating a whole profile group. */
export function genericEstimateNote(locale: Locale) {
  return {
    nl: "Indicatieve bandbreedte op basis van RDW-vermogen; exacte waarde na controle van motor, ECU en hardware.",
    en: "Indicative range based on RDW power; exact value after checking engine, ECU and hardware.",
    pl: "Orientacyjny zakres na podstawie mocy RDW; dokładna wartość po sprawdzeniu silnika, ECU i osprzętu."
  }[locale];
}

export function estimateLimitations(profile: TuningEstimateProfile, locale: Locale) {
  const codes = profile.conditionCodes ?? [];
  const messages: Record<string, Record<Locale, string>> = {
    NOORDTUNE_TARGET_REVIEW_REQUIRED: {
      nl: "190 pk / 440 Nm is een externe Stage 1-referentie. Goedkeuring door de eigenaar van NoordTune is vereist voordat dit als NoordTune-doel wordt gebruikt.",
      en: "190 hp / 440 Nm is an external Stage 1 reference. Approval by the owner of NoordTune is required before using it as a NoordTune target.",
      pl: "190 KM / 440 Nm to zewnętrzna referencja Stage 1. Przed przyjęciem jej jako celu NoordTune wymagana jest zgoda właściciela NoordTune."
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

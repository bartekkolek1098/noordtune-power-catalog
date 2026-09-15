import type {TuningEstimateProfile} from "../data/tuning-estimates-shared.ts";
import type {Locale} from "../i18n/routing.ts";

/** Individual source limitations are displayed without invalidating a whole profile group. */
export function estimateLimitations(profile: TuningEstimateProfile, locale: Locale) {
  const codes = profile.conditionCodes ?? [];
  const messages: Record<string, Record<Locale, string>> = {
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

import type {Locale} from "../i18n/routing.ts";

export const NOORDTUNE_BUSINESS = {
  name: "NoordTune",
  url: "https://www.noordtune.nl",
  telephone: "+31685759600",
  telephoneLabel: "+31 685 759 600",
  email: "info@noordtune.nl",
  address: {
    locality: "Assen",
    countryCode: "NL"
  }
} as const;

const localizedLocations: Record<Locale, string> = {
  nl: "Assen, Nederland",
  en: "Assen, Netherlands",
  pl: "Assen, Holandia"
};

export function localizedBusinessLocation(locale: Locale) {
  return localizedLocations[locale];
}

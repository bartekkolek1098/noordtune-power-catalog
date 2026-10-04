import type {EcuSupport, TransmissionSupport} from "../data/catalog-shared.ts";
import type {Locale} from "../i18n/routing.ts";

/** Application support never asserts an installed controller. */
export function technicalFamilyLabel(support: EcuSupport | TransmissionSupport | undefined, fallback: string, locale: Locale) {
  const family = support && ("gearboxFamily" in support ? support.gearboxFamily : "family" in support ? support.family : undefined);
  const copy = {
    nl: {application: "gedocumenteerde toepassing; gemonteerd type te bevestigen", unknown: "Gemonteerd type te bevestigen"},
    en: {application: "documented application; installed type to be confirmed", unknown: "Installed type to be confirmed"},
    pl: {application: "udokumentowane zastosowanie; zamontowany typ do potwierdzenia", unknown: "Zamontowany typ do potwierdzenia"}
  }[locale];
  if (support?.basis === "documented-application") return family ? `${family} (${copy.application})` : copy.unknown;
  if (support?.basis === "unconfirmed") return family ? `${family} (${copy.unknown})` : copy.unknown;
  return family || fallback || copy.unknown;
}

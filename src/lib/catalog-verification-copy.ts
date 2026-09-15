import type {EngineVariant} from "../data/catalog-shared.ts";
import type {Locale} from "../i18n/routing.ts";

export function catalogVerificationCopy(
  vehicle: Pick<EngineVariant, "publicationSource">,
  locale: Locale,
  reviewedCopy: {badge: string; title: string; text: string; footer: string}
) {
  if (vehicle.publicationSource === "existing-curated") return reviewedCopy;

  return {
    nl: {
      badge: "Handmatige controle",
      title: "Catalogusschatting — toepasbaarheid te bevestigen",
      text: "Deze model-motorcombinatie komt uit gegenereerde catalogusgegevens en is niet afzonderlijk geverifieerd. De getoonde vermogens en koppels zijn catalogusschattingen, geen meting van jouw voertuig.",
      footer: "Offerte na controle van voertuig, motor en ECU."
    },
    en: {
      badge: "Manual review",
      title: "Catalog estimate — applicability to be confirmed",
      text: "This model-engine combination comes from generated catalog data and has not been independently verified. Displayed power and torque are catalog estimates, not measurements of your vehicle.",
      footer: "Quotation after vehicle, engine and ECU verification."
    },
    pl: {
      badge: "Ręczna weryfikacja",
      title: "Szacunek katalogowy — zastosowanie do potwierdzenia",
      text: "Ta kombinacja modelu i silnika pochodzi z wygenerowanych danych katalogowych i nie została niezależnie zweryfikowana. Moc i moment to szacunki katalogowe, a nie pomiary Twojego pojazdu.",
      footer: "Wycena po weryfikacji pojazdu, silnika i ECU."
    }
  }[locale];
}

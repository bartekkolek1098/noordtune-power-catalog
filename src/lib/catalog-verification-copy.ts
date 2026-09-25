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
      badge: "Catalogusindicatie",
      title: "Catalogusindicatie — ECU-controle vóór uitvoering",
      text: "Deze model-motorcombinatie bevat geschatte catalogusgegevens. De getoonde vermogens en koppels zijn bruikbare tuningindicaties, geen meting van jouw voertuig. De exacte ECU en uitvoering worden vóór tuning gecontroleerd.",
      footer: "Indicatieve waarden; definitieve uitvoering na voertuig- en ECU-controle."
    },
    en: {
      badge: "Catalog estimate",
      title: "Catalog estimate — ECU check before tuning",
      text: "This model-engine combination includes estimated catalog data. Displayed power and torque are useful tuning estimates, not measurements of your vehicle. The exact ECU and configuration are checked before tuning.",
      footer: "Indicative values; final work after vehicle and ECU verification."
    },
    pl: {
      badge: "Szacunek katalogowy",
      title: "Szacunek katalogowy — kontrola ECU przed tuningiem",
      text: "Ta kombinacja modelu i silnika zawiera szacunkowe dane katalogowe. Moc i moment to orientacyjne możliwości tuningu, a nie pomiary Twojego pojazdu. Dokładne ECU i konfiguracja są sprawdzane przed tuningiem.",
      footer: "Wartości orientacyjne; realizacja po kontroli pojazdu i ECU."
    }
  }[locale];
}

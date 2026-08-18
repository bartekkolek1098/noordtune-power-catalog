import type {Locale} from "@/i18n/routing";

const WHATSAPP_NUMBER = "31685759600";

const genericMessages: Record<Locale, string> = {
  nl: "Hallo NoordTune, ik wil graag een offerte voor chiptuning ontvangen.",
  en: "Hi NoordTune, I would like to receive a quote for tuning.",
  pl: "Cześć NoordTune, chciałbym otrzymać wycenę tuningu."
};

const vehicleMessages: Record<Locale, (vehicle: string) => string> = {
  nl: (vehicle) =>
    `Hallo NoordTune, ik ben geïnteresseerd in tuning voor mijn ${vehicle}. Ik ontvang graag een offerte.`,
  en: (vehicle) =>
    `Hi NoordTune, I'm interested in tuning my ${vehicle}. I would like to receive a quote.`,
  pl: (vehicle) =>
    `Cześć, jestem zainteresowany tuningiem ${vehicle}. Chciałbym dostać ofertę.`
};

export function whatsappHref({
  locale,
  message,
  vehicleLabel
}: {
  locale: Locale;
  message?: string;
  vehicleLabel?: string;
}) {
  const text = message
    ? message
    : vehicleLabel
    ? vehicleMessages[locale](vehicleLabel)
    : genericMessages[locale];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function createLookupQuoteMessage({
  displacementCc,
  exactMatch,
  fuel,
  locale,
  options,
  plate,
  price,
  recommendedPackage,
  stage,
  vehicle,
  vehiclePower
}: {
  displacementCc?: number | null;
  exactMatch: boolean;
  fuel?: string;
  locale: Locale;
  options: string[];
  plate: string;
  price: string;
  recommendedPackage?: string;
  stage: string;
  vehicle: string;
  vehiclePower?: string;
}) {
  const optionText = options.length > 0 ? options.join(", ") : "-";

  if (!exactMatch) {
    return createManualReviewMessage({
      displacementCc,
      fuel,
      locale,
      optionText,
      plate,
      price,
      stage,
      vehicle,
      vehiclePower
    });
  }

  if (locale === "en") {
    return `Hello NoordTune, I would like a quote for this car:
Language: English
Plate: ${plate}
Car: ${vehicle}${vehiclePower ? `\nPower: ${vehiclePower}` : ""}
Stage: ${stage}${recommendedPackage ? `\nRecommended package selected: ${recommendedPackage}` : ""}
Extra options: ${optionText}
Estimated price: ${price}
RDW catalog match: please confirm the exact engine/ECU variant and final setup.
Could you check this and advise?`;
  }

  if (locale === "pl") {
    return `Cześć NoordTune, proszę o wycenę tego auta:
Język: polski
Rejestracja: ${plate}
Auto: ${vehicle}${vehiclePower ? `\nMoc: ${vehiclePower}` : ""}
Stage: ${stage}${recommendedPackage ? `\nWybrany polecany pakiet: ${recommendedPackage}` : ""}
Opcje dodatkowe: ${optionText}
Orientacyjna cena: ${price}
Wynik dopasowania RDW: proszę potwierdzić dokładny wariant silnika/ECU i końcową konfigurację.
Proszę o sprawdzenie i poradę.`;
  }

  return `Hallo NoordTune, ik wil graag een offerte voor deze auto:
Taal: Nederlands
Kenteken: ${plate}
Auto: ${vehicle}${vehiclePower ? `\nVermogen: ${vehiclePower}` : ""}
Stage: ${stage}${recommendedPackage ? `\nAanbevolen pakket geselecteerd: ${recommendedPackage}` : ""}
Extra opties: ${optionText}
Indicatie: ${price}
RDW-catalogusmatch: controleer de exacte motor-/ECU-variant en definitieve setup.
Kunnen jullie dit controleren en advies geven?`;
}

export function createVehicleQuoteMessage({
  locale,
  options,
  price,
  recommendedPackage,
  stage,
  vehicle,
  vehiclePower
}: {
  locale: Locale;
  options: string[];
  price: string;
  recommendedPackage?: string;
  stage: string;
  vehicle: string;
  vehiclePower: string;
}) {
  const optionText = options.length > 0 ? options.join(", ") : "-";

  if (locale === "en") {
    return `Hello NoordTune, I would like a quote for this car:
Language: English
Car: ${vehicle}
Power: ${vehiclePower}
Stage: ${stage}${recommendedPackage ? `\nRecommended package selected: ${recommendedPackage}` : ""}
Extra options: ${optionText}
Estimated price: ${price}
Could you check this and advise?`;
  }

  if (locale === "pl") {
    return `Cześć NoordTune, proszę o wycenę tego auta:
Język: polski
Auto: ${vehicle}
Moc: ${vehiclePower}
Stage: ${stage}${recommendedPackage ? `\nWybrany polecany pakiet: ${recommendedPackage}` : ""}
Opcje dodatkowe: ${optionText}
Orientacyjna cena: ${price}
Proszę o sprawdzenie i poradę.`;
  }

  return `Hallo NoordTune, ik wil graag een offerte voor deze auto:
Taal: Nederlands
Auto: ${vehicle}
Vermogen: ${vehiclePower}
Stage: ${stage}${recommendedPackage ? `\nAanbevolen pakket geselecteerd: ${recommendedPackage}` : ""}
Extra opties: ${optionText}
Indicatie: ${price}
Kunnen jullie dit controleren en advies geven?`;
}

export function createPurchaseInspectionMessage({
  apkStatus,
  attentionSignals,
  locale,
  odometerJudgement,
  plate,
  recalls,
  vehicle
}: {
  apkStatus: string;
  attentionSignals: string[];
  locale: Locale;
  odometerJudgement: string;
  plate: string;
  recalls: string;
  vehicle: string;
}) {
  const attentionText = attentionSignals.length > 0 ? attentionSignals.join(", ") : "-";

  if (locale === "en") {
    return `Hello NoordTune, I am considering buying this car and would like a technical pre-purchase inspection.

Plate: ${plate}
Car: ${vehicle}
APK: ${apkStatus}
Odometer judgement: ${odometerJudgement}
Recalls: ${recalls}
RDW attention points: ${attentionText}

Could you check diagnostics, fault codes, live data and the technical condition?`;
  }

  if (locale === "pl") {
    return `Cześć NoordTune, rozważam zakup tego auta i proszę o techniczną kontrolę przed zakupem.

Rejestracja: ${plate}
Auto: ${vehicle}
APK: ${apkStatus}
Ocena licznika: ${odometerJudgement}
Akcje serwisowe: ${recalls}
Punkty wymagające uwagi według RDW: ${attentionText}

Czy możecie sprawdzić diagnostykę, kody błędów, live data i stan techniczny?`;
  }

  return `Hallo NoordTune, ik overweeg deze auto te kopen en wil graag een technische aankoopcontrole.

Kenteken: ${plate}
Auto: ${vehicle}
APK: ${apkStatus}
Tellerstandoordeel: ${odometerJudgement}
Terugroepacties: ${recalls}
RDW-aandachtspunten: ${attentionText}

Kunnen jullie diagnose, foutcodes, live data en de technische staat controleren?`;
}

function createManualReviewMessage({
  displacementCc,
  fuel,
  locale,
  optionText,
  plate,
  price,
  stage,
  vehicle,
  vehiclePower
}: {
  displacementCc?: number | null;
  fuel?: string;
  locale: Locale;
  optionText: string;
  plate: string;
  price: string;
  stage: string;
  vehicle: string;
  vehiclePower?: string;
}) {
  const displacementLine = displacementCc ? `${displacementCc} cc` : undefined;

  if (locale === "en") {
    return `Hello NoordTune, I would like you to manually check this car.
Plate: ${plate}
Car: ${vehicle}${fuel ? `\nFuel: ${fuel}` : ""}${vehiclePower ? `\nRDW power: ${vehiclePower}` : ""}${displacementLine ? `\nDisplacement: ${displacementLine}` : ""}
Catalog: no exact match
Indicative choice: ${stage}
Extra options: ${optionText}
Estimated price: ${price}
Could you confirm the ECU/engine variant and advise?`;
  }

  if (locale === "pl") {
    return `Cześć NoordTune, proszę o ręczne sprawdzenie tego auta.
Rejestracja: ${plate}
Auto: ${vehicle}${fuel ? `\nPaliwo: ${fuel}` : ""}${vehiclePower ? `\nMoc z RDW: ${vehiclePower}` : ""}${displacementLine ? `\nPojemność: ${displacementLine}` : ""}
Katalog: brak dokładnego dopasowania
Orientacyjny wybór: ${stage}
Opcje dodatkowe: ${optionText}
Orientacyjna cena: ${price}
Proszę o potwierdzenie ECU/wariantu silnika i poradę.`;
  }

  return `Hallo NoordTune, ik wil graag dat jullie deze auto handmatig controleren.
Kenteken: ${plate}
Auto: ${vehicle}${fuel ? `\nBrandstof: ${fuel}` : ""}${vehiclePower ? `\nRDW vermogen: ${vehiclePower}` : ""}${displacementLine ? `\nCilinderinhoud: ${displacementLine}` : ""}
Catalogus: geen exacte match
Indicatieve keuze: ${stage}
Extra opties: ${optionText}
Indicatie: ${price}
Kunnen jullie de ECU/motorvariant controleren en advies geven?`;
}

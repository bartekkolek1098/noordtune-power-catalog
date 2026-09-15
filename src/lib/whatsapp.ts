import type {Locale} from "@/i18n/routing";
import type {EstimateStage} from "../data/tuning-estimates-shared.ts";
import {formatEstimatePower, formatEstimateTorque} from "./estimate-copy.ts";
import {
  conditionalBudgetNote,
  formatAccessAssessment,
  formatQuote,
  formatQuoteScope,
  type AccessAssessment,
  type CatalogMatchStatus,
  type QuoteResolution
} from "../data/pricing.ts";

const WHATSAPP_NUMBER = "31685759600";

const genericMessages: Record<Locale, string> = {
  nl: "Hallo NoordTune, ik wil graag een offerte voor chiptuning ontvangen.",
  en: "Hi NoordTune, I would like to receive a quote for tuning.",
  pl: "Cześć NoordTune, chciałbym otrzymać wycenę tuningu."
};

const vehicleMessages: Record<Locale, (vehicle: string) => string> = {
  nl: (vehicle) => `Hallo NoordTune, ik ben geïnteresseerd in tuning voor mijn ${vehicle}. Ik ontvang graag een offerte.`,
  en: (vehicle) => `Hi NoordTune, I'm interested in tuning my ${vehicle}. I would like to receive a quote.`,
  pl: (vehicle) => `Cześć, jestem zainteresowany tuningiem ${vehicle}. Chciałbym dostać ofertę.`
};

export function whatsappHref({locale, message, vehicleLabel}: {
  locale: Locale;
  message?: string;
  vehicleLabel?: string;
}) {
  const text = message ?? (vehicleLabel ? vehicleMessages[locale](vehicleLabel) : genericMessages[locale]);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export type VehicleQuoteMessageInput = {
  locale: Locale;
  options: string[];
  quote: QuoteResolution;
  access?: AccessAssessment;
  matchStatus?: CatalogMatchStatus;
  recommendedPackage?: string;
  stage: string;
  vehicle: string;
  vehiclePower?: string;
  registeredPower?: {value: number; unit: string} | null;
  displacementCc?: number | null;
  fuel?: string;
  firstAdmission?: string | null;
  firstAdmissionYear?: number | null;
  engine?: string;
  estimateProfileLabel?: string;
  estimateSource?: string;
  estimateNotes?: string[];
  indicativeOutput?: Pick<EstimateStage, "powerHp" | "torqueNm" | "powerRangeHp" | "torqueRangeNm">;
};

export function createLookupQuoteMessage(input: VehicleQuoteMessageInput & {plate: string}) {
  return createQuoteMessage(input);
}

export function createVehicleQuoteMessage(input: VehicleQuoteMessageInput) {
  return createQuoteMessage(input);
}

function formatFirstAdmission(input: VehicleQuoteMessageInput, unavailable: string) {
  const raw = input.firstAdmission;
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00.000Z`);
    if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === raw) {
      const localized = new Intl.DateTimeFormat(
        {nl: "nl-NL", en: "en-GB", pl: "pl-PL"}[input.locale],
        {day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"}
      ).format(date);
      return `${localized} (${date.getUTCFullYear()})`;
    }
  }
  return !raw && Number.isInteger(input.firstAdmissionYear) &&
    input.firstAdmissionYear! >= 1886 && input.firstAdmissionYear! <= 9999
    ? String(input.firstAdmissionYear)
    : unavailable;
}

const copy = {
  nl: {
    intro: "Hallo NoordTune, ik wil graag een offerte voor deze auto:",
    language: "Taal: Nederlands", plate: "Kenteken", vehicle: "Auto", fuel: "Brandstof",
    registration: "Eerste toelating", unavailable: "Niet beschikbaar", displacement: "Cilinderinhoud",
    power: "Vermogen", registeredPower: "RDW geregistreerd vermogen", catalog: "Catalogus",
    access: "ECU/toegang", stage: "Stage", recommended: "Aanbevolen pakket geselecteerd",
    options: "Extra opties", price: "Prijs",
    requestPrice: "Prijs: op aanvraag na ECU- en voertuigcontrole",
    confirm: "Exacte motor-/ECU-variant en definitieve setup te bevestigen.",
    end: "Kunnen jullie dit controleren en advies geven?",
    engine: "Motorprofiel", output: "Indicatieve uitkomst", profile: "Catalogusindicatie — ECU-controle vóór uitvoering",
    matches: {"catalog-match": "Catalogusindicatie — ECU-controle vóór uitvoering", ambiguous: "Passend indicatief profiel te bevestigen", conflict: "Geen passend profiel geselecteerd; voertuiggegevens controleren", "no-match": "Nog geen toepasselijk tuningprofiel"}
  },
  en: {
    intro: "Hello NoordTune, I would like a quote for this car:",
    language: "Language: English", plate: "Plate", vehicle: "Car", fuel: "Fuel",
    registration: "First registration", unavailable: "Unavailable", displacement: "Displacement",
    power: "Power", registeredPower: "RDW registered power", catalog: "Catalog",
    access: "ECU/access", stage: "Stage", recommended: "Recommended package selected",
    options: "Extra options", price: "Price",
    requestPrice: "Price: on request after ECU and vehicle verification",
    confirm: "Exact engine/ECU variant and final setup to be confirmed.",
    end: "Could you check this and advise?",
    engine: "Engine profile", output: "Indicative output", profile: "Catalog estimate — ECU check before work",
    matches: {"catalog-match": "Catalog estimate — ECU check before work", ambiguous: "Applicable indicative profile to be confirmed", conflict: "No applicable profile selected; check vehicle details", "no-match": "No applicable tuning profile yet"}
  },
  pl: {
    intro: "Cześć NoordTune, proszę o wycenę tego auta:",
    language: "Język: polski", plate: "Rejestracja", vehicle: "Auto", fuel: "Paliwo",
    registration: "Pierwsza rejestracja", unavailable: "Brak danych", displacement: "Pojemność",
    power: "Moc", registeredPower: "Moc zarejestrowana w RDW", catalog: "Katalog",
    access: "ECU/dostęp", stage: "Stage", recommended: "Wybrany polecany pakiet",
    options: "Opcje dodatkowe", price: "Cena",
    requestPrice: "Cena: wycena indywidualna po weryfikacji ECU i pojazdu",
    confirm: "Dokładny wariant silnika/ECU i końcowa konfiguracja do potwierdzenia.",
    end: "Proszę o sprawdzenie i poradę.",
    engine: "Profil silnika", output: "Orientacyjny wynik", profile: "Wartości katalogowe — kontrola ECU przed wykonaniem",
    matches: {"catalog-match": "Wartości katalogowe — kontrola ECU przed wykonaniem", ambiguous: "Odpowiedni profil orientacyjny do potwierdzenia", conflict: "Brak wybranego odpowiedniego profilu; sprawdzenie danych pojazdu", "no-match": "Brak odpowiedniego profilu tuningowego"}
  }
} as const;

function createQuoteMessage(input: VehicleQuoteMessageInput & {plate?: string}) {
  const text = copy[input.locale];
  const access = input.access ?? {status: "unknown", reasonCode: "installed-ecu-not-identified"};
  const power = input.registeredPower
    ? `${input.registeredPower.value} ${input.registeredPower.unit}`
    : input.vehiclePower;
  const budget = conditionalBudgetNote(input.quote, input.locale);
  const scope = formatQuoteScope(input.quote, input.locale);
  const output = [
    input.indicativeOutput?.powerHp !== undefined || input.indicativeOutput?.powerRangeHp ? formatEstimatePower(input.indicativeOutput, input.locale) : undefined,
    input.indicativeOutput?.torqueNm !== undefined || input.indicativeOutput?.torqueRangeNm ? formatEstimateTorque(input.indicativeOutput, input.locale) : undefined
  ].filter(Boolean).join(" / ");
  return [
    text.intro,
    text.language,
    input.plate ? `${text.plate}: ${input.plate}` : undefined,
    `${text.vehicle}: ${input.vehicle}`,
    `${text.registration}: ${formatFirstAdmission(input, text.unavailable)}`,
    input.fuel ? `${text.fuel}: ${input.fuel}` : undefined,
    input.displacementCc ? `${text.displacement}: ${input.displacementCc} cc` : undefined,
    input.engine ? `${text.engine}: ${input.engine}` : undefined,
    power ? `${input.plate ? text.registeredPower : text.power}: ${power}` : undefined,
    input.estimateProfileLabel ? `${text.profile}: ${input.estimateProfileLabel}` : `${text.catalog}: ${text.matches[input.matchStatus ?? "catalog-match"]}`,
    input.estimateSource ? `${text.catalog}: ${input.estimateSource}` : undefined,
    `${text.access}: ${formatAccessAssessment(access, input.locale)}`,
    `${text.stage}: ${input.stage}`,
    output ? `${text.output}: ${output}` : undefined,
    ...(input.estimateNotes ?? []),
    input.recommendedPackage ? `${text.recommended}: ${input.recommendedPackage}` : undefined,
    `${text.options}: ${input.options.length ? input.options.join(", ") : "-"}`,
    input.quote.kind === "on-request" ? text.requestPrice : `${text.price}: ${formatQuote(input.quote, input.locale)}`,
    budget,
    scope,
    text.confirm,
    text.end
  ].filter((line): line is string => line !== undefined).join("\n");
}

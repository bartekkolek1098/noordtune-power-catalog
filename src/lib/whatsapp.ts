import type {Locale} from "@/i18n/routing";

const WHATSAPP_NUMBER = "31685759600";

const genericMessages: Record<Locale, string> = {
  nl: "Hallo NoordTune, ik wil graag een offerte voor chiptuning ontvangen.",
  en: "Hi NoordTune, I would like to receive a quote for tuning.",
  pl: "Czesc NoordTune, chcialbym otrzymac wycene tuningu."
};

const vehicleMessages: Record<Locale, (vehicle: string) => string> = {
  nl: (vehicle) =>
    `Hallo NoordTune, ik ben geinteresseerd in tuning voor mijn ${vehicle}. Ik ontvang graag een offerte.`,
  en: (vehicle) =>
    `Hi NoordTune, I'm interested in tuning my ${vehicle}. I would like to receive a quote.`,
  pl: (vehicle) =>
    `Czesc, jestem zainteresowany tuningiem ${vehicle}. Chcialbym dostac oferte.`
};

export function whatsappHref({
  locale,
  vehicleLabel
}: {
  locale: Locale;
  vehicleLabel?: string;
}) {
  const message = vehicleLabel
    ? vehicleMessages[locale](vehicleLabel)
    : genericMessages[locale];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

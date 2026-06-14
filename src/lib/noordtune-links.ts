import type {Locale} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";

export const MAIN_SITE_URL = "https://www.noordtune.nl";

type LinkItem = {
  href: string;
  label: string;
};

export const whatsappPhoneLabel = "+31 685 759 600";
export const whatsappPhoneHref = "tel:+31685759600";

export function mainLocaleHref(locale: Locale) {
  return `${MAIN_SITE_URL}/${locale}`;
}

export function catalogHref(locale: Locale) {
  return sitePath(`/${locale}`);
}

export function chiptuningHref(locale: Locale) {
  const paths: Record<Locale, string> = {
    nl: "/nl/chiptuning",
    en: "/en/chiptuning",
    pl: "/pl/chiptuning"
  };

  return `${MAIN_SITE_URL}${paths[locale]}`;
}

export function mainNavItems(locale: Locale): Array<LinkItem & {active?: boolean}> {
  const nav: Record<Locale, Array<LinkItem & {active?: boolean}>> = {
    nl: [
      {href: `${MAIN_SITE_URL}/nl`, label: "Home"},
      {href: `${MAIN_SITE_URL}/nl/chiptuning`, label: "Chiptuning"},
      {href: catalogHref("nl"), label: "Catalogus", active: true},
      {href: `${MAIN_SITE_URL}/nl/auto-diagnose`, label: "Diagnose"},
      {href: `${MAIN_SITE_URL}/nl/prijzen`, label: "Prijzen"},
      {href: `${MAIN_SITE_URL}/nl/resultaten`, label: "Resultaten"},
      {href: `${MAIN_SITE_URL}/nl/contact`, label: "Contact"}
    ],
    en: [
      {href: `${MAIN_SITE_URL}/en`, label: "Home"},
      {href: `${MAIN_SITE_URL}/en/chiptuning`, label: "Chiptuning"},
      {href: catalogHref("en"), label: "Power Catalog", active: true},
      {href: `${MAIN_SITE_URL}/en/car-diagnostics`, label: "Diagnostics"},
      {href: `${MAIN_SITE_URL}/en/pricing`, label: "Pricing"},
      {href: `${MAIN_SITE_URL}/en/results`, label: "Results"},
      {href: `${MAIN_SITE_URL}/en/contact`, label: "Contact"}
    ],
    pl: [
      {href: `${MAIN_SITE_URL}/pl`, label: "Start"},
      {href: `${MAIN_SITE_URL}/pl/chiptuning`, label: "Chiptuning"},
      {href: catalogHref("pl"), label: "Katalog mocy", active: true},
      {href: `${MAIN_SITE_URL}/pl/diagnostyka-samochodowa`, label: "Diagnostyka"},
      {href: `${MAIN_SITE_URL}/pl/cennik`, label: "Cennik"},
      {href: `${MAIN_SITE_URL}/pl/rezultaty`, label: "Rezultaty"},
      {href: `${MAIN_SITE_URL}/pl/kontakt`, label: "Kontakt"}
    ]
  };

  return nav[locale];
}

export function legalLinks(locale: Locale): LinkItem[] {
  const links: Record<Locale, LinkItem[]> = {
    nl: [
      {href: `${MAIN_SITE_URL}/nl/privacybeleid`, label: "Privacy"},
      {href: `${MAIN_SITE_URL}/nl/algemene-voorwaarden`, label: "Algemene voorwaarden"}
    ],
    en: [
      {href: `${MAIN_SITE_URL}/en/privacy-policy`, label: "Privacy"},
      {href: `${MAIN_SITE_URL}/en/terms`, label: "Terms"}
    ],
    pl: [
      {href: `${MAIN_SITE_URL}/pl/polityka-prywatnosci`, label: "Polityka prywatności"},
      {href: `${MAIN_SITE_URL}/pl/regulamin`, label: "Regulamin"}
    ]
  };

  return links[locale];
}

export function footerCopy(locale: Locale) {
  const copy: Record<
    Locale,
    {
      description: string;
      contact: string;
      hours: string;
      links: string;
      legal: string;
      whatsapp: string;
      location: string;
      openingHours: string;
    }
  > = {
    nl: {
      description:
        "Professionele chiptuning, auto diagnose en maatwerk optimalisatie vanuit Assen.",
      contact: "Contact",
      hours: "Openingstijden",
      links: "NoordTune.nl",
      legal: "Juridisch",
      whatsapp: "WhatsApp",
      location: "Locatie",
      openingHours: "Ma - Za: 09:00 - 18:00"
    },
    en: {
      description:
        "Professional chiptuning, car diagnostics and custom calibration from Assen.",
      contact: "Contact",
      hours: "Opening hours",
      links: "NoordTune.nl",
      legal: "Legal",
      whatsapp: "WhatsApp",
      location: "Location",
      openingHours: "Mon - Sat: 09:00 - 18:00"
    },
    pl: {
      description:
        "Profesjonalny chiptuning, diagnostyka samochodowa i indywidualna optymalizacja w Assen.",
      contact: "Kontakt",
      hours: "Godziny otwarcia",
      links: "NoordTune.nl",
      legal: "Dokumenty",
      whatsapp: "WhatsApp",
      location: "Lokalizacja",
      openingHours: "Pon - Sob: 09:00 - 18:00"
    }
  };

  return copy[locale];
}

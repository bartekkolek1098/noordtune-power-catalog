import type {Locale} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {NOORDTUNE_BUSINESS} from "@/lib/business-info";

export const MAIN_SITE_URL = NOORDTUNE_BUSINESS.url;

type LinkItem = {
  href: string;
  label: string;
};

export const whatsappPhoneLabel = NOORDTUNE_BUSINESS.telephoneLabel;
export const whatsappPhoneHref = `tel:${NOORDTUNE_BUSINESS.telephone}`;

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

/**
 * Navigation parity with noordtune-www/src/content/site.ts:
 * same links, order and translated labels across both subdomains.
 */
export function mainNavItems(locale: Locale): Array<LinkItem & {active?: boolean}> {
  const routes: Array<{
    label: Record<Locale, string>;
    route?: Record<Locale, string>;
    catalog?: true;
  }> = [
    {label:{nl:"Home",en:"Home",pl:"Start"},route:{nl:"",en:"",pl:""}},
    {label:{nl:"Catalogus",en:"Power Catalog",pl:"Katalog mocy"},catalog:true},
    {label:{nl:"Chiptuning",en:"Chiptuning",pl:"Chiptuning"},route:{nl:"chiptuning",en:"chiptuning",pl:"chiptuning"}},
    {label:{nl:"Diagnose",en:"Diagnostics",pl:"Diagnostyka"},route:{nl:"auto-diagnose",en:"car-diagnostics",pl:"diagnostyka-samochodowa"}},
    {label:{nl:"Diensten",en:"Services",pl:"Usługi"},route:{nl:"diensten",en:"services",pl:"uslugi"}},
    {label:{nl:"Prijzen",en:"Pricing",pl:"Cennik"},route:{nl:"prijzen",en:"pricing",pl:"cennik"}},
    {label:{nl:"Resultaten",en:"Results",pl:"Rezultaty"},route:{nl:"resultaten",en:"results",pl:"rezultaty"}},
    {label:{nl:"Nieuws & Blog",en:"News & Blog",pl:"Aktualności"},route:{nl:"blog",en:"news-blog",pl:"aktualnosci-blog"}},
    {label:{nl:"Over ons",en:"About",pl:"O nas"},route:{nl:"over-ons",en:"about",pl:"o-nas"}},
    {label:{nl:"Contact",en:"Contact",pl:"Kontakt"},route:{nl:"contact",en:"contact",pl:"kontakt"}}
  ];

  return routes.map((item) => ({
    label: item.label[locale],
    href: item.catalog
      ? catalogHref(locale)
      : MAIN_SITE_URL + "/" + locale + (item.route?.[locale] ? "/" + item.route[locale] : ""),
    active: Boolean(item.catalog)
  }));
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
        "De vermogenscatalogus van NoordTune.nl. Bekijk RDW-gegevens en Stage 1-referenties per voertuig. Onze diensten en afspraken vind je op de hoofdwebsite.",
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
        "The dedicated power catalog by NoordTune.nl. Browse RDW facts and Stage 1 engine references; find services and appointments on the main website.",
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
        "Katalog mocy NoordTune.nl z danymi RDW i orientacyjnymi wynikami Stage 1. Oferta usług i terminy znajdują się na stronie głównej.",
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

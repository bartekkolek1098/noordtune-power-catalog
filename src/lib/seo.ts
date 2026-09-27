import type {Metadata} from "next";
import type {EngineVariant, StageDefinition} from "@/data/catalog-shared";
import {getVehicleSeoSlugs, stageSlugMap} from "@/data/catalog";
import {routing, type Locale} from "@/i18n/routing";
import {absoluteUrl} from "@/lib/site-url";
import {NOORDTUNE_BUSINESS} from "@/lib/business-info";
import {
  brandedSeoTitle,
  homepageMetadataCopy,
  stageMetadataCopy,
  vehicleMetadataCopy
} from "@/lib/seo-copy";

export {absoluteUrl, POWER_SITE_URL} from "@/lib/site-url";
export {quoteOfferFields} from "@/lib/quote-offer";

const localeMeta: Record<
  Locale,
  {
    og: string;
  }
> = {
  nl: {
    og: "nl_NL"
  },
  en: {
    og: "en_US"
  },
  pl: {
    og: "pl_PL"
  }
};

export {brandedSeoTitle, homepageMetadataCopy};

export function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return absoluteUrl(path);
}

export function vehicleDetailPath(locale: Locale, vehicle: EngineVariant) {
  return `/${locale}/vehicles/${vehicle.id}`;
}

export function stageSeoPath(
  locale: Locale,
  vehicle: EngineVariant,
  stageName: StageDefinition["name"]
) {
  const slugs = getVehicleSeoSlugs(vehicle);

  return `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stageName]}`;
}

export function stageSeoPathWithoutLocale(
  vehicle: EngineVariant,
  stageName: StageDefinition["name"]
) {
  const slugs = getVehicleSeoSlugs(vehicle);

  return `/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stageName]}`;
}

export function alternateLanguageUrls(pathWithoutLocale: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(`/${locale}${pathWithoutLocale}`)
    ])
  ) as Record<Locale, string>;
}

export function vehicleMetadata(
  locale: Locale,
  vehicle: EngineVariant
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const {title, description} = vehicleMetadataCopy(locale, vehicle);

  return sharedMetadata(locale, title, description, vehicle, absoluteUrl(vehicleDetailPath(locale, vehicle)));
}

export function stageMetadata(
  locale: Locale,
  vehicle: EngineVariant,
  stage: StageDefinition
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const {title, description} = stageMetadataCopy(locale, vehicle, stage);
  const url = absoluteUrl(stageSeoPath(locale, vehicle, stage.name));

  return sharedMetadata(locale, title, description, vehicle, url);
}

export function breadcrumbListJsonLd(items: Array<{name: string; url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function noordTuneProviderJsonLd() {
  return {
    "@type": "AutoRepair",
    name: NOORDTUNE_BUSINESS.name,
    url: NOORDTUNE_BUSINESS.url,
    telephone: NOORDTUNE_BUSINESS.telephone,
    email: NOORDTUNE_BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: NOORDTUNE_BUSINESS.address.locality,
      addressCountry: NOORDTUNE_BUSINESS.address.countryCode
    }
  };
}

export function areaServedJsonLd() {
  return [
    { "@type": "City", name: "Assen" },
    { "@type": "AdministrativeArea", name: "Drenthe" },
    { "@type": "City", name: "Groningen" },
    { "@type": "Country", name: "Netherlands" }
  ];
}

function sharedMetadata(
  locale: Locale,
  title: string,
  description: string,
  vehicle: EngineVariant,
  url: string
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const image = absoluteAssetUrl(vehicle.image);
  const socialTitle = brandedSeoTitle(title);

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: "NoordTune Power Catalog",
      locale: localeMeta[locale].og,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${vehicle.brand} ${vehicle.model} ${vehicle.engine}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image]
    }
  };
}

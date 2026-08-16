import type {Metadata} from "next";
import type {EngineVariant, StageDefinition} from "@/data/catalog-shared";
import {getVehicleSeoSlugs, stageSlugMap} from "@/data/catalog";
import {routing, type Locale} from "@/i18n/routing";
import {MAIN_SITE_URL} from "@/lib/noordtune-links";
import {absoluteUrl} from "@/lib/site-url";

export {absoluteUrl, POWER_SITE_URL} from "@/lib/site-url";

const localeMeta: Record<
  Locale,
  {
    og: string;
    powerUnit: string;
    vehicleTitleSuffix: string;
    stageTitleSuffix: string;
    from: string;
    to: string;
    and: string;
    area: string;
    catalog: string;
  }
> = {
  nl: {
    og: "nl_NL",
    powerUnit: "pk",
    vehicleTitleSuffix: "chiptuning | Stage 1 tuning NoordTune",
    stageTitleSuffix: "chiptuning NoordTune",
    from: "van",
    to: "naar",
    and: "en",
    area: "Assen, Drenthe en Groningen",
    catalog: "NoordTune Power Catalog"
  },
  en: {
    og: "en_US",
    powerUnit: "hp",
    vehicleTitleSuffix: "tuning | Stage 1 remap NoordTune",
    stageTitleSuffix: "tuning NoordTune",
    from: "from",
    to: "to",
    and: "and",
    area: "Assen, Drenthe and Groningen",
    catalog: "NoordTune Power Catalog"
  },
  pl: {
    og: "pl_PL",
    powerUnit: "KM",
    vehicleTitleSuffix: "chiptuning | Stage 1 NoordTune",
    stageTitleSuffix: "chiptuning NoordTune",
    from: "z",
    to: "do",
    and: "i",
    area: "Assen, Drenthe i Groningen",
    catalog: "NoordTune Power Catalog"
  }
};

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
  const meta = localeMeta[locale];
  const stage = vehicle.stages[0];
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.engine} ${meta.vehicleTitleSuffix}`;
  const description =
    locale === "en"
      ? `${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${meta.from} ${vehicle.stockPowerHp} ${meta.powerUnit} ${meta.to} ${stage.powerHp} ${meta.powerUnit} ${meta.and} ${stage.torqueNm} Nm, from €${stage.price}. Vehicle-specific estimate in the ${meta.catalog} for ${meta.area}.`
      : locale === "pl"
        ? `${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${meta.from} ${vehicle.stockPowerHp} ${meta.powerUnit} ${meta.to} ${stage.powerHp} ${meta.powerUnit} ${meta.and} ${stage.torqueNm} Nm, od €${stage.price}. Wycena orientacyjna w ${meta.catalog} dla ${meta.area}.`
        : `${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${meta.from} ${vehicle.stockPowerHp} ${meta.powerUnit} ${meta.to} ${stage.powerHp} ${meta.powerUnit} ${meta.and} ${stage.torqueNm} Nm, vanaf €${stage.price}. Voertuigspecifieke indicatie in de ${meta.catalog} voor ${meta.area}.`;

  return sharedMetadata(locale, title, description, vehicle, absoluteUrl(vehicleDetailPath(locale, vehicle)));
}

export function stageMetadata(
  locale: Locale,
  vehicle: EngineVariant,
  stage: StageDefinition
): Pick<Metadata, "title" | "description" | "openGraph" | "twitter"> {
  const meta = localeMeta[locale];
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.engine} ${stage.name} | ${stage.powerHp} ${meta.powerUnit} ${meta.stageTitleSuffix}`;
  const description =
    locale === "en"
      ? `${stage.name} for ${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${vehicle.stockPowerHp} ${meta.powerUnit} to ${stage.powerHp} ${meta.powerUnit}, ${stage.torqueNm} Nm, from €${stage.price}. NoordTune Power Catalog estimate for ECU tuning around ${meta.area}.`
      : locale === "pl"
        ? `${stage.name} dla ${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${vehicle.stockPowerHp} ${meta.powerUnit} do ${stage.powerHp} ${meta.powerUnit}, ${stage.torqueNm} Nm, od €${stage.price}. Orientacyjna wycena ECU tuning w NoordTune Power Catalog dla ${meta.area}.`
        : `${stage.name} voor ${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${vehicle.stockPowerHp} ${meta.powerUnit} naar ${stage.powerHp} ${meta.powerUnit}, ${stage.torqueNm} Nm, vanaf €${stage.price}. NoordTune Power Catalog indicatie voor ECU tuning rond ${meta.area}.`;
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
    name: "NoordTune",
    url: MAIN_SITE_URL,
    telephone: "+31685759600",
    address: {
      "@type": "PostalAddress",
      streetAddress: "A. Vogelstraat 1",
      postalCode: "9406 XD",
      addressLocality: "Assen",
      addressCountry: "NL"
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

  return {
    title,
    description,
    openGraph: {
      title,
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
      title,
      description,
      images: [image]
    }
  };
}

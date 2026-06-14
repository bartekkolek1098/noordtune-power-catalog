import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {
  engineCatalog,
  getStageNameFromSlug,
  getVehicleBySeoSlugs,
  getVehicleSeoSlugs,
  stageSlugMap
} from "@/data/catalog";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {VehicleDetail} from "@/components/vehicle-detail";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {catalogHref, chiptuningHref, mainLocaleHref} from "@/lib/noordtune-links";
import {assetPath, sitePath} from "@/lib/site-path";

type PageProps = {
  params: Promise<{
    locale: string;
    brand: string;
    model: string;
    engine: string;
    stage: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    engineCatalog.flatMap((vehicle) => {
      const slugs = getVehicleSeoSlugs(vehicle);

      return vehicle.stages.map((stage) => ({
        locale,
        brand: slugs.brand,
        model: slugs.model,
        engine: slugs.engine,
        stage: stageSlugMap[stage.name]
      }));
    })
  );
}

export async function generateMetadata({params}: PageProps) {
  const {locale, brand, model, engine, stage} = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const vehicle = getVehicleBySeoSlugs(brand, model, engine);
  const stageName = getStageNameFromSlug(stage);
  const selectedStage = vehicle?.stages.find((item) => item.name === stageName);
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";
  const fromWord = safeLocale === "en" ? "from" : safeLocale === "pl" ? "z" : "van";
  const toWord = safeLocale === "en" ? "to" : safeLocale === "pl" ? "do" : "naar";
  const andWord = safeLocale === "en" ? "and" : safeLocale === "pl" ? "i" : "en";
  const priceFrom = safeLocale === "en" ? "from" : safeLocale === "pl" ? "od" : "vanaf";

  if (!vehicle || !stageName || !selectedStage) {
    return {};
  }

  const slugs = getVehicleSeoSlugs(vehicle);
  const path = `/${slugs.brand}/${slugs.model}/${slugs.engine}/${stage}`;

  return {
    title: `${stageName} ${vehicle.brand} ${vehicle.model} ${vehicle.engine} chiptuning`,
    description: `${vehicle.brand} ${vehicle.model} ${stageName}: ${fromWord} ${vehicle.stockPowerHp} ${powerUnit} ${toWord} ${selectedStage.powerHp} ${powerUnit} ${andWord} ${selectedStage.torqueNm} Nm ${priceFrom} €${selectedStage.price}.`,
    alternates: {
      canonical: sitePath(`/${safeLocale}${path}`),
      languages: {
        nl: sitePath(`/nl${path}`),
        en: sitePath(`/en${path}`),
        pl: sitePath(`/pl${path}`)
      }
    }
  };
}

export default async function VehicleStagePage({params}: PageProps) {
  const {locale, brand, model, engine, stage} = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const vehicle = getVehicleBySeoSlugs(brand, model, engine);
  const stageName = getStageNameFromSlug(stage);

  if (!vehicle || !stageName) {
    notFound();
  }

  const selectedStage = vehicle.stages.find((item) => item.name === stageName);

  if (!selectedStage) {
    notFound();
  }

  const safeLocale = locale as Locale;
  const t = await getTranslations({locale: safeLocale, namespace: "Vehicle"});
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";
  const slugs = getVehicleSeoSlugs(vehicle);
  const stagePath = `/${slugs.brand}/${slugs.model}/${slugs.engine}/${stage}`;
  const catalogLabel = safeLocale === "en" ? "Power Catalog" : safeLocale === "pl" ? "Katalog mocy" : "Catalogus";
  const chiptuningLabel =
    safeLocale === "en"
      ? "Main chiptuning page"
      : safeLocale === "pl"
        ? "Strona chiptuningu"
        : "Chiptuning hoofdsite";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleEngine: vehicle.engine,
    fuelType: vehicle.fuel,
    productionDate: vehicle.yearRange,
    offers: {
      "@type": "Offer",
      price: selectedStage.price,
      priceCurrency: "EUR",
      url: sitePath(`/${safeLocale}${stagePath}`),
      itemOffered: {
        "@type": "Service",
        name: `${stageName} ${vehicle.brand} ${vehicle.model} chiptuning`
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <CatalogHeader locale={safeLocale} languagePath={stagePath} />
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,4,8,.96), rgba(2,4,8,.78) 46%, rgba(2,4,8,.56)), url('${assetPath(vehicle.image)}')`
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(226,0,15,.22),transparent_42%,rgba(255,255,255,.08))]" />
        <div className="container relative z-10 pb-16 pt-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
            <a className="hover:text-primary" href={mainLocaleHref(safeLocale)}>
              NoordTune.nl
            </a>
            <span>/</span>
            <a className="hover:text-primary" href={catalogHref(safeLocale)}>
              {catalogLabel}
            </a>
            <span>/</span>
            <a
              className="hover:text-primary"
              href={sitePath(`/${safeLocale}/vehicles/${vehicle.id}`)}
            >
              {vehicle.brand} {vehicle.model}
            </a>
            <span>/</span>
            <span className="text-white">{stageName}</span>
          </nav>

          <div className="mb-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-[3px]" variant="outline">
              <a href={sitePath(`/${safeLocale}/vehicles/${vehicle.id}`)}>
                {vehicle.brand} {vehicle.model}
              </a>
            </Button>
            <Button asChild className="rounded-[3px]" variant="outline">
              <a href={chiptuningHref(safeLocale)}>{chiptuningLabel}</a>
            </Button>
          </div>
          <div className="max-w-4xl">
            <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
              {stageName} {t("fromPrice")} €{selectedStage.price}
            </Badge>
            <h1 className="racing-title text-5xl leading-none md:text-7xl">
              {vehicle.brand} {vehicle.model} {stageName}
            </h1>
            <p className="mt-4 text-2xl font-bold text-slate-100 md:text-3xl">
              {vehicle.stockPowerHp} {powerUnit} → {selectedStage.powerHp} {powerUnit} ·{" "}
              {selectedStage.torqueNm} Nm
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <VehicleDetail
          initialStageName={stageName}
          locale={safeLocale}
          text={{
            fromPrice: t("fromPrice"),
            calculator: t("calculator"),
            selectStage: t("selectStage"),
            availableOptions: t("availableOptions"),
            packageBreakdown: t("packageBreakdown"),
            requirements: t("requirements"),
            requestQuote: t("requestQuote"),
            whatsapp: t("whatsapp"),
            stock: t("stock"),
            tuned: t("tuned"),
            gain: t("gain"),
            power: t("power"),
            torque: t("torque"),
            ecu: t("ecu"),
            gearbox: t("gearbox"),
            fuel: t("fuel"),
            yearRange: t("yearRange"),
            disclaimer: t("disclaimer"),
            stage1Package: t("stage1Package"),
            stage2Package: t("stage2Package"),
            stage3Package: t("stage3Package"),
            stage1Requirements: t("stage1Requirements"),
            stage2Requirements: t("stage2Requirements"),
            stage3Requirements: t("stage3Requirements")
          }}
          vehicle={vehicle}
        />
      </section>
      <CatalogFooter locale={safeLocale} />
      <FloatingWhatsappButton
        locale={safeLocale}
        mobileCtaOffset
        vehicleLabel={`${vehicle.brand} ${vehicle.model} ${vehicle.engine}`}
      />
    </main>
  );
}

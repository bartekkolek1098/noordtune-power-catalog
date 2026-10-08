import {customerVehicle} from "@/lib/customer-profile";
import {getPublicVehicleSourceExamples} from "@/lib/public-vehicle-source-examples";
import {notFound, permanentRedirect} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {
  engineCatalog,
  getStageNameFromSlug,
  getVehicleBySeoSlugs,
  getVehicleSeoSlugs,
  stageSlugMap
} from "@/data/catalog";
import {isPublicCatalogStageName} from "@/data/catalog-shared";
import {formatQuote, resolveStageQuote} from "@/data/pricing";
import {formatEstimatePower, formatEstimateTorque} from "@/lib/estimate-copy";
import {applyStageHardwarePolicy} from "@/lib/stage-hardware-policy";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {CatalogVerificationNotice} from "@/components/catalog-verification-notice";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {SeoInfoSections} from "@/components/seo-info-sections";
import {VehicleDetail} from "@/components/vehicle-detail";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {catalogHref, chiptuningHref, mainLocaleHref} from "@/lib/noordtune-links";
import {catalogVerificationCopy} from "@/lib/catalog-verification-copy";
import {
  absoluteUrl,
  alternateLanguageUrls,
  areaServedJsonLd,
  breadcrumbListJsonLd,
  noordTuneProviderJsonLd,
  quoteOfferFields,
  stageMetadata,
  stageSeoPath,
  stageSeoPathWithoutLocale,
  vehicleDetailPath
} from "@/lib/seo";
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

      return vehicle.stages.filter((stage) => isPublicCatalogStageName(stage.name)).map((stage) => ({
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
  const displayVehicle = vehicle ? customerVehicle(vehicle) : undefined;
  const selectedStage = displayVehicle?.stages.find((item) => item.name === stageName);

  if (!vehicle || !displayVehicle || !stageName || !selectedStage) {
    return {};
  }

  const path = stageSeoPathWithoutLocale(vehicle, selectedStage.name);

  return {
    ...stageMetadata(safeLocale, displayVehicle, selectedStage),
    alternates: {
      canonical: absoluteUrl(`/${safeLocale}${path}`),
      languages: alternateLanguageUrls(path)
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

  const safeLocale = locale as Locale;

  if (stageName === "Stage 3+") {
    permanentRedirect(stageSeoPath(safeLocale, vehicle, "Stage 2"));
  }

  const displayVehicle = customerVehicle(vehicle);
  const selectedStage = applyStageHardwarePolicy(displayVehicle.stages).find((item) => item.name === stageName);

  if (!selectedStage) {
    notFound();
  }
  const t = await getTranslations({locale: safeLocale, namespace: "Vehicle"});
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";
  const slugs = getVehicleSeoSlugs(vehicle);
  const stagePath = `/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[selectedStage.name]}`;
  const currentStageUrl = absoluteUrl(stageSeoPath(safeLocale, vehicle, selectedStage.name));
  const vehicleUrl = absoluteUrl(vehicleDetailPath(safeLocale, vehicle));
  const provider = noordTuneProviderJsonLd();
  const selectedQuote = resolveStageQuote(displayVehicle, selectedStage);
  const catalogLabel = safeLocale === "en" ? "Power Catalog" : safeLocale === "pl" ? "Katalog mocy" : "Catalogus";
  const chiptuningLabel =
    safeLocale === "en"
      ? "Main chiptuning page"
      : safeLocale === "pl"
        ? "Strona chiptuningu"
        : "Chiptuning hoofdsite";
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    {name: "NoordTune.nl", url: mainLocaleHref(safeLocale)},
    {name: catalogLabel, url: absoluteUrl(`/${safeLocale}`)},
    {
      name: `${vehicle.brand} ${vehicle.model}`,
      url: vehicleUrl
    },
    {name: stageName, url: currentStageUrl}
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleEngine: vehicle.engine,
    fuelType: vehicle.fuel,
    productionDate: vehicle.yearRange,
    url: currentStageUrl,
    offers: {
      "@type": "Offer",
      ...quoteOfferFields(selectedQuote, safeLocale),
      url: currentStageUrl,
      seller: provider,
      itemOffered: {
        "@type": "Service",
        name: `${stageName} ${vehicle.brand} ${vehicle.model} chiptuning`,
        provider,
        areaServed: areaServedJsonLd(),
        serviceType: ["Chiptuning", "ECU tuning", "Stage tuning"],
        url: currentStageUrl
      }
    }
  };
  const seoCards = [
    {title: t("seo.checksTitle"), text: t("seo.checksText")},
    {title: t("seo.vehicleSpecificTitle"), text: t("seo.vehicleSpecificText")},
    {title: t("seo.stageChoiceTitle"), text: t("seo.stageChoiceText")},
    {title: t("seo.quoteTitle"), text: t("seo.quoteText")}
  ];
  const seoLinks = [
    {
      href: "#tuning-calculator",
      label: t("seo.quoteLink"),
      primary: true
    },
    {
      href: sitePath(vehicleDetailPath(safeLocale, vehicle)),
      label: t("seo.backToVehicle")
    },
    {
      href: chiptuningHref(safeLocale),
      label: t("seo.mainChiptuning")
    },
    ...displayVehicle.stages
      .filter((candidate) => candidate.name !== selectedStage.name)
      .map((candidate) => ({
        href: sitePath(stageSeoPath(safeLocale, vehicle, candidate.name)),
        label: t("seo.otherStage", {stage: candidate.name})
      }))
  ];

  return (
    <main className="ux-vehicle-page min-h-screen bg-background pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
      />
      <CatalogHeader locale={safeLocale} languagePath={stagePath} />
      <section className="ux-vehicle-hero relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,4,8,.96), rgba(2,4,8,.78) 46%, rgba(2,4,8,.56)), url('${assetPath(vehicle.image)}')`
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(9,12,13,.15),transparent_48%)]" />
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

          <div className="mb-5 flex flex-wrap gap-2">
            <Button asChild className="rounded-xl" variant="outline">
              <a href={sitePath(`/${safeLocale}/vehicles/${vehicle.id}`)}>
                {vehicle.brand} {vehicle.model}
              </a>
            </Button>
            <Button asChild className="hidden rounded-xl sm:inline-flex" variant="outline">
              <a href={chiptuningHref(safeLocale)}>{chiptuningLabel}</a>
            </Button>
          </div>
          <div className="max-w-4xl">
            <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
              {stageName} {formatQuote(selectedQuote, safeLocale)}
            </Badge>
            <h1 className="racing-title text-[clamp(2.4rem,6vw,4.9rem)] leading-[1.03]">
              {vehicle.brand} {vehicle.model} {stageName}
            </h1>
            <p className="mt-4 text-2xl font-bold text-slate-100 md:text-3xl">
              {vehicle.stockPowerHp} {powerUnit} → {formatEstimatePower(selectedStage, safeLocale)}
              {!selectedStage.customHardware ? ` · ${formatEstimateTorque(selectedStage, safeLocale)}` : ""}
            </p>
          </div>
        </div>
      </section>

      {vehicle.verificationRequired ? (
        <CatalogVerificationNotice
          text={catalogVerificationCopy(vehicle, safeLocale, {
            badge: t("verification.badge"),
            title: t("verification.title"),
            text: t("verification.text"),
            footer: t("verification.footer")
          })}
        />
      ) : null}

      <section className="container scroll-mt-32 py-10" id="tuning-calculator">
        <VehicleDetail
          sourceExamples={getPublicVehicleSourceExamples(vehicle)}
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
            stage3Requirements: t("stage3Requirements"),
            technical: {
              verified: t("technical.verified"),
              familyEstimate: t("technical.familyEstimate"),
              estimated: t("technical.estimated"),
              manualConfirmation: t("technical.manualConfirmation"),
              identityNote: t("technical.identityNote"),
              conditional: t("technical.conditional"),
              manualReview: t("technical.manualReview")
            },
            recommendation: {
              eyebrow: t("recommendation.eyebrow"),
              title: t("recommendation.title"),
              intro: t("recommendation.intro"),
              recommendedBadge: t("recommendation.recommendedBadge"),
              bestDaily: t("recommendation.bestDaily"),
              bestDailyText: t("recommendation.bestDailyText"),
              performance: t("recommendation.performance"),
              performanceText: t("recommendation.performanceText"),
              custom: t("recommendation.custom"),
              customText: t("recommendation.customText"),
              selectSetup: t("recommendation.selectSetup"),
              setupSelected: t("recommendation.setupSelected"),
              recommendedAddOns: t("recommendation.recommendedAddOns"),
              gearboxText: t("recommendation.gearboxText"),
              addGearbox: t("recommendation.addGearbox"),
              removeGearbox: t("recommendation.removeGearbox"),
              quoteSelected: t("recommendation.quoteSelected")
            }
          }}
          vehicle={displayVehicle}
        />
        <SeoInfoSections
          cards={seoCards}
          eyebrow={t("seo.eyebrow")}
          links={seoLinks}
          title={t("seo.title")}
        />
      </section>
      <CatalogFooter locale={safeLocale} />
      <MobileActionBar locale={safeLocale} mode="vehicle" vehicleLabel={`${vehicle.brand} ${vehicle.model} ${vehicle.engine}`}/>
      <FloatingWhatsappButton
        locale={safeLocale}
        mobileCtaOffset
        vehicleLabel={`${vehicle.brand} ${vehicle.model} ${vehicle.engine}`}
      />
    </main>
  );
}

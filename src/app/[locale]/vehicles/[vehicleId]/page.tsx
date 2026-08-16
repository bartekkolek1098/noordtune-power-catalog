import {notFound} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {engineCatalog, getVehicleById} from "@/data/catalog";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogVerificationNotice} from "@/components/catalog-verification-notice";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {SeoInfoSections} from "@/components/seo-info-sections";
import {VehicleDetail} from "@/components/vehicle-detail";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {catalogHref, chiptuningHref, mainLocaleHref} from "@/lib/noordtune-links";
import {
  absoluteUrl,
  alternateLanguageUrls,
  breadcrumbListJsonLd,
  stageSeoPath,
  vehicleDetailPath,
  vehicleMetadata
} from "@/lib/seo";
import {assetPath, sitePath} from "@/lib/site-path";
import {getTranslations} from "next-intl/server";

type PageProps = {
  params: Promise<{
    locale: string;
    vehicleId: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    engineCatalog.map((vehicle) => ({
      locale,
      vehicleId: vehicle.id
    }))
  );
}

export async function generateMetadata({params}: PageProps) {
  const {locale, vehicleId} = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const vehicle = getVehicleById(vehicleId);

  if (!vehicle) {
    return {};
  }

  return {
    ...vehicleMetadata(safeLocale, vehicle),
    alternates: {
      canonical: absoluteUrl(vehicleDetailPath(safeLocale, vehicle)),
      languages: alternateLanguageUrls(`/vehicles/${vehicle.id}`)
    }
  };
}

export default async function VehiclePage({params}: PageProps) {
  const {locale, vehicleId} = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const vehicle = getVehicleById(vehicleId);

  if (!vehicle) {
    notFound();
  }

  const safeLocale = locale as Locale;
  const t = await getTranslations({locale: safeLocale, namespace: "Vehicle"});
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";
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
      url: absoluteUrl(vehicleDetailPath(safeLocale, vehicle))
    }
  ]);
  const seoCards = [
    {title: t("seo.checksTitle"), text: t("seo.checksText")},
    {title: t("seo.vehicleSpecificTitle"), text: t("seo.vehicleSpecificText")},
    {title: t("seo.stageChoiceTitle"), text: t("seo.stageChoiceText")},
    {title: t("seo.quoteTitle"), text: t("seo.quoteText")}
  ];
  const relatedBrands = ["Volkswagen", "Audi", "Skoda", "SEAT"].includes(
    vehicle.brand
  )
    ? ["Volkswagen", "Audi", "Skoda", "SEAT"]
    : [vehicle.brand];
  const relatedVehicles = engineCatalog
    .filter(
      (candidate) =>
        candidate.id !== vehicle.id && relatedBrands.includes(candidate.brand)
    )
    .slice(0, 3);
  const seoLinks = [
    {
      href: "#tuning-calculator",
      label: t("seo.quoteLink"),
      primary: true
    },
    ...vehicle.stages.map((stage) => ({
      href: sitePath(stageSeoPath(safeLocale, vehicle, stage.name)),
      label: `${stage.name} ${vehicle.brand} ${vehicle.model}`
    })),
    ...relatedVehicles.map((candidate) => ({
      href: sitePath(vehicleDetailPath(safeLocale, candidate)),
      label: t("seo.relatedVehicle", {
        vehicle: `${candidate.brand} ${candidate.model}`
      })
    }))
  ];

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbJsonLd)}}
      />
      <CatalogHeader locale={safeLocale} languagePath={`/vehicles/${vehicle.id}`} />
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
            <span className="text-white">
              {vehicle.brand} {vehicle.model}
            </span>
          </nav>

          <div className="mb-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-[3px]" variant="outline">
              <a href={sitePath(`/${safeLocale}#manual-selector`)}>
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </a>
            </Button>
            <Button asChild className="rounded-[3px]" variant="outline">
              <a href={chiptuningHref(safeLocale)}>{chiptuningLabel}</a>
            </Button>
          </div>
          <div className="max-w-4xl">
            <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
              {vehicle.ecuType}
            </Badge>
            <h1 className="racing-title text-5xl leading-none md:text-7xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-4 text-2xl font-bold text-slate-100 md:text-3xl">
              {vehicle.engine} · {vehicle.version}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2">
                {t("stock")}: {vehicle.stockPowerHp} {powerUnit} / {vehicle.stockTorqueNm} Nm
              </span>
              <span className="rounded-md border border-primary/30 bg-primary/15 px-3 py-2 text-primary">
                {t("tuned")}: {vehicle.stages[0].powerHp} {powerUnit} /{" "}
                {vehicle.stages[0].torqueNm} Nm
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2">
                {vehicle.yearRange}
              </span>
            </div>
          </div>
        </div>
      </section>

      {vehicle.verificationRequired ? (
        <CatalogVerificationNotice
          text={{
            badge: t("verification.badge"),
            title: t("verification.title"),
            text: t("verification.text"),
            footer: t("verification.footer")
          }}
        />
      ) : null}

      <section className="container scroll-mt-32 py-10" id="tuning-calculator">
        <VehicleDetail
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
          vehicle={vehicle}
        />
        <SeoInfoSections
          cards={seoCards}
          eyebrow={t("seo.eyebrow")}
          links={seoLinks}
          title={t("seo.title")}
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

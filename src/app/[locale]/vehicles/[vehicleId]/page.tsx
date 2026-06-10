import {notFound} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {engineCatalog, getVehicleById} from "@/data/catalog";
import {homeVisualCopy} from "@/data/homepage";
import {LanguageSwitcher} from "@/components/language-switcher";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {VehicleDetail} from "@/components/vehicle-detail";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
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
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";
  const fromWord = safeLocale === "en" ? "from" : safeLocale === "pl" ? "z" : "van";
  const toWord = safeLocale === "en" ? "to" : safeLocale === "pl" ? "do" : "naar";
  const priceFrom = safeLocale === "en" ? "from" : safeLocale === "pl" ? "od" : "vanaf";

  if (!vehicle) {
    return {};
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} ${vehicle.engine} tuning`,
    description: `${vehicle.brand} ${vehicle.model} ${vehicle.engine}: ${fromWord} ${vehicle.stockPowerHp} ${powerUnit} ${toWord} ${vehicle.stages[0].powerHp} ${powerUnit} ${priceFrom} €${vehicle.stages[0].price}.`,
    alternates: {
      canonical: sitePath(`/${safeLocale}/vehicles/${vehicle.id}`),
      languages: {
        nl: sitePath(`/nl/vehicles/${vehicle.id}`),
        en: sitePath(`/en/vehicles/${vehicle.id}`),
        pl: sitePath(`/pl/vehicles/${vehicle.id}`)
      }
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
  const visualCopy = homeVisualCopy[safeLocale];
  const powerUnit = safeLocale === "en" ? "hp" : safeLocale === "pl" ? "KM" : "pk";

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(2,4,8,.96), rgba(2,4,8,.78) 46%, rgba(2,4,8,.56)), url('${assetPath(vehicle.image)}')`
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(226,0,15,.22),transparent_42%,rgba(255,255,255,.08))]" />
        <header className="container relative z-10 flex flex-col items-start gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <a aria-label="NoordTune.nl" href={sitePath(`/${safeLocale}`)}>
            <NoordTuneLogo tagline={visualCopy.footerTagline} />
          </a>
          <LanguageSwitcher locale={safeLocale} path={`/vehicles/${vehicle.id}`} />
        </header>
        <div className="container relative z-10 pb-16 pt-8">
          <Button asChild className="mb-8" variant="outline">
            <a href={sitePath(`/${safeLocale}#manual-selector`)}>
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </a>
          </Button>
          <div className="max-w-4xl">
            <Badge className="mb-4 border-primary/30 bg-primary/15 text-primary">
              {vehicle.ecuType}
            </Badge>
            <h1 className="text-5xl font-black uppercase leading-none tracking-normal md:text-7xl">
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

      <section className="container py-10">
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
            stage3Requirements: t("stage3Requirements")
          }}
          vehicle={vehicle}
        />
      </section>
    </main>
  );
}

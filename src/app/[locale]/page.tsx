import {getTranslations} from "next-intl/server";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Info,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Wrench
} from "lucide-react";
import {
  engineCatalog,
  getBrands,
  getPopularVehicleSelectorItems,
  getVehicleById
} from "@/data/catalog";
import {addQuoteOptions, assessVehicleAccess, formatQuote, resolveStageQuote} from "@/data/pricing";
import {formatEstimatePower, formatEstimateTorque} from "@/lib/estimate-copy";
import {customerVehicle} from "@/lib/customer-profile";
import {applyStageHardwarePolicy} from "@/lib/stage-hardware-policy";
import {
  homeVisualCopy,
  performanceBanners,
  popularCars
} from "@/data/homepage";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {ManualSelector} from "@/components/manual-selector";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {PlateLookup} from "@/components/plate-lookup";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {localizedServiceOptions} from "@/lib/service-copy";
import {
  alternateLanguageUrls,
  areaServedJsonLd,
  brandedSeoTitle,
  homepageMetadataCopy,
  noordTuneProviderJsonLd,
  stageSeoPath,
  vehicleDetailPath
} from "@/lib/seo";
import {assetPath, sitePath} from "@/lib/site-path";
import {absoluteUrl} from "@/lib/site-url";
import {formatCurrency} from "@/lib/utils";
import {createVehicleQuoteMessage, whatsappHref} from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps) {
  const {locale} = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const copy = homepageMetadataCopy(safeLocale);
  const socialTitle = brandedSeoTitle(copy.title);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: absoluteUrl(`/${safeLocale}`),
      languages: alternateLanguageUrls("")
    },
    openGraph: {
      title: socialTitle,
      description: copy.description,
      url: absoluteUrl(`/${safeLocale}`),
      siteName: "NoordTune Power Catalog",
      locale: safeLocale === "en" ? "en_US" : safeLocale === "pl" ? "pl_PL" : "nl_NL",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: copy.description
    }
  };
}

export default async function HomePage({params}: PageProps) {
  const {locale} = await params;
  const safeLocale = (isLocale(locale) ? locale : routing.defaultLocale) as Locale;
  const t = await getTranslations({locale: safeLocale, namespace: "Home"});
  const lookup = await getTranslations({locale: safeLocale, namespace: "Lookup"});
  const manual = await getTranslations({
    locale: safeLocale,
    namespace: "ManualSelector"
  });
  const copy = homeVisualCopy[safeLocale];
  const localeCode = safeLocale === "en" ? "en-US" : safeLocale === "pl" ? "pl-PL" : "nl-NL";
  const services = localizedServiceOptions(safeLocale);
  const bmwExampleSource = getVehicleById("bmw-320d-b47");
  const bmwExample = bmwExampleSource ? customerVehicle(bmwExampleSource) : undefined;
  const bmwExampleQuote = addQuoteOptions(
    resolveStageQuote(bmwExample, bmwExample?.stages[0]),
    services
      .filter((option) => ["dpf", "egr", "adblue", "gearbox"].includes(option.id))
      .reduce((total, option) => total + Math.round(option.price * 100), 0)
  );
  const selectorBrands = getBrands();
  const selectorPopularVehicles = getPopularVehicleSelectorItems(4);
  const serviceName = (id: string) =>
    services.find((option) => option.id === id)?.name ?? id;
  const exampleOptions = ["dpf", "egr", "adblue", "gearbox", "speed-limiter", "pops", "launch", "immo"]
    .map((id) => services.find((option) => option.id === id))
    .filter(Boolean)
    .slice(0, 8);
  const manualText = {
    title: manual("title"),
    subtitle: manual("subtitle"),
    quickSearch: manual("quickSearch"),
    quickPlaceholder: manual("quickPlaceholder"),
    popular: manual("popular"),
    brand: manual("brand"),
    brandSearch: manual("brandSearch"),
    model: manual("model"),
    year: manual("year"),
    engine: manual("engine"),
    choose: manual("choose"),
    selectBrand: manual("selectBrand"),
    selectModel: manual("selectModel"),
    selectYear: manual("selectYear"),
    selectEngine: manual("selectEngine"),
    noResults: manual("noResults"),
    manualPath: manual("manualPath"),
    rdwPrimary: manual("rdwPrimary"),
    from: t("from")
  };
  const popularVehicleIds = new Set(popularCars.map((car) => car.detailId));
  const additionalCatalogVehicles = engineCatalog.filter(
    (vehicle) => !popularVehicleIds.has(vehicle.id)
  );
  const catalogLinksCopy = {
    nl: {
      title: "Meer tuningprofielen",
      intro: "Open een voertuigprofiel en bekijk daar de beschikbare Stage-pagina’s."
    },
    en: {
      title: "More tuning profiles",
      intro: "Open a vehicle profile to view its available Stage pages."
    },
    pl: {
      title: "Więcej profili tuningu",
      intro: "Otwórz profil pojazdu, aby zobaczyć dostępne strony Stage."
    }
  }[safeLocale];


  const quickCopy = {
    nl: {check:"Bekijk de mogelijkheden", manual:"Of zoek op merk en model", diagnostic:"Een helder startpunt voor jouw auto", search:"Liever handmatig zoeken?"},
    en: {check:"View the possibilities", manual:"Or search by make and model", diagnostic:"A clearer starting point for your car", search:"Prefer to choose your car?"},
    pl: {check:"Sprawdź możliwości", manual:"Lub szukaj po marce i modelu", diagnostic:"Przejrzysty punkt wyjścia dla Twojego auta", search:"Wolisz wybrać auto ręcznie?"}
  }[safeLocale];

  const jsonLd = {
    "@context": "https://schema.org",
    ...noordTuneProviderJsonLd(),
    areaServed: areaServedJsonLd(),
    serviceType: [
      "Chiptuning",
      "ECU tuning",
      "DSG tuning",
      "DPF delete",
      "AdBlue off"
    ]
  };

  return (
    <main className="ux-home min-h-screen overflow-x-clip" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      <CatalogHeader locale={safeLocale} />


      <section className="ux-hero" aria-labelledby="catalog-intro-heading">
        <div className="container relative">
          <div className="ux-hero__grid">
            <div className="ux-hero__content">
              <p className="ux-eyebrow">{copy.heroKicker}</p>
              <h1 className="ux-hero__title" id="catalog-intro-heading">
                {copy.heroLineA}
                <span>{copy.heroLineB}</span>
                <span>{copy.heroLineC}</span>
              </h1>
              <p className="ux-hero__description">{copy.heroIntro}</p>
              <div className="ux-hero__actions">
                <a href="#rdw-check">{quickCopy.check}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
                <a href="#manual-selector">{quickCopy.manual}</a>
              </div>
            </div>
            <div className="ux-hero__visual hidden lg:flex" aria-label={quickCopy.diagnostic}>
              <div className="ux-reference-top">
                <span>NOORDTUNE / POWER CATALOG</span>
                <span>01 — 03</span>
              </div>
              <div className="ux-reference-body">
                <span className="ux-reference-marker">RDW / 01</span>
                <strong>{quickCopy.diagnostic}</strong>
                <p>{copy.featureA.text}</p>
              </div>
              <div className="ux-reference-bottom">
                {copy.process.slice(0,3).map((step,index)=>(
                  <div className="ux-reference-step" key={step.title}>
                    <span>{String(index+1).padStart(2,"0")}</span>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="ux-lookup-wrap scroll-mt-28" id="rdw-check">
            <PlateLookup
              locale={safeLocale}
              text={{
                label: lookup("label"),
                placeholder: lookup("placeholder"),
                submit: lookup("submit"),
                loading: lookup("loading"),
                notFound: lookup("notFound"),
                invalid: lookup("invalid"),
                disclaimer: lookup("disclaimer"),
                source: lookup("source"),
                detected: lookup("detected"),
                catalogMatch: lookup("catalogMatch"),
                estimate: lookup("estimate"),
                fromPrice: lookup("fromPrice"),
                stage: lookup("stage"),
                stock: lookup("stock"),
                power: lookup("power"),
                torque: lookup("torque"),
                options: lookup("options"),
                viewDetails: lookup("viewDetails"),
                quoteForCar: lookup("quoteForCar"),
                verification: {
                  success: lookup("verification.success"),
                  badge: lookup("verification.badge"),
                  title: lookup("verification.title"),
                  text: lookup("verification.text"),
                  footer: lookup("verification.footer")
                },
                recommendation: {
                  eyebrow: lookup("recommendation.eyebrow"),
                  bestDaily: lookup("recommendation.bestDaily"),
                  dailyDescription: lookup("recommendation.dailyDescription"),
                  stage1Benefit: lookup("recommendation.stage1Benefit"),
                  diagnosticBenefit: lookup("recommendation.diagnosticBenefit"),
                  gearboxBenefit: lookup("recommendation.gearboxBenefit"),
                  selectStage1: lookup("recommendation.selectStage1"),
                  stage1Selected: lookup("recommendation.stage1Selected"),
                  recommendedAddOn: lookup("recommendation.recommendedAddOn"),
                  addGearbox: lookup("recommendation.addGearbox"),
                  removeGearbox: lookup("recommendation.removeGearbox"),
                  manualBadge: lookup("recommendation.manualBadge"),
                  manualTitle: lookup("recommendation.manualTitle"),
                  manualDescription: lookup("recommendation.manualDescription"),
                  manualDetected: lookup("recommendation.manualDetected"),
                  manualEcu: lookup("recommendation.manualEcu"),
                  manualStage: lookup("recommendation.manualStage"),
                  manualQuote: lookup("recommendation.manualQuote"),
                  nextStep: lookup("recommendation.nextStep"),
                  nextStepDescription: lookup("recommendation.nextStepDescription"),
                  manualCta: lookup("recommendation.manualCta"),
                  indicativeEstimate: lookup("recommendation.indicativeEstimate")
                }
              }}
            />
          </div>
          <a className="ux-mobile-manual-link lg:hidden" href="#manual-selector">{quickCopy.manual}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
          <div className="ux-assurances" aria-label={quickCopy.diagnostic}>
            {[copy.featureA,copy.featureB,copy.featureC].map((feature,index)=>(
              <div className="ux-assurance" key={feature.title}>
                <span className="ux-assurance__index">{String(index+1).padStart(2,"0")}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ux-manual-section" aria-label={quickCopy.search}>
        <div className="container">
          <p className="ux-eyebrow">{quickCopy.search}</p>
          <div className="ux-manual-shell">
            <ManualSelector
              initialBrands={selectorBrands}
              initialPopularVehicles={selectorPopularVehicles}
              locale={safeLocale}
              text={manualText}
            />
          </div>
        </div>
      </section>


      <section className="container ux-content-section">
        <div className="ux-services-intro">
          <div>
            <p className="ux-eyebrow">{t("services")}</p>
            <h2 className="ux-content-heading mt-4">{copy.featureB.title}</h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">{copy.featureB.text}</p>
        </div>
        <div className="ux-service-tiles">
          {performanceBanners.map((banner,index)=>(
            <article className="ux-service-tile" key={banner.id}>
              <div className="ux-service-tile__top">
                <span>{String(index+1).padStart(2,"0")} / 03</span>
                <span>{banner.accent}</span>
              </div>
              <div>
                <h3>{banner.title[safeLocale]}</h3>
                <p>{banner.subtitle[safeLocale]}</p>
              </div>
              <div className="ux-service-tile__rule" aria-hidden="true"/>
            </article>
          ))}
        </div>
      </section>

      {bmwExample ? (
        <section className="ux-example py-12 md:py-20" id="results"><div className="container">
          <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
            {copy.exampleEyebrow}
          </Badge>
          <h2 className="ux-content-heading">
            {copy.exampleHeadingA}
            <span className="text-primary">{copy.exampleHeadingB}</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.exampleIntro}</p>

          <div className="mt-6 grid gap-4 xl:grid-cols-[310px_1fr_230px]">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/70">
              <div className="relative h-48">
                <Image
                  alt="BMW 320d NoordTune tuning voorbeeld"
                  className="object-cover"
                  fill
                  quality={82}
                  sizes="310px"
                  src={assetPath(bmwExample.image)}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,.82))]" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-black text-white">{copy.exampleTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {bmwExample.engine} {bmwExample.stockPowerHp} {copy.powerUnit} -{" "}
                  {copy.facts.automatic}
                </p>
                <div className="mt-5 grid gap-3 text-sm text-slate-200">
                  {[
                    [copy.facts.plate, "X-123-AB"],
                    [copy.facts.year, "2019"],
                    [copy.facts.transmission, copy.facts.automatic],
                    [copy.facts.fuel, bmwExample.fuel]
                  ].map(([label, value]) => (
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2" key={label}>
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-black/45 p-4">
                  <div className="text-xs font-black uppercase text-muted-foreground">
                    {copy.standard}
                  </div>
                  <div className="mt-4 text-2xl text-white">
                    {bmwExample.stockPowerHp} {copy.powerUnit}
                  </div>
                  <div className="mt-1 text-xl text-slate-300">{bmwExample.stockTorqueNm} Nm</div>
                </div>
                {applyStageHardwarePolicy(bmwExample.stages).map((stage) => (
                  <div
                    className="rounded-lg border border-primary/70 bg-[linear-gradient(180deg,rgba(226,0,15,.12),rgba(0,0,0,.45))] p-4"
                    key={stage.name}
                  >
                    <div className="text-sm font-black uppercase text-primary">{stage.name}</div>
                    <div className="mt-4 break-words text-3xl text-white">
                      {formatEstimatePower(stage, safeLocale)}
                    </div>
                    {!stage.customHardware ? <div className="mt-1 text-xl text-slate-300">{formatEstimateTorque(stage, safeLocale)}</div> : null}
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-200">
                      <CircleCheck className="h-4 w-4 text-green-400" />
                      {resolveStageQuote(bmwExample, stage).kind === "on-request" ? copy.onRequest : copy.available}
                    </div>
                    <div className="mt-3 text-sm font-black text-white">
                      {formatQuote(resolveStageQuote(bmwExample, stage), safeLocale)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/10 bg-black/55 p-5">
                <div className="mb-4 font-black uppercase text-white">{copy.extraOptions}</div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {exampleOptions.map((option) =>
                    option ? (
                      <div
                        className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm"
                        key={option.id}
                      >
                        <span>{option.name}</span>
                        <Check className="h-4 w-4 shrink-0 text-green-400" />
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>

            <aside className="rounded-lg border border-white/10 bg-black/70 p-5">
              <div className="text-sm font-black uppercase text-white">
                {copy.individualQuote}
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                {[
                  bmwExample.stages[0].name,
                  serviceName("dpf"),
                  serviceName("egr"),
                  serviceName("adblue"),
                  serviceName("gearbox")
                ].map(
                  (item) => (
                    <div className="flex items-center gap-2" key={item}>
                      <Check className="h-4 w-4 text-white" />
                      {item}
                    </div>
                  )
                )}
              </div>
              <div className="my-5 h-px bg-white/10" />
              <div className="text-xs text-muted-foreground">{copy.priceIndication}</div>
              <div className="mt-1 text-3xl font-black text-primary">
                {formatQuote(bmwExampleQuote, safeLocale)}
              </div>
              <div className="mt-5 grid gap-3">
                <Button asChild className="h-12 shadow-[0_0_30px_rgba(226,0,15,.35)]">
                  <a
                    href={whatsappHref({
                      locale: safeLocale,
                      vehicleLabel: "BMW 320d",
                      message: createVehicleQuoteMessage({
                        locale: safeLocale,
                        vehicle: `${bmwExample.brand} ${bmwExample.model} ${bmwExample.engine}`,
                        stage: bmwExample.stages[0].name,
                        options: ["dpf", "egr", "adblue", "gearbox"].map(serviceName),
                        quote: bmwExampleQuote,
                        access: assessVehicleAccess(bmwExample),
                        matchStatus: "catalog-match",
                        vehiclePower: `${bmwExample.stockPowerHp} ${copy.powerUnit} -> ${formatEstimatePower(bmwExample.stages[0], safeLocale)}`
                      })
                    })}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {copy.requestQuote}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild className="h-12" variant="outline">
                  <a href="#quote">
                    {copy.bookAppointment}
                    <CalendarDays className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </aside>
          </div>
          <p className="mt-4 flex gap-2 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            {copy.disclaimer}
          </p>
          </div>
        </section>
      ) : null}

      <section className="container ux-content-section">
        <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
          {t("results")}
        </Badge>
        <h2 className="ux-content-heading">
          {t("featured")}
        </h2>
        <div className="ux-vehicle-cards mt-7 grid gap-3 min-[360px]:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {popularCars.map((car, index) => {
            const detailVehicleSource = getVehicleById(car.detailId);
            const detailVehicle = detailVehicleSource ? customerVehicle(detailVehicleSource) : undefined;
            const detailHref = sitePath(`/${safeLocale}/vehicles/${car.detailId}`);
            const stageHref = detailVehicle?.stages[0]
              ? sitePath(stageSeoPath(safeLocale, detailVehicle, detailVehicle.stages[0].name))
              : detailHref;

            return (
              <article
                className="ux-card group overflow-hidden transition-colors hover:border-primary/50"
                key={car.id}
              >
                <a href={detailHref}>
                  <span className="relative block aspect-[5/4] overflow-hidden bg-black">
                    <Image
                      alt={`${car.title} ${car.platform}`}
                      className="object-cover transition duration-500 group-hover:scale-[1.05]"
                      fill
                      loading={index < 2 ? "eager" : "lazy"}
                      quality={78}
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      src={assetPath(car.image)}
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,.88))]" />
                    <span className="absolute left-3 top-3 rounded-md border border-primary/30 bg-black/70 px-2 py-1 text-xs font-black uppercase text-primary">
                      {car.platform}
                    </span>
                  </span>
                </a>
                <div className="p-3 sm:p-4">
                  <a
                    className="block text-base font-bold leading-tight tracking-[-.02em] text-white transition hover:text-primary sm:text-lg"
                    href={detailHref}
                  >
                    {car.title}
                  </a>
                  <a
                    className="mt-3 block rounded-lg border border-white/10 bg-[#26292a] px-3 py-2 text-xs font-semibold leading-5 text-[#fff] transition hover:border-primary/50 sm:text-sm"
                    href={stageHref}
                  >
                    {detailVehicle?.configurationNote
                      ? `${detailVehicle.version} · ${detailVehicle.stockPowerHp} ${{nl: "pk", en: "hp", pl: "KM"}[safeLocale]} → Stage 1: ${formatEstimatePower(detailVehicle.stages[0], safeLocale)}`
                      : car.stageLine[safeLocale]}
                  </a>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {car.note[safeLocale]}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container pb-12" aria-labelledby="more-catalog-vehicles">
        <div className="rounded-lg border border-white/10 bg-black/55 p-5 md:p-6">
          <h2
            className="ux-section-title text-white"
            id="more-catalog-vehicles"
          >
            {catalogLinksCopy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {catalogLinksCopy.intro}
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {additionalCatalogVehicles.map((vehicle) => (
              <a
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary/60 hover:text-primary"
                href={sitePath(vehicleDetailPath(safeLocale, vehicle))}
                key={vehicle.id}
              >
                {vehicle.brand} {vehicle.model} · {vehicle.engine}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12" id="how">
        <div className="rounded-lg border border-white/10 bg-black/55 p-6">
          <h2 className="ux-content-heading text-center">
            {copy.howTitleA} <span className="text-primary">{copy.howTitleB}</span>
          </h2>
          <div className="ux-steps mt-8 grid gap-5 md:grid-cols-4">
            {[ClipboardList, ShieldCheck, SlidersHorizontal, Wrench].map((Icon, index) => {
              const step = copy.process[index];
              return (
                <div className="text-center" key={step.title}>
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-primary text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="font-black uppercase text-white">
                    {index + 1}. {step.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]" id="about">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-normal">
            {copy.faqTitleA} <span className="text-primary">{copy.faqTitleB}</span>
          </h2>
          <div className="mt-5 divide-y divide-white/10 rounded-lg border border-white/10 bg-black/55">
            {copy.faq.map((item) => (
              <details className="group px-4 py-3 text-sm" key={item.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-white transition hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="text-xl leading-none text-white transition group-open:rotate-45 group-hover:text-primary">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[ShieldCheck, Settings2, CircleCheck, ClipboardList].map((Icon, index) => {
            const item = copy.trust[index];
            return (
              <div className="rounded-lg border border-white/10 bg-black/55 p-5 text-center" key={item.title}>
                <Icon className="mx-auto h-8 w-8 text-white" />
                <div className="mt-4 font-black uppercase text-white">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-14" id="services">
        <div className="container">
          <Badge className="mb-3 border-primary/25 bg-primary/10 text-primary">
            {t("services")}
          </Badge>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.map((option) => (
              <div
                className="rounded-lg border border-white/10 bg-black/70 p-4"
                key={option.id}
              >
                <div className="font-semibold text-white">{option.name}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {option.description}
                </p>
                <div className="mt-3 text-sm font-black text-primary">
                  {t("from")} {formatCurrency(option.price, localeCode)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="quote">
        <CatalogFooter locale={safeLocale} />
      </div>
      <FloatingWhatsappButton locale={safeLocale} />
      <MobileActionBar locale={safeLocale}/>
    </main>
  );
}

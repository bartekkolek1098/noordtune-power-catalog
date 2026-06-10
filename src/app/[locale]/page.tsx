import {getTranslations} from "next-intl/server";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Euro,
  Gauge,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Wrench
} from "lucide-react";
import {getVehicleById} from "@/data/catalog";
import {
  homeVisualCopy,
  homepageHeroImage,
  performanceBanners,
  popularCars
} from "@/data/homepage";
import {LanguageSwitcher} from "@/components/language-switcher";
import {ManualSelector} from "@/components/manual-selector";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {PlateLookup} from "@/components/plate-lookup";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {localizedServiceOptions} from "@/lib/service-copy";
import {assetPath, sitePath} from "@/lib/site-path";
import {formatCurrency} from "@/lib/utils";

type PageProps = {
  params: Promise<{locale: string}>;
};

const navHrefs = [
  "#top",
  "#manual-selector",
  "#services",
  "#how",
  "#results",
  "#about",
  "#quote"
];

export async function generateMetadata({params}: PageProps) {
  const {locale} = await params;
  const safeLocale = isLocale(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({locale: safeLocale, namespace: "Home"});

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: sitePath(`/${safeLocale}`),
      languages: {
        nl: sitePath("/nl"),
        en: sitePath("/en"),
        pl: sitePath("/pl")
      }
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
  const bmwExample = getVehicleById("bmw-320d-b47");
  const serviceName = (id: string) =>
    services.find((option) => option.id === id)?.name ?? id;
  const exampleOptions = ["dpf", "egr", "adblue", "gearbox", "speed-limiter", "pops", "launch", "immo"]
    .map((id) => services.find((option) => option.id === id))
    .filter(Boolean)
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "NoordTune",
    url: "https://power.noordtune.nl",
    areaServed: "NL",
    serviceType: [
      "Chiptuning",
      "ECU tuning",
      "DSG tuning",
      "DPF delete",
      "AdBlue off"
    ]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505]" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      <section className="relative min-h-screen border-b border-white/10">
        <Image
          alt="Dark performance car in a tuning workshop"
          className="absolute inset-0 object-cover object-center opacity-72"
          fill
          priority
          quality={90}
          sizes="100vw"
          src={assetPath(homepageHeroImage)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,.92)_35%,rgba(5,5,5,.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(226,0,15,.18),transparent_28%,rgba(226,0,15,.08)_75%,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(226,0,15,.24),transparent_24rem)]" />
        <div className="absolute right-0 top-24 hidden h-[34rem] w-[58%] skew-y-[-7deg] bg-[repeating-linear-gradient(100deg,transparent_0_28px,rgba(226,0,15,.18)_30px,transparent_33px)] opacity-45 lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent" />

        <header className="container relative z-10 flex flex-col gap-4 border-b border-white/10 py-4 lg:flex-row lg:items-center lg:justify-between">
          <a aria-label="NoordTune.nl" href={sitePath(`/${safeLocale}`)}>
            <NoordTuneLogo tagline={copy.footerTagline} />
          </a>
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.72rem] font-black uppercase tracking-normal text-white">
            {copy.nav.map((item, index) => (
              <a
                className={`transition hover:text-primary ${
                  index === 1 ? "text-primary" : "text-white"
                }`}
                href={navHrefs[index]}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher locale={safeLocale} />
            <a
              className="inline-flex h-11 items-center gap-2 rounded-md border border-white/25 bg-black/60 px-4 text-sm font-semibold text-white transition hover:border-primary hover:text-primary"
              href="https://wa.me/31685759600"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.phone}
            </a>
          </div>
        </header>

        <div className="container relative z-10 pb-10 pt-10 lg:pt-14">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary">
                {copy.heroKicker}
              </Badge>
              <h1 className="max-w-3xl text-[2.65rem] font-black uppercase italic leading-[0.92] tracking-normal text-white sm:text-5xl md:text-7xl">
                {copy.heroLineA}
                <span className="block text-primary max-sm:text-[1.9rem] max-sm:leading-none max-sm:hyphens-auto">
                  {copy.heroLineB}
                </span>
                <span className="block">{copy.heroLineC}</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-200 md:text-base">
                {copy.heroIntro}
              </p>
            </div>
          </div>

          <div className="mt-9 grid gap-4 rounded-lg border border-white/15 bg-black/78 p-4 shadow-[0_0_80px_rgba(0,0,0,.42)] backdrop-blur lg:grid-cols-[1.1fr_.9fr]">
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
                stage: lookup("stage"),
                stock: lookup("stock"),
                power: lookup("power"),
                torque: lookup("torque"),
                options: lookup("options"),
                viewDetails: lookup("viewDetails")
              }}
            />

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="text-lg font-black text-white">{copy.manualPanelTitle}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[manual("brand"), manual("model"), manual("year"), manual("engine")].map(
                  (item) => (
                    <a
                      className="flex h-12 items-center justify-between rounded-md border border-white/15 bg-black/55 px-3 text-sm text-muted-foreground transition hover:border-primary hover:text-white"
                      href="#manual-selector"
                      key={item}
                    >
                      {item}
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </a>
                  )
                )}
              </div>
              <p className="mt-5 flex gap-2 text-xs leading-5 text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                {copy.manualPanelText}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {[
              {icon: ClipboardList, ...copy.featureA},
              {icon: Gauge, ...copy.featureB},
              {icon: Euro, ...copy.featureC}
            ].map((feature) => (
              <div
                className="grid gap-4 rounded-lg border border-white/10 bg-black/70 p-5 sm:grid-cols-[auto_1fr]"
                key={feature.title}
              >
                <feature.icon className="h-10 w-10 text-primary" />
                <div>
                  <div className="font-black uppercase text-white">{feature.title}</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {performanceBanners.map((banner) => (
            <article
              className="group relative min-h-[270px] overflow-hidden rounded-lg border border-white/10 bg-black shadow-[0_0_60px_rgba(226,0,15,.12)]"
              key={banner.id}
            >
              <Image
                alt={banner.title[safeLocale]}
                className="object-cover opacity-68 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-88"
                fill
                quality={82}
                sizes="(min-width: 1024px) 33vw, 100vw"
                src={assetPath(banner.image)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.16),rgba(0,0,0,.9))]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(226,0,15,.28),transparent_42%,rgba(255,255,255,.08))]" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge className="border-primary/35 bg-primary/20 text-primary">
                    {banner.accent}
                  </Badge>
                  <span className="rounded-md border border-white/15 bg-black/55 px-3 py-1 text-sm font-black text-white">
                    {banner.stat[safeLocale]}
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase italic leading-tight tracking-normal">
                  {banner.title[safeLocale]}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {banner.subtitle[safeLocale]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {bmwExample ? (
        <section className="container py-12" id="results">
          <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
            {copy.exampleEyebrow}
          </Badge>
          <h2 className="text-3xl font-black uppercase italic tracking-normal md:text-4xl">
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
                {bmwExample.stages.map((stage) => (
                  <div
                    className="rounded-lg border border-primary/70 bg-[linear-gradient(180deg,rgba(226,0,15,.12),rgba(0,0,0,.45))] p-4"
                    key={stage.name}
                  >
                    <div className="text-sm font-black uppercase text-primary">{stage.name}</div>
                    <div className="mt-4 text-3xl text-white">
                      {stage.powerHp} {copy.powerUnit}
                    </div>
                    <div className="mt-1 text-xl text-slate-300">{stage.torqueNm} Nm</div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-200">
                      <CircleCheck className="h-4 w-4 text-green-400" />
                      {stage.name === "Stage 3+" ? copy.onRequest : copy.available}
                    </div>
                    <div className="mt-3 text-sm font-black text-white">
                      {stage.name === "Stage 3+"
                        ? copy.onRequest
                        : `${t("from")} ${formatCurrency(stage.price, localeCode)}`}
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
                {t("from").toLowerCase()}{" "}
                {formatCurrency(bmwExample.stages[0].price, localeCode)}
              </div>
              <div className="mt-5 grid gap-3">
                <Button asChild className="h-12">
                  <a href="https://wa.me/31685759600">
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
        </section>
      ) : null}

      <ManualSelector
        locale={safeLocale}
        text={{
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
        }}
      />

      <section className="container py-14">
        <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
          {t("results")}
        </Badge>
        <h2 className="text-3xl font-black uppercase italic tracking-normal md:text-4xl">
          {t("featured")}
        </h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {popularCars.map((car, index) => (
            <a
              className="group overflow-hidden rounded-lg border border-white/10 bg-black/70 shadow-[0_0_42px_rgba(0,0,0,.28)] transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_0_44px_rgba(226,0,15,.16)]"
              href={sitePath(`/${safeLocale}/vehicles/${car.detailId}`)}
              key={car.id}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-black">
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
              <span className="block p-4">
                <span className="block text-lg font-black uppercase leading-tight tracking-normal text-white">
                  {car.title}
                </span>
                <span className="mt-2 block rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                  {car.stageLine[safeLocale]}
                </span>
                <span className="mt-3 block text-sm leading-6 text-muted-foreground">
                  {car.note[safeLocale]}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="container py-12" id="how">
        <div className="rounded-lg border border-white/10 bg-black/55 p-6">
          <h2 className="text-center text-3xl font-black uppercase italic tracking-normal">
            {copy.howTitleA} <span className="text-primary">{copy.howTitleB}</span>
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
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

      <footer className="container py-12" id="quote">
        <div className="grid gap-7 border-b border-white/10 pb-8 lg:grid-cols-[1.1fr_.8fr_.7fr_.8fr]">
          <div>
            <div className="text-2xl font-black uppercase italic text-primary">
              NoordTune.nl
            </div>
            <div className="mt-3 font-semibold text-white">{copy.footerTagline}</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              {copy.footerText}
            </p>
          </div>
          <div>
            <div className="mb-3 font-black uppercase text-white">{copy.contactTitle}</div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a className="flex items-center gap-2 hover:text-primary" href="tel:+31685759600">
                <Phone className="h-4 w-4 text-primary" />
                +31 685 759 600
              </a>
              <a className="flex items-center gap-2 hover:text-primary" href="mailto:info@noordtune.nl">
                <MessageCircle className="h-4 w-4 text-primary" />
                info@noordtune.nl
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {copy.location}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-3 font-black uppercase text-white">{copy.hoursTitle}</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>{copy.hoursWeek}</div>
              <div>{copy.hoursSunday}</div>
            </div>
          </div>
          <div>
            <div className="mb-3 font-black uppercase text-white">{copy.areaTitle}</div>
            <div className="rounded-lg border border-white/10 bg-black/55 p-4">
              <MapPin className="h-8 w-8 text-primary" />
              <div className="mt-3 text-sm text-muted-foreground">{copy.areaText}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 NoordTune.nl - {copy.rights}</div>
          <div className="flex gap-5">
            <a href="#top" className="hover:text-primary">{copy.terms}</a>
            <a href="#top" className="hover:text-primary">{copy.privacy}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

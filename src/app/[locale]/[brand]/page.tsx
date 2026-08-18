import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  MessageCircle,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {PlateLookup} from "@/components/plate-lookup";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {isLocale, routing, type Locale} from "@/i18n/routing";
import {mainLocaleHref} from "@/lib/noordtune-links";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {vehicleCheckPaths, vehicleCheckSlugs} from "@/lib/vehicle-check-path";
import {whatsappHref} from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{locale: string; brand: string}>;
};

export const dynamicParams = false;

// Reserved dispatcher for localized top-level landing slugs. The historical
// segment name must not be interpreted as a vehicle-brand page.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    brand: vehicleCheckSlugs[locale]
  }));
}

export async function generateMetadata({params}: PageProps) {
  const {locale, brand: landingSlug} = await params;

  if (!isLocale(locale) || vehicleCheckSlugs[locale] !== landingSlug) {
    return {};
  }

  const t = await getTranslations({locale, namespace: "VehicleCheck"});
  const canonical = absoluteUrl(vehicleCheckPaths[locale]);

  return {
    title: {absolute: t("metaTitle")},
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        nl: absoluteUrl(vehicleCheckPaths.nl),
        en: absoluteUrl(vehicleCheckPaths.en),
        pl: absoluteUrl(vehicleCheckPaths.pl)
      }
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      siteName: "NoordTune Power Catalog",
      locale: locale === "en" ? "en_US" : locale === "pl" ? "pl_PL" : "nl_NL",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription")
    }
  };
}

export default async function VehicleCheckPage({params}: PageProps) {
  const {locale, brand: landingSlug} = await params;

  if (!isLocale(locale) || vehicleCheckSlugs[locale] !== landingSlug) {
    notFound();
  }

  const safeLocale = locale as Locale;
  const t = await getTranslations({locale: safeLocale, namespace: "VehicleCheck"});
  const lookup = await getTranslations({locale: safeLocale, namespace: "Lookup"});
  const faq = [1, 2, 3, 4].map((index) => ({
    question: t(`faq${index}Question`),
    answer: t(`faq${index}Answer`)
  }));
  const currentUrl = absoluteUrl(vehicleCheckPaths[safeLocale]);
  const pageLabel = safeLocale === "nl" ? "Kentekencheck" : safeLocale === "pl" ? "Sprawdź auto" : "Vehicle check";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {"@type": "ListItem", position: 1, name: "NoordTune.nl", item: mainLocaleHref(safeLocale)},
      {"@type": "ListItem", position: 2, name: "Power Catalog", item: absoluteUrl(`/${safeLocale}`)},
      {"@type": "ListItem", position: 3, name: pageLabel, item: currentUrl}
    ]
  };
  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("metaDescription"),
    applicationCategory: "VehicleInformationApplication",
    operatingSystem: "Any",
    url: currentUrl,
    provider: {
      "@type": "Organization",
      name: "NoordTune",
      url: mainLocaleHref(safeLocale)
    }
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {"@type": "Answer", text: item.answer}
    }))
  };
  const inspectionMessage =
    safeLocale === "nl"
      ? "Hallo NoordTune, ik wil graag informatie over een technische aankoopcontrole voor een auto."
      : safeLocale === "pl"
        ? "Cześć NoordTune, proszę o informacje o technicznej kontroli auta przed zakupem."
        : "Hello NoordTune, I would like information about a technical pre-purchase vehicle inspection.";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505]" id="top">
      {[webApplicationJsonLd, breadcrumbJsonLd, faqJsonLd].map((data, index) => (
        <script
          dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
          key={index}
          type="application/ld+json"
        />
      ))}

      <CatalogHeader languagePaths={vehicleCheckPaths} locale={safeLocale} />

      <section className="relative border-b border-white/10 bg-[radial-gradient(circle_at_80%_15%,rgba(227,6,19,.2),transparent_25rem),linear-gradient(135deg,#050505,#0b0b0d_55%,#050505)]">
        <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(112deg,transparent_0_42px,rgba(227,6,19,.13)_44px,transparent_47px)]" />
        <div className="container relative py-10 sm:py-14 lg:py-16">
          <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs font-black uppercase text-muted-foreground">
            <a className="hover:text-primary" href={mainLocaleHref(safeLocale)}>NoordTune.nl</a>
            <span>/</span>
            <a className="hover:text-primary" href={sitePath(`/${safeLocale}`)}>Power Catalog</a>
            <span>/</span>
            <span className="text-white">{pageLabel}</span>
          </nav>

          <div className="max-w-4xl">
            <Badge className="rounded-[3px] border-primary/35 bg-primary/12 text-primary">
              <ShieldCheck className="mr-1 h-4 w-4" />
              {t("eyebrow")}
            </Badge>
            <h1 className="racing-title mt-5 text-5xl leading-[.92] text-white sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              {t("intro")}
            </p>
            <p className="mt-4 max-w-3xl text-xs leading-5 text-muted-foreground">
              {t("privacy")}
            </p>
          </div>

          <div className="mt-8">
            <PlateLookup
              context="vehicle-check"
              locale={safeLocale}
              text={{
                label: lookup("label"), placeholder: lookup("placeholder"), submit: lookup("submit"), loading: lookup("loading"), notFound: lookup("notFound"), invalid: lookup("invalid"), disclaimer: lookup("disclaimer"), source: lookup("source"), detected: lookup("detected"), catalogMatch: lookup("catalogMatch"), estimate: lookup("estimate"), fromPrice: lookup("fromPrice"), stage: lookup("stage"), stock: lookup("stock"), power: lookup("power"), torque: lookup("torque"), options: lookup("options"), viewDetails: lookup("viewDetails"), quoteForCar: lookup("quoteForCar"),
                verification: {success: lookup("verification.success"), badge: lookup("verification.badge"), title: lookup("verification.title"), text: lookup("verification.text"), footer: lookup("verification.footer")},
                recommendation: {eyebrow: lookup("recommendation.eyebrow"), bestDaily: lookup("recommendation.bestDaily"), dailyDescription: lookup("recommendation.dailyDescription"), stage1Benefit: lookup("recommendation.stage1Benefit"), diagnosticBenefit: lookup("recommendation.diagnosticBenefit"), gearboxBenefit: lookup("recommendation.gearboxBenefit"), selectStage1: lookup("recommendation.selectStage1"), stage1Selected: lookup("recommendation.stage1Selected"), recommendedAddOn: lookup("recommendation.recommendedAddOn"), addGearbox: lookup("recommendation.addGearbox"), removeGearbox: lookup("recommendation.removeGearbox"), manualBadge: lookup("recommendation.manualBadge"), manualTitle: lookup("recommendation.manualTitle"), manualDescription: lookup("recommendation.manualDescription"), manualDetected: lookup("recommendation.manualDetected"), manualEcu: lookup("recommendation.manualEcu"), manualStage: lookup("recommendation.manualStage"), manualQuote: lookup("recommendation.manualQuote"), nextStep: lookup("recommendation.nextStep"), nextStepDescription: lookup("recommendation.nextStepDescription"), manualCta: lookup("recommendation.manualCta"), indicativeEstimate: lookup("recommendation.indicativeEstimate")}
              }}
            />
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.16em] text-primary">RDW Open Data</p>
          <h2 className="racing-title mt-2 text-3xl text-white sm:text-4xl">{t("shownTitle")}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("shownIntro")}</p>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {[
            {icon: ClipboardCheck, title: t("shown1Title"), text: t("shown1Text")},
            {icon: Gauge, title: t("shown2Title"), text: t("shown2Text")},
            {icon: RotateCcw, title: t("shown3Title"), text: t("shown3Text")}
          ].map((item) => (
            <article className="panel-edge border-white/10 p-5" key={item.title}>
              <item.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-black uppercase text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30">
        <div className="container grid gap-8 py-12 lg:grid-cols-[1fr_.85fr] lg:items-start">
          <div>
            <h2 className="racing-title text-3xl text-white sm:text-4xl">{t("checklistTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("checklistIntro")}</p>
            <ul className="mt-6 grid gap-3">
              {[1, 2, 3, 4].map((index) => (
                <li className="flex gap-3 rounded-[3px] border border-white/10 bg-white/[.025] p-4 text-sm leading-6 text-slate-200" key={index}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  {t(`checklist${index}`)}
                </li>
              ))}
            </ul>
          </div>
          <aside className="panel-edge border-primary/30 bg-[linear-gradient(145deg,rgba(227,6,19,.13),rgba(0,0,0,.46))] p-6">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="racing-title mt-4 text-3xl text-white">{t("inspectionTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t("inspectionText")}</p>
            <Button asChild className="mt-6 h-auto min-h-12 w-full whitespace-normal rounded-[3px] py-3 text-sm font-black uppercase">
              <a href={whatsappHref({locale: safeLocale, message: inspectionMessage})} rel="noreferrer" target="_blank">
                <MessageCircle className="h-4 w-4" />
                {t("inspectionCta")}
              </a>
            </Button>
          </aside>
        </div>
      </section>

      <section className="container grid gap-8 py-12 lg:grid-cols-[1fr_.85fr]">
        <div>
          <h2 className="racing-title text-3xl text-white sm:text-4xl">{t("faqTitle")}</h2>
          <div className="mt-6 space-y-2">
            {faq.map((item) => (
              <details className="group rounded-[3px] border border-white/10 bg-black/35 p-4" key={item.question}>
                <summary className="cursor-pointer list-none font-black text-white marker:hidden">{item.question}</summary>
                <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <aside className="panel-edge self-start border-white/10 p-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h2 className="racing-title mt-4 text-3xl text-white">{t("tuningTitle")}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("tuningText")}</p>
          <Button asChild className="mt-6 rounded-[3px]" variant="outline">
            <a href={sitePath(`/${safeLocale}`)}>{t("tuningLink")}<ArrowRight className="h-4 w-4" /></a>
          </Button>
        </aside>
      </section>

      <CatalogFooter locale={safeLocale} />
      <FloatingWhatsappButton locale={safeLocale} />
    </main>
  );
}

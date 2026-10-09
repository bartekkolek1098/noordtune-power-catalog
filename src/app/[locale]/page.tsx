import {getTranslations} from "next-intl/server";
import Image from "next/image";
import {ChevronRight} from "lucide-react";
import {
  engineCatalog,
  getBrands,
  getPopularVehicleSelectorItems,
  getVehicleById
} from "@/data/catalog";

import {formatEstimatePower, formatEstimateTorque} from "@/lib/estimate-copy";
import {customerVehicle} from "@/lib/customer-profile";
import {catalogHomeCopy} from "@/data/catalog-home-copy";
import {nlStage1EngineProfiles,nlStage1EnginePath} from "@/data/nl-stage1-engine-seo";
import {nlModelFamilyHubs} from "@/data/nl-model-family-seo";
import {nlVanModels} from "@/data/nl-vans-seo";
import {chiptuningHref, mainLocaleHref} from "@/lib/noordtune-links";

import {homeVisualCopy,featuredCatalogCars} from "@/data/homepage";
import {CatalogFooter} from "@/components/catalog-footer";
import {CatalogHeader} from "@/components/catalog-header";
import {FloatingWhatsappButton} from "@/components/floating-whatsapp";
import {ManualSelector} from "@/components/manual-selector";
import {HeroPhoto} from "@/components/hero-photo";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {PlateLookup} from "@/components/plate-lookup";


import {isLocale, routing, type Locale} from "@/i18n/routing";

import {
  alternateLanguageUrls,
  brandedSeoTitle,
  homepageMetadataCopy,
  noordTuneProviderJsonLd,
  stageSeoPath,
  vehicleDetailPath
} from "@/lib/seo";
import {assetPath, sitePath} from "@/lib/site-path";
import {absoluteUrl} from "@/lib/site-url";



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
  const selectorBrands = getBrands();
  const selectorPopularVehicles = getPopularVehicleSelectorItems(4);
  const bmwExampleSource = getVehicleById("bmw-320d-b47");
  const bmwExample = bmwExampleSource ? customerVehicle(bmwExampleSource) : undefined;
  const bmwStage = bmwExample?.stages.find(stage=>stage.name==="Stage 1");
  const pageCopy = catalogHomeCopy[safeLocale];
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
  const popularVehicleIds = new Set(featuredCatalogCars.map((car) => car.detailId));
  const additionalCatalogVehicles = engineCatalog.filter(
    (vehicle) => !popularVehicleIds.has(vehicle.id)
  );
  const quickCopy = {
    nl: {check:"Bekijk de mogelijkheden", manual:"Of zoek op merk en model", diagnostic:"Een helder startpunt voor jouw auto", search:"Liever handmatig zoeken?"},
    en: {check:"View the possibilities", manual:"Or search by make and model", diagnostic:"A clearer starting point for your car", search:"Prefer to choose your car?"},
    pl: {check:"Sprawdź możliwości", manual:"Lub szukaj po marce i modelu", diagnostic:"Przejrzysty punkt wyjścia dla Twojego auta", search:"Wolisz wybrać auto ręcznie?"}
  }[safeLocale];

  const processCopy = {
    nl: {eyebrow:"EERST BEGRIJPEN. DAN AFSTEMMEN.",intro:"Geen standaardbelofte voor iedere motor. We beginnen bij de voertuiggegevens en bepalen daarna welke vervolgstap verantwoord is.",cta:"Controleer jouw auto",imageAlt:"Illustratieve foto van een monteur die een automotor controleert",photoCredit:"Sfeerbeeld · Dextar Studio / Unsplash"},
    en: {eyebrow:"UNDERSTAND FIRST. TUNE SECOND.",intro:"No blanket performance promise. We start with the vehicle facts, then determine the appropriate next step.",cta:"Check your car",imageAlt:"Illustrative photograph of a mechanic inspecting a vehicle engine",photoCredit:"Illustrative photo · Dextar Studio / Unsplash"},
    pl: {eyebrow:"NAJPIERW ANALIZA. POTEM TUNING.",intro:"Nie obiecujemy jednego wyniku dla każdego silnika. Najpierw dane pojazdu, później odpowiedni zakres prac.",cta:"Sprawdź samochód",imageAlt:"Ilustracyjne zdjęcie mechanika kontrolującego silnik",photoCredit:"Zdjęcie ilustracyjne · Dextar Studio / Unsplash"}
  }[safeLocale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":"CollectionPage",
    name:homepageMetadataCopy(safeLocale).title,
    description:homepageMetadataCopy(safeLocale).description,
    url:absoluteUrl("/"+safeLocale),
    inLanguage:safeLocale==="nl"?"nl-NL":safeLocale==="en"?"en-US":"pl-PL",
    isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
    publisher:noordTuneProviderJsonLd()
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
            <HeroPhoto locale={safeLocale} />
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
          <HeroPhoto locale={safeLocale} compact />
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



      <section className="ux-catalog-essentials container" id="catalog-info" aria-labelledby="catalog-essentials-heading">
        <div className="ux-section-intro-row">
          <div>
            <p className="ux-eyebrow">{pageCopy.partOf}</p>
            <h2 className="ux-content-heading mt-4" id="catalog-essentials-heading">{pageCopy.toolTitle}</h2>
          </div>
          <p className="ux-section-intro">{pageCopy.toolIntro}</p>
        </div>
        <div className="ux-evidence-grid">
          {pageCopy.evidence.map(item=>(
            <article className="ux-evidence-item" key={item.number}>
              <span className="ux-evidence-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {bmwExample && bmwStage ? (
        <section className="ux-catalog-example" id="results" aria-labelledby="catalog-example-heading">
          <div className="container ux-catalog-example__layout">
            <div className="ux-catalog-example__copy">
              <p className="ux-eyebrow">{pageCopy.results.eyebrow}</p>
              <h2 className="ux-content-heading mt-4" id="catalog-example-heading">{pageCopy.results.title}</h2>
              <p className="ux-section-intro">{pageCopy.results.intro}</p>
              <a className="ux-quiet-link" href={sitePath(vehicleDetailPath(safeLocale,bmwExample))}>
                {pageCopy.results.visitProfile}<ChevronRight className="h-4 w-4" aria-hidden="true"/>
              </a>
            </div>
            <div className="ux-example-panel">
              <div className="ux-example-panel__name">{pageCopy.results.example}</div>
              <div className="ux-example-panel__metrics">
                <div className="ux-example-panel__metric">
                  <span>{pageCopy.results.factory}</span>
                  <strong>{bmwExample.stockPowerHp} {copy.powerUnit}</strong>
                  <p>{bmwExample.stockTorqueNm} Nm</p>
                </div>
                <div className="ux-example-panel__metric ux-example-panel__metric--highlight">
                  <span>{pageCopy.results.indicative}</span>
                  <strong>{formatEstimatePower(bmwStage,safeLocale)}</strong>
                  <p>{formatEstimateTorque(bmwStage,safeLocale)}</p>
                </div>
              </div>
              <p className="ux-example-panel__footnote">{pageCopy.results.note}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container ux-catalog-featured" id="vehicles" aria-labelledby="catalog-popular-heading">
        <p className="ux-eyebrow">{pageCopy.featured.eyebrow}</p>
        <h2 className="ux-content-heading mt-4" id="catalog-popular-heading">{pageCopy.featured.title}</h2>
        <p className="ux-section-intro">{pageCopy.featured.intro}</p>
        <div className="ux-vehicle-cards">
          {featuredCatalogCars.map((car)=>{
            const original=getVehicleById(car.detailId);
            const vehicle=original?customerVehicle(original):undefined;
            const href=sitePath(`/${safeLocale}/vehicles/${car.detailId}`);
            const stage=vehicle?.stages.find(s=>s.name==="Stage 1");
            const stageHref=original&&stage
              ? sitePath(stageSeoPath(safeLocale,original,stage.name))
              : href;
            return (
              <article className="ux-vehicle-card" key={car.id}>
                <a href={href} aria-label={`${car.title} — ${car.platform}`} className="ux-vehicle-card__image">
                  <Image
                    alt={`${car.title} ${car.platform} — sfeerbeeld`}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    fill
                    loading="lazy"
                    quality={78}
                    sizes="(min-width:1280px) 370px,(min-width:640px) 47vw,100vw"
                    src={assetPath(car.image)}
                  />
                </a>
                <div className="ux-vehicle-card__body">
                  <span className="ux-vehicle-card__platform">{car.platform}</span>
                  <h3><a href={href}>{car.title}</a></h3>
                  <p>{car.note[safeLocale]}</p>
                  <a className="ux-vehicle-card__stage" href={stageHref}>
                    <span>{stage ? `Stage 1 · ${formatEstimatePower(stage,safeLocale)}` : pageCopy.results.visitProfile}</span>
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container ux-more-profiles" aria-labelledby="more-catalog-vehicles">
        <div className="ux-more-profiles__heading">
          <h2 className="ux-section-title text-white" id="more-catalog-vehicles">{pageCopy.more.title}</h2>
          <p className="ux-section-intro">{pageCopy.more.intro}</p>
        </div>
        <details className="ux-more-profiles__details">
          <summary>{pageCopy.more.showAll} <span>{additionalCatalogVehicles.length}</span></summary>
          <div className="ux-more-profiles__links">
            {additionalCatalogVehicles.map(vehicle=>(
              <a
                href={sitePath(vehicleDetailPath(safeLocale,vehicle))}
                key={vehicle.id}
              >{vehicle.brand} {vehicle.model} · {vehicle.engine}<ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true"/></a>
            ))}
          </div>
        </details>
        {safeLocale==="nl"?(
         <div className="ux-nl-engine-featured-teaser">
          <h3>Stage 1 per motorcode — met controleerbare bronnen</h3>
          <p>De nieuwste motorprofielen bevatten RDW-varianten, originele vermogens en Stage 1-indicaties van onafhankelijke aanbieders. Geen automatische belofte voor jouw ECU.</p>
          <div>
           {[
            "nissan-qashqai-j11-12-dig-t-115",
            "bmw-320i-f30-b48-184",
            "ford-transit-connect-15-ecoblue-100",
            "volkswagen-golf-7-gti-performance-245",
            "volkswagen-caddy-v-20-tdi-122",
            "renault-master-iii-23-blue-dci-145"
           ].map(slug=>{
            const profile=nlStage1EngineProfiles.find(x=>x.slug===slug);
            return profile?<a href={sitePath(nlStage1EnginePath(slug))} key={slug}>{profile.headline}</a>:null;
           })}
           <a className="ux-nl-engine-teaser-all" href={sitePath("/nl/motoren")}>Alle {nlStage1EngineProfiles.length} Stage 1-motoren <ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
           <a className="ux-nl-engine-teaser-all" href={sitePath("/nl/modellen")}>Vergelijk {nlModelFamilyHubs.length} automodellen <ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
           <a className="ux-nl-engine-teaser-all" href={sitePath("/nl/bedrijfswagens")}>Bedrijfswagens: {nlVanModels.length} modellen NL <ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
          </div>
         </div>
        ):null}
      </section>

      <section className="container ux-process-section" id="how">
        <div className="ux-process-layout">
          <figure className="ux-process-photo">
            <Image
              alt={processCopy.imageAlt}
              className="ux-process-photo__image object-cover"
              fill
              loading="lazy"
              quality={82}
              sizes="(min-width: 1024px) 44vw, 100vw"
              src={assetPath("/brand/editorial/engine-inspection-unsplash-dextar-studio.jpg")}
            />
            <figcaption className="ux-process-photo__credit">{processCopy.photoCredit}</figcaption>
          </figure>
          <div className="ux-process-content">
            <p className="ux-eyebrow">{processCopy.eyebrow}</p>
            <h2 className="ux-content-heading mt-5">{copy.howTitleA} <span className="text-primary">{copy.howTitleB}</span></h2>
            <p className="ux-process-intro">{processCopy.intro}</p>
            <ol className="ux-process-list">
              {copy.process.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="ux-process-cta" href="#rdw-check">{processCopy.cta}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
          </div>
        </div>
      </section>


      <section className="container ux-catalog-faq" id="about" aria-labelledby="catalog-faq-title">
        <div className="ux-catalog-faq__intro">
          <p className="ux-eyebrow">{pageCopy.faq.eyebrow}</p>
          <h2 className="ux-content-heading mt-4" id="catalog-faq-title">{pageCopy.faq.title}</h2>
          <p className="ux-section-intro">{pageCopy.faq.intro}</p>
        </div>
        <div className="ux-catalog-faq__items">
          {pageCopy.faq.questions.map(item=>(
            <details key={item.question}>
              <summary><span>{item.question}</span><span aria-hidden="true" className="ux-catalog-faq__plus">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ux-catalog-handoff" id="services" aria-labelledby="catalog-handoff-heading">
        <div className="container ux-catalog-handoff__inner">
          <div>
            <p className="ux-eyebrow">{pageCopy.handoff.eyebrow}</p>
            <h2 className="ux-content-heading mt-4" id="catalog-handoff-heading">{pageCopy.handoff.title}</h2>
            <p className="ux-section-intro">{pageCopy.handoff.intro}</p>
            <p className="ux-catalog-handoff__disclaimer">{pageCopy.handoff.aboutCatalog}</p>
          </div>
          <div className="ux-catalog-handoff__actions">
            <a className="ux-catalog-handoff__primary" href={mainLocaleHref(safeLocale)}>{pageCopy.handoff.main}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
            <a className="ux-catalog-handoff__secondary" href={chiptuningHref(safeLocale)}>{pageCopy.handoff.chiptuning}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
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

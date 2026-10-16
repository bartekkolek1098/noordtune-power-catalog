import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ChevronRight,Search,Truck,ArrowUpRight} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlVanComparisons,nlVanComparePath,nlVanCompareIndexPath} from "@/data/nl-van-comparisons";
import {nlVanModelPath} from "@/data/nl-vans-seo";
import {sitePath} from "@/lib/site-path";
import {absoluteUrl} from "@/lib/site-url";
import {dutchBusinessVansHref} from "@/lib/noordtune-links";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 if(locale!=="nl")return {robots:{index:false,follow:false}};
 const title="Bestelwagen motoren vergelijken: Transit, Sprinter, Transporter";
 const description="Vergelijk goedgekeurde dieselmotoren en bouwjaren van Sprinter, Transit, Transporter, Iveco Daily, Renault Master, Berlingo en meer. RDW-kW, ECU en Stage 1-bronnen.";
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:absoluteUrl(nlVanCompareIndexPath)},
  openGraph:{title,description,url:absoluteUrl(nlVanCompareIndexPath),locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"website"}};
}
export default async function NlVanCompareDirectory({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const schema={"@context":"https://schema.org","@type":"CollectionPage",
  name:"Technische motorvergelijkingen voor Nederlandse bedrijfswagens",
  url:absoluteUrl(nlVanCompareIndexPath),inLanguage:"nl-NL",
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{"@type":"ItemList",itemListElement:nlVanComparisons.map((c,i)=>({
   "@type":"ListItem",position:i+1,name:c.headline,url:absoluteUrl(nlVanComparePath(c.slug))}))}};
 const crumb=breadcrumbListJsonLd([
  {name:"Catalogus",url:absoluteUrl("/nl")},
  {name:"Bedrijfswagens",url:absoluteUrl("/nl/bedrijfswagens")},
  {name:"Motoren vergelijken",url:absoluteUrl(nlVanCompareIndexPath)}
 ]);
 return <main className="ux-home min-h-screen overflow-x-clip">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(crumb)}}/>
  <CatalogHeader locale="nl"/>
  <section className="border-b border-white/15 bg-[radial-gradient(ellipse_at_85%_12%,rgba(227,6,19,.18),transparent_54%),#0c0e0f]">
   <div className="container py-12 md:py-20">
    <nav aria-label="Kruimelpad" className="ux-nl-engine-breadcrumbs">
     <a href={sitePath("/nl")}>Catalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <a href={sitePath("/nl/bedrijfswagens")}>Bedrijfswagens</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <span>Motoren vergelijken</span>
    </nav>
    <p className="ux-eyebrow mt-7">TECHNISCHE DIESELVERGELIJKING · RDW · STAGE 1</p>
    <h1 className="racing-title mt-4 max-w-5xl text-[clamp(2.5rem,6vw,5.4rem)] leading-[.96] text-white">
     Welke motor <span className="text-primary">heeft jouw werkbus?</span>
    </h1>
    <p className="mt-6 max-w-4xl text-base leading-8 text-white/70 md:text-lg">
     Dezelfde bestelwagen kan verschillende fabrieksvermogens, cilinderinhouden en ECU-generaties hebben.
     Vergelijk de afzonderlijk gecontroleerde uitvoeringen van 21 populaire bedrijfswagenfamilies.
     Alle Stage 1-indicaties komen uit onafhankelijke tunerpublicaties en zijn geen gegarandeerde NoordTune-resultaten.
    </p>
    <div className="mt-7 flex flex-wrap gap-3">
     <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Controleer je kenteken</a>
     <a href={sitePath("/nl/motoren#motor-zoeken")} className="ux-nl-engine-secondary-link">Zoek motor op RDW-kW en bouwjaar<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
    </div>
    <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-white/15 bg-black/30 p-4 text-sm text-white/75">
     <Truck className="h-6 w-6 text-primary" aria-hidden="true"/>
     <span><strong className="text-white">{nlVanComparisons.length} voertuigvergelijkingen</strong> · individuele motoren en technische RDW-scopes</span>
    </div>
   </div>
  </section>
  <section className="container py-12 md:py-16" aria-labelledby="nl-van-comparison-list">
   <h2 id="nl-van-comparison-list" className="racing-title text-3xl text-white md:text-5xl">Kies een model en generatie</h2>
   <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">
    Iedere vergelijking laat de oorspronkelijke RDW-kW, cilinderinhoud, afzonderlijke toelatingsjaren, externe Stage 1-bronwaarden
    en ECU- of transmissieverschillen zien. Open een individuele motorpagina om de eigen bronlinks en voorwaarden te beoordelen.
   </p>
   <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="nl-van-comparison-index">
    {nlVanComparisons.map(c=><article key={c.slug} className="flex min-w-0 flex-col rounded-xl border border-white/15 bg-white/[.035] p-5">
     <span className="text-xs font-bold uppercase tracking-wide text-primary">{c.make} · {c.engines.length} beoordeelde dieselmotoren</span>
     <h3 className="mt-3 text-xl font-bold leading-7 text-white [overflow-wrap:anywhere]">{c.headline}</h3>
     <p className="mt-3 flex-1 text-sm leading-7 text-white/70">{c.difference.slice(0,240).trimEnd()}…</p>
     <p className="mt-4 text-xs text-white/60">{c.auditedScopes} exact gecontroleerde RDW-scopes · {c.sourceUrls} onafhankelijke bronlinks</p>
     <a href={sitePath(nlVanComparePath(c.slug))} data-van-comparison-slug={c.slug}
      className="mt-5 inline-flex min-h-11 items-center justify-between gap-3 border-t border-white/15 pt-3 text-sm font-bold text-primary">
      Vergelijk de motorvarianten <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/>
     </a>
    </article>)}
   </div>
  </section>
  <section className="container pb-14 md:pb-20">
   <div className="rounded-xl border border-primary/35 bg-[#16191b] p-6 md:p-8">
    <h2 className="racing-title text-2xl text-white md:text-3xl">Niet iedere bedrijfswagen heeft dezelfde Stage 1</h2>
    <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">Een RDW-typecode identificeert niet altijd de motorcode, ECU-hardware, versnellingsbak of emissiefase.
     Daarom is dit een selectie van eerder gecontroleerde dieselprofielen, geen volledige belofte voor iedere bus of camper.
     Voor voertuigen op de openbare weg moeten DPF, SCR en AdBlue functioneren. Wij bekijken bovendien motorconditie, lading,
     aanhangergebruik en thermische belasting bij een individuele aanvraag.</p>
    <div className="mt-6 flex flex-wrap gap-4">
     <a href={sitePath("/nl/bedrijfswagens")} className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-primary underline-offset-4">Alle bedrijfswagens<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     <a href={dutchBusinessVansHref()} className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-primary underline-offset-4">Bedrijfswagen chiptuning bij NoordTune<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
     <a href={sitePath(nlVanModelPath("mercedes-sprinter"))} className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-primary underline-offset-4">Meer over Sprinter-motoren<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
    </div>
   </div>
  </section>
  <CatalogFooter locale="nl"/>
  <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")}/>
 </main>;
}

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,ChevronRight,Search,Truck,CarFront,ShieldCheck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlBrandEngineGuides,nlBrandGuideBySlug,nlBrandGuidePath,nlBrandGuideMetadata,nlBrandEngineIndexPath} from "@/data/nl-brand-engine-guides";
import {nlStage1EnginePath,allStage1PowerRange,allStage1TorqueRange} from "@/data/nl-stage1-engine-seo";
import {nlVanEnginePath,nlVanModelPath} from "@/data/nl-vans-seo";
import {nlVanComparisons,nlVanComparePath} from "@/data/nl-van-comparisons";
import {nlModelHubPath} from "@/data/nl-model-family-seo";
import {dutchBrandChiptuningHref,dutchBusinessVansHref} from "@/lib/noordtune-links";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {breadcrumbListJsonLd} from "@/lib/seo";
import {whatsappHref} from "@/lib/whatsapp";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return nlBrandEngineGuides.map(g=>({locale:"nl",slug:g.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 const g=nlBrandGuideBySlug.get(slug);
 if(locale!=="nl"||!g)return {robots:{index:false,follow:false}};
 const {title,description}=nlBrandGuideMetadata(g);
 const url=absoluteUrl(nlBrandGuidePath(slug));
 return {title,description,robots:{index:true,follow:true},alternates:{canonical:url},
  openGraph:{title,description,url,locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"article"}};
}
function formatRange(values:readonly number[],unit:string){
 const low=Math.min(...values),high=Math.max(...values);
 return String(low===high?low:low+"–"+high)+" "+unit;
}
function originalKw(values:readonly number[]){
 const low=Math.min(...values),high=Math.max(...values);
 const fmt=(x:number)=>String(x).replace(".",",");
 return (low===high?fmt(low):fmt(low)+"–"+fmt(high))+" kW";
}
export default async function NlTechnicalBrandGuide({params}:Props){
 const {locale,slug}=await params;
 const g=nlBrandGuideBySlug.get(slug);
 if(locale!=="nl"||!g)notFound();
 const path=nlBrandGuidePath(g.slug),url=absoluteUrl(path);
 const destinations=[
  ...g.passenger.map(p=>({name:p.headline,path:nlStage1EnginePath(p.slug)})),
  ...g.modelHubs.map(m=>({name:m.model,path:nlModelHubPath(m.slug)})),
  ...g.vanModels.map(m=>({name:m.model,path:nlVanModelPath(m.slug)})),
  ...g.vanEngines.map(e=>({name:e.title,path:nlVanEnginePath(e.slug)}))
 ];
 const schema={"@context":"https://schema.org","@type":"CollectionPage",
  name:nlBrandGuideMetadata(g).title,description:nlBrandGuideMetadata(g).description,
  url,inLanguage:"nl-NL",isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{"@type":"ItemList",itemListElement:destinations.map((d,i)=>({
    "@type":"ListItem",position:i+1,name:d.name,url:absoluteUrl(d.path)}))}};
 const breadcrumb=breadcrumbListJsonLd([
  {name:"Vermogenscatalogus",url:absoluteUrl("/nl")},
  {name:"Motoren per merk",url:absoluteUrl(nlBrandEngineIndexPath)},
  {name:g.name,url}
 ]);
 return <main className="ux-home min-h-screen overflow-x-clip">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
  <CatalogHeader locale="nl"/>
  <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_18%,rgba(227,6,19,.18),transparent_55%),#0b0d0e]">
   <div className="container py-12 md:py-20">
    <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
     <a href={sitePath("/nl")}>Catalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <a href={sitePath(nlBrandEngineIndexPath)}>Motoren per merk</a><ChevronRight className="h-4 w-4" aria-hidden="true"/><span>{g.name}</span>
    </nav>
    <p className="ux-eyebrow mt-7">TECHNISCHE MOTORWIJZER · RDW · STAGE 1-BRONNEN</p>
    <h1 className="racing-title mt-3 max-w-5xl text-[clamp(2.5rem,6.2vw,5.2rem)] leading-[.94] text-white [overflow-wrap:anywhere]">
     {g.headline}
    </h1>
    <p className="mt-6 max-w-4xl text-base leading-8 text-white/75 md:text-lg">{g.intro}</p>
    <div className="mt-7 flex min-w-0 flex-wrap gap-3">
     <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
     {g.passenger.length>0?<a href="#personenauto-motoren" className="ux-nl-engine-secondary-link"><CarFront className="h-4 w-4" aria-hidden="true"/>Personenauto&apos;s</a>:null}
     {g.vanEngines.length>0?<a href="#bedrijfswagen-motoren" className="ux-nl-engine-secondary-link"><Truck className="h-4 w-4" aria-hidden="true"/>Bedrijfswagens</a>:null}
    </div>
    <div className="mt-9 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Beoordeelde profielen van dit merk">
     <div className="rounded-lg border border-white/15 bg-black/30 p-4"><strong className="block text-2xl text-white">{g.passenger.length}</strong><span className="text-xs text-white/65">automotorprofielen</span></div>
     <div className="rounded-lg border border-white/15 bg-black/30 p-4"><strong className="block text-2xl text-white">{g.vanEngines.length}</strong><span className="text-xs text-white/65">busmotorprofielen</span></div>
     <div className="rounded-lg border border-white/15 bg-black/30 p-4"><strong className="block text-2xl text-white">{g.reviewedApplicationCount}</strong><span className="text-xs text-white/65">beoordeelde RDW-scopes</span></div>
     <div className="rounded-lg border border-white/15 bg-black/30 p-4"><strong className="block text-2xl text-white">{g.sourceCount}</strong><span className="text-xs text-white/65">unieke externe bronlinks</span></div>
    </div>
   </div>
  </section>
  <div className="container space-y-14 py-12 md:space-y-20 md:py-16">
   <section aria-labelledby="brand-differences">
    <p className="ux-eyebrow">WAAROM DE JUISTE GENERATIE BELANGRIJK IS</p>
    <h2 id="brand-differences" className="racing-title mt-3 text-3xl text-white md:text-5xl">Motoren en generaties zijn niet uitwisselbaar</h2>
    <p className="mt-5 max-w-5xl text-sm leading-8 text-white/75 md:text-base">{g.difference}</p>
   </section>
   {g.modelHubs.length>0?<section aria-labelledby="brand-model-compare">
    <p className="ux-eyebrow">ORIGINELE VERMOGENS EN MOTORVERSCHILLEN</p>
    <h2 id="brand-model-compare" className="racing-title mt-3 text-3xl text-white md:text-4xl">Vergelijk {g.name}-modelgeneraties</h2>
    <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2" data-testid="brand-model-hubs">
     {g.modelHubs.map(m=><a href={sitePath(nlModelHubPath(m.slug))} key={m.slug}
       className="group flex min-w-0 items-start justify-between gap-4 rounded-lg border border-white/15 bg-white/[.04] p-5 hover:border-primary/65">
       <span className="min-w-0"><strong className="block text-lg text-white">{g.name} {m.model}</strong>
       <span className="mt-2 block text-sm leading-6 text-white/70">{m.engines.length} apart beoordeelde motoren · vergelijk RDW-kW, generatie en ECU</span></span>
       <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
      </a>)}
    </div>
   </section>:null}
   {g.passenger.length>0?<section id="personenauto-motoren" aria-labelledby="brand-passenger-title" className="scroll-mt-20">
    <p className="ux-eyebrow">ALLEEN BRONVERMELDE STAGE 1-INDICATIES</p>
    <h2 id="brand-passenger-title" className="racing-title mt-3 text-3xl text-white md:text-5xl">{g.passenger.length} gecontroleerde personenautomotoren</h2>
    <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">Fabriekswaarden komen uit gecontroleerde RDW-toepassingen. De Stage 1-ranges zijn externe voorbeelden, geen individuele dynometingen of toezeggingen. Open het motorprofiel voor de exacte technische voorwaarden en oorspronkelijke bronnen.</p>
    <div className="mt-7 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="brand-passenger-engines">
     {g.passenger.map(p=>{
      const first=p.applications[0],powers=allStage1PowerRange(p.applications),torque=allStage1TorqueRange(p.applications);
      const yrs=[...new Set(p.applications.map(a=>a.yearFrom===a.yearTo?String(a.yearFrom):`${a.yearFrom}–${a.yearTo}`))].join(", ");
      return <article className="flex min-w-0 flex-col rounded-lg border border-white/15 bg-white/[.035] p-5" key={p.slug}>
       <span className="text-xs font-bold uppercase tracking-wide text-primary">RDW {first.requiredRdwType} · {first.fuel==="Diesel"?"diesel":"benzine"}</span>
       <h3 className="mt-2 min-w-0 text-lg font-bold text-white [overflow-wrap:anywhere]">{p.headline}</h3>
       <p className="mt-2 text-xs text-white/60">Beoordeelde toelatingen {yrs} · {first.displacementCc} cc</p>
       <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-white/60">Origineel</dt><dd className="text-right font-semibold text-white">{originalKw(p.applications.map(a=>a.registeredPowerKw))}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-white/60">Stage 1 indicatief</dt><dd className="text-right font-semibold text-white">{formatRange(powers,"pk")}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-white/60">Koppel volgens bronnen</dt><dd className="text-right font-semibold text-white">{formatRange(torque,"Nm")}</dd></div>
       </dl>
       <a href={sitePath(nlStage1EnginePath(p.slug))} className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm font-bold text-primary">
        Motor, voorwaarden en bronnen<ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/>
       </a>
      </article>;
     })}
    </div>
   </section>:null}
   {g.vanModels.length>0?<section aria-labelledby="brand-business-models">
    <p className="ux-eyebrow">BEDRIJFSWAGEN PER MODEL</p>
    <h2 id="brand-business-models" className="racing-title mt-3 text-3xl text-white md:text-4xl">Kies je {g.name}-bestelwagen</h2>
    <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="brand-van-models">
     {g.vanModels.map(m=><a key={m.slug} href={sitePath(nlVanModelPath(m.slug))}
      className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-white/15 bg-white/[.04] p-5 hover:border-primary/60">
      <span><strong className="block text-lg text-white">{g.name} {m.model}</strong><span className="mt-2 block text-sm text-white/65">RDW-varianten en gebruik van de bestelwagen</span></span>
      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
     </a>)}
    </div>
   </section>:null}
   {nlVanComparisons.some(c=>c.make===g.make)?<section aria-labelledby="brand-bus-comparisons-title">
    <p className="ux-eyebrow">ZAKELIJKE DIESELGENERATIES VERGELIJKEN</p>
    <h2 id="brand-bus-comparisons-title" className="racing-title mt-3 text-3xl text-white md:text-4xl">Vergelijk {g.name}-busmotoren en bouwjaren</h2>
    <div className="mt-6 grid min-w-0 gap-3 md:grid-cols-2" data-testid="brand-van-comparisons">
     {nlVanComparisons.filter(c=>c.make===g.make).map(c=><a key={c.slug} href={sitePath(nlVanComparePath(c.slug))} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/[.035] p-5 text-white hover:border-primary/65">
      <span><strong className="block text-base">{c.headline}</strong><span className="mt-2 block text-sm text-white/65">{c.engines.length} beoordeelde motoren · RDW-kW en Stage 1-bronnen</span></span>
      <ChevronRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
     </a>)}
    </div>
   </section>:null}
   {g.vanEngines.length>0?<section id="bedrijfswagen-motoren" aria-labelledby="brand-van-engines-title" className="scroll-mt-20">
    <p className="ux-eyebrow">BELADING · ECU · TRANSMISSIE · DPF / SCR</p>
    <h2 id="brand-van-engines-title" className="racing-title mt-3 text-3xl text-white md:text-5xl">{g.vanEngines.length} gecontroleerde busmotoren</h2>
    <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">De bestelwagenuitvoeringen staan apart van personenauto&apos;s. Iedere kaart verwijst naar een technisch afgebakend RDW-cohort met externe Stage 1-bronnen. Belading en emissiehardware moeten vóór een afstelling worden beoordeeld.</p>
    <div className="mt-7 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="brand-van-engines">
     {g.vanEngines.map(e=>{
      const a=e.applications[0];
      return <article className="flex min-w-0 flex-col rounded-lg border border-white/15 bg-white/[.035] p-5" key={e.slug}>
       <span className="text-xs font-bold uppercase tracking-wide text-primary">RDW {a.requiredRdwType} · {a.fuel==="CNG"?"aardgas (CNG)":a.fuel==="Petrol"?"benzine":"diesel"}</span>
       <h3 className="mt-2 min-w-0 text-lg font-bold text-white [overflow-wrap:anywhere]">{e.title}</h3>
       <p className="mt-2 text-xs text-white/60">{[...new Set(e.applications.map(x=>x.yearFrom===x.yearTo?String(x.yearFrom):`${x.yearFrom}–${x.yearTo}`))].join(", ")} · {a.displacementCc} cc</p>
       <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-white/60">Origineel</dt><dd className="font-semibold text-white">{originalKw(e.applications.map(x=>x.registeredPowerKw!))}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-white/60">Stage 1 indicatief</dt><dd className="font-semibold text-white">{formatRange(e.applications.flatMap(x=>x.powerRangeHp),"pk")}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-white/60">Bronverwijzingen</dt><dd className="font-semibold text-white">{e.sources.length}</dd></div>
       </dl>
       <a href={sitePath(nlVanEnginePath(e.slug))} className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm font-bold text-primary">
        Bekijk RDW-motorprofiel<ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/>
       </a>
      </article>;
     })}
    </div>
   </section>:null}
   <section aria-labelledby="brand-workshop-check">
    <p className="ux-eyebrow">EERST MOTOR EN SOFTWARE CONTROLEREN</p>
    <h2 id="brand-workshop-check" className="racing-title mt-3 text-3xl text-white md:text-4xl">Waar letten we bij {g.name} op?</h2>
    <p className="mt-5 max-w-5xl text-sm leading-8 text-white/75 md:text-base">{g.checks}</p>
    <div className="mt-6 flex max-w-5xl gap-4 rounded-lg border border-primary/35 bg-primary/[.07] p-5">
     <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true"/>
     <p className="text-sm leading-7 text-white/75">De genoemde Stage 1-waarden zijn externe indicaties, niet bij NoordTune op de testbank gemeten. De werkelijke ECU, motorconditie en transmissie worden individueel gecontroleerd. Wettelijk voorgeschreven emissievoorzieningen zoals DPF, SCR en AdBlue blijven voor weggebruik intact.</p>
    </div>
   </section>
   <section aria-labelledby="brand-faq">
    <p className="ux-eyebrow">VEELGESTELDE VRAGEN</p>
    <h2 id="brand-faq" className="racing-title mt-3 text-3xl text-white md:text-4xl">Vragen over {g.name}-motoren</h2>
    <div className="mt-6 max-w-5xl space-y-3" data-testid="brand-faq">
     {g.faq.map(([q,a])=><details key={q} className="rounded-lg border border-white/15 bg-white/[.035] p-5">
      <summary className="cursor-pointer text-base font-bold text-white">{q}</summary>
      <p className="mt-3 text-sm leading-7 text-white/70">{a}</p>
     </details>)}
    </div>
   </section>
   <section className="rounded-xl border border-primary/40 bg-[#121314] p-6 md:p-9">
    <p className="ux-eyebrow">NOORDTUNE ASSEN · JOUW MOTOR, JOUW UITVOERING</p>
    <h2 className="racing-title mt-3 text-3xl text-white md:text-4xl">Vraag advies voor jouw {g.name}</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">Gebruik de kentekencheck of kies het passende motorprofiel. Bij een aanvraag controleren we originele kW, ECU en gebruik voordat vermogen of prijs wordt bevestigd.</p>
    <div className="mt-6 flex min-w-0 flex-wrap gap-3">
     <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Controleer kenteken</a>
     {g.passenger.length>0?<a href={dutchBrandChiptuningHref(g.make)} className="ux-nl-engine-secondary-link">Chiptuning als dienst<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>:null}
     {g.vanEngines.length>0?<a href={dutchBusinessVansHref()} className="ux-nl-engine-secondary-link">Bedrijfswagenadvies<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>:null}
     <a href={whatsappHref({locale:"nl",vehicleLabel:g.name+" motoradvies"})} className="ux-nl-engine-secondary-link" target="_blank" rel="noreferrer">WhatsApp NoordTune<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
    </div>
   </section>
   <a className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 underline underline-offset-4" href={sitePath(nlBrandEngineIndexPath)}>
    <ArrowLeft className="h-4 w-4 text-primary" aria-hidden="true"/>Alle merken en motorprofielen
   </a>
  </div>
  <CatalogFooter locale="nl"/>
  <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")} vehicleLabel={g.name+" motoradvies"}/>
 </main>;
}

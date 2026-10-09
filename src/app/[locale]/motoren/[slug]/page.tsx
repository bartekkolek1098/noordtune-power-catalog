import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowUpRight, ChevronRight, Info, Search} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {
 allStage1PowerRange,allStage1TorqueRange,
 nlStage1EngineProfiles,nlStage1BySlug,nlStage1EngineMetadata,nlStage1EnginePath,
 type ReviewedRdwApplication
} from "@/data/nl-stage1-engine-seo";
import {absoluteUrl} from "@/lib/site-url";
import {nlModelHubByEngineSlug,nlModelHubPath} from "@/data/nl-model-family-seo";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){
 return nlStage1EngineProfiles.map(p=>({locale:"nl",slug:p.slug}));
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 const profile=nlStage1BySlug.get(slug);
 if(locale!=="nl"||!profile)return {robots:{index:false,follow:false}};
 const {title,description}=nlStage1EngineMetadata(profile);
 const url=absoluteUrl(nlStage1EnginePath(profile.slug));
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:url},
  openGraph:{title,description,url,type:"article",locale:"nl_NL",siteName:"NoordTune Power Catalog"},
  twitter:{card:"summary",title,description}
 };
}

function nlNumber(value:number){return String(value).replace(".",",");}
function range([min,max]:readonly [number,number],unit:string){
 return `${nlNumber(min)}${min===max?"":"–"+nlNumber(max)} ${unit}`;
}
function publishedGain(apps:readonly ReviewedRdwApplication[]){
 const gains=apps.flatMap(a=>[a.powerRangeHp[0]-a.stockPowerHp,a.powerRangeHp[1]-a.stockPowerHp]);
 return range([Math.min(...gains),Math.max(...gains)],"pk");
}
function stockRange(apps:readonly ReviewedRdwApplication[],key:"stockPowerHp"|"stockTorqueNm"){
 const nums=apps.map(x=>x[key]);return range([Math.min(...nums),Math.max(...nums)],key==="stockPowerHp"?"pk":"Nm");
}

export default async function NlStage1MotorPage({params}:Props){
 const {locale,slug}=await params;
 const p=nlStage1BySlug.get(slug);
 if(locale!=="nl"||!p)notFound();
 const power=allStage1PowerRange(p.applications);
 const torque=allStage1TorqueRange(p.applications);
 const related=nlStage1EngineProfiles.filter(other=>other.slug!==p.slug&&other.applications[0].make===p.applications[0].make).slice(0,4);
 const modelHub=nlModelHubByEngineSlug.get(p.slug);
 const current=absoluteUrl(nlStage1EnginePath(p.slug));
 const list=absoluteUrl("/nl/motoren");
 const bread=breadcrumbListJsonLd([
  {name:"NoordTune Power Catalog",url:absoluteUrl("/nl")},
  {name:"Stage 1-motoren",url:list},
  {name:p.headline,url:current}
 ]);
 const schema={
  "@context":"https://schema.org",
  "@type":"WebPage",name:nlStage1EngineMetadata(p).title,
  description:nlStage1EngineMetadata(p).description,
  inLanguage:"nl-NL",url:current,
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  about:{"@type":"Vehicle",brand:{"@type":"Brand",name:p.applications[0].make},model:p.applications[0].model},
  citation:p.sources.map(source=>source.url)
 };
 return (
  <main className="ux-home ux-nl-engine-detail min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(bread)}}/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-nl-engine-detail-hero">
    <div className="container">
     <nav aria-label="Kruimelpad" className="ux-nl-engine-breadcrumbs">
      <a href={sitePath("/nl")}>Catalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <a href={sitePath("/nl/motoren")}>Stage 1-motoren</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <span>{p.headline}</span>
     </nav>
     <p className="ux-eyebrow">RDW-VERMOGEN · MOTORGENERATIE · STAGE 1-BRONNEN</p>
     <h1>{p.headline}<span>Stage 1 chiptuning</span></h1>
     <p className="ux-nl-engine-intro">{p.intro}</p>
     <div className="ux-nl-engine-primary-facts" aria-label="Basisgegevens van dit motorprofiel">
      <div><span>Origineel RDW-vermogen</span><strong>{stockRange(p.applications,"stockPowerHp")}</strong></div>
      <div><span>Stage 1 volgens publicaties</span><strong>{range(power,"pk")}</strong></div>
      <div><span>Stage 1-koppel volgens publicaties</span><strong>{range(torque,"Nm")}</strong></div>
      <div><span>Mogelijke toename volgens bronnen</span><strong>{publishedGain(p.applications)}</strong></div>
     </div>
     <p className="ux-nl-engine-scope-note"><Info aria-hidden="true" className="h-4 w-4 shrink-0"/>
      Indicaties uit externe publicaties. Geen NoordTune-meting, ECU-goedkeuring of gegarandeerd resultaat.
     </p>
    </div>
   </section>
   <div className="container ux-nl-engine-content">
    <section aria-labelledby="scope-title" className="ux-nl-engine-section">
     <p className="ux-eyebrow">VERSCHILLEN TUSSEN UITVOERINGEN</p>
     <h2 id="scope-title">Welke uitvoering hoort bij deze gegevens?</h2>
     <p>{p.generationNote}</p>
     <div className="ux-nl-engine-variant-list">
      {p.applications.map(a=>(
       <article className="ux-nl-engine-variant" key={a.id}>
        <div className="ux-nl-engine-variant-heading">
         <h3>{a.make} {a.model} · RDW-type {a.requiredRdwType}</h3>
         <span>Eerste toelating {a.yearFrom}{a.yearFrom===a.yearTo?"":"–"+a.yearTo}</span>
        </div>
        <dl>
         <div><dt>Oorspronkelijk vermogen</dt><dd>{nlNumber(a.registeredPowerKw??0)} kW · {a.stockPowerHp} pk</dd></div>
         <div><dt>Motorinhoud en cilinders</dt><dd>{a.displacementCc} cc · {a.cylinders} cilinders</dd></div>
         <div><dt>Brandstof</dt><dd>{a.fuel==="Diesel"?"Diesel":"Benzine"}</dd></div>
         <div><dt>Gepubliceerd fabriekskoppel*</dt><dd>{a.stockTorqueNm} Nm</dd></div>
         <div><dt>Stage 1-vermogen (indicatief)</dt><dd>{range(a.powerRangeHp,"pk")}</dd></div>
         <div><dt>Stage 1-koppel (indicatief)</dt><dd>{range(a.torqueRangeNm,"Nm")}</dd></div>
        </dl>
       </article>
      ))}
     </div>
     <p className="ux-nl-engine-smallnote">*RDW registreert niet voor elke auto het fabriekskoppel. De Nm-referentie is beoordeeld op basis van gepubliceerde motorbronnen; aanbieders kunnen daarin verschillen.</p>
    </section>
    <section aria-labelledby="verification-title" className="ux-nl-engine-section ux-nl-engine-technical">
     <p className="ux-eyebrow">MOTORCODE, ECU EN TRANSMISSIE</p>
     <h2 id="verification-title">Wat controleren we vóór chiptuning?</h2>
     <p>{p.workshopCheck}</p>
     <div className="ux-nl-engine-checklist">
      <div><span>01</span><strong>Motor en originele fabrieksuitvoering</strong><p>Exacte motorcode, brandstof, motorgeneratie en registratiedata vergelijken met het profiel.</p></div>
      <div><span>02</span><strong>ECU en transmissie</strong><p>De geïnstalleerde software, ECU-variant en koppellimiet van handbak, DSG, CVT of automaat controleren.</p></div>
      <div><span>03</span><strong>Staat en wettelijke eisen</strong><p>Onderhoud, foutcodes, temperaturen en originele emissievoorzieningen beoordelen; DPF, GPF, SCR en AdBlue blijven intact.</p></div>
     </div>
    </section>
    <section aria-labelledby="sources-title" className="ux-nl-engine-section ux-nl-engine-sources">
     <p className="ux-eyebrow">TRANSPARANTE HERKOMST</p>
     <h2 id="sources-title">Onafhankelijke publicaties voor Stage 1</h2>
     <p>Deze motorconfiguratie is alleen gepubliceerd na controle van meerdere tuneraanbieders. Alle cijfers blijven illustratief; bronwaarden zijn niet bij NoordTune op de testbank gemeten.</p>
     <ul>
      {p.sources.map(source=>(
       <li key={source.url}>
        <a href={source.url} rel="noopener noreferrer" target="_blank">
          <span>{source.title}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0"/>
        </a>
        {source.retrievedAt?<span>Bron geraadpleegd: {source.retrievedAt}</span>:null}
       </li>
      ))}
     </ul>
    </section>
    <section className="ux-nl-engine-cta" aria-labelledby="next-step-title">
     <div>
      <p className="ux-eyebrow">NOORDTUNE.NL</p>
      <h2 id="next-step-title">Wat kan er met jouw exacte auto?</h2>
      <p>Gebruik je kenteken voor de voertuiggegevens. Daarna kan NoordTune de werkelijke motor, ECU en versnellingsbak bevestigen. Stage 2 en Stage 3 vallen buiten deze numerieke Stage 1-bronreferenties.</p>
     </div>
     <div className="ux-nl-engine-cta-links">
      <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Controleer kenteken</a>
      <a href={whatsappHref({locale:"nl",vehicleLabel:p.headline})} className="ux-nl-engine-secondary-link" rel="noreferrer" target="_blank">Vraag individueel advies<ArrowUpRight aria-hidden="true" className="h-4 w-4"/></a>
      <a href={chiptuningHref("nl")} className="ux-nl-engine-underlink">Meer over chiptuning bij NoordTune.nl<ArrowUpRight aria-hidden="true" className="h-4 w-4"/></a>
     </div>
    </section>
    {modelHub?(
      <a className="ux-nl-model-engine-crosslink" href={sitePath(nlModelHubPath(modelHub.slug))}>
       <span>Vergelijk alle beoordeelde motorvarianten van {modelHub.brand} {modelHub.model}</span>
       <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0"/>
      </a>
    ):null}
    {related.length>0?(
     <section className="ux-nl-engine-related" aria-labelledby="related-title">
      <h2 id="related-title">Andere motorvarianten van {p.applications[0].make}</h2>
      <div>{related.map(item=><a href={sitePath(nlStage1EnginePath(item.slug))} key={item.slug}>{item.headline}<ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true"/></a>)}</div>
     </section>
    ):null}
    <a className="ux-nl-engine-back" href={sitePath("/nl/motoren")}><ArrowLeft aria-hidden="true" className="h-4 w-4"/> Terug naar alle Stage 1-motoren</a>
   </div>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" vehicleLabel={p.headline} primaryHref={sitePath("/nl#rdw-check")}/>
  </main>
 );
}

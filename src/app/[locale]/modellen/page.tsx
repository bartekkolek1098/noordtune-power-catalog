import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowUpRight,ChevronRight,Search} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlModelFamilyHubs,nlModelHubPath} from "@/data/nl-model-family-seo";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref} from "@/lib/noordtune-links";
type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;if(locale!=="nl")return {robots:{index:false,follow:false}};
 const title="Chiptuning per automodel vergelijken";
 const description="Vergelijk Stage 1-motorvarianten binnen BMW 320i, Nissan Qashqai, Ford Transit Connect, VW Golf, VW Caddy en Renault Master. Met originele RDW-gegevens en bronnen.";
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:absoluteUrl("/nl/modellen")},
  openGraph:{title,description,url:absoluteUrl("/nl/modellen"),siteName:"NoordTune Power Catalog",type:"website",locale:"nl_NL"}
 };
}
export default async function NlModelListPage({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const structured={
  "@context":"https://schema.org","@type":"CollectionPage",
  name:"Stage 1 chiptuning per automodel",url:absoluteUrl("/nl/modellen"),
  description:"Technische vergelijking van Stage 1 motorvarianten in populaire automodellen.",
  inLanguage:"nl-NL",
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{
    "@type":"ItemList",
    itemListElement:nlModelFamilyHubs.map((m,i)=>({
      "@type":"ListItem",position:i+1,name:m.model,url:absoluteUrl(nlModelHubPath(m.slug))
    }))
  }
 };
 return (
  <main className="ux-home ux-nl-model-index min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-nl-model-intro">
    <div className="container">
     <nav aria-label="Kruimelpad" className="ux-nl-engine-breadcrumbs">
      <a href={sitePath("/nl")}>Vermogenscatalogus</a>
      <ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <span>Automodellen</span>
     </nav>
     <p className="ux-eyebrow">MOTOREN VERGELIJKEN · STAGE 1 · RDW</p>
     <h1>Chiptuning per <span>automodel.</span></h1>
     <p>Dezelfde modelnaam kan verschillende motoren, ECU&apos;s en transmissies bevatten. Vergelijk hier
      modelgeneraties en hun afzonderlijk gecontroleerde Stage 1-referenties, zodat je niet uitgaat
      van de verkeerde motor. Alle gepubliceerde waarden blijven indicaties uit onafhankelijke bronnen.</p>
     <div className="ux-nl-model-intro-actions">
      <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
      <a className="ux-nl-engine-secondary-link" href={sitePath("/nl/motoren")}>Bekijk alle 21 motorprofielen<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </div>
   </section>
   <section className="container ux-nl-model-groups" aria-labelledby="model-list-title">
    <h2 id="model-list-title">{nlModelFamilyHubs.length} modellen met meerdere gecontroleerde motoren</h2>
    <p>De overzichten bundelen motorvarianten waar het verschil daadwerkelijk gevolgen heeft voor de Stage 1-indicatie.</p>
    <div className="ux-nl-model-groups-grid">
     {nlModelFamilyHubs.map((m,i)=>(
      <article key={m.slug} className="ux-nl-model-group-card">
       <span className="ux-nl-model-group-eyebrow">{String(i+1).padStart(2,"0")} / 0{nlModelFamilyHubs.length} · {m.brand}</span>
       <h3><a href={sitePath(nlModelHubPath(m.slug))}>{m.model}</a></h3>
       <p>{m.intro}</p>
       <div className="ux-nl-model-group-engines">
        <span>{m.engines.length} afzonderlijke motorprofielen</span>
        {m.engines.map(engine=>(
         <a key={engine.slug} href={sitePath("/nl/motoren/"+engine.slug)}>
          {engine.headline}<ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true"/>
         </a>
        ))}
       </div>
       <a className="ux-nl-model-group-cta" href={sitePath(nlModelHubPath(m.slug))}>
        Vergelijk de motoren<ArrowUpRight aria-hidden="true" className="h-4 w-4"/>
       </a>
      </article>
     ))}
    </div>
   </section>
   <section className="container ux-nl-model-catalog-note" aria-label="Wat als jouw model ontbreekt?">
    <h2>Jouw uitvoering niet in de lijst?</h2>
    <p>Het RDW-kentekenregister bevat meer voertuigen dan deze handmatig geselecteerde SEO-pagina&apos;s.
      Je kunt in de gewone catalogus ook zonder aparte modelpagina zoeken op kenteken of op merk, model, jaar en motor.</p>
    <div><a href={sitePath("/nl#manual-selector")}>Handmatig zoeken<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     <a href={chiptuningHref("nl")}>Chiptuning bij NoordTune.nl<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
     <a href={sitePath("/nl/bedrijfswagens")}>Bekijk bedrijfswagens<ChevronRight className="h-4 w-4" aria-hidden="true"/></a></div>
   </section>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")}/>
  </main>
 );
}

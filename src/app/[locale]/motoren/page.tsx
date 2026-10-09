import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowUpRight, ChevronRight, Search} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlStage1EngineProfiles,nlStage1EnginePath} from "@/data/nl-stage1-engine-seo";
import {absoluteUrl} from "@/lib/site-url";
import {chiptuningHref} from "@/lib/noordtune-links";
import {sitePath} from "@/lib/site-path";

type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 if(locale!=="nl")return {robots:{index:false,follow:false}};
 const title="Stage 1 motorprofielen | Zoek jouw motor | NoordTune";
 const description="Vergelijk Stage 1-indicaties voor Nissan, BMW, Volkswagen, Ford en Renault. Origineel vermogen, RDW-varianten, ECU-controles en onafhankelijke bronnen.";
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:absoluteUrl("/nl/motoren")},
  openGraph:{title,description,url:absoluteUrl("/nl/motoren"),locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"website"}
 };
}
const makes=["BMW","Ford","Nissan","Renault","Volkswagen"] as const;
export default async function NlMotorenPage({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const jsonLd={
  "@context":"https://schema.org","@type":"CollectionPage",
  name:"Stage 1 motorprofielen met bronnen",inLanguage:"nl-NL",
  url:absoluteUrl("/nl/motoren"),
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  numberOfItems:nlStage1EngineProfiles.length
 };
 return (
  <main className="ux-home min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-nl-engine-index-hero">
    <div className="container">
     <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
      <a href={sitePath("/nl")}>Vermogenscatalogus</a><ChevronRight aria-hidden="true" className="h-4 w-4"/><span>Stage 1-motoren</span>
     </nav>
     <p className="ux-eyebrow">BRONVERMELDE MOTORPROFIELEN</p>
     <h1>Stage 1 per <span>motor en generatie.</span></h1>
     <p className="ux-nl-engine-intro">
      Bekijk welke Stage 1-resultaten onafhankelijke tuners voor een specifieke motorvariant publiceren.
      Geen algemene procentuele winst of willekeurig toegewezen ECU: we vergelijken alleen gecontroleerde
      originele vermogens, generatie, brandstof en RDW-techniek. De uitkomst voor jouw auto vereist een aparte controle.
     </p>
     <div className="ux-nl-engine-index-actions">
      <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search aria-hidden="true" className="h-4 w-4"/> Controleer Nederlands kenteken</a>
      <a href={chiptuningHref("nl")} className="ux-nl-engine-secondary-link">Chiptuning bij NoordTune.nl<ArrowUpRight aria-hidden="true" className="h-4 w-4"/></a>
     </div>
    </div>
   </section>
   <section className="container ux-nl-engine-index-list" aria-labelledby="motor-profiles-heading">
    <div className="ux-nl-engine-heading">
     <h2 id="motor-profiles-heading">{nlStage1EngineProfiles.length} afzonderlijke motortypen met bronnen</h2>
     <p>Dit zijn niet alle RDW-auto’s. Niet-gepubliceerde configuraties blijven via de kentekencheck en de handmatige keuze bereikbaar.</p>
    </div>
    {makes.map(make=>{
      const profiles=nlStage1EngineProfiles.filter(p=>p.applications[0].make===make);
      if(!profiles.length)return null;
      return (
        <div className="ux-nl-engine-make" key={make}>
         <h3>{make}<span>{profiles.length} motorprofielen</span></h3>
         <div className="ux-nl-engine-make-grid">
          {profiles.map(p=>{
            const application=p.applications[0];
            return (
              <a className="ux-nl-engine-list-card" href={sitePath(nlStage1EnginePath(p.slug))} key={p.slug}>
                <span className="ux-nl-engine-mini-kicker">RDW-varianten gecontroleerd · {application.fuel==="Diesel"?"Diesel":"Benzine"}</span>
                <strong>{p.headline}</strong>
                <span className="ux-nl-engine-mini-sub">{application.stockPowerHp} pk origineel · {application.displacementCc} cc</span>
                <span className="ux-nl-engine-mini-cta">Bekijk Stage 1 en bronnen<ChevronRight aria-hidden="true" className="h-4 w-4"/></span>
              </a>
            );
          })}
         </div>
        </div>
      );
    })}
   </section>
   <section className="container ux-nl-engine-index-disclaimer">
    <h2>Waarom niet iedere RDW-uitvoering een eigen pagina krijgt</h2>
    <p>Een technisch modelnummer identificeert niet automatisch de motorcode, ECU-versie of versnellingsbak.
     Daarom voegen we overeenkomstige bronvarianten samen en publiceren we alleen motorprofielen die
     voldoende onderscheidende informatie bevatten. Stage 2 en Stage 3 krijgen hier geen automatische vermogensbelofte.</p>
    <a href={sitePath("/nl#manual-selector")}>Zoek jouw merk, bouwjaar en motor<ChevronRight aria-hidden="true" className="h-4 w-4"/></a>
   </section>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")}/>
  </main>
 );
}

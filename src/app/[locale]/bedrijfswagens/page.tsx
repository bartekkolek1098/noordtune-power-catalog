import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowUpRight,CheckCircle2,ChevronRight,Search,Truck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {VanDirectory,type VanDirectoryItem} from "@/components/van-directory";
import {nlVanModels,nlVanPending,nlVanModelPath} from "@/data/nl-vans-seo";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref,mainLocaleHref} from "@/lib/noordtune-links";

type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 if(locale!=="nl")return {robots:{index:false,follow:false}};
 const title="Bedrijfswagens chiptuning | Ford, VW, Mercedes, Toyota & Peugeot";
 const description="Zoek jouw bestelwagen of bus: Ford Transit, VW Transporter, Mercedes Sprinter, Toyota Proace, Peugeot Partner en meer. RDW-motorprofielen en Stage 1 met bronnen.";
 return {
  title,description,
  robots:{index:true,follow:true},
  alternates:{canonical:absoluteUrl("/nl/bedrijfswagens")},
  openGraph:{title,description,url:absoluteUrl("/nl/bedrijfswagens"),locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"website"}
 };
}
const officialSCR="https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/goederenvervoer/goederenvervoer-over-de-weg/controle-op-uitlaatsysteem-en-adblue-van-voertuigen-op-diesel-gas-en-waterstof";

export default async function NlBusinessVanDirectory({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const items:VanDirectoryItem[]=[
  ...nlVanModels.map(m=>({
   slug:m.slug,make:m.make,model:m.model,size:m.size,indexed:true,
   hasStage1:m.applications.length>0,href:sitePath(nlVanModelPath(m.slug))
  })),
  ...nlVanPending.map(m=>({
   slug:m.slug,make:m.make,model:m.model,size:m.size,indexed:false,hasStage1:false,
   href:sitePath("/nl#manual-selector")
  }))
 ];
 const brandCount=new Set(items.map(x=>x.make)).size;
 const jsonLd={
  "@context":"https://schema.org","@type":"CollectionPage",
  name:"Chiptuning en motorprofielen voor bedrijfswagens",inLanguage:"nl-NL",
  url:absoluteUrl("/nl/bedrijfswagens"),
  description:"Nederlandstalige catalogus voor bedrijfswagens met RDW-gegevens, motorverschillen en geverifieerde Stage 1-publicaties waar beschikbaar.",
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{"@type":"ItemList",itemListElement:nlVanModels.map((m,i)=>({
   "@type":"ListItem",position:i+1,name:m.make+" "+m.model,
   url:absoluteUrl(nlVanModelPath(m.slug))
  }))}
 };
 return (
  <main className="ux-home ux-vans-page min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-vans-hero">
    <div className="container">
     <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
      <a href={sitePath("/nl")}>Vermogenscatalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <span>Bedrijfswagens en bussen</span>
     </nav>
     <p className="ux-eyebrow">NOORDTUNE · MOTORPROFIELEN VOOR DE ZAKELIJKE RIJDER</p>
     <h1>Meer inzicht in <span>jouw werkbus.</span></h1>
     <p className="ux-vans-hero-copy">Van Ford Transit en Volkswagen Transporter tot Mercedes Sprinter, Toyota Proace en Peugeot Expert.
      Vergelijk motorvarianten en bronvermelde Stage 1-indicaties, of gebruik de RDW-kentekencheck voor een specifieke bus.
      Een bedrijfswagen met lading vraagt controle van ECU, transmissie en emissiesysteem vóór aanpassing.</p>
     <div className="ux-vans-hero-actions">
      <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
      <a className="ux-nl-engine-secondary-link" href="#van-modellen"><Truck className="h-4 w-4" aria-hidden="true"/>Alle modellen bekijken</a>
     </div>
     <div className="ux-vans-hero-facts" aria-label="Huidige modeldekking van de NoordTune-catalogus">
      <div><strong>{brandCount}</strong><span>bestelwagenmerken</span></div>
      <div><strong>{items.length}</strong><span>modellen in de voertuigzoeker</span></div>
      <div><strong>{nlVanModels.length}</strong><span>uitgebreide NL-modelprofielen</span></div>
     </div>
    </div>
   </section>
   <section className="container ux-vans-directory-section" aria-labelledby="van-choose-heading">
    <p className="ux-eyebrow">KIES JE VOERTUIG</p>
    <h2 id="van-choose-heading">Welk merk en welke bus rijd je?</h2>
    <p>Zoek hieronder je bedrijfswagen of filter op formaat. Bij modellen met gecontroleerde bronnen staan
      de technische kW-varianten apart. Voor overige modellen ga je door naar de kentekencheck of de handmatige selectie.</p>
    <VanDirectory items={items}/>
   </section>
   <section className="ux-vans-business" aria-labelledby="van-business-heading">
    <div className="container ux-vans-business-layout">
     <div>
      <p className="ux-eyebrow">BOUW · INSTALLATIE · SERVICE · TRANSPORT</p>
      <h2 id="van-business-heading">Vermogensinformatie voor een bus die dagelijks moet werken.</h2>
      <p>Een bestelwagen is geen lege testauto. Belading, aanhangers, opbouw, kilometers en
       thermische belasting bepalen mee welke koppelmarge technisch verantwoord is. Deze catalogus
       helpt de juiste motor te vinden; NoordTune beoordeelt de daadwerkelijke auto daarna afzonderlijk.</p>
     </div>
     <div className="ux-vans-business-steps">
      <div><span>01</span><strong>RDW en originele motor controleren</strong><p>Merk, bouwjaar, type, motorinhoud en fabrieksvermogen zijn het startpunt.</p></div>
      <div><span>02</span><strong>ECU, automaat en belasting beoordelen</strong><p>Een algemene Stage 1-claim kan niet de exacte hardware en gebruiksbelasting voorspellen.</p></div>
      <div><span>03</span><strong>Bronnen of individuele beoordeling</strong><p>Alleen onderbouwde cijfers verschijnen; anders volgt uitleg en een aanvraag voor advies.</p></div>
     </div>
    </div>
   </section>
   <section className="container ux-vans-adblue" id="adblue" aria-labelledby="vans-adblue-title">
    <div className="ux-vans-adblue-intro">
      <p className="ux-eyebrow">SCR / ADBLUE · WAT MAG OP DE OPENBARE WEG?</p>
      <h2 id="vans-adblue-title">AdBlue-storing in je bestelwagen?</h2>
      <p>Een SCR- of AdBlue-waarschuwing bij Transit, Sprinter, Crafter, Proace of Boxer is een reden
       voor diagnose — niet voor het uitschakelen van emissiecontrole. Sinds 1 juli 2026 controleert
       de politie in Nederland het emissiesysteem van onder meer bedrijfswagens.
       Bij gebruik op de openbare weg moet het systeem goed functioneren en mag het niet uitgeschakeld zijn.</p>
      <a className="ux-vans-legal-link" href={officialSCR} target="_blank" rel="noopener noreferrer">
       Lees de officiële regels van de Rijksoverheid<ArrowUpRight className="h-4 w-4" aria-hidden="true"/>
      </a>
    </div>
    <div className="ux-vans-adblue-steps">
      {[
       ["Foutcodes uitlezen","Begin bij ECU-storingscodes, NOx-sensoren, foutgeschiedenis en de werkelijke oorzaak."],
       ["SCR en AdBlue beoordelen","Controleer vloeistofkwaliteit, doseersysteem, tank/pomp en gerelateerde bedrading."],
       ["Conform repareren","Herstel de emissievoorzieningen en beoordeel pas daarna een eventuele motoroptimalisatie."]
      ].map(x=>(
       <article key={x[0]}><CheckCircle2 className="h-5 w-5" aria-hidden="true"/><h3>{x[0]}</h3><p>{x[1]}</p></article>
      ))}
    </div>
   </section>
   <section className="ux-vans-handoff" aria-labelledby="vans-handoff-heading">
    <div className="container ux-vans-handoff-layout">
     <div>
      <p className="ux-eyebrow">NOORDTUNE.NL · OFFICIËLE WERKPLAATS</p>
      <h2 id="vans-handoff-heading">Van motorinformatie naar professioneel advies.</h2>
      <p>Deze subsite is de vermogenscatalogus. Voor diensten, diagnosestellingen, kosten,
       uitvoering en afspraken bezoek je de hoofdwebsite van NoordTune in Assen.</p>
     </div>
     <div className="ux-vans-handoff-links">
      <a className="ux-nl-engine-primary-link" href={chiptuningHref("nl")}>Chiptuning bij NoordTune.nl<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
      <a className="ux-nl-engine-secondary-link" href={mainLocaleHref("nl")}>Naar de hoofdwebsite<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </div>
   </section>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")}/>
  </main>
 );
}

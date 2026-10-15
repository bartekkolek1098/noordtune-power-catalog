import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ChevronRight,Search,CarFront,Truck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlBrandEngineGuides,nlBrandEngineIndexPath,nlBrandGuidePath} from "@/data/nl-brand-engine-guides";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";

type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 if(locale!=="nl")return {robots:{index:false,follow:false}};
 const title="Automotoren en bedrijfswagens per merk | NoordTune Power Catalog";
 const description="Vergelijk bronvermelde Stage 1-motoren per automerk. BMW, Audi, Volkswagen, Mercedes, Ford, Toyota en meer: RDW-kW, ECU, modelgeneraties en bedrijfswagens.";
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:absoluteUrl(nlBrandEngineIndexPath)},
  openGraph:{title,description,url:absoluteUrl(nlBrandEngineIndexPath),locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"website"}};
}
export default async function NlBrandEngineIndex({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const ordered=[...nlBrandEngineGuides].sort((a,b)=>a.name.localeCompare(b.name,"nl"));
 const jsonLd={"@context":"https://schema.org","@type":"CollectionPage",
  name:"Technische Stage 1-motoren per merk",url:absoluteUrl(nlBrandEngineIndexPath),
  inLanguage:"nl-NL",isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{"@type":"ItemList",itemListElement:ordered.map((g,i)=>({
   "@type":"ListItem",position:i+1,name:g.name,url:absoluteUrl(nlBrandGuidePath(g.slug))}))}};
 return <main className="ux-home min-h-screen overflow-x-clip">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  <CatalogHeader locale="nl"/>
  <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(227,6,19,.17),transparent_48%),#0b0d0e]">
   <div className="container py-14 md:py-20">
    <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
     <a href={sitePath("/nl")}>Vermogenscatalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/><span>Motoren per merk</span>
    </nav>
    <p className="ux-eyebrow mt-7">VAN MERK NAAR EXACTE MOTOR · RDW · BRONNEN</p>
    <h1 className="racing-title mt-3 max-w-5xl text-[clamp(2.7rem,7vw,5.5rem)] leading-[.92] text-white [overflow-wrap:anywhere]">Jouw merk. <span className="text-primary">De juiste motor.</span></h1>
    <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
     Zoek eerst je merk en vergelijk daarna de reeds gecontroleerde motorversies en modelgeneraties.
     Je vindt fabrieksvermogen uit RDW, onafhankelijke Stage 1-publicaties, ECU-aandachtspunten
     en waar relevant de afzonderlijke bedrijfswagens. Niet ieder geregistreerd voertuig heeft een onderbouwd tuningprofiel.
    </p>
    <div className="mt-7 flex flex-wrap gap-3">
     <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}><Search className="h-4 w-4" aria-hidden="true"/>Controleer je kenteken</a>
     <a className="ux-nl-engine-secondary-link" href={sitePath("/nl/motoren")}>Alle onderzochte motoren<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
    </div>
   </div>
  </section>
  <section className="container py-12 md:py-16" aria-labelledby="nl-brands-title">
   <h2 id="nl-brands-title" className="racing-title text-3xl text-white md:text-5xl">{ordered.length} technisch onderzochte merken</h2>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">Deze merken hebben minimaal twee afzonderlijke, gepubliceerd onderbouwde motorprofielen. Klik door naar een exact model; cijfers tussen motoren, bouwjaren of versnellingsbakken worden niet uitgewisseld.</p>
   <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="nl-brand-directory">
    {ordered.map(g=><a
     className="group flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-white/15 bg-white/[.035] p-5 transition-colors hover:border-primary/55 hover:bg-white/[.065] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
     href={sitePath(nlBrandGuidePath(g.slug))} key={g.slug} data-brand-slug={g.slug}>
      <span className="flex items-start justify-between gap-3">
       <strong className="racing-title text-2xl text-white [overflow-wrap:anywhere]">{g.name}</strong>
       <ChevronRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true"/>
      </span>
      <span className="text-sm leading-6 text-white/65">{g.difference.slice(0,195).trimEnd()}…</span>
      <span className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-white/75">
       {g.passenger.length>0?<span className="inline-flex items-center gap-1 border border-white/15 px-2 py-1"><CarFront className="h-3.5 w-3.5" aria-hidden="true"/>{g.passenger.length} automotoren</span>:null}
       {g.vanEngines.length>0?<span className="inline-flex items-center gap-1 border border-white/15 px-2 py-1"><Truck className="h-3.5 w-3.5" aria-hidden="true"/>{g.vanEngines.length} busmotoren</span>:null}
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Vergelijk {g.name}-motoren<ChevronRight className="h-4 w-4" aria-hidden="true"/></span>
    </a>)}
   </div>
  </section>
  <section className="container pb-14 md:pb-20">
   <div className="rounded-xl border-l-2 border-primary bg-white/[.035] p-6">
    <h2 className="racing-title text-2xl text-white">Waarom publiceren we niet iedere uitvoering?</h2>
    <p className="mt-3 max-w-4xl text-sm leading-7 text-white/70">Een merk of kenteken vertelt nog niet de volledige ECU, motorcode, transmissie of softwareversie. Daarom koppelen we alleen bestaande, met RDW en externe bronnen beoordeelde motoren aan deze merkwijzer. Stage 1-waarden zijn indicatief; bij ontbrekende bronnen kun je de RDW-check of handmatige voertuigenzoeker gebruiken.</p>
    <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-white">
     <a className="underline decoration-primary underline-offset-4" href={sitePath("/nl/modellen")}>Automodellen vergelijken</a>
     <a className="underline decoration-primary underline-offset-4" href={sitePath("/nl/bedrijfswagens")}>Alle bedrijfswagens</a>
     <a className="underline decoration-primary underline-offset-4" href={sitePath("/nl#manual-selector")}>Handmatige motorselectie</a>
    </div>
   </div>
  </section>
  <CatalogFooter locale="nl"/>
  <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")}/>
 </main>;
}

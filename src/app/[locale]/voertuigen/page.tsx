import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {engineCatalog} from "@/data/catalog";
import {nlVehicleEditorialById,nlVehicleDirectoryPath,nlVehicleEngineTitle} from "@/data/nl-vehicle-editorial";
import {absoluteUrl,vehicleDetailPath,breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return [{locale:"nl"}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale}=await params;
 if(locale!=="nl")return {robots:{index:false,follow:false}};
 return {
  title:"Chiptuning per auto en motor vergelijken | NoordTune",
  description:"Vergelijk 24 gecontroleerde motorprofielen: BMW, Volkswagen, Audi, Mercedes, Ford, Volvo, Škoda en SEAT. ECU-informatie, Stage 1-bronnen en offerte per voertuig.",
  alternates:{canonical:absoluteUrl(nlVehicleDirectoryPath),languages:{nl:absoluteUrl(nlVehicleDirectoryPath)}},
  openGraph:{title:"Chiptuning per motor: technische uitleg | NoordTune",description:"Zoek een passende motorvariant en lees waarin ECU, generaties en Stage 1-bronnen verschillen.",url:absoluteUrl(nlVehicleDirectoryPath),type:"website",locale:"nl_NL"}
 };
}
const brandOrder=["BMW","Volkswagen","Audi","Mercedes-Benz","Ford","Volvo","Skoda","SEAT"];
export default async function ReviewedVehiclesDirectory({params}:Props){
 const {locale}=await params;if(locale!=="nl")notFound();
 const groups=brandOrder.flatMap(brand=>{const items=engineCatalog.filter(v=>v.brand===brand&&nlVehicleEditorialById.has(v.id));return items.length?[{brand,items}]:[];});
 const breadcrumbs=breadcrumbListJsonLd([{name:"NoordTune",url:absoluteUrl("/nl")},{name:"Gecontroleerde motoren",url:absoluteUrl(nlVehicleDirectoryPath)}]);
 return <main className="min-h-screen bg-background pb-14" data-testid="nl-vehicle-directory">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbs)}}/>
  <CatalogHeader locale="nl" languagePath="/"/>
  <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(200,18,33,.17),transparent_55%),#0b0d10]"><div className="container py-12 sm:py-16">
   <nav aria-label="Broodkruimel" className="text-xs text-slate-400"><Link href="/nl" className="underline">Catalogus</Link> / Gecontroleerde motoren</nav>
   <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-primary">NoordTune · motoren per generatie</p>
   <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl">Chiptuning per auto en motor vergelijken</h1>
   <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">Kies niet alleen een merknaam. Bekijk de originele motorvariant, ECU-aandachtspunten, verschillen tussen generaties en beschikbare Stage 1-bronnen. Voor iedere motor staat een Nederlandse technische toelichting klaar.</p>
   <div className="mt-7 flex flex-wrap gap-3"><a href="#motoren" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white">Bekijk de motoren ↓</a><Link href="/nl#manual-selector" className="inline-flex min-h-11 items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white hover:border-primary">Zoek je auto handmatig</Link></div>
  </div></section>
  <section className="container py-10" aria-label="Hoe gebruik je de catalogus"><div className="grid gap-4 md:grid-cols-3">
   {[
    ["1. Zoek de juiste motor","Hetzelfde model kan verschillende motorcodes, fabrieksvermogens en ECU-generaties hebben. Controleer de originele uitvoering."],
    ["2. Lees de verschillen","Elke pagina legt uit welke generaties niet uitwisselbaar zijn en welke controles bij Stage 1 belangrijk zijn."],
    ["3. Vraag een persoonlijk voorstel","De catalogus toont bronindicaties, geen gegarandeerde uitkomst. Een offerte hangt af van jouw motor, transmissie en gebruik."]
   ].map(([title,text])=><article key={title} className="rounded-xl border border-white/15 bg-white/[.035] p-5"><h2 className="text-lg font-bold text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-300">{text}</p></article>)}
  </div></section>
  <section id="motoren" className="container scroll-mt-28 py-8">
   <h2 className="text-2xl font-black text-white sm:text-3xl">24 apart beoordeelde motorprofielen</h2>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Op iedere motorpagina staat een legaal herbruikbare generatiefoto met auteur en licentie. De foto toont geen NoordTune-klantauto. Niet alle RDW-varianten hebben al een zelfstandige SEO-pagina.</p>
   {groups.map(group=><section key={group.brand} className="mt-9">
    <h3 className="text-xl font-bold text-white">{group.brand} <span className="text-sm font-normal text-slate-400">({group.items.length})</span></h3>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
     {group.items.map(v=><Link key={v.id} href={vehicleDetailPath("nl",v)} className="group flex min-h-32 min-w-0 flex-col justify-between rounded-lg border border-white/15 bg-[#111519] p-5 transition-colors hover:border-primary" data-testid="nl-vehicle-directory-link">
       <span className="text-base font-bold text-white group-hover:text-primary">{v.model}</span>
       <span className="mt-2 text-sm text-slate-300">{nlVehicleEngineTitle(v.id,v.engine)} · {v.stockPowerHp} pk origineel</span>
       <span className="mt-4 text-xs font-bold text-primary">Techniek, bronnen en Stage 1 →</span>
     </Link>)}
    </div>
   </section>)}
  </section>
  <aside className="container py-10"><div className="rounded-xl border border-primary/30 bg-primary/[.08] p-6">
   <h2 className="text-xl font-bold text-white">Staat jouw motor niet in dit overzicht?</h2>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">Gebruik de volledige zoekfunctie om je auto handmatig of via de Nederlandse registratie op te zoeken. Resultaten met bronnen blijven onderscheiden van uitvoeringen die eerst een werkplaatscontrole nodig hebben.</p>
   <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
    <Link className="underline hover:text-primary" href="/nl#manual-selector">Zoeken in de catalogus →</Link>
    <Link className="underline hover:text-primary" href="/nl/bedrijfswagens">Bedrijfswagens →</Link>
    <Link className="underline hover:text-primary" href="/nl/motoren">Overige Stage 1-motoren →</Link>
   </div>
  </div></aside>
  <CatalogFooter locale="nl"/>
 </main>;
}

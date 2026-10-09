import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,ChevronRight,Info,Search,ShieldCheck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlVanEngines,nlVanEngineBySlug,nlVanEngineMetadata} from "@/data/nl-van-engines-seo";
import {nlVanModelBySlug,nlVanEnginePath,nlVanModelPath,type ApprovedVanApplication} from "@/data/nl-vans-seo";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return nlVanEngines.map(x=>({locale:"nl",slug:x.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 const e=nlVanEngineBySlug.get(slug);
 if(locale!=="nl"||!e)return {robots:{index:false,follow:false}};
 const {title,description}=nlVanEngineMetadata(e);
 const url=absoluteUrl(nlVanEnginePath(slug));
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:url},
  openGraph:{title,description,siteName:"NoordTune Power Catalog",locale:"nl_NL",type:"article",url}};
}
function sourceRange([a,b]:readonly [number,number],suffix:string){
 return String(a)+(a===b?"":"–"+b)+" "+suffix;
}
function factoryPower(apps:readonly ApprovedVanApplication[]){
 const nums=apps.map(x=>x.stockPowerHp);
 const lowest=Math.min(...nums),highest=Math.max(...nums);
 return sourceRange([lowest,highest],"pk");
}
function publishedGain(apps:readonly ApprovedVanApplication[]){
 const nums=apps.flatMap(x=>[x.powerRangeHp[0]-x.stockPowerHp,x.powerRangeHp[1]-x.stockPowerHp]);
 return sourceRange([Math.min(...nums),Math.max(...nums)],"pk");
}
export default async function NlVanStage1Engine({params}:Props){
 const {locale,slug}=await params;
 const e=nlVanEngineBySlug.get(slug);
 if(locale!=="nl"||!e)notFound();
 const m=nlVanModelBySlug.get(e.modelSlug);
 if(!m)notFound();
 const power=[Math.min(...e.applications.map(x=>x.powerRangeHp[0])),Math.max(...e.applications.map(x=>x.powerRangeHp[1]))] as const;
 const torque=[Math.min(...e.applications.map(x=>x.torqueRangeNm[0])),Math.max(...e.applications.map(x=>x.torqueRangeNm[1]))] as const;
 const url=absoluteUrl(nlVanEnginePath(e.slug));
 const breadcrumb=breadcrumbListJsonLd([
  {name:"Vermogenscatalogus",url:absoluteUrl("/nl")},
  {name:"Bedrijfswagens",url:absoluteUrl("/nl/bedrijfswagens")},
  {name:m.make+" "+m.model,url:absoluteUrl(nlVanModelPath(m.slug))},
  {name:e.title,url}
 ]);
 const schema={"@context":"https://schema.org","@type":"WebPage",url,
  inLanguage:"nl-NL",name:nlVanEngineMetadata(e).title,
  description:nlVanEngineMetadata(e).description,
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  citation:e.sources.map(s=>s.url)};
 return (
  <main className="ux-home ux-van-engine-page min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-van-model-hero ux-van-engine-hero">
    <div className="container">
     <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
      <a href={sitePath("/nl")}>Catalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <a href={sitePath("/nl/bedrijfswagens")}>Bedrijfswagens</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <a href={sitePath(nlVanModelPath(m.slug))}>{m.model}</a>
      <ChevronRight className="h-4 w-4" aria-hidden="true"/><span>{e.title}</span>
     </nav>
     <p className="ux-eyebrow">STAGE 1-BRONNEN · EXACTE RDW-MOTORVARIANTEN</p>
     <h1>{e.title}<span>Stage 1 · indicatief.</span></h1>
     <p>{e.intro}</p>
     <div className="ux-nl-engine-primary-facts">
      <div><span>Oorspronkelijk RDW-vermogen</span><strong>{factoryPower(e.applications)}</strong></div>
      <div><span>Stage 1 volgens bronpublicaties</span><strong>{sourceRange(power,"pk")}</strong></div>
      <div><span>Stage 1-koppel volgens bronnen</span><strong>{sourceRange(torque,"Nm")}</strong></div>
      <div><span>Indicatieve vermogenstoename</span><strong>{publishedGain(e.applications)}</strong></div>
     </div>
     <p className="ux-nl-engine-scope-note"><Info className="h-4 w-4 shrink-0" aria-hidden="true"/>De Stage 1-waarden komen van onafhankelijke publicaties, niet van een individuele NoordTune-meting. Motorcode, ECU en versnellingsbak bepalen of jouw auto geschikt is.</p>
    </div>
   </section>
   <div className="container ux-van-engine-content">
    <section className="ux-van-model-section" aria-labelledby="van-motor-facts">
     <p className="ux-eyebrow">NIET EEN GETAL VOOR ELKE BESTELWAGEN</p>
     <h2 id="van-motor-facts">Geregistreerde technische varianten</h2>
     <div className="ux-van-model-audit-grid">
      {e.applications.map(a=>(
       <article className="ux-van-model-audit" key={a.id} data-testid="van-engine-rdw-variant">
        <div className="ux-van-model-audit-top"><strong>{a.stockPowerHp} pk af fabriek</strong><span>RDW-type {a.requiredRdwType} · {a.yearFrom}{a.yearFrom===a.yearTo?"":"–"+a.yearTo}</span></div>
        <dl>
         <div><dt>Origineel geregistreerd</dt><dd>{String(a.registeredPowerKw).replace(".",",")} kW · {a.displacementCc} cc</dd></div>
         <div><dt>Brandstof en cilinders</dt><dd>{a.fuel==="Diesel"?"Diesel":"Benzine"} · {a.cylinders} cilinders</dd></div>
         <div><dt>Stage 1-vermogen</dt><dd>{sourceRange(a.powerRangeHp,"pk")}</dd></div>
         <div><dt>Stage 1-moment</dt><dd>{sourceRange(a.torqueRangeNm,"Nm")}</dd></div>
         <div><dt>Gepubliceerd origineel koppel*</dt><dd>{a.stockTorqueNm} Nm</dd></div>
        </dl>
       </article>
      ))}
     </div>
     <p className="ux-van-model-factory-note">*Het originele koppel komt uit externe motorpublicaties, niet rechtstreeks uit het RDW-register. Bronverschillen, ECU en transmissielimieten moeten individueel worden gecontroleerd.</p>
    </section>
    <section className="ux-van-model-section" aria-labelledby="van-motor-workshop">
     <p className="ux-eyebrow">HARDWARE · ECU · TECHNISCHE CONDITIE</p>
     <h2 id="van-motor-workshop">Wat moet een werkplaats controleren?</h2>
     <p>{e.checks}</p>
     <div className="ux-van-model-check-grid">
      {[
       ["01","Oorspronkelijke voertuigidentiteit","RDW-type, vermogen in kW, motorinhoud, brandstof en toelatingsjaar."],
       ["02","ECU, versnellingsbak en inzet","Softwareversie, turbo, koppeling of automaat en werkzaamheden met belading of trekhaak."],
       ["03","Conforme emissiereiniging","DPF, SCR/AdBlue en foutcodes moeten goed blijven functioneren; eerst diagnose bij storingen."]
      ].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
     </div>
    </section>
    <section className="ux-van-model-section ux-van-engine-sources" aria-labelledby="van-motor-sources">
     <p className="ux-eyebrow">WAAR KOMEN DE STAGE 1-CIJFERS VANDAAN?</p>
     <h2 id="van-motor-sources">Onafhankelijke tuningpublicaties</h2>
     <p>Voor deze motorvariant zijn minimaal twee bronpublicaties beoordeeld. De cijfers gelden uitsluitend voor de aangegeven uitvoering; wij hebben geen individuele dyno-uitslag of ECU-compatibiliteit bevestigd.</p>
     <ul className="ux-van-engine-source-links">
      {e.sources.map(s=><li key={s.url}>
       <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true"/></a>
       {s.retrievedAt?<span>Geraadpleegd: {s.retrievedAt}</span>:null}
      </li>)}
     </ul>
    </section>
    <aside className="ux-van-model-compliance">
     <ShieldCheck className="h-7 w-7" aria-hidden="true"/>
     <div><h2>AdBlue/SCR en emissiecontrole blijven werken</h2>
     <p>Bij een bestelwagen op de openbare weg is uitschakelen van SCR/AdBlue geen wettelijke reparatie. Laat NOx-sensoren, pomp, doseerunit en foutcodes onderzoeken; herstel het systeem vóór beoordeling van een Stage 1-kalibratie.</p>
     <a href="https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/goederenvervoer/goederenvervoer-over-de-weg/controle-op-uitlaatsysteem-en-adblue-van-voertuigen-op-diesel-gas-en-waterstof" target="_blank" rel="noopener noreferrer">Nederlandse regelgeving Rijksoverheid<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a></div>
    </aside>
    <section className="ux-van-model-handoff" aria-labelledby="van-motor-contact">
     <div><p className="ux-eyebrow">VAN BRONCIJFERS NAAR WERKELIJKE AUTO</p>
     <h2 id="van-motor-contact">Wat is verantwoord bij jouw {e.title}?</h2>
     <p>Controleer je kenteken en overleg de werkelijke ECU, kilometerstand en bedrijfsinzet met NoordTune. Voor diensten, prijzen en afspraken bezoek je NoordTune.nl.</p></div>
     <div className="ux-van-model-handoff-links">
      <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
      <a href={whatsappHref({locale:"nl",vehicleLabel:e.title})} rel="noreferrer" target="_blank" className="ux-nl-engine-secondary-link">Individuele beoordeling<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
      <a href={chiptuningHref("nl")} className="ux-van-model-service-link">Chiptuning als dienst<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </section>
    <a className="ux-nl-engine-back" href={sitePath(nlVanModelPath(m.slug))}><ArrowLeft className="h-4 w-4" aria-hidden="true"/> Terug naar {m.make} {m.model}</a>
   </div>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")} vehicleLabel={e.title}/>
  </main>
 );
}

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,ChevronRight,Search} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlModelFamilyHubs,nlModelHubBySlug,nlModelHubMetadata,nlModelHubPath} from "@/data/nl-model-family-seo";
import {nlStage1EnginePath,allStage1PowerRange,allStage1TorqueRange} from "@/data/nl-stage1-engine-seo";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return nlModelFamilyHubs.map(m=>({locale:"nl",slug:m.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 const m=nlModelHubBySlug.get(slug);
 if(locale!=="nl"||!m)return {robots:{index:false,follow:false}};
 const {title,description}=nlModelHubMetadata(m);
 const url=absoluteUrl(nlModelHubPath(slug));
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:url},
  openGraph:{title,description,siteName:"NoordTune Power Catalog",locale:"nl_NL",url,type:"article"},
  twitter:{title,description,card:"summary"}
 };
}
function rangeLabel(nums:readonly number[],unit:string){
 const lower=Math.min(...nums),upper=Math.max(...nums);
 return `${lower===upper?lower:lower+"–"+upper} ${unit}`;
}
export default async function NlModelDetailPage({params}:Props){
 const {locale,slug}=await params;
 const m=nlModelHubBySlug.get(slug);
 if(locale!=="nl"||!m)notFound();
 const url=absoluteUrl(nlModelHubPath(m.slug));
 const jsonLd={
  "@context":"https://schema.org","@type":"WebPage",url,
  name:nlModelHubMetadata(m).title,
  description:nlModelHubMetadata(m).description,
  inLanguage:"nl-NL",isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{
   "@type":"ItemList",name:`${m.brand} ${m.model} motorvarianten`,
   itemListElement:m.engines.map((engine,index)=>({
     "@type":"ListItem",position:index+1,
     name:engine.headline,url:absoluteUrl(nlStage1EnginePath(engine.slug))
   }))
  }
 };
 const breadcrumbs=breadcrumbListJsonLd([
  {name:"Vermogenscatalogus",url:absoluteUrl("/nl")},
  {name:"Automodellen",url:absoluteUrl("/nl/modellen")},
  {name:m.model,url}
 ]);
 return (
  <main className="ux-home ux-nl-model-detail min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbs)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-nl-model-intro ux-nl-model-detail-intro">
    <div className="container">
     <nav aria-label="Kruimelpad" className="ux-nl-engine-breadcrumbs">
      <a href={sitePath("/nl")}>Catalogus</a><ChevronRight aria-hidden="true" className="h-4 w-4"/>
      <a href={sitePath("/nl/modellen")}>Automodellen</a><ChevronRight aria-hidden="true" className="h-4 w-4"/><span>{m.model}</span>
     </nav>
     <p className="ux-eyebrow">VERGELIJKING VAN TECHNISCHE MOTORVARIANTEN</p>
     <h1>{m.brand} {m.model}<span>Stage 1 per motor.</span></h1>
     <p>{m.intro}</p>
     <div className="ux-nl-model-feature-summary">
      <div><strong>{m.engines.length}</strong><span>beoordeelde motorfamilies</span></div>
      <div><strong>{m.engines.reduce((sum,e)=>sum+e.applications.length,0)}</strong><span>technische RDW-cohorten</span></div>
      <div><strong>{new Set(m.engines.flatMap(e=>e.sources.map(s=>s.url))).size}</strong><span>openbare bronlinks</span></div>
     </div>
    </div>
   </section>
   <div className="container ux-nl-model-detail-content">
    <section className="ux-nl-model-distinction" aria-labelledby="generations-title">
      <p className="ux-eyebrow">NIET ELKE UITVOERING IS GELIJK</p>
      <h2 id="generations-title">Wat verschilt er tussen de motoren?</h2>
      <p>{m.difference}</p>
    </section>
    <section className="ux-nl-model-compare" aria-labelledby="compare-title">
      <h2 id="compare-title">Vergelijk fabrieksvermogen en Stage 1</h2>
      <p className="ux-nl-model-compare-notice">Vermogens en koppelranges zijn afkomstig uit verschillende beoordeelde, externe tunerpublicaties. Ze vormen geen NoordTune-meting of garantie voor een individueel voertuig.</p>
      <div className="ux-nl-model-compare-grid">
       {m.engines.map(engine=>{
        const apps=engine.applications;
        const stage1=allStage1PowerRange(apps),nm=allStage1TorqueRange(apps);
        const years=`${Math.min(...apps.map(a=>a.yearFrom))}–${Math.max(...apps.map(a=>a.yearTo))}`;
        const factory=rangeLabel(apps.map(a=>a.stockPowerHp),"pk");
        return (
         <article data-testid="model-hub-variant-card" className="ux-nl-model-variant" key={engine.slug}>
           <span className="ux-nl-model-variant-years">{years} · {apps[0].fuel==="Diesel"?"Diesel":"Benzine"}</span>
           <h3>{engine.headline}</h3>
           <p>{engine.generationNote}</p>
           <dl>
            <div><dt>Origineel (RDW)</dt><dd>{factory}</dd></div>
            <div><dt>Stage 1 · indicatie</dt><dd>{rangeLabel(stage1,"pk")}</dd></div>
            <div><dt>Stage 1 · koppel</dt><dd>{rangeLabel(nm,"Nm")}</dd></div>
           </dl>
           <span className="ux-nl-model-variant-sub">{apps.map(a=>`${String(a.registeredPowerKw).replace(".",",")} kW · ${a.displacementCc} cc`).join(" / ")} · {engine.sources.length} bronverwijzingen</span>
           <a href={sitePath(nlStage1EnginePath(engine.slug))} className="ux-nl-model-variant-link">Bekijk motor, ECU-voorwaarden en bronnen<ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0"/></a>
         </article>
        );
       })}
      </div>
    </section>
    <section className="ux-nl-model-technical" aria-labelledby="technical-title">
      <p className="ux-eyebrow">RDW · MOTORCODE · ECU · VERSNELLINGSBAK</p>
      <h2 id="technical-title">Controle vóór individuele afstelling</h2>
      <p>{m.checks}</p>
      <div className="ux-nl-model-technical-steps">
       <div><span>01</span><strong>Lees de geregistreerde voertuiggegevens</strong><p>Originele kW, cilinderinhoud, brandstof, carrosserietype en datum eerste toelating.</p></div>
       <div><span>02</span><strong>Bevestig de werkelijke hardware</strong><p>Motorcode, ECU-firmware, turboversie en koppelcapaciteit van de gemonteerde transmissie.</p></div>
       <div><span>03</span><strong>Beoordeel conditie en wettelijke eisen</strong><p>Diagnose, onderhoud, koeling en emissievoorzieningen zijn bepalend voor een veilige uitvoering.</p></div>
      </div>
    </section>
    <section className="ux-nl-model-faq" aria-labelledby="model-faq-title" data-testid="model-hub-faq">
     <h2 id="model-faq-title">Veelgestelde vragen over {m.model}</h2>
     <div>{m.faq.map(([question,answer])=>(
      <details key={question}>
       <summary>{question}<span aria-hidden="true">+</span></summary>
       <p>{answer}</p>
      </details>
     ))}</div>
    </section>
    <section className="ux-nl-model-cta" aria-labelledby="model-cta-title">
     <div>
      <p className="ux-eyebrow">JOUW AUTO, JOUW UITVOERING</p>
      <h2 id="model-cta-title">Controleer het juiste motorprofiel via RDW</h2>
      <p>De modelvergelijking is een startpunt. Een kenteken geeft meer technische context, waarna NoordTune motorcode, ECU en transmissie kan controleren voor een individuele offerte.</p>
     </div>
     <div className="ux-nl-model-cta-actions">
       <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}><Search aria-hidden="true" className="h-4 w-4"/>Kenteken controleren</a>
       <a className="ux-nl-engine-secondary-link" href={whatsappHref({locale:"nl",vehicleLabel:m.brand+" "+m.model})} target="_blank" rel="noreferrer">Vraag advies <ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
       <a className="ux-nl-model-service-link" href={chiptuningHref("nl")}>Bekijk chiptuning als dienst op NoordTune.nl<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </section>
    <a className="ux-nl-engine-back" href={sitePath("/nl/modellen")}><ArrowLeft aria-hidden="true" className="h-4 w-4"/> Alle vergelijkbare automodellen</a>
   </div>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")} vehicleLabel={m.brand+" "+m.model}/>
  </main>
 );
}

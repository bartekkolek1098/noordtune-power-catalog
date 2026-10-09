import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowUpRight,ChevronRight,Info,Search,ShieldCheck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {nlVanModels,nlVanModelBySlug,nlVanModelPath,nlVanEnginePath,nlVanModelMetadata} from "@/data/nl-vans-seo";
import {nlVanEngines} from "@/data/nl-van-engines-seo";
import {nlStage1BySlug,nlStage1EnginePath} from "@/data/nl-stage1-engine-seo";
import {absoluteUrl} from "@/lib/site-url";
import {sitePath} from "@/lib/site-path";
import {chiptuningHref} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return nlVanModels.map(x=>({locale:"nl",slug:x.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 const m=nlVanModelBySlug.get(slug);
 if(locale!=="nl"||!m)return {robots:{index:false,follow:false}};
 const {title,description}=nlVanModelMetadata(m);
 const url=absoluteUrl(nlVanModelPath(m.slug));
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:url},
  openGraph:{title,description,locale:"nl_NL",siteName:"NoordTune Power Catalog",type:"article",url}};
}
function formattedRange(pair:readonly [number,number],unit:string){
 return String(pair[0])+(pair[0]===pair[1]?"":"–"+pair[1])+" "+unit;
}
function nlNumber(n:number){return String(n).replace(".",",");}


export default async function NlBusinessVanModel({params}:Props){
 const {locale,slug}=await params;
 const m=nlVanModelBySlug.get(slug);
 if(locale!=="nl"||!m)notFound();
 const enginePages=[
  ...m.engineSlugs.map(s=>{
   const engine=nlStage1BySlug.get(s);
   return engine?{slug:s,title:engine.headline,href:sitePath(nlStage1EnginePath(s)),context:engine.generationNote}:null;
  }).filter((x):x is NonNullable<typeof x>=>!!x),
  ...nlVanEngines.filter(e=>e.modelSlug===m.slug).map(e=>({
   slug:e.slug,title:e.title,href:sitePath(nlVanEnginePath(e.slug)),context:e.intro
  }))
 ];
 const siblings=nlVanModels.filter(x=>x.make===m.make&&x.slug!==m.slug).slice(0,4);
 const url=absoluteUrl(nlVanModelPath(m.slug));
 const schema={"@context":"https://schema.org","@type":"WebPage",inLanguage:"nl-NL",url,
  name:nlVanModelMetadata(m).title,description:nlVanModelMetadata(m).description,
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  about:{"@type":"Vehicle",brand:{"@type":"Brand",name:m.make},model:m.model}};
 const bread=breadcrumbListJsonLd([
  {name:"Vermogenscatalogus",url:absoluteUrl("/nl")},
  {name:"Bedrijfswagens",url:absoluteUrl("/nl/bedrijfswagens")},
  {name:m.make+" "+m.model,url}
 ]);
 return (
  <main className="ux-home ux-van-model-page min-h-screen overflow-x-clip">
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(bread)}}/>
   <CatalogHeader locale="nl"/>
   <section className="ux-van-model-hero">
    <div className="container">
     <nav className="ux-nl-engine-breadcrumbs" aria-label="Kruimelpad">
      <a href={sitePath("/nl")}>Vermogenscatalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <a href={sitePath("/nl/bedrijfswagens")}>Bedrijfswagens</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
      <span>{m.make} {m.model}</span>
     </nav>
     <p className="ux-eyebrow">BEDRIJFSWAGEN · ORIGINEEL VERMOGEN · ECU · STAGE 1</p>
     <h1>{m.make} {m.model}<span>Motoren en chiptuning.</span></h1>
     <p>{m.intro}</p>
     <div className="ux-van-model-hero-actions">
      <a className="ux-nl-engine-primary-link" href={sitePath("/nl#rdw-check")}>
       <Search className="h-4 w-4" aria-hidden="true"/>Zoek via kenteken
      </a>
      <a className="ux-nl-engine-secondary-link" href="#motor-varianten">Bekijk motoren
       <ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
     <div className="ux-van-model-keyfacts">
      <div><strong>{m.applications.length}</strong><span>exact beoordeelde RDW-toepassingen</span></div>
      <div><strong>{enginePages.length}</strong><span>motorpagina&apos;s met bronvermelding</span></div>
      <div><strong>{m.size==="Compact"?"Compact":m.size==="Middel"?"Middelgroot":"Groot"}</strong><span>bedrijfswagenformaat</span></div>
     </div>
    </div>
   </section>
   <div className="container ux-van-model-content">
    <section className="ux-van-model-section" aria-labelledby="van-generation-heading">
     <p className="ux-eyebrow">VERSCHILLEN TUSSEN MOTORGENERATIES</p>
     <h2 id="van-generation-heading">Welke uitvoering past bij jouw bus?</h2>
     <p>{m.difference}</p>
     <p className="ux-van-model-business-note">{m.usage}</p>
    </section>
    <section className="ux-van-model-section" id="motor-varianten" aria-labelledby="van-engine-cases-heading">
     <p className="ux-eyebrow">RDW · EXACTE IDENTITEIT · CONTROLEERBARE BRONNEN</p>
     <h2 id="van-engine-cases-heading">Bronvermelde Stage 1-varianten</h2>
     {m.applications.length>0?(
      <>
       <p>Deze cijfers komen uit eerder gecontroleerde tunerpublicaties voor het oorspronkelijke vermogen, de motorinhoud,
        RDW-typecode en de toelatingsjaren hieronder. Ze zijn geen NoordTune-meting, ECU-goedkeuring of garantie voor je eigen voertuig.</p>
       <div className="ux-van-model-audit-grid">
        {m.applications.map(a=>(
         <article className="ux-van-model-audit" key={a.id} data-testid="van-audited-variant">
          <div className="ux-van-model-audit-top">
           <strong>{a.stockPowerHp} pk origineel</strong>
           <span>{a.yearFrom}{a.yearFrom===a.yearTo?"":"–"+a.yearTo} · type {a.requiredRdwType}</span>
          </div>
          <dl>
           <div><dt>Geregistreerd origineel</dt><dd>{nlNumber(a.registeredPowerKw??0)} kW · {a.displacementCc} cc</dd></div>
           <div><dt>Stage 1 volgens bronnen</dt><dd>{formattedRange(a.powerRangeHp,"pk")}</dd></div>
           <div><dt>Stage 1-koppel volgens bronnen</dt><dd>{formattedRange(a.torqueRangeNm,"Nm")}</dd></div>
           <div><dt>Gepubliceerd fabriekskoppel*</dt><dd>{a.stockTorqueNm} Nm</dd></div>
          </dl>
          <p className="ux-van-model-audit-sources">{a.sources.length} externe bronverwijzingen ·
           {a.sources.slice(0,2).map(s=>(
            <a key={s.url} href={s.url} rel="noopener noreferrer" target="_blank">
             {new URL(s.url??"").hostname.replace(/^www\./,"")}<ArrowUpRight className="h-3 w-3" aria-hidden="true"/>
            </a>
           ))}
          </p>
         </article>
        ))}
       </div>
       <p className="ux-van-model-factory-note">*Het originele koppel is afkomstig van bronpublicaties;
        RDW geeft niet voor iedere uitvoering fabrieks-Nm. Afwijkende broncijfers en transmissielimieten
        moeten tijdens de beoordeling worden opgelost.</p>
      </>
     ):(
      <div className="ux-van-model-unverified" data-testid="van-no-stage1-data">
       <Info className="h-6 w-6" aria-hidden="true"/>
       <div><h3>Geen automatisch Stage 1-getal voor alle uitvoeringen</h3>
       <p>Voor dit model is nog geen voldoende nauwkeurige RDW-variant met twee onafhankelijke tunerbronnen vrijgegeven.
        We tonen liever geen willekeurige pk- of Nm-toename. Zoek jouw exacte bus op kenteken of vraag een individuele diagnose aan.</p>
       <a href={sitePath("/nl#rdw-check")}>Zoek het voertuig in RDW<ChevronRight className="h-4 w-4" aria-hidden="true"/></a></div>
      </div>
     )}
     {enginePages.length>0?(
      <div className="ux-van-model-engine-links">
       <h3>Individuele motorprofielen met bronnen</h3>
       <div>{enginePages.map(e=>(
        <a href={e.href} key={e.slug}><span><strong>{e.title}</strong><small>{e.context}</small></span>
         <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true"/></a>
       ))}</div>
      </div>
     ):null}
    </section>
    <section className="ux-van-model-section" aria-labelledby="van-diagnostic-heading">
     <p className="ux-eyebrow">BEDRIJFSWAGEN MET DAGELIJKSE BELASTING</p>
     <h2 id="van-diagnostic-heading">Wat controleren we vóór een afstelling?</h2>
     <p>{m.checks}</p>
     <div className="ux-van-model-check-grid">
      {[
       ["01","Echte motor en originele RDW-gegevens","De motorcode, originele kW, brandstof en bouwfase moeten met de bronvariant overeenkomen."],
       ["02","ECU, turbo en transmissie","We beoordelen software, koppeling, automaat of DSG en belasting bij werk, belading en trekhaak."],
       ["03","Emissie en diagnose","DPF, EGR, SCR/AdBlue, foutcodes en onderhoud moeten in orde zijn; klachten eerst opsporen."]
      ].map(x=>(
       <article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>
      ))}
     </div>
    </section>
    <section className="ux-van-model-compliance" aria-labelledby="van-scr-heading">
     <ShieldCheck className="h-7 w-7 shrink-0" aria-hidden="true"/>
     <div>
      <h2 id="van-scr-heading">AdBlue / SCR: diagnose en herstel, geen uitschakeling voor gebruik op de weg</h2>
      <p>Het emissiesysteem van een dieselbestelwagen moet in Nederland op de openbare weg goed functioneren.
       Laat waarschuwingen, NOx-sensoren, doseersysteem, tank/pomp en foutcodes controleren. Een katalysator- of
       AdBlue-storing oplossen door het systeem uit te zetten is geen wettelijk geldige oplossing voor een wegvoertuig.</p>
      <a href="https://www.rijksoverheid.nl/themas/verkeer-en-vervoer/goederenvervoer/goederenvervoer-over-de-weg/controle-op-uitlaatsysteem-en-adblue-van-voertuigen-op-diesel-gas-en-waterstof" target="_blank" rel="noopener noreferrer">
       Officiële regels Rijksoverheid<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </section>
    {m.manufacturerSource?(
     <p className="ux-van-model-maker-source">Fabrieksinformatie: <a href={m.manufacturerSource.url} rel="noopener noreferrer" target="_blank">
      {m.manufacturerSource.name}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true"/></a>.
      Een fabrikantbrochure bevestigt modelverschillen, maar niet de ECU van een individueel kenteken.</p>
    ):null}
    <section className="ux-van-model-section ux-van-model-faq" aria-labelledby="van-faq-heading">
     <p className="ux-eyebrow">VRAGEN OVER DEZE BEDRIJFSWAGEN</p>
     <h2 id="van-faq-heading">{m.make} {m.model}: veelgestelde vragen</h2>
     {m.faq.map(([question,answer])=>(
      <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>
     ))}
    </section>
    <section className="ux-van-model-handoff" aria-labelledby="van-advice-heading">
     <div><p className="ux-eyebrow">VAN CATALOGUS NAAR INDIVIDUEEL ADVIES</p>
     <h2 id="van-advice-heading">Wat is mogelijk met jouw {m.make} {m.model}?</h2>
     <p>De catalogus helpt de juiste motor te vinden. Diagnose, werkplaatswerk, prijzen en afspraken horen op de hoofdwebsite NoordTune.nl.</p></div>
     <div className="ux-van-model-handoff-links">
      <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
      <a href={whatsappHref({locale:"nl",vehicleLabel:m.make+" "+m.model})} rel="noreferrer" target="_blank" className="ux-nl-engine-secondary-link">
       Vraag een beoordeling<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
      <a href={chiptuningHref("nl")} className="ux-van-model-service-link">Chiptuning als dienst op NoordTune.nl<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
     </div>
    </section>
    {siblings.length>0?(
     <nav className="ux-van-model-related" aria-label={"Andere bedrijfswagens van "+m.make}>
      <h2>Andere bedrijfswagens van {m.make}</h2>
      <div>{siblings.map(s=><a href={sitePath(nlVanModelPath(s.slug))} key={s.slug}>
       {s.make} {s.model}<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>)}</div>
     </nav>
    ):null}
   </div>
   <CatalogFooter locale="nl"/>
   <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")} vehicleLabel={m.make+" "+m.model}/>
  </main>
 );
}

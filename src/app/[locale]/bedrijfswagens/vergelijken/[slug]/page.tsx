import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft,ArrowUpRight,ChevronRight,Info,Search,ShieldCheck,Truck} from "lucide-react";
import {CatalogHeader} from "@/components/catalog-header";
import {CatalogFooter} from "@/components/catalog-footer";
import {MobileActionBar} from "@/components/mobile-action-bar";
import {CatalogEnquiryLink} from "@/components/catalog-enquiry-link";
import {nlVanComparisons,nlVanCompareBySlug,nlVanComparePath,nlVanCompareIndexPath,nlVanCompareMetadata} from "@/data/nl-van-comparisons";
import {nlVanModelBySlug,nlVanModelPath,nlVanEnginePath} from "@/data/nl-vans-seo";
import {getNlBrandGuide,nlBrandGuidePath} from "@/data/nl-brand-engine-guides";
import {sitePath} from "@/lib/site-path";
import {absoluteUrl} from "@/lib/site-url";
import {dutchBusinessVansHref} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {breadcrumbListJsonLd} from "@/lib/seo";

type Props={params:Promise<{locale:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return nlVanComparisons.map(c=>({locale:"nl",slug:c.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params,c=nlVanCompareBySlug.get(slug);
 if(locale!=="nl"||!c)return {robots:{index:false,follow:false}};
 const {title,description}=nlVanCompareMetadata(c),url=absoluteUrl(nlVanComparePath(slug));
 return {title,description,robots:{index:true,follow:true},
  alternates:{canonical:url},
  openGraph:{title,description,url,type:"article",locale:"nl_NL",siteName:"NoordTune Power Catalog"},
  twitter:{title,description,card:"summary"}};
}
const nlNumber=(n:number)=>String(n).replace(".",",");
const range=(v:readonly [number,number],unit:string)=>nlNumber(v[0])+(v[0]===v[1]?"":"–"+nlNumber(v[1]))+" "+unit;
export default async function NlVanMotorCompare({params}:Props){
 const {locale,slug}=await params,c=nlVanCompareBySlug.get(slug);
 if(locale!=="nl"||!c)notFound();
 const m=nlVanModelBySlug.get(c.modelSlug);
 if(!m)notFound();
 const path=nlVanComparePath(c.slug),url=absoluteUrl(path);
 const schema={"@context":"https://schema.org","@type":"CollectionPage",
  name:nlVanCompareMetadata(c).title,url,inLanguage:"nl-NL",
  description:nlVanCompareMetadata(c).description,
  isPartOf:{"@type":"WebSite",name:"NoordTune Power Catalog",url:absoluteUrl("/")},
  mainEntity:{"@type":"ItemList",
   itemListElement:c.engines.map((e,i)=>({"@type":"ListItem",position:i+1,
    name:e.title,url:absoluteUrl(nlVanEnginePath(e.slug))}))}};
 const breadcrumb=breadcrumbListJsonLd([
  {name:"Catalogus",url:absoluteUrl("/nl")},
  {name:"Bedrijfswagens",url:absoluteUrl("/nl/bedrijfswagens")},
  {name:"Motorvergelijkingen",url:absoluteUrl(nlVanCompareIndexPath)},
  {name:c.make+" "+c.model,url}
 ]);
 const distinctKw=new Set(c.engines.flatMap(e=>e.applications.map(a=>a.registeredPowerKw)));
 return <main className="ux-home min-h-screen overflow-x-clip">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
  <CatalogHeader locale="nl"/>
  <section className="border-b border-white/15 bg-[radial-gradient(ellipse_at_85%_8%,rgba(227,6,19,.18),transparent_55%),#0c0e0f]">
   <div className="container py-12 md:py-20">
    <nav aria-label="Kruimelpad" className="ux-nl-engine-breadcrumbs">
     <a href={sitePath("/nl")}>Catalogus</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <a href={sitePath("/nl/bedrijfswagens")}>Bedrijfswagens</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <a href={sitePath(nlVanCompareIndexPath)}>Motoren vergelijken</a><ChevronRight className="h-4 w-4" aria-hidden="true"/>
     <span>{c.make} {c.model}</span>
    </nav>
    <p className="ux-eyebrow mt-7">RDW MOTORGENERATIES · ECU · STAGE 1-BRONNEN</p>
    <h1 className="racing-title mt-3 max-w-5xl text-[clamp(2.45rem,6vw,5rem)] leading-[.96] text-white [overflow-wrap:anywhere]">{c.headline}</h1>
    <p className="mt-6 max-w-5xl text-base leading-8 text-white/75 md:text-lg">{c.intro}</p>
    <div className="mt-7 flex min-w-0 flex-wrap gap-3">
     <a href="#exacte-uitvoeringen" className="ux-nl-engine-primary-link"><Truck className="h-4 w-4" aria-hidden="true"/>Vergelijk originele kW en Stage 1</a>
     <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-secondary-link"><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
    </div>
    <div className="mt-8 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4" data-testid="van-comparison-summary">
     {[
      [String(c.engines.length),"onderzochte motorprofielen"],
      [String(c.auditedScopes),"exacte RDW-toepassingen"],
      [String(distinctKw.size),"originele kW-waarden"],
      [String(c.sourceUrls),"unieke externe bronlinks"]
     ].map(([value,label])=><div key={label} className="rounded-lg border border-white/15 bg-black/30 p-4">
      <strong className="block text-2xl text-white">{value}</strong>
      <span className="text-xs leading-5 text-white/65">{label}</span>
     </div>)}
    </div>
   </div>
  </section>
  <div className="container space-y-14 py-12 md:space-y-16 md:py-16">
   <section aria-labelledby="van-compare-generations">
    <p className="ux-eyebrow">BOUWFASE EN MOTORCODE MAKEN HET VERSCHIL</p>
    <h2 id="van-compare-generations" className="racing-title mt-3 text-3xl text-white md:text-4xl">Waarom zijn dit geen uitwisselbare Stage 1-motoren?</h2>
    <p className="mt-5 max-w-5xl text-sm leading-8 text-white/75 md:text-base">{c.difference}</p>
   </section>
   <section id="exacte-uitvoeringen" aria-labelledby="van-compare-data" className="scroll-mt-28">
    <p className="ux-eyebrow">ORIGINEEL RDW-VERMOGEN · INDICATIEVE STAGE 1</p>
    <h2 id="van-compare-data" className="racing-title mt-3 text-3xl text-white md:text-5xl">{c.engines.length} afzonderlijk beoordeelde motoren</h2>
    <p className="mt-4 max-w-5xl text-sm leading-7 text-white/70">
     De onderstaande fabrieks-kW, cilinderinhoud, RDW-types en eerste toelatingsjaren behoren tot technisch afgebakende registraties.
     Stage 1-vermogen en koppel zijn letterlijk uit bestaande onafhankelijke bronreeksen overgenomen.
     Dit zijn geen prestaties die NoordTune heeft gemeten of aan jouw bestelwagen garandeert.
    </p>
    <div className="mt-7 grid min-w-0 gap-4 lg:grid-cols-2" data-testid="van-comparison-variants">
     {c.engines.map(e=><article key={e.slug} data-engine-slug={e.slug}
      className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/15 bg-white/[.035] p-5 md:p-6">
      <div>
       <span className="text-xs font-bold uppercase tracking-wide text-primary">{c.make} {c.model} · geverifieerde dieselmotor</span>
       <h3 className="mt-2 text-xl font-bold leading-7 text-white [overflow-wrap:anywhere]">{e.title}</h3>
       <p className="mt-2 text-sm leading-6 text-white/65">{e.intro}</p>
      </div>
      <div className="space-y-3" data-testid="van-comparison-rdw-scopes">
       {e.applications.map(a=><div key={a.id} className="rounded-lg border border-white/10 bg-black/25 p-4" data-application-id={a.id}>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/75">RDW-type {a.requiredRdwType} · eerste toelating {a.yearFrom}{a.yearFrom===a.yearTo?"":"–"+a.yearTo}</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
         <div><dt className="text-white/60">Origineel vermogen</dt><dd className="mt-1 font-semibold text-white">{nlNumber(a.registeredPowerKw!)} kW · {a.stockPowerHp} pk</dd></div>
         <div><dt className="text-white/60">Cilinderinhoud</dt><dd className="mt-1 font-semibold text-white">{a.displacementCc} cc</dd></div>
         <div><dt className="text-white/60">Stage 1 · bronindicatie</dt><dd className="mt-1 font-semibold text-white">{range(a.powerRangeHp,"pk")}</dd></div>
         <div><dt className="text-white/60">Moment · bronindicatie</dt><dd className="mt-1 font-semibold text-white">{range(a.torqueRangeNm,"Nm")}</dd></div>
        </dl>
       </div>)}
      </div>
      <div className="mt-auto border-t border-white/10 pt-4">
       <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Externe bronnen · {e.sources.length} publicaties</span>
       <div className="mt-2 flex flex-wrap gap-3">
        {e.sources.slice(0,2).map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"
         className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 underline decoration-primary underline-offset-4">
         {new URL(source.url??"").hostname.replace(/^www\./,"")}<ArrowUpRight className="h-3 w-3" aria-hidden="true"/>
        </a>)}
       </div>
       <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={sitePath(nlVanEnginePath(e.slug))}
         className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary underline underline-offset-4">
         Bekijk exacte motor en alle bronnen<ChevronRight className="h-4 w-4" aria-hidden="true"/>
        </a>
       </div>
       <CatalogEnquiryLink business locale="nl" reference={{kind:"engine",id:e.slug}} />
      </div>
     </article>)}
    </div>
   </section>
   <section aria-labelledby="van-compare-workshop">
    <p className="ux-eyebrow">TECHNIEK VÓÓR SOFTWARE</p>
    <h2 id="van-compare-workshop" className="racing-title mt-3 text-3xl text-white md:text-4xl">Wat NoordTune bij deze uitvoeringen controleert</h2>
    <p className="mt-5 max-w-5xl text-sm leading-8 text-white/75 md:text-base">{c.checks}</p>
    <div className="mt-6 flex items-start gap-4 rounded-lg border border-primary/30 bg-primary/[.07] p-5">
     <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true"/>
     <p className="text-sm leading-7 text-white/75">Bij weggebruik moeten DPF, SCR en AdBlue intact en werkzaam blijven. Een storing vraagt diagnose en conforme reparatie; emissie-uitschakeling wordt niet als weglegale oplossing aangeboden. De getoonde tuningranges zijn externe referenties en geen ECU-goedkeuring.</p>
    </div>
   </section>
   <section aria-labelledby="van-compare-usage">
    <p className="ux-eyebrow">BOUW · INSTALLATIE · SERVICE · TRANSPORT</p>
    <h2 id="van-compare-usage" className="racing-title mt-3 text-3xl text-white md:text-4xl">Ook de werkbelasting bepaalt het advies</h2>
    <p className="mt-5 max-w-5xl text-sm leading-8 text-white/75 md:text-base">{c.usage}</p>
   </section>
   <section aria-labelledby="van-compare-faq">
    <p className="ux-eyebrow">TECHNISCHE VRAGEN OVER MOTORGENERATIES</p>
    <h2 id="van-compare-faq" className="racing-title mt-3 text-3xl text-white md:text-4xl">Veelgestelde vragen</h2>
    <div className="mt-6 max-w-5xl space-y-3" data-testid="van-comparison-faq">
     {c.faq.map(([q,a])=><details key={q} className="rounded-lg border border-white/15 bg-white/[.035] p-5">
      <summary className="cursor-pointer font-semibold text-white">{q}</summary>
      <p className="mt-3 text-sm leading-7 text-white/70">{a}</p>
     </details>)}
    </div>
   </section>
   <section className="rounded-xl border border-primary/35 bg-[#151718] p-6 md:p-9" aria-labelledby="van-compare-contact">
    <p className="ux-eyebrow">WERKPLAATS IN ASSEN · INDIVIDUELE MOTORCONTROLE</p>
    <h2 id="van-compare-contact" className="racing-title mt-3 text-3xl text-white md:text-4xl">Wat is verantwoord voor jouw {c.make} {c.model}?</h2>
    <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">Kies in de vergelijking je exact geregistreerde motor en vraag daarmee een offerte aan. Voor een individuele beoordeling onderzoeken we de echte ECU, transmissie, conditie en bedrijfsinzet. Een modelnaam alleen bepaalt geen gegarandeerde vermogenswinst.</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <a href={sitePath("/nl#rdw-check")} className="ux-nl-engine-primary-link"><Search className="h-4 w-4" aria-hidden="true"/>Kenteken controleren</a>
     <a href={dutchBusinessVansHref()} className="ux-nl-engine-secondary-link">Bedrijfswagenadvies bij NoordTune<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
     <a href={whatsappHref({locale:"nl",vehicleLabel:c.make+" "+c.model})} className="ux-nl-engine-secondary-link" target="_blank" rel="noreferrer">WhatsApp over deze bestelwagen<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>
    </div>
    {m.manufacturerSource?.url?<p className="mt-5 text-xs text-white/55"><Info className="mr-2 inline h-3.5 w-3.5" aria-hidden="true"/>Algemene modelinformatie: <a href={m.manufacturerSource.url} rel="noopener noreferrer" target="_blank" className="underline decoration-primary underline-offset-4">{m.manufacturerSource.name}</a>. Dit is geen Stage 1-bron.</p>:null}
   </section>
   <div className="flex flex-wrap gap-5 text-sm font-semibold">
    <a href={sitePath(nlVanModelPath(m.slug))} className="inline-flex items-center gap-2 text-white/80 underline decoration-primary underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true"/>Terug naar {m.make} {m.model}</a>
    <a href={sitePath(nlVanCompareIndexPath)} className="inline-flex items-center gap-2 text-white/80 underline decoration-primary underline-offset-4">Andere busmotoren vergelijken<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>
    {getNlBrandGuide(m.make)?<a href={sitePath(nlBrandGuidePath(getNlBrandGuide(m.make)!.slug))} className="inline-flex items-center gap-2 text-white/80 underline decoration-primary underline-offset-4">{m.make} technische motorwijzer<ChevronRight className="h-4 w-4" aria-hidden="true"/></a>:null}
   </div>
  </div>
  <CatalogFooter locale="nl"/>
  <MobileActionBar locale="nl" primaryHref={sitePath("/nl#rdw-check")} vehicleLabel={c.make+" "+c.model}/>
 </main>;
}

"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ChevronRight,Search,X} from "lucide-react";
import {filterReviewedMotors,reviewedMotorYears,type NlReviewedMotorResult} from "@/lib/nl-reviewed-motor-search";

/** Fast on-page navigation without tracking or sending visitor filters to a server. */
export function NlReviewedMotorFinder({items}:{items:readonly NlReviewedMotorResult[]}){
 const [query,setQuery]=useState("");
 const [kind,setKind]=useState<"alle"|"personenauto"|"bedrijfswagen">("alle");
 const [make,setMake]=useState("");
 const [fuel,setFuel]=useState<"alle"|"Petrol"|"Diesel"|"CNG">("alle");
 const [year,setYear]=useState("");
 const [kw,setKw]=useState("");
 const [visibleLimit,setVisibleLimit]=useState(24);
 const makes=useMemo(()=>[...new Set(items.map(x=>x.make))].sort((a,b)=>a.localeCompare(b,"nl")),[items]);
 const years=useMemo(()=>reviewedMotorYears(items),[items]);
 const results=useMemo(()=>filterReviewedMotors(items,{
  query,kind,make,fuel,
  year:year?Number(year):null,
  registeredKw:kw.trim()?Number(kw.trim().replace(",",".")):null
 }),[items,query,kind,make,fuel,year,kw]);
 const visible=results.slice(0,visibleLimit);
 const reset=()=>{setQuery("");setKind("alle");setMake("");setFuel("alle");setYear("");setKw("");setVisibleLimit(24);};
 const changeQuery=(next:string)=>{setQuery(next);setVisibleLimit(24);};
 const prettyMake=(value:string)=>value==="Citroen"?"Citroën":value==="Seat"?"SEAT":value==="Skoda"?"Škoda":value;
 const formatNumber=(value:number)=>String(value).replace(".",",");
 const filtersActive=Boolean(query.trim()||make||year||kw.trim()||kind!=="alle"||fuel!=="alle");
 return <section id="motor-zoeken" aria-labelledby="nl-reviewed-motor-finder-title" className="container scroll-mt-28 py-10 md:py-14" data-testid="nl-reviewed-motor-finder">
  <div className="rounded-xl border border-white/15 bg-[#151719] p-5 md:p-8">
   <p className="ux-eyebrow">MOTOREN ZOEKEN · ALLEEN TECHNISCH BEOORDEELDE PROFIELEN</p>
   <h2 id="nl-reviewed-motor-finder-title" className="racing-title mt-3 text-2xl text-white md:text-4xl">
    Zoek de juiste motor op merk, type en toelatingsjaar
   </h2>
   <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65">
    Doorzoek {items.length} afzonderlijk gepubliceerde Stage 1-motorprofielen voor personenauto&apos;s en bedrijfswagens.
    Filter uitsluitend op een daadwerkelijk gecontroleerde RDW-registratie. Een resultaat bevestigt niet vanzelf
    de ECU of transmissie van jouw auto; dat beoordelen we bij de werkplaatscontrole.
   </p>
   <div className="mt-7 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <div className="min-w-0 xl:col-span-2">
     <label htmlFor="nl-motor-search-query" className="mb-2 block text-sm font-semibold text-white">Merk, model of motor</label>
     <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/25 bg-black/35 px-3 focus-within:border-primary">
      <Search className="h-5 w-5 shrink-0 text-white/60" aria-hidden="true"/>
      <input id="nl-motor-search-query" type="search" autoComplete="off"
       placeholder="Bijv. Golf 1.4 TSI, Transit EcoBlue, Mercedes Vito..."
       className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
       value={query} onChange={e=>changeQuery(e.target.value)}/>
      {query?<button type="button" onClick={()=>changeQuery("")} aria-label="Wis zoekterm" className="p-2 text-white/70 hover:text-white"><X className="h-4 w-4"/></button>:null}
     </div>
    </div>
    <div className="min-w-0">
     <label htmlFor="nl-motor-search-make" className="mb-2 block text-sm font-semibold text-white">Automerk</label>
     <select id="nl-motor-search-make" value={make} onChange={e=>{setMake(e.target.value);setVisibleLimit(24);}}
      className="min-h-12 w-full min-w-0 rounded-lg border border-white/25 bg-[#212326] px-3 text-sm text-white">
      <option value="">Alle merken</option>
      {makes.map(item=><option key={item} value={item}>{prettyMake(item)}</option>)}
     </select>
    </div>
    <div className="min-w-0">
     <label htmlFor="nl-motor-search-year" className="mb-2 block text-sm font-semibold text-white">Eerste toelating (RDW)</label>
     <select id="nl-motor-search-year" value={year} onChange={e=>{setYear(e.target.value);setVisibleLimit(24);}}
      className="min-h-12 w-full min-w-0 rounded-lg border border-white/25 bg-[#212326] px-3 text-sm text-white">
      <option value="">Alle beoordeelde jaren</option>
      {years.map(y=><option key={y} value={y}>{y}</option>)}
     </select>
    </div>
    <div className="min-w-0">
     <label htmlFor="nl-motor-search-kw" className="mb-2 block text-sm font-semibold text-white">Origineel RDW-vermogen (kW)</label>
     <input id="nl-motor-search-kw" type="text" inputMode="decimal" autoComplete="off" placeholder="Bijv. 85 of 95,6"
      className="min-h-12 w-full min-w-0 rounded-lg border border-white/25 bg-[#212326] px-3 text-sm text-white placeholder:text-white/45 focus:border-primary focus:outline-none"
      value={kw} onChange={e=>{setKw(e.target.value.slice(0,8));setVisibleLimit(24);}}/>
    </div>
    <div className="min-w-0">
     <label htmlFor="nl-motor-search-fuel" className="mb-2 block text-sm font-semibold text-white">Brandstof</label>
     <select id="nl-motor-search-fuel" value={fuel} onChange={e=>{setFuel(e.target.value as typeof fuel);setVisibleLimit(24);}}
      className="min-h-12 w-full min-w-0 rounded-lg border border-white/25 bg-[#212326] px-3 text-sm text-white">
      <option value="alle">Alle brandstoffen</option>
      <option value="Petrol">Benzine</option>
      <option value="Diesel">Diesel</option>
      <option value="CNG">Aardgas (CNG)</option>
     </select>
    </div>
   </div>
   <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-wrap gap-2" aria-label="Voertuigcategorie">
     {[
      {value:"alle",label:"Alle motoren"},
      {value:"personenauto",label:"Personenauto"},
      {value:"bedrijfswagen",label:"Bestelwagen / bus"}
     ].map(option=><button key={option.value} type="button" aria-pressed={kind===option.value}
      onClick={()=>{setKind(option.value as typeof kind);setVisibleLimit(24);}}
      className={kind===option.value?
       "min-h-10 rounded-md border border-primary bg-primary/15 px-3 text-sm font-semibold text-white":
       "min-h-10 rounded-md border border-white/20 px-3 text-sm font-semibold text-white/70 hover:border-primary"}>
      {option.label}
     </button>)}
    </div>
    {filtersActive?<button className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4" type="button" onClick={reset}>
     <X className="h-4 w-4" aria-hidden="true"/>Alle filters wissen
    </button>:null}
   </div>
   <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/75" role="status" data-testid="nl-motor-search-count">
    <strong>{results.length}</strong> motorprofielen binnen deze selectie · alleen gecontroleerde RDW-toelatingsjaren, geen schatting voor ontbrekende jaren
   </p>
   {results.length>0?<>
    <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3" data-testid="nl-motor-search-results">
     {visible.map(item=>{
      const labels=[...new Set(item.scopes.map(x=>x.from===x.to?String(x.from):x.from+"–"+x.to))].join(", ");
      const power=[...new Set(item.scopes.map(x=>formatNumber(x.registeredKw)))].join(" / ");
      return <a key={item.id} href={item.href} data-engine-id={item.id}
       className="group flex min-w-0 flex-col gap-2 rounded-lg border border-white/15 bg-black/30 p-4 transition-colors hover:border-primary/70 hover:bg-white/[.065] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
       <span className="text-xs font-semibold uppercase tracking-wide text-primary">{item.kind==="personenauto"?"Personenauto":"Bestelwagen"} · {prettyMake(item.make)}</span>
       <strong className="text-base text-white [overflow-wrap:anywhere]">{item.title}</strong>
       <span className="text-xs leading-5 text-white/65">RDW: {power} kW · {labels} · {item.fuel==="Petrol"?"benzine":item.fuel==="Diesel"?"diesel":"aardgas"}</span>
       <span className="mt-auto inline-flex items-center justify-between gap-2 pt-2 text-sm font-semibold text-white">
        Bekijk motor, Stage 1 en bronnen <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true"/>
       </span>
      </a>;
     })}
    </div>
    {results.length>visible.length?<button type="button" className="mt-6 min-h-11 w-full rounded-lg border border-white/25 px-5 text-sm font-semibold text-white hover:border-primary" onClick={()=>setVisibleLimit(n=>n+24)}>
     Meer onderzochte motoren tonen ({visible.length} van {results.length})
    </button>:null}
   </>:<div className="mt-5 rounded-lg border border-white/20 p-5" role="status" data-testid="nl-motor-search-empty">
    <strong className="text-base text-white">Geen beoordeeld motorprofiel voor deze selectie.</strong>
    <p className="mt-2 text-sm leading-6 text-white/65">Dit betekent niet dat Stage 1 onmogelijk is. Controleer de kentekeninformatie of kies je auto handmatig voor een individuele beoordeling. We nemen geen kW- of roosterkoppelwaarden over van een andere ECU.</p>
    <div className="mt-4 flex flex-wrap gap-4">
     <Link className="text-sm font-bold text-primary underline underline-offset-4" href="/nl#rdw-check">RDW-kenteken controleren</Link>
     <Link className="text-sm font-bold text-primary underline underline-offset-4" href="/nl#manual-selector">Handmatig merk en motor kiezen</Link>
     <button type="button" onClick={reset} className="text-sm font-bold text-white underline underline-offset-4">Alle profielen tonen</button>
    </div>
   </div>}
   <p className="mt-5 text-xs leading-6 text-white/50">Zoeken en filteren gebeurt lokaal op dit apparaat, zonder kentekens of persoonsgegevens op te slaan. De getoonde oorspronkelijke kW en jaren zijn afkomstig uit de technische, gecontroleerde RDW-toepassingen. Alle bronvermeldingen staan bij het betreffende motorprofiel.</p>
  </div>
 </section>;
}

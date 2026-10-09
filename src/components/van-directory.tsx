"use client";
import {useMemo,useState} from "react";
import {ChevronRight,Search,X} from "lucide-react";

export type VanDirectoryItem={
 slug:string;make:string;model:string;size:"Compact"|"Middel"|"Groot";
 indexed:boolean;hasStage1:boolean;href:string;
};

const sizes=[
 {id:"alle",label:"Alle modellen"},
 {id:"Compact",label:"Compact"},
 {id:"Middel",label:"Middelgroot"},
 {id:"Groot",label:"Grote bestelwagen"}
] as const;
export function VanDirectory({items}:{items:readonly VanDirectoryItem[]}){
 const [query,setQuery]=useState("");
 const [size,setSize]=useState<string>("alle");
 const results=useMemo(()=>{
  const needle=query.trim().toLocaleLowerCase("nl");
  return items.filter(x=>(size==="alle"||size===x.size)&&
    (!needle||[x.make,x.model,x.size].join(" ").toLocaleLowerCase("nl").includes(needle)));
 },[items,query,size]);
 const brands=[...new Set(results.map(x=>x.make))];
 return (
  <div className="ux-vans-search" id="van-modellen">
   <div className="ux-vans-controls">
    <div className="ux-vans-search-input">
     <Search aria-hidden="true" className="h-5 w-5"/>
     <label htmlFor="van-model-filter" className="sr-only">Zoek op bestelwagenmerk of model</label>
     <input id="van-model-filter" type="search" autoComplete="off" value={query}
      placeholder="Zoek Ford Transit, Sprinter, Proace, Boxer..."
      onChange={e=>setQuery(e.target.value)}/>
     {query?<button type="button" onClick={()=>setQuery("")} aria-label="Wis zoekopdracht"><X className="h-5 w-5"/></button>:null}
    </div>
    <div className="ux-vans-size-list" aria-label="Filter op voertuigformaat">
     {sizes.map(option=>(
      <button key={option.id} type="button" aria-pressed={size===option.id}
       className={size===option.id?"ux-vans-size ux-vans-size--active":"ux-vans-size"}
       onClick={()=>setSize(option.id)}>
        {option.label}
      </button>
     ))}
    </div>
    <p className="ux-vans-filter-count" role="status">{results.length} modellen zichtbaar · cijfers uitsluitend bij technisch beoordeelde varianten</p>
   </div>
   {results.length?(
    <div className="ux-vans-brand-groups">
     {brands.map(brand=>(
      <section className="ux-vans-brand-group" key={brand} aria-label={"Bedrijfswagens "+brand}>
       <h3>{brand}<span>{results.filter(x=>x.make===brand).length} modellen</span></h3>
       <div className="ux-vans-model-grid">
        {results.filter(x=>x.make===brand).map(x=>(
         <a key={x.slug} href={x.href} className="ux-vans-model-card"
          aria-label={x.indexed?"Bekijk "+x.make+" "+x.model:"Zoek "+x.make+" "+x.model+" handmatig"}>
          <span className="ux-vans-model-eyebrow">{x.size==="Compact"?"Compacte bestelwagen":x.size==="Middel"?"Middelgrote bestelwagen":"Grote bestelwagen"}</span>
          <strong>{x.make} {x.model}</strong>
          <span className="ux-vans-model-description">{x.hasStage1?"Stage 1 met onafhankelijke bronnen":x.indexed?"Motoren en ECU-verschillen bekijken":"Eerst uitvoering en ECU identificeren"}</span>
          <span className="ux-vans-model-action">{x.indexed?"Bekijk voertuigprofiel":"Zoek in RDW / catalogus"}
           <ChevronRight className="h-4 w-4" aria-hidden="true"/></span>
         </a>
        ))}
       </div>
      </section>
     ))}
    </div>
   ):(
    <div className="ux-vans-no-results" role="status">
      <strong>Geen model in deze selectie</strong>
      <p>Probeer alleen het merk, zoals Ford, Toyota of Volkswagen. Andere uitvoeringen zijn ook via de RDW-kentekencheck te vinden.</p>
      <button type="button" onClick={()=>{setQuery("");setSize("alle");}}>Alle modellen tonen</button>
    </div>
   )}
  </div>
 );
}

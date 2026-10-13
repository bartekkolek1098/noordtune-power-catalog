import Image from "next/image";
import type {NlVanEngine} from "@/data/nl-van-engines-seo";
import type {VanModel} from "@/data/nl-vans-seo";
import {nlVanModelPath} from "@/data/nl-vans-seo";
import {getNlVanGenerationPhoto} from "@/data/nl-van-generation-photos";
import {sitePath} from "@/lib/site-path";

export function NlVanGenerationPhoto({engine,model}:{engine:NlVanEngine;model:VanModel}){
 const photo=getNlVanGenerationPhoto(engine);
 if(!photo)return null;
 const years=engine.applications.flatMap(a=>[a.yearFrom,a.yearTo]);
 const fromYear=Math.min(...years),toYear=Math.max(...years);
 const registeredPower=[...new Set(engine.applications.map(a=>String(a.registeredPowerKw).replace(".",",")))].join(" / ");
 const displacement=[...new Set(engine.applications.map(a=>String(a.displacementCc)))].join(" / ");
 return <section className="container mx-auto mt-9 mb-10" aria-label={`Modelillustratie en generatie voor ${engine.title}`} data-testid="nl-van-photo-section">
  <div className="grid min-w-0 items-start gap-7 overflow-hidden rounded-2xl border border-white/15 bg-[#111519] shadow-[0_22px_60px_rgba(0,0,0,.2)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)]">
   <figure className="min-w-0 bg-black/30" data-testid="nl-van-licensed-photo">
    <Image src={photo.src} width={photo.width} height={photo.height} quality={78} loading="lazy"
      sizes="(min-width:1024px) 650px,(min-width:640px) 90vw,100vw"
      alt={`Illustratie van ${model.make} ${model.model}, modelgeneratie; de afgebeelde motor en uitrusting kunnen anders zijn`}
      className="max-h-[410px] h-auto w-full object-cover"/>
    <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-6 text-slate-400">
      Modelgeneratie ter illustratie, geen NoordTune-klantauto. Motor en facelift kunnen afwijken. Foto:{" "}
      <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">{photo.author}</a>.
      {" "}<a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">{photo.license}</a>.
      {" "}Afbeelding op maat weergegeven.
    </figcaption>
   </figure>
   <aside className="min-w-0 px-5 pb-6 pt-1 sm:px-7 lg:py-8" aria-label="Gecontroleerde motoridentiteit">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Deze motorvariant onderscheiden</p>
    <h2 className="mt-3 text-2xl font-black leading-tight text-white">Herken de juiste {model.make} {model.model}</h2>
    <p className="mt-4 text-sm leading-7 text-slate-200">De afbeelding laat de carrosseriefamilie zien; de Stage 1-gegevens hieronder horen uitsluitend bij de gecontroleerde RDW-motorvarianten. Twee bestelwagens met dezelfde naam kunnen een andere ECU, versnellingsbak of emissieconfiguratie hebben.</p>
    <dl className="mt-5 grid gap-3 text-sm">
     <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-2"><dt className="text-slate-400">Beoordeelde eerste toelating</dt><dd className="font-semibold text-white">{fromYear}{fromYear===toYear?"":"–"+toYear}</dd></div>
     <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-2"><dt className="text-slate-400">RDW origineel vermogen</dt><dd className="font-semibold text-white">{registeredPower} kW</dd></div>
     <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-2"><dt className="text-slate-400">Cilinderinhoud</dt><dd className="font-semibold text-white">{displacement} cc</dd></div>
    </dl>
    <a href={sitePath(nlVanModelPath(model.slug))} className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-primary/50 px-5 py-3 text-sm font-bold text-white hover:bg-primary/10">Vergelijk andere motoren van dit model →</a>
   </aside>
  </div>
 </section>;
}

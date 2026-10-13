import Image from "next/image";
import Link from "next/link";
import type {EngineVariant} from "@/data/catalog-shared";
import {getVehicleById} from "@/data/catalog";
import {nlVehicleDirectoryPath,nlVehiclePhoto,nlVehicleEngineTitle,type NlVehicleEditorial} from "@/data/nl-vehicle-editorial";
import {vehicleDetailPath} from "@/lib/seo";

export function NlVehicleKnowledge({vehicle,article}:{vehicle:EngineVariant;article:NlVehicleEditorial}){
 const photo=nlVehiclePhoto(article);
 const related=article.related.map(id=>getVehicleById(id)).filter((x):x is EngineVariant=>Boolean(x));
 return (
  <article className="mt-12 min-w-0 border-t border-white/15 pt-10" data-testid="nl-vehicle-guide">
   <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">NoordTune · technische uitleg per motor</p>
   <h2 className="mt-3 max-w-4xl text-2xl font-black leading-tight text-white sm:text-3xl">
    {vehicle.brand} {vehicle.model} {nlVehicleEngineTitle(vehicle.id,vehicle.engine)}: waar let je op bij chiptuning?
   </h2>
   <p className="mt-5 max-w-4xl text-base leading-8 text-slate-200">{article.intro}</p>
   <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
    <figure className="min-w-0 overflow-hidden rounded-xl border border-white/15 bg-[#0d1115]" data-testid="nl-vehicle-licensed-photo">
     <Image src={photo.src} width={photo.width} height={photo.height}
       alt={`Modelafbeelding van ${vehicle.brand} ${vehicle.model}, passende carrosseriegeneratie; uitvoering kan verschillen`}
       sizes="(min-width: 1024px) 580px, (min-width: 640px) 90vw, 100vw"
       loading="lazy" quality={78} className="max-h-[380px] h-auto w-full object-cover"/>
     <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-6 text-slate-400">
       Modelafbeelding ter illustratie, geen NoordTune-klantauto. Foto:{" "}
       <a href={photo.source} rel="noopener noreferrer" target="_blank" className="underline decoration-white/50 hover:text-white">{photo.author}</a>.
       {" "}<a href={photo.licenseUrl} rel="noopener noreferrer" target="_blank" className="underline decoration-white/50 hover:text-white">{photo.license}</a>.
       {" "}Weergave passend gemaakt voor de website.
     </figcaption>
    </figure>
    <section className="min-w-0 rounded-xl border border-white/15 bg-white/[.035] p-5 sm:p-7" aria-label="Motorvarianten vergelijken">
      <h3 className="text-xl font-bold text-white">Niet elke uitvoering is dezelfde motor</h3>
      <p className="mt-4 text-sm leading-7 text-slate-200">{article.difference}</p>
      <p className="mt-5 text-xs leading-6 text-slate-400">Originele vermogens en Stage 1-gegevens moeten bij de juiste ECU, motor en transmissie horen. Vergelijk geen verschillende generaties op basis van alleen een modelnaam.</p>
    </section>
   </div>
   <div className="mt-7 grid gap-5 md:grid-cols-2">
    <section className="rounded-xl border border-white/15 p-5 sm:p-7">
      <h3 className="text-xl font-bold text-white">Wat controleren we vóór een afstelling?</h3>
      <p className="mt-4 text-sm leading-7 text-slate-200">{article.checks}</p>
    </section>
    <section className="rounded-xl border border-white/15 p-5 sm:p-7">
      <h3 className="text-xl font-bold text-white">Wat betekent dit voor dagelijks rijden?</h3>
      <p className="mt-4 text-sm leading-7 text-slate-200">{article.usage}</p>
    </section>
   </div>
   <section className="mt-9" aria-label={`Veelgestelde vragen over ${vehicle.brand} ${vehicle.model}`}>
     <h3 className="text-xl font-bold text-white">Veelgestelde vragen over deze motor</h3>
     <div className="mt-4 grid gap-3">
       {article.faq.map(([question,answer])=><details key={question} className="rounded-lg border border-white/15 bg-[#101417] p-4 open:border-primary/40">
         <summary className="cursor-pointer font-semibold leading-6 text-white">{question}</summary>
         <p className="mt-3 text-sm leading-7 text-slate-200">{answer}</p>
       </details>)}
     </div>
   </section>
   <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-primary/35 bg-primary/10 p-5 sm:p-6">
    <div className="min-w-0 flex-1">
     <p className="font-bold text-white">Vraag advies voor jouw exacte {vehicle.brand} {vehicle.model}</p>
     <p className="mt-2 text-sm leading-6 text-slate-300">Vergelijk de aangegeven Stage 1-bronnen en bespreek jouw ECU, bouwjaar en gebruik voordat je een afspraak maakt.</p>
    </div>
    <a href="#tuning-calculator" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:brightness-110">
      Bekijk opties en vraag advies
    </a>
   </div>
   <nav className="mt-8 border-t border-white/15 pt-6" aria-label="Meer motoren en modellen">
     <h3 className="text-lg font-bold text-white">Vergelijk andere gecontroleerde motoren</h3>
     <div className="mt-4 flex flex-wrap gap-3 text-sm">
       {related.map(v=><Link key={v.id} className="rounded-lg border border-white/20 px-4 py-3 text-slate-200 hover:border-primary hover:text-white"
         href={vehicleDetailPath("nl",v)}>{v.brand} {v.model} · {v.stockPowerHp} pk</Link>)}
       <Link className="rounded-lg border border-primary/40 px-4 py-3 font-semibold text-white hover:bg-primary/15" href={nlVehicleDirectoryPath}>
         Alle onderzochte motoren bekijken →
       </Link>
     </div>
   </nav>
  </article>
 );
}

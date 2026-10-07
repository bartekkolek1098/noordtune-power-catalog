"use client";
import type {Locale} from "@/i18n/routing";
import type {SimilarStage1Comparison} from "@/lib/rdw-source-comparison";

const text = {
 nl:{eyebrow:"Stage 1 · vergelijking",title:"Richtwaarden van vergelijkbare uitvoeringen",
   note:"Dit is geen bevestigd tuningresultaat voor jouw voertuig. De bronnen beschrijven vergelijkbare uitvoeringen qua merk, model, bouwperiode, brandstof, motorinhoud en origineel vermogen. NoordTune controleert de exacte generatie, ECU, hardware en brandstof voordat we een voorstel doen.",
   generation:"De referenties kunnen verschillende motor- of modelgeneraties betreffen.",sources:"Onderliggende bronnen",power:"Vergelijkbaar vermogen",torque:"Vergelijkbaar koppel"},
 en:{eyebrow:"Stage 1 · comparison",title:"Reference figures from comparable variants",
   note:"These are not confirmed tuning figures for your exact vehicle. The references describe variants with matching make, model family, period, fuel, displacement and factory power. NoordTune will check engine generation, ECU, hardware and fuel before quoting.",
   generation:"These references may span different engine or model generations.",sources:"Underlying sources",power:"Comparable power",torque:"Comparable torque"},
 pl:{eyebrow:"Stage 1 · porównanie",title:"Orientacyjne wyniki podobnych wersji",
   note:"To nie jest potwierdzony wynik tuningu Twojego auta. Porównanie pochodzi z odmian o podobnej marce, rodzinie modelu, okresie, paliwie, pojemności i mocy seryjnej. NoordTune sprawdzi generację, ECU, osprzęt i paliwo przed ofertą.",
   generation:"Przytoczone źródła mogą dotyczyć różnych generacji silnika lub modelu.",sources:"Źródła porównania",power:"Moc porównawcza",torque:"Moment porównawczy"}
} as const;
const range=(value:[number,number],unit:string) => value[0]===value[1]?`≈${value[0]} ${unit}`:`${value[0]}–${value[1]} ${unit}`;
export function RdwSourceComparison({comparison,locale}:{comparison:SimilarStage1Comparison;locale:Locale}){
 const t=text[locale], hp=locale==="pl"?"KM":locale==="nl"?"pk":"hp";
 return <section className="min-w-0 rounded-[3px] border border-amber-400/35 bg-amber-400/[.05] p-4" data-testid="rdw-source-comparison">
   <p className="text-xs font-black uppercase tracking-[.14em] text-amber-300">{t.eyebrow}</p>
   <h3 className="mt-1 text-lg font-black text-white">{t.title}</h3>
   <div className="mt-3 flex flex-wrap gap-2">
     <span className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">{t.power}: <strong>{range(comparison.powerRangeHp,hp)}</strong></span>
     {comparison.torqueRangeNm ? <span className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">{t.torque}: <strong>{range(comparison.torqueRangeNm,"Nm")}</strong></span> : null}
   </div>
   <p className="mt-3 text-xs leading-5 text-slate-300">{t.note}</p>
   {comparison.generationCount>1 ? <p className="mt-1 text-xs leading-5 font-semibold text-amber-200">{t.generation}</p>:null}
   <details className="mt-3 text-xs text-slate-300"><summary className="cursor-pointer">{t.sources} ({comparison.sourceUrls.length})</summary>
     <ul className="mt-2 space-y-1">{comparison.sourceUrls.map(url=><li className="break-all" key={url}><a href={url} rel="noopener noreferrer" target="_blank" className="text-amber-200 underline">{new URL(url).hostname}</a></li>)}</ul>
   </details>
 </section>;
}

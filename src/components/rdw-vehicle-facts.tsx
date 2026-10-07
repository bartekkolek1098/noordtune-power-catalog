"use client";

import {Badge} from "@/components/ui/badge";
import type {Locale} from "@/i18n/routing";
import type {RdwLookupResult} from "@/lib/rdw";
import {formatRegistrationDate} from "@/lib/rdw-date";

type Vehicle = RdwLookupResult["vehicle"];
const words = {
  nl: {source:"Officiële RDW-voertuiggegevens",newCheck:"Nieuwe RDW-check",cached:"RDW-cache",
    admission:"Eerste toelating (geen bevestigd bouwjaar)",nlAdmission:"Eerste toelating in Nederland",
    power:"Geregistreerd vermogen",engine:"Motorinhoud",fuel:"Brandstof",cyl:"Cilinders",
    extra:"RDW technische voertuigdetails",category:"Voertuigcategorie",body:"Carrosserie",type:"Type",
    variant:"Variant",execution:"Uitvoering",seats:"Zitplaatsen",doors:"Deuren",color:"Kleur",
    apk:"APK geldig tot",torque:"Koppel",length:"Lengte",width:"Breedte",height:"Hoogte",
    wheelbase:"Wielbasis",weight:"Leeggewicht",runningWeight:"Massa rijklaar",
    maximum:"Toegestane maximummassa",technicalMax:"Technische maximummassa",
    combination:"Max. treingewicht",payload:"Laadvermogen",braked:"Aanhanger geremd",
    unbraked:"Aanhanger ongeremd",euType:"EU-voertuigcategorie",
    typeApproval:"Typegoedkeuring",gas:"Gasinstallatie",wheels:"Wielen",
    recall:"Openstaande terugroepactie",odometer:"Kilometerstandbeoordeling",
    odometerYear:"Jaar tellerstandcontrole",speed:"Maximumsnelheid",co2:"CO₂-uitstoot",
    euro:"Emissiecode",emission:"Emissieniveau",powerSource:"Vermogen RDW: kW; pk is omgerekend.",
    disclaimer:"RDW bevestigt geen voertuigbouwjaar, exacte motorgeneratie, ECU, versnellingsbak of tuningresultaat."},
  en: {source:"Official RDW vehicle data",newCheck:"New RDW lookup",cached:"RDW cache",
    admission:"First admission (not confirmed build year)",nlAdmission:"First admission in the Netherlands",
    power:"Registered power",engine:"Displacement",fuel:"Fuel",cyl:"Cylinders",
    extra:"RDW technical vehicle details",category:"Vehicle class",body:"Body type",type:"Type",
    variant:"Variant",execution:"Version code",seats:"Seats",doors:"Doors",color:"Colour",
    apk:"Inspection due",torque:"Torque",length:"Length",width:"Width",height:"Height",
    wheelbase:"Wheelbase",weight:"Unladen weight",runningWeight:"Mass ready to drive",
    maximum:"Maximum permitted mass",technicalMax:"Technical maximum mass",
    combination:"Maximum combined mass",payload:"Payload",braked:"Braked trailer",
    unbraked:"Unbraked trailer",euType:"EU vehicle category",
    typeApproval:"Type approval",gas:"Gas system",wheels:"Wheels",
    recall:"Open recall indicator",odometer:"Odometer assessment",
    odometerYear:"Odometer assessment year",speed:"Top speed",co2:"CO₂ emissions",
    euro:"Emissions class",emission:"Exhaust level",powerSource:"RDW records kW; horsepower is converted.",
    disclaimer:"RDW does not confirm build year, exact engine generation, ECU, transmission or a tuning result."},
  pl: {source:"Oficjalne dane pojazdu RDW",newCheck:"Nowe sprawdzenie RDW",cached:"Dane z pamięci RDW",
    admission:"Pierwsza rejestracja (nie rok produkcji)",nlAdmission:"Pierwsza rejestracja w Holandii",
    power:"Moc seryjna wg RDW",engine:"Pojemność silnika",fuel:"Paliwo",cyl:"Cylindry",
    extra:"Szczegółowe dane techniczne RDW",category:"Rodzaj pojazdu",body:"Nadwozie",type:"Typ",
    variant:"Wariant",execution:"Kod wykonania",seats:"Miejsca",doors:"Drzwi",color:"Kolor",
    apk:"Ważność APK",torque:"Moment",length:"Długość",width:"Szerokość",height:"Wysokość",
    wheelbase:"Rozstaw osi",weight:"Masa własna",runningWeight:"Masa gotowa do jazdy",
    maximum:"DMC",technicalMax:"Techniczna DMC",
    combination:"Maks. masa zestawu",payload:"Ładowność",braked:"Przyczepa hamowana",
    unbraked:"Przyczepa bez hamulca",euType:"Kategoria UE",
    typeApproval:"Homologacja",gas:"Instalacja gazowa",wheels:"Koła",
    recall:"Akcja przywoławcza",odometer:"Ocena przebiegu",
    odometerYear:"Rok kontroli licznika",speed:"Prędkość maksymalna",co2:"Emisja CO₂",
    euro:"Klasa emisji",emission:"Norma spalin",powerSource:"RDW podaje kW; KM zostały przeliczone.",
    disclaimer:"RDW nie potwierdza roku produkcji, dokładnej generacji silnika, ECU, skrzyni ani wyniku tuningu."}
} as const;

export function RdwVehicleFacts({vehicle,locale,cached}:{vehicle:Vehicle;locale:Locale;cached:boolean}){
  const t=words[locale], fmt=(v:number|null|undefined)=> v == null ? undefined : new Intl.NumberFormat(locale==="en"?"en-GB":locale).format(v);
  const date=(v:string|undefined)=>v ? formatRegistrationDate(v,locale):undefined;
  const entry=(name:string,value:string|number|null|undefined,unit="") => value == null || value==="" ? undefined
    : {name,value:String(value)+unit};
  const all=[
    entry(t.admission,date(vehicle.registration.firstAdmission)),
    entry(t.nlAdmission,date(vehicle.registration.firstRegistrationNl)),
    entry(t.apk,date(vehicle.registration.apkExpiry)),
    entry(t.category,vehicle.vehicleType),entry(t.body,vehicle.body),entry(t.color,vehicle.color),
    entry(t.type,vehicle.type),entry(t.variant,vehicle.variant),entry(t.execution,vehicle.execution),
    entry(t.seats,fmt(vehicle.seats)),entry(t.doors,fmt(vehicle.doors)),
    entry(t.cyl,fmt(vehicle.engine.cylinders)),entry(t.length,fmt(vehicle.dimensions.lengthCm)," cm"),
    entry(t.width,fmt(vehicle.dimensions.widthCm)," cm"),entry(t.height,fmt(vehicle.dimensions.heightCm)," cm"),
    entry(t.wheelbase,fmt(vehicle.dimensions.wheelbaseCm)," cm"),
    entry(t.weight,fmt(vehicle.dimensions.weightKg)," kg"),
    entry(t.runningWeight,fmt(vehicle.dimensions.runningWeightKg)," kg"),
    entry(t.maximum,fmt(vehicle.weights.maximumPermittedKg)," kg"),
    entry(t.technicalMax,fmt(vehicle.weights.technicalMaximumKg)," kg"),
    entry(t.combination,fmt(vehicle.weights.combinedMaximumKg)," kg"),
    entry(t.payload,fmt(vehicle.weights.payloadKg)," kg"),
    entry(t.braked,fmt(vehicle.weights.brakedTrailerKg)," kg"),
    entry(t.unbraked,fmt(vehicle.weights.unbrakedTrailerKg)," kg"),
    entry(t.euType,vehicle.approval.europeanCategory),
    entry(t.typeApproval,vehicle.approval.approvalNumber),
    entry(t.gas,vehicle.approval.gasInstallationType),
    entry(t.wheels,fmt(vehicle.approval.wheels)),
    entry(t.recall,vehicle.approval.recallIndicator),
    entry(t.odometer,vehicle.odometer.assessment),
    entry(t.odometerYear,fmt(vehicle.odometer.assessmentYear)),
    entry(t.speed,fmt(vehicle.performance.topSpeedKmh)," km/h"),
    entry(t.co2,fmt(vehicle.emissions.co2Gkm)," g/km"),
    entry(t.euro,vehicle.emissions.euroClass),
    entry(t.emission,vehicle.emissions.exhaustLevel)
  ].filter((a):a is {name:string;value:string}=>Boolean(a));

  return <section className="min-w-0 rounded-[3px] border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]" data-testid="rdw-vehicle-facts">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{t.source}</p>
      <Badge variant={cached?"secondary":"default"}>{cached?t.cached:t.newCheck}</Badge>
    </div>
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
      <h3 className="break-words text-xl font-black text-white sm:text-2xl">{vehicle.make} {vehicle.model}</h3>
      <span className="rounded border border-[#ffd000]/50 bg-[#ffd000]/10 px-2 py-1 text-xs font-black tracking-[.12em] text-[#ffd000]">{vehicle.plate}</span>
    </div>
    <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        {label:t.admission,value:date(vehicle.registration.firstAdmission),testid:"rdw-first-registration"},
        {label:t.fuel,value:vehicle.fuel},
        {label:t.engine,value:vehicle.engine.displacementCc? `${fmt(vehicle.engine.displacementCc)} cm³`:undefined},
        {label:t.power,value:vehicle.engine.powerHp? `${fmt(vehicle.engine.powerHp)} ${locale==="en"?"hp":locale==="pl"?"KM":"pk"} / ${fmt(vehicle.engine.powerKw)} kW`:undefined}
      ].map((item)=><div className="min-w-0 rounded border border-white/10 bg-white/[.035] p-2.5" key={item.label} data-testid={item.testid}>
        <div className="text-[11px] leading-4 text-slate-400">{item.label}</div>
        <div className="mt-1 break-words text-sm font-bold text-white">{item.value??"—"}</div>
      </div>)}
    </div>
    <details className="mt-3 rounded border border-white/10 bg-white/[.025] p-3" data-testid="rdw-technical-details">
      <summary className="cursor-pointer text-sm font-semibold text-white">{t.extra} ({all.length})</summary>
      <dl className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        {all.map((item)=><div className="min-w-0 border-b border-white/10 py-1.5" key={item.name}>
          <dt className="text-xs text-slate-400">{item.name}</dt>
          <dd className="mt-0.5 break-all text-sm text-white">{item.value}</dd>
        </div>)}
      </dl>
      <p className="mt-3 text-xs text-slate-400">{t.disclaimer}</p>
    </details>
    <p className="mt-2 text-[11px] text-slate-500">{t.powerSource}</p>
  </section>;
}

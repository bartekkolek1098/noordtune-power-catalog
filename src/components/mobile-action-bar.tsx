import {ArrowUpRight, MessageCircle, Search} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {whatsappHref} from "@/lib/whatsapp";

const copy:Record<Locale,{find:string;configure:string;contact:string}> = {
 nl:{find:"Check kenteken",configure:"Bekijk tuning",contact:"Vraag advies"},
 en:{find:"Check plate",configure:"View tuning",contact:"Get advice"},
 pl:{find:"Sprawdź auto",configure:"Zobacz tuning",contact:"Zapytaj"}
};

export function MobileActionBar({locale,mode="catalog",vehicleLabel}:{locale:Locale;mode?:"catalog"|"vehicle";vehicleLabel?:string}) {
 const c=copy[locale];
 return (
  <nav className="ux-mobile-actions md:hidden" aria-label={mode==="catalog"?"Snelle acties":"Quick actions"}>
   <a href={mode==="catalog"?"#rdw-check":"#tuning-calculator"}>
    <Search className="h-4 w-4" aria-hidden="true"/>
    {mode==="catalog"?c.find:c.configure}
   </a>
   <a href={whatsappHref({locale,vehicleLabel})} target="_blank" rel="noreferrer">
    <MessageCircle className="h-4 w-4" aria-hidden="true"/>
    {c.contact}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true"/>
   </a>
  </nav>
 );
}

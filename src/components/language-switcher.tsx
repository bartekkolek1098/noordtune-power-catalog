"use client";

import {type Locale, routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const languageLabels: Record<Locale,{name:string; flag:string; label:string}> = {
  nl:{name:"Nederlands",flag:"🇳🇱",label:"NL"},
  en:{name:"English",flag:"🇬🇧",label:"EN"},
  pl:{name:"Polski",flag:"🇵🇱",label:"PL"}
};

function setPreferredLanguage(language:Locale){
  const host=window.location.hostname;
  const domain=host==="noordtune.nl"||host.endsWith(".noordtune.nl")
    ? "; Domain=.noordtune.nl"
    : "";
  document.cookie="noordtune_locale="+language+"; Path=/; Max-Age=31536000; SameSite=Lax"+domain;
}

/** Same flags, sizes and label treatment as www.noordtune.nl header. */
export function LanguageSwitcher({
  locale,
  path="",
  compact=false,
  className
}:{
  locale:Locale;
  path?:string;
  compact?:boolean;
  className?:string;
}){
  return (
    <nav aria-label="Language switcher" className={cn("flex shrink-0 items-center gap-1",className)}>
      {routing.locales.map((candidate)=>{
        const item=languageLabels[candidate];
        return (
          <a
            aria-label={`Switch to ${item.name}`}
            aria-current={candidate===locale?"page":undefined}
            className={cn(
              "inline-flex items-center rounded-[3px] border font-black uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              compact
                ? "h-8 gap-1 px-1.5 text-[0.66rem] min-[380px]:px-2"
                : "h-9 gap-1.5 px-2.5 text-[0.72rem]",
              candidate===locale
                ? "border-primary bg-primary/20 text-white"
                : "border-white/15 bg-white/[0.04] text-white/75 hover:border-white/40 hover:text-white"
            )}
            href={sitePath(`/${candidate}${path}`)}
            hrefLang={candidate}
            lang={candidate}
            key={candidate}
            onClick={()=>setPreferredLanguage(candidate)}
          >
            <span aria-hidden="true">{item.flag}</span>
            <span className={compact?"hidden min-[380px]:inline":undefined}>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

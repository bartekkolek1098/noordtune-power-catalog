import {ChevronDown} from "lucide-react";
import {type Locale, routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";
import {cn} from "@/lib/utils";

const labels:Record<Locale,string>={nl:"Nederlands",en:"English",pl:"Polski"};

export function LanguageSwitcher({locale,path=""}:{locale:Locale;path?:string}) {
  return (
    <nav aria-label="Language / Taal / Język" className="shrink-0">
      <div className="hidden items-center gap-1 sm:flex">
        {routing.locales.map(candidate=>(
          <a
            aria-current={candidate===locale?"page":undefined}
            aria-label={labels[candidate]}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border text-[11px] font-bold tracking-[.07em] transition-colors focus-visible:ring-2 focus-visible:ring-primary",
              candidate===locale?"border-white/35 bg-white/[.13] text-white":"border-transparent text-[#999fa1] hover:border-white/20 hover:text-white"
            )}
            href={sitePath(`/${candidate}${path}`)}
            key={candidate}
            lang={candidate}
            title={labels[candidate]}
          >{candidate.toUpperCase()}</a>
        ))}
      </div>
      <details className="ux-language-menu relative sm:hidden">
        <summary aria-label={labels[locale]} className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-white/20 px-2.5 text-[12px] font-bold tracking-[.05em] text-white">
          {locale.toUpperCase()}<ChevronDown className="h-3 w-3"/>
        </summary>
        <div className="ux-language-menu-list absolute right-0 top-full z-50 mt-2 min-w-[140px] rounded-xl border border-white/15 bg-[#1b1d1f] p-1.5 shadow-xl">
          {routing.locales.map(candidate=>(
            <a
              className={cn("block min-h-11 rounded-lg px-3 py-3 text-sm",candidate===locale?"bg-primary/10 text-white":"text-[#bcbfc0] hover:bg-white/[.08]")}
              href={sitePath(`/${candidate}${path}`)}
              key={candidate}
              lang={candidate}
              aria-current={candidate===locale?"page":undefined}
            >{labels[candidate]}</a>
          ))}
        </div>
      </details>
    </nav>
  );
}

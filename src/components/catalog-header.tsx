import {MessageCircle} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {CatalogMobileMenu} from "@/components/catalog-mobile-menu";
import {LanguageSwitcher} from "@/components/language-switcher";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {mainLocaleHref,mainNavItems,whatsappPhoneLabel} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";
import {cn} from "@/lib/utils";

/**
 * Header parity with the primary NoordTune site.
 * Logo / navigation / flags / phone / mobile dialog sizes and order mirror
 * www.noordtune.nl; the catalog is the active item on this subdomain.
 */
export function CatalogHeader({
  className,
  languagePath="",
  locale
}:{
  className?:string;
  languagePath?:string;
  locale:Locale;
}) {
 const links=mainNavItems(locale);
 return (
  <header className={cn("ux-site-header sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl",className)}>
   <div className="site-header-shell mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between gap-2 px-4 xl:min-h-[86px] xl:gap-3 xl:px-8">
    <a aria-label="NoordTune.nl home" className="flex shrink-0 items-center focus-visible:ring-2 focus-visible:ring-primary" href={mainLocaleHref(locale)}>
     <NoordTuneLogo className="h-[35px] w-28 min-[360px]:h-[40px] min-[360px]:w-32 min-[420px]:h-[44px] min-[420px]:w-36 sm:h-[59px] sm:w-48 xl:h-[64px] xl:w-52 2xl:h-[69px] 2xl:w-56"/>
    </a>
    <nav aria-label="Main menu" className="hidden min-w-0 flex-1 items-center justify-center gap-3 xl:flex 2xl:gap-4">
     {links.map(item=>(
      <a
       aria-current={item.active?"page":undefined}
       className={cn(
        "whitespace-nowrap text-[.62rem] font-black uppercase tracking-normal transition hover:text-primary focus-visible:text-primary 2xl:text-[.72rem]",
        item.active?"text-primary":"text-white"
       )}
       href={item.href}
       key={item.href}
      >{item.label}</a>
     ))}
    </nav>
    <div className="ml-auto flex shrink-0 items-center gap-1 xl:hidden">
      <LanguageSwitcher compact locale={locale} path={languagePath}/>
    </div>
    <div className="hidden shrink-0 items-center gap-3 xl:flex">
      <LanguageSwitcher locale={locale} path={languagePath}/>
      <a
       className="hidden h-11 items-center gap-2 whitespace-nowrap rounded-[3px] border border-white/25 bg-black/35 px-4 text-sm font-semibold text-white transition hover:border-primary 2xl:inline-flex"
       href={whatsappHref({locale})} rel="noreferrer" target="_blank"
      >
       <MessageCircle className="h-4 w-4"/>
       {whatsappPhoneLabel}
      </a>
    </div>
    <CatalogMobileMenu languagePath={languagePath} locale={locale}/>
   </div>
  </header>
 );
}

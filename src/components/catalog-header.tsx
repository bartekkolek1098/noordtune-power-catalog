import {ArrowUpRight, Menu, MessageCircle} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {LanguageSwitcher} from "@/components/language-switcher";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import {mainLocaleHref, mainNavItems} from "@/lib/noordtune-links";
import {cn} from "@/lib/utils";
import {whatsappHref} from "@/lib/whatsapp";

const mobileCopy: Record<Locale,{menu:string;contact:string;catalog:string}> = {
  nl:{menu:"Menu",contact:"Advies aanvragen",catalog:"Vermogenscatalogus"},
  en:{menu:"Menu",contact:"Ask for advice",catalog:"Power catalog"},
  pl:{menu:"Menu",contact:"Zapytaj o wycenę",catalog:"Katalog mocy"}
};

export function CatalogHeader({
  className,
  languagePath = "",
  locale
}: {
  className?: string;
  languagePath?: string;
  locale: Locale;
}) {
  const navItems = mainNavItems(locale);
  const copy=mobileCopy[locale];
  return (
    <header className={cn("ux-site-header sticky top-0 z-50",className)}>
      <div className="container flex h-[66px] items-center justify-between gap-3 sm:h-[76px] xl:h-[82px]">
        <a className="inline-flex shrink-0 items-center" aria-label="NoordTune.nl" href={mainLocaleHref(locale)}>
          <NoordTuneLogo className="h-[37px] w-[130px] min-[380px]:h-[43px] min-[380px]:w-[152px] sm:h-[49px] sm:w-[171px] xl:h-[54px] xl:w-[190px]"/>
        </a>

        <nav aria-label={copy.menu} className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {navItems.map((item)=>(
            <a
              key={item.href+"-"+item.label}
              aria-current={item.active?"page":undefined}
              className={cn(
                "border-b-2 border-transparent py-2 text-[12px] font-semibold tracking-[.01em] transition-colors hover:text-white 2xl:text-[13px]",
                item.active?"border-primary text-white":"text-[#aeb3b4]"
              )}
              href={item.href}
            >{item.label}</a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} path={languagePath}/>
          <a
            className="hidden min-h-11 items-center gap-2 rounded-xl border border-white/20 px-3 text-xs font-semibold text-white transition hover:border-white/50 hover:bg-white/[.06] md:inline-flex xl:hidden 2xl:inline-flex"
            href={whatsappHref({locale})}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-[17px] w-[17px]"/>
            <span className="hidden lg:inline 2xl:inline">{copy.contact}</span>
          </a>
          <details className="ux-header-menu relative xl:hidden">
            <summary className="flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-xl border border-white/20 px-3 text-sm font-semibold text-white transition hover:bg-white/[.06] focus-visible:ring-2 focus-visible:ring-primary">
              <Menu className="h-[19px] w-[19px]" aria-hidden="true"/>
              <span className="hidden min-[400px]:inline">{copy.menu}</span>
            </summary>
            <nav aria-label={copy.menu} className="ux-header-menu-list absolute right-0 top-full mt-3 w-[min(85vw,320px)] overflow-hidden rounded-2xl border border-white/15 bg-[#1b1d1f] p-2 shadow-[0_18px_55px_rgba(0,0,0,.46)]">
              {navItems.map(item=>(
                <a
                  aria-current={item.active?"page":undefined}
                  className={cn("flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-medium transition hover:bg-white/[.08]",item.active?"bg-primary/10 text-white":"text-[#c8cbcb]")}
                  href={item.href}
                  key={item.href+"-"+item.label}
                >{item.label}{item.active?<span className="h-1.5 w-1.5 rounded-full bg-primary"/>:null}</a>
              ))}
              <a href={whatsappHref({locale})} target="_blank" rel="noreferrer" className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-primary px-4 text-sm font-bold text-white">{copy.contact}<ArrowUpRight className="h-4 w-4"/></a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

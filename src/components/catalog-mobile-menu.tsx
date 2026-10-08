"use client";

import {Gauge, Menu, MessageCircle, X} from "lucide-react";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {LanguageSwitcher} from "@/components/language-switcher";
import {NoordTuneLogo} from "@/components/noordtune-logo";
import type {Locale} from "@/i18n/routing";
import {catalogHref, mainLocaleHref, mainNavItems} from "@/lib/noordtune-links";
import {whatsappHref} from "@/lib/whatsapp";

const copy={
 nl:{open:"Menu openen",close:"Menu sluiten",dialog:"Mobiel navigatiemenu",eyebrow:"NoordTune.nl",subtitle:"Chiptuning & auto diagnostiek",whatsapp:"WhatsApp ons",catalog:"Vermogenscatalogus",back:"Naar NoordTune.nl"},
 en:{open:"Open menu",close:"Close menu",dialog:"Mobile navigation menu",eyebrow:"NoordTune.nl",subtitle:"Chiptuning & car diagnostics",whatsapp:"Message us",catalog:"Power catalog",back:"Go to NoordTune.nl"},
 pl:{open:"Otwórz menu",close:"Zamknij menu",dialog:"Mobilne menu nawigacji",eyebrow:"NoordTune.nl",subtitle:"Chiptuning i diagnostyka",whatsapp:"Napisz na WhatsApp",catalog:"Katalog mocy",back:"Przejdź na NoordTune.nl"}
} satisfies Record<Locale,{open:string;close:string;dialog:string;eyebrow:string;subtitle:string;whatsapp:string;catalog:string;back:string}>;

/**
 * Same full-screen mobile navigation pattern as www.noordtune.nl.
 * Catalog remains active and links to the corporate site stay same-tab.
 */
export function CatalogMobileMenu({locale,languagePath=""}:{locale:Locale;languagePath?:string}){
 const [open,setOpen]=useState(false);
 const [mounted,setMounted]=useState(false);
 const button=useRef<HTMLButtonElement|null>(null);
 const dialog=useRef<HTMLDivElement|null>(null);
 const pathname=usePathname();
 const t=copy[locale];
 const links=mainNavItems(locale);

 useEffect(()=>setMounted(true),[]);
 useEffect(()=>setOpen(false),[pathname]);
 useEffect(()=>{
   if(!open)return;
   const y=window.scrollY;
   const before={overflow:document.body.style.overflow,position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
   document.body.style.overflow="hidden";
   document.body.style.position="fixed";
   document.body.style.top=`-${y}px`;
   document.body.style.width="100%";

   const onKey=(event:KeyboardEvent)=>{
     if(event.key==="Escape"){setOpen(false);return;}
     if(event.key!=="Tab")return;
     const nodes=dialog.current?.querySelectorAll<HTMLElement>("a,button,[tabindex]:not([tabindex='-1'])");
     if(!nodes?.length)return;
     const first=nodes[0],last=nodes[nodes.length-1];
     if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
     else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   };
   window.addEventListener("keydown",onKey);
   button.current?.focus();
   return ()=>{
     window.removeEventListener("keydown",onKey);
     document.body.style.overflow=before.overflow;
     document.body.style.position=before.position;
     document.body.style.top=before.top;
     document.body.style.width=before.width;
     window.scrollTo(0,y);
   };
 },[open]);

 return (
  <div className="xl:hidden">
   <button aria-expanded={open} aria-controls="catalog-mobile-navigation" aria-label={t.open}
     className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-white/15 bg-white/[0.04] text-white focus-visible:ring-2 focus-visible:ring-primary"
     onClick={()=>setOpen(true)} type="button">
    <Menu className="h-5 w-5"/>
   </button>
   {mounted&&open?createPortal(
    <div
      aria-label={t.dialog} aria-modal="true" className="fixed inset-0 z-[120] overflow-y-auto bg-[#020303] text-white"
      id="catalog-mobile-navigation" role="dialog" ref={dialog} onClick={()=>setOpen(false)}
    >
     <div
      className="min-h-[100dvh] bg-[radial-gradient(circle_at_85%_8%,rgba(227,6,19,.22),transparent_18rem),linear-gradient(180deg,#090a0b_0%,#020303_58%,#050505_100%)] px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+18px)]"
      onClick={e=>e.stopPropagation()}>
      <div className="mx-auto flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-42px)] w-full max-w-md flex-col">
       <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <a className="flex min-w-0 items-center focus-visible:ring-2 focus-visible:ring-primary" href={mainLocaleHref(locale)}>
         <NoordTuneLogo className="h-[49px] w-40 max-w-[58vw]"/>
        </a>
        <button aria-label={t.close} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-white/20 bg-white/[0.04] text-white hover:border-primary focus-visible:ring-2 focus-visible:ring-primary" onClick={()=>setOpen(false)} ref={button} type="button">
         <X className="h-5 w-5"/>
        </button>
       </div>
       <div className="border-b border-white/10 py-4">
        <p className="text-xs font-black uppercase text-primary">{t.eyebrow}</p>
        <p className="mt-1 text-sm text-white/70">{t.subtitle}</p>
        <LanguageSwitcher className="mt-4 flex-wrap gap-2" locale={locale} path={languagePath}/>
       </div>
       <nav aria-label={t.dialog} className="grid py-4">
        {links.map(item=>(
         <a aria-current={item.active?"page":undefined} className={`flex items-center justify-between border-b border-white/10 py-3.5 text-base font-black uppercase transition hover:text-primary focus-visible:text-primary ${item.active?"text-primary":"text-white"}`} href={item.href} key={item.href} onClick={()=>setOpen(false)}>
          <span>{item.label}</span>
          <span aria-hidden="true" className={item.active?"h-1.5 w-1.5 rounded-full bg-primary":"h-px w-5 bg-white/20"}/>
         </a>
        ))}
       </nav>
       <div className="mt-auto grid gap-3 border-t border-white/10 pt-5">
        <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-primary px-5 py-3 text-sm font-black uppercase text-white" href={whatsappHref({locale})} rel="noreferrer" target="_blank">
         {t.whatsapp}<MessageCircle className="h-4 w-4"/>
        </a>
        <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-white/20 bg-white/[.04] px-5 py-3 text-sm font-black uppercase" href={catalogHref(locale)} onClick={()=>setOpen(false)} aria-current="page">
         {t.catalog}<Gauge className="h-4 w-4"/>
        </a>
        <a className="py-3 text-center text-xs font-semibold text-white/70 underline underline-offset-4" href={mainLocaleHref(locale)}>{t.back}</a>
       </div>
      </div>
     </div>
    </div>,document.body
   ):null}
  </div>
 );
}

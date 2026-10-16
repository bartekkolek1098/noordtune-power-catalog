"use client";

import {track} from "@vercel/analytics";
import type {AnchorHTMLAttributes,MouseEvent,ReactNode} from "react";
import {approvedCatalogConversionEvent,type CatalogConversionEvent} from "@/lib/catalog-conversion-analytics";

type Props=Omit<AnchorHTMLAttributes<HTMLAnchorElement>,"href"> & {
 href:string; action:CatalogConversionEvent; children:ReactNode;
};

/**
 * Tracks an explicit visitor action only. Links work unchanged without JS or
 * Analytics service availability; no client-side identifiers are sent.
 */
export function CatalogTrackedLink({href,action,children,onClick,...rest}:Props){
 function handleClick(event:MouseEvent<HTMLAnchorElement>){
  if(approvedCatalogConversionEvent(action)){
   try{track(action.name,action.properties)}catch{
    // Analytics is best effort and must never interrupt a quote or WhatsApp click.
   }
  }
  onClick?.(event);
 }
 return <a {...rest} href={href} onClick={handleClick}
  data-catalog-analytics-event={action.name}
  data-catalog-analytics-locale={action.properties.locale}
  data-catalog-analytics-source={action.properties.source}>
  {children}
 </a>;
}

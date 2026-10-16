import {catalogEnquiryHref,type CatalogEnquiryRef} from "@/lib/catalog-enquiry-contract";
import {catalogEnquiryConversionSource} from "@/lib/catalog-conversion-analytics";
import {CatalogTrackedLink} from "@/components/catalog-tracked-link";
import type {Locale} from "@/i18n/routing";

/**
 * Exact-engine workshop handoff. The source page is public, but the referrer
 * policy intentionally transmits only the Power Catalog origin to WWW, never
 * a plate/query/engine path. Click events contain only locale + coarse source.
 */
export function CatalogEnquiryLink({
 reference,locale,business=false,className=""
}:{
 reference:CatalogEnquiryRef;locale:Locale;business?:boolean;className?:string;
}){
 let href:string;
 try{href=catalogEnquiryHref(reference,locale,business)}catch{return null;}
 const source=catalogEnquiryConversionSource(reference.kind,business);
 return <CatalogTrackedLink
  href={href}
  referrerPolicy="origin"
  rel="noopener"
  action={{name:"catalog_enquiry_click",properties:{locale,source}}}
  data-testid="catalog-enquiry-link"
  className={"inline-flex min-h-11 items-center justify-center rounded-md border border-white/30 px-4 py-3 text-center text-sm font-bold text-white transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-white "+className}>
  {{nl:"Offerteformulier voor deze motor",en:"Enquiry form for this engine",pl:"Formularz wyceny tego silnika"}[locale]}
 </CatalogTrackedLink>;
}

/**
 * Privacy boundary for anonymous Power Catalog conversion events.
 *
 * Only fixed event names plus a known locale and coarse source are allowed.
 * Never add a registration plate, VIN, customer detail, public engine ID,
 * quotation payload, free-text query, year or referrer URL to eventData.
 * Page-level context is aggregated separately by Vercel Web Analytics.
 */
import type {CatalogEnquiryKind} from "./catalog-enquiry-contract.ts";

export const catalogConversionSources=[
 "passenger_engine","van_engine","manual_selector","rdw_profile",
 "floating_whatsapp","mobile_whatsapp","vehicle_whatsapp","header_whatsapp"
] as const;
export type CatalogConversionSource=typeof catalogConversionSources[number];

export type CatalogConversionEventName="catalog_enquiry_click"|"catalog_whatsapp_click";
export type CatalogConversionLocale="nl"|"en"|"pl";
export type CatalogConversionProperties=Readonly<{
 locale:CatalogConversionLocale; source:CatalogConversionSource
}>;
export type CatalogConversionEvent=Readonly<{
 name:CatalogConversionEventName; properties:CatalogConversionProperties
}>;

export function catalogEnquiryConversionSource(
 kind:CatalogEnquiryKind,business:boolean
):CatalogConversionSource{
 if(kind==="manual")return "manual_selector";
 if(kind==="profile")return "rdw_profile";
 return business?"van_engine":"passenger_engine";
}
export function approvedCatalogConversionEvent(event:CatalogConversionEvent):boolean{
 const props=event.properties as unknown as Record<string,unknown>;
 return (event.name==="catalog_enquiry_click"||event.name==="catalog_whatsapp_click")
  &&Object.keys(props).length===2
  &&(props.locale==="nl"||props.locale==="en"||props.locale==="pl")
  &&catalogConversionSources.includes(props.source as CatalogConversionSource)
  &&(event.name==="catalog_enquiry_click"
     ?["passenger_engine","van_engine","manual_selector","rdw_profile"].includes(props.source as string)
     :["floating_whatsapp","mobile_whatsapp","vehicle_whatsapp","header_whatsapp"].includes(props.source as string));
}

import {createLookupQuoteMessage, whatsappHref, type VehicleQuoteMessageInput} from "./whatsapp.ts";

/** Call only from the customer's contact action. No URL is retained in UI state. */
export function openLookupContact(input: VehicleQuoteMessageInput & {plate: string},
  open: (url: string, target: string, features: string) => unknown = (url, target, features) => window.open(url, target, features)) {
  open(whatsappHref({locale: input.locale, message: createLookupQuoteMessage(input)}), "_blank", "noopener,noreferrer");
}

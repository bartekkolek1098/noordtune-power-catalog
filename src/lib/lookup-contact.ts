import {createLookupQuoteMessage, whatsappHref, type VehicleQuoteMessageInput} from "./whatsapp.ts";

/** Call only from the customer's contact action. No URL is retained in UI state. */
export function openLookupContact(input: VehicleQuoteMessageInput & {plate: string},
  open: (url: string, target: string, features: string) => unknown = (url, target, features) => window.open(url, target, features)) {
  open(whatsappHref({locale: input.locale, message: createLookupQuoteMessage(input)}), "_blank", "noopener,noreferrer");
}

/** RDW outage support: a plate is embedded in WhatsApp only after an explicit click. */
export function openFailedRdwContact(input: {plate: string; locale: VehicleQuoteMessageInput["locale"]; message: string},
  open: (url: string, target: string, features: string) => unknown = (url, target, features) => window.open(url, target, features)) {
  const plate = input.plate.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(plate)) return;
  open(whatsappHref({locale: input.locale, message: `${input.message} ${plate}`}), "_blank", "noopener,noreferrer");
}

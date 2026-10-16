export const routing = {
  locales: ["nl", "en", "pl"],
  defaultLocale: "nl"
} as const;

export type Locale = (typeof routing.locales)[number];

export const sharedLocaleCookieName = "noordtune_preferred_locale";

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}

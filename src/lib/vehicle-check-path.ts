import type {Locale} from "@/i18n/routing";

export const vehicleCheckPaths: Record<Locale, string> = {
  nl: "/nl/kentekencheck",
  en: "/en/vehicle-check",
  pl: "/pl/sprawdz-auto"
};

export const vehicleCheckSlugs: Record<Locale, string> = {
  nl: "kentekencheck",
  en: "vehicle-check",
  pl: "sprawdz-auto"
};

export function vehicleCheckPath(locale: Locale) {
  return vehicleCheckPaths[locale];
}

import {sitePath} from "@/lib/site-path";

export const POWER_SITE_URL = "https://power.noordtune.nl";

export function absoluteUrl(path: string) {
  const prefixedPath = sitePath(path).replace(/^\/+/, "");

  return new URL(prefixedPath, `${POWER_SITE_URL}/`).toString();
}

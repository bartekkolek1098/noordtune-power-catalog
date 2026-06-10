import type {MetadataRoute} from "next";
import {
  engineCatalog,
  getVehicleSeoSlugs,
  stageSlugMap,
  vehicleDatabase
} from "@/data/catalog";
import {routing} from "@/i18n/routing";
import {sitePath} from "@/lib/site-path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noordtune.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const homeRoutes = routing.locales.map((locale) => `/${locale}`);
  const vehicleRoutes = routing.locales.flatMap((locale) =>
    vehicleDatabase.map((vehicle) => `/${locale}/vehicles/${vehicle.id}`)
  );
  const stageRoutes = routing.locales.flatMap((locale) =>
    engineCatalog.flatMap((vehicle) => {
      const slugs = getVehicleSeoSlugs(vehicle);

      return vehicle.stages.map(
        (stage) =>
          `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`
      );
    })
  );

  return [...homeRoutes, ...vehicleRoutes, ...stageRoutes].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path.includes("/vehicles/") ? "weekly" : "daily",
    priority: path.includes("/vehicles/") ? 0.75 : 0.9
  }));
}

function absoluteUrl(path: string) {
  const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  const prefixedPath = sitePath(path).replace(/^\/+/, "");

  return new URL(prefixedPath, base).toString();
}

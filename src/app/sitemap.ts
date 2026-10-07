import type {MetadataRoute} from "next";
import {engineCatalog, getVehicleSeoSlugs, stageSlugMap} from "@/data/catalog";
import {isPublicCatalogStageName} from "@/data/catalog-shared";
import {routing} from "@/i18n/routing";
import {absoluteUrl} from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const homePages = routing.locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    changeFrequency: "weekly" as const,
    priority: 1
  }));
  const vehiclePages = routing.locales.flatMap((locale) =>
    engineCatalog.map((vehicle) => ({
      url: absoluteUrl(`/${locale}/vehicles/${vehicle.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.85
    }))
  );
  const stagePages = routing.locales.flatMap((locale) =>
    engineCatalog.flatMap((vehicle) => {
      const slugs = getVehicleSeoSlugs(vehicle);

      return vehicle.stages.filter((stage) => isPublicCatalogStageName(stage.name)).map((stage) => ({
        url: absoluteUrl(
          `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`
        ),
        changeFrequency: "monthly" as const,
        priority: 0.9
      }));
    })
  );

  return [...homePages, ...vehiclePages, ...stagePages];
}

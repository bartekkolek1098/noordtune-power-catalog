import type {MetadataRoute} from "next";
import {engineCatalog, getVehicleSeoSlugs, stageSlugMap} from "@/data/catalog";
import {isPublicCatalogStageName} from "@/data/catalog-shared";
import {nlStage1EngineProfiles,nlStage1EnginePath} from "@/data/nl-stage1-engine-seo";
import {nlModelFamilyHubs,nlModelHubPath} from "@/data/nl-model-family-seo";
import {nlBrandEngineGuides,nlBrandEngineIndexPath,nlBrandGuidePath} from "@/data/nl-brand-engine-guides";
import {nlVanModels,nlVanModelPath,nlVanEnginePath} from "@/data/nl-vans-seo";
import {nlVanEngines} from "@/data/nl-van-engines-seo";
import {nlVanComparisons,nlVanCompareIndexPath,nlVanComparePath} from "@/data/nl-van-comparisons";
import {nlVehicleDirectoryPath} from "@/data/nl-vehicle-editorial";
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

  const nlEnginePages=[
    {url:absoluteUrl("/nl/motoren"),changeFrequency:"monthly" as const,priority:0.75},
    ...nlStage1EngineProfiles.map(profile=>({
      url:absoluteUrl(nlStage1EnginePath(profile.slug)),
      changeFrequency:"monthly" as const,
      priority:0.7
    }))
  ];
  const nlModelPages=[
    {url:absoluteUrl("/nl/modellen"),changeFrequency:"monthly" as const,priority:0.78},
    ...nlModelFamilyHubs.map(hub=>({
      url:absoluteUrl(nlModelHubPath(hub.slug)),
      changeFrequency:"monthly" as const,priority:0.74
    }))
  ];
  const nlBrandPages=[
    {url:absoluteUrl(nlBrandEngineIndexPath),changeFrequency:"monthly" as const,priority:0.79},
    ...nlBrandEngineGuides.map(guide=>({
      url:absoluteUrl(nlBrandGuidePath(guide.slug)),changeFrequency:"monthly" as const,priority:0.76
    }))
  ];
  const nlVanPages=[
    {url:absoluteUrl("/nl/bedrijfswagens"),changeFrequency:"monthly" as const,priority:0.8},
    ...nlVanModels.map(m=>({
      url:absoluteUrl(nlVanModelPath(m.slug)),changeFrequency:"monthly" as const,priority:0.74
    })),
    ...nlVanEngines.map(e=>({
      url:absoluteUrl(nlVanEnginePath(e.slug)),changeFrequency:"monthly" as const,priority:0.73
    }))
  ];
  const nlVanComparisonPages=[
    {url:absoluteUrl(nlVanCompareIndexPath),changeFrequency:"monthly" as const,priority:0.79},
    ...nlVanComparisons.map(c=>({url:absoluteUrl(nlVanComparePath(c.slug)),
      changeFrequency:"monthly" as const,priority:0.76}))
  ];
  const reviewedVehicleDirectory=[{url:absoluteUrl(nlVehicleDirectoryPath),changeFrequency:"monthly" as const,priority:0.8}];
  return [...homePages, ...vehiclePages, ...stagePages, ...reviewedVehicleDirectory, ...nlEnginePages, ...nlModelPages, ...nlBrandPages, ...nlVanPages, ...nlVanComparisonPages];
}

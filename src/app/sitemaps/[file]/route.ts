import {
  engineCatalog,
  getVehicleSeoSlugs,
  stageSlugMap,
  vehicleDatabase
} from "@/data/catalog";
import {routing} from "@/i18n/routing";
import {
  urlSetXml,
  VEHICLE_SITEMAP_CHUNK_SIZE,
  xmlResponse
} from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{file: string}>;
};

export async function GET(_request: Request, {params}: RouteProps) {
  const {file} = await params;
  const now = new Date().toISOString();

  if (file === "core.xml") {
    return xmlResponse(urlSetXml(buildCoreUrls(now)));
  }

  const vehicleMatch = /^vehicles-(\d+)\.xml$/.exec(file);

  if (!vehicleMatch) {
    return new Response("Not found", {status: 404});
  }

  const page = Number(vehicleMatch[1]);
  const urls = buildVehicleUrls(page, now);

  if (urls.length === 0) {
    return new Response("Not found", {status: 404});
  }

  return xmlResponse(urlSetXml(urls));
}

function buildCoreUrls(lastModified: string) {
  const homeRoutes = routing.locales.map((locale) => ({
    path: `/${locale}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.95
  }));
  const stageRoutes = routing.locales.flatMap((locale) =>
    engineCatalog.flatMap((vehicle) => {
      const slugs = getVehicleSeoSlugs(vehicle);

      return vehicle.stages.map((stage) => ({
        path: `/${locale}/${slugs.brand}/${slugs.model}/${slugs.engine}/${stageSlugMap[stage.name]}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.85
      }));
    })
  );

  return [...homeRoutes, ...stageRoutes];
}

function buildVehicleUrls(page: number, lastModified: string) {
  const start = page * VEHICLE_SITEMAP_CHUNK_SIZE;
  const end = Math.min(
    start + VEHICLE_SITEMAP_CHUNK_SIZE,
    vehicleDatabase.length * routing.locales.length
  );

  if (!Number.isInteger(page) || page < 0 || start >= end) {
    return [];
  }

  return Array.from({length: end - start}, (_, offset) => {
    const index = start + offset;
    const localeIndex = Math.floor(index / vehicleDatabase.length);
    const vehicleIndex = index % vehicleDatabase.length;
    const locale = routing.locales[localeIndex];
    const vehicle = vehicleDatabase[vehicleIndex];

    return {
      path: `/${locale}/vehicles/${vehicle.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: vehicle.popular ? 0.85 : 0.7
    };
  });
}

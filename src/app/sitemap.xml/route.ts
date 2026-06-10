import {vehicleDatabaseCount} from "@/data/catalog";
import {routing} from "@/i18n/routing";
import {
  sitemapIndexXml,
  VEHICLE_SITEMAP_CHUNK_SIZE,
  xmlResponse
} from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

export function GET() {
  const localizedVehicleCount = vehicleDatabaseCount * routing.locales.length;
  const vehicleSitemapCount = Math.ceil(
    localizedVehicleCount / VEHICLE_SITEMAP_CHUNK_SIZE
  );
  const sitemapPaths = [
    "/sitemaps/core.xml",
    ...Array.from(
      {length: vehicleSitemapCount},
      (_, index) => `/sitemaps/vehicles-${index}.xml`
    )
  ];

  return xmlResponse(sitemapIndexXml(sitemapPaths));
}

import {sitePath} from "@/lib/site-path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noordtune.nl";

export const VEHICLE_SITEMAP_CHUNK_SIZE = 10_000;

type SitemapUrl = {
  path: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

export function absoluteUrl(path: string) {
  const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  const prefixedPath = sitePath(path).replace(/^\/+/, "");

  return new URL(prefixedPath, base).toString();
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}

export function sitemapIndexXml(paths: string[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map(
      (path) =>
        `<sitemap><loc>${escapeXml(absoluteUrl(path))}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`
    ),
    "</sitemapindex>"
  ].join("");
}

export function urlSetXml(urls: SitemapUrl[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (item) =>
        `<url><loc>${escapeXml(absoluteUrl(item.path))}</loc><lastmod>${item.lastModified}</lastmod><changefreq>${item.changeFrequency}</changefreq><priority>${item.priority.toFixed(2)}</priority></url>`
    ),
    "</urlset>"
  ].join("");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

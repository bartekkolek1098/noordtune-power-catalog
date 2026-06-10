import type {MetadataRoute} from "next";
import {sitePath} from "@/lib/site-path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noordtune.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [sitePath("/api/")]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}

function absoluteUrl(path: string) {
  const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  const prefixedPath = sitePath(path).replace(/^\/+/, "");

  return new URL(prefixedPath, base).toString();
}

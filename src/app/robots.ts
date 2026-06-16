import type {MetadataRoute} from "next";
import {absoluteUrl, POWER_SITE_URL} from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: POWER_SITE_URL
  };
}

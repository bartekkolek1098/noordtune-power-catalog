import type {Metadata, Viewport} from "next";
import {absoluteUrl, POWER_SITE_URL} from "@/lib/site-url";
import "./globals.css";
import "./editorial-v2.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? POWER_SITE_URL
  ),
  title: {
    default: "NoordTune Power Catalog",
    template: "%s | NoordTune"
  },
  description:
    "NoordTune vermogenscatalogus: RDW-kentekencheck, fabrieksvermogen, bronvermelde Stage 1-indicaties en voertuigprofielen.",
  openGraph: {
    title: "NoordTune Power Catalog",
    description:
      "Controleer voertuigspecificaties en indicatieve Stage 1-resultaten met RDW Open Data. Voor diensten en afspraken: NoordTune.nl.",
    url: absoluteUrl("/nl"),
    siteName: "NoordTune Power Catalog",
    locale: "nl_NL",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {url: "/favicon.svg", type: "image/svg+xml"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
      {url: "/favicon-48x48.png", sizes: "48x48", type: "image/png"},
      {url: "/favicon.ico", sizes: "any"}
    ],
    apple: [{url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png"}]
  }
};

export const viewport: Viewport = {
  themeColor: "#101214"
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>
        {/* Root layout cannot access [locale] params without a larger app restructure. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{const l=location.pathname.split('/')[1];if(['nl','en','pl'].includes(l))document.documentElement.lang=l;})()"
          }}
        />
        {children}
      </body>
    </html>
  );
}

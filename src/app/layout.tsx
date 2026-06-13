import type {Metadata} from "next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {sitePath} from "@/lib/site-path";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://noordtune.nl"
  ),
  title: {
    default: "NoordTune Power Catalog",
    template: "%s | NoordTune Power Catalog"
  },
  description:
    "RDW kenteken lookup en tuning catalog voor stages, deletes, DSG/TCU tuning en maatwerk offertes.",
  openGraph: {
    title: "NoordTune Power Catalog",
    description:
      "Vind direct tuning mogelijkheden per kenteken met RDW Open Data.",
    url: sitePath("/nl"),
    siteName: "NoordTune Power Catalog",
    locale: "nl_NL",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

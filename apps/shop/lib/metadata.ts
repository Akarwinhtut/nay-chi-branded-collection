import type { Metadata } from "next";

import { profile } from "@/lib/site-data";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const defaultTitle = `${profile.name} | Branded bags in Yangon`;
const defaultDescription = profile.shortPromise;

export const sharedMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${profile.name}`,
  },
  description: defaultDescription,
  applicationName: profile.name,
  keywords: [
    "bag shop",
    "bag store in Yangon",
    "physical bag store",
    "branded handbags",
    "shoulder bags",
    "tote bags",
    "Myanmar boutique",
    "branded bag store",
    "online bag store",
  ],
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    siteName: profile.name,
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profile.name} bag collection preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  category: "shopping",
};

export function buildMetadata({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
    },
    twitter: {
      title,
      description,
    },
  };
}

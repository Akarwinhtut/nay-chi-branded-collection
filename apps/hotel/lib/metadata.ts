import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

const siteName = "Astra Meridian Hotel";
const defaultTitle = `${siteName} | Skyline luxury hotel`;
const defaultDescription =
  "A premium futuristic hotel concept with skyline suites, rooftop experiences, and a direct booking-first flow.";

export const sharedMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    siteName,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  alternates: {
    canonical: "/",
  },
  category: "travel",
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

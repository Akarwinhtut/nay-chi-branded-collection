import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/metadata";
import { navigation } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...navigation, { label: "Policies", href: "/policies" }].map((item) => ({
    url: new URL(item.href, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}

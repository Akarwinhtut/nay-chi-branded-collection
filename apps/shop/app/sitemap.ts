import type { MetadataRoute } from "next";

import { getPublicCatalogProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/metadata";

const staticPages = [
  "/",
  "/services",
  "/about",
  "/contact",
  "/policies",
  "/projects",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicCatalogProducts();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((pathname) => ({
    url: new URL(pathname, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: pathname === "/" ? "weekly" : "monthly",
    priority: pathname === "/" ? 1 : pathname === "/services" ? 0.9 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: new URL(`/services/${product.slug}`, siteUrl).toString(),
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}

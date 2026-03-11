import Link from "next/link";

import { CollectionCatalog } from "@/components/collection-catalog";
import { getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Bags",
  description:
    "Browse the full Nay Chi Branded Collection catalog with clear prices and quiet product pages.",
  pathname: "/services",
});

export default async function CollectionPage() {
  const products = await getPublicCatalogProducts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:gap-14 lg:gap-16">
      <section className="grid gap-6 border-b border-[var(--color-line)] pb-6 sm:pb-8 lg:grid-cols-[0.24fr_0.76fr] lg:items-end">
        <div className="space-y-3">
          <p className="eyebrow">Collection</p>
          <p className="text-sm leading-7 text-[rgba(29,29,31,0.58)]">
            {products.length} bags currently in the edit.
          </p>
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-[3.3rem] font-medium leading-[0.9] tracking-[-0.05em] text-[var(--color-ink)] sm:text-[4.6rem] lg:text-[5.6rem]">
            Browse every bag.
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-base leading-7 text-[rgba(29,29,31,0.64)] sm:text-lg">
              Filter by silhouette or keep the full edit open in one calm view.
            </p>
            <Link href="/" className="quiet-link">
              <span className="signal-label !text-[rgba(94,67,39,0.7)]">Back to storefront</span>
            </Link>
          </div>
        </div>
      </section>

      <CollectionCatalog products={products} />
    </div>
  );
}

import { CollectionCatalog } from "@/components/collection-catalog";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    <div className="mx-auto flex max-w-5xl flex-col gap-16 lg:gap-20">
      <section className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
        <ScrollReveal soft>
          <div className="space-y-4 lg:pt-3">
            <p className="eyebrow">Collection</p>
            <p className="max-w-xs text-sm leading-7 text-[rgba(29,29,31,0.58)]">
              The complete edit, arranged with the same quiet treatment as the homepage.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal soft>
          <div className="space-y-6">
            <h1 className="font-display text-[4.1rem] font-medium leading-[0.88] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[5.8rem] lg:text-[6.6rem]">
              The full collection.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.64)] sm:text-lg">
              Filter by category if you want, or simply move through the gallery at your own pace.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal direction="scale">
        <CollectionCatalog products={products} />
      </ScrollReveal>
    </div>
  );
}

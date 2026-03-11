import Link from "next/link";

import { ProductImage } from "@/components/product-image";
import { ProductTile } from "@/components/product-tile";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  getCatalogProductDisplayPrice,
  getFeaturedCatalogProducts,
  getLatestCatalogProducts,
  getPublicCatalogProducts,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice, profile, storePhoto, visitDetails } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Curated Branded Bags in Yangon",
  description:
    "A quieter boutique for branded bags in Yangon, with a clearer shopping edit and visible prices.",
  pathname: "/",
});

function dedupeProducts<T extends { slug: string }>(products: T[]) {
  return products.filter(
    (product, index, items) => items.findIndex((item) => item.slug === product.slug) === index,
  );
}

export default async function HomePage() {
  const products = await getPublicCatalogProducts();

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-10 py-10">
        <SectionHeading
          eyebrow={profile.name}
          title="The boutique is ready for its first bag."
          description="Once a piece is published, the home page opens with the current edit and the latest arrivals."
        />
        <div className="surface-panel rounded-[2.4rem] p-8 sm:p-10">
          <Link href="/services" className="cta-button">
            View collection
          </Link>
        </div>
      </div>
    );
  }

  const latestProducts = getLatestCatalogProducts(products);
  const featuredProducts = getFeaturedCatalogProducts(products);
  const heroProduct = latestProducts[0] ?? featuredProducts[0] ?? products[0];
  const newArrivalProducts = dedupeProducts([
    ...latestProducts.filter((product) => product.slug !== heroProduct.slug),
    ...products.filter((product) => product.slug !== heroProduct.slug),
  ]).slice(0, 3);
  const leadFavorite =
    featuredProducts.find((product) => product.slug !== heroProduct.slug) ??
    products.find((product) => product.slug !== heroProduct.slug) ??
    heroProduct;
  const supportingFavorites = dedupeProducts([
    ...featuredProducts.filter(
      (product) =>
        product.slug !== heroProduct.slug && product.slug !== leadFavorite.slug,
    ),
    ...products.filter(
      (product) =>
        product.slug !== heroProduct.slug && product.slug !== leadFavorite.slug,
    ),
  ]).slice(0, 2);
  const heroLabel = latestProducts.some((product) => product.slug === heroProduct.slug)
    ? "New In"
    : "Featured";
  const supportHighlights = [
    {
      label: "Pricing",
      value: "Shown upfront.",
      note: "Clear before you open a product page.",
    },
    {
      label: "Replies",
      value: visitDetails[2]?.value ?? "Same-day Telegram",
      note: "Best for quick stock checks and holds.",
    },
    {
      label: "Pickup",
      value: visitDetails[3]?.value ?? "Flexible handoff",
      note: "Confirmed directly with the store.",
    },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:gap-16 lg:gap-20">
      <section className="grid gap-6 sm:gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
        <ScrollReveal className="space-y-6" soft>
          <div className="space-y-4">
            <p className="eyebrow">{profile.name}</p>
            <h1 className="font-display text-[3.3rem] font-medium leading-[0.88] tracking-[-0.05em] text-[var(--color-ink)] sm:text-[5.1rem] lg:text-[5.8rem]">
              A quieter edit of branded bags.
            </h1>
            <p className="max-w-md text-base leading-7 text-[rgba(29,29,31,0.64)] sm:text-lg">
              Structured day bags, shoulder silhouettes, and evening pieces with prices shown upfront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/services" className="cta-button">
              View collection
            </Link>
            <Link href="#new-arrivals" className="ghost-button">
              New in
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[var(--color-line)] pt-4">
            <span className="inventory-pill">{products.length} pieces in the edit</span>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left" soft>
          <Link href={`/services/${heroProduct.slug}`} className="group block">
            <article className="surface-panel rounded-[2.5rem] p-4 sm:p-5">
              <ProductImage
                src={heroProduct.image.src}
                alt={heroProduct.image.alt}
                position={heroProduct.image.position}
                className="min-h-[26rem] sm:min-h-[34rem] lg:min-h-[38rem] transition-transform duration-500 group-hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 54vw"
                priority
              />
              <div className="mt-5 grid gap-4 border-t border-[var(--color-line)] pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <p className="signal-label">{heroLabel}</p>
                  <h2 className="font-display text-[2.5rem] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3.2rem]">
                    {heroProduct.name}
                  </h2>
                </div>
                <div className="space-y-2 sm:text-right">
                  <p className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)]">
                    {formatPrice(getCatalogProductDisplayPrice(heroProduct))}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(29,29,31,0.42)]">
                    {heroProduct.category}
                  </p>
                </div>
              </div>
            </article>
          </Link>
        </ScrollReveal>
      </section>

      {newArrivalProducts.length > 0 ? (
        <section id="new-arrivals" className="space-y-8">
          <ScrollReveal soft>
            <SectionHeading
              eyebrow="New in"
              title="The latest arrivals."
              action={
                <Link href="/services" className="quiet-link">
                  <span className="signal-label !text-[rgba(94,67,39,0.7)]">View collection</span>
                </Link>
              }
            />
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {newArrivalProducts.map((product, index) => (
              <ScrollReveal key={product.slug} delayMs={index * 70} direction="up" soft>
                <ProductTile
                  product={product}
                  imageClassName="min-h-[18rem] sm:min-h-[22rem]"
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}

      {leadFavorite ? (
        <section className="space-y-8">
          <ScrollReveal soft>
            <SectionHeading
              eyebrow="Boutique edit"
              title="Most requested pieces."
            />
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <ScrollReveal direction="right" soft>
              <Link href={`/services/${leadFavorite.slug}`} className="group block">
                <article className="surface-panel rounded-[2.4rem] p-5 sm:p-6">
                  <div className="grid gap-6 lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
                    <ProductImage
                      src={leadFavorite.image.src}
                      alt={leadFavorite.image.alt}
                      position={leadFavorite.image.position}
                      className="min-h-[22rem] rounded-[1.9rem] transition-transform duration-500 group-hover:scale-[1.01] sm:min-h-[26rem]"
                      sizes="(max-width: 1024px) 100vw, 34vw"
                    />

                    <div className="space-y-4">
                      <p className="signal-label">Boutique favorite</p>
                      <h3 className="font-display text-[2.6rem] font-medium leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3.4rem]">
                        {leadFavorite.name}
                      </h3>
                      <p className="max-w-md text-sm leading-7 text-[rgba(29,29,31,0.62)] line-clamp-2 sm:text-base">
                        {leadFavorite.shortDescription}
                      </p>
                      <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-4">
                        <p className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)]">
                          {formatPrice(getCatalogProductDisplayPrice(leadFavorite))}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(29,29,31,0.42)]">
                          View details
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {supportingFavorites.map((product, index) => (
                <ScrollReveal
                  key={product.slug}
                  delayMs={index * 80}
                  direction="left"
                  soft
                >
                  <ProductTile
                    product={product}
                    imageClassName="min-h-[17rem] sm:min-h-[19rem]"
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ScrollReveal soft>
        <section className="border-y border-[var(--color-line)] py-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow">The store</p>
              <h2 className="font-display text-[3rem] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4rem]">
                A quieter place to browse in person.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[rgba(29,29,31,0.64)]">
                Clear prices, direct details, and a smaller in-person edit.
              </p>
              <Link href="/about" className="quiet-link">
                <span className="signal-label !text-[rgba(94,67,39,0.7)]">Visit the store</span>
              </Link>
            </div>

            <div className="grid gap-4">
              <div className="surface-panel rounded-[2.2rem] p-4 sm:p-5">
                <ProductImage
                  src={storePhoto.src}
                  alt={storePhoto.alt}
                  position={storePhoto.position}
                  className="min-h-[16rem] sm:min-h-[22rem] lg:min-h-[25rem]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {supportHighlights.map((item) => (
                  <article
                    key={item.label}
                    className="surface-panel rounded-[1.8rem] p-5 sm:p-6"
                  >
                    <p className="signal-label">{item.label}</p>
                    <p className="mt-3 text-base font-semibold leading-7 text-[var(--color-ink)]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[rgba(29,29,31,0.58)]">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

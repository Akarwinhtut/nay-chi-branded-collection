import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductTile } from "@/components/product-tile";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  getPublicCatalogProductBySlug,
  getPublicCatalogProducts,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import {
  contactMethods,
  formatPrice,
  getProductTotalStock,
  getVariantTotalStock,
  visitDetails,
} from "@/lib/site-data";

type BagPageParams = Promise<{ slug: string }>;

function getRelatedProducts(
  products: Awaited<ReturnType<typeof getPublicCatalogProducts>>,
  currentSlug: string,
  collection: string,
  category: string,
) {
  return products
    .filter((product) => product.slug !== currentSlug)
    .sort((left, right) => {
      const leftScore =
        (left.collection === collection ? 2 : 0) + (left.category === category ? 1 : 0);
      const rightScore =
        (right.collection === collection ? 2 : 0) + (right.category === category ? 1 : 0);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return left.displayOrder - right.displayOrder;
    })
    .slice(0, 3);
}

export async function generateStaticParams() {
  const products = await getPublicCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: BagPageParams;
}) {
  const { slug } = await params;
  const product = await getPublicCatalogProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Bag",
      description: "This bag could not be found.",
      pathname: "/services",
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    pathname: `/services/${product.slug}`,
  });
}

export default async function BagDetailPage({
  params,
}: {
  params: BagPageParams;
}) {
  const { slug } = await params;
  const products = await getPublicCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const totalStock = getProductTotalStock(product);
  const telegram = contactMethods.find((contact) => contact.label === "Telegram");
  const email = contactMethods.find((contact) => contact.label === "Email");
  const relatedProducts = getRelatedProducts(
    products,
    product.slug,
    product.collection,
    product.category,
  );
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.src,
    brand: {
      "@type": "Brand",
      name: product.collection,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "MMK",
      price: product.price,
      availability:
        totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-16 lg:gap-20">
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[rgba(29,29,31,0.56)]">
            <Link href="/" className="footer-link hover:text-[var(--color-ink)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="footer-link hover:text-[var(--color-ink)]">
              Bags
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ink)]">{product.name}</span>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-start">
          <ScrollReveal direction="right">
            <div className="rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(246,238,228,0.94))] p-4 shadow-[0_26px_64px_rgba(53,38,24,0.05)] sm:p-5">
              <div
                className="editorial-photo min-h-[34rem] sm:min-h-[46rem]"
                style={{
                  backgroundImage: `url(${product.image.src})`,
                  backgroundPosition: product.image.position ?? "center center",
                }}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="space-y-6" direction="left" soft>
            <div className="space-y-4">
              <p className="eyebrow">
                {product.collection} / {product.category}
              </p>
              <h1 className="font-display text-[4.2rem] font-medium leading-[0.88] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[5.8rem]">
                {product.name}
              </h1>
              <p className="text-[1.8rem] font-semibold leading-[1] tracking-[0.01em] text-[var(--color-accent-strong)] sm:text-[2.15rem]">
                {formatPrice(product.price)}
              </p>
              <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.68)] sm:text-lg">
                {product.description}
              </p>
            </div>

            <div className="grid gap-0 border-y border-[var(--color-line)] sm:grid-cols-3">
              <article className="space-y-3 border-b border-[var(--color-line)] py-5 sm:border-b-0 sm:border-r sm:pr-5">
                <p className="signal-label">Category</p>
                <p className="text-base font-semibold text-[var(--color-ink)]">{product.category}</p>
              </article>
              <article className="space-y-3 border-b border-[var(--color-line)] py-5 sm:border-b-0 sm:border-r sm:px-5">
                <p className="signal-label">Material</p>
                <p className="text-base font-semibold text-[var(--color-ink)]">{product.material}</p>
              </article>
              <article className="space-y-3 py-5 sm:pl-5">
                <p className="signal-label">In store</p>
                <p className="text-base font-semibold text-[var(--color-ink)]">{totalStock} pieces</p>
              </article>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,251,246,0.62)] p-5 sm:p-6">
              <p className="signal-label">Available colors</p>
              <div className="mt-4 grid gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.color}
                    className="rounded-[1.45rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.48)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full border border-[rgba(29,29,31,0.12)]"
                          style={{ backgroundColor: variant.swatch }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            {variant.color}
                          </p>
                          <p className="text-sm text-[rgba(29,29,31,0.56)]">{variant.finish}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        {getVariantTotalStock(variant)} in store
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {variant.sizes.map((size) => (
                        <span key={`${variant.color}-${size.label}`} className="inventory-pill">
                          {size.label} / {size.stock}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--color-line)] pt-5">
              <p className="signal-label">From the store</p>
              <p className="mt-3 max-w-xl text-base leading-8 text-[rgba(29,29,31,0.68)]">
                {product.detail} Available at {visitDetails[0]?.value}. {visitDetails[1]?.value}.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[rgba(29,29,31,0.62)]">
                {telegram ? (
                  <a href={telegram.href} className="footer-link text-[var(--color-ink)]">
                    Telegram
                  </a>
                ) : null}
                {email ? (
                  <a href={email.href} className="footer-link text-[var(--color-ink)]">
                    Email
                  </a>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="space-y-8">
            <ScrollReveal soft>
              <SectionHeading
                eyebrow="More from the collection"
                title="Similar pieces, with the same quiet treatment."
                description="A few nearby bags to compare by mood, size, or shape."
              />
            </ScrollReveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductTile
                  key={related.slug}
                  product={related}
                  imageClassName="min-h-[23rem]"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

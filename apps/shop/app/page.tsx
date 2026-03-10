import Link from "next/link";

import { ProductTile } from "@/components/product-tile";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getLatestCatalogProducts, getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { formatPrice, profile, visitDetails } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Home",
  description:
    "A calm collection of branded bags in Yangon, shown with clear prices and equal treatment.",
  pathname: "/",
});

export default async function HomePage() {
  const products = await getPublicCatalogProducts();
  const latestProducts = getLatestCatalogProducts(products);
  const [arrivalStory, ...arrivalSelections] = latestProducts;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-20 lg:gap-24">
      <section className="grid gap-8 pt-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start lg:pt-10">
        <ScrollReveal soft>
          <div className="space-y-4 lg:pt-3">
            <p className="eyebrow">Nay Chi Branded Collection</p>
            <p className="max-w-xs text-sm leading-7 text-[rgba(29,29,31,0.58)]">
              A boutique bag store in Yangon with a calmer online presence and a warm, composed
              edit.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal soft>
          <div className="space-y-6">
            <h1 className="font-display text-[4.3rem] font-medium leading-[0.86] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[6.2rem] lg:text-[7.2rem]">
              Quiet luxury, kept approachable.
            </h1>
            <p className="max-w-lg text-base leading-8 text-[rgba(29,29,31,0.64)] sm:text-lg">
              A warm edit of branded bags, arranged with the calm of a gallery wall. Each piece is
              given the same weight, the price stays visible without pressure, and the store
              remains present without taking over the room.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {products.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {arrivalStory ? (
        <section className="grid gap-10 lg:grid-cols-[0.54fr_0.46fr] lg:items-center">
          <ScrollReveal direction="right" soft distance={20}>
            <Link href={`/services/${arrivalStory.slug}`} className="group block">
              <div className="rounded-[2.6rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.9),rgba(247,240,232,0.96))] p-4 shadow-[0_26px_64px_rgba(53,38,24,0.05)] transition-[box-shadow,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--color-line-strong)] group-hover:shadow-[0_34px_80px_rgba(53,38,24,0.08)] sm:p-5">
                <div
                  className="editorial-photo min-h-[26rem] sm:min-h-[38rem] lg:min-h-[42rem]"
                  style={{
                    backgroundImage: `url(${arrivalStory.image.src})`,
                    backgroundPosition: arrivalStory.image.position ?? "center center",
                  }}
                />
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="space-y-6" direction="left" delayMs={80} distance={18} soft>
            <p className="eyebrow">New in the store</p>
            <h2 className="font-display text-[3.4rem] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4.8rem]">
              A recent arrival, shown quietly.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.64)] sm:text-lg">
              {arrivalStory.name} comes into the collection with a softer mood and the same calm
              presentation as everything else. {arrivalStory.shortDescription}
            </p>

            <Link
              href={`/services/${arrivalStory.slug}`}
              className="group inline-flex items-center gap-3 border-b border-[var(--color-line)] pb-3 text-[var(--color-ink)]"
            >
              <span className="font-display text-[2.3rem] font-medium leading-[0.92] tracking-[-0.04em]">
                {arrivalStory.name}
              </span>
              <span className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)]">
                {formatPrice(arrivalStory.price)}
              </span>
            </Link>

            {arrivalSelections.length > 0 ? (
              <div className="grid gap-0 border-y border-[var(--color-line)]">
                {arrivalSelections.slice(0, 2).map((product) => (
                  <Link
                    key={product.slug}
                    href={`/services/${product.slug}`}
                    className="grid gap-3 border-b border-[var(--color-line)] py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-end"
                  >
                    <div className="space-y-1">
                      <p className="signal-label">Also in the recent edit</p>
                      <p className="font-display text-[2rem] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--color-ink)]">
                        {product.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)]">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : null}
          </ScrollReveal>
        </section>
      ) : null}

      <ScrollReveal soft>
        <section className="border-y border-[var(--color-line)] py-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow">About the store</p>
              <h2 className="font-display text-[3.2rem] font-medium leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4.6rem]">
                More boutique gallery than online marketplace.
              </h2>
              <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.66)]">
                {profile.bio}
              </p>
            </div>

            <div className="grid gap-0 border-t border-[var(--color-line)] lg:grid-cols-3 lg:border-l lg:border-t-0">
              {visitDetails.slice(0, 3).map((detail) => (
                <article
                  key={detail.label}
                  className="space-y-3 border-b border-[var(--color-line)] py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-1 last:border-r-0"
                >
                  <p className="signal-label">{detail.label}</p>
                  <p className="text-lg font-semibold leading-7 text-[var(--color-ink)]">
                    {detail.value}
                  </p>
                  <p className="text-sm leading-7 text-[rgba(29,29,31,0.62)]">{detail.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
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
  const [arrivalStory] = latestProducts;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 sm:gap-20 lg:gap-24">
      <PageIntro
        eyebrow={profile.name}
        title="The collection, quietly presented."
        description="A calm gallery of branded bags with visible prices, equal treatment for every piece, and just enough store detail to stay grounded."
        detail="A boutique bag store in Yangon, arranged online with a slower, warmer pace."
        stats={[
          {
            label: "In the edit",
            value: `${products.length} bags shown without featured ranking`,
          },
          {
            label: "Visit",
            value: visitDetails[0]?.value ?? profile.location,
          },
        ]}
        action={
          <Link href="/services" className="quiet-link">
            <span className="signal-label !text-[rgba(94,67,39,0.7)]">View all bags</span>
            <span className="text-sm text-[rgba(29,29,31,0.58)]">{products.length} pieces</span>
          </Link>
        }
      />

      <section>
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {products.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {arrivalStory ? (
        <section className="grid gap-8 border-t border-[var(--color-line)] pt-8 sm:gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:items-center">
          <ScrollReveal direction="right" soft distance={20}>
            <Link href={`/services/${arrivalStory.slug}`} className="group block">
              <div className="rounded-[2.4rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(247,240,232,0.94))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.05)] transition-[box-shadow,border-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--color-line-strong)] group-hover:shadow-[0_30px_72px_rgba(53,38,24,0.08)] sm:p-5">
                <div
                  className="editorial-photo min-h-[24rem] sm:min-h-[35rem] lg:min-h-[38rem]"
                  style={{
                    backgroundImage: `url(${arrivalStory.image.src})`,
                    backgroundPosition: arrivalStory.image.position ?? "center center",
                  }}
                />
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="space-y-6" direction="left" delayMs={80} distance={18} soft>
            <p className="eyebrow">Recent arrival</p>
            <h2 className="font-display text-[3.1rem] font-medium leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4.4rem]">
              One recent piece, kept in the same calm line.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.64)] sm:text-lg">
              {arrivalStory.name} enters the collection without changing the balance of the page.{" "}
              {arrivalStory.shortDescription}
            </p>

            <Link href={`/services/${arrivalStory.slug}`} className="quiet-link">
              <span className="font-display text-[2.3rem] font-medium leading-[0.92] tracking-[-0.04em]">
                {arrivalStory.name}
              </span>
              <span className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)]">
                {formatPrice(arrivalStory.price)}
              </span>
            </Link>
          </ScrollReveal>
        </section>
      ) : null}

      <ScrollReveal soft>
        <section className="border-y border-[var(--color-line)] py-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow">About the store</p>
              <h2 className="font-display text-[3rem] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4.2rem]">
                A smaller store, shown with more room to breathe.
              </h2>
              <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.66)]">
                {profile.bio}
              </p>
              <Link href="/about" className="quiet-link">
                <span className="signal-label !text-[rgba(94,67,39,0.7)]">Read the store note</span>
                <span className="text-sm text-[rgba(29,29,31,0.58)]">
                  Hours, location, and contact
                </span>
              </Link>
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

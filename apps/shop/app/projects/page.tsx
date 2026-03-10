import Link from "next/link";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  getFeaturedCatalogProducts,
  getPublicCatalogProducts,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import {
  formatPrice,
  lookbookStories,
  products as seededProducts,
} from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Photos",
  description:
    "Explore styling ideas from Nay Chi Branded Collection, pairing bags, wallets, and travel pieces into cleaner sets.",
  pathname: "/projects",
});

export default async function LookbookPage() {
  const catalogProducts = await getPublicCatalogProducts();
  const featuredProducts = getFeaturedCatalogProducts(catalogProducts);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 lg:gap-24">
      <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <ScrollReveal className="space-y-6" soft>
          <SectionHeading
            eyebrow="Style gallery"
            title="See how the collection feels before you decide."
            description="Use these photo sets to compare shape, contrast, and color mood before opening a bag detail page."
          />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <div className="surface-panel rounded-[2.2rem] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Everyday mood",
                "Evening contrast",
                "Brighter carryalls",
              ].map((item, index) => (
                <article key={item} className="signal-card rounded-[1.7rem] p-4">
                  <p className="signal-label">View 0{index + 1}</p>
                  <p className="mt-3 font-display text-[2rem] leading-[0.92] text-[var(--color-ink)]">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="space-y-8">
        <ScrollReveal soft>
          <SectionHeading
            eyebrow="Photo stories"
            title="Three ways to read the collection."
            description="Look for shape, size, and balance. The gallery is meant to support the buying decision, not distract from it."
          />
        </ScrollReveal>

        <div className="space-y-8">
          {lookbookStories.map((story, index) => {
            const featuredItems = story.featuredSlugs
              .map(
                (slug) =>
                  catalogProducts.find((product) => product.slug === slug) ??
                  seededProducts.find((product) => product.slug === slug),
              )
              .filter(Boolean);

            return (
              <ScrollReveal
                key={story.title}
                delayMs={index * 90}
                direction={index % 2 === 0 ? "right" : "left"}
              >
                <article
                  className={`grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div
                    className="editorial-photo min-h-[25rem] sm:min-h-[28rem] lg:min-h-[36rem]"
                    style={{
                      backgroundImage: `url(${story.image.src})`,
                      backgroundPosition: story.image.position ?? "center center",
                    }}
                  >
                    <div className="flex h-full items-start p-5">
                      <span className="chip">{story.eyebrow}</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h2 className="font-display text-[3rem] leading-[0.9] text-[var(--color-ink)] sm:text-[4.5rem]">
                      {story.title}
                    </h2>
                    <p className="body-copy max-w-xl text-base leading-8 sm:text-lg">
                      {story.body}
                    </p>
                    <p className="field-note max-w-lg">{story.detail}</p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {featuredItems.map((item) =>
                        item ? (
                          <article
                            key={item.slug}
                            className="choice-card rounded-[1.6rem] p-4"
                          >
                            <p className="signal-label">{item.category}</p>
                            <h3 className="mt-2 font-display text-[2rem] leading-[0.92] text-[var(--color-ink)]">
                              {item.name}
                            </h3>
                            <p className="mt-3 text-sm font-semibold text-[var(--color-accent-strong)]">
                              {formatPrice(item.price)}
                            </p>
                          </article>
                        ) : null,
                      )}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <ScrollReveal soft>
          <SectionHeading
            eyebrow="Best sellers"
            title="The pieces shoppers return to most."
            description="If you want a shorter shortlist, start here."
          />
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ScrollReveal key={product.slug} delayMs={index * 80} direction="scale">
              <article className="depth-card surface-panel rounded-[2rem] p-4 sm:p-5">
                <div
                  className="editorial-photo min-h-[23rem]"
                  style={{
                    backgroundImage: `url(${product.image.src})`,
                    backgroundPosition: product.image.position ?? "center center",
                  }}
                >
                  <div className="flex h-full items-start p-5">
                    <span className="chip">{product.collection}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[2.5rem] leading-[0.92] text-[var(--color-ink)]">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--color-accent-strong)]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <Link href={`/contact?product=${product.slug}#planner`} className="ghost-button">
                    Start with this bag
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}

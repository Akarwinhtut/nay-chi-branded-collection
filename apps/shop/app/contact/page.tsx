import Link from "next/link";

import { ProductConfigurator } from "@/components/product-configurator";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { contactMethods, faqs, visitDetails } from "@/lib/site-data";

const telegram = contactMethods.find((contact) => contact.label === "Telegram");
const email = contactMethods.find((contact) => contact.label === "Email");
const map = contactMethods.find((contact) => contact.label === "Map");

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Ask about a bag, request more photos, or plan a store visit with Nay Chi Branded Collection.",
  pathname: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const products = await getPublicCatalogProducts();
  const selectedProduct = product
    ? products.find((item) => item.slug === product) ?? null
    : null;
  const isFocusedOrder = Boolean(selectedProduct);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 lg:gap-24">
      {isFocusedOrder ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <ScrollReveal className="space-y-6" soft>
            <SectionHeading
              eyebrow="Selected bag"
              title={`Finish the last details for ${selectedProduct?.name}.`}
              description="The bag is already chosen. Pick the color, size, and quantity, then send one short message to the store."
            />
          </ScrollReveal>

          <ScrollReveal direction="left">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={`/services/${selectedProduct?.slug ?? ""}`} className="ghost-button">
                Back to bag
              </Link>
              {telegram ? (
                <a href={telegram.href} className="cta-button">
                  Ask on Telegram
                </a>
              ) : null}
            </div>
          </ScrollReveal>
        </section>
      ) : (
        <section className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <ScrollReveal className="space-y-6" soft>
            <SectionHeading
              eyebrow="Talk to the store"
              title="Choose the contact method that feels easiest."
              description="Telegram for quick replies, email for longer notes, and Google Maps when you want to visit in person."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {telegram ? (
                <a href={telegram.href} className="signal-card rounded-[1.8rem] p-5">
                  <p className="signal-label">Fastest reply</p>
                  <h2 className="mt-3 font-display text-[2.3rem] leading-[0.92] text-[var(--color-ink)]">
                    Telegram
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.64)]">
                    {telegram.displayValue}
                  </p>
                </a>
              ) : null}

              {email ? (
                <a href={email.href} className="signal-card rounded-[1.8rem] p-5">
                  <p className="signal-label">Detailed note</p>
                  <h2 className="mt-3 font-display text-[2.3rem] leading-[0.92] text-[var(--color-ink)]">
                    Email
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.64)]">
                    {email.displayValue}
                  </p>
                </a>
              ) : null}

              {map ? (
                <a href={map.href} className="signal-card rounded-[1.8rem] p-5">
                  <p className="signal-label">Store visit</p>
                  <h2 className="mt-3 font-display text-[2.3rem] leading-[0.92] text-[var(--color-ink)]">
                    Google Maps
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.64)]">
                    {map.displayValue}
                  </p>
                </a>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <div className="support-card rounded-[2.5rem] p-6 sm:p-8">
              <p className="eyebrow !text-[rgba(255,249,241,0.72)]">Visit notes</p>
              <div className="mt-6 space-y-4">
                {visitDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="border-b border-[rgba(255,249,241,0.14)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,249,241,0.56)]">
                      {detail.label}
                    </p>
                    <h3 className="mt-2 font-display text-[2rem] leading-[0.92] text-[var(--color-surface)]">
                      {detail.value}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[rgba(255,249,241,0.78)]">
                      {detail.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      <ScrollReveal direction="scale">
        <ProductConfigurator
          products={products}
          key={product ?? "planner"}
          anchorId="planner"
          eyebrow={isFocusedOrder ? "Order form" : "Order planner"}
          title={
            isFocusedOrder
              ? "Only the final choices remain."
              : "Build the order in a few clear steps."
          }
          description={
            isFocusedOrder
              ? "Your bag is already selected. Confirm the last details and send the message."
              : "Choose the bag, pick the finish, then copy a ready-made message. If you want, you can still skip straight to Telegram."
          }
          initialProductSlug={product}
          streamlined={isFocusedOrder}
          lockInitialProduct={isFocusedOrder}
        />
      </ScrollReveal>

      {isFocusedOrder ? (
        <section className="space-y-6">
          <ScrollReveal direction="scale">
            <div className="choice-card rounded-[2rem] p-6 sm:p-7">
              <p className="signal-label">Still unsure?</p>
              <h2 className="mt-3 font-display text-[2.6rem] leading-[0.94] text-[var(--color-ink)]">
                Send the bag name or a screenshot instead.
              </h2>
              <p className="body-copy mt-3 max-w-2xl text-base leading-8">
                If the form feels like too much, just open Telegram or email and send the bag name.
                The store can finish the order with you directly.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {telegram ? (
                  <a href={telegram.href} className="cta-button">
                    Open Telegram
                  </a>
                ) : null}
                {email ? (
                  <a href={email.href} className="ghost-button">
                    Email the store
                  </a>
                ) : null}
                <Link href="/services" className="ghost-button">
                  See all bags
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      ) : (
        <section className="space-y-8">
          <ScrollReveal soft>
            <SectionHeading
              eyebrow="Questions"
              title="A few answers before you order."
              description="Only the details most shoppers ask about."
            />
          </ScrollReveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {faqs.map((item, index) => (
              <ScrollReveal key={item.question} delayMs={index * 70} direction="scale">
                <article className="surface-panel rounded-[1.8rem] p-6 sm:p-7">
                  <p className="signal-label">Question 0{index + 1}</p>
                  <h3 className="mt-4 font-display text-[2.1rem] leading-[0.92] text-[var(--color-ink)]">
                    {item.question}
                  </h3>
                  <p className="body-copy mt-3 text-sm leading-7">{item.answer}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

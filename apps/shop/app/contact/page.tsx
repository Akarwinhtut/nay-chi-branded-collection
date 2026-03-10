import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { SectionHeading } from "@/components/section-heading";
import { getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { contactMethods, faqs, formatPrice, profile, visitDetails } from "@/lib/site-data";

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
  const emailAddress = email?.href.replace("mailto:", "") ?? "";
  const selectedProductMailto =
    selectedProduct && emailAddress
      ? `mailto:${emailAddress}?subject=${encodeURIComponent(
          `Question about ${selectedProduct.name}`,
        )}&body=${encodeURIComponent(
          `Hello ${profile.name}, I would like to ask about ${selectedProduct.name}. Please share the next step and current availability.`,
        )}`
      : email?.href;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:gap-20">
      <PageIntro
        eyebrow={selectedProduct ? "Selected bag" : "Contact"}
        title={selectedProduct ? `Ask about ${selectedProduct.name}.` : "Talk to the store."}
        description={
          selectedProduct
            ? "If you want more photos, current availability, or the next step, Telegram is still the quickest route. Email and the map are here when that feels easier."
            : "Telegram is the fastest way to ask about a bag. Email stays available for longer notes, and the map is here when you want to visit in person."
        }
        detail={
          selectedProduct
            ? "Mention the bag name when you message and the store can continue from there."
            : "Most shoppers only need a short message, store hours, and the address."
        }
        stats={
          selectedProduct
            ? [
                { label: "Price", value: formatPrice(selectedProduct.price) },
                { label: "Collection", value: selectedProduct.collection },
              ]
            : [
                { label: "Fastest reply", value: "Telegram" },
                { label: "Store hours", value: visitDetails[1]?.value ?? "" },
              ]
        }
        action={
          selectedProduct ? (
            <>
              <Link href={`/services/${selectedProduct.slug}`} className="ghost-button">
                Back to bag
              </Link>
              {telegram ? (
                <a href={telegram.href} className="cta-button">
                  Open Telegram
                </a>
              ) : null}
            </>
          ) : undefined
        }
      />

      {selectedProduct ? (
        <section className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="rounded-[2.4rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(246,238,228,0.94))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.05)] sm:p-5">
            <div
              className="editorial-photo min-h-[24rem] sm:min-h-[32rem]"
              style={{
                backgroundImage: `url(${selectedProduct.image.src})`,
                backgroundPosition: selectedProduct.image.position ?? "center center",
              }}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="signal-label">The piece you selected</p>
              <h2 className="font-display text-[3rem] leading-[0.94] text-[var(--color-ink)] sm:text-[4rem]">
                {selectedProduct.name}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[rgba(29,29,31,0.64)]">
                {selectedProduct.shortDescription} If you want to continue, the store can confirm
                color availability, stock, and the next step directly in the message.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {telegram ? (
                <a href={telegram.href} className="signal-card rounded-[1.8rem] p-5">
                  <p className="signal-label">Fastest reply</p>
                  <h3 className="mt-3 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
                    Telegram
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[rgba(29,29,31,0.64)]">
                    Mention {selectedProduct.name} and ask for the current stock.
                  </p>
                </a>
              ) : null}

              {selectedProductMailto ? (
                <a href={selectedProductMailto} className="signal-card rounded-[1.8rem] p-5">
                  <p className="signal-label">Longer note</p>
                  <h3 className="mt-3 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
                    Email
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[rgba(29,29,31,0.64)]">
                    Use email if you want to ask in more detail before visiting.
                  </p>
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {telegram ? (
          <a href={telegram.href} className="signal-card rounded-[1.8rem] p-5 sm:p-6">
            <p className="signal-label">Fastest reply</p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
              Telegram
            </h2>
            <p className="mt-3 text-sm leading-7 text-[rgba(29,29,31,0.64)]">
              {telegram.note ?? telegram.displayValue}
            </p>
          </a>
        ) : null}

        {email ? (
          <a href={email.href} className="signal-card rounded-[1.8rem] p-5 sm:p-6">
            <p className="signal-label">Longer note</p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
              Email
            </h2>
            <p className="mt-3 text-sm leading-7 text-[rgba(29,29,31,0.64)]">
              {email.note ?? email.displayValue}
            </p>
          </a>
        ) : null}

        {map ? (
          <a href={map.href} className="signal-card rounded-[1.8rem] p-5 sm:p-6">
            <p className="signal-label">Store visit</p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
              Google Maps
            </h2>
            <p className="mt-3 text-sm leading-7 text-[rgba(29,29,31,0.64)]">
              {map.note ?? map.displayValue}
            </p>
          </a>
        ) : null}
      </section>

      <section className="grid gap-8 border-t border-[var(--color-line)] pt-8 lg:grid-cols-[0.4fr_0.6fr]">
        <SectionHeading
          eyebrow="Visit notes"
          title="Only the details most shoppers ask for."
          description="Opening hours, response rhythm, and the store address stay here in one quiet place."
        />

        <div className="grid gap-0 border-y border-[var(--color-line)]">
          {visitDetails.map((detail) => (
            <article
              key={detail.label}
              className="grid gap-3 border-b border-[var(--color-line)] py-5 last:border-b-0 sm:grid-cols-[0.34fr_0.66fr] sm:items-start sm:gap-6"
            >
              <p className="signal-label">{detail.label}</p>
              <div className="space-y-2">
                <p className="text-lg font-semibold leading-7 text-[var(--color-ink)]">
                  {detail.value}
                </p>
                <p className="text-sm leading-7 text-[rgba(29,29,31,0.62)]">{detail.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Questions"
          title="A few details before you visit."
          description="Only the basics most people ask about."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {faqs.map((item, index) => (
            <article key={item.question} className="surface-panel rounded-[1.8rem] p-6 sm:p-7">
              <p className="signal-label">Question 0{index + 1}</p>
              <h3 className="mt-4 font-display text-[2rem] leading-[0.94] text-[var(--color-ink)]">
                {item.question}
              </h3>
              <p className="body-copy mt-3 text-sm leading-7">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

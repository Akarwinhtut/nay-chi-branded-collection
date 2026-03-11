import Link from "next/link";

import { PageIntro } from "@/components/page-intro";
import { ProductImage } from "@/components/product-image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { buildMetadata } from "@/lib/metadata";
import { contactMethods, profile, storePhoto, visitDetails } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Store",
  description:
    "Learn about Nay Chi Branded Collection, a quieter bag store in Yangon with a calm online storefront.",
  pathname: "/about",
});

export default function StoryPage() {
  const contactLinks = contactMethods.filter((contact) => contact.label !== "Map");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:gap-20">
      <PageIntro
        eyebrow="Store"
        title="A quieter way to browse branded bags in Yangon."
        description={profile.bio}
        detail="The store stays warm and direct: a smaller edit, visible prices, and the freedom to browse without pressure."
        stats={visitDetails.slice(0, 2).map((detail) => ({
          label: detail.label,
          value: detail.value,
        }))}
      />

      <section className="grid gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:items-start">
        <ScrollReveal direction="right" editorial>
          <div className="rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(246,238,228,0.94))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.05)] sm:p-5">
            <ProductImage
              src={storePhoto.src}
              alt={storePhoto.alt}
              position={storePhoto.position}
              className="min-h-[28rem] sm:min-h-[36rem] lg:min-h-[42rem]"
              sizes="(max-width: 1024px) 100vw, 44vw"
              priority
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="space-y-8" direction="left" soft editorial>
          <div className="grid gap-0 border-y border-[var(--color-line)]">
            {visitDetails.slice(0, 4).map((detail) => (
              <article
                key={detail.label}
                className="grid gap-3 border-b border-[var(--color-line)] py-5 last:border-b-0 sm:grid-cols-[0.32fr_0.68fr] sm:items-start sm:gap-6"
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

          <div className="space-y-4">
            <p className="signal-label">Store contact</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[rgba(29,29,31,0.68)]">
              {contactLinks.map((contact) => (
                <a key={contact.label} href={contact.href} className="footer-link text-[var(--color-ink)]">
                  {contact.label}: {contact.displayValue}
                </a>
              ))}
            </div>
            <Link href="/contact" className="quiet-link">
              <span className="signal-label !text-[rgba(94,67,39,0.7)]">Talk to the store</span>
              <span className="text-sm text-[rgba(29,29,31,0.58)]">Open contact details and map</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

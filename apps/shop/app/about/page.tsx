import { ScrollReveal } from "@/components/scroll-reveal";
import { getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { contactMethods, profile, visitDetails } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Store",
  description:
    "Learn about Nay Chi Branded Collection, a quieter bag store in Yangon with a calm online storefront.",
  pathname: "/about",
});

export default async function StoryPage() {
  const products = await getPublicCatalogProducts();
  const imageProduct = products[0];
  const contactLinks = contactMethods.filter((contact) => contact.label !== "Map");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 lg:gap-20">
      <section className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <ScrollReveal direction="right">
          <div className="rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(246,238,228,0.94))] p-4 shadow-[0_26px_64px_rgba(53,38,24,0.05)] sm:p-5">
            <div
              className="editorial-photo min-h-[30rem] sm:min-h-[38rem] lg:min-h-[44rem]"
              style={{
                backgroundImage: imageProduct ? `url(${imageProduct.image.src})` : undefined,
                backgroundPosition: imageProduct?.image.position ?? "center center",
              }}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="space-y-6" direction="left" soft>
          <div className="space-y-5">
            <p className="eyebrow">Store</p>
            <h1 className="font-display text-[4rem] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[5.6rem]">
              A quieter way to browse branded bags in Yangon.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[rgba(29,29,31,0.66)] sm:text-lg">
              {profile.bio}
            </p>
          </div>

          <div className="grid gap-0 border-y border-[var(--color-line)]">
            {visitDetails.slice(0, 4).map((detail) => (
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

          <div className="space-y-3 border-t border-[var(--color-line)] pt-5">
            <p className="signal-label">Store contact</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[rgba(29,29,31,0.68)]">
              {contactLinks.map((contact) => (
                <a key={contact.label} href={contact.href} className="footer-link text-[var(--color-ink)]">
                  {contact.label}: {contact.displayValue}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

import Link from "next/link";

import { contactMethods, navigation, visitDetails } from "@/lib/site-data";

const footerNavigation = [
  ...navigation,
  { label: "Contact", href: "/contact" },
  { label: "Policies", href: "/policies" },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-24">
      <div className="mx-auto max-w-7xl border-t border-[var(--color-line)] px-1 pt-8 sm:px-0 sm:pt-10">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-4">
            <p className="eyebrow">Nay Chi Branded Collection</p>
            <h2 className="font-display max-w-xl text-[2rem] font-medium leading-[0.96] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3.5rem]">
              A quieter gallery of branded bags in Yangon.
            </h2>
            <p className="max-w-lg text-sm leading-7 text-[rgba(29,29,31,0.62)] sm:text-base">
              Clear prices, calm photography, and store details that stay easy to reach without
              pulling attention away from the collection.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="signal-label">Navigate</p>
              <ul className="space-y-2">
                {footerNavigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="footer-link text-sm text-[rgba(29,29,31,0.66)]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="signal-label">Store</p>
              <ul className="space-y-2 text-sm text-[rgba(29,29,31,0.66)]">
                <li>{visitDetails[0]?.value}</li>
                <li>{visitDetails[1]?.value}</li>
                {contactMethods.slice(0, 2).map((contact) => (
                  <li key={contact.label}>
                    <a href={contact.href} className="footer-link">
                      {contact.displayValue}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

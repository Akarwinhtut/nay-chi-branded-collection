import Link from "next/link";

import { contactMethods, navigation, profile, visitDetails } from "@/lib/site-data";

const footerNavigation = [...navigation, { label: "Policies", href: "/policies" }];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-20 sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-[var(--color-line)] px-2 pt-8 sm:px-0 sm:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">{profile.name}</p>
            <h2 className="font-display max-w-2xl text-[3rem] font-medium leading-[0.94] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[4rem]">
              {profile.tagline}
            </h2>
            <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.64)]">
              A quieter online storefront for branded bags, shaped more like a gallery than a sales
              pitch.
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

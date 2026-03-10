"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigation, profile } from "@/lib/site-data";

const mobileLinks = [...navigation, { label: "Policies", href: "/policies" }];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`mx-auto max-w-6xl rounded-[1.7rem] border px-4 py-3 transition-[background-color,box-shadow] duration-300 md:px-6 ${
          scrolled
            ? "border-[var(--color-line)] bg-[rgba(255,251,246,0.86)] shadow-[0_20px_48px_rgba(53,38,24,0.05)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
            <span className="block truncate text-[1.15rem] font-semibold tracking-[-0.045em] text-[var(--color-ink)] sm:text-[1.35rem]">
              {profile.name}
            </span>
            <span className="mt-1 block text-[11px] tracking-[0.06em] text-[rgba(94,67,39,0.54)]">
              Branded bags in Yangon
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex min-w-[4.5rem] items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-sm font-semibold transition-colors duration-200 ${
                  isActive(item.href)
                    ? "nav-link--active text-[var(--color-ink)]"
                    : "text-[rgba(29,29,31,0.58)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {menuOpen ? (
          <nav className="mt-4 grid gap-2 border-t border-[var(--color-line)] pt-4 md:hidden">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`menu-link rounded-[1.2rem] border px-4 py-3 text-sm font-semibold ${
                  isActive(item.href)
                    ? "border-[var(--color-line-strong)] bg-white text-[var(--color-ink)]"
                    : "border-[var(--color-line)] bg-[rgba(255,255,255,0.8)] text-[rgba(29,29,31,0.72)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

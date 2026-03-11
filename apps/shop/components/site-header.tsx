"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { profile } from "@/lib/site-data";

const primaryLinks = [
  { label: "New in", href: "/#new-arrivals" },
  { label: "Store", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileLinks = [
  { label: "New arrivals", href: "/#new-arrivals" },
  { label: "Bags", href: "/services" },
  { label: "Store", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Policies", href: "/policies" },
];

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

    if (href.startsWith("/#")) {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <div
        className={`mx-auto max-w-7xl rounded-[1.9rem] border px-4 py-3.5 transition-[background-color,box-shadow,border-color] duration-300 md:px-6 ${
          scrolled
            ? "border-[var(--color-line)] bg-[rgba(251,247,241,0.88)] shadow-[0_18px_48px_rgba(53,38,24,0.05)] backdrop-blur-xl"
            : "border-[rgba(255,255,255,0.58)] bg-[rgba(251,247,241,0.58)] backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0" onClick={() => setMenuOpen(false)}>
            <span className="block truncate text-[1.1rem] font-semibold tracking-[-0.045em] text-[var(--color-ink)] sm:text-[1.28rem]">
              {profile.name}
            </span>
            <span className="mt-1 block text-[11px] tracking-[0.06em] text-[rgba(94,67,39,0.54)]">
              Branded bags in Yangon
            </span>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/services"
              className="inline-flex min-h-[2.9rem] items-center justify-center rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.88)] px-4 text-sm font-semibold text-[var(--color-ink)] shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
            >
              Bags
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex min-h-[2.9rem] min-w-[4.6rem] items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-4 text-sm font-semibold text-[var(--color-ink)]"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <nav className="flex items-center gap-2">
              {primaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-h-[2.9rem] items-center rounded-full px-4 text-sm font-semibold transition-[background-color,color,box-shadow] duration-200 ${
                    isActive(item.href)
                      ? "bg-[rgba(255,255,255,0.84)] text-[var(--color-ink)] shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                      : "text-[rgba(29,29,31,0.58)] hover:bg-[rgba(255,255,255,0.64)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/services"
              className={`inline-flex min-h-[2.9rem] items-center justify-center rounded-full border px-5 text-sm font-semibold text-[var(--color-ink)] whitespace-nowrap transition-[background-color,color,box-shadow,border-color] duration-200 ${
                pathname.startsWith("/services")
                  ? "border-[var(--color-line-strong)] bg-white shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                  : "border-[var(--color-line)] bg-[rgba(255,255,255,0.86)] shadow-[0_12px_28px_rgba(53,38,24,0.05)] hover:border-[var(--color-line-strong)] hover:bg-white"
              }`}
            >
              Bags
            </Link>
          </div>
        </div>

        {menuOpen ? (
          <div className="mt-4 grid gap-3 border-t border-[var(--color-line)] pt-4 md:hidden">
            <Link
              href="/services"
              onClick={() => setMenuOpen(false)}
              className="menu-link rounded-[1.35rem] bg-[var(--color-ink)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(53,38,24,0.08)]"
            >
              Shop all bags
            </Link>

            <nav className="grid gap-2">
              {mobileLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`menu-link rounded-[1.35rem] border px-4 py-3 text-sm font-semibold ${
                    isActive(item.href)
                      ? "border-[var(--color-line-strong)] bg-white text-[var(--color-ink)] shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                      : "border-[var(--color-line)] bg-[rgba(255,255,255,0.74)] text-[rgba(29,29,31,0.72)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

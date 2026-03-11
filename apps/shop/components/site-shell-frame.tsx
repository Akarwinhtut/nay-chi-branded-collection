"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { RouteScrollReset } from "@/components/route-scroll-reset";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellFrameProps = {
  children: React.ReactNode;
};

export function SiteShellFrame({ children }: SiteShellFrameProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="relative isolate min-h-screen bg-[linear-gradient(180deg,#f5f0e8_0%,#f8f4ee_100%)]">
        <Suspense fallback={null}>
          <RouteScrollReset />
        </Suspense>
        <div className="px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.68)] px-4 py-3 text-sm text-[rgba(29,29,31,0.62)] shadow-[0_16px_34px_rgba(32,24,20,0.04)] backdrop-blur">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Nay Chi Branded Collection
              </p>
              <p className="text-xs uppercase tracking-[0.16em] text-[rgba(94,67,39,0.56)]">
                Owner area
              </p>
            </div>
            <Link href="/" className="ghost-button">
              View storefront
            </Link>
          </div>
        </div>
        <main className="px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 lg:pt-10">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen">
      <Suspense fallback={null}>
        <RouteScrollReset />
      </Suspense>
      <SiteHeader />
      <main className="px-4 pb-20 pt-5 sm:px-6 sm:pb-24 sm:pt-7 lg:px-8 lg:pt-9">{children}</main>
      <SiteFooter />
    </div>
  );
}

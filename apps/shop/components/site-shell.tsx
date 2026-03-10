import { Suspense } from "react";

import { RouteScrollReset } from "@/components/route-scroll-reset";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="relative isolate min-h-screen">
      <Suspense fallback={null}>
        <RouteScrollReset />
      </Suspense>
      <SiteHeader />
      <main className="px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:pt-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

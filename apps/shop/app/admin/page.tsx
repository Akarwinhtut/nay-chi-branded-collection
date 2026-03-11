import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CatalogAdmin } from "@/components/catalog-admin";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  adminSessionCookieName,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import { buildMetadata } from "@/lib/metadata";
import { getAdminCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Catalog Admin",
    description:
      "Owner-side catalog management for Nay Chi Branded Collection products, variants, and stock.",
    pathname: "/admin",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();

  if (!isAdminSessionValid(cookieStore.get(adminSessionCookieName)?.value)) {
    redirect("/admin/login?next=/admin");
  }

  const { products, storageReady, storageMode } = await getAdminCatalogProducts();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:gap-16">
      <section className="space-y-6">
        <ScrollReveal soft>
          <SectionHeading
            eyebrow="Owner tools"
            title="Add and update bags."
            description="Create a bag, update colors and sizes, and adjust stock from one place."
            action={
              <form action="/api/admin/logout" method="post">
                <button type="submit" className="ghost-button">
                  Log out
                </button>
              </form>
            }
          />
        </ScrollReveal>
      </section>

      <ScrollReveal direction="scale">
        <CatalogAdmin
          initialProducts={products}
          storageReady={storageReady}
          storageMode={storageMode}
        />
      </ScrollReveal>
    </div>
  );
}

import Link from "next/link";

import { CollectionCatalog } from "@/components/collection-catalog";
import { PageIntro } from "@/components/page-intro";
import { getPublicCatalogProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Bags",
  description:
    "Browse the full Nay Chi Branded Collection catalog with clear prices and quiet product pages.",
  pathname: "/services",
});

export default async function CollectionPage() {
  const products = await getPublicCatalogProducts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 sm:gap-16 lg:gap-20">
      <PageIntro
        eyebrow="Collection"
        title="The full collection."
        description="Every bag stays on the same level. Use the category filter only if it helps; otherwise, the whole edit is here in one calm view."
        detail="The collection page stays closer to a gallery wall than a product listing."
        stats={[
          { label: "Pieces", value: `${products.length} currently in the edit` },
          { label: "Browse", value: "Category filters stay optional" },
        ]}
        action={
          <Link href="/" className="quiet-link">
            <span className="signal-label !text-[rgba(94,67,39,0.7)]">Back to home</span>
            <span className="text-sm text-[rgba(29,29,31,0.58)]">Return to the main gallery</span>
          </Link>
        }
      />

      <CollectionCatalog products={products} />
    </div>
  );
}

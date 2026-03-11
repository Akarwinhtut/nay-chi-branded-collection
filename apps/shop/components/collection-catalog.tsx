"use client";

import { useState } from "react";

import type { CatalogProduct } from "@/lib/catalog-shared";

import { ProductTile } from "./product-tile";

type CollectionCatalogProps = {
  products: CatalogProduct[];
  initialCategory?: string;
};

export function CollectionCatalog({
  products,
  initialCategory = "All",
}: CollectionCatalogProps) {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const [activeCategory, setActiveCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All",
  );

  const filteredProducts = products.filter((product) => {
    return activeCategory === "All" || product.category === activeCategory;
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 border-y border-[var(--color-line)] py-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`shrink-0 rounded-full border px-4 py-3 text-sm font-semibold transition-[border-color,background-color,color,box-shadow] duration-200 ${
                activeCategory === category
                  ? "border-[var(--color-line-strong)] bg-white text-[var(--color-ink)] shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                  : "border-[var(--color-line)] bg-[rgba(255,255,255,0.5)] text-[rgba(29,29,31,0.6)] hover:bg-[rgba(255,255,255,0.78)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="text-sm text-[rgba(29,29,31,0.56)] sm:text-right">
          {filteredProducts.length} pieces in view
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[2rem] p-8 text-center">
          <p className="eyebrow">Nothing in this view</p>
          <h3 className="mt-4 font-display text-[2.5rem] font-medium leading-[0.96] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3rem]">
            Return to the full edit to see every piece.
          </h3>
          <p className="mt-3 text-base leading-8 text-[rgba(29,29,31,0.64)]">
            The full set is still available under &quot;All&quot;.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import type { CatalogProduct } from "@/lib/catalog";

import { ProductTile } from "./product-tile";

type CollectionCatalogProps = {
  products: CatalogProduct[];
};

export function CollectionCatalog({ products }: CollectionCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filteredProducts = products.filter((product) => {
    return activeCategory === "All" || product.category === activeCategory;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-full border px-4 py-3 text-sm font-semibold transition-[border-color,background-color,color] duration-200 ${
              activeCategory === category
                ? "border-[var(--color-line-strong)] bg-white text-[var(--color-ink)]"
                : "border-[var(--color-line)] bg-[rgba(255,255,255,0.62)] text-[rgba(29,29,31,0.6)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-[rgba(29,29,31,0.56)]">
        {filteredProducts.length} pieces in view
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[2rem] p-8 text-center">
          <p className="eyebrow">Nothing in this view</p>
          <h3 className="mt-4 text-[2.5rem] font-semibold leading-[1] tracking-[-0.05em] text-[var(--color-ink)] sm:text-[3rem]">
            Switch categories to see more of the collection.
          </h3>
          <p className="mt-3 text-base leading-8 text-[rgba(29,29,31,0.64)]">
            The full set is still available under &quot;All&quot;.
          </p>
        </div>
      )}
    </div>
  );
}

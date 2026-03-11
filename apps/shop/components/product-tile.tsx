"use client";

import Link from "next/link";
import { useState } from "react";

import type { CatalogProduct } from "@/lib/catalog-shared";
import { getCatalogProductDisplayPrice } from "@/lib/catalog-shared";
import { toggleWishlistSlug, useWishlistSlugs } from "@/lib/catalog-browser-state";
import { formatPrice } from "@/lib/site-data";

import { ProductImage } from "./product-image";
import { ProductQuickPreview } from "./product-quick-preview";

type ProductTileProps = {
  product: CatalogProduct;
  className?: string;
  imageClassName?: string;
  showQuickPreview?: boolean;
  showWishlistButton?: boolean;
};

export function ProductTile({
  product,
  className = "",
  imageClassName = "min-h-[23rem] sm:min-h-[29rem]",
  showQuickPreview = false,
  showWishlistButton = false,
}: ProductTileProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const wishlistSlugs = useWishlistSlugs();
  const saved = wishlistSlugs.includes(product.slug);
  const displayPrice = getCatalogProductDisplayPrice(product);

  return (
    <div className={`group relative ${className}`}>
      {showQuickPreview ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setPreviewOpen(true);
          }}
          aria-haspopup="dialog"
          aria-label={`Quick preview ${product.name}`}
          className="absolute left-5 top-5 z-10 inline-flex min-h-[2.5rem] items-center justify-center rounded-full border border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.82)] px-4 text-sm font-semibold text-[var(--color-ink)] backdrop-blur-md transition-[opacity,transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        >
          Quick preview
        </button>
      ) : null}

      {showWishlistButton ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlistSlug(product.slug);
          }}
          className={`absolute right-5 top-5 z-10 inline-flex min-h-[2.5rem] items-center justify-center rounded-full border px-4 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 ${
            saved
              ? "border-[rgba(23,20,18,0.08)] bg-[rgba(23,20,18,0.92)] text-white shadow-[0_16px_34px_rgba(17,17,17,0.12)]"
              : "border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.82)] text-[var(--color-ink)] backdrop-blur-md hover:-translate-y-0.5"
          }`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from saved bags` : `Save ${product.name}`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      ) : null}

      <Link href={`/services/${product.slug}`} className="block">
        <article className="space-y-4 sm:space-y-5 transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="rounded-[2.25rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.84),rgba(246,238,228,0.92))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.04)] transition-[box-shadow,border-color] duration-300 group-hover:border-[var(--color-line-strong)] group-hover:shadow-[0_30px_72px_rgba(53,38,24,0.07)] sm:p-5">
            <ProductImage
              src={product.image.src}
              alt={product.image.alt}
              position={product.image.position}
              className={`${imageClassName} transition-transform duration-500 group-hover:scale-[1.01]`}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>

          <div className="space-y-3 px-1 sm:space-y-4">
            <p className="signal-label">
              {product.collection} / {product.category}
            </p>

            <div className="grid gap-3 border-t border-[var(--color-line)] pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <h3 className="font-display text-[2.05rem] font-medium leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[2.95rem]">
                {product.name}
              </h3>

              <p className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)] sm:pb-1">
                {formatPrice(displayPrice)}
              </p>
            </div>
          </div>
        </article>
      </Link>

      {showQuickPreview && previewOpen ? (
        <ProductQuickPreview product={product} onClose={() => setPreviewOpen(false)} />
      ) : null}
    </div>
  );
}

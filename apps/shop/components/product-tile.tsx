import Link from "next/link";

import type { CatalogProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/site-data";

type ProductTileProps = {
  product: CatalogProduct;
  className?: string;
  imageClassName?: string;
};

export function ProductTile({
  product,
  className = "",
  imageClassName = "min-h-[27rem] sm:min-h-[31rem]",
}: ProductTileProps) {
  return (
    <Link href={`/services/${product.slug}`} className={`group block ${className}`}>
      <article className="space-y-4 sm:space-y-6 transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="rounded-[2.35rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.88),rgba(246,238,228,0.94))] p-4 shadow-[0_26px_64px_rgba(53,38,24,0.05)] transition-[box-shadow,border-color] duration-300 group-hover:border-[var(--color-line-strong)] group-hover:shadow-[0_34px_78px_rgba(53,38,24,0.08)] sm:p-5">
          <div
            className={`editorial-photo ${imageClassName}`}
            style={{
              backgroundImage: `url(${product.image.src})`,
              backgroundPosition: product.image.position ?? "center center",
            }}
          />
        </div>

        <div className="space-y-4 px-1 sm:space-y-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgba(94,67,39,0.58)]">
            {product.collection} / {product.category}
          </p>

          <div className="grid gap-3 border-t border-[var(--color-line)] pt-3 sm:grid-cols-[1fr_auto] sm:items-end sm:pt-4">
            <h3 className="font-display text-[2.2rem] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3.2rem]">
              {product.name}
            </h3>

            <p className="text-sm font-semibold tracking-[0.03em] text-[var(--color-accent-strong)] sm:pb-1 sm:text-base">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

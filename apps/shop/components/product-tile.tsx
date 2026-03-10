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
  imageClassName = "min-h-[23rem] sm:min-h-[29rem]",
}: ProductTileProps) {
  return (
    <a href={`/services/${product.slug}`} className={`group block ${className}`}>
      <article className="space-y-4 sm:space-y-5 transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="rounded-[2.25rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.84),rgba(246,238,228,0.92))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.04)] transition-[box-shadow,border-color] duration-300 group-hover:border-[var(--color-line-strong)] group-hover:shadow-[0_30px_72px_rgba(53,38,24,0.07)] sm:p-5">
          <div
            className={`editorial-photo transition-transform duration-500 group-hover:scale-[1.01] ${imageClassName}`}
            style={{
              backgroundImage: `url(${product.image.src})`,
              backgroundPosition: product.image.position ?? "center center",
            }}
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
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </article>
    </a>
  );
}

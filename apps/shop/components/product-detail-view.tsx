"use client";

import Link from "next/link";
import { useState } from "react";

import type { CatalogProduct } from "@/lib/catalog-shared";
import {
  getCatalogProductCompareAtPrice,
  getCatalogProductDisplayPrice,
  getCatalogProductInventory,
} from "@/lib/catalog-shared";
import {
  contactMethods,
  formatPrice,
  getProductTotalStock,
  getVariantTotalStock,
  visitDetails,
} from "@/lib/site-data";

import { ProductImage } from "./product-image";
import { ProductTile } from "./product-tile";
import { SectionHeading } from "./section-heading";

type ProductDetailViewProps = {
  product: CatalogProduct;
  relatedProducts: CatalogProduct[];
};

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color ?? "");
  const activeVariant =
    product.variants.find((variant) => variant.color === selectedColor) ?? product.variants[0];
  const activeImage = activeVariant?.image ?? product.image;
  const totalStock = getProductTotalStock(product);
  const inventory = getCatalogProductInventory(product);
  const compareAtPrice = getCatalogProductCompareAtPrice(product);
  const telegram = contactMethods.find((contact) => contact.label === "Telegram");
  const email = contactMethods.find((contact) => contact.label === "Email");
  const facts = [
    { label: "Category", value: product.category },
    { label: "Material", value: product.material },
    { label: "Availability", value: inventory.status.replace("_", " ") },
  ];

  return (
    <div className="space-y-16 lg:space-y-20">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[rgba(29,29,31,0.56)]">
          <Link href="/" className="footer-link hover:text-[var(--color-ink)]">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="footer-link hover:text-[var(--color-ink)]">
            Bags
          </Link>
          <span>/</span>
          <span className="text-[var(--color-ink)]">{product.name}</span>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.5fr_0.5fr] lg:items-start">
        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82),rgba(246,238,228,0.94))] p-4 shadow-[0_24px_56px_rgba(53,38,24,0.05)] sm:p-5">
            <ProductImage
              src={activeImage.src}
              alt={activeImage.alt}
              position={activeImage.position}
              className="min-h-[30rem] sm:min-h-[42rem]"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <article
                key={fact.label}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.46)] px-4 py-4"
              >
                <p className="signal-label">{fact.label}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{fact.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="eyebrow">
              {product.collection} / {product.category}
            </p>
            <h1 className="font-display text-[4rem] font-medium leading-[0.88] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[5.4rem]">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-[1.8rem] font-semibold leading-[1] tracking-[0.01em] text-[var(--color-accent-strong)] sm:text-[2.15rem]">
                {formatPrice(getCatalogProductDisplayPrice(product))}
              </p>
              {compareAtPrice ? (
                <p className="pb-1 text-base leading-7 text-[rgba(29,29,31,0.42)] line-through">
                  {formatPrice(compareAtPrice)}
                </p>
              ) : null}
              <span className="inventory-pill">{totalStock} pieces in store</span>
            </div>
            <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.68)] sm:text-lg">
              {product.shortDescription}
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--color-line)] bg-[rgba(255,251,246,0.58)] p-5 sm:p-6">
            <p className="signal-label">Available colors</p>
            <div className="mt-4 grid gap-3">
              {product.variants.map((variant) => {
                const active = variant.color === activeVariant?.color;

                return (
                  <button
                    key={variant.color}
                    type="button"
                    onClick={() => setSelectedColor(variant.color)}
                    className={`w-full rounded-[1.45rem] border px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
                      active
                        ? "border-[var(--color-line-strong)] bg-white shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                        : "border-[var(--color-line)] bg-[rgba(255,255,255,0.48)] hover:border-[var(--color-line-strong)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full border border-[rgba(29,29,31,0.12)]"
                          style={{ backgroundColor: variant.swatch }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            {variant.color}
                          </p>
                          <p className="text-sm text-[rgba(29,29,31,0.56)]">{variant.finish}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        {getVariantTotalStock(variant)} in store
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {variant.sizes.map((size) => (
                        <span key={`${variant.color}-${size.label}`} className="inventory-pill">
                          {size.label} / {size.stock}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 border-t border-[var(--color-line)] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-3">
              <p className="signal-label">Product note</p>
              <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.68)]">
                {product.description} {product.detail} Available at {visitDetails[0]?.value}.{" "}
                {visitDetails[1]?.value}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-[rgba(29,29,31,0.62)]">
              {telegram ? (
                <a href={telegram.href} className="ghost-button">
                  Telegram
                </a>
              ) : null}
              {email ? (
                <a href={email.href} className="ghost-button">
                  Email
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-8">
          <SectionHeading
            eyebrow="More from the collection"
            title="More bags to compare."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductTile
                key={related.slug}
                product={related}
                imageClassName="min-h-[21rem]"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

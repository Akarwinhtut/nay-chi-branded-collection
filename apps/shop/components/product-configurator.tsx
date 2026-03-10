"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type { CatalogProduct } from "@/lib/catalog";
import {
  contactMethods,
  formatPrice,
  getProductTotalStock,
  getVariantTotalStock,
  profile,
} from "@/lib/site-data";

type ProductConfiguratorProps = {
  products: CatalogProduct[];
  anchorId?: string;
  compact?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  initialProductSlug?: string;
  streamlined?: boolean;
  lockInitialProduct?: boolean;
};

export function ProductConfigurator({
  products,
  anchorId,
  compact = false,
  eyebrow = "Order note",
  title = "Choose the piece, then the finish.",
  description = "A few details, then one short message to the store.",
  initialProductSlug,
  streamlined = false,
  lockInitialProduct = false,
}: ProductConfiguratorProps) {
  const firstProduct =
    products.find((product) => product.slug === initialProductSlug) ?? products[0] ?? null;
  const [selectedProductSlug, setSelectedProductSlug] = useState(firstProduct?.slug ?? "");
  const [selectedColor, setSelectedColor] = useState(firstProduct?.variants[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState(firstProduct?.variants[0]?.sizes[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasLockedProduct = Boolean(
    lockInitialProduct && initialProductSlug && firstProduct?.slug === initialProductSlug,
  );
  const [showProductChooser, setShowProductChooser] = useState(!hasLockedProduct);
  const isFocusedOrderFlow = streamlined && hasLockedProduct;

  const email = contactMethods.find((contact) => contact.label === "Email");
  const telegram = contactMethods.find((contact) => contact.label === "Telegram");

  if (!firstProduct) {
    return (
      <section id={anchorId} className="surface-panel rounded-[2.4rem] p-5 sm:p-8 lg:p-10">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-[4.3rem]">
            {title}
          </h2>
          <p className="body-copy max-w-2xl text-base leading-8">{description}</p>
        </div>

        <div className="support-card mt-8 rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow !text-[rgba(255,249,241,0.72)]">No bags yet</p>
          <h3 className="mt-4 font-display text-[2.8rem] leading-[0.92] text-[var(--color-surface)] sm:text-[3.6rem]">
            Add the first bag to start the storefront.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[rgba(255,249,241,0.78)]">
            Open the catalog admin, create the first product, and the order flow will appear here
            automatically.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/admin" className="cta-button">
              Open catalog admin
            </Link>
            <Link
              href="/services"
              className="ghost-button border-[rgba(255,249,241,0.18)] bg-[rgba(255,249,241,0.08)] text-[var(--color-surface)]"
            >
              Open the shop layout
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeProduct =
    products.find((product) => product.slug === selectedProductSlug) ?? firstProduct;
  const activeVariant =
    activeProduct.variants.find((variant) => variant.color === selectedColor) ??
    activeProduct.variants[0];
  const activeSize =
    activeVariant?.sizes.find((size) => size.label === selectedSize) ??
    activeVariant?.sizes[0];

  const totalStock = getProductTotalStock(activeProduct);
  const variantStock = activeVariant ? getVariantTotalStock(activeVariant) : 0;
  const safeQuantity = activeSize
    ? Math.min(Math.max(quantity, 1), Math.max(activeSize.stock, 1))
    : quantity;
  const emailAddress = email?.href.replace("mailto:", "") ?? "";
  const requestMessage = activeSize
    ? `Hello ${profile.name}, I want to order ${safeQuantity} x ${activeProduct.name} in ${activeVariant?.color}, size ${activeSize.label}. Please confirm stock and the next step.`
    : `Hello ${profile.name}, I want to order ${safeQuantity} x ${activeProduct.name}. Please confirm stock and the next step.`;
  const mailtoHref = emailAddress
    ? `mailto:${emailAddress}?subject=${encodeURIComponent(`Order ${activeProduct.name}`)}&body=${encodeURIComponent(requestMessage)}`
    : "#";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(requestMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function selectProduct(nextSlug: string) {
    const nextProduct = products.find((product) => product.slug === nextSlug);

    if (!nextProduct) {
      return;
    }

    startTransition(() => {
      setSelectedProductSlug(nextProduct.slug);
      setSelectedColor(nextProduct.variants[0]?.color ?? "");
      setSelectedSize(nextProduct.variants[0]?.sizes[0]?.label ?? "");
      setQuantity(1);
    });
  }

  function updateQuantity(nextQuantity: number) {
    if (!activeSize) {
      return;
    }

    const cappedQuantity = Math.min(Math.max(nextQuantity, 1), Math.max(activeSize.stock, 1));
    setQuantity(cappedQuantity);
  }

  const productChooser = (
    <div className="space-y-3">
      <div className="choice-card rounded-[1.8rem] p-5">
        <p className="signal-label">Step 1</p>
        <h3 className="mt-3 font-display text-[2.2rem] leading-[0.94] text-[var(--color-ink)]">
          {isFocusedOrderFlow ? "Change the bag only if needed" : "Choose the bag first"}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.64)]">
          {isFocusedOrderFlow
            ? "The bag is already selected. Open the list only when the customer wants a different one."
            : "Start with the piece, then the rest of the order stays easy to follow."}
        </p>
      </div>

      {products.map((product) => {
        const productStock = getProductTotalStock(product);
        const active = product.slug === activeProduct.slug;

        return (
          <button
            key={product.slug}
            type="button"
            onClick={() => {
              selectProduct(product.slug);
              if (isFocusedOrderFlow) {
                setShowProductChooser(false);
              }
            }}
            className={`w-full rounded-[1.8rem] border p-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ${
              active
                ? "border-[rgba(32,24,20,0.18)] bg-[rgba(255,255,255,0.56)] shadow-[0_14px_30px_rgba(32,24,20,0.06)]"
                : "border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.24)] hover:-translate-y-0.5 hover:border-[rgba(32,24,20,0.14)] hover:bg-[rgba(255,255,255,0.36)]"
            }`}
          >
            <div className="flex gap-4">
              <div
                className="h-[6rem] w-[5rem] shrink-0 rounded-[1.3rem] border border-[rgba(32,24,20,0.08)] bg-cover bg-center shadow-[0_10px_22px_rgba(32,24,20,0.08)]"
                style={{
                  backgroundImage: `url(${product.image.src})`,
                  backgroundPosition: product.image.position ?? "center center",
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="signal-label">{product.collection}</p>
                    <h3 className="mt-2 font-display text-[2rem] leading-[0.92] text-[var(--color-ink)]">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-accent-strong)]">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[rgba(32,24,20,0.64)]">
                  {product.shortDescription}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inventory-pill">{product.category}</span>
                  <span className="inventory-pill">{productStock} ready</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const orderDetailsPanel = (
    <div className="surface-panel rounded-[1.9rem] p-5 sm:p-6">
      <p className="signal-label">Steps 2 and 3</p>
      <h3 className="mt-3 font-display text-[2.3rem] leading-[0.94] text-[var(--color-ink)]">
        Choose the finish and quantity.
      </h3>
      <p className="mt-3 text-sm leading-7 text-[rgba(32,24,20,0.62)]">
        Pick a color, then a size. The quantity control stays capped to live stock.
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="field-label">Color</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {activeProduct.variants.map((variant) => {
              const active = variant.color === activeVariant?.color;

              return (
                <button
                  key={variant.color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(variant.color);
                    setSelectedSize(variant.sizes[0]?.label ?? "");
                    setQuantity(1);
                  }}
                  aria-label={`Select ${variant.color}`}
                  className={`flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-300 ${
                    active
                      ? "border-[rgba(32,24,20,0.18)] bg-[rgba(255,255,255,0.58)] shadow-[0_12px_28px_rgba(32,24,20,0.06)]"
                      : "border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.24)] hover:border-[rgba(32,24,20,0.16)]"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-[rgba(32,24,20,0.12)]"
                    style={{ backgroundColor: variant.swatch }}
                  />
                  <span className="text-sm font-semibold text-[var(--color-ink)]">
                    {variant.color}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-6 text-[rgba(32,24,20,0.6)]">{activeVariant?.finish}</p>
        </div>

        <div className="grid gap-5 border-t border-[rgba(32,24,20,0.08)] pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="field-label">Size</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {activeVariant?.sizes.map((size) => {
                const active = size.label === activeSize?.label;

                return (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size.label);
                      setQuantity(1);
                    }}
                    className={`rounded-full border px-4 py-3 text-sm font-semibold transition-[border-color,background-color,box-shadow] duration-300 ${
                      active
                        ? "border-[rgba(32,24,20,0.18)] bg-[rgba(255,255,255,0.58)] text-[var(--color-ink)] shadow-[0_12px_28px_rgba(32,24,20,0.06)]"
                        : "border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.24)] text-[rgba(32,24,20,0.68)] hover:border-[rgba(32,24,20,0.16)]"
                    }`}
                  >
                    {size.label} / {size.stock} left
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="field-label">Quantity</p>
            <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.54)] px-3 py-2">
              <button
                type="button"
                onClick={() => updateQuantity(safeQuantity - 1)}
                aria-label="Decrease quantity"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.72)] text-lg text-[var(--color-ink)] transition-colors duration-300 hover:bg-[rgba(255,255,255,0.9)]"
              >
                -
              </button>
              <span className="min-w-[2rem] text-center text-lg font-semibold text-[var(--color-ink)]">
                {safeQuantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(safeQuantity + 1)}
                aria-label="Increase quantity"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.72)] text-lg text-[var(--color-ink)] transition-colors duration-300 hover:bg-[rgba(255,255,255,0.9)]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm leading-6 text-[rgba(32,24,20,0.62)]">
          {activeSize?.stock === 1
            ? "1 piece left in this size."
            : `${activeSize?.stock ?? 0} pieces ready in this size.`}{" "}
          {variantStock} ready in {activeVariant?.color}, {totalStock} total in this bag.
        </p>
      </div>
    </div>
  );

  const sendOrderPanel = (
    <div className="support-card rounded-[1.9rem] p-5 sm:p-6">
      <p className="eyebrow !text-[rgba(255,249,241,0.72)]">Step 4</p>
      <h3 className="mt-3 font-display text-[2.3rem] leading-[0.94] text-[var(--color-surface)]">
        Send this message.
      </h3>
      <p className="mt-3 text-sm leading-7 text-[rgba(255,249,241,0.76)]">
        If typing feels easier somewhere else, send the bag name or a screenshot on Telegram and
        the store will help from there.
      </p>

      <div className="mt-5 rounded-[1.5rem] border border-[rgba(255,249,241,0.14)] bg-[rgba(255,249,241,0.08)] p-4 text-sm leading-7 text-[rgba(255,249,241,0.9)]">
        {requestMessage}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button type="button" onClick={handleCopy} className="cta-button">
          {copied ? "Message copied" : "Copy message"}
        </button>
        {telegram ? (
          <a
            href={telegram.href}
            className="ghost-button border-[rgba(255,249,241,0.18)] bg-[rgba(255,249,241,0.08)] text-[var(--color-surface)]"
          >
            Open Telegram
          </a>
        ) : null}
        {emailAddress ? (
          <a
            href={mailtoHref}
            className="ghost-button border-[rgba(255,249,241,0.18)] bg-[rgba(255,249,241,0.08)] text-[var(--color-surface)]"
          >
            Email this message
          </a>
        ) : null}
      </div>
    </div>
  );

  const focusedBagSummary = (
    <div className="space-y-5">
      <div className="choice-card rounded-[2rem] p-5 sm:p-6">
        <p className="signal-label">Selected bag</p>
        <div className="mt-4 grid gap-4 md:grid-cols-[7.5rem_1fr] md:items-center">
          <div
            className="h-[10rem] rounded-[1.6rem] border border-[rgba(32,24,20,0.08)] bg-cover bg-center shadow-[0_12px_30px_rgba(32,24,20,0.08)]"
            style={{
              backgroundImage: `url(${activeVariant?.image.src ?? activeProduct.image.src})`,
              backgroundPosition:
                activeVariant?.image.position ?? activeProduct.image.position ?? "center center",
            }}
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inventory-pill">{activeProduct.collection}</span>
              <span className="inventory-pill">{activeProduct.category}</span>
            </div>
            <h3 className="font-display text-[2.5rem] leading-[0.92] text-[var(--color-ink)]">
              {activeProduct.name}
            </h3>
            <p className="text-sm leading-7 text-[rgba(32,24,20,0.66)]">
              {activeProduct.shortDescription}
            </p>
            <p className="text-sm font-semibold text-[var(--color-accent-strong)]">
              {formatPrice(activeProduct.price)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={`/services/${activeProduct.slug}`} className="ghost-button">
            Back to bag
          </Link>
          <button
            type="button"
            onClick={() => setShowProductChooser((current) => !current)}
            className="ghost-button"
          >
            {showProductChooser ? "Hide bag list" : "Change bag"}
          </button>
        </div>
      </div>

      {showProductChooser ? productChooser : null}
    </div>
  );

  const generalProductPreview = (
    <div className="support-card rounded-[2.2rem] p-4 sm:p-5">
      <div
        className="editorial-photo min-h-[24rem] border-[rgba(255,249,241,0.14)] shadow-[0_24px_56px_rgba(32,24,20,0.18)] sm:min-h-[32rem]"
        style={{
          backgroundImage: activeVariant ? `url(${activeVariant.image.src})` : undefined,
          backgroundPosition: activeVariant?.image.position ?? "center center",
        }}
      >
        <div className="flex h-full items-end p-5 sm:p-7">
          <div className="max-w-md rounded-[1.6rem] border border-[rgba(255,249,241,0.14)] bg-[rgba(37,29,24,0.52)] p-5 text-[var(--color-surface)] backdrop-blur-md">
            <p className="eyebrow !text-[rgba(255,249,241,0.72)]">{activeVariant?.color}</p>
            <h3 className="mt-2 font-display text-[2.7rem] leading-[0.92] text-[var(--color-surface)]">
              {activeProduct.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[rgba(255,249,241,0.74)]">
              {activeProduct.shortDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="status-pill">{activeProduct.collection}</span>
          <span className="status-pill">{activeProduct.category}</span>
        </div>
        <p className="text-sm font-semibold text-[var(--color-surface)]">
          {formatPrice(activeProduct.price)}
        </p>
      </div>
    </div>
  );

  return (
    <section
      id={anchorId}
      aria-busy={isPending}
      className="surface-panel rounded-[2.4rem] p-5 sm:p-8 lg:p-10"
    >
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-[4.3rem]">
          {title}
        </h2>
        <p className="body-copy max-w-2xl text-base leading-8">{description}</p>
      </div>

      {isFocusedOrderFlow ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div>{focusedBagSummary}</div>

          <div className="space-y-5">
            {orderDetailsPanel}
            {sendOrderPanel}
          </div>
        </div>
      ) : (
        <div
          className={`mt-8 grid gap-6 ${
            compact ? "xl:grid-cols-[0.84fr_1.16fr]" : "xl:grid-cols-[0.82fr_1.18fr]"
          }`}
        >
          <div>{productChooser}</div>

          <div className="space-y-5">
            {generalProductPreview}
            {orderDetailsPanel}
            {sendOrderPanel}
          </div>
        </div>
      )}
    </section>
  );
}

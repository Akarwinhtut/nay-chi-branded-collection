"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { CatalogProduct } from "@/lib/catalog-shared";
import {
  pushRecentlyViewedSlug,
  toggleWishlistSlug,
  useWishlistSlugs,
} from "@/lib/catalog-browser-state";
import {
  buildProductGalleryItems,
  createProductReserveMessage,
} from "@/lib/product-presentation";
import {
  contactMethods,
  formatPrice,
  getProductTotalStock,
  getVariantTotalStock,
} from "@/lib/site-data";

import { CrossfadePhoto } from "./crossfade-photo";
import { ProductImage } from "./product-image";

type ProductQuickPreviewProps = {
  product: CatalogProduct;
  onClose: () => void;
};

export function ProductQuickPreview({
  product,
  onClose,
}: ProductQuickPreviewProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.sizes[0]?.label ?? "",
  );
  const galleryItems = buildProductGalleryItems(product, 5);
  const [selectedImageKey, setSelectedImageKey] = useState(
    galleryItems.find((item) => item.color === product.variants[0]?.color)?.key ??
      galleryItems[0]?.key ??
      "",
  );
  const [copied, setCopied] = useState(false);

  const wishlistSlugs = useWishlistSlugs();
  const saved = wishlistSlugs.includes(product.slug);
  const telegram = contactMethods.find((contact) => contact.label === "Telegram");
  const email = contactMethods.find((contact) => contact.label === "Email");
  const emailAddress = email?.href.replace("mailto:", "") ?? "";
  const activeVariant =
    product.variants.find((variant) => variant.color === selectedColor) ??
    product.variants[0];
  const activeSize =
    activeVariant?.sizes.find((size) => size.label === selectedSize) ??
    activeVariant?.sizes[0];
  const totalStock = getProductTotalStock(product);
  const variantStock = activeVariant ? getVariantTotalStock(activeVariant) : 0;
  const canReserve = Boolean(activeSize && activeSize.stock > 0);
  const selectedImage =
    galleryItems.find((item) => item.key === selectedImageKey) ??
    galleryItems.find((item) => item.color === activeVariant?.color) ??
    galleryItems[0];
  const orderMessage = createProductReserveMessage(product, {
    color: activeVariant?.color,
    sizeLabel: activeSize?.label,
  });
  const mailtoHref = emailAddress
    ? `mailto:${emailAddress}?subject=${encodeURIComponent(`Reserve ${product.name}`)}&body=${encodeURIComponent(orderMessage)}`
    : "#";

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setVisible(true);
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    pushRecentlyViewedSlug(product.slug);
  }, [product.slug]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeFromKeyboard = () => {
      setVisible(false);
      window.setTimeout(() => {
        onClose();
      }, 180);
    };

    const getFocusableElements = () => {
      if (!dialogRef.current) {
        return [] as HTMLElement[];
      }

      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFromKeyboard();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!activeElement || activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }

        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  function requestClose() {
    setVisible(false);

    window.setTimeout(() => {
      onClose();
    }, 180);
  }

  function closeImmediately() {
    onClose();
  }

  function handleSelectColor(color: string) {
    const nextVariant = product.variants.find((variant) => variant.color === color);

    if (!nextVariant) {
      return;
    }

    setSelectedColor(nextVariant.color);
    setSelectedSize(nextVariant.sizes[0]?.label ?? "");
    setSelectedImageKey(
      galleryItems.find((item) => item.color === nextVariant.color)?.key ??
        galleryItems[0]?.key ??
        "",
    );
  }

  async function handlePrimaryAction() {
    if (!canReserve) {
      return;
    }

    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:p-4 lg:items-stretch lg:justify-end">
      <button
        type="button"
        aria-label="Close quick preview"
        onClick={requestClose}
        className={`absolute inset-0 bg-[rgba(24,19,15,0.22)] backdrop-blur-[6px] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex h-[min(52rem,calc(100vh-0.75rem))] w-full max-w-[39rem] flex-col overflow-hidden rounded-[2.2rem] border border-[rgba(53,38,24,0.08)] bg-[rgba(251,247,241,0.96)] shadow-[0_36px_92px_rgba(20,14,10,0.18)] backdrop-blur-xl transition-[opacity,transform] duration-200 ${
          visible
            ? "translate-y-0 opacity-100 lg:translate-x-0"
            : "translate-y-5 opacity-0 lg:translate-x-6 lg:translate-y-0"
        } lg:h-[calc(100vh-2rem)]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="signal-label">Quick preview</p>
            <h2
              id={titleId}
              className="mt-2 truncate font-display text-[2.1rem] leading-[0.92] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[2.6rem]"
            >
              {product.name}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            className="inline-flex min-h-[2.8rem] min-w-[2.8rem] items-center justify-center rounded-full border border-[var(--color-line)] bg-[rgba(255,255,255,0.76)] px-4 text-sm font-semibold text-[var(--color-ink)] transition-colors duration-200 hover:bg-white"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-6">
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,253,249,0.86),rgba(246,238,228,0.94))] p-3 shadow-[0_24px_56px_rgba(53,38,24,0.06)]">
            <CrossfadePhoto
              src={selectedImage?.src}
              alt={selectedImage?.alt ?? product.image.alt}
              position={selectedImage?.position ?? "center center"}
              className="min-h-[18rem] rounded-[1.6rem] sm:min-h-[24rem]"
            />
          </div>

          {galleryItems.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {galleryItems.map((item) => {
                const active = item.key === selectedImageKey;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedImageKey(item.key);

                      if (item.color) {
                        handleSelectColor(item.color);
                      }
                    }}
                    className={`shrink-0 rounded-[1.2rem] border p-2 text-left transition-[border-color,box-shadow,transform] duration-200 ${
                      active
                        ? "border-[var(--color-line-strong)] bg-white shadow-[0_14px_32px_rgba(53,38,24,0.08)]"
                        : "border-[var(--color-line)] bg-[rgba(255,255,255,0.54)] hover:-translate-y-0.5 hover:border-[var(--color-line-strong)]"
                    }`}
                  >
                    <ProductImage
                      src={item.src}
                      alt={item.alt}
                      position={item.position}
                      className="h-[5.6rem] w-[4.6rem] rounded-[0.95rem]"
                      sizes="74px"
                    />
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(29,29,31,0.54)]">
                      {item.label}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inventory-pill">{product.collection}</span>
            <span className="inventory-pill">{product.category}</span>
            <span className="inventory-pill">
              {totalStock > 0 ? `${totalStock} in store` : "Currently sold out"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <p className="eyebrow">Ready to order</p>
            <p className="text-base leading-8 text-[rgba(29,29,31,0.66)] sm:text-lg">
              {product.shortDescription}
            </p>
            <p className="text-[1.8rem] font-semibold leading-[1] tracking-[0.01em] text-[var(--color-accent-strong)] sm:text-[2.15rem]">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="mt-6 space-y-6 border-t border-[var(--color-line)] pt-6">
            <div>
              <p className="field-label">Color</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((variant) => {
                  const active = variant.color === activeVariant?.color;

                  return (
                    <button
                      key={variant.color}
                      type="button"
                      onClick={() => handleSelectColor(variant.color)}
                      className={`flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
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
              <p className="mt-3 text-sm leading-6 text-[rgba(29,29,31,0.58)]">
                {activeVariant?.finish}
              </p>
            </div>

            {activeVariant?.sizes.length ? (
              <div>
                <p className="field-label">Size</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {activeVariant.sizes.map((size) => {
                    const active = size.label === activeSize?.label;

                    return (
                      <button
                        key={size.label}
                        type="button"
                        onClick={() => setSelectedSize(size.label)}
                        className={`rounded-full border px-4 py-3 text-sm font-semibold transition-[border-color,background-color,box-shadow] duration-200 ${
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
            ) : null}

            <article className="rounded-[1.8rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.52)] px-4 py-4">
              <p className="signal-label">Stock status</p>
              <p className="mt-2 text-base font-semibold leading-7 text-[var(--color-ink)]">
                {canReserve
                  ? activeSize?.stock === 1
                    ? "1 piece is ready in the selected size."
                    : `${activeSize?.stock ?? 0} pieces are ready in the selected size.`
                  : "Currently unavailable in the selected finish."}
              </p>
              <p className="mt-2 text-sm leading-6 text-[rgba(29,29,31,0.6)]">
                {variantStock} listed in {activeVariant?.color}, {totalStock} in total for this bag.
              </p>
            </article>

            {copied ? (
              <div
                aria-live="polite"
                className="rounded-[1.7rem] border border-[rgba(94,67,39,0.16)] bg-[rgba(255,255,255,0.72)] px-4 py-4 text-sm leading-7 text-[rgba(29,29,31,0.68)]"
              >
                The order note is copied with the selected color and size. Send it through
                Telegram, Email, or continue on the full product page.
                <div className="mt-3 rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.76)] p-3 text-[rgba(29,29,31,0.72)]">
                  {orderMessage}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-[var(--color-line)] bg-[rgba(251,247,241,0.94)] px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="signal-label">Selected price</p>
              <p className="mt-1 truncate text-base font-semibold text-[var(--color-accent-strong)]">
                {formatPrice(product.price)}
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={!canReserve}
              className={`cta-button w-full sm:min-w-[13rem] sm:w-auto ${!canReserve ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {copied ? "Order note copied" : canReserve ? "Reserve this bag" : "Unavailable"}
            </button>
          </div>

          <p className="mt-3 text-sm leading-6 text-[rgba(29,29,31,0.58)]">
            Copies a ready-to-send note using the selected finish so the order can move faster.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/services/${product.slug}`}
              onClick={closeImmediately}
              className="ghost-button"
            >
              View full bag
            </Link>
            <button
              type="button"
              onClick={() => toggleWishlistSlug(product.slug)}
              className={`ghost-button ${saved ? "border-[rgba(23,20,18,0.14)] bg-[rgba(23,20,18,0.92)] text-white" : ""}`}
            >
              {saved ? "Saved" : "Save"}
            </button>
            {telegram ? (
              <a
                href={telegram.href}
                target="_blank"
                rel="noreferrer"
                className="ghost-button"
              >
                Telegram
              </a>
            ) : null}
            {emailAddress ? (
              <a href={mailtoHref} className="ghost-button">
                Email
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

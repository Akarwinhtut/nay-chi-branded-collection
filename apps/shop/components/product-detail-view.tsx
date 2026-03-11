"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type {
  CatalogInventoryStatus,
  CatalogProduct,
} from "@/lib/catalog-shared";
import {
  getCatalogProductCompareAtPrice,
  getCatalogProductDisplayPrice,
  getCatalogProductInventory,
} from "@/lib/catalog-shared";
import { siteUrl } from "@/lib/metadata";
import { contactMethods, formatPrice, getProductTotalStock, getVariantTotalStock, visitDetails } from "@/lib/site-data";

import { ProductImage } from "./product-image";
import { ProductTile } from "./product-tile";
import { SectionHeading } from "./section-heading";

type ProductDetailViewProps = {
  product: CatalogProduct;
  relatedProducts: CatalogProduct[];
};

function formatInventoryText(status: CatalogInventoryStatus) {
  if (status === "in_stock") {
    return "In stock";
  }

  if (status === "low_stock") {
    return "Low stock";
  }

  return "Sold out";
}

function getInventoryClasses(status: CatalogInventoryStatus) {
  if (status === "in_stock") {
    return "border-[rgba(46,94,70,0.14)] bg-[rgba(226,242,232,0.9)] text-[rgba(25,70,49,0.92)]";
  }

  if (status === "low_stock") {
    return "border-[rgba(159,109,46,0.16)] bg-[rgba(252,241,224,0.96)] text-[rgba(126,84,34,0.92)]";
  }

  return "border-[rgba(153,78,66,0.14)] bg-[rgba(247,229,225,0.94)] text-[rgba(127,54,44,0.9)]";
}

function getChannelButtonLabel(label: string, soldOut: boolean) {
  const normalized = label.toLowerCase();

  if (normalized === "telegram") {
    return soldOut ? "Ask on Telegram" : "Reserve on Telegram";
  }

  if (normalized === "email") {
    return soldOut ? "Email for restock" : "Email order";
  }

  if (normalized === "viber") {
    return soldOut ? "Ask on Viber" : "Order on Viber";
  }

  if (normalized === "whatsapp") {
    return soldOut ? "Ask on WhatsApp" : "Order on WhatsApp";
  }

  if (normalized === "phone" || normalized === "call") {
    return soldOut ? "Call for restock" : "Call to order";
  }

  return label;
}

function buildContactHref(label: string, baseHref: string, subject: string, message: string) {
  if (label.toLowerCase() === "email") {
    const [address] = baseHref.split("?");
    return `${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  return baseHref;
}

function toAbsoluteSiteUrl(path: string) {
  return new URL(path, siteUrl).href;
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState(
    product.variants[0]?.sizes.find((size) => size.stock > 0)?.label ??
      product.variants[0]?.sizes[0]?.label ??
      "",
  );
  const [pageUrl, setPageUrl] = useState(() => toAbsoluteSiteUrl(`/services/${product.slug}`));
  const [imageUrl, setImageUrl] = useState(() => toAbsoluteSiteUrl(product.image.src));
  const [copyFeedback, setCopyFeedback] = useState(
    "Copy order details for Viber, Messenger, or any other chat app.",
  );

  const activeVariant =
    product.variants.find((variant) => variant.color === selectedColor) ?? product.variants[0];
  const activeImage = activeVariant?.image ?? product.image;
  const activeSize =
    activeVariant?.sizes.find((size) => size.label === selectedSize) ??
    activeVariant?.sizes.find((size) => size.stock > 0) ??
    activeVariant?.sizes[0];
  const totalStock = getProductTotalStock(product);
  const inventory = getCatalogProductInventory(product);
  const compareAtPrice = getCatalogProductCompareAtPrice(product);
  const displayPrice = getCatalogProductDisplayPrice(product);
  const inventoryThreshold = Math.max(product.inventoryThreshold ?? 2, 1);
  const selectedSizeStock = activeSize?.stock ?? 0;
  const selectedStatus: CatalogInventoryStatus =
    selectedSizeStock <= 0
      ? "sold_out"
      : selectedSizeStock <= inventoryThreshold
        ? "low_stock"
        : "in_stock";
  const selectedAvailability =
    selectedStatus === "sold_out"
      ? "This size is currently sold out."
      : selectedStatus === "low_stock"
        ? `${selectedSizeStock} piece${selectedSizeStock === 1 ? "" : "s"} left in this size.`
        : `${selectedSizeStock} piece${selectedSizeStock === 1 ? "" : "s"} ready in this size.`;
  const orderContacts = contactMethods.filter((contact) =>
    ["telegram", "email", "viber", "whatsapp", "phone", "call"].includes(
      contact.label.toLowerCase(),
    ),
  );
  const primaryOrderContact = orderContacts.find((contact) => contact.primary) ?? orderContacts[0];
  const secondaryOrderContacts = orderContacts.filter(
    (contact) => contact.label !== primaryOrderContact?.label,
  );
  const orderSubject = `${selectedStatus === "sold_out" ? "Restock request" : "Order request"}: ${product.name}`;
  const orderMessage = [
    `Hello, I want to ${selectedStatus === "sold_out" ? "ask about" : "buy or reserve"} this bag.`,
    "",
    `Bag: ${product.name}`,
    `Price: ${formatPrice(displayPrice)}`,
    `Color: ${activeVariant?.color ?? "Not selected"}`,
    `Size: ${activeSize?.label ?? "Not selected"}`,
    `Availability: ${selectedAvailability}`,
    `Product page: ${pageUrl}`,
    `Product photo: ${imageUrl}`,
    "",
    "Please confirm stock, payment, and delivery.",
  ].join("\n");
  const facts = [
    { label: "Category", value: product.category },
    { label: "Material", value: product.material },
    { label: "Selection", value: formatInventoryText(selectedStatus) },
  ];

  useEffect(() => {
    if (!activeVariant) {
      setSelectedSize("");
      return;
    }

    if (!activeVariant.sizes.some((size) => size.label === selectedSize)) {
      setSelectedSize(
        activeVariant.sizes.find((size) => size.stock > 0)?.label ??
          activeVariant.sizes[0]?.label ??
          "",
      );
    }
  }, [activeVariant, selectedSize]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setPageUrl(new URL(`/services/${product.slug}`, window.location.origin).href);
    setImageUrl(new URL(activeImage.src, window.location.origin).href);
  }, [activeImage.src, product.slug]);

  async function copyOrderDetails(channel?: string) {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopyFeedback(
        channel
          ? `Order details copied for ${channel}. Paste them into the message.`
          : "Order details copied, including the product photo link.",
      );
    } catch {
      setCopyFeedback("Copy failed on this device. You can still use the contact buttons below.");
    }
  }

  async function shareOrderDetails() {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
      await copyOrderDetails("Viber or another chat app");
      return;
    }

    try {
      await navigator.share({
        title: `${product.name} order details`,
        text: orderMessage,
        url: pageUrl,
      });
      setCopyFeedback("Order details shared. You can send them in Viber or any other chat app.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      await copyOrderDetails("Viber or another chat app");
    }
  }

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
                {formatPrice(displayPrice)}
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
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="signal-label">1. Choose color</p>
                  <p className="text-sm text-[rgba(29,29,31,0.56)]">
                    {activeVariant?.finish || "Selected finish"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const active = variant.color === activeVariant?.color;

                    return (
                      <button
                        key={variant.color}
                        type="button"
                        onClick={() => setSelectedColor(variant.color)}
                        className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition-[border-color,background-color,box-shadow] duration-200 ${
                          active
                            ? "border-[var(--color-line-strong)] bg-white text-[var(--color-ink)] shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                            : "border-[var(--color-line)] bg-[rgba(255,255,255,0.54)] text-[rgba(29,29,31,0.72)] hover:border-[var(--color-line-strong)]"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-[rgba(29,29,31,0.12)]"
                          style={{ backgroundColor: variant.swatch }}
                        />
                        <span>{variant.color}</span>
                        <span className="text-[rgba(29,29,31,0.48)]">
                          {getVariantTotalStock(variant)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="signal-label">2. Choose size</p>
                  <p className="text-sm text-[rgba(29,29,31,0.56)]">
                    {getVariantTotalStock(activeVariant)} pieces in {activeVariant?.color}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {activeVariant?.sizes.map((size) => {
                    const active = size.label === activeSize?.label;
                    const soldOut = size.stock <= 0;

                    return (
                      <button
                        key={`${activeVariant?.color}-${size.label}`}
                        type="button"
                        onClick={() => setSelectedSize(size.label)}
                        className={`rounded-[1.1rem] border px-4 py-3 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
                          active
                            ? "border-[var(--color-line-strong)] bg-white shadow-[0_12px_28px_rgba(53,38,24,0.05)]"
                            : "border-[var(--color-line)] bg-[rgba(255,255,255,0.54)]"
                        } ${soldOut ? "text-[rgba(29,29,31,0.42)]" : "text-[var(--color-ink)]"}`}
                      >
                        <p className="text-sm font-semibold">{size.label}</p>
                        <p className="mt-1 text-sm">
                          {soldOut ? "Sold out" : `${size.stock} in this size`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="signal-label">3. Order or reserve</p>
                    <p className="text-base font-semibold text-[var(--color-ink)]">
                      {product.name} / {activeVariant?.color} / {activeSize?.label}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${getInventoryClasses(
                      selectedStatus,
                    )}`}
                  >
                    {formatInventoryText(selectedStatus)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-[rgba(29,29,31,0.62)]">
                  {selectedAvailability} The copied order note includes the product page and photo link.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryOrderContact ? (
                  <a
                    href={buildContactHref(
                      primaryOrderContact.label,
                      primaryOrderContact.href,
                      orderSubject,
                      orderMessage,
                    )}
                    onClick={() => {
                      if (primaryOrderContact.label.toLowerCase() !== "email") {
                        void copyOrderDetails(primaryOrderContact.label);
                      }
                    }}
                    className="cta-button text-center"
                    target={primaryOrderContact.label.toLowerCase() === "email" ? undefined : "_blank"}
                    rel={primaryOrderContact.label.toLowerCase() === "email" ? undefined : "noreferrer"}
                  >
                    {getChannelButtonLabel(primaryOrderContact.label, selectedStatus === "sold_out")}
                  </a>
                ) : null}

                {secondaryOrderContacts.map((contact) => (
                  <a
                    key={contact.label}
                    href={buildContactHref(contact.label, contact.href, orderSubject, orderMessage)}
                    onClick={() => {
                      if (contact.label.toLowerCase() !== "email") {
                        void copyOrderDetails(contact.label);
                      }
                    }}
                    className="ghost-button text-center"
                    target={contact.label.toLowerCase() === "email" ? undefined : "_blank"}
                    rel={contact.label.toLowerCase() === "email" ? undefined : "noreferrer"}
                  >
                    {getChannelButtonLabel(contact.label, selectedStatus === "sold_out")}
                  </a>
                ))}

                <button
                  type="button"
                  onClick={() => void shareOrderDetails()}
                  className="ghost-button"
                >
                  Share to Viber or chat
                </button>

                <button
                  type="button"
                  onClick={() => void copyOrderDetails()}
                  className="ghost-button"
                >
                  Copy order details
                </button>
              </div>

              {primaryOrderContact?.note ? (
                <p className="text-sm leading-6 text-[rgba(29,29,31,0.58)]">
                  {primaryOrderContact.note}
                </p>
              ) : null}
              <p className="text-sm leading-6 text-[rgba(29,29,31,0.58)]">
                Telegram and email open directly. Share or copy the same order note into Viber,
                Messenger, or any other chat app.
              </p>
              <p className="text-sm leading-6 text-[rgba(29,29,31,0.58)]">
                {copyFeedback}
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-t border-[var(--color-line)] pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
            <div className="space-y-3">
              <p className="signal-label">Product note</p>
              <p className="max-w-xl text-base leading-8 text-[rgba(29,29,31,0.68)]">
                {product.description}
              </p>
              <p className="max-w-xl text-sm leading-7 text-[rgba(29,29,31,0.58)]">
                {product.detail}
              </p>
            </div>

            <div className="grid gap-3">
              {visitDetails.slice(0, 3).map((detail) => (
                <article
                  key={detail.label}
                  className="rounded-[1.25rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.48)] px-4 py-4"
                >
                  <p className="signal-label">{detail.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {detail.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(29,29,31,0.56)]">
                    {detail.note}
                  </p>
                </article>
              ))}
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

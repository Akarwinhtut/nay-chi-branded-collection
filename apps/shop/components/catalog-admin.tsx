"use client";

import { useState, useTransition } from "react";

import type { CatalogProduct, CatalogProductInput } from "@/lib/catalog";

type CatalogAdminProps = {
  initialProducts: CatalogProduct[];
  storageReady: boolean;
  storageMode: "database" | "file" | "seed";
};

type ApiCatalogResponse = {
  products?: CatalogProduct[];
  storageReady?: boolean;
  storageMode?: "database" | "file" | "seed";
  error?: string;
};

function createEmptyDraft(): CatalogProductInput {
  return {
    slug: "",
    name: "",
    collection: "",
    category: "",
    occasion: "",
    price: 0,
    shortDescription: "",
    description: "",
    material: "",
    detail: "",
    badges: [],
    imageSrc: "",
    imageAlt: "",
    imagePosition: "center center",
    isFeatured: false,
    isNewArrival: false,
    isPublished: true,
    displayOrder: 100,
    variants: [
      {
        color: "",
        swatch: "#c9b39b",
        finish: "",
        imageSrc: "",
        imageAlt: "",
        imagePosition: "center center",
        sizes: [{ label: "Standard", stock: 1 }],
      },
    ],
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function sortProducts(products: CatalogProduct[]) {
  return [...products].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

function inputFromProduct(product: CatalogProduct): CatalogProductInput {
  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    category: product.category,
    occasion: product.occasion,
    price: product.price,
    shortDescription: product.shortDescription,
    description: product.description,
    material: product.material,
    detail: product.detail,
    badges: [...product.badges],
    imageSrc: product.image.src,
    imageAlt: product.image.alt,
    imagePosition: product.image.position ?? "center center",
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isPublished: product.isPublished,
    displayOrder: product.displayOrder,
    variants: product.variants.map((variant) => ({
      color: variant.color,
      swatch: variant.swatch,
      finish: variant.finish,
      imageSrc: variant.image.src === product.image.src ? "" : variant.image.src,
      imageAlt: variant.image.alt === product.image.alt ? "" : variant.image.alt,
      imagePosition:
        variant.image.position === (product.image.position ?? "center center")
          ? ""
          : (variant.image.position ?? ""),
      sizes: variant.sizes.map((size) => ({
        label: size.label,
        stock: size.stock,
      })),
    })),
  };
}

export function CatalogAdmin({
  initialProducts,
  storageReady,
  storageMode,
}: CatalogAdminProps) {
  const [products, setProducts] = useState(() => sortProducts(initialProducts));
  const [draft, setDraft] = useState<CatalogProductInput>(() => createEmptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message:
      storageReady
        ? "Add a bag, color variants, and size stock. Then save it to the catalog."
        : "Catalog storage is not available right now. The admin is visible, but saving is disabled until storage is connected.",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [catalogReady, setCatalogReady] = useState(storageReady);
  const [catalogModeState, setCatalogModeState] = useState(storageMode);
  const [isPending, startTransition] = useTransition();

  function updateDraft<K extends keyof CatalogProductInput>(
    key: K,
    value: CatalogProductInput[K],
  ) {
    setDraft((current) => {
      if (key === "name" && !slugTouched) {
        return {
          ...current,
          name: value as CatalogProductInput["name"],
          slug: slugify(String(value)),
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  }

  function updateVariant(
    index: number,
    key: keyof CatalogProductInput["variants"][number],
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [key]: value,
            }
          : variant,
      ),
    }));
  }

  function updateSize(
    variantIndex: number,
    sizeIndex: number,
    key: keyof CatalogProductInput["variants"][number]["sizes"][number],
    value: string | number,
  ) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, currentVariantIndex) =>
        currentVariantIndex === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, currentSizeIndex) =>
                currentSizeIndex === sizeIndex
                  ? {
                      ...size,
                      [key]: key === "stock" ? Number(value) : value,
                    }
                  : size,
              ),
            }
          : variant,
      ),
    }));
  }

  function addVariant() {
    setDraft((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          color: "",
          swatch: "#c9b39b",
          finish: "",
          imageSrc: "",
          imageAlt: "",
          imagePosition: "center center",
          sizes: [{ label: "Standard", stock: 1 }],
        },
      ],
    }));
  }

  function removeVariant(index: number) {
    setDraft((current) => ({
      ...current,
      variants:
        current.variants.length > 1
          ? current.variants.filter((_, currentIndex) => currentIndex !== index)
          : current.variants,
    }));
  }

  function addSize(variantIndex: number) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, currentIndex) =>
        currentIndex === variantIndex
          ? {
              ...variant,
              sizes: [...variant.sizes, { label: "", stock: 1 }],
            }
          : variant,
      ),
    }));
  }

  function removeSize(variantIndex: number, sizeIndex: number) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, currentIndex) =>
        currentIndex === variantIndex
          ? {
              ...variant,
              sizes:
                variant.sizes.length > 1
                  ? variant.sizes.filter((_, currentSizeIndex) => currentSizeIndex !== sizeIndex)
                  : variant.sizes,
            }
          : variant,
      ),
    }));
  }

  function resetEditor() {
    setDraft(createEmptyDraft());
    setEditingId(null);
    setSlugTouched(false);
    setStatus({
      tone: "idle",
      message:
        catalogReady
          ? "Add the next bag whenever you are ready."
          : "Catalog storage is still unavailable, so saving stays disabled.",
    });
  }

  async function refreshCatalog(nextMessage?: string) {
    const response = await fetch("/api/catalog-products", {
      method: "GET",
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as ApiCatalogResponse | null;

    if (!response.ok || !payload?.products) {
      setStatus({
        tone: "error",
        message: payload?.error ?? "The catalog could not be refreshed.",
      });
      return;
    }

    setProducts(sortProducts(payload.products));
    setCatalogReady(Boolean(payload.storageReady));
    setCatalogModeState(payload.storageMode ?? catalogModeState);

    if (nextMessage) {
      setStatus({
        tone: "success",
        message: nextMessage,
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!catalogReady) {
      setStatus({
        tone: "error",
        message:
          "Saving is disabled because catalog storage is not connected right now.",
      });
      return;
    }

    startTransition(async () => {
      setStatus({
        tone: "idle",
        message: editingId ? "Updating bag..." : "Saving bag...",
      });

      const response = await fetch(
        editingId ? `/api/catalog-products/${editingId}` : "/api/catalog-products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        },
      );
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus({
          tone: "error",
          message: payload?.error ?? "The bag could not be saved.",
        });
        return;
      }

      setDraft(createEmptyDraft());
      setEditingId(null);
      setSlugTouched(false);
      await refreshCatalog(editingId ? "Bag updated." : "Bag added to the catalog.");
    });
  }

  function editProduct(product: CatalogProduct) {
    if (product.source === "seed" && !catalogReady) {
      setStatus({
        tone: "error",
        message:
          "These are fallback sample products. Reconnect catalog storage, then add your real bags here.",
      });
      return;
    }

    setDraft(inputFromProduct(product));
    setEditingId(product.id);
    setSlugTouched(true);
    setStatus({
      tone: "idle",
      message: `Editing ${product.name}. Save when your changes are ready.`,
    });
  }

  function deleteProduct(product: CatalogProduct) {
    if (!catalogReady) {
      setStatus({
        tone: "error",
        message: "Deleting is disabled because catalog storage is not connected right now.",
      });
      return;
    }

    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    startTransition(async () => {
      setStatus({
        tone: "idle",
        message: `Deleting ${product.name}...`,
      });

      const response = await fetch(`/api/catalog-products/${product.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus({
          tone: "error",
          message: payload?.error ?? "The bag could not be deleted.",
        });
        return;
      }

      if (editingId === product.id) {
        setDraft(createEmptyDraft());
        setEditingId(null);
        setSlugTouched(false);
      }

      await refreshCatalog("Bag removed from the catalog.");
    });
  }

  return (
    <div className="space-y-8">
      <div
        className={`rounded-[2rem] border px-5 py-4 text-sm leading-7 sm:px-6 ${
          catalogReady
            ? "border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.34)] text-[rgba(36,24,18,0.74)]"
            : "border-[rgba(165,124,89,0.26)] bg-[rgba(165,124,89,0.08)] text-[rgba(36,24,18,0.82)]"
        }`}
      >
        {catalogReady ? (
          <p>
            {catalogModeState === "database"
              ? "Database storage is connected. Every save updates the live catalog shoppers see in the storefront."
              : "Local catalog storage is connected. Every save updates the storefront on this machine immediately."}
          </p>
        ) : (
          <p>
            Storage is not connected right now. You can review the admin layout now, but saving is
            temporarily disabled.
          </p>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="surface-panel rounded-[2.3rem] p-5 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Catalog editor</p>
              <h2 className="font-display text-[3rem] leading-[0.92] text-[var(--color-ink)] sm:text-[4rem]">
                Add bags one by one.
              </h2>
              <p className="body-copy max-w-2xl text-sm leading-7 sm:text-base">
                This is the owner side of the app. Add the bag details, its colors, the sizes, and
                the stock count, then save it into the live catalog.
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={resetEditor} className="ghost-button">
                {editingId ? "Stop editing" : "Clear form"}
              </button>
              <button
                type="submit"
                disabled={isPending || !catalogReady}
                className="cta-button disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Saving..." : editingId ? "Update bag" : "Add bag"}
              </button>
            </div>
          </div>

          <p
            className={`mt-5 text-sm leading-6 ${
              status.tone === "error"
                ? "text-[var(--color-accent-strong)]"
                : "text-[rgba(36,24,18,0.62)]"
            }`}
          >
            {status.message}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="field-label">Bag name</span>
              <input
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                className="field-control"
                placeholder="Lune Everyday Tote"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  updateDraft("slug", slugify(event.target.value));
                }}
                className="field-control"
                      placeholder="david-jones-taupe-carryall"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Collection</span>
              <input
                value={draft.collection}
                onChange={(event) => updateDraft("collection", event.target.value)}
                className="field-control"
                placeholder="Signature"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Category</span>
              <input
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
                className="field-control"
                placeholder="Handbag, tote, wallet..."
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Occasion</span>
              <input
                value={draft.occasion}
                onChange={(event) => updateDraft("occasion", event.target.value)}
                className="field-control"
                placeholder="Daily carry"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Price (MMK)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={draft.price}
                onChange={(event) => updateDraft("price", Number(event.target.value))}
                className="field-control"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="field-label">Short description</span>
              <textarea
                rows={3}
                value={draft.shortDescription}
                onChange={(event) => updateDraft("shortDescription", event.target.value)}
                className="field-control min-h-[7rem] resize-none"
                placeholder="A softly structured tote for notebooks, beauty essentials, and a clean office look."
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="field-label">Full description</span>
              <textarea
                rows={4}
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                className="field-control min-h-[8rem] resize-none"
                placeholder="Describe the bag like a real product listing."
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Material</span>
              <input
                value={draft.material}
                onChange={(event) => updateDraft("material", event.target.value)}
                className="field-control"
                placeholder="Pebbled leather feel"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Detail line</span>
              <input
                value={draft.detail}
                onChange={(event) => updateDraft("detail", event.target.value)}
                className="field-control"
                placeholder="Zip closure, inner pocket, detachable strap..."
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="field-label">Badges (comma separated)</span>
              <input
                value={draft.badges.join(", ")}
                onChange={(event) =>
                  updateDraft(
                    "badges",
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  )
                }
                className="field-control"
                placeholder="Best seller, New arrival, Gift edit"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
                    <span className="field-label">Main image path or URL</span>
              <input
                value={draft.imageSrc}
                onChange={(event) => updateDraft("imageSrc", event.target.value)}
                className="field-control"
                placeholder="https://..."
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Main image alt</span>
              <input
                value={draft.imageAlt}
                onChange={(event) => updateDraft("imageAlt", event.target.value)}
                className="field-control"
                placeholder="Tan leather handbag in a studio"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Image position</span>
              <input
                value={draft.imagePosition ?? ""}
                onChange={(event) => updateDraft("imagePosition", event.target.value)}
                className="field-control"
                placeholder="center center"
              />
            </label>

            <label className="space-y-2">
              <span className="field-label">Display order</span>
              <input
                type="number"
                min="0"
                step="1"
                value={draft.displayOrder}
                onChange={(event) => updateDraft("displayOrder", Number(event.target.value))}
                className="field-control"
              />
            </label>

            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-[1.4rem] border border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.28)] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isFeatured}
                  onChange={(event) => updateDraft("isFeatured", event.target.checked)}
                />
                Featured on home
              </label>
              <label className="flex items-center gap-3 rounded-[1.4rem] border border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.28)] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isNewArrival}
                  onChange={(event) => updateDraft("isNewArrival", event.target.checked)}
                />
                New arrival
              </label>
              <label className="flex items-center gap-3 rounded-[1.4rem] border border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.28)] px-4 py-4 text-sm">
                <input
                  type="checkbox"
                  checked={draft.isPublished}
                  onChange={(event) => updateDraft("isPublished", event.target.checked)}
                />
                Published
              </label>
            </div>
          </div>

          <div className="mt-8 space-y-4 border-t border-[rgba(36,24,18,0.08)] pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Colorways and stock</p>
                <p className="body-copy mt-2 text-sm leading-7">
                  Add each color variant, then enter the sizes and stock numbers below it.
                </p>
              </div>
              <button type="button" onClick={addVariant} className="ghost-button">
                Add colorway
              </button>
            </div>

            <div className="space-y-5">
              {draft.variants.map((variant, variantIndex) => (
                <article
                  key={`${variant.color}-${variantIndex}`}
                  className="rounded-[1.8rem] border border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.24)] p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-[2rem] leading-[0.92] text-[var(--color-ink)]">
                      Colorway {variantIndex + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="ghost-button"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="field-label">Color</span>
                      <input
                        value={variant.color}
                        onChange={(event) => updateVariant(variantIndex, "color", event.target.value)}
                        className="field-control"
                        placeholder="Sandstone"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="field-label">Swatch</span>
                      <input
                        value={variant.swatch}
                        onChange={(event) => updateVariant(variantIndex, "swatch", event.target.value)}
                        className="field-control"
                        placeholder="#c9b39b"
                      />
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                      <span className="field-label">Finish note</span>
                      <input
                        value={variant.finish}
                        onChange={(event) => updateVariant(variantIndex, "finish", event.target.value)}
                        className="field-control"
                        placeholder="Warm neutral grain"
                      />
                    </label>

                    <label className="space-y-2 sm:col-span-2">
                    <span className="field-label">Variant image path or URL (optional)</span>
                      <input
                        value={variant.imageSrc ?? ""}
                        onChange={(event) => updateVariant(variantIndex, "imageSrc", event.target.value)}
                        className="field-control"
                        placeholder="Leave empty to use the main product image"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="field-label">Variant image alt (optional)</span>
                      <input
                        value={variant.imageAlt ?? ""}
                        onChange={(event) => updateVariant(variantIndex, "imageAlt", event.target.value)}
                        className="field-control"
                        placeholder="Black mini handbag detail"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="field-label">Variant image position</span>
                      <input
                        value={variant.imagePosition ?? ""}
                        onChange={(event) => updateVariant(variantIndex, "imagePosition", event.target.value)}
                        className="field-control"
                        placeholder="center center"
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-[rgba(36,24,18,0.08)] bg-[rgba(255,255,255,0.3)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="field-label">Sizes and stock</p>
                      <button
                        type="button"
                        onClick={() => addSize(variantIndex)}
                        className="ghost-button"
                      >
                        Add size
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {variant.sizes.map((size, sizeIndex) => (
                        <div
                          key={`${size.label}-${sizeIndex}`}
                          className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]"
                        >
                          <input
                            value={size.label}
                            onChange={(event) =>
                              updateSize(variantIndex, sizeIndex, "label", event.target.value)
                            }
                            className="field-control"
                            placeholder="Standard"
                          />
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={size.stock}
                            onChange={(event) =>
                              updateSize(
                                variantIndex,
                                sizeIndex,
                                "stock",
                                Number(event.target.value),
                              )
                            }
                            className="field-control"
                          />
                          <button
                            type="button"
                            onClick={() => removeSize(variantIndex, sizeIndex)}
                            className="ghost-button"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="surface-panel rounded-[2.3rem] p-5 sm:p-6">
            <p className="eyebrow">Current catalog</p>
            <h2 className="mt-4 font-display text-[2.6rem] leading-[0.92] text-[var(--color-ink)]">
              {products.length} bags visible in admin
            </h2>
            <p className="body-copy mt-3 text-sm leading-7">
              {catalogModeState === "database"
                ? "These items are coming from Supabase and drive the public storefront."
                : catalogModeState === "file"
                  ? "These items are stored in a local catalog file and drive the storefront on this machine."
                  : "These are fallback sample items shown because catalog storage is unavailable."}
            </p>
          </div>

          <div className="space-y-3">
            {products.length > 0 ? (
              products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, variant) =>
                    sum + variant.sizes.reduce((sizeSum, size) => sizeSum + size.stock, 0),
                  0,
                );

                return (
                  <article
                    key={product.id}
                    className="surface-panel rounded-[1.8rem] p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      <div
                        className="h-24 w-20 shrink-0 rounded-[1.2rem] border border-[rgba(36,24,18,0.08)] bg-cover bg-center"
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
                          <span className="inventory-pill">{product.category}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {product.isFeatured ? <span className="inventory-pill">Featured</span> : null}
                          {product.isNewArrival ? (
                            <span className="inventory-pill">New arrival</span>
                          ) : null}
                          {!product.isPublished ? (
                            <span className="inventory-pill">Draft</span>
                          ) : null}
                          <span className="inventory-pill">{totalStock} in stock</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                        className="ghost-button"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        disabled={isPending || !catalogReady}
                        className="ghost-button disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="surface-panel rounded-[1.8rem] p-5">
                <p className="eyebrow">No products yet</p>
                <h3 className="mt-4 font-display text-[2.2rem] leading-[0.92] text-[var(--color-ink)]">
                  The database catalog is empty.
                </h3>
                <p className="body-copy mt-3 text-sm leading-7">
                  Use the form on the left to add the first real bag.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

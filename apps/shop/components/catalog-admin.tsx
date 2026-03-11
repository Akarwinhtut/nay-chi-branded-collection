"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import type { CatalogProductInput, CatalogStorageMode } from "@/lib/catalog";
import type { CatalogInventoryStatus, CatalogProduct } from "@/lib/catalog-shared";
import {
  buildAdminProductSearchText,
  createCatalogDraftFromProduct,
  createEmptyCatalogProductDraft,
  formatInventoryStatusLabel,
  getAdminProductInventorySummary,
  getAdminProductPriceSummary,
  normalizeCatalogDraftPayload,
  slugifyAdminProductName,
  sortAdminProducts,
} from "@/lib/catalog-admin-shared";
import { formatPrice } from "@/lib/site-data";

import { ProductImage } from "./product-image";

type CatalogAdminProps = {
  initialProducts: CatalogProduct[];
  storageReady: boolean;
  storageMode: CatalogStorageMode;
};

type NoticeTone = "success" | "error";
type StockFilter = "all" | CatalogInventoryStatus;
type AttributeKind = "collection" | "color" | "size";
type AttributeFormState = Record<AttributeKind, { from: string; to: string }>;

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

type StatusBadgeProps = {
  status: CatalogInventoryStatus;
};

type SectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

type ToggleFieldProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
};

type AttributeManagerCardProps = {
  title: string;
  description: string;
  options: string[];
  currentValue: string;
  replacementValue: string;
  onCurrentValueChange: (value: string) => void;
  onReplacementValueChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
};

function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[rgba(32,24,20,0.08)] bg-white p-5 shadow-[0_14px_30px_rgba(32,24,20,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.54)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[rgba(29,29,31,0.58)]">{note}</p>
    </article>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  const className =
    status === "in_stock"
      ? "border-[rgba(46,94,70,0.14)] bg-[rgba(226,242,232,0.9)] text-[rgba(25,70,49,0.9)]"
      : status === "low_stock"
        ? "border-[rgba(159,109,46,0.16)] bg-[rgba(252,241,224,0.96)] text-[rgba(126,84,34,0.92)]"
        : "border-[rgba(153,78,66,0.14)] bg-[rgba(247,229,225,0.94)] text-[rgba(127,54,44,0.9)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      {formatInventoryStatusLabel(status)}
    </span>
  );
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-5 rounded-[1.6rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_14px_30px_rgba(32,24,20,0.04)]">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
          {title}
        </h3>
        <p className="text-sm leading-7 text-[rgba(29,29,31,0.58)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ToggleField({ label, checked, onChange, hint }: ToggleFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-[1.1rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.5)] px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
        {hint ? (
          <span className="block text-sm leading-6 text-[rgba(29,29,31,0.56)]">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

function AttributeManagerCard({
  title,
  description,
  options,
  currentValue,
  replacementValue,
  onCurrentValueChange,
  onReplacementValueChange,
  onSubmit,
  submitting,
}: AttributeManagerCardProps) {
  return (
    <article className="space-y-4 rounded-[1.35rem] border border-[rgba(32,24,20,0.08)] bg-white p-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[rgba(29,29,31,0.58)]">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.length > 0 ? (
          options.map((option) => (
            <span
              key={option}
              className="inline-flex rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.65)] px-3 py-2 text-xs font-medium text-[rgba(29,29,31,0.66)]"
            >
              {option}
            </span>
          ))
        ) : (
          <p className="text-sm leading-6 text-[rgba(29,29,31,0.5)]">
            No labels yet. Add them from a product first.
          </p>
        )}
      </div>

      <div className="grid gap-3">
        <label className="space-y-2">
          <span className="field-label">Current label</span>
          <select
            value={currentValue}
            onChange={(event) => onCurrentValueChange(event.target.value)}
            className="field-control"
          >
            <option value="">Choose a label</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="field-label">Rename to</span>
          <input
            value={replacementValue}
            onChange={(event) => onReplacementValueChange(event.target.value)}
            className="field-control"
            placeholder="Enter the new label"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          className="ghost-button"
          disabled={submitting || options.length === 0}
        >
          Rename across products
        </button>
      </div>
    </article>
  );
}

function getStorageLabel(mode: CatalogStorageMode) {
  if (mode === "database") {
    return "Database";
  }

  if (mode === "file") {
    return "Local file";
  }

  return "Seed fallback";
}

function parseListInput(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProductColorLabels(product: CatalogProduct) {
  return product.variants.map((variant) => variant.color).filter(Boolean);
}

function getProductSizeLabels(product: CatalogProduct) {
  return Array.from(
    new Set(
      product.variants.flatMap((variant) => variant.sizes.map((size) => size.label).filter(Boolean)),
    ),
  );
}

function getDraftInventorySummary(draft: CatalogProductInput) {
  const quantity = draft.variants.reduce(
    (sum, variant) =>
      sum +
      variant.sizes.reduce(
        (variantSum, size) => variantSum + (Number.isFinite(size.stock) ? Math.max(size.stock, 0) : 0),
        0,
      ),
    0,
  );
  const threshold = Math.max(draft.inventoryThreshold || 1, 1);
  const autoStatus: CatalogInventoryStatus =
    quantity <= 0 ? "sold_out" : quantity <= threshold ? "low_stock" : "in_stock";
  const status = draft.inventoryStatusOverride ?? autoStatus;

  return {
    quantity,
    threshold,
    autoStatus,
    status,
  };
}

function getProductFlags(product: CatalogProduct) {
  const flags: string[] = [];

  if (product.isFeatured) {
    flags.push("Featured");
  }

  if (product.isNewArrival) {
    flags.push("New in");
  }

  if (product.isTrending) {
    flags.push("Trending");
  }

  if (!product.isPublished) {
    flags.push("Hidden");
  }

  if (product.isArchived) {
    flags.push("Archived");
  }

  return flags;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function CatalogAdmin({
  initialProducts,
  storageReady,
  storageMode,
}: CatalogAdminProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [products, setProducts] = useState(() => sortAdminProducts(initialProducts));
  const [catalogReady, setCatalogReady] = useState(storageReady);
  const [catalogModeState, setCatalogModeState] = useState<CatalogStorageMode>(storageMode);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CatalogProductInput>(() => createEmptyCatalogProductDraft());
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [attributeDrafts, setAttributeDrafts] = useState<AttributeFormState>({
    collection: { from: "", to: "" },
    color: { from: "", to: "" },
    size: { from: "", to: "" },
  });

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [products],
  );

  const collections = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.collection).filter(Boolean))).sort((left, right) =>
        left.localeCompare(right),
      ),
    [products],
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) => product.variants.map((variant) => variant.color).filter(Boolean)),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [products],
  );

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) =>
            product.variants.flatMap((variant) => variant.sizes.map((size) => size.label).filter(Boolean)),
          ),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [products],
  );

  const metrics = useMemo(() => {
    return {
      totalProducts: products.length,
      inStock: products.filter(
        (product) => getAdminProductInventorySummary(product).status === "in_stock",
      ).length,
      lowStock: products.filter(
        (product) => getAdminProductInventorySummary(product).status === "low_stock",
      ).length,
      soldOut: products.filter(
        (product) => getAdminProductInventorySummary(product).status === "sold_out",
      ).length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      if (normalizedQuery && !buildAdminProductSearchText(product).includes(normalizedQuery)) {
        return false;
      }

      if (categoryFilter !== "All" && product.category !== categoryFilter) {
        return false;
      }

      if (stockFilter !== "all") {
        return getAdminProductInventorySummary(product).status === stockFilter;
      }

      return true;
    });
  }, [categoryFilter, products, query, stockFilter]);

  const previewImage = draft.imageSrc.trim()
    ? {
        src: draft.imageSrc,
        alt: draft.imageAlt || draft.name || "Product preview",
        position: draft.imagePosition || "center center",
      }
    : null;

  const previewGalleryImages = draft.galleryImages.filter(
    (image) => image.src.trim().length > 0 && image.alt.trim().length > 0,
  );
  const draftInventory = useMemo(() => getDraftInventorySummary(draft), [draft]);

  useEffect(() => {
    if (slugTouched) {
      return;
    }

    const nextSlug = slugifyAdminProductName(draft.name);

    setDraft((currentDraft) =>
      currentDraft.slug === nextSlug ? currentDraft : { ...currentDraft, slug: nextSlug },
    );
  }, [draft.name, slugTouched]);

  function scrollFormIntoView() {
    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function resetDraft() {
    setEditingId(null);
    setDraft(createEmptyCatalogProductDraft());
    setSlugTouched(false);
    setNotice(null);
    scrollFormIntoView();
  }

  function startEditing(product: CatalogProduct) {
    setEditingId(product.id);
    setDraft(createCatalogDraftFromProduct(product));
    setSlugTouched(true);
    setNotice(null);
    scrollFormIntoView();
  }

  function updateDraftField<Key extends keyof CatalogProductInput>(
    field: Key,
    value: CatalogProductInput[Key],
  ) {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  }

  function updateVariant(
    variantIndex: number,
    updater: (
      variant: CatalogProductInput["variants"][number],
    ) => CatalogProductInput["variants"][number],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      variants: currentDraft.variants.map((variant, index) =>
        index === variantIndex ? updater(variant) : variant,
      ),
    }));
  }

  function updateSize(
    variantIndex: number,
    sizeIndex: number,
    updater: (
      size: CatalogProductInput["variants"][number]["sizes"][number],
    ) => CatalogProductInput["variants"][number]["sizes"][number],
  ) {
    updateVariant(variantIndex, (variant) => ({
      ...variant,
      sizes: variant.sizes.map((size, index) => (index === sizeIndex ? updater(size) : size)),
    }));
  }

  function updateGalleryImage(
    imageIndex: number,
    updater: (
      image: CatalogProductInput["galleryImages"][number],
    ) => CatalogProductInput["galleryImages"][number],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      galleryImages: currentDraft.galleryImages.map((image, index) =>
        index === imageIndex ? updater(image) : image,
      ),
    }));
  }

  async function refreshCatalog(productIdToSelect?: string | null) {
    const response = await fetch("/api/catalog-products", { cache: "no-store" });
    const result = (await response.json()) as {
      products?: CatalogProduct[];
      storageReady?: boolean;
      storageMode?: CatalogStorageMode;
      error?: string;
    };

    if (response.status === 401) {
      window.location.href = "/admin/login?next=/admin";
      return;
    }

    if (!response.ok || !result.products) {
      throw new Error(result.error ?? "The product list could not be refreshed.");
    }

    const nextProducts = sortAdminProducts(result.products);
    setProducts(nextProducts);
    setCatalogReady(result.storageReady ?? true);
    setCatalogModeState(result.storageMode ?? "file");

    if (productIdToSelect) {
      const matchedProduct = nextProducts.find((product) => product.id === productIdToSelect);

      if (matchedProduct) {
        setEditingId(matchedProduct.id);
        setDraft(createCatalogDraftFromProduct(matchedProduct));
        setSlugTouched(true);
        return;
      }
    }

    if (editingId) {
      const matchedProduct = nextProducts.find((product) => product.id === editingId);

      if (!matchedProduct) {
        setEditingId(null);
        setDraft(createEmptyCatalogProductDraft());
        setSlugTouched(false);
      }
    }
  }

  async function persistProduct(
    input: CatalogProductInput,
    productId?: string,
    successMessage?: string,
  ) {
    setSubmitting(true);
    setNotice(null);

    try {
      const response = await fetch(
        productId ? `/api/catalog-products/${productId}` : "/api/catalog-products",
        {
          method: productId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(normalizeCatalogDraftPayload(input)),
        },
      );
      const result = (await response.json()) as {
        product?: CatalogProduct;
        error?: string;
      };

      if (response.status === 401) {
        window.location.href = "/admin/login?next=/admin";
        return;
      }

      if (!response.ok || !result.product) {
        throw new Error(result.error ?? "The bag could not be saved right now.");
      }

      await refreshCatalog(result.product.id);
      setNotice({
        tone: "success",
        message: successMessage ?? `${result.product.name} was saved.`,
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "The bag could not be saved right now.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await persistProduct(
      draft,
      editingId ?? undefined,
      editingId ? "Product updated." : "Product added.",
    );
  }

  async function handleMarkSoldOut(product: CatalogProduct) {
    await persistProduct(
      {
        ...createCatalogDraftFromProduct(product),
        inventoryStatusOverride: null,
        variants: product.variants.map((variant) => ({
          color: variant.color,
          swatch: variant.swatch,
          finish: variant.finish,
          imageSrc: variant.image.src === product.image.src ? "" : variant.image.src,
          imageAlt:
            variant.image.alt === `${variant.color} ${product.image.alt}` ? "" : variant.image.alt,
          imagePosition:
            variant.image.position === (product.image.position ?? "center center")
              ? ""
              : (variant.image.position ?? ""),
          sizes: variant.sizes.map((size) => ({
            label: size.label,
            stock: 0,
          })),
        })),
      },
      product.id,
      `${product.name} is now marked sold out.`,
    );
  }

  async function handleTogglePublished(product: CatalogProduct) {
    await persistProduct(
      {
        ...createCatalogDraftFromProduct(product),
        isPublished: !product.isPublished,
      },
      product.id,
      product.isPublished
        ? `${product.name} is now hidden from the storefront.`
        : `${product.name} is visible on the storefront again.`,
    );
  }

  async function handleRenameAttribute(kind: AttributeKind) {
    const formState = attributeDrafts[kind];

    if (!formState.from || !formState.to.trim()) {
      setNotice({
        tone: "error",
        message: "Choose the current label and add the replacement label first.",
      });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await fetch("/api/catalog-attributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          from: formState.from,
          to: formState.to.trim(),
        }),
      });
      const result = (await response.json()) as {
        count?: number;
        error?: string;
      };

      if (response.status === 401) {
        window.location.href = "/admin/login?next=/admin";
        return;
      }

      if (!response.ok) {
        throw new Error(result.error ?? "The labels could not be updated.");
      }

      await refreshCatalog(editingId ?? undefined);
      setAttributeDrafts((current) => ({
        ...current,
        [kind]: { from: "", to: "" },
      }));
      setNotice({
        tone: "success",
        message:
          result.count && result.count > 0
            ? `${titleCase(kind)} updated on ${result.count} product${result.count === 1 ? "" : "s"}.`
            : `No matching ${kind} labels needed updating.`,
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "The labels could not be updated.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="space-y-6">
          <section className="rounded-[1.8rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.9)] p-6 shadow-[0_20px_38px_rgba(32,24,20,0.04)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(94,67,39,0.58)]">
                  Admin overview
                </p>
                <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-[var(--color-ink)] sm:text-[2.4rem]">
                  Practical catalog control for the store owner.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[rgba(29,29,31,0.58)]">
                  Add bags, correct stock, and keep the storefront accurate without a complicated
                  dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.92)] px-4 py-2 text-sm font-medium text-[rgba(29,29,31,0.68)]">
                  {getStorageLabel(catalogModeState)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${
                    catalogReady
                      ? "border-[rgba(46,94,70,0.14)] bg-[rgba(226,242,232,0.86)] text-[rgba(25,70,49,0.9)]"
                      : "border-[rgba(159,109,46,0.14)] bg-[rgba(252,241,224,0.92)] text-[rgba(126,84,34,0.92)]"
                  }`}
                >
                  {catalogReady ? "Storage ready" : "Fallback mode"}
                </span>
                <button
                  type="button"
                  onClick={resetDraft}
                  className="cta-button"
                  disabled={submitting}
                >
                  Add new bag
                </button>
              </div>
            </div>

            {notice ? (
              <div
                className={`mt-5 rounded-[1.25rem] border px-4 py-3 text-sm leading-7 ${
                  notice.tone === "error"
                    ? "border-[rgba(153,78,66,0.14)] bg-[rgba(247,229,225,0.94)] text-[rgba(127,54,44,0.92)]"
                    : "border-[rgba(46,94,70,0.14)] bg-[rgba(226,242,232,0.86)] text-[rgba(25,70,49,0.9)]"
                }`}
              >
                {notice.message}
              </div>
            ) : null}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total bags"
              value={`${metrics.totalProducts}`}
              note="All products currently in the catalog."
            />
            <MetricCard
              label="In stock"
              value={`${metrics.inStock}`}
              note="Ready for normal purchase or reserve."
            />
            <MetricCard
              label="Low stock"
              value={`${metrics.lowStock}`}
              note="Needs attention soon."
            />
            <MetricCard
              label="Sold out"
              value={`${metrics.soldOut}`}
              note="Unavailable in current inventory."
            />
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(32,24,20,0.08)] bg-white p-6 shadow-[0_20px_38px_rgba(32,24,20,0.04)]">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(94,67,39,0.58)]">
                Catalog labels
              </p>
              <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                Rename shared collections, colors, and sizes.
              </h2>
              <p className="text-sm leading-7 text-[rgba(29,29,31,0.58)]">
                Use this when the owner wants to clean up a label across multiple products at once.
                New labels can still be added directly in the product form.
              </p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <AttributeManagerCard
                title="Collections"
                description="Rename a collection or brand label everywhere it appears."
                options={collections}
                currentValue={attributeDrafts.collection.from}
                replacementValue={attributeDrafts.collection.to}
                onCurrentValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    collection: { ...current.collection, from: value },
                  }))
                }
                onReplacementValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    collection: { ...current.collection, to: value },
                  }))
                }
                onSubmit={() => handleRenameAttribute("collection")}
                submitting={submitting}
              />

              <AttributeManagerCard
                title="Colors"
                description="Rename a colorway label across all matching bags."
                options={colors}
                currentValue={attributeDrafts.color.from}
                replacementValue={attributeDrafts.color.to}
                onCurrentValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    color: { ...current.color, from: value },
                  }))
                }
                onReplacementValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    color: { ...current.color, to: value },
                  }))
                }
                onSubmit={() => handleRenameAttribute("color")}
                submitting={submitting}
              />

              <AttributeManagerCard
                title="Sizes"
                description="Rename a size label across all matching products."
                options={sizes}
                currentValue={attributeDrafts.size.from}
                replacementValue={attributeDrafts.size.to}
                onCurrentValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    size: { ...current.size, from: value },
                  }))
                }
                onReplacementValueChange={(value) =>
                  setAttributeDrafts((current) => ({
                    ...current,
                    size: { ...current.size, to: value },
                  }))
                }
                onSubmit={() => handleRenameAttribute("size")}
                submitting={submitting}
              />
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(32,24,20,0.08)] bg-white p-6 shadow-[0_20px_38px_rgba(32,24,20,0.04)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(94,67,39,0.58)]">
                  Product list
                </p>
                <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                  Search products and check stock at a glance.
                </h2>
              </div>
              <p className="text-sm leading-7 text-[rgba(29,29,31,0.58)]">
                Showing {filteredProducts.length} of {products.length} bags.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1.3fr)_0.9fr_0.8fr]">
              <label className="space-y-2">
                <span className="field-label">Search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="field-control"
                  placeholder="Search name, slug, brand, color, or tag"
                />
              </label>
              <label className="space-y-2">
                <span className="field-label">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="field-control"
                >
                  <option value="All">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="field-label">Stock status</span>
                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value as StockFilter)}
                  className="field-control"
                >
                  <option value="all">All stock states</option>
                  <option value="in_stock">In stock</option>
                  <option value="low_stock">Low stock</option>
                  <option value="sold_out">Sold out</option>
                </select>
              </label>
            </div>

            <div className="mt-6 space-y-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const inventory = getAdminProductInventorySummary(product);
                  const priceSummary = getAdminProductPriceSummary(product);
                  const colorsText = getProductColorLabels(product).join(", ");
                  const sizesText = getProductSizeLabels(product).join(", ");
                  const flags = getProductFlags(product);

                  return (
                    <article
                      key={product.id}
                      className={`rounded-[1.5rem] border p-4 transition-[border-color,box-shadow] ${
                        editingId === product.id
                          ? "border-[rgba(32,24,20,0.18)] bg-[rgba(255,255,255,0.96)] shadow-[0_18px_36px_rgba(32,24,20,0.06)]"
                          : "border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.78)]"
                      }`}
                    >
                      <div className="grid gap-4 xl:grid-cols-[5.5rem_minmax(0,1.5fr)_1fr_0.95fr_auto] xl:items-center">
                        <div className="w-[5.5rem]">
                          <ProductImage
                            src={product.image.src}
                            alt={product.image.alt}
                            position={product.image.position}
                            className="h-[7rem] rounded-[1.1rem] border border-[rgba(32,24,20,0.08)]"
                            sizes="88px"
                          />
                        </div>

                        <div className="min-w-0 space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.58)]">
                            {product.collection} / {product.category}
                          </p>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                                {product.name}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-[rgba(29,29,31,0.58)]">
                                {product.slug}
                              </p>
                            </div>
                            <StatusBadge status={inventory.status} />
                          </div>

                          {flags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {flags.map((flag) => (
                                <span
                                  key={`${product.id}-${flag}`}
                                  className="inline-flex rounded-full border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.65)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(29,29,31,0.62)]"
                                >
                                  {flag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.58)]">
                              Colors
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
                              {colorsText || "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.58)]">
                              Sizes
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
                              {sizesText || "Not set"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.58)]">
                              Price
                            </p>
                            <p className="mt-2 text-base font-semibold text-[var(--color-accent-strong)]">
                              {formatPrice(priceSummary.displayPrice)}
                            </p>
                            {priceSummary.compareAtPrice ? (
                              <p className="text-sm leading-6 text-[rgba(29,29,31,0.48)] line-through">
                                {formatPrice(priceSummary.compareAtPrice)}
                              </p>
                            ) : null}
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(94,67,39,0.58)]">
                              Stock
                            </p>
                            <p className="mt-2 text-base font-semibold text-[var(--color-ink)]">
                              {inventory.quantity} total
                            </p>
                            <p className="text-sm leading-6 text-[rgba(29,29,31,0.54)]">
                              Threshold {inventory.threshold}
                              {inventory.hasOverride ? " / manual override" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          <button
                            type="button"
                            onClick={() => startEditing(product)}
                            className="ghost-button"
                            disabled={submitting}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePublished(product)}
                            className="ghost-button"
                            disabled={submitting}
                          >
                            {product.isPublished ? "Hide" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkSoldOut(product)}
                            className="ghost-button"
                            disabled={submitting}
                          >
                            Sold out
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[1.5rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.6)] px-5 py-6 text-sm leading-7 text-[rgba(29,29,31,0.58)]">
                  No bags match the current filters.
                </div>
              )}
            </div>
          </section>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-[1.8rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(255,255,255,0.94)] p-6 shadow-[0_20px_38px_rgba(32,24,20,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(94,67,39,0.58)]">
                  {editingId ? "Edit bag" : "Add bag"}
                </p>
                <h2 className="mt-2 text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--color-ink)]">
                  {editingId ? draft.name || "Update selected bag" : "Create a new bag"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {editingId ? (
                  <button type="button" onClick={resetDraft} className="ghost-button">
                    Cancel
                  </button>
                ) : null}
                {editingId && draft.slug ? (
                  <Link href={`/services/${draft.slug}`} className="ghost-button" target="_blank">
                    View live
                  </Link>
                ) : null}
                <button type="submit" className="cta-button" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Save changes" : "Add bag"}
                </button>
              </div>
            </div>
          </section>

          <Section
            title="Basic product info"
            description="Keep the first section focused on what the owner needs most often."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="field-label">Product name</span>
                <input
                  value={draft.name}
                  onChange={(event) => updateDraftField("name", event.target.value)}
                  className="field-control"
                  placeholder="David Jones Taupe Carryall"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Slug</span>
                <input
                  value={draft.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateDraftField("slug", slugifyAdminProductName(event.target.value));
                  }}
                  className="field-control"
                  placeholder="david-jones-taupe-carryall"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Collection</span>
                <input
                  list="admin-collection-options"
                  value={draft.collection}
                  onChange={(event) => updateDraftField("collection", event.target.value)}
                  className="field-control"
                  placeholder="David Jones"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Category</span>
                <input
                  list="admin-category-options"
                  value={draft.category}
                  onChange={(event) => updateDraftField("category", event.target.value)}
                  className="field-control"
                  placeholder="Shoulder Bag"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Occasion</span>
                <input
                  value={draft.occasion}
                  onChange={(event) => updateDraftField("occasion", event.target.value)}
                  className="field-control"
                  placeholder="Workday carry"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Display order</span>
                <input
                  type="number"
                  min={0}
                  value={draft.displayOrder}
                  onChange={(event) =>
                    updateDraftField("displayOrder", Number(event.target.value) || 0)
                  }
                  className="field-control"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Price (MMK)</span>
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(event) => updateDraftField("price", Number(event.target.value) || 0)}
                  className="field-control"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Sale price (optional)</span>
                <input
                  type="number"
                  min={0}
                  value={draft.salePrice ?? ""}
                  onChange={(event) =>
                    updateDraftField(
                      "salePrice",
                      event.target.value === "" ? null : Number(event.target.value) || 0,
                    )
                  }
                  className="field-control"
                  placeholder="Leave blank if not on sale"
                />
              </label>
            </div>
          </Section>

          <Section
            title="Storefront visibility"
            description="These switches control where the bag appears and how inventory status is shown."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="field-label">Low stock threshold</span>
                <input
                  type="number"
                  min={1}
                  value={draft.inventoryThreshold}
                  onChange={(event) =>
                    updateDraftField("inventoryThreshold", Number(event.target.value) || 1)
                  }
                  className="field-control"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Manual stock status override</span>
                <select
                  value={draft.inventoryStatusOverride ?? ""}
                  onChange={(event) =>
                    updateDraftField(
                      "inventoryStatusOverride",
                      event.target.value === ""
                        ? null
                        : (event.target.value as CatalogInventoryStatus),
                    )
                  }
                  className="field-control"
                >
                  <option value="">Automatic from stock</option>
                  <option value="in_stock">In stock</option>
                  <option value="low_stock">Low stock</option>
                  <option value="sold_out">Sold out</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ToggleField
                label="Published on storefront"
                checked={draft.isPublished}
                onChange={(checked) => updateDraftField("isPublished", checked)}
                hint="Turn this off to hide the bag without deleting it."
              />
              <ToggleField
                label="Featured bag"
                checked={draft.isFeatured}
                onChange={(checked) => updateDraftField("isFeatured", checked)}
                hint="Shows earlier in curated storefront sections."
              />
              <ToggleField
                label="New arrival"
                checked={draft.isNewArrival}
                onChange={(checked) => updateDraftField("isNewArrival", checked)}
                hint="Places the bag into the new-arrivals logic."
              />
              <ToggleField
                label="Trending"
                checked={draft.isTrending}
                onChange={(checked) => updateDraftField("isTrending", checked)}
                hint="Marks the bag as a popular product in recommendations."
              />
              <ToggleField
                label="Archived"
                checked={draft.isArchived}
                onChange={(checked) => updateDraftField("isArchived", checked)}
                hint="Keeps the product in admin, but removes it from public browsing."
              />
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.6)] px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={draftInventory.status} />
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {draftInventory.quantity} total pieces
                </p>
                <p className="text-sm text-[rgba(29,29,31,0.56)]">
                  Automatic status: {formatInventoryStatusLabel(draftInventory.autoStatus)}
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Descriptions and labels"
            description="Keep the copy tight. Product cards should rely mostly on image, name, and price."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Short description</span>
                <textarea
                  value={draft.shortDescription}
                  onChange={(event) => updateDraftField("shortDescription", event.target.value)}
                  className="field-control min-h-[7rem]"
                  placeholder="Short, practical product summary."
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Full description</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => updateDraftField("description", event.target.value)}
                  className="field-control min-h-[8rem]"
                  placeholder="Full description for the product detail page."
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Material</span>
                <input
                  value={draft.material}
                  onChange={(event) => updateDraftField("material", event.target.value)}
                  className="field-control"
                  placeholder="Pebbled faux leather"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Detail note</span>
                <input
                  value={draft.detail}
                  onChange={(event) => updateDraftField("detail", event.target.value)}
                  className="field-control"
                  placeholder="Zip closure, detachable strap"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Dimensions</span>
                <input
                  value={draft.dimensions}
                  onChange={(event) => updateDraftField("dimensions", event.target.value)}
                  className="field-control"
                  placeholder="24 x 16 x 8 cm"
                />
              </label>

              <label className="space-y-2">
                <span className="field-label">Strap length</span>
                <input
                  value={draft.strapLength}
                  onChange={(event) => updateDraftField("strapLength", event.target.value)}
                  className="field-control"
                  placeholder="Adjustable shoulder strap"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Hardware finish</span>
                <input
                  value={draft.hardwareFinish}
                  onChange={(event) => updateDraftField("hardwareFinish", event.target.value)}
                  className="field-control"
                  placeholder="Brushed gold hardware"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Badges</span>
                <textarea
                  value={draft.badges.join(", ")}
                  onChange={(event) => updateDraftField("badges", parseListInput(event.target.value))}
                  className="field-control min-h-[5.5rem]"
                  placeholder="Best seller, Workday carry"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Tags</span>
                <textarea
                  value={(draft.tags ?? []).join(", ")}
                  onChange={(event) => updateDraftField("tags", parseListInput(event.target.value))}
                  className="field-control min-h-[5.5rem]"
                  placeholder="taupe, structured, office"
                />
              </label>
            </div>
          </Section>

          <Section
            title="Images"
            description="Use direct site paths or full URLs. Gallery images are optional but useful for the detail page."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Main image path</span>
                <input
                  value={draft.imageSrc}
                  onChange={(event) => updateDraftField("imageSrc", event.target.value)}
                  className="field-control"
                  placeholder="/products/david-jones/taupe-carryall.jpg"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Main image alt</span>
                <input
                  value={draft.imageAlt}
                  onChange={(event) => updateDraftField("imageAlt", event.target.value)}
                  className="field-control"
                  placeholder="Describe the bag image clearly."
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="field-label">Main image position</span>
                <input
                  value={draft.imagePosition}
                  onChange={(event) => updateDraftField("imagePosition", event.target.value)}
                  className="field-control"
                  placeholder="center center"
                />
              </label>
            </div>

            {previewImage ? (
              <div className="rounded-[1.25rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.54)] p-4">
                <ProductImage
                  src={previewImage.src}
                  alt={previewImage.alt}
                  position={previewImage.position}
                  className="min-h-[16rem] rounded-[1.2rem]"
                  sizes="(max-width: 1280px) 100vw, 420px"
                />
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--color-ink)]">Gallery images</p>
                <button
                  type="button"
                  onClick={() =>
                    updateDraftField("galleryImages", [
                      ...draft.galleryImages,
                      { src: "", alt: "", position: "center center" },
                    ])
                  }
                  className="ghost-button"
                >
                  Add gallery image
                </button>
              </div>

              {draft.galleryImages.length > 0 ? (
                <div className="space-y-3">
                  {draft.galleryImages.map((image, imageIndex) => (
                    <div
                      key={`gallery-${imageIndex}`}
                      className="grid gap-3 rounded-[1.2rem] border border-[rgba(32,24,20,0.08)] bg-white p-4"
                    >
                      <label className="space-y-2">
                        <span className="field-label">Image path</span>
                        <input
                          value={image.src}
                          onChange={(event) =>
                            updateGalleryImage(imageIndex, (currentImage) => ({
                              ...currentImage,
                              src: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="/products/david-jones/gallery-1.jpg"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="field-label">Alt text</span>
                        <input
                          value={image.alt}
                          onChange={(event) =>
                            updateGalleryImage(imageIndex, (currentImage) => ({
                              ...currentImage,
                              alt: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="Describe this gallery image"
                        />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <label className="space-y-2">
                          <span className="field-label">Image position</span>
                          <input
                            value={image.position ?? ""}
                            onChange={(event) =>
                              updateGalleryImage(imageIndex, (currentImage) => ({
                                ...currentImage,
                                position: event.target.value,
                              }))
                            }
                            className="field-control"
                            placeholder="center center"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateDraftField(
                              "galleryImages",
                              draft.galleryImages.filter((_, currentIndex) => currentIndex !== imageIndex),
                            )
                          }
                          className="ghost-button self-end"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-[rgba(29,29,31,0.54)]">
                  No gallery images added yet.
                </p>
              )}

              {previewGalleryImages.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {previewGalleryImages.slice(0, 3).map((image) => (
                    <div
                      key={`${image.src}-${image.alt}`}
                      className="rounded-[1.15rem] border border-[rgba(32,24,20,0.08)] bg-[rgba(246,241,234,0.54)] p-3"
                    >
                      <ProductImage
                        src={image.src}
                        alt={image.alt}
                        position={image.position}
                        className="min-h-[9rem] rounded-[0.95rem]"
                        sizes="(max-width: 1280px) 100vw, 200px"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Section>

          <Section
            title="Colors, sizes, and stock"
            description="Add each colorway once, then assign the sizes and stock counts underneath it."
          >
            <div className="space-y-4">
              {draft.variants.map((variant, variantIndex) => {
                const variantQuantity = variant.sizes.reduce(
                  (sum, size) => sum + (Number.isFinite(size.stock) ? Math.max(size.stock, 0) : 0),
                  0,
                );

                return (
                  <div
                    key={`${variantIndex}-${variant.color || "variant"}`}
                    className="space-y-4 rounded-[1.25rem] border border-[rgba(32,24,20,0.08)] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-ink)]">
                          Colorway {variantIndex + 1}
                        </p>
                        <p className="text-sm leading-6 text-[rgba(29,29,31,0.56)]">
                          {variantQuantity} pieces across this colorway.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraftField(
                            "variants",
                            draft.variants.filter((_, currentIndex) => currentIndex !== variantIndex),
                          )
                        }
                        className="ghost-button"
                        disabled={draft.variants.length === 1}
                      >
                        Remove colorway
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="field-label">Color</span>
                        <input
                          list="admin-color-options"
                          value={variant.color}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              color: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="Taupe"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="field-label">Swatch</span>
                        <input
                          value={variant.swatch}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              swatch: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="#84796d"
                        />
                      </label>

                      <label className="space-y-2 sm:col-span-2">
                        <span className="field-label">Finish note</span>
                        <input
                          value={variant.finish}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              finish: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="Soft pebble grain"
                        />
                      </label>

                      <label className="space-y-2 sm:col-span-2">
                        <span className="field-label">Variant image path (optional)</span>
                        <input
                          value={variant.imageSrc}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              imageSrc: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="Leave blank to use the main image"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="field-label">Variant image alt</span>
                        <input
                          value={variant.imageAlt}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              imageAlt: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="Optional variant image alt"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="field-label">Variant image position</span>
                        <input
                          value={variant.imagePosition}
                          onChange={(event) =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              imagePosition: event.target.value,
                            }))
                          }
                          className="field-control"
                          placeholder="center center"
                        />
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--color-ink)]">Sizes and stock</p>
                        <button
                          type="button"
                          onClick={() =>
                            updateVariant(variantIndex, (currentVariant) => ({
                              ...currentVariant,
                              sizes: [...currentVariant.sizes, { label: "Standard", stock: 0 }],
                            }))
                          }
                          className="ghost-button"
                        >
                          Add size row
                        </button>
                      </div>

                      {variant.sizes.map((size, sizeIndex) => (
                        <div
                          key={`${variantIndex}-${sizeIndex}-${size.label || "size"}`}
                          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_auto]"
                        >
                          <input
                            list="admin-size-options"
                            value={size.label}
                            onChange={(event) =>
                              updateSize(variantIndex, sizeIndex, (currentSize) => ({
                                ...currentSize,
                                label: event.target.value,
                              }))
                            }
                            className="field-control"
                            placeholder="Standard"
                          />
                          <input
                            type="number"
                            min={0}
                            value={size.stock}
                            onChange={(event) =>
                              updateSize(variantIndex, sizeIndex, (currentSize) => ({
                                ...currentSize,
                                stock: Number(event.target.value) || 0,
                              }))
                            }
                            className="field-control"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateVariant(variantIndex, (currentVariant) => ({
                                ...currentVariant,
                                sizes: currentVariant.sizes.filter(
                                  (_, currentIndex) => currentIndex !== sizeIndex,
                                ),
                              }))
                            }
                            className="ghost-button"
                            disabled={variant.sizes.length === 1}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                updateDraftField("variants", [
                  ...draft.variants,
                  {
                    color: "",
                    swatch: "#c9b39b",
                    finish: "",
                    imageSrc: "",
                    imageAlt: "",
                    imagePosition: "center center",
                    sizes: [{ label: "Standard", stock: 0 }],
                  },
                ])
              }
              className="ghost-button"
            >
              Add colorway
            </button>
          </Section>
        </form>
      </div>

      <datalist id="admin-collection-options">
        {collections.map((collection) => (
          <option key={collection} value={collection} />
        ))}
      </datalist>
      <datalist id="admin-category-options">
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <datalist id="admin-color-options">
        {colors.map((color) => (
          <option key={color} value={color} />
        ))}
      </datalist>
      <datalist id="admin-size-options">
        {sizes.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
    </>
  );
}

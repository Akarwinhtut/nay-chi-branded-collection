import type { CatalogProductInput } from "@/lib/catalog";
import {
  getCatalogProductDisplayPrice,
  getCatalogProductInventory,
  type CatalogInventoryStatus,
  type CatalogProduct,
} from "@/lib/catalog-shared";

export function slugifyAdminProductName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createEmptyCatalogProductDraft(): CatalogProductInput {
  return {
    slug: "",
    name: "",
    collection: "",
    category: "",
    occasion: "",
    price: 0,
    salePrice: null,
    shortDescription: "",
    description: "",
    material: "",
    detail: "",
    badges: [],
    tags: [],
    imageSrc: "",
    imageAlt: "",
    imagePosition: "center center",
    galleryImages: [],
    dimensions: "",
    strapLength: "",
    hardwareFinish: "",
    inventoryThreshold: 2,
    inventoryStatusOverride: null,
    isTrending: false,
    isArchived: false,
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

export function createCatalogDraftFromProduct(product: CatalogProduct): CatalogProductInput {
  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection,
    category: product.category,
    occasion: product.occasion,
    price: product.price,
    salePrice: product.salePrice ?? null,
    shortDescription: product.shortDescription,
    description: product.description,
    material: product.material,
    detail: product.detail,
    badges: [...product.badges],
    tags: [...(product.tags ?? [])],
    imageSrc: product.image.src,
    imageAlt: product.image.alt,
    imagePosition: product.image.position ?? "center center",
    galleryImages: (product.galleryImages ?? []).map((image) => ({
      src: image.src,
      alt: image.alt,
      position: image.position ?? "center center",
    })),
    dimensions: product.dimensions ?? "",
    strapLength: product.strapLength ?? "",
    hardwareFinish: product.hardwareFinish ?? "",
    inventoryThreshold: product.inventoryThreshold ?? 2,
    inventoryStatusOverride: product.inventoryStatusOverride ?? null,
    isTrending: product.isTrending ?? false,
    isArchived: product.isArchived ?? false,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isPublished: product.isPublished,
    displayOrder: product.displayOrder,
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
        stock: size.stock,
      })),
    })),
  };
}

export function normalizeCatalogDraftPayload(draft: CatalogProductInput): CatalogProductInput {
  return {
    ...draft,
    slug: slugifyAdminProductName(draft.slug || draft.name),
    badges: draft.badges.map((badge) => badge.trim()).filter(Boolean),
    tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    salePrice:
      typeof draft.salePrice === "number" && draft.salePrice > 0 ? draft.salePrice : null,
    imagePosition: draft.imagePosition?.trim() || "center center",
    dimensions: draft.dimensions.trim(),
    strapLength: draft.strapLength.trim(),
    hardwareFinish: draft.hardwareFinish.trim(),
    galleryImages: draft.galleryImages
      .map((image) => ({
        src: image.src.trim(),
        alt: image.alt.trim(),
        position: image.position?.trim() || "center center",
      }))
      .filter((image) => image.src.length > 0 && image.alt.length > 0),
    variants: draft.variants.map((variant) => ({
      ...variant,
      color: variant.color.trim(),
      finish: variant.finish.trim(),
      imageSrc: variant.imageSrc?.trim() ?? "",
      imageAlt: variant.imageAlt?.trim() ?? "",
      imagePosition: variant.imagePosition?.trim() ?? "",
      sizes: variant.sizes.map((size) => ({
        label: size.label.trim(),
        stock: Number.isFinite(size.stock) ? Math.max(0, size.stock) : 0,
      })),
    })),
  };
}

export function formatInventoryStatusLabel(status: CatalogInventoryStatus) {
  if (status === "in_stock") {
    return "In stock";
  }

  if (status === "low_stock") {
    return "Low stock";
  }

  return "Sold out";
}

export function sortAdminProducts(products: CatalogProduct[]) {
  return [...products].sort((left, right) => {
    if (left.isArchived !== right.isArchived) {
      return left.isArchived ? 1 : -1;
    }

    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

export function buildAdminProductSearchText(product: CatalogProduct) {
  return [
    product.name,
    product.slug,
    product.collection,
    product.category,
    product.occasion,
    product.material,
    product.detail,
    product.badges.join(" "),
    (product.tags ?? []).join(" "),
    product.variants.map((variant) => variant.color).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function getAdminProductPriceSummary(product: CatalogProduct) {
  const displayPrice = getCatalogProductDisplayPrice(product);
  return {
    displayPrice,
    compareAtPrice: displayPrice < product.price ? product.price : null,
  };
}

export function getAdminProductInventorySummary(product: CatalogProduct) {
  return getCatalogProductInventory(product);
}

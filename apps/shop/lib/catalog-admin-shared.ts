import type { CatalogProductInput } from "@/lib/catalog";
import {
  getCatalogProductDisplayPrice,
  getCatalogProductInventory,
  type CatalogInventoryStatus,
  type CatalogProduct,
} from "@/lib/catalog-shared";

const adminColorSwatches: Record<string, string> = {
  black: "#1f1b18",
  brown: "#6f4e37",
  camel: "#b78b58",
  taupe: "#8b7d70",
  beige: "#cdbba5",
  ivory: "#e8e0d4",
  cream: "#efe7da",
  white: "#f4f1eb",
  pearl: "#ddd4cb",
  grey: "#8c8a84",
  gray: "#8c8a84",
  silver: "#b8b4ae",
  gold: "#b69a63",
  olive: "#6b6c53",
  green: "#617159",
  navy: "#2f405f",
  blue: "#496186",
  red: "#92433f",
  burgundy: "#6d3131",
  pink: "#cfb0b3",
};

export function resolveAdminColorSwatch(color: string, fallback = "#c9b39b") {
  const normalized = color.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  return adminColorSwatches[normalized] ?? fallback;
}

export function createEmptyCatalogVariantDraft(color = "") {
  return {
    color,
    swatch: resolveAdminColorSwatch(color),
    finish: "",
    imageSrc: "",
    imageAlt: "",
    imagePosition: "center center",
    sizes: [{ label: "Standard", stock: 0 }],
  };
}

function createFallbackDescription(shortDescription: string) {
  const trimmed = shortDescription.trim();

  if (trimmed.length >= 20) {
    return trimmed;
  }

  if (trimmed.length > 0) {
    return `${trimmed} Available in selected colors and sizes.`;
  }

  return "";
}

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
    variants: [],
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
  const name = draft.name.trim();
  const category = draft.category.trim();
  const shortDescription = draft.shortDescription.trim();
  const fullDescription = draft.description.trim() || createFallbackDescription(shortDescription);
  const normalizedVariants = draft.variants
    .map((variant) => {
      const color = variant.color.trim();
      const normalizedSizes = variant.sizes
        .map((size) => ({
          label: size.label.trim(),
          stock: Number.isFinite(size.stock) ? Math.max(0, size.stock) : 0,
        }))
        .filter((size) => size.label.length > 0 || size.stock > 0);

      return {
        ...variant,
        color,
        swatch: resolveAdminColorSwatch(color, variant.swatch),
        finish: variant.finish.trim() || "Refined finish",
        imageSrc: variant.imageSrc?.trim() ?? "",
        imageAlt: variant.imageAlt?.trim() ?? "",
        imagePosition: variant.imagePosition?.trim() ?? "",
        sizes:
          normalizedSizes.length > 0
            ? normalizedSizes.map((size) => ({
                label: size.label || "Standard",
                stock: size.stock,
              }))
            : [{ label: "Standard", stock: 0 }],
      };
    })
    .filter((variant) => variant.color.length > 0);

  return {
    ...draft,
    slug: slugifyAdminProductName(draft.slug || draft.name),
    name,
    collection: draft.collection.trim(),
    category,
    occasion: draft.occasion.trim() || category || "Boutique carry",
    shortDescription,
    description: fullDescription,
    material: draft.material.trim() || "Refined branded finish",
    detail: draft.detail.trim() || "Available in selected colors and sizes.",
    badges: draft.badges.map((badge) => badge.trim()).filter(Boolean),
    tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    salePrice:
      typeof draft.salePrice === "number" && draft.salePrice > 0 ? draft.salePrice : null,
    imageAlt: draft.imageAlt.trim() || (name ? `${name} bag` : "Branded handbag"),
    imagePosition: draft.imagePosition?.trim() || "center center",
    dimensions: draft.dimensions.trim(),
    strapLength: draft.strapLength.trim(),
    hardwareFinish: draft.hardwareFinish.trim(),
    galleryImages: draft.galleryImages
      .map((image, index) => ({
        src: image.src.trim(),
        alt: image.alt.trim() || (name ? `${name} view ${index + 1}` : `Bag view ${index + 1}`),
        position: image.position?.trim() || "center center",
      }))
      .filter((image) => image.src.length > 0),
    variants: normalizedVariants,
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

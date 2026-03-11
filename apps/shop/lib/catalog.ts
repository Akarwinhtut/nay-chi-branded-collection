import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { sortCatalogProducts } from "@/lib/catalog-shared";
import type { CatalogProduct } from "@/lib/catalog-shared";
import type { ImageAsset } from "@/lib/site-data";
import { products as seededProducts } from "@/lib/site-data";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase-admin";

const dataDirectoryPath = path.join(process.cwd(), "data");
const catalogFilePath = path.join(dataDirectoryPath, "catalog-products.json");
const catalogDetailsFilePath = path.join(dataDirectoryPath, "catalog-product-details.json");
const fileSeedTimestamp = "2026-03-10T00:00:00.000Z";
const duplicateSlugMessage = "That slug already exists. Change the slug and save again.";

function isValidImageSource(value: string) {
  return value.startsWith("/") || z.string().url().safeParse(value).success;
}

const imageSourceSchema = z
  .string()
  .trim()
  .refine(
    (value) => isValidImageSource(value),
    "Use a full image URL or a site path like /products/david-jones/bag.jpg.",
  );

const optionalImageSourceSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isValidImageSource(value),
    "Use a full image URL or a site path like /products/david-jones/bag.jpg.",
  );

const inventoryStatusSchema = z.enum(["in_stock", "low_stock", "sold_out"]);

const galleryImageSchema = z.object({
  src: imageSourceSchema,
  alt: z.string().trim().min(4, "Add image alt text.").max(180),
  position: z.string().trim().max(80).optional().or(z.literal("")),
});

const productSizeSchema = z.object({
  label: z.string().trim().min(1, "Add a size label.").max(40),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative.").max(999),
});

const productVariantSchema = z.object({
  color: z.string().trim().min(1, "Add a color name.").max(60),
  swatch: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #c9b39b."),
  finish: z.string().trim().min(1, "Add a finish note.").max(120),
  imageSrc: optionalImageSourceSchema.optional().or(z.literal("")),
  imageAlt: z.string().trim().max(180).optional().or(z.literal("")),
  imagePosition: z.string().trim().max(80).optional().or(z.literal("")),
  sizes: z.array(productSizeSchema).min(1, "Add at least one size."),
});

export const catalogProductInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Add a slug.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(2, "Add a product name.").max(120),
  collection: z.string().trim().min(2, "Add a collection name.").max(80),
  category: z.string().trim().min(2, "Add a category.").max(60),
  occasion: z.string().trim().min(2, "Add an occasion note.").max(80),
  price: z.coerce.number().min(0, "Price cannot be negative.").max(999999999),
  shortDescription: z.string().trim().min(12, "Add a shorter description.").max(220),
  description: z.string().trim().min(20, "Add a full description.").max(900),
  material: z.string().trim().min(2, "Add a material note.").max(120),
  detail: z.string().trim().min(8, "Add a detail note.").max(240),
  badges: z.array(z.string().trim().min(1).max(40)).max(8),
  imageSrc: imageSourceSchema,
  imageAlt: z.string().trim().min(4, "Add image alt text.").max(180),
  imagePosition: z.string().trim().max(80).optional().or(z.literal("")),
  salePrice: z.number().min(0, "Sale price cannot be negative.").max(999999999).nullable().default(null),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  galleryImages: z.array(galleryImageSchema).max(8, "Add up to 8 gallery images.").default([]),
  dimensions: z.string().trim().max(160).default(""),
  strapLength: z.string().trim().max(160).default(""),
  hardwareFinish: z.string().trim().max(120).default(""),
  inventoryThreshold: z.coerce.number().int().min(1).max(999).default(2),
  inventoryStatusOverride: inventoryStatusSchema.nullable().default(null),
  isTrending: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isPublished: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
  variants: z.array(productVariantSchema).min(1, "Add at least one colorway."),
}).refine(
  (input) => input.salePrice === null || input.salePrice < input.price,
  {
    path: ["salePrice"],
    message: "Sale price should be below the regular price.",
  },
);

export const catalogAttributeUpdateSchema = z
  .object({
    kind: z.enum(["collection", "color", "size"]),
    from: z.string().trim().min(1, "Choose the current label."),
    to: z.string().trim().min(1, "Add the replacement label."),
  })
  .refine((input) => input.from.toLowerCase() !== input.to.toLowerCase(), {
    path: ["to"],
    message: "Choose a different replacement label.",
  });

const fileCatalogRecordSchema = catalogProductInputSchema.extend({
  id: z.string().trim().min(1),
  createdAt: z.string().trim().min(1),
  updatedAt: z.string().trim().min(1),
});

const fileCatalogArraySchema = z.array(fileCatalogRecordSchema);

export type CatalogProductInput = z.infer<typeof catalogProductInputSchema>;
export type CatalogAttributeUpdateInput = z.infer<typeof catalogAttributeUpdateSchema>;
export type {
  CatalogProduct,
  CatalogRecommendation,
  CatalogStorageMode,
} from "@/lib/catalog-shared";
export {
  getCatalogCategories,
  getCatalogProductCompareAtPrice,
  getCatalogProductDisplayPrice,
  getCatalogProductInventory,
  getCatalogSearchText,
  getCatalogTotalColorways,
  getCatalogTotalInventory,
  getFeaturedCatalogProducts,
  getLatestCatalogProducts,
  getRecommendedCatalogSelections,
  getRecommendedCatalogProducts,
  getTrendingCatalogProducts,
} from "@/lib/catalog-shared";

type CatalogProductRow = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: string;
  occasion: string;
  price: number;
  short_description: string;
  description: string;
  material: string;
  detail: string;
  badges: string[] | null;
  image_src: string;
  image_alt: string;
  image_position: string | null;
  variants: unknown;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

const catalogProductDetailsSchema = z.object({
  id: z.string().trim().min(1),
  salePrice: z.number().min(0).max(999999999).nullable().default(null),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  galleryImages: z.array(galleryImageSchema).max(8).default([]),
  dimensions: z.string().trim().max(160).default(""),
  strapLength: z.string().trim().max(160).default(""),
  hardwareFinish: z.string().trim().max(120).default(""),
  inventoryThreshold: z.number().int().min(1).max(999).default(2),
  inventoryStatusOverride: inventoryStatusSchema.nullable().default(null),
  isTrending: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  updatedAt: z.string().trim().min(1).optional(),
});

const catalogProductDetailsArraySchema = z.array(catalogProductDetailsSchema);

type FileCatalogRecord = z.infer<typeof fileCatalogRecordSchema>;
type CatalogProductDetailsRecord = z.infer<typeof catalogProductDetailsSchema>;

export class CatalogConflictError extends Error {}

export class CatalogNotFoundError extends Error {}

export function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildImageAsset(input: {
  src: string;
  alt: string;
  position?: string | null;
}): ImageAsset {
  return {
    src: input.src,
    alt: input.alt,
    position: input.position || "center center",
  };
}

function normalizeBadges(badges: string[]) {
  return badges
    .map((badge) => badge.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeGalleryImages(
  galleryImages: CatalogProductInput["galleryImages"],
): ImageAsset[] {
  return galleryImages.map((image) =>
    buildImageAsset({
      src: image.src,
      alt: image.alt,
      position: image.position,
    }),
  );
}

function applyCatalogDetails(
  product: CatalogProduct,
  details?: Partial<CatalogProductDetailsRecord> | null,
): CatalogProduct {
  if (!details) {
    return {
      ...product,
      salePrice: product.salePrice ?? null,
      tags: product.tags ?? [],
      galleryImages: product.galleryImages ?? [],
      dimensions: product.dimensions ?? "",
      strapLength: product.strapLength ?? "",
      hardwareFinish: product.hardwareFinish ?? "",
      inventoryThreshold: product.inventoryThreshold ?? 2,
      inventoryStatusOverride: product.inventoryStatusOverride ?? null,
      isTrending: product.isTrending ?? false,
      isArchived: product.isArchived ?? false,
    };
  }

  const parsedDetails = catalogProductDetailsSchema.parse({
    id: details.id ?? product.id,
    salePrice: details.salePrice ?? product.salePrice ?? null,
    tags: details.tags ?? product.tags ?? [],
    galleryImages: details.galleryImages ?? product.galleryImages ?? [],
    dimensions: details.dimensions ?? product.dimensions ?? "",
    strapLength: details.strapLength ?? product.strapLength ?? "",
    hardwareFinish: details.hardwareFinish ?? product.hardwareFinish ?? "",
    inventoryThreshold: details.inventoryThreshold ?? product.inventoryThreshold ?? 2,
    inventoryStatusOverride:
      details.inventoryStatusOverride ?? product.inventoryStatusOverride ?? null,
    isTrending: details.isTrending ?? product.isTrending ?? false,
    isArchived: details.isArchived ?? product.isArchived ?? false,
    updatedAt: details.updatedAt,
  });

  return {
    ...product,
    salePrice: parsedDetails.salePrice,
    tags: parsedDetails.tags,
    galleryImages: normalizeGalleryImages(parsedDetails.galleryImages),
    dimensions: parsedDetails.dimensions,
    strapLength: parsedDetails.strapLength,
    hardwareFinish: parsedDetails.hardwareFinish,
    inventoryThreshold: parsedDetails.inventoryThreshold,
    inventoryStatusOverride: parsedDetails.inventoryStatusOverride,
    isTrending: parsedDetails.isTrending,
    isArchived: parsedDetails.isArchived,
  };
}

function createCatalogDetailsRecord(
  id: string,
  input: CatalogProductInput,
): CatalogProductDetailsRecord {
  return catalogProductDetailsSchema.parse({
    id,
    salePrice: input.salePrice,
    tags: input.tags,
    galleryImages: input.galleryImages,
    dimensions: input.dimensions,
    strapLength: input.strapLength,
    hardwareFinish: input.hardwareFinish,
    inventoryThreshold: input.inventoryThreshold,
    inventoryStatusOverride: input.inventoryStatusOverride,
    isTrending: input.isTrending,
    isArchived: input.isArchived,
    updatedAt: new Date().toISOString(),
  });
}

function normalizeVariants(
  variants: CatalogProductInput["variants"],
  productImage: ImageAsset,
) {
  return variants.map((variant) => ({
    color: variant.color,
    swatch: variant.swatch,
    finish: variant.finish,
    image: buildImageAsset({
      src: variant.imageSrc || productImage.src,
      alt: variant.imageAlt || `${variant.color} ${productImage.alt}`,
      position: variant.imagePosition || productImage.position,
    }),
    sizes: variant.sizes.map((size) => ({
      label: size.label,
      stock: size.stock,
    })),
  }));
}

function seededCatalogProducts(): CatalogProduct[] {
  return seededProducts.map((product, index) => ({
    ...product,
    id: `seed-${product.slug}`,
    createdAt: "",
    updatedAt: "",
    isFeatured: index < 3,
    isNewArrival: index >= Math.max(seededProducts.length - 3, 0),
    isPublished: true,
    displayOrder: index,
    source: "seed",
  }));
}

function mapRowToCatalogProduct(row: CatalogProductRow): CatalogProduct {
  const baseImage = buildImageAsset({
    src: row.image_src,
    alt: row.image_alt,
    position: row.image_position,
  });
  const normalizedVariants = Array.isArray(row.variants)
    ? row.variants.map((variant) => {
        const candidate =
          typeof variant === "object" && variant !== null
            ? (variant as Record<string, unknown>)
            : {};

        const rawSizes = Array.isArray(candidate.sizes) ? candidate.sizes : [];

        return {
          color: typeof candidate.color === "string" ? candidate.color : "",
          swatch: typeof candidate.swatch === "string" ? candidate.swatch : "#c9b39b",
          finish: typeof candidate.finish === "string" ? candidate.finish : "",
          imageSrc: typeof candidate.imageSrc === "string" ? candidate.imageSrc : "",
          imageAlt: typeof candidate.imageAlt === "string" ? candidate.imageAlt : "",
          imagePosition:
            typeof candidate.imagePosition === "string" ? candidate.imagePosition : "",
          sizes: rawSizes.map((size) => {
            const sizeCandidate =
              typeof size === "object" && size !== null ? (size as Record<string, unknown>) : {};

            return {
              label: typeof sizeCandidate.label === "string" ? sizeCandidate.label : "",
              stock:
                typeof sizeCandidate.stock === "number"
                  ? sizeCandidate.stock
                  : Number(sizeCandidate.stock ?? 0),
            };
          }),
        };
      })
    : [];
  const parsed = catalogProductInputSchema.parse({
    slug: row.slug,
    name: row.name,
    collection: row.collection,
    category: row.category,
    occasion: row.occasion,
    price: row.price,
    shortDescription: row.short_description,
    description: row.description,
    material: row.material,
    detail: row.detail,
    badges: Array.isArray(row.badges) ? row.badges : [],
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    imagePosition: row.image_position ?? "",
    isFeatured: row.is_featured,
    isNewArrival: row.is_new_arrival,
    isPublished: row.is_published,
    displayOrder: row.display_order,
    variants: normalizedVariants,
  });

  const baseProduct: CatalogProduct = {
    id: row.id,
    slug: parsed.slug,
    name: parsed.name,
    collection: parsed.collection,
    category: parsed.category,
    occasion: parsed.occasion,
    price: parsed.price,
    shortDescription: parsed.shortDescription,
    description: parsed.description,
    material: parsed.material,
    detail: parsed.detail,
    badges: normalizeBadges(parsed.badges),
    image: baseImage,
    variants: normalizeVariants(parsed.variants, baseImage),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFeatured: parsed.isFeatured,
    isNewArrival: parsed.isNewArrival,
    isPublished: parsed.isPublished,
    displayOrder: parsed.displayOrder,
    source: "database",
  };

  return applyCatalogDetails(baseProduct, {
    id: row.id,
    salePrice: parsed.salePrice,
    tags: parsed.tags,
    galleryImages: parsed.galleryImages,
    dimensions: parsed.dimensions,
    strapLength: parsed.strapLength,
    hardwareFinish: parsed.hardwareFinish,
    inventoryThreshold: parsed.inventoryThreshold,
    inventoryStatusOverride: parsed.inventoryStatusOverride,
    isTrending: parsed.isTrending,
    isArchived: parsed.isArchived,
  });
}

function mapFileRecordToCatalogProduct(record: FileCatalogRecord): CatalogProduct {
  const parsed = catalogProductInputSchema.parse(record);
  const baseImage = buildImageAsset({
    src: parsed.imageSrc,
    alt: parsed.imageAlt,
    position: parsed.imagePosition,
  });

  const baseProduct: CatalogProduct = {
    id: record.id,
    slug: parsed.slug,
    name: parsed.name,
    collection: parsed.collection,
    category: parsed.category,
    occasion: parsed.occasion,
    price: parsed.price,
    shortDescription: parsed.shortDescription,
    description: parsed.description,
    material: parsed.material,
    detail: parsed.detail,
    badges: normalizeBadges(parsed.badges),
    image: baseImage,
    variants: normalizeVariants(parsed.variants, baseImage),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    isFeatured: parsed.isFeatured,
    isNewArrival: parsed.isNewArrival,
    isPublished: parsed.isPublished,
    displayOrder: parsed.displayOrder,
    source: "file",
  };

  return applyCatalogDetails(baseProduct, {
    id: record.id,
    salePrice: parsed.salePrice,
    tags: parsed.tags,
    galleryImages: parsed.galleryImages,
    dimensions: parsed.dimensions,
    strapLength: parsed.strapLength,
    hardwareFinish: parsed.hardwareFinish,
    inventoryThreshold: parsed.inventoryThreshold,
    inventoryStatusOverride: parsed.inventoryStatusOverride,
    isTrending: parsed.isTrending,
    isArchived: parsed.isArchived,
  });
}

function sortFileCatalogRecords(records: FileCatalogRecord[]) {
  return [...records].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT",
  );
}

async function writeCatalogFileRecords(records: FileCatalogRecord[]) {
  await mkdir(dataDirectoryPath, { recursive: true });
  await writeFile(
    catalogFilePath,
    `${JSON.stringify(sortFileCatalogRecords(records), null, 2)}\n`,
    "utf8",
  );
}

async function writeCatalogDetailsRecords(records: CatalogProductDetailsRecord[]) {
  await mkdir(dataDirectoryPath, { recursive: true });
  await writeFile(
    catalogDetailsFilePath,
    `${JSON.stringify(records, null, 2)}\n`,
    "utf8",
  );
}

function seededFileCatalogRecords(): FileCatalogRecord[] {
  return seededCatalogProducts().map((product) => ({
    id: `local-${product.slug}`,
    ...createCatalogInputFromProduct(product),
    createdAt: fileSeedTimestamp,
    updatedAt: fileSeedTimestamp,
  }));
}

async function readCatalogFileRecords() {
  await mkdir(dataDirectoryPath, { recursive: true });

  try {
    const contents = await readFile(catalogFilePath, "utf8");
    const rawRecords = contents.trim().length > 0 ? JSON.parse(contents) : [];

    return fileCatalogArraySchema.parse(rawRecords);
  } catch (error) {
    if (isMissingFileError(error)) {
      const seededRecords = seededFileCatalogRecords();
      await writeCatalogFileRecords(seededRecords);
      return seededRecords;
    }

    throw error;
  }
}

async function readCatalogDetailsRecords() {
  await mkdir(dataDirectoryPath, { recursive: true });

  try {
    const contents = await readFile(catalogDetailsFilePath, "utf8");
    const rawRecords = contents.trim().length > 0 ? JSON.parse(contents) : [];

    return catalogProductDetailsArraySchema.parse(rawRecords);
  } catch (error) {
    if (isMissingFileError(error)) {
      await writeCatalogDetailsRecords([]);
      return [];
    }

    throw error;
  }
}

async function fetchFileProducts(includeUnpublished = false) {
  const records = await readCatalogFileRecords();
  const products = records.map((record) => mapFileRecordToCatalogProduct(record));

  return includeUnpublished
    ? sortCatalogProducts(products)
    : sortCatalogProducts(
        products.filter((product) => product.isPublished && !product.isArchived),
      );
}

function throwCatalogWriteError(
  action: "saved" | "updated" | "deleted",
  error: unknown,
): never {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  ) {
    throw new CatalogConflictError(duplicateSlugMessage);
  }

  throw new Error(`The bag could not be ${action} right now.`);
}

export function createEmptyCatalogProductInput(): CatalogProductInput {
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

export function createCatalogInputFromProduct(product: CatalogProduct): CatalogProductInput {
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

export function mapCatalogInputToInsert(input: CatalogProductInput) {
  const image = buildImageAsset({
    src: input.imageSrc,
    alt: input.imageAlt,
    position: input.imagePosition,
  });

  return {
    slug: input.slug,
    name: input.name,
    collection: input.collection,
    category: input.category,
    occasion: input.occasion,
    price: input.price,
    short_description: input.shortDescription,
    description: input.description,
    material: input.material,
    detail: input.detail,
    badges: normalizeBadges(input.badges),
    image_src: image.src,
    image_alt: image.alt,
    image_position: image.position ?? null,
    variants: input.variants.map((variant) => ({
      color: variant.color,
      swatch: variant.swatch,
      finish: variant.finish,
      imageSrc: variant.imageSrc || null,
      imageAlt: variant.imageAlt || null,
      imagePosition: variant.imagePosition || null,
      sizes: variant.sizes.map((size) => ({
        label: size.label,
        stock: size.stock,
      })),
    })),
    is_featured: input.isFeatured,
    is_new_arrival: input.isNewArrival,
    is_published: input.isPublished,
    display_order: input.displayOrder,
    updated_at: new Date().toISOString(),
  };
}

async function getEditableCatalogProducts() {
  if (hasSupabaseAdminConfig()) {
    try {
      return await fetchDatabaseProducts(true);
    } catch {}
  }

  return fetchFileProducts(true);
}

export async function renameCatalogAttributeValues(input: CatalogAttributeUpdateInput) {
  const parsed = catalogAttributeUpdateSchema.parse(input);
  const products = await getEditableCatalogProducts();
  const matchedProducts = products.filter((product) => {
    if (parsed.kind === "collection") {
      return product.collection === parsed.from;
    }

    if (parsed.kind === "color") {
      return product.variants.some((variant) => variant.color === parsed.from);
    }

    return product.variants.some((variant) =>
      variant.sizes.some((size) => size.label === parsed.from),
    );
  });

  for (const product of matchedProducts) {
    const nextInput = createCatalogInputFromProduct(product);

    if (parsed.kind === "collection") {
      nextInput.collection = parsed.to;
    } else if (parsed.kind === "color") {
      nextInput.variants = nextInput.variants.map((variant) => ({
        ...variant,
        color: variant.color === parsed.from ? parsed.to : variant.color,
      }));
    } else {
      nextInput.variants = nextInput.variants.map((variant) => ({
        ...variant,
        sizes: variant.sizes.map((size) => ({
          ...size,
          label: size.label === parsed.from ? parsed.to : size.label,
        })),
      }));
    }

    await updateCatalogProduct(product.id, nextInput);
  }

  return {
    count: matchedProducts.length,
  };
}

async function fetchDatabaseProducts(includeUnpublished = false) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("catalog_products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const detailRecords = await readCatalogDetailsRecords();
  const detailMap = new Map(detailRecords.map((record) => [record.id, record]));
  const products = (data ?? []).map((row) =>
    applyCatalogDetails(
      mapRowToCatalogProduct(row as CatalogProductRow),
      detailMap.get((row as CatalogProductRow).id),
    ),
  );

  return includeUnpublished
    ? sortCatalogProducts(products)
    : sortCatalogProducts(products.filter((product) => !product.isArchived));
}

export async function createCatalogProduct(input: CatalogProductInput) {
  const parsed = catalogProductInputSchema.parse(input);

  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("catalog_products")
      .insert(mapCatalogInputToInsert(parsed))
      .select("*")
      .single();

    if (error) {
      throwCatalogWriteError("saved", error);
    }

    const nextProduct = mapRowToCatalogProduct(data as CatalogProductRow);
    const detailRecords = await readCatalogDetailsRecords();
    const nextDetails = createCatalogDetailsRecord(nextProduct.id, parsed);
    await writeCatalogDetailsRecords([
      ...detailRecords.filter((record) => record.id !== nextProduct.id),
      nextDetails,
    ]);

    return applyCatalogDetails(nextProduct, nextDetails);
  }

  const records = await readCatalogFileRecords();

  if (records.some((record) => record.slug === parsed.slug)) {
    throw new CatalogConflictError(duplicateSlugMessage);
  }

  const timestamp = new Date().toISOString();
  const nextRecord: FileCatalogRecord = {
    id: randomUUID(),
    ...parsed,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeCatalogFileRecords([...records, nextRecord]);

  return mapFileRecordToCatalogProduct(nextRecord);
}

export async function updateCatalogProduct(id: string, input: CatalogProductInput) {
  const parsed = catalogProductInputSchema.parse(input);

  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("catalog_products")
      .update(mapCatalogInputToInsert(parsed))
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throwCatalogWriteError("updated", error);
    }

    if (!data) {
      throw new CatalogNotFoundError("The bag could not be found.");
    }

    const nextProduct = mapRowToCatalogProduct(data as CatalogProductRow);
    const detailRecords = await readCatalogDetailsRecords();
    const nextDetails = createCatalogDetailsRecord(id, parsed);
    await writeCatalogDetailsRecords([
      ...detailRecords.filter((record) => record.id !== id),
      nextDetails,
    ]);

    return applyCatalogDetails(nextProduct, nextDetails);
  }

  const records = await readCatalogFileRecords();
  const currentIndex = records.findIndex((record) => record.id === id);

  if (currentIndex === -1) {
    throw new CatalogNotFoundError("The bag could not be found.");
  }

  if (records.some((record) => record.slug === parsed.slug && record.id !== id)) {
    throw new CatalogConflictError(duplicateSlugMessage);
  }

  const nextRecord: FileCatalogRecord = {
    ...records[currentIndex],
    ...parsed,
    updatedAt: new Date().toISOString(),
  };
  const nextRecords = [...records];
  nextRecords[currentIndex] = nextRecord;

  await writeCatalogFileRecords(nextRecords);

  return mapFileRecordToCatalogProduct(nextRecord);
}

export async function deleteCatalogProduct(id: string) {
  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdminClient();
    const { error, count } = await supabase
      .from("catalog_products")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      throwCatalogWriteError("deleted", error);
    }

    if (!count) {
      throw new CatalogNotFoundError("The bag could not be found.");
    }

    const detailRecords = await readCatalogDetailsRecords();
    await writeCatalogDetailsRecords(detailRecords.filter((record) => record.id !== id));

    return;
  }

  const records = await readCatalogFileRecords();
  const nextRecords = records.filter((record) => record.id !== id);

  if (nextRecords.length === records.length) {
    throw new CatalogNotFoundError("The bag could not be found.");
  }

  await writeCatalogFileRecords(nextRecords);
}

export async function getPublicCatalogProducts() {
  noStore();

  if (hasSupabaseAdminConfig()) {
    try {
      return await fetchDatabaseProducts(false);
    } catch {
      return seededCatalogProducts();
    }
  }

  try {
    return await fetchFileProducts(false);
  } catch {
    return seededCatalogProducts();
  }
}

export async function getPublicCatalogProductBySlug(slug: string) {
  const products = await getPublicCatalogProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getAdminCatalogProducts() {
  noStore();

  if (hasSupabaseAdminConfig()) {
    try {
      return {
        products: await fetchDatabaseProducts(true),
        storageReady: true,
        storageMode: "database" as const,
      };
    } catch {}
  }

  try {
    return {
      products: await fetchFileProducts(true),
      storageReady: true,
      storageMode: "file" as const,
    };
  } catch {
    return {
      products: seededCatalogProducts(),
      storageReady: false,
      storageMode: "seed" as const,
    };
  }
}

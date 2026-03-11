import type { Product } from "@/lib/site-data";

export type CatalogStorageMode = "database" | "file" | "seed";

export type CatalogProduct = Product & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  displayOrder: number;
  source: CatalogStorageMode;
};

export type CatalogRecommendation = {
  product: CatalogProduct;
  reason: string;
};

export type CatalogInventoryStatus = "in_stock" | "low_stock" | "sold_out";

export type CatalogInventorySummary = {
  quantity: number;
  threshold: number;
  status: CatalogInventoryStatus;
  autoStatus: CatalogInventoryStatus;
  hasOverride: boolean;
};

type CatalogColorOption = {
  label: string;
  swatch: string;
};

export function sortCatalogProducts(products: CatalogProduct[]) {
  return [...products].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    if (left.isFeatured !== right.isFeatured) {
      return left.isFeatured ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

export function getFeaturedCatalogProducts(products: CatalogProduct[]) {
  const featured = products.filter((product) => product.isFeatured);

  if (featured.length > 0) {
    return sortCatalogProducts(featured).slice(0, 3);
  }

  return sortCatalogProducts(products).slice(0, 3);
}

export function getLatestCatalogProducts(products: CatalogProduct[]) {
  const latest = products.filter((product) => product.isNewArrival);

  if (latest.length > 0) {
    return sortCatalogProducts(latest).slice(0, 3);
  }

  return sortCatalogProducts(products).slice(-3).reverse();
}

export function getCatalogTotalColorways(products: CatalogProduct[]) {
  return products.reduce((sum, product) => sum + product.variants.length, 0);
}

export function getCatalogTotalInventory(products: CatalogProduct[]) {
  return products.reduce(
    (sum, product) => sum + getProductTotalVariantStock(product),
    0,
  );
}

export function getCatalogProductDisplayPrice(product: CatalogProduct) {
  if (
    typeof product.salePrice === "number" &&
    product.salePrice > 0 &&
    product.salePrice < product.price
  ) {
    return product.salePrice;
  }

  return product.price;
}

export function getCatalogProductCompareAtPrice(product: CatalogProduct) {
  const displayPrice = getCatalogProductDisplayPrice(product);

  if (displayPrice < product.price) {
    return product.price;
  }

  return null;
}

export function getCatalogProductInventory(product: CatalogProduct): CatalogInventorySummary {
  const quantity = getProductTotalVariantStock(product);
  const threshold = Math.max(product.inventoryThreshold ?? 2, 1);
  const autoStatus: CatalogInventoryStatus =
    quantity <= 0 ? "sold_out" : quantity <= threshold ? "low_stock" : "in_stock";
  const override = product.inventoryStatusOverride ?? null;
  const status = override ?? autoStatus;

  return {
    quantity,
    threshold,
    status,
    autoStatus,
    hasOverride: override !== null,
  };
}

export function getCatalogCategories(products: CatalogProduct[]) {
  return Array.from(new Set(products.map((product) => product.category)));
}

export function getCatalogColorOptions(products: CatalogProduct[]): CatalogColorOption[] {
  return Array.from(
    products
      .flatMap((product) => product.variants)
      .reduce((map, variant) => {
        if (!map.has(variant.color)) {
          map.set(variant.color, {
            label: variant.color,
            swatch: variant.swatch,
          });
        }

        return map;
      }, new Map<string, CatalogColorOption>())
      .values(),
  ).sort((left, right) => left.label.localeCompare(right.label));
}

export function getCatalogSearchText(product: CatalogProduct) {
  return [
    product.name,
    product.collection,
    product.category,
    product.occasion,
    product.shortDescription,
    product.description,
    product.material,
    product.detail,
    (product.tags ?? []).join(" "),
    product.badges.join(" "),
    product.variants.map((variant) => `${variant.color} ${variant.finish}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function getProductTotalVariantStock(product: CatalogProduct) {
  return product.variants.reduce(
    (sum, variant) =>
      sum + variant.sizes.reduce((variantSum, size) => variantSum + size.stock, 0),
    0,
  );
}

function tokenizeCatalogText(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

function buildCatalogAffinityTokens(product: CatalogProduct) {
  return new Set(
    tokenizeCatalogText(
      [product.category, product.collection, product.occasion, product.badges.join(" ")].join(" "),
    ),
  );
}

function buildCatalogOccasionTokens(product: CatalogProduct) {
  return new Set(tokenizeCatalogText(product.occasion));
}

function buildCatalogMaterialTokens(product: CatalogProduct) {
  return new Set(
    tokenizeCatalogText(
      [product.material, product.detail, product.variants.map((variant) => variant.finish).join(" ")].join(
        " ",
      ),
    ),
  );
}

function buildCatalogColorTokens(product: CatalogProduct) {
  return new Set(
    tokenizeCatalogText(product.variants.map((variant) => variant.color).join(" ")),
  );
}

function getSharedSetCount(left: Set<string>, right: Set<string>) {
  let matches = 0;

  for (const token of left) {
    if (right.has(token)) {
      matches += 1;
    }
  }

  return matches;
}

function getSharedTokenCount(left: CatalogProduct, right: CatalogProduct) {
  const leftTokens = buildCatalogAffinityTokens(left);
  const rightTokens = buildCatalogAffinityTokens(right);
  return getSharedSetCount(leftTokens, rightTokens);
}

function getPriceAffinityScore(priceDelta: number) {
  if (priceDelta <= 20000) {
    return 5;
  }

  if (priceDelta <= 50000) {
    return 3;
  }

  if (priceDelta <= 90000) {
    return 1;
  }

  return 0;
}

function scoreCatalogAffinity(candidate: CatalogProduct, anchor: CatalogProduct) {
  const priceDelta = Math.abs(
    getCatalogProductDisplayPrice(candidate) - getCatalogProductDisplayPrice(anchor),
  );
  const sharedOccasionTokens = getSharedSetCount(
    buildCatalogOccasionTokens(candidate),
    buildCatalogOccasionTokens(anchor),
  );
  const sharedMaterialTokens = getSharedSetCount(
    buildCatalogMaterialTokens(candidate),
    buildCatalogMaterialTokens(anchor),
  );
  const sharedColorTokens = getSharedSetCount(
    buildCatalogColorTokens(candidate),
    buildCatalogColorTokens(anchor),
  );
  const inStock = getProductTotalVariantStock(candidate) > 0;

  return (
    (candidate.category === anchor.category ? 8 : 0) +
    (candidate.collection === anchor.collection ? 2 : 0) +
    Math.min(getSharedTokenCount(candidate, anchor) * 2, 6) +
    Math.min(sharedOccasionTokens * 2, 4) +
    Math.min(sharedMaterialTokens * 2, 4) +
    Math.min(sharedColorTokens, 2) +
    getPriceAffinityScore(priceDelta) +
    (inStock ? 2 : -6) +
    (candidate.isFeatured ? 1 : 0) +
    (candidate.isNewArrival && anchor.isNewArrival ? 1 : 0)
  );
}

function describeCatalogAffinity(candidate: CatalogProduct, anchor: CatalogProduct) {
  const priceDelta = Math.abs(
    getCatalogProductDisplayPrice(candidate) - getCatalogProductDisplayPrice(anchor),
  );
  const sameCategory = candidate.category === anchor.category;
  const sameCollection = candidate.collection === anchor.collection;
  const sharedOccasionTokens = getSharedSetCount(
    buildCatalogOccasionTokens(candidate),
    buildCatalogOccasionTokens(anchor),
  );
  const sharedMaterialTokens = getSharedSetCount(
    buildCatalogMaterialTokens(candidate),
    buildCatalogMaterialTokens(anchor),
  );

  if (sameCategory && priceDelta <= 50000) {
    return "Same silhouette, close price";
  }

  if (sameCategory) {
    return "Same silhouette, different mood";
  }

  if (sharedOccasionTokens > 0 && priceDelta <= 50000) {
    return "Same occasion, close price";
  }

  if (sharedOccasionTokens > 0) {
    return "Similar use and mood";
  }

  if (sameCollection) {
    return "Same label, different shape";
  }

  if (sharedMaterialTokens > 0) {
    return "Similar finish and feel";
  }

  if (priceDelta <= 50000) {
    return "Nearby price band";
  }

  return "Another strong option in the edit";
}

export function getTrendingCatalogProducts(products: CatalogProduct[], limit = 4) {
  return [...products]
    .sort((left, right) => {
      const leftScore =
        (left.isFeatured ? 4 : 0) +
        (left.isTrending ? 4 : 0) +
        (left.isNewArrival ? 3 : 0) +
        (left.badges.some((badge) => /best seller|favorite|featured/i.test(badge)) ? 2 : 0) +
        (getCatalogProductInventory(left).status !== "sold_out" ? 1 : 0);
      const rightScore =
        (right.isFeatured ? 4 : 0) +
        (right.isTrending ? 4 : 0) +
        (right.isNewArrival ? 3 : 0) +
        (right.badges.some((badge) => /best seller|favorite|featured/i.test(badge)) ? 2 : 0) +
        (getCatalogProductInventory(right).status !== "sold_out" ? 1 : 0);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      if (left.displayOrder !== right.displayOrder) {
        return left.displayOrder - right.displayOrder;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, limit);
}

export function getRecommendedCatalogProducts(
  products: CatalogProduct[],
  currentProduct: CatalogProduct,
  limit = 3,
) {
  return getRecommendedCatalogSelections(products, currentProduct, limit).map(
    (entry) => entry.product,
  );
}

export function getRecommendedCatalogSelections(
  products: CatalogProduct[],
  currentProduct: CatalogProduct,
  limit = 3,
): CatalogRecommendation[] {
  const rankedEntries = products
    .filter((product) => product.slug !== currentProduct.slug)
    .map((product) => ({
      product,
      score: scoreCatalogAffinity(product, currentProduct),
      priceDelta: Math.abs(
        getCatalogProductDisplayPrice(product) - getCatalogProductDisplayPrice(currentProduct),
      ),
      reason: describeCatalogAffinity(product, currentProduct),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      if (left.priceDelta !== right.priceDelta) {
        return left.priceDelta - right.priceDelta;
      }

      return left.product.displayOrder - right.product.displayOrder;
    });

  const selections: CatalogRecommendation[] = [];
  const usedCategories = new Set<string>();

  for (const entry of rankedEntries) {
    if (selections.length >= limit) {
      break;
    }

    if (usedCategories.has(entry.product.category)) {
      continue;
    }

    usedCategories.add(entry.product.category);
    selections.push({
      product: entry.product,
      reason: entry.reason,
    });
  }

  if (selections.length >= limit) {
    return selections.slice(0, limit);
  }

  for (const entry of rankedEntries) {
    if (selections.length >= limit) {
      break;
    }

    if (selections.some((selection) => selection.product.slug === entry.product.slug)) {
      continue;
    }

    selections.push({
      product: entry.product,
      reason: entry.reason,
    });
  }

  return selections.slice(0, limit);
}

export function getPersonalizedCatalogProducts(
  products: CatalogProduct[],
  anchors: CatalogProduct[],
  limit = 3,
) {
  const excludedSlugs = new Set(anchors.map((product) => product.slug));

  return products
    .filter((product) => !excludedSlugs.has(product.slug))
    .map((product) => ({
      product,
      score: anchors.reduce((sum, anchor, index) => {
        const multiplier = index === 0 ? 1.15 : 1;
        return sum + scoreCatalogAffinity(product, anchor) * multiplier;
      }, 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score;
      }

      if (left.product.displayOrder !== right.product.displayOrder) {
        return left.product.displayOrder - right.product.displayOrder;
      }

      return left.product.name.localeCompare(right.product.name);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}

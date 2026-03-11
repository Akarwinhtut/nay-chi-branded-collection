import type { CatalogProduct } from "@/lib/catalog-shared";
import { profile } from "@/lib/site-data";

export type ProductGalleryItem = {
  key: string;
  label: string;
  src: string;
  alt: string;
  position: string;
  color?: string;
};

export function buildProductGalleryItems(
  product: CatalogProduct,
  limit = 5,
): ProductGalleryItem[] {
  const items: ProductGalleryItem[] = [];
  const seen = new Set<string>();

  const pushItem = (item: ProductGalleryItem) => {
    const identity = `${item.src}|${item.position}`;

    if (seen.has(identity)) {
      return;
    }

    seen.add(identity);
    items.push(item);
  };

  pushItem({
    key: `base-${product.slug}`,
    label: "Overview",
    src: product.image.src,
    alt: product.image.alt,
    position: product.image.position ?? "center center",
  });

  (product.galleryImages ?? []).forEach((image, index) => {
    pushItem({
      key: `${product.slug}-gallery-${index + 1}`,
      label: `Detail ${index + 1}`,
      src: image.src,
      alt: image.alt,
      position: image.position ?? "center center",
    });
  });

  product.variants.forEach((variant) => {
    pushItem({
      key: `${product.slug}-${variant.color}`,
      label: variant.color,
      src: variant.image.src,
      alt: variant.image.alt,
      position: variant.image.position ?? "center center",
      color: variant.color,
    });
  });

  return items.slice(0, limit);
}

type ReserveMessageOptions = {
  color?: string;
  quantity?: number;
  sizeLabel?: string;
};

export function createProductReserveMessage(
  product: CatalogProduct,
  options: ReserveMessageOptions = {},
) {
  const quantity = Math.max(options.quantity ?? 1, 1);
  const colorNote = options.color ? ` in ${options.color}` : "";
  const sizeNote = options.sizeLabel ? `, size ${options.sizeLabel}` : "";

  return `Hello ${profile.name}, I want to reserve ${quantity} x ${product.name}${colorNote}${sizeNote}. Please confirm stock, payment, and pickup or delivery details.`;
}

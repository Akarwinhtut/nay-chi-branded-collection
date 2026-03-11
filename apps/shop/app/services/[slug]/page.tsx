import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail-view";
import {
  getPublicCatalogProductBySlug,
  getPublicCatalogProducts,
} from "@/lib/catalog";
import { buildMetadata } from "@/lib/metadata";
import { getProductTotalStock } from "@/lib/site-data";

type BagPageParams = Promise<{ slug: string }>;

function getRelatedProducts(
  products: Awaited<ReturnType<typeof getPublicCatalogProducts>>,
  currentSlug: string,
  collection: string,
  category: string,
) {
  return products
    .filter((product) => product.slug !== currentSlug)
    .sort((left, right) => {
      const leftScore =
        (left.collection === collection ? 2 : 0) + (left.category === category ? 1 : 0);
      const rightScore =
        (right.collection === collection ? 2 : 0) + (right.category === category ? 1 : 0);

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }

      return left.displayOrder - right.displayOrder;
    })
    .slice(0, 3);
}

export async function generateStaticParams() {
  const products = await getPublicCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: BagPageParams;
}) {
  const { slug } = await params;
  const product = await getPublicCatalogProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Bag",
      description: "This bag could not be found.",
      pathname: "/services",
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    pathname: `/services/${product.slug}`,
  });
}

export default async function BagDetailPage({
  params,
}: {
  params: BagPageParams;
}) {
  const { slug } = await params;
  const products = await getPublicCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const totalStock = getProductTotalStock(product);
  const relatedProducts = getRelatedProducts(
    products,
    product.slug,
    product.collection,
    product.category,
  );
  const images = Array.from(
    new Set([product.image.src, ...product.variants.map((variant) => variant.image.src)]),
  );
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images,
    brand: {
      "@type": "Brand",
      name: product.collection,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "MMK",
      price: product.price,
      availability:
        totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:gap-20">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>
    </>
  );
}

export type ContactMethod = {
  label: string;
  href: string;
  displayValue: string;
  primary?: boolean;
  note?: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
  position?: string;
};

export type BrandProfile = {
  name: string;
  role: string;
  tagline: string;
  shortPromise: string;
  bio: string;
  location: string;
  address: string;
  foundedNote: string;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type EditorialScene = {
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  image: ImageAsset;
  cta?: {
    label: string;
    href: string;
  };
};

export type InventorySignal = {
  label: string;
  value: string;
  note: string;
};

export type CollectionHighlight = {
  eyebrow: string;
  title: string;
  description: string;
  image: ImageAsset;
  href: string;
};

export type ProductSize = {
  label: string;
  stock: number;
};

export type ProductVariant = {
  color: string;
  swatch: string;
  finish: string;
  image: ImageAsset;
  sizes: ProductSize[];
};

export type Product = {
  slug: string;
  name: string;
  collection: string;
  category: string;
  occasion: string;
  price: number;
  shortDescription: string;
  description: string;
  material: string;
  detail: string;
  badges: string[];
  image: ImageAsset;
  variants: ProductVariant[];
  salePrice?: number | null;
  tags?: string[];
  galleryImages?: ImageAsset[];
  dimensions?: string;
  strapLength?: string;
  hardwareFinish?: string;
  inventoryThreshold?: number;
  inventoryStatusOverride?: "in_stock" | "low_stock" | "sold_out" | null;
  isTrending?: boolean;
  isArchived?: boolean;
};

export type CraftPillar = {
  title: string;
  description: string;
  note: string;
};

export type ShoppingNote = {
  title: string;
  description: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type VisitDetail = {
  label: string;
  value: string;
  note: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LookbookStory = {
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  image: ImageAsset;
  featuredSlugs: string[];
};

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Bags", href: "/services" },
  { label: "Store", href: "/about" },
];

const atelierImagery = {
  showroom: {
    src: "/products/david-jones/taupe-carryall.jpg",
    alt: "Taupe David Jones structured carryall with a detachable strap staged beside a vase.",
    position: "center center",
  },
  structuredTote: {
    src: "/products/david-jones/taupe-carryall.jpg",
    alt: "Taupe David Jones structured carryall with a detachable strap staged beside a vase.",
    position: "center center",
  },
  blackBag: {
    src: "/products/david-jones/black-slouch-hobo.jpg",
    alt: "Black David Jones slouch hobo bag with shoulder strap and detachable crossbody strap.",
    position: "center center",
  },
  yellowMini: {
    src: "/products/david-jones/camel-slim-shoulder.jpg",
    alt: "Camel David Jones slim shoulder bag with a long strap and flap closure.",
    position: "center center",
  },
  ivoryPouch: {
    src: "/products/david-jones/pearl-lock-mini.jpg",
    alt: "Pearl David Jones mini top-handle bag with front lock hardware and shoulder strap.",
    position: "center center",
  },
  shoulderRow: {
    src: "/products/david-jones/ivory-belt-tote.jpg",
    alt: "Ivory David Jones tote bag with front belt detail and detachable long strap.",
    position: "center center",
  },
  wallet: {
    src: "/products/david-jones/camel-slim-shoulder.jpg",
    alt: "Camel David Jones slim shoulder bag with a long strap and flap closure.",
    position: "center center",
  },
  travel: {
    src: "/products/mossdoom/ivory-city-tote.jpg",
    alt: "Ivory Mossdoom tote with warm brown handles and a tall minimal silhouette.",
    position: "center center",
  },
} satisfies Record<string, ImageAsset>;

export const profile: BrandProfile = {
  name: "Nay Chi Branded Collection",
  role: "Branded bag store",
  tagline: "Chosen for the way they stay with you.",
  shortPromise:
    "A calmer way to browse branded bags in Yangon, with clear prices and quiet product pages.",
  bio: "Nay Chi Branded Collection is a bag store in Yangon built around a smaller, more composed edit. The focus stays on the bags themselves: calm photography, visible pricing, and a browsing experience that feels warm in person and online.",
  location: "Yangon, Myanmar",
  address: "No. 989 Thu Mingalar Rd, Yangon",
  foundedNote: "Visit the store or browse online at your own pace.",
};

export const contactMethods: ContactMethod[] = [
  {
    label: "Telegram",
    href: "https://t.me/Htut_Alec",
    displayValue: "@Htut_Alec",
    primary: true,
    note: "Fastest way to ask for photos, stock checks, and quick orders.",
  },
  {
    label: "Email",
    href: "mailto:akarwinhtutold@gmail.com",
    displayValue: "akarwinhtutold@gmail.com",
    note: "Best if you want to send a longer message.",
  },
  {
    label: "Map",
    href: "https://maps.google.com/?q=Nay+Chi+Branded+Collection,+no.989+Thu+Mingalar+Rd,+Yangon",
    displayValue: "Open Google Maps",
    note: "Use the map for store visits, pickup, or location confirmation.",
  },
];

export const storePhoto: ImageAsset = {
  src: "/store/google-maps-store-photo.jpg",
  alt: "Interior of Nay Chi Branded Collection in Yangon, with illuminated wall shelving and handbag displays.",
  position: "center center",
};

export const products: Product[] = [
  {
    slug: "lune-everyday-tote",
    name: "Lune Everyday Tote",
    collection: "Signature",
    category: "Tote",
    occasion: "Workday carry",
    price: 148000,
    shortDescription:
      "A softly structured tote for notebooks, beauty essentials, and a clean office look.",
    description:
      "The Lune tote keeps a polished outline while staying light enough for a full day out. It is the quiet carry for work, errands, and travel documents.",
    material: "Pebbled leather feel",
    detail: "Open interior with magnetic tab, reinforced base, and easy shoulder drop.",
    badges: ["Best seller", "Workday carry"],
    image: atelierImagery.structuredTote,
    variants: [
      {
        color: "Sandstone",
        swatch: "#c8a27f",
        finish: "Warm neutral grain",
        image: atelierImagery.structuredTote,
        sizes: [
          { label: "Medium", stock: 6 },
          { label: "Tall", stock: 3 },
        ],
      },
      {
        color: "Espresso",
        swatch: "#5a3b31",
        finish: "Deep coffee tone",
        image: atelierImagery.blackBag,
        sizes: [
          { label: "Medium", stock: 4 },
          { label: "Tall", stock: 2 },
        ],
      },
      {
        color: "Moss",
        swatch: "#6f7358",
        finish: "Muted olive leather",
        image: atelierImagery.showroom,
        sizes: [
          { label: "Medium", stock: 3 },
          { label: "Tall", stock: 1 },
        ],
      },
    ],
  },
  {
    slug: "solace-mini-handle",
    name: "Solace Mini Handle",
    collection: "Evening Edit",
    category: "Handbag",
    occasion: "Occasion dressing",
    price: 126000,
    shortDescription:
      "A polished mini shape with top handle charm and a detachable strap for evenings out.",
    description:
      "Solace is the small statement bag for dinners, gifts, and dressier days. It keeps a compact body while still carrying the essentials comfortably.",
    material: "Smooth leather finish",
    detail: "Top handle, detachable crossbody strap, and softly lined interior.",
    badges: ["New arrival", "Gift edit"],
    image: atelierImagery.yellowMini,
    variants: [
      {
        color: "Butter",
        swatch: "#d7ac42",
        finish: "Rich satin sheen",
        image: atelierImagery.yellowMini,
        sizes: [
          { label: "Mini", stock: 4 },
          { label: "Standard", stock: 2 },
        ],
      },
      {
        color: "Pearl",
        swatch: "#e6ddd2",
        finish: "Soft ivory polish",
        image: atelierImagery.ivoryPouch,
        sizes: [
          { label: "Mini", stock: 3 },
          { label: "Standard", stock: 2 },
        ],
      },
      {
        color: "Rouge Cedar",
        swatch: "#8a524b",
        finish: "Muted cedar red",
        image: atelierImagery.yellowMini,
        sizes: [
          { label: "Mini", stock: 2 },
          { label: "Standard", stock: 1 },
        ],
      },
    ],
  },
  {
    slug: "muse-crescent-shoulder",
    name: "Muse Crescent Shoulder",
    collection: "After Hours",
    category: "Shoulder",
    occasion: "Dinner and city nights",
    price: 132000,
    shortDescription:
      "A relaxed crescent line with enough softness for dinner plans and polished errands.",
    description:
      "Muse has a close-under-the-arm fit and a cleaner zip closure, giving it a slightly dressier mood without losing practicality.",
    material: "Soft grain leather feel",
    detail: "Zip-top closure with slim shoulder drop and hidden inner pocket.",
    badges: ["Evening favorite"],
    image: atelierImagery.blackBag,
    variants: [
      {
        color: "Onyx",
        swatch: "#1c1a19",
        finish: "Glossy deep black",
        image: atelierImagery.blackBag,
        sizes: [{ label: "Standard", stock: 5 }],
      },
      {
        color: "Almond",
        swatch: "#d2beab",
        finish: "Soft stone neutral",
        image: atelierImagery.ivoryPouch,
        sizes: [{ label: "Standard", stock: 4 }],
      },
      {
        color: "Deep Lake",
        swatch: "#49564d",
        finish: "Dark green cast",
        image: atelierImagery.shoulderRow,
        sizes: [{ label: "Standard", stock: 2 }],
      },
    ],
  },
  {
    slug: "etoile-pleated-pouch",
    name: "Etoile Pleated Pouch",
    collection: "Soft Volume",
    category: "Crossbody",
    occasion: "Light evening carry",
    price: 94000,
    shortDescription:
      "Light, sculpted, and easy to pair with dresses, tailoring, and quieter colors.",
    description:
      "Etoile is the soft pouch for smaller evenings and pared-back looks. It carries lightly and keeps the silhouette elegant.",
    material: "Pleated vegan leather",
    detail: "Hidden chain strap, compact opening, and satin-touch lining.",
    badges: ["Event edit"],
    image: atelierImagery.ivoryPouch,
    variants: [
      {
        color: "Ivory",
        swatch: "#ece4d7",
        finish: "Cream pleated surface",
        image: atelierImagery.ivoryPouch,
        sizes: [{ label: "Mini", stock: 3 }],
      },
      {
        color: "Clay Rose",
        swatch: "#b98b80",
        finish: "Dusty rose tint",
        image: atelierImagery.ivoryPouch,
        sizes: [{ label: "Mini", stock: 2 }],
      },
      {
        color: "Noir",
        swatch: "#1f1b18",
        finish: "Deep black contrast",
        image: atelierImagery.blackBag,
        sizes: [{ label: "Mini", stock: 2 }],
      },
    ],
  },
  {
    slug: "vale-soft-crossbody",
    name: "Vale Soft Crossbody",
    collection: "Daily Ease",
    category: "Crossbody",
    occasion: "Hands-free errands",
    price: 108000,
    shortDescription:
      "A hands-free flap shape with an easy strap length and a softer everyday finish.",
    description:
      "Vale is the practical small bag for daily errands, travel days, and giftable color stories. It stays slim while carrying more than a mini bag.",
    material: "Supple leather feel",
    detail: "Adjustable strap with front flap and an inner zip pocket.",
    badges: ["Travel light"],
    image: atelierImagery.shoulderRow,
    variants: [
      {
        color: "Dune",
        swatch: "#c9b39b",
        finish: "Soft sand neutral",
        image: atelierImagery.shoulderRow,
        sizes: [
          { label: "Compact", stock: 4 },
          { label: "Extended", stock: 2 },
        ],
      },
      {
        color: "Cocoa",
        swatch: "#72503f",
        finish: "Warm brown grain",
        image: atelierImagery.blackBag,
        sizes: [
          { label: "Compact", stock: 3 },
          { label: "Extended", stock: 2 },
        ],
      },
      {
        color: "Olive Smoke",
        swatch: "#6a6f5b",
        finish: "Dusty olive surface",
        image: atelierImagery.showroom,
        sizes: [
          { label: "Compact", stock: 2 },
          { label: "Extended", stock: 1 },
        ],
      },
    ],
  },
  {
    slug: "aster-zip-wallet",
    name: "Aster Zip Wallet",
    collection: "Small Leather Goods",
    category: "Wallet",
    occasion: "Gift and daily essentials",
    price: 54000,
    shortDescription:
      "A compact wallet with enough structure for cards, folded notes, and quick gifting.",
    description:
      "Aster is the small leather piece that pairs naturally with larger bags. It works for gifting, quick errands, and an organized daily carry.",
    material: "Smooth leather finish",
    detail: "Zip-around closure with card slots and a separate coin section.",
    badges: ["Gift ready"],
    image: atelierImagery.wallet,
    variants: [
      {
        color: "Espresso",
        swatch: "#55392f",
        finish: "Dark coffee tone",
        image: atelierImagery.wallet,
        sizes: [{ label: "Compact", stock: 6 }],
      },
      {
        color: "Dune",
        swatch: "#d5c4ae",
        finish: "Pale neutral matte",
        image: atelierImagery.wallet,
        sizes: [{ label: "Compact", stock: 5 }],
      },
      {
        color: "Forest Smoke",
        swatch: "#66705d",
        finish: "Muted green leather",
        image: atelierImagery.wallet,
        sizes: [{ label: "Compact", stock: 3 }],
      },
    ],
  },
  {
    slug: "cedar-weekender",
    name: "Cedar Weekender",
    collection: "Travel Edit",
    category: "Travel",
    occasion: "Overnight and airport carry",
    price: 176000,
    shortDescription:
      "The larger carry for overnight plans, gifting runs, and travel that still feels polished.",
    description:
      "Cedar brings the bag collection into weekend travel. It keeps a structured silhouette, thoughtful handles, and room for short-stay packing.",
    material: "Structured leather blend",
    detail: "Carry-on friendly body with dual handles and detachable shoulder strap.",
    badges: ["Limited run", "Travel edit"],
    image: atelierImagery.travel,
    variants: [
      {
        color: "Chestnut",
        swatch: "#84583f",
        finish: "Warm chestnut leather",
        image: atelierImagery.travel,
        sizes: [
          { label: "Cabin", stock: 3 },
          { label: "Long Stay", stock: 1 },
        ],
      },
      {
        color: "Ink",
        swatch: "#252322",
        finish: "Dark ink grain",
        image: atelierImagery.travel,
        sizes: [
          { label: "Cabin", stock: 2 },
          { label: "Long Stay", stock: 1 },
        ],
      },
      {
        color: "Stone",
        swatch: "#cfc5b7",
        finish: "Light taupe neutral",
        image: atelierImagery.travel,
        sizes: [
          { label: "Cabin", stock: 1 },
          { label: "Long Stay", stock: 1 },
        ],
      },
    ],
  },
];

export const featuredProducts = [
  products[0],
  products[1],
  products[4],
];

export const latestProducts = [
  products[2],
  products[3],
  products[6],
];

export const collectionHighlights: CollectionHighlight[] = [
  {
    eyebrow: "Daily",
    title: "Structured day bags with a composed line.",
    description: "Taupe, black, and ivory shapes that feel settled from the first glance.",
    image: atelierImagery.structuredTote,
    href: "/services",
  },
  {
    eyebrow: "Evening",
    title: "Slim shoulders and smaller evening pieces.",
    description: "Camel and pearl silhouettes with a lighter, dressier mood.",
    image: atelierImagery.ivoryPouch,
    href: "/projects",
  },
  {
    eyebrow: "Totes",
    title: "Ivory totes that open the whole room.",
    description: "Brighter carryalls for workdays, gifting, and long hours out.",
    image: atelierImagery.travel,
    href: "/services",
  },
];

export const craftPillars: CraftPillar[] = [
  {
    title: "A quieter palette",
    description: "Taupe, camel, pearl, black, and ivory let the collection feel composed without trying too hard.",
    note: "When the tones sit well together, the whole store feels more assured.",
  },
  {
    title: "Shapes with presence",
    description: "Structured carryalls, slim shoulders, softer hobos, and bright totes each hold their own place.",
    note: "The edit feels stronger when every silhouette earns its space.",
  },
  {
    title: "A personal finish",
    description: "Questions, extra photos, and the final order still happen through a real conversation.",
    note: "That last step keeps the store close.",
  },
];

export const shoppingNotes: ShoppingNote[] = [
  {
    title: "Visible stock counts",
    description: "Stock stays visible by size and color.",
  },
  {
    title: "Clean color stories",
    description: "The palette stays soft, warm, and coherent.",
  },
  {
    title: "Order with a message",
    description: "Open Telegram or email directly, or share the order note into Viber and other chat apps.",
  },
];

export const orderSteps: ProcessStep[] = [
  {
    title: "Choose the piece",
    description: "Start with the one that catches you.",
  },
  {
    title: "Choose the finish",
    description: "Pick the color and size that feels right.",
  },
  {
    title: "Send the note",
    description: "One short message is enough to begin.",
  },
  {
    title: "Let us confirm",
    description: "The store replies with stock, payment, and handoff details.",
  },
];

export const visitDetails: VisitDetail[] = [
  {
    label: "Store location",
    value: "No. 989 Thu Mingalar Rd, Yangon",
    note: "Customers can visit the store or confirm orders online first.",
  },
  {
    label: "Hours",
    value: "Mon - Sat / 10:00 - 19:00",
    note: "Evening pickup can be arranged in advance.",
  },
  {
    label: "Reply rhythm",
    value: "Same-day on Telegram",
    note: "Best for live photos, holds, and quick stock checks.",
  },
  {
    label: "Delivery",
    value: "Local drop-off and bus gate",
    note: "Final handoff is confirmed after the order is accepted.",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "How does ordering work right now?",
    answer: "Choose the piece you want, send a short note, and the store confirms the next step with you.",
  },
  {
    question: "Can I ask for more photos before paying?",
    answer: "Yes. Telegram is the quickest way to ask for closer photos and a fresh stock check.",
  },
  {
    question: "Will you hold a bag for me?",
    answer: "If the piece is still in store, short same-day holds are usually possible.",
  },
];

export const homeScenes: EditorialScene[] = [
  {
    eyebrow: "01 / Morning carry",
    title: "A first piece to reach for.",
    body: "Structured taupe shapes that feel settled, polished, and ready for the day.",
    detail: "Before the price is noticed, the bag should already feel worth keeping close.",
    image: atelierImagery.structuredTote,
  },
  {
    eyebrow: "02 / Quiet evening",
    title: "After-dark restraint.",
    body: "Camel shoulders and pearl minis bring a softer mood for dinners and dressed evenings.",
    detail: "A gentler line says more than extra decoration ever could.",
    image: atelierImagery.ivoryPouch,
  },
  {
    eyebrow: "03 / Ivory totes",
    title: "Light carried well.",
    body: "Ivory totes lift the page with room, ease, and a brighter silhouette.",
    detail: "These are the pieces that make the whole storefront breathe.",
    image: atelierImagery.travel,
  },
];

export const lookbookStories: LookbookStory[] = [
  {
    eyebrow: "Look 01",
    title: "Taupe held beside pearl.",
    body: "A structured taupe carryall softened by a pale pearl accent.",
    detail: "The pairing feels composed, warm, and quietly dressed.",
    image: atelierImagery.showroom,
    featuredSlugs: ["david-jones-taupe-carryall", "david-jones-pearl-lock-mini"],
  },
  {
    eyebrow: "Look 02",
    title: "Camel against black.",
    body: "One slim shoulder bag, one deep black hobo, and a stronger contrast between them.",
    detail: "When the tones are right, the whole collection feels surer.",
    image: atelierImagery.blackBag,
    featuredSlugs: ["david-jones-camel-slim-shoulder", "david-jones-black-slouch-hobo"],
  },
  {
    eyebrow: "Look 03",
    title: "The lighter tote study.",
    body: "Two clean totes, two handle treatments, and a brighter pace across the page.",
    detail: "These are the shapes that open the room and make the store feel more at ease.",
    image: atelierImagery.travel,
    featuredSlugs: ["david-jones-ivory-belt-tote", "mossdoom-ivory-city-tote"],
  },
];

export const totalInventoryCount = products.reduce(
  (sum, product) => sum + getProductTotalStock(product),
  0,
);

export const totalColorways = products.reduce(
  (sum, product) => sum + product.variants.length,
  0,
);

export const productCategories = Array.from(
  new Set(products.map((product) => product.category)),
);

export const storeSignals: InventorySignal[] = [
  {
    label: "Bag range",
    value: `${products.length} signature styles`,
    note: "Enough range for daily use, evenings, travel, and gifting without turning the store into clutter.",
  },
  {
    label: "Color depth",
    value: `${totalColorways} calm colorways`,
    note: "Taupe, camel, pearl, black, and ivory keep the whole collection rich and peaceful.",
  },
  {
    label: "Ready inventory",
    value: `${totalInventoryCount} live units`,
    note: "Stock is intentionally limited and surfaced by size, which makes the shop feel more direct and trustworthy.",
  },
];

export const locationSignals: InventorySignal[] = [
  {
    label: "Base",
    value: "Yangon",
    note: "The store is based in Yangon and supports both visits and online orders.",
  },
  {
    label: "Service",
    value: "Message first",
    note: "Telegram remains the fastest route for color checks, holds, and direct ordering.",
  },
  {
    label: "Delivery",
    value: "Flexible handoff",
    note: "Pickup, local drop-off, and arranged delivery can all fit the order flow.",
  },
];

export function getVariantTotalStock(variant: ProductVariant) {
  return variant.sizes.reduce((sum, size) => sum + size.stock, 0);
}

export function getProductTotalStock(product: Product) {
  return product.variants.reduce(
    (sum, variant) => sum + getVariantTotalStock(variant),
    0,
  );
}

export function getProductSizes(product: Product) {
  return Array.from(
    new Set(
      product.variants.flatMap((variant) =>
        variant.sizes.map((size) => size.label),
      ),
    ),
  );
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MMK",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price);
}

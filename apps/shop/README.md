# Nay Chi Branded Collection

Luxury bag storefront built with Next.js App Router, TypeScript, and Tailwind CSS.

## Run locally

From the workspace root:

```bash
npm install
npm run dev:shop
```

Or from this folder:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and provide:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=use-a-long-random-secret
```

Supabase is optional for local catalog editing, but use it for a real public launch.

## Supabase schema

Run both migrations in `supabase/migrations/`:

- `20260309_create_lead_inquiries.sql`
- `20260310_create_catalog_products.sql`

The contact form writes to `public.lead_inquiries`.
The catalog admin writes to `public.catalog_products`.

## Owner workflow

Open `/admin/login` to sign in, then manage the catalog from `/admin`.

Catalog storage works in this order:

- Supabase database if configured
- Local file storage at `data/catalog-products.json`
- Sample fallback only if storage is unavailable

That means you can start adding bags immediately without configuring Supabase first.
The local catalog file is created automatically the first time the catalog is loaded.

## Production notes

- In production, the public header/footer no longer expose the admin link.
- Protect admin access with `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- For a real public deployment, use Supabase instead of local file storage.
- Set `NEXT_PUBLIC_SITE_URL` to the final live domain before launch.

See [`../../docs/launch-guide.md`](../../docs/launch-guide.md) for the launch checklist and day-to-day workflow.

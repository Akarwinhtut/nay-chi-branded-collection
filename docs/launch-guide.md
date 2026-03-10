# Nay Chi Branded Collection Launch Guide

## 1. Before launch

Set these values in `apps/shop/.env.local` for local testing and in your hosting dashboard for production:

```bash
NEXT_PUBLIC_SITE_URL=https://your-live-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=use-a-long-random-secret
```

For a public launch, do not rely on local file storage. Use Supabase so your catalog persists properly online.

## 2. Database setup

Run these Supabase migrations from the shop project:

- `apps/shop/supabase/migrations/20260309_create_lead_inquiries.sql`
- `apps/shop/supabase/migrations/20260310_create_catalog_products.sql`

This enables:

- inquiry storage from the contact form
- product storage for the live catalog

## 3. Final content checklist

Before going live, replace or confirm:

- real bag names
- real MMK prices
- real stock counts
- real product photos
- Telegram and email contact details
- delivery and returns wording on `/policies`

## 4. Deploy

Recommended production path:

1. Push the project to GitHub.
2. Deploy it on Vercel.
3. Add the production environment variables there.
4. Connect your custom domain.
5. Confirm `NEXT_PUBLIC_SITE_URL` matches the live domain exactly.

## 5. Owner login

After deployment, use:

- `/admin/login` to sign in
- `/admin` to add, edit, publish, or delete bags

The admin link is hidden in production, so keep the login URL for yourself.

## 6. Daily workflow after launch

1. Open `/admin/login`.
2. Add or update a bag.
3. Set its MMK price, colorways, sizes, and stock.
4. Keep `Published` checked only for products customers should see.
5. Mark standout products as `Featured` or `New arrival` when needed.
6. Open the storefront and confirm the changes appear correctly.

## 7. How orders work

The current launch mode is:

- customer browses the site
- customer chooses the product, color, size, and quantity
- customer sends the reservation request through Telegram or email
- you confirm stock, payment, and delivery manually

This is a reservation storefront, not a full payment checkout system yet.

## 8. After launch

Check these regularly:

- stock counts stay accurate
- new arrivals are marked correctly
- Telegram and email replies stay fast
- delivery and exchange instructions remain clear

## 9. Next upgrades

When you are ready, the next major upgrades should be:

- full checkout and payment gateway
- image upload workflow instead of manual URLs
- order management dashboard
- analytics and conversion tracking
- customer notifications for new arrivals

# Website Workspace

This repository is organized as a workspace of separate website projects.

## Apps

- `apps/shop`: Nay Chi Branded Collection storefront
- `apps/hotel`: Astra Meridian hotel landing page

## Commands

Run these from the workspace root:

```bash
npm install
npm run dev:shop
npm run dev:hotel
npm run build
npm run lint
```

## Structure

```text
apps/
  shop/
  hotel/
artifacts/
  logs/
  screenshots/
docs/
```

Shared packages are intentionally not used yet. Each website keeps its own code, config, and assets so new site projects can be added cleanly without mixing concerns.

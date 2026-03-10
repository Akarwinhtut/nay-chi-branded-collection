create extension if not exists pgcrypto;

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  collection text not null,
  category text not null,
  occasion text not null,
  price numeric(10, 2) not null check (price >= 0),
  short_description text not null,
  description text not null,
  material text not null,
  detail text not null,
  badges text[] not null default '{}',
  image_src text not null,
  image_alt text not null,
  image_position text,
  variants jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_published boolean not null default true,
  display_order integer not null default 100,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists catalog_products_display_order_idx
  on public.catalog_products (display_order, created_at desc);

create index if not exists catalog_products_published_idx
  on public.catalog_products (is_published, is_featured, is_new_arrival);

alter table public.catalog_products enable row level security;

comment on table public.catalog_products is
  'Manual product catalog for Nay Chi Branded Collection.';

comment on column public.catalog_products.variants is
  'JSON array of color variants with swatches, optional image overrides, and size-level stock counts.';

create extension if not exists pgcrypto;

create table if not exists public.lead_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text not null,
  business_type text not null,
  project_goal text not null,
  preferred_contact text not null,
  contact_value text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.lead_inquiries enable row level security;

comment on table public.lead_inquiries is
  'Lead inquiries submitted from the Grant Alec website contact form.';

comment on column public.lead_inquiries.preferred_contact is
  'The client preferred contact method, for example Telegram or Email.';

comment on column public.lead_inquiries.contact_value is
  'The actual Telegram handle or email supplied by the client.';

-- Run this once in the SHARED Supabase project's SQL Editor
-- (the project shared with puntacana-excursions.com).
--
-- These prefixed tables keep this site's data separate from the sister site's
-- public.bookings / public.form_submissions. RLS is ON with no policies, so the
-- tables are private by default — only the service-role key can read/write.

create table if not exists public.private_excursions_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  paypal_order_id text not null unique,
  excursion_id text, excursion_title text, locale text,
  customer_name text, email text, phone text, hotel text,
  tour_date text, time_slot text, adults integer, children integer,
  deposit_paid numeric, currency text, total_price numeric,
  remaining_balance numeric, status text not null default 'confirmed'
);
create index if not exists pe_bookings_created_at_idx on public.private_excursions_bookings (created_at desc);
create index if not exists pe_bookings_email_idx on public.private_excursions_bookings (email);
alter table public.private_excursions_bookings enable row level security;

create table if not exists public.private_excursions_form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('contact', 'inquiry')),
  locale text, name text, email text, phone text, hotel text,
  excursion text, message text
);
create index if not exists pe_form_submissions_created_at_idx on public.private_excursions_form_submissions (created_at desc);
create index if not exists pe_form_submissions_type_idx on public.private_excursions_form_submissions (type);
alter table public.private_excursions_form_submissions enable row level security;

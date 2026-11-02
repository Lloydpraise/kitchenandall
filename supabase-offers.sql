-- Run once in the Supabase SQL editor for the kitchenandall project.
-- Adds offers (sales) that the website and Admin > Offers use, and starts the Black Friday Sale:
-- 10% off the 108 products that got SEO from the Google Ads search terms sheet.
-- Safe to run again: it never creates a second Black Friday offer and never removes products from it.

-- 1) Offers: one row per sale
create table if not exists public.offers (
  id            bigint generated always as identity primary key,
  name          text not null,                         -- shown in admin, e.g. "Black Friday 2026"
  badge         text not null default 'Sale',          -- badge on product cards and pages, e.g. "Black Friday Sale"
  percent_off   numeric(5,2) not null check (percent_off > 0 and percent_off < 100),
  announcement  text,                                  -- text for the announcement bar at the top of every page
  starts_at     timestamptz,                           -- empty = starts now
  ends_at       timestamptz,                           -- empty = no end date
  active        boolean not null default true,         -- switch an offer off without deleting it
  show_banner   boolean not null default true,         -- show the flowing deals banner on the home page
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2) Which products are in which offer
create table if not exists public.offer_products (
  offer_id   bigint not null references public.offers(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  primary key (offer_id, product_id)
);
create index if not exists offer_products_product_idx on public.offer_products (product_id);

-- 3) Anyone can read offers (the website shows them); only the admin (service role key) can change them
alter table public.offers enable row level security;
alter table public.offer_products enable row level security;
drop policy if exists "offers are public" on public.offers;
create policy "offers are public" on public.offers for select using (true);
drop policy if exists "offer products are public" on public.offer_products;
create policy "offer products are public" on public.offer_products for select using (true);
grant select on public.offers, public.offer_products to anon, authenticated;

-- 4) The Black Friday Sale: starts now, ends 30 Nov 2026 at midnight Nairobi time (change both in Admin > Offers)
insert into public.offers (name, badge, percent_off, announcement, starts_at, ends_at, active, show_banner)
select 'Black Friday 2026', 'Black Friday Sale', 10,
       '10% off selected commercial kitchen equipment.',
       now(), timestamptz '2026-12-01 00:00:00+03', true, true
where not exists (select 1 from public.offers where name = 'Black Friday 2026');

insert into public.offer_products (offer_id, product_id)
select o.id, p.id
from public.offers o
join public.products p on p.id = any (array[
  5,6,9,10,13,14,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,36,38,39,41,44,45,47,50,53,55,57,59,60,
  62,63,64,67,68,69,70,71,72,76,77,78,86,87,88,89,90,91,92,96,97,98,99,101,103,104,105,107,109,110,112,113,
  114,115,116,117,118,119,120,121,122,123,125,127,129,130,131,132,133,135,136,137,138,139,140,141,142,143,
  146,148,150,152,153,155,156,159,161,162,163,164,165,167
]::bigint[])
where o.name = 'Black Friday 2026'
on conflict do nothing;

-- Check: should say 108
select count(*) as products_in_black_friday
from public.offer_products op join public.offers o on o.id = op.offer_id
where o.name = 'Black Friday 2026';

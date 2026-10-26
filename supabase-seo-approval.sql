-- Run once in the Supabase SQL editor for the kitchenandall project.

-- 1) Admin approval for SEO written by the engine.
--    Every product starts as "not approved", so everything the engine has written lands in Admin > Review SEO > Needs review.
alter table public.products
  add column if not exists seo_approved boolean not null default false,
  add column if not exists seo_approved_at timestamptz;

create index if not exists products_seo_approved_idx on public.products (seo_approved);

-- 2) "SEO done" flag, worked out by the database itself.
--    The engine saves its finished text into `description` (long, 1200+ characters), so a product counts as done
--    when it has that, or has structured `content`. To change the 1200 threshold: drop the column and add it again.
alter table public.products
  add column if not exists seo_done boolean
  generated always as ((content is not null) or length(coalesce(description, '')) >= 1200) stored;

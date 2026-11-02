-- ============================================================================
-- Kitchen And All: site analytics
-- RUN THIS IN THE SUPABASE SQL EDITOR (kitchenandall project). Safe to run again.
-- ============================================================================
-- What it creates:
--   1. public.site_events: one row per visitor action (page view, add to cart, WhatsApp click...)
--   2. Row level security: the public (anon) key and logged-in users can NOT read or write it.
--      The website writes events through its own /api/track endpoint using the service role key,
--      and /admin reads them the same way.
--   3. public.admin_site_analytics(from, to): one call that returns every number on the dashboard.
--      Only the service role can run it.
--   4. public.prune_site_events(keep_days): optional clean-up of old rows.
-- Privacy: no names, phone numbers, emails or IP addresses are stored. A visitor is a random id
-- made in their browser. Country/city come from the hosting provider's rough location lookup.
-- ============================================================================

create table if not exists public.site_events (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  event         text not null check (char_length(event) between 1 and 40),
  visitor_id    text check (char_length(visitor_id) <= 64),
  session_id    text check (char_length(session_id) <= 64),
  path          text check (char_length(path) <= 300),
  page_type     text check (char_length(page_type) <= 30),
  product_id    bigint,
  product_name  text check (char_length(product_name) <= 200),
  category      text check (char_length(category) <= 120),
  label         text check (char_length(label) <= 120),   -- button text, search term, add-to-cart source
  location      text check (char_length(location) <= 60), -- where on the page (header, footer, product, floating...)
  value         numeric(14,2),
  quantity      integer,
  results       integer,                                  -- number of search results
  items         jsonb,                                    -- products in a WhatsApp order: [{id,name,price,quantity}]
  referrer      text check (char_length(referrer) <= 120),-- domain only, e.g. google.com
  utm_source    text check (char_length(utm_source) <= 80),
  utm_medium    text check (char_length(utm_medium) <= 80),
  utm_campaign  text check (char_length(utm_campaign) <= 120),
  device        text check (char_length(device) <= 20),   -- mobile / tablet / desktop
  country       text check (char_length(country) <= 60),
  city          text check (char_length(city) <= 80)
);

create index if not exists site_events_created_idx       on public.site_events (created_at desc);
create index if not exists site_events_event_created_idx on public.site_events (event, created_at desc);
create index if not exists site_events_product_idx       on public.site_events (product_id, created_at desc) where product_id is not null;
create index if not exists site_events_session_idx       on public.site_events (session_id, created_at);

-- ---------------------------------------------------------------------------
-- Security: RLS on, no policies for anon/authenticated = no access at all with the public key.
-- The service role (used only on the server) bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.site_events enable row level security;
revoke all on table public.site_events from anon, authenticated;
revoke all on sequence public.site_events_id_seq from anon, authenticated;
grant select, insert, delete on table public.site_events to service_role;

-- ---------------------------------------------------------------------------
-- Dashboard numbers. Days are counted in Nairobi time.
-- ---------------------------------------------------------------------------
create or replace function public.admin_site_kpis(p_from timestamptz, p_to timestamptz)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'visitors',        count(distinct visitor_id),
    'sessions',        count(distinct session_id),
    'page_views',      count(*) filter (where event = 'page_view'),
    'product_views',   count(*) filter (where event = 'product_view'),
    'add_to_cart',     count(*) filter (where event = 'add_to_cart'),
    'checkouts',       count(*) filter (where event = 'checkout_start'),
    'orders',          count(*) filter (where event = 'order_sent'),
    'order_value',     coalesce(sum(value) filter (where event = 'order_sent'), 0),
    'cart_value',      coalesce(sum(value) filter (where event = 'add_to_cart'), 0),
    'whatsapp_clicks', count(*) filter (where event = 'whatsapp_click'),
    'call_clicks',     count(*) filter (where event = 'call_click'),
    'email_clicks',    count(*) filter (where event = 'email_click'),
    'quote_clicks',    count(*) filter (where event = 'quote_click'),
    'quotes',          count(*) filter (where event = 'quote_submit'),
    'searches',        count(*) filter (where event = 'search')
  )
  from public.site_events
  where created_at >= p_from and created_at < p_to;
$$;

create or replace function public.admin_site_analytics(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  span interval := p_to - p_from;
  daily_unit text := case when p_to - p_from <= interval '2 days' then 'hour' else 'day' end;
  result jsonb;
begin
  with ev as (
    select * from public.site_events where created_at >= p_from and created_at < p_to
  ),
  sess as (
    select session_id,
           bool_or(event = 'product_view')   as viewed,
           bool_or(event = 'add_to_cart')    as carted,
           bool_or(event = 'checkout_start') as checkout,
           bool_or(event = 'order_sent')     as ordered,
           bool_or(event in ('whatsapp_click','call_click','email_click','quote_submit','order_sent')) as contacted
    from ev where session_id is not null group by session_id
  ),
  order_lines as (
    select (li->>'id')::bigint as product_id,
           li->>'name' as product_name,
           coalesce((li->>'quantity')::int, 1) as qty,
           coalesce((li->>'price')::numeric, 0) * coalesce((li->>'quantity')::int, 1) as line_value
    from ev, jsonb_array_elements(coalesce(ev.items, '[]'::jsonb)) li
    where ev.event = 'order_sent' and jsonb_typeof(ev.items) = 'array'
  ),
  prod as (
    select product_id, max(product_name) as name,
           max(path) filter (where event = 'product_view') as path,
           count(*) filter (where event = 'product_view') as views,
           count(distinct visitor_id) filter (where event = 'product_view') as viewers,
           count(*) filter (where event = 'add_to_cart') as carts,
           count(*) filter (where event = 'whatsapp_click') as whatsapp
    from ev where product_id is not null group by product_id
  ),
  sold as (
    select product_id, max(product_name) as name, count(*) as orders, sum(qty) as units, sum(line_value) as value
    from order_lines where product_id is not null group by product_id
  )
  select jsonb_build_object(
    'from', p_from, 'to', p_to, 'bucket', daily_unit,
    'kpis', public.admin_site_kpis(p_from, p_to),
    'previous', public.admin_site_kpis(p_from - span, p_from),

    'funnel', (select jsonb_build_object(
        'sessions', count(*), 'viewed', count(*) filter (where viewed), 'carted', count(*) filter (where carted),
        'checkout', count(*) filter (where checkout), 'ordered', count(*) filter (where ordered),
        'contacted', count(*) filter (where contacted)) from sess),

    'trend', coalesce((select jsonb_agg(t order by t.bucket) from (
        select date_trunc(daily_unit, created_at at time zone 'Africa/Nairobi') as bucket,
               count(distinct visitor_id) as visitors,
               count(*) filter (where event = 'page_view') as page_views,
               count(*) filter (where event = 'product_view') as product_views,
               count(*) filter (where event = 'add_to_cart') as add_to_cart,
               count(*) filter (where event = 'checkout_start') as checkouts,
               count(*) filter (where event = 'order_sent') as orders,
               count(*) filter (where event in ('whatsapp_click','call_click','email_click','quote_submit')) as contacts
        from ev group by 1) t), '[]'::jsonb),

    'top_viewed', coalesce((select jsonb_agg(p) from (
        select prod.product_id as id, coalesce(prod.name, s.name) as name, prod.path, prod.views, prod.viewers, prod.carts,
               coalesce(s.units, 0) as units, prod.whatsapp
        from prod left join sold s using (product_id)
        where prod.views > 0 order by prod.views desc, prod.carts desc limit 15) p), '[]'::jsonb),

    'top_carted', coalesce((select jsonb_agg(p) from (
        select product_id as id, name, path, carts, views from prod where carts > 0
        order by carts desc, views desc limit 15) p), '[]'::jsonb),

    'best_sellers', coalesce((select jsonb_agg(p) from (
        select sold.product_id as id, sold.name, prod.path, sold.orders, sold.units, sold.value
        from sold left join prod using (product_id)
        order by units desc, value desc limit 15) p), '[]'::jsonb),

    'viewed_not_carted', coalesce((select jsonb_agg(p) from (
        select product_id as id, name, path, views, carts from prod
        where views >= 5 order by (carts::numeric / views) asc, views desc limit 10) p), '[]'::jsonb),

    'top_pages', coalesce((select jsonb_agg(p) from (
        select path, max(page_type) as page_type, count(*) as views, count(distinct visitor_id) as visitors
        from ev where event = 'page_view' and path is not null
        group by path order by views desc limit 20) p), '[]'::jsonb),

    'top_categories', coalesce((select jsonb_agg(p) from (
        select split_part(path, '/', 3) as slug, count(*) as views, count(distinct visitor_id) as visitors
        from ev where event = 'page_view' and page_type = 'category' and split_part(path, '/', 3) <> ''
        group by 1 order by views desc limit 12) p), '[]'::jsonb),

    'buttons', coalesce((select jsonb_agg(p) from (
        select event, coalesce(location, 'other') as location, count(*) as clicks, count(distinct visitor_id) as visitors
        from ev where event in ('whatsapp_click','call_click','email_click','quote_click','social_click','quote_submit')
        group by 1, 2 order by clicks desc limit 30) p), '[]'::jsonb),

    'add_sources', coalesce((select jsonb_agg(p) from (
        select coalesce(label, 'other') as source, count(*) as adds
        from ev where event = 'add_to_cart' group by 1 order by adds desc) p), '[]'::jsonb),

    'sources', coalesce((select jsonb_agg(p) from (
        select src as source, count(distinct visitor_id) as visitors, count(distinct session_id) as sessions
        from (
          select visitor_id, session_id,
                 case when coalesce(nullif(utm_source, ''), nullif(referrer, '')) is null then 'Direct / app'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ 'google' then 'Google'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ '(facebook|^fb|\.fb\.|meta)' then 'Facebook'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ '(instagram|^ig$)' then 'Instagram'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ 'tiktok' then 'TikTok'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ '(bing|yahoo|duckduckgo)' then 'Other search'
                      when lower(coalesce(nullif(utm_source, ''), referrer)) ~ '(whatsapp|wa\.me)' then 'WhatsApp'
                      else lower(coalesce(nullif(utm_source, ''), referrer)) end as src
          from ev where event = 'page_view') x
        group by src order by visitors desc limit 12) p), '[]'::jsonb),

    'campaigns', coalesce((select jsonb_agg(p) from (
        select utm_source as source, coalesce(utm_medium, '') as medium, coalesce(utm_campaign, '') as campaign,
               count(distinct session_id) as sessions
        from ev where utm_source is not null and event = 'page_view'
        group by 1, 2, 3 order by sessions desc limit 10) p), '[]'::jsonb),

    'devices', coalesce((select jsonb_agg(p) from (
        select coalesce(device, 'unknown') as device, count(distinct visitor_id) as visitors
        from ev where event = 'page_view' group by 1 order by visitors desc) p), '[]'::jsonb),

    'locations', coalesce((select jsonb_agg(p) from (
        select coalesce(nullif(city, ''), 'Unknown') as city, coalesce(country, '') as country, count(distinct visitor_id) as visitors
        from ev where event = 'page_view' group by 1, 2 order by visitors desc limit 12) p), '[]'::jsonb),

    'searches', coalesce((select jsonb_agg(p) from (
        select lower(label) as term, count(*) as searches, round(avg(results))::int as avg_results
        from ev where event = 'search' and label is not null
        group by 1 order by searches desc limit 20) p), '[]'::jsonb),

    'searches_no_results', coalesce((select jsonb_agg(p) from (
        select lower(label) as term, count(*) as searches
        from ev where event = 'search' and label is not null and coalesce(results, 0) = 0
        group by 1 order by searches desc limit 15) p), '[]'::jsonb),

    'hours', coalesce((select jsonb_agg(p order by p.hour) from (
        select extract(hour from created_at at time zone 'Africa/Nairobi')::int as hour, count(*) as events
        from ev where event = 'page_view' group by 1) p), '[]'::jsonb),

    'recent', coalesce((select jsonb_agg(p) from (
        select created_at, event, path, product_name, label, location, value, device, city
        from ev where event <> 'page_view' order by created_at desc limit 40) p), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

-- Optional: delete events older than N days (run by hand, e.g. select public.prune_site_events(365);)
create or replace function public.prune_site_events(keep_days integer default 365)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  delete from public.site_events where created_at < now() - make_interval(days => keep_days);
  get diagnostics n = row_count;
  return n;
end;
$$;

-- Only the server (service role) may run these.
revoke all on function public.admin_site_kpis(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_site_analytics(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.prune_site_events(integer) from public, anon, authenticated;
grant execute on function public.admin_site_kpis(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_site_analytics(timestamptz, timestamptz) to service_role;
grant execute on function public.prune_site_events(integer) to service_role;

-- ============================================================================
-- Kitchen And All: offers + traffic sources for /admin/analytics
-- RUN THIS IN THE SUPABASE SQL EDITOR (kitchenandall project), after site-analytics.sql and
-- supabase-offers.sql. Safe to run again. It only adds read-only functions; no data is changed.
--   1. admin_offer_analytics:   the "Offers" section (sale products clicked, viewed, added, ordered)
--   2. traffic_channel + admin_traffic_sources: the "Marketing: where visitors come from" section
--      (Google Ads vs Google search, Facebook ads vs posts, ChatGPT, Gemini, Claude, ... and what each one led to)
-- ============================================================================
-- A product counts as an "offer product" when it is in any offer (Admin > Offers), so the numbers
-- cover the Black Friday products and any later sale.
--   offer_click  = a visitor clicked a sale product (home deals banner, /deals page, category or
--                  related-products cards) or the "Shop the deals" button.
--   views/carts/orders = what happened on the sale products themselves, from any route.
-- ============================================================================

create or replace function public.admin_offer_analytics(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  with offer_ids as (
    select distinct product_id from public.offer_products
  ),
  ev as (
    select * from public.site_events where created_at >= p_from and created_at < p_to
  ),
  order_lines as (
    select ev.visitor_id,
           (li->>'id')::bigint as product_id,
           li->>'name' as product_name,
           coalesce((li->>'quantity')::int, 1) as qty,
           coalesce((li->>'price')::numeric, 0) * coalesce((li->>'quantity')::int, 1) as line_value,
           ev.id as order_event
    from ev, jsonb_array_elements(coalesce(ev.items, '[]'::jsonb)) li
    where ev.event = 'order_sent' and jsonb_typeof(ev.items) = 'array'
  ),
  offer_lines as (
    select * from order_lines where product_id in (select product_id from offer_ids)
  ),
  offer_ev as (
    select * from ev where product_id in (select product_id from offer_ids)
  ),
  prod as (
    select product_id,
           max(product_name) as name,
           max(path) filter (where event = 'product_view') as path,
           count(*) filter (where event = 'offer_click') as clicks,
           count(*) filter (where event = 'product_view') as views,
           count(distinct visitor_id) filter (where event = 'product_view') as viewers,
           count(*) filter (where event = 'add_to_cart') as carts
    from offer_ev group by product_id
  ),
  sold as (
    select product_id, max(product_name) as name, sum(qty) as units, sum(line_value) as value
    from offer_lines group by product_id
  ),
  top as (
    select coalesce(p.product_id, s.product_id) as id,
           coalesce(p.name, s.name) as name,
           coalesce(p.path, '/product/' || pr.slug) as path,
           coalesce(p.clicks, 0) as clicks, coalesce(p.views, 0) as views,
           coalesce(p.viewers, 0) as viewers, coalesce(p.carts, 0) as carts,
           coalesce(s.units, 0) as units, coalesce(s.value, 0) as value
    from prod p
    full join sold s on s.product_id = p.product_id
    left join public.products pr on pr.id = coalesce(p.product_id, s.product_id)
  )
  select jsonb_build_object(
    'offer_products', (select count(*) from offer_ids),
    'clicks',          (select count(*) from ev where event = 'offer_click'),
    'click_visitors',  (select count(distinct visitor_id) from ev where event = 'offer_click'),
    'products_clicked',(select count(distinct product_id) from ev where event = 'offer_click' and product_id is not null),
    'views',           (select count(*) from offer_ev where event = 'product_view'),
    'viewers',         (select count(distinct visitor_id) from offer_ev where event = 'product_view'),
    'products_viewed', (select count(distinct product_id) from offer_ev where event = 'product_view'),
    'carts',           (select count(*) from offer_ev where event = 'add_to_cart'),
    'orders',          (select count(distinct order_event) from offer_lines),
    'units',           (select coalesce(sum(qty), 0) from offer_lines),
    'order_value',     (select coalesce(sum(line_value), 0) from offer_lines),
    'click_places', coalesce((select jsonb_agg(p) from (
        select coalesce(location, 'other') as location, count(*) as clicks, count(distinct visitor_id) as visitors
        from ev where event = 'offer_click' group by 1 order by clicks desc) p), '[]'::jsonb),
    'top', coalesce((select jsonb_agg(t) from (
        select * from top order by clicks + views desc, carts desc, units desc limit 15) t), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;


-- ============================================================================
-- 2) Traffic sources
-- ============================================================================
-- Which marketing channel a visit came from, from its utm tags / ad click id (saved by the website as
-- utm_source + utm_medium) and the referring website. Paid = utm_medium like cpc, ppc, paid, ads.
create or replace function public.traffic_channel(p_source text, p_medium text, p_referrer text)
returns text
language sql
immutable
set search_path = public
as $$
  with v as (
    select lower(coalesce(p_source, '')) as s,
           lower(coalesce(p_medium, '')) as m,
           lower(coalesce(p_referrer, '')) as r,
           lower(coalesce(p_medium, '')) ~ '(cpc|ppc|cpm|cpv|paid|^ads?$|_ads?$|display|banner|sponsored|boost|promoted)' as paid
  )
  select case
    -- AI assistants (before Google: Gemini lives on google.com)
    when s ~ '(chatgpt|openai)' or r ~ '(chatgpt\.com|openai\.com)' then 'ChatGPT'
    when s ~ '(gemini|bard)' or r ~ '(gemini\.google|bard\.google)' then 'Gemini'
    when s ~ '(claude|anthropic)' or r ~ '(claude\.ai|anthropic\.com)' then 'Claude'
    when s ~ 'perplexity' or r ~ 'perplexity' then 'Perplexity'
    when s ~ 'copilot' or r ~ '(copilot\.microsoft|copilot\.cloud\.microsoft|edgeservices\.bing)' then 'Microsoft Copilot'
    when s ~ 'deepseek' or r ~ 'deepseek' then 'DeepSeek'
    when s ~ 'grok' or r ~ 'grok\.com' then 'Grok'
    when s ~ 'meta\.ai' or r ~ 'meta\.ai' then 'Meta AI'
    when s ~ '(you\.com|phind|poe\.com|mistral|qwen|kimi)' or r ~ '(you\.com|phind\.com|poe\.com|chat\.mistral|qwen|kimi\.)' then 'Other AI assistants'
    -- Google
    when (s ~ '(google|adwords|gads)' or r ~ 'google\.') and (paid or s ~ '(adwords|gads)') then 'Google Ads'
    when s ~ '(gbp|gmb|google_business|googlemybusiness|business_profile|maps)' or r ~ '(maps\.google|business\.google|google\.[a-z.]+/maps)' then 'Google Maps / Business Profile'
    when s ~ '(youtube|^yt$)' or r ~ '(youtube\.com|youtu\.be)' then case when paid then 'YouTube ads' else 'YouTube' end
    when s ~ 'google' or r ~ '(^|\.)google\.' then 'Google search (free)'
    -- Meta
    when s ~ '(instagram|^ig$)' or r ~ 'instagram' then case when paid then 'Instagram ads' else 'Instagram (posts, bio, stories)' end
    when s ~ '(facebook|^fb$|^meta$|messenger|^msg$|^an$)' or r ~ '(facebook\.|fb\.com|fb\.me|messenger\.com)' then case when paid then 'Facebook ads' else 'Facebook (posts, page, shares)' end
    -- Other social
    when s ~ 'tiktok' or r ~ 'tiktok' then case when paid then 'TikTok ads' else 'TikTok' end
    when s ~ '(twitter|^x$)' or r ~ '(^t\.co$|twitter\.com|^x\.com)' then case when paid then 'X (Twitter) ads' else 'X (Twitter)' end
    when s ~ 'linkedin' or r ~ '(linkedin|lnkd\.in)' then case when paid then 'LinkedIn ads' else 'LinkedIn' end
    when s ~ 'snapchat' or r ~ 'snapchat' then 'Snapchat'
    when s ~ 'pinterest' or r ~ 'pinterest' then 'Pinterest'
    when s ~ '(whatsapp|^wa$)' or r ~ '(whatsapp|wa\.me)' then 'WhatsApp (shared links, status)'
    -- Other search engines
    when s ~ '(bing|microsoft)' and paid then 'Microsoft (Bing) Ads'
    when s ~ '(bing|yahoo|duckduckgo|ecosia|brave|yandex|baidu|opera)' or r ~ '(bing\.com|yahoo\.|duckduckgo|ecosia|search\.brave|yandex|baidu|opera\.com)' then 'Bing, Yahoo & other search'
    -- Email / SMS
    when m ~ '(e-?mail|newsletter)' or s ~ '(mailchimp|newsletter|brevo|sendinblue|gmail|outlook)' or r ~ '(mail\.google|outlook\.|mail\.yahoo)' then 'Email'
    when m ~ 'sms' or s ~ 'sms' then 'SMS'
    -- Nothing known
    when s = '' and r = '' then 'Direct (typed in, bookmarks, apps)'
    when paid then 'Other ads: ' || coalesce(nullif(s, ''), r)
    else 'Other websites: ' || coalesce(nullif(s, ''), r)
  end
  from v
$$;

-- Big groups for the donut.
create or replace function public.traffic_group(p_channel text)
returns text
language sql
immutable
as $$
  select case
    when p_channel ~ '(Ads|ads)' then 'Paid ads'
    when p_channel in ('ChatGPT','Gemini','Claude','Perplexity','Microsoft Copilot','DeepSeek','Grok','Meta AI','Other AI assistants') then 'AI assistants'
    when p_channel in ('Google search (free)','Google Maps / Business Profile','Bing, Yahoo & other search') then 'Free search'
    when p_channel ~ '^(Facebook|Instagram|TikTok|X \(Twitter\)|LinkedIn|Snapchat|Pinterest|YouTube|WhatsApp)' then 'Social (free)'
    when p_channel in ('Email','SMS') then 'Email & SMS'
    when p_channel like 'Direct%' then 'Direct'
    else 'Other websites'
  end
$$;

-- One row per channel: how many people came and what they did (per visit, so a visit that came from
-- Google Ads and then sent an order counts the order for Google Ads).
create or replace function public.admin_traffic_sources(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  with ev as (
    select * from public.site_events where created_at >= p_from and created_at < p_to and session_id is not null
  ),
  sess as (
    select session_id,
           max(visitor_id) as visitor_id,
           public.traffic_channel(max(utm_source), max(utm_medium), max(referrer)) as channel,
           max(utm_campaign) as campaign,
           count(*) filter (where event = 'page_view') as pages,
           bool_or(event = 'product_view') as viewed,
           bool_or(event = 'add_to_cart') as carted,
           bool_or(event = 'checkout_start') as checkout,
           bool_or(event = 'order_sent') as ordered,
           bool_or(event = 'whatsapp_click') as whatsapp,
           bool_or(event in ('whatsapp_click','call_click','email_click','quote_submit','order_sent')) as contacted,
           coalesce(sum(value) filter (where event = 'order_sent'), 0) as order_value
    from ev group by session_id
  ),
  ch as (
    select channel, public.traffic_group(channel) as grp,
           count(distinct visitor_id) as visitors,
           count(*) as visits,
           sum(pages) as pages,
           count(*) filter (where viewed) as viewed,
           count(*) filter (where carted) as carted,
           count(*) filter (where checkout) as checkout,
           count(*) filter (where ordered) as ordered,
           count(*) filter (where whatsapp) as whatsapp,
           count(*) filter (where contacted) as contacted,
           sum(order_value) as order_value
    from sess group by channel
  )
  select jsonb_build_object(
    'channels', coalesce((select jsonb_agg(c order by c.visits desc) from ch c), '[]'::jsonb),
    'groups', coalesce((select jsonb_agg(g) from (
        select grp, sum(visitors) as visitors, sum(visits) as visits, sum(contacted) as contacted, sum(ordered) as ordered
        from ch group by grp order by visits desc) g), '[]'::jsonb),
    'campaigns', coalesce((select jsonb_agg(k) from (
        select channel, campaign, count(*) as visits, count(*) filter (where carted) as carted,
               count(*) filter (where contacted) as contacted, count(*) filter (where ordered) as ordered
        from sess where campaign is not null group by 1, 2 order by visits desc limit 20) k), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

-- Only the server (service role) may run the dashboard functions.
revoke all on function public.admin_offer_analytics(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_traffic_sources(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.admin_offer_analytics(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_traffic_sources(timestamptz, timestamptz) to service_role;

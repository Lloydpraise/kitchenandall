// Receives anonymous site-activity events from the browser (src/lib/analytics.ts) and stores them in
// Supabase `site_events` with the server-only service role key. The browser never gets database access.
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { COOKIE, isAuthed } from '../../lib/adminAuth';
import { getEnv } from '../../lib/adminEnv';

export const prerender = false;

const EVENTS = new Set([
  'page_view', 'product_view', 'add_to_cart', 'remove_from_cart', 'cart_open',
  'checkout_start', 'order_sent', 'whatsapp_click', 'call_click', 'email_click',
  'quote_click', 'quote_submit', 'social_click', 'search', 'search_click', 'offer_click',
]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|python|curl|wget|axios|node-fetch|go-http/i;
const MAX_BODY = 16_000;
const MAX_EVENTS = 20;

// Light flood protection per address (in memory, resets on a cold start).
const hits = new Map<string, { n: number; reset: number }>();
function tooMany(key: string) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now > h.reset) { hits.set(key, { n: 1, reset: now + 60_000 }); return false; }
  return ++h.n > 120;
}

const str = (v: unknown, max: number) => {
  if (typeof v !== 'string' && typeof v !== 'number') return null;
  const s = String(v).replace(/[\u0000-\u001f]/g, ' ').trim();
  return s ? s.slice(0, max) : null;
};
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) && Math.abs(n) < 1e12 ? n : null;
};
const int = (v: unknown) => { const n = num(v); return n === null ? null : Math.round(n); };

function cleanItems(v: unknown) {
  if (!Array.isArray(v)) return null;
  return v.slice(0, 30).map((i: any) => ({
    id: int(i?.id), name: str(i?.name, 200), price: num(i?.price), quantity: int(i?.quantity) ?? 1,
  }));
}

function deviceFrom(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

function geoFrom(ctx: Parameters<APIRoute>[0]) {
  const geo = (ctx.locals as any)?.netlify?.context?.geo;
  if (geo) return { country: str(geo.country?.name || geo.country?.code, 60), city: str(geo.city, 80) };
  try {
    const raw = ctx.request.headers.get('x-nf-geo');
    if (raw) {
      const g = JSON.parse(raw.trim().startsWith('{') ? raw : atob(raw));
      return { country: str(g.country?.name || g.country?.code, 60), city: str(g.city, 80) };
    }
  } catch { /* no location available */ }
  return { country: null, city: null };
}

const ok = () => new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  try {
    // Same-site requests only.
    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== new URL(request.url).host) return ok();

    const ua = request.headers.get('user-agent') || '';
    if (!ua || BOT.test(ua)) return ok();

    // The owner's own visits (signed in to /admin) are not counted.
    if (await isAuthed(ctx.cookies.get(COOKIE)?.value, getEnv('ADMIN_TOKEN'))) return ok();

    let ip = 'unknown';
    try { ip = ctx.clientAddress || ip; } catch { /* not available in some environments */ }
    if (tooMany(ip)) return ok();

    const text = await request.text();
    if (!text || text.length > MAX_BODY) return ok();
    const body = JSON.parse(text);
    const list: any[] = (Array.isArray(body?.events) ? body.events : [body]).slice(0, MAX_EVENTS);

    const device = deviceFrom(ua);
    const { country, city } = geoFrom(ctx);

    const rows = list
      .filter((e) => e && EVENTS.has(e.event))
      .map((e) => ({
        event: e.event,
        visitor_id: str(e.visitor_id, 64),
        session_id: str(e.session_id, 64),
        path: str(e.path, 300),
        page_type: str(e.page_type, 30),
        product_id: int(e.product_id),
        product_name: str(e.product_name, 200),
        category: str(e.category, 120),
        label: str(e.label, 120),
        location: str(e.location, 60),
        value: num(e.value),
        quantity: int(e.quantity),
        results: int(e.results),
        items: e.event === 'order_sent' ? cleanItems(e.items) : null,
        referrer: str(e.referrer, 120),
        utm_source: str(e.utm_source, 80),
        utm_medium: str(e.utm_medium, 80),
        utm_campaign: str(e.utm_campaign, 120),
        device,
        country,
        city,
      }));

    if (rows.length) {
      const { error } = await supabaseAdmin().from('site_events').insert(rows as any);
      if (error) console.error('track insert failed:', error.message);
    }
  } catch (e: any) {
    console.error('track failed:', e?.message || e);
  }
  return ok(); // never let tracking break the site
};

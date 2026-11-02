// Anonymous site-activity tracking for the admin Analytics dashboard.
// Sends small events to /api/track (stored in Supabase `site_events`). No names, phones, emails or IPs:
// a visitor is a random id kept in this browser, a session ends after 30 minutes without activity.

export type TrackEvent =
  | 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'cart_open'
  | 'checkout_start' | 'order_sent' | 'whatsapp_click' | 'call_click' | 'email_click'
  | 'quote_click' | 'quote_submit' | 'social_click' | 'search' | 'search_click';

export interface TrackProps {
  product_id?: number | string | null;
  product_name?: string | null;
  category?: string | null;
  label?: string | null;
  location?: string | null;
  value?: number | null;
  quantity?: number | null;
  results?: number | null;
  items?: { id: number; name: string; price: number; quantity: number }[];
}

const ENDPOINT = '/api/track';
const SESSION_MS = 30 * 60 * 1000;
const isBrowser = typeof window !== 'undefined';

function rid() {
  try { return crypto.randomUUID(); } catch { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
}
function store(kind: 'local' | 'session') {
  try { return kind === 'local' ? window.localStorage : window.sessionStorage; } catch { return null; }
}

function visitorId() {
  const ls = store('local');
  let id = ls?.getItem('kna_vid');
  if (!id) { id = rid(); ls?.setItem('kna_vid', id); }
  return id;
}

// Session id plus where this session came from (first page's referrer and utm tags).
function session() {
  const ls = store('local');
  const now = Date.now();
  let s: { id: string; last: number; ref: string | null; utm: Record<string, string> } | null = null;
  try { s = JSON.parse(ls?.getItem('kna_sess') || 'null'); } catch { s = null; }
  if (!s || now - s.last > SESSION_MS) {
    const params = new URLSearchParams(window.location.search);
    let ref: string | null = null;
    try {
      const r = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '';
      ref = r && r !== window.location.hostname.replace(/^www\./, '') ? r : null;
    } catch { ref = null; }
    const utm: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) { const v = params.get(k); if (v) utm[k] = v; }
    if (!utm.utm_source && params.get('gclid')) { utm.utm_source = 'google'; utm.utm_medium = 'cpc'; }
    if (!utm.utm_source && params.get('fbclid')) { utm.utm_source = 'facebook'; utm.utm_medium = utm.utm_medium || 'social'; }
    s = { id: rid(), last: now, ref, utm };
  }
  s.last = now;
  try { ls?.setItem('kna_sess', JSON.stringify(s)); } catch { /* storage full or blocked */ }
  return s;
}

export function pageType(path = isBrowser ? window.location.pathname : '/') {
  if (path === '/') return 'home';
  if (path.startsWith('/product/')) return 'product';
  if (path.startsWith('/category')) return 'category';
  if (path.startsWith('/catalog')) return 'catalog';
  if (path.startsWith('/checkout')) return 'checkout';
  if (path.startsWith('/get-quote')) return 'quote';
  if (path.startsWith('/blogs')) return 'blog';
  return 'page';
}

// Product shown on the current page, so button clicks there are linked to it.
let pageProduct: { id: number; name: string; category?: string | null } | null = null;
export function setPageProduct(p: typeof pageProduct) { pageProduct = p; }

let queue: Record<string, unknown>[] = [];
let timer: number | undefined;

function flush() {
  if (!queue.length) return;
  const body = JSON.stringify({ events: queue.splice(0, 20) });
  let sent = false;
  try { sent = navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'application/json' })) ?? false; } catch { sent = false; }
  if (!sent) {
    fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }
  if (queue.length) flush();
}

export function track(event: TrackEvent, props: TrackProps = {}) {
  if (!isBrowser) return;
  try {
    if (navigator.webdriver) return;
    const s = session();
    const product = props.product_id == null && pageProduct && event !== 'page_view' && event !== 'search'
      ? { product_id: pageProduct.id, product_name: pageProduct.name, category: pageProduct.category ?? null }
      : {};
    queue.push({
      event,
      visitor_id: visitorId(),
      session_id: s.id,
      path: window.location.pathname,
      page_type: pageType(),
      referrer: s.ref,
      ...s.utm,
      ...product,
      ...props,
    });
    // Clicks that leave the page (WhatsApp, call, checkout) are sent at once; others are batched briefly.
    const urgent = !['page_view', 'product_view', 'search'].includes(event);
    window.clearTimeout(timer);
    if (urgent || queue.length >= 10) flush();
    else timer = window.setTimeout(flush, 800);
  } catch { /* tracking must never break the site */ }
}

if (isBrowser) {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}

const SOCIAL = /facebook\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|youtube\.com|linkedin\.com/i;

// Where on the page a click happened: an explicit data-track-area, or the part of the layout it sits in.
function areaOf(el: Element) {
  const marked = el.closest('[data-track-area]');
  if (marked) return marked.getAttribute('data-track-area');
  if (el.closest('footer')) return 'footer';
  if (el.closest('#mobile-navigation')) return 'mobile-menu';
  if (el.closest('nav, header')) return 'header';
  return pageType();
}

/** Page view + automatic tracking of WhatsApp, call, email, quote and social links anywhere on the site. */
export function initAutoTracking() {
  if (!isBrowser || (window as any).__knaTracking) return;
  (window as any).__knaTracking = true;
  if (window.location.pathname.startsWith('/admin')) return;

  track('page_view');

  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const el = target?.closest?.('a, button');
    if (!el) return;
    const custom = el.getAttribute('data-track') as TrackEvent | null;
    const href = (el as HTMLAnchorElement).href || '';
    const raw = el.getAttribute('href') || '';
    const label = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) || null;
    const location = areaOf(el);
    let event: TrackEvent | null = custom;
    if (!event) {
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)/i.test(href)) event = 'whatsapp_click';
      else if (raw.startsWith('tel:')) event = 'call_click';
      else if (raw.startsWith('mailto:')) event = 'email_click';
      else if (/\/get-quote\/?$/.test(raw)) event = 'quote_click';
      else if (SOCIAL.test(href)) event = 'social_click';
    }
    if (event) track(event, { label, location });
  }, { capture: true });
}

// Offers (sales) shown on the website. The owner manages them in Admin > Offers; supabase-offers.sql creates the tables.
// If the tables do not exist yet the site simply shows no offers.

export interface DbLike { from(table: string): any }

export interface OfferRow {
  id: number;
  name: string;
  badge: string;
  percent_off: number;
  announcement: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  show_banner: boolean;
}

/** What a product page or card needs to know about the offer on a product. */
export interface ProductOffer {
  id: number;
  name: string;
  badge: string;
  percent: number;
  ends_at: string | null;
  original_price: number;
}

export interface LiveOffers {
  offers: OfferRow[];
  byProduct: Map<number, OfferRow>;
  /** The offer to advertise in the announcement bar and home banner: the biggest discount, then the soonest to end. */
  headline: OfferRow | null;
}

const EMPTY: LiveOffers = { offers: [], byProduct: new Map(), headline: null };
const CACHE_MS = 30_000; // admin changes reach the site within 30 seconds
let cache: { at: number; value: LiveOffers } | null = null;

export function isLive(o: Pick<OfferRow, 'active' | 'starts_at' | 'ends_at'>, now = Date.now()): boolean {
  if (!o.active) return false;
  if (o.starts_at && Date.parse(o.starts_at) > now) return false;
  if (o.ends_at && Date.parse(o.ends_at) <= now) return false;
  return true;
}

/** Offers running right now, and which product is in which. Never throws. */
export async function loadOffers(db: DbLike, now = Date.now()): Promise<LiveOffers> {
  if (cache && now - cache.at < CACHE_MS) return cache.value;
  try {
    const { data, error } = await db.from('offers').select('*').eq('active', true);
    if (error) throw error;
    const offers: OfferRow[] = (data || [])
      .map((o: any) => ({ ...o, percent_off: Number(o.percent_off) }))
      .filter((o: OfferRow) => o.percent_off > 0 && o.percent_off < 100 && isLive(o, now));

    const byProduct = new Map<number, OfferRow>();
    if (offers.length) {
      const byId = new Map(offers.map((o) => [o.id, o]));
      for (let from = 0; ; from += 1000) {
        const r = await db.from('offer_products').select('offer_id, product_id')
          .in('offer_id', offers.map((o) => o.id)).order('product_id').range(from, from + 999);
        if (r.error) throw r.error;
        for (const row of r.data || []) {
          const o = byId.get(row.offer_id);
          const cur = byProduct.get(Number(row.product_id));
          if (o && (!cur || o.percent_off > cur.percent_off)) byProduct.set(Number(row.product_id), o);
        }
        if ((r.data || []).length < 1000) break;
      }
    }

    const used = offers.filter((o) => [...byProduct.values()].includes(o));
    const headline = [...used].sort((a, b) =>
      b.percent_off - a.percent_off || (Date.parse(a.ends_at || '9999') - Date.parse(b.ends_at || '9999'))
    )[0] || null;

    const value = { offers: used, byProduct, headline };
    cache = { at: now, value };
    return value;
  } catch (e: any) {
    // 42P01 / PGRST205 = the tables are not there yet: stay quiet
    if (!/offer|42P01|PGRST20/i.test(String(e?.code || '') + String(e?.message || ''))) console.error('Offers lookup error:', e);
    cache = { at: now, value: EMPTY };
    return EMPTY;
  }
}

export function salePrice(price: number, percent: number): number {
  return Math.round(price * (100 - percent) / 100);
}

/**
 * The product as the shopper should see it: on offer, `price` becomes the sale price (so the cart, checkout and
 * Google's structured data all use it), `old_price` the normal price, and `offer` says which sale it is.
 */
export function withOffer<T extends { id: number; price: any; old_price?: any }>(product: T, live: LiveOffers): T & { offer?: ProductOffer } {
  const o = live.byProduct.get(Number(product.id));
  const price = Number(product.price);
  if (!o || !Number.isFinite(price) || price <= 0) return product;
  return {
    ...product,
    price: salePrice(price, o.percent_off),
    old_price: price,
    offer: { id: o.id, name: o.name, badge: o.badge || 'Sale', percent: o.percent_off, ends_at: o.ends_at, original_price: price },
  };
}

export function withOffers<T extends { id: number; price: any; old_price?: any }>(products: T[] | null | undefined, live: LiveOffers) {
  return (products || []).map((p) => withOffer(p, live));
}

/** "30 November" in Nairobi time, for "Ends 30 November". The end is exclusive, so a midnight end shows the day before. */
export function endsLabel(ends_at: string | null): string {
  if (!ends_at) return '';
  const d = new Date(Date.parse(ends_at) - 1000);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', timeZone: 'Africa/Nairobi' });
}

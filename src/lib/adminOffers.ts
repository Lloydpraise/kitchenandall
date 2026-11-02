// Admin > Offers: create, change and remove sales, and choose which products are in them.
// Takes a Supabase client as an argument (the service role one from supabaseAdmin()).
import type { DbLike } from './offers';

type Out = { status: number; body: any };
const MISSING = 'The offers tables are not in the database yet. Run supabase-offers.sql in the Supabase SQL editor first.';

function dbError(error: any): Out {
  const text = String(error?.code || '') + ' ' + String(error?.message || '');
  if (/42P01|PGRST205|does not exist|schema cache/i.test(text)) return { status: 503, body: { error: MISSING, missingTables: true } };
  return { status: 500, body: { error: error?.message || 'Something went wrong' } };
}

const cleanId = (v: unknown): number | null => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };

function cleanText(v: unknown, label: string, min: number, max: number): { value?: string; error?: string } {
  const value = typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
  if (value.length < min) return { error: min > 0 ? `Enter ${label}` : '' };
  if (value.length > max) return { error: `${label[0].toUpperCase()}${label.slice(1)} is too long (${max} characters at most)` };
  if (/[<>]/.test(value)) return { error: `${label[0].toUpperCase()}${label.slice(1)} cannot contain < or >` };
  return { value };
}

function cleanDate(v: unknown, label: string): { value?: string | null; error?: string } {
  if (v == null || v === '') return { value: null };
  const t = Date.parse(String(v));
  if (!Number.isFinite(t)) return { error: `The ${label} date is not a date` };
  return { value: new Date(t).toISOString() };
}

/** Turns what the admin form sends into a row. `partial` allows leaving fields out (for updates). */
export function cleanOffer(body: any, partial = false): { value?: Record<string, unknown>; error?: string } {
  const b = body || {};
  const row: Record<string, unknown> = {};
  const has = (k: string) => !partial || k in b;

  if (has('name')) { const r = cleanText(b.name, 'a name for the offer', 2, 80); if (r.error) return r; row.name = r.value; }
  if (has('badge')) { const r = cleanText(b.badge, 'the badge text', 2, 30); if (r.error) return r; row.badge = r.value; }
  if (has('percent_off')) {
    const n = Number(String(b.percent_off ?? '').replace('%', '').trim());
    if (!Number.isFinite(n) || n <= 0 || n >= 100) return { error: 'The discount must be a percentage between 1 and 99' };
    row.percent_off = Math.round(n * 100) / 100;
  }
  if (has('announcement')) {
    const r = cleanText(b.announcement ?? '', 'the announcement', 0, 160);
    if (r.error) return r;
    row.announcement = r.value || null;
  }
  if (has('starts_at')) { const r = cleanDate(b.starts_at, 'start'); if (r.error) return r; row.starts_at = r.value; }
  if (has('ends_at')) { const r = cleanDate(b.ends_at, 'end'); if (r.error) return r; row.ends_at = r.value; }
  if (row.starts_at && row.ends_at && Date.parse(row.ends_at as string) <= Date.parse(row.starts_at as string)) {
    return { error: 'The offer must end after it starts' };
  }
  if (has('active')) row.active = b.active !== false;
  if (has('show_banner')) row.show_banner = b.show_banner !== false;
  return { value: row };
}

function cleanIds(v: unknown): number[] | null {
  if (!Array.isArray(v)) return null;
  const ids = [...new Set(v.map(cleanId).filter((n): n is number => n !== null))];
  return ids.length > 2000 ? ids.slice(0, 2000) : ids;
}

/** Every offer, newest first, each with the ids of its products. */
export async function listOffers(db: DbLike): Promise<Out> {
  const o = await db.from('offers').select('*').order('id', { ascending: false });
  if (o.error) return dbError(o.error);
  const links: { offer_id: number; product_id: number }[] = [];
  for (let from = 0; ; from += 1000) {
    const r = await db.from('offer_products').select('offer_id, product_id').order('offer_id').order('product_id').range(from, from + 999);
    if (r.error) return dbError(r.error);
    links.push(...(r.data || []));
    if ((r.data || []).length < 1000) break;
  }
  const offers = (o.data || []).map((x: any) => ({
    ...x,
    percent_off: Number(x.percent_off),
    product_ids: links.filter((l) => l.offer_id === x.id).map((l) => Number(l.product_id)),
  }));
  return { status: 200, body: { offers } };
}

async function setProducts(db: DbLike, offerId: number, ids: number[]): Promise<any> {
  const del = await db.from('offer_products').delete().eq('offer_id', offerId);
  if (del.error) return del.error;
  for (let i = 0; i < ids.length; i += 500) {
    const ins = await db.from('offer_products').insert(ids.slice(i, i + 500).map((product_id) => ({ offer_id: offerId, product_id })));
    if (ins.error) return ins.error;
  }
  return null;
}

export async function createOffer(db: DbLike, body: any): Promise<Out> {
  const c = cleanOffer(body);
  if (c.error) return { status: 400, body: { error: c.error } };
  const ids = cleanIds(body?.product_ids) || [];
  const r = await db.from('offers').insert(c.value).select('*').single();
  if (r.error) return dbError(r.error);
  const err = await setProducts(db, r.data.id, ids);
  if (err) return dbError(err);
  return { status: 201, body: { offer: { ...r.data, percent_off: Number(r.data.percent_off), product_ids: ids } } };
}

export async function updateOffer(db: DbLike, rawId: unknown, body: any): Promise<Out> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown offer' } };
  const c = cleanOffer(body, true);
  if (c.error) return { status: 400, body: { error: c.error } };
  const patch = { ...c.value, updated_at: new Date().toISOString() };
  const r = await db.from('offers').update(patch).eq('id', id).select('*').single();
  if (r.error) return r.error.code === 'PGRST116' ? { status: 404, body: { error: 'That offer no longer exists' } } : dbError(r.error);
  const ids = cleanIds(body?.product_ids);
  if (ids) { const err = await setProducts(db, id, ids); if (err) return dbError(err); }
  const links = await db.from('offer_products').select('product_id').eq('offer_id', id).range(0, 4999);
  return { status: 200, body: { offer: { ...r.data, percent_off: Number(r.data.percent_off), product_ids: (links.data || []).map((l: any) => Number(l.product_id)) } } };
}

export async function deleteOffer(db: DbLike, rawId: unknown): Promise<Out> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown offer' } };
  const r = await db.from('offers').delete().eq('id', id);
  if (r.error) return dbError(r.error);
  return { status: 200, body: { ok: true } };
}

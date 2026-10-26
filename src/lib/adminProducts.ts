// What the owner can do to products. Takes a Supabase client as an argument so it can be tested with a fake one.
// The slug is NEVER written here: renaming a product must not change its link.
import { parseContent } from './productContent';

export interface DbLike { from(table: string): any; storage: { from(bucket: string): any } }

export const BUCKET = 'product-images';
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const BASE_COLS = 'id,name,slug,price,image_url,major_category,sub_category';
const FLAG_COLS = ',seo_status,seo_note'; // present once supabase-seo-flags.sql has been run; optional
const APPROVAL_COLS = ',seo_approved,seo_approved_at'; // present once supabase-seo-approval.sql has been run; optional

type Result<T> = { value: T; error?: undefined } | { value?: undefined; error: string };

export function cleanName(v: unknown): Result<string> {
  if (typeof v !== 'string') return { error: 'Enter a product name' };
  const value = v.replace(/\s+/g, ' ').trim();
  if (value.length < 3) return { error: 'The name must be at least 3 characters' };
  if (value.length > 120) return { error: 'The name is too long (120 characters at most)' };
  if (/[<>]/.test(value)) return { error: 'The name cannot contain < or >' };
  return { value };
}

export function cleanPrice(v: unknown): Result<number> {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/^\s*(ksh|kes)\.?/i, '').replace(/[,\s]/g, '')) : NaN;
  if (!Number.isFinite(n)) return { error: 'Enter the price as a number, for example 45000' };
  if (n < 0) return { error: 'The price cannot be negative' };
  if (n > 100_000_000) return { error: 'That price looks too high. Check the zeros' };
  return { value: Math.round(n * 100) / 100 };
}

const cleanId = (v: unknown): number | null => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };

/** Ids of products whose SEO is done. Uses the database's seo_done flag (supabase-seo-approval.sql); falls back to "has structured content". null when neither can be read. */
async function seoDoneIds(db: DbLike): Promise<Set<number> | null> {
  async function collect(build: (from: number) => any): Promise<Set<number> | null> {
    const ids = new Set<number>();
    for (let from = 0; ; from += 1000) {
      const r = await build(from);
      if (r.error) return null;
      for (const x of r.data) ids.add(x.id);
      if (r.data.length < 1000) break;
    }
    return ids;
  }
  const viaFlag = await collect((from) => db.from('products').select('id').eq('seo_done', true).order('id').range(from, from + 999));
  if (viaFlag) return viaFlag;
  return collect((from) => db.from('products').select('id').not('content', 'is', null).order('id').range(from, from + 999));
}

/** All products, A to Z, in pages of 1000 (Supabase's default row limit). Each one says whether its SEO is done and approved. */
export async function listProducts(db: DbLike) {
  // Optional columns are tried in this order so the admin keeps working before the SQL files have been run.
  const variants = [FLAG_COLS + APPROVAL_COLS, FLAG_COLS, APPROVAL_COLS, ''];
  let chosen = -1;
  const all: any[] = [];
  for (let from = 0; ; from += 1000) {
    let r: any;
    if (chosen < 0) {
      for (let i = 0; i < variants.length; i++) {
        r = await db.from('products').select(BASE_COLS + variants[i]).order('id', { ascending: false }).range(from, from + 999);
        if (!r.error) { chosen = i; break; }
      }
    } else {
      r = await db.from('products').select(BASE_COLS + variants[chosen]).order('id', { ascending: false }).range(from, from + 999);
    }
    if (r.error) throw new Error(r.error.message);
    all.push(...r.data);
    if (r.data.length < 1000) break;
  }
  const hasFlags = chosen === 0 || chosen === 1;
  const hasApproval = chosen === 0 || chosen === 2;
  const done = await seoDoneIds(db);
  for (const p of all) {
    p.seo_done = !!done && done.has(p.id);
    if (hasApproval) p.seo_approved = !!p.seo_approved;
  }
  return { products: all, hasFlags, hasApproval, hasSeoContent: done !== null };
}

/** Change a product's name and/or price. Only those two columns can be written. */
export async function updateProduct(db: DbLike, rawId: unknown, body: any): Promise<{ status: number; body: any }> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown product' } };
  const patch: Record<string, unknown> = {};
  if (body && 'name' in body) { const n = cleanName(body.name); if (n.error) return { status: 400, body: { error: n.error } }; patch.name = n.value; }
  if (body && 'price' in body) { const p = cleanPrice(body.price); if (p.error) return { status: 400, body: { error: p.error } }; patch.price = p.value; }
  if (!Object.keys(patch).length) return { status: 400, body: { error: 'Nothing to change' } };

  const { data, error } = await db.from('products').update(patch).eq('id', id).select(BASE_COLS).single();
  if (error) return error.code === 'PGRST116' ? { status: 404, body: { error: 'That product no longer exists' } } : { status: 500, body: { error: error.message } };

  if ('name' in patch) {
    // best effort: tell the SEO engine this "needs a clearer name" product now has one (ignored if the flag columns do not exist)
    try { await db.from('products').update({ seo_status: 'name_updated', seo_note: null }).eq('id', id).eq('seo_status', 'no_reference'); } catch { /* optional */ }
  }
  return { status: 200, body: { product: data } };
}

function sniff(b: Uint8Array): string | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/** Upload a photo and make it the product's image. The file's real type is checked, not just what the browser says. */
export async function setImage(db: DbLike, rawId: unknown, bytes: Uint8Array): Promise<{ status: number; body: any }> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown product' } };
  if (!bytes.length) return { status: 400, body: { error: 'No photo received' } };
  if (bytes.length > MAX_IMAGE_BYTES) return { status: 413, body: { error: 'That photo is too large (6 MB at most)' } };
  const type = sniff(bytes);
  if (!type) return { status: 400, body: { error: 'Please choose a JPG, PNG or WEBP photo' } };

  const exists = await db.from('products').select('id').eq('id', id).maybeSingle();
  if (exists.error || !exists.data) return { status: 404, body: { error: 'That product no longer exists' } };

  const path = `admin/${id}-${Date.now()}.${EXT[type]}`;
  const up = await db.storage.from(BUCKET).upload(path, bytes, { contentType: type, upsert: false });
  if (up.error) return { status: 500, body: { error: `Photo upload failed: ${up.error.message}` } };
  const url = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { data, error } = await db.from('products').update({ image_url: url }).eq('id', id).select(BASE_COLS).single();
  if (error) return { status: 500, body: { error: error.message } };
  return { status: 200, body: { product: data } };
}


// ---------- SEO review ----------

export interface SeoEdit {
  intro: string;
  key_features: string[];
  sections: { heading: string; body: string }[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
}

/** Rebuilds the plain-text description in the format the engine writes, so cards and the page fallback match the edited content. */
export function buildDescription(c: SeoEdit): string {
  const out: string[] = [];
  if (c.intro) out.push(c.intro);
  for (const s of c.sections) out.push(s.heading ? `${s.heading}\n${s.body}` : s.body);
  if (c.key_features.length) out.push('Key Features\n' + c.key_features.map((f) => `- ${f}`).join('\n'));
  if (c.specs.length) out.push('Specifications\n' + c.specs.map((x) => `${x.label}: ${x.value}`).join('\n'));
  if (c.faqs.length) { out.push('Frequently Asked Questions'); for (const f of c.faqs) out.push(`${f.q}\n${f.a}`); }
  return out.join('\n\n');
}

class Bad extends Error {}

function txt(v: unknown, max: number, what: string, multiline = false): string {
  if (v == null) return '';
  if (typeof v !== 'string') throw new Bad(`${what} must be text`);
  const t = multiline
    ? v.replace(/\r/g, '').split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim()
    : v.replace(/\s+/g, ' ').trim();
  if (t.length > max) throw new Bad(`${what} is too long (${max} characters at most)`);
  return t;
}
function list(v: unknown, max: number, what: string): any[] {
  if (v == null) return [];
  if (!Array.isArray(v)) throw new Bad(`${what} is not valid`);
  if (v.length > max) throw new Bad(`Too many ${what} (${max} at most)`);
  return v;
}

function cleanSeo(c: any): SeoEdit {
  if (!c || typeof c !== 'object') throw new Bad('Nothing to save');
  const out: SeoEdit = {
    intro: txt(c.intro, 4000, 'The introduction', true),
    key_features: list(c.key_features, 30, 'key features').map((f) => txt(f, 300, 'A key feature')).filter(Boolean),
    sections: list(c.sections, 30, 'sections')
      .map((s) => ({ heading: txt(s && s.heading, 150, 'A section heading'), body: txt(s && s.body, 6000, 'A section', true) }))
      .filter((s) => s.body),
    specs: list(c.specs, 40, 'specifications')
      .map((s) => ({ label: txt(s && s.label, 80, 'A specification name'), value: txt(s && s.value, 300, 'A specification value') }))
      .filter((s) => s.label && s.value),
    faqs: list(c.faqs, 30, 'FAQs')
      .map((f) => ({ q: txt(f && f.q, 300, 'A question'), a: txt(f && f.a, 3000, 'An answer', true) }))
      .filter((f) => f.q && f.a),
  };
  if (!out.intro && !out.key_features.length && !out.sections.length && !out.specs.length && !out.faqs.length) throw new Bad('The page cannot be left empty');
  return out;
}

/** One product's SEO content, in a shape the review screen can edit. */
export async function getSeo(db: DbLike, rawId: unknown): Promise<{ status: number; body: any }> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown product' } };
  const { data, error } = await db.from('products').select('*').eq('id', id).maybeSingle();
  if (error) return { status: 500, body: { error: error.message } };
  if (!data) return { status: 404, body: { error: 'That product no longer exists' } };
  const c = parseContent(data);
  return {
    status: 200,
    body: {
      seo: {
        id: data.id, name: data.name, slug: data.slug, image_url: data.image_url,
        hasMeta: 'meta_title' in data && 'meta_description' in data,
        hasApproval: 'seo_approved' in data,
        approved: !!data.seo_approved,
        meta_title: data.meta_title || '', meta_description: data.meta_description || '',
        intro: c.intro, key_features: c.features, sections: c.sections, specs: c.specs, faqs: c.faqs,
      },
    },
  };
}

/**
 * Save edits to a product's SEO and/or change its approval.
 * body.content = the edited page, body.meta_title / meta_description = Google listing, body.approved = true | false.
 * Saving edits never changes the approval by itself. Only `approved` does.
 */
export async function saveSeo(db: DbLike, rawId: unknown, body: any): Promise<{ status: number; body: any }> {
  const id = cleanId(rawId);
  if (!id) return { status: 400, body: { error: 'Unknown product' } };
  if (!body || typeof body !== 'object') return { status: 400, body: { error: 'Bad request' } };
  const cur = await db.from('products').select('*').eq('id', id).maybeSingle();
  if (cur.error) return { status: 500, body: { error: cur.error.message } };
  if (!cur.data) return { status: 404, body: { error: 'That product no longer exists' } };
  const row = cur.data;
  const patch: Record<string, unknown> = {};

  try {
    if ('content' in body) {
      if (!('content' in row)) return { status: 400, body: { error: 'This store has no content column yet' } };
      const c = cleanSeo(body.content);
      let base: any = row.content;
      if (typeof base === 'string') { try { base = JSON.parse(base); } catch { base = {}; } }
      if (!base || typeof base !== 'object' || Array.isArray(base)) base = {};
      const merged = { ...base, intro: c.intro, key_features: c.key_features, sections: c.sections, specs: c.specs, faqs: c.faqs };
      patch.content = typeof row.content === 'string' ? JSON.stringify(merged) : merged;
      patch.description = buildDescription(c);
    }
    if ('meta_title' in body && 'meta_title' in row) patch.meta_title = txt(body.meta_title, 120, 'The Google title') || null;
    if ('meta_description' in body && 'meta_description' in row) patch.meta_description = txt(body.meta_description, 320, 'The Google description') || null;
  } catch (e: any) {
    if (e instanceof Bad) return { status: 400, body: { error: e.message } };
    throw e;
  }

  const hasApproval = 'seo_approved' in row;
  if (body.approved === true || body.approved === false) {
    if (!hasApproval) return { status: 400, body: { error: 'Approval is not switched on yet. Run supabase-seo-approval.sql in Supabase first.' } };
    patch.seo_approved = body.approved;
    patch.seo_approved_at = body.approved ? new Date().toISOString() : null;
  }
  if (!Object.keys(patch).length) return { status: 400, body: { error: 'Nothing to change' } };

  const { data, error } = await db.from('products').update(patch).eq('id', id).select('id' + (hasApproval ? APPROVAL_COLS : '')).single();
  if (error) return error.code === 'PGRST116' ? { status: 404, body: { error: 'That product no longer exists' } } : { status: 500, body: { error: error.message } };
  return { status: 200, body: { product: { ...data, seo_done: true } } };
}

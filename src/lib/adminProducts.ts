// What the owner can do to products. Takes a Supabase client as an argument so it can be tested with a fake one.
// The slug is NEVER written here: renaming a product must not change its link.

export interface DbLike { from(table: string): any; storage: { from(bucket: string): any } }

export const BUCKET = 'product-images';
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const BASE_COLS = 'id,name,slug,price,image_url,major_category,sub_category';
const FLAG_COLS = ',seo_status,seo_note'; // present once supabase-seo-flags.sql has been run; optional

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

/** All products, A to Z, in pages of 1000 (Supabase's default row limit). */
export async function listProducts(db: DbLike) {
  let withFlags = true;
  const all: any[] = [];
  for (let from = 0; ; from += 1000) {
    let r = await db.from('products').select(BASE_COLS + (withFlags ? FLAG_COLS : '')).order('name').range(from, from + 999);
    if (r.error && withFlags) { withFlags = false; r = await db.from('products').select(BASE_COLS).order('name').range(from, from + 999); }
    if (r.error) throw new Error(r.error.message);
    all.push(...r.data);
    if (r.data.length < 1000) break;
  }
  return { products: all, hasFlags: withFlags };
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

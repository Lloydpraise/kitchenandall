import type { APIRoute } from 'astro';
import { guard, json } from '../../../../../lib/adminGuard';
import { MAX_IMAGE_BYTES, setImage } from '../../../../../lib/adminProducts';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

export const prerender = false;

// The browser sends the (already resized) photo as the raw request body.
export const POST: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  const declared = Number(ctx.request.headers.get('content-length') || 0);
  if (declared > MAX_IMAGE_BYTES) return json({ error: 'That photo is too large (6 MB at most)' }, 413);
  try {
    const bytes = new Uint8Array(await ctx.request.arrayBuffer());
    const r = await setImage(supabaseAdmin() as any, ctx.params.id, bytes);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not upload the photo' }, 500);
  }
};

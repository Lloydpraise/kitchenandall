import type { APIRoute } from 'astro';
import { guard, json } from '../../../../lib/adminGuard';
import { updateProduct } from '../../../../lib/adminProducts';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const prerender = false;

// Changes a product's name and/or price. The slug (the product's link) is never touched.
export const PATCH: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  try {
    const r = await updateProduct(supabaseAdmin() as any, ctx.params.id, body);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not save' }, 500);
  }
};

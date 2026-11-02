import type { APIRoute } from 'astro';
import { guard, json } from '../../../../lib/adminGuard';
import { deleteOffer, updateOffer } from '../../../../lib/adminOffers';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const prerender = false;

// Change an offer: any of its fields, and (when product_ids is sent) exactly which products are in it
export const PATCH: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  try {
    const r = await updateOffer(supabaseAdmin() as any, ctx.params.id, body);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not save' }, 500);
  }
};

export const DELETE: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  try {
    const r = await deleteOffer(supabaseAdmin() as any, ctx.params.id);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not delete' }, 500);
  }
};

import type { APIRoute } from 'astro';
import { guard, json } from '../../../../lib/adminGuard';
import { createOffer, listOffers } from '../../../../lib/adminOffers';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const prerender = false;

// Every offer with its products
export const GET: APIRoute = async (ctx) => {
  const denied = await guard(ctx);
  if (denied) return denied;
  try {
    const r = await listOffers(supabaseAdmin() as any);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not load offers' }, 500);
  }
};

// A new offer
export const POST: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  try {
    const r = await createOffer(supabaseAdmin() as any, body);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not save' }, 500);
  }
};

import type { APIRoute } from 'astro';
import { guard, json } from '../../../../../lib/adminGuard';
import { getSeo, saveSeo } from '../../../../../lib/adminProducts';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

export const prerender = false;

// Reads one product's SEO content for the Review SEO screen.
export const GET: APIRoute = async (ctx) => {
  const denied = await guard(ctx);
  if (denied) return denied;
  try {
    const r = await getSeo(supabaseAdmin() as any, ctx.params.id);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not load this product' }, 500);
  }
};

// Saves edits to the SEO content and/or approves it. The slug (the product's link) is never touched.
export const PATCH: APIRoute = async (ctx) => {
  const denied = await guard(ctx, true);
  if (denied) return denied;
  let body: unknown;
  try { body = await ctx.request.json(); } catch { return json({ error: 'Bad request' }, 400); }
  try {
    const r = await saveSeo(supabaseAdmin() as any, ctx.params.id, body);
    return json(r.body, r.status);
  } catch (e: any) {
    return json({ error: e.message || 'Could not save' }, 500);
  }
};

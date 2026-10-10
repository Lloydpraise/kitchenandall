import type { APIRoute } from 'astro';
import { guard, json } from '../../../../lib/adminGuard';
import { listProducts } from '../../../../lib/adminProducts';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const denied = await guard(ctx);
  if (denied) return denied;
  try {
    return json(await listProducts(supabaseAdmin() as any));
  } catch (e: any) {
    return json({ error: e.message || 'Could not load products' }, 500);
  }
};

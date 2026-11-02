// Numbers for /admin/analytics. Signed-in owner only; reads Supabase with the server-side service role key.
import type { APIRoute } from 'astro';
import { guard, json } from '../../../lib/adminGuard';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export const prerender = false;

const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000; // Kenya is UTC+3 all year

/** Midnight in Nairobi, `daysAgo` days back, as a UTC Date. */
function nairobiMidnight(daysAgo: number, now = Date.now()) {
  const local = new Date(now + NAIROBI_OFFSET_MS);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - NAIROBI_OFFSET_MS - daysAgo * 86_400_000);
}

function rangeFor(range: string, now = Date.now()) {
  const to = new Date(now);
  switch (range) {
    case 'today': return { from: nairobiMidnight(0, now), to };
    case 'yesterday': return { from: nairobiMidnight(1, now), to: nairobiMidnight(0, now) };
    case '30d': return { from: nairobiMidnight(29, now), to };
    case '90d': return { from: nairobiMidnight(89, now), to };
    case '365d': return { from: nairobiMidnight(364, now), to };
    default: return { from: nairobiMidnight(6, now), to }; // 7 days including today
  }
}

export const GET: APIRoute = async (ctx) => {
  const denied = await guard(ctx);
  if (denied) return denied;
  const { from, to } = rangeFor(ctx.url.searchParams.get('range') || '7d');
  try {
    const { data, error } = await (supabaseAdmin() as any).rpc('admin_site_analytics', {
      p_from: from.toISOString(),
      p_to: to.toISOString(),
    });
    if (error) {
      const missing = /admin_site_analytics|site_events|does not exist|schema cache/i.test(error.message || '');
      return json({ error: missing ? 'Analytics is not set up in Supabase yet. Run supabase/site-analytics.sql in the Supabase SQL editor.' : error.message }, 500);
    }
    return json(data);
  } catch (e: any) {
    return json({ error: e.message || 'Could not load analytics' }, 500);
  }
};

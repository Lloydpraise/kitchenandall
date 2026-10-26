import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
import { categories, categoryUrl, subCategoryUrl } from '../lib/categories';

export const prerender = false;

const siteUrl = 'https://kitchenandall.co.ke';

export const GET: APIRoute = async () => {
  const { data: products } = await supabase.from('products').select('slug');
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true);

  const staticUrls = ['', 'catalog', 'blogs', 'get-quote', 'terms', 'privacy', 'shipping', 'returns'];
  const categoryUrls = ['/category', ...categories.flatMap((c) => [categoryUrl(c), ...c.subs.map((s) => subCategoryUrl(c, s))])].map((u) => u.slice(1));
  const productUrls = (products || []).map((p: any) => `product/${p.slug}`);
  const postUrls = (posts || []).map((p: any) => `blogs/${p.slug}`);

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map((path) => `  <url><loc>${siteUrl}/${path}</loc></url>`).join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
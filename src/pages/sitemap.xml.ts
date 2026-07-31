import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const prerender = false;

const siteUrl = 'https://YOUR-DOMAIN-HERE.com';

const majorCategories = ["Cooking", "Refrigeration", "Food Prep", "Stainless Steel"];
const subCategories = [
  "Bakery Appliances", "Burners Jikos Stoves", "Cooking Appliances", "Small Appliances",
  "Large Appliances", "Hotel Appliances", "Office Kitchen",
  "Butchery Equipment", "Food Processors", "Measuring Tools Scales",
  "Home Kitchen", "Juakali Fabrications"
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[\s/]+/g, '-');
}

export const GET: APIRoute = async () => {
  const { data: products } = await supabase.from('products').select('slug');
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true);

  const staticUrls = ['', 'blogs', 'get-quote', 'terms', 'privacy'];
  const categoryUrls = [...majorCategories, ...subCategories].map((c) => `category/${slugify(c)}`);
  const productUrls = (products || []).map((p: any) => `product/${p.slug}`);
  const postUrls = (posts || []).map((p: any) => `blogs/${p.slug}`);

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map((path) => `  <url><loc>${siteUrl}/${path}</loc></url>`).join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

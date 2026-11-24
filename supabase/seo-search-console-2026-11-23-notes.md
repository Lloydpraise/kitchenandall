# Search Console fixes, 23 Nov 2026

Source: Search Console export of 23 Nov 2026 (about 3k impressions, under 100 clicks). The pasted-prompt queries in the export were ignored.

## What to run or deploy

1. **Run `supabase/seo-search-console-2026-11-23.sql` once** in Supabase > SQL Editor. It backs up first, then:
   - rewrites meta title and description for 41 products that sit on Google page 1 (or close) with few clicks;
   - moves 138 products (ids 349 to 486) out of the old "Cooking" / "Stainless Steel" categories into the current tree. Until this runs they appear on **no** category page, so the bakery, butchery, bain marie and cooking hubs Google sees are missing about a quarter of the catalogue (for example the deck ovens 369, 370, 386, the spiral mixer 459, the meat mincer 357/358 and 17 bain maries).
2. **Deploy the code changes** (kitchenandall, uncommitted on main):
   - `src/lib/categoryGuides.ts` (new): buying guides, live price tables and FAQs for Bakery Equipment, Butchery Equipment, Food Processing Machines and Display Warmers. FAQPage structured data on each.
   - `src/pages/category/[...path].astro`: shows the guide under the products when a page has one.
   - `src/pages/commercial-kitchen-equipment-nairobi.astro` (new): hub for "commercial kitchen equipment nairobi", "catering equipment kenya", "kitchen equipment suppliers in nairobi", "commercial ovens kenya". Linked from the home page, footer and sitemap.
   - `src/lib/categories.ts`: titles and descriptions for the bakery, baking ovens, butchery, meat mincer, food processing, display warmers, bain marie and trolleys pages now lead with the searched phrase.
   - `src/pages/index.astro`: a "popular guides" link row under the featured products.
   - `src/pages/product/[slug].astro`: Product schema now has `seller` and `category`. Price and availability were already there.
3. After deploying, ask Google to recrawl in Search Console: the Nairobi page, the four hub pages, and the sitemap.

## Products rewritten (query -> product)

| Query | Product id(s) |
|---|---|
| modern firewood jiko with chimney (+ price in kenya) | 179, 170 |
| jua kali jiko / firewood jiko price in kenya | 296, 172, 442 |
| jua kali oven price in kenya | 64 |
| mortuary trolley | 293, 16 |
| trolley cart / trolley | 158, 30, plus the trolleys category title |
| sizzling plate | 14 |
| glass display counter (+ price in kenya) | 308 |
| hotel display counter / food display counter | 273, 52 |
| urinal trough | 439, 474, 27 |
| bain marie (+ price in kenya) | 41, 43, 116, plus the bain marie category title |
| rotisserie oven / commercial chicken roaster | 136, 348, 305 |
| tandoor / tandoori oven | 128, 163 |
| cake display fridge | 19, 72 |
| 10kg dough mixer price in kenya | 55, 22 |
| meat display chiller / counter price in kenya | 89, 92, 146 |
| jua kali food warmer / display warmers | 148, 133 |
| how much is chips machine | 18 |
| grease trap price | 112 |
| sugar cane juice machine | 193 |
| stainless steel railing / handrail | 10 |
| pot wash sink | 409 |
| scrub sink for hospital | 68 |
| kitchen hood / vent hood | 90 |

Each description carries the product's current site price (KES). If a price changes, the description should be updated with it.

## Demand with no matching page

Most of the "missing" queries already have products; they were just not targeted. Those are covered above: sugarcane juice machine (193), grease traps (112, 339, 343), pot wash sink (409), stainless handrails (10, 388), kitchen hoods (many), scrub sinks (68 and others), chips fryers and cutters.

Real gaps worth adding (needs your prices and photos, so not added):

1. **"How much is a chips machine" guide or bundle.** About 25 impressions across "how much is chips machine", "chips cooking machine price", "potato chips equipment", "chips peeler machine". A blog post or bundle page linking the chips fryer (18), fryers, cutter (475, 88), peeler (135) and chips display warmer (148).
2. **Kitchen hood ducting / exhaust pipe sold per metre.** "kitchen hood exhaust pipe", "kitchen hood duct", "duct hood". A per metre product like the railings one.
3. **Hand washing bucket with tap.** 5 impressions at position 10; cheap item for schools and kiosks.
4. **Gastronorm pans (food inserts) and bain marie sneeze guards sold on their own.** "food inserts", "sneeze guard for bain marie".
5. **Shop / phone glass display counter.** "shop display counter", "phone display counter", "display counter for shop" (about 14 impressions). Current counters are food counters; a retail version would match.
6. **Grease trap cost guide.** "grease trap price", "cost of grease trap", "grease trap for kitchen sink". Products exist; a short guide page or blog post would help them rank.

## Other things noticed

- Product 6 has the slug `commercial-gas-chicken-rotisserie-oven` but is a 6 tray oven. It shows up for rotisserie searches at position 34. Left alone; renaming the slug (with old_slugs redirect) is your call.
- `stainless-steel-extraction-hood-with-grease-filters-display-stand` (250) sits under Food Display Warmers and now shows in that page's price table. It may belong under Kitchen Exhaust Hoods.
- While an offer is live, the site shows the sale price but the meta descriptions show the normal price.

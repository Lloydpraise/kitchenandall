// Buying guides shown under the products on the main category hub pages.
// Written for the head terms Search Console shows these pages almost ranking for (Nov 2026):
// "bakery equipment", "bakery machine price in kenya", "butchery equipment", "food processing machines in kenya",
// "display warmers supplier kenya". The price table on each page is built live from the products in it,
// so only the words below need editing by hand.
//
// Text format: paragraphs split by a blank line, "- " starts a bullet, [link text](/path) makes a link.

export interface GuideSection { heading: string; body: string }
export interface Guide {
  heading: string; // H2 above the guide
  sections: GuideSection[];
  tableHeading: string;
  faqs: { q: string; a: string }[];
}

export const categoryGuides: Record<string, Guide> = {
  'bakery-equipment': {
    heading: 'Bakery equipment in Kenya: what you need and what it costs',
    sections: [
      {
        heading: 'The core bakery machines',
        body: `Every bakery in Kenya, from a two person kiosk to a supermarket bakery, runs on the same four kinds of bakery equipment: an oven, a dough mixer, trays and tins, and somewhere to cool and slice the bread. Get those right and the rest of the bakery machine list can grow with your sales.

- **Baking oven.** The biggest buy and the one that sets your output. Choose a [charcoal oven](/category/bakery-equipment/charcoal-ovens) where power is costly or unreliable, or an electric or gas [deck oven](/category/bakery-equipment/baking-ovens) for steady, even bakes at volume.
- **Dough mixer.** A [spiral or planetary dough mixer](/category/bakery-equipment/dough-mixers) kneads bread, chapati and mandazi dough in minutes and gives the same result every batch. A [10kg dough mixer with a 20 litre bowl](/product/commercial-dough-mixer-20l) suits most small and medium bakeries.
- **Tins, trays and racks.** Loaf tins and baking pans give every loaf the same shape, and a [cooling rack trolley](/product/stainless-steel-cooling-rack-trolley) moves a full bake out of the way so the oven can go again.
- **Bread slicer.** A [bread slicer machine](/product/commercial-bread-slicer-machine) cuts a full loaf into even slices in seconds, which matters once you sell sliced bread to shops.`,
      },
      {
        heading: 'Charcoal, gas or electric oven?',
        body: `**Charcoal ovens** cost the least to buy and run without electricity. They suit home bakers, schools and small bakeries in areas with power cuts. Our jua kali style ovens such as the [charcoal oven jiko](/product/charcoal-jiko-oven) and the [double compartment charcoal oven with glass doors](/product/double-compartment-charcoal-baking-oven-with-glass-doors) bake cakes, bread and buns on charcoal.

**Gas deck ovens** heat quickly and keep baking through power cuts, so they are a good middle ground for growing bakeries.

**Electric deck ovens** give the most even bake and precise temperature control. A [single deck oven](/product/single-deck-baking-oven-with-digital-controls) is enough to start, a [double deck oven](/product/double-deck-baking-oven-with-4-trays) doubles output on the same floor space, and a [3 deck electric bakery oven](/product/3-deck-electric-bakery-oven-with-digital-controls) suits bakeries supplying shops every morning. Check your power supply before you buy, as larger deck ovens may need a three phase line.`,
      },
      {
        heading: 'Commercial baking equipment for hotels and restaurants',
        body: `Hotels, restaurants and cafes usually need a smaller set: one deck oven, a planetary mixer for cakes and cream, and a [cake display fridge](/product/bakery-cake-display-fridge-4ft) at the front. Pizza places add an [electric double deck pizza oven](/product/electric-double-deck-pizza-oven), and Indian restaurants a [tandoor oven](/product/tadoor-oven).`,
      },
      {
        heading: 'Buying bakery equipment from Kitchen And All',
        body: `We are bakery equipment suppliers in Nairobi with our own stainless steel workshop, so we can supply a single machine or a full bakery set up and match the sizes to your space and power. Tell us how many loaves or cakes you plan to bake a day and we will put together a bakery equipment list and prices to fit your budget. Delivery is free within Nairobi and we ship across Kenya.`,
      },
    ],
    tableHeading: 'Bakery equipment prices in Kenya',
    faqs: [
      { q: 'How much does it cost to start a small bakery in Kenya?', a: 'A small bakery can start with a charcoal oven, baking tins and hand mixing for well under KES 50,000 in equipment. A small commercial set up with a single deck oven and a 20 litre dough mixer starts at around KES 160,000. The table above shows our current starting price for each type of bakery machine.' },
      { q: 'Which oven is best for a bakery in Kenya?', a: 'Where power is reliable, an electric deck oven gives the most even bake. Where power cuts are common, a gas deck oven or a charcoal oven keeps you baking. Many bakeries keep a charcoal oven as a backup.' },
      { q: 'What size dough mixer do I need?', a: 'A 20 litre mixer kneads up to about 10kg of dough per batch, which suits most small and medium bakeries, hotels and restaurants. Bakeries making hundreds of loaves a day should look at a larger spiral mixer.' },
      { q: 'Do you deliver bakery equipment outside Nairobi?', a: 'Yes. Delivery is free within Nairobi and we ship bakery equipment to the rest of Kenya. Ask us for a delivery quote to your town.' },
    ],
  },

  'butchery-equipment': {
    heading: 'Butchery equipment in Kenya: tools, machines and prices',
    sections: [
      {
        heading: 'What a butchery needs',
        body: `A butchery that sells well keeps meat cold, shows it clearly and cuts it quickly. That means three groups of butchery tools and equipment:

- **Meat display chillers.** The customer buys with their eyes, so a [meat display chiller](/category/butchery-equipment/meat-display-chillers) with curved glass is the heart of the shop. A [4ft meat display chiller](/product/4ft-meat-chiller-display) suits a small butchery, while a [6ft meat display chiller](/product/6ft-commercial-meat-chiller-display) shows more cuts for busy shops and supermarkets.
- **Cold storage.** A [hanging meat refrigerator](/product/hanging-meat-refrigerator) holds whole carcasses and quarters at the right temperature behind the counter.
- **Cutting machines and tools.** [Meat mincers](/product/commercial-electric-meat-mincer-stainless-steel), [meat slicers](/product/10-inch-commercial-meat-slicer), bone saws and cleavers in our [butchery machines and tools](/category/butchery-equipment/butchery-machines) range cut and portion faster, with less waste.`,
      },
      {
        heading: 'Choosing a meat display chiller',
        body: `Measure the counter space first, then pick the length: 4ft for a small shop, 6ft for a busy one. Look for curved glass for a clear view, a stainless steel body that wipes clean, and a temperature that holds meat between about 0 and 5°C. Plan a power point close to the chiller and keep it out of direct sun so the compressor does not overwork. Our [meat display counter with curved glass and LED lighting](/product/commercial-meat-display-case) gives a modern butchery front at a fair price.`,
      },
      {
        heading: 'Commercial meat mincers and slicers',
        body: `A commercial meat mincer earns its cost quickly in butcheries that sell minced meat and sausages, and in hotels that make their own burgers. A stainless steel electric mincer like our [commercial electric meat grinder](/product/commercial-electric-meat-grinder-tc22) is easy to strip and clean at the end of the day. A [commercial slicer](/product/10-inch-commercial-meat-slicer) gives even slices of cooked meats, bacon and cheese for delis and supermarkets.`,
      },
      {
        heading: 'A butchery equipment supplier in Kenya you can call back',
        body: `We supply butchery equipment from Nairobi with free delivery within the city and shipping across Kenya. Our team helps you plan the layout, from the chiller at the front to the cutting table and sink at the back, and we also make [stainless steel work tables](/category/tables-storage/work-tables) and [sinks](/category/stainless-steel-sinks) to size so the whole shop passes public health inspection.`,
      },
    ],
    tableHeading: 'Butchery equipment prices in Kenya',
    faqs: [
      { q: 'What equipment do I need to start a butchery in Kenya?', a: 'At minimum a meat display chiller, a chopping block or stainless steel work table, knives and a cleaver, a weighing scale and a hand wash sink. Busier shops add a meat mincer, a bone saw and a hanging meat fridge for cold storage.' },
      { q: 'How much is a meat display chiller in Kenya?', a: 'Our meat display chillers start from about KES 65,000 for a 4ft unit. 6ft chillers and hanging meat fridges cost more. The table above shows today\'s starting price for each type.' },
      { q: 'Which meat mincer is best for a butchery?', a: 'Choose a stainless steel electric mincer with a strong motor that you can take apart for cleaning. It should mince several kilograms of meat in minutes without overheating.' },
      { q: 'Do you deliver and install butchery equipment?', a: 'Yes. Delivery is free within Nairobi and we ship to the rest of Kenya. We advise on where to place the chiller and power points before delivery.' },
    ],
  },

  'food-processing': {
    heading: 'Food processing machines in Kenya',
    sections: [
      {
        heading: 'Machines that save labour and open new income',
        body: `Food processing machines take slow, repetitive work off your staff and let a small business sell more. In Kenya the most popular food processing equipment falls into a few groups:

- **Chips cutters and potato peelers.** A [chips cutter](/product/potato-chips-cutter-on-mild-steel-stand) and an [electric potato peeler](/product/stainless-steel-electric-potato-peeler) prepare a full sack of potatoes in minutes for fast food shops, hotels and schools.
- **Juice machines.** A [sugarcane juice machine](/product/sugarcane-juice-extractor-machine), a [juice extractor](/category/food-processing/juice-tea-machines) or a cold [juice dispenser](/product/3-tank-electric-juice-dispenser) turns fruit and cane into a high margin drink.
- **Roasters and rotary drums.** [Rotary drum roasters](/category/food-processing/roasters-rotary-drums) roast groundnuts, peanuts and coffee evenly for snack makers and small food factories.
- **Milk processing tanks.** Food grade [milk tanks, pasteurizers and mixing tanks](/category/food-processing/milk-mixing-tanks) for dairies, yoghurt makers and cooperatives.
- **Water vending machines** and **price computing scales** for shops and water businesses.`,
      },
      {
        heading: 'Milk processing tanks and dairy equipment',
        body: `Dairies and milk bars need tanks that are easy to clean and safe for food. Our [5000 litre milk tank](/product/stainless-steel-food-grade-milk-tank-5000-litres) holds bulk milk for cooperatives, a [batch milk pasteurizer](/product/stainless-steel-batch-milk-pasteurizer) heat treats milk for sale, and an [electric mixing tank with agitator](/product/stainless-steel-electric-mixing-tank-with-agitator-and-control-panel) suits yoghurt, juice and sauce makers. All are built in food grade stainless steel and can be made to the size you need.`,
      },
      {
        heading: 'Choosing food production equipment',
        body: `Start from what you will produce in a day and the power you have. Ask how long a batch takes, how the machine is cleaned, and whether spare parts and service are available locally. Stainless steel contact parts are a must for anything that touches food, and are what public health officers look for during inspections.`,
      },
      {
        heading: 'Food processing equipment from a Nairobi workshop',
        body: `Because we fabricate in stainless steel ourselves, many of our food processing machines can be adjusted to your capacity, from tank size to the number of drums on a roaster. Delivery is free within Nairobi and we ship across Kenya. Send us what you want to produce and we will recommend the right machine.`,
      },
    ],
    tableHeading: 'Food processing machine prices in Kenya',
    faqs: [
      { q: 'Which food processing business is easiest to start in Kenya?', a: 'Chips, fresh juice and roasted nuts are popular low cost starts. A chips cutter costs a few thousand shillings, and a sugarcane juice machine or nut roaster can pay for itself quickly in a busy location.' },
      { q: 'Do you make milk processing tanks to order?', a: 'Yes. We build milk tanks, pasteurizers and mixing tanks in food grade stainless steel and can make them to the volume you need. Ask for a quote with your daily litres.' },
      { q: 'How much is a chips cutting machine in Kenya?', a: 'Our manual chips cutters start at about KES 4,500. Electric potato peelers cost more. See the table above for current starting prices.' },
      { q: 'Do you deliver food processing machines across Kenya?', a: 'Yes. Delivery is free within Nairobi and we ship to other towns. Large tanks are delivered and placed by our team.' },
    ],
  },

  'food-warmers/food-display-warmers': {
    heading: 'Display warmers for restaurants, takeaways and supermarkets',
    sections: [
      {
        heading: 'Why a display warmer sells more food',
        body: `Customers buy what they can see. A food display warmer keeps chips, chicken, samosas, sausages and pastries hot behind glass, so food looks fresh and staff can serve fast. For takeaways and supermarket hot counters it is often the piece of commercial kitchen food display equipment that pays for itself first.`,
      },
      {
        heading: 'Types of display warmers',
        body: `- **Chips display warmers.** Compact countertop units for chips, chicken and sausages, like our [jua kali food warmer and chips display](/product/food-display-warmer).
- **Glass food warmer displays.** Larger units with curved or straight glass and pans, like the [electric food warmer display with curved glass](/product/electric-hot-food-display-warmer-glass), for restaurants and canteens.
- **Snack displays.** Small two tray units such as the [double inserts display](/product/double-inserts-display) for samosas, mandazi and bhajias at kiosks.
- **Food warmers with pans.** [Electric food warmers with 4 or 6 lidded pans](/product/electric-food-warmer-6-pans) keep stews, rice and vegetables hot for lunch service.
- **Pass counters with heat lamps.** A [food pass counter with heat lamps](/product/stainless-steel-food-pass-counter-with-heat-lamps-and-overshelf) holds plated food hot between the kitchen and the waiter.

For buffets and serving lines, see our [bain marie](/category/food-warmers/bain-marie) range, and for showing cakes and cold food, our [glass display counters](/category/food-warmers/display-counters).`,
      },
      {
        heading: 'How to choose the right display warmer',
        body: `Count the trays or pans you need at your busiest hour and measure the counter. Check the power rating against your socket, and choose stainless steel with tempered glass so the unit is easy to clean and safe. A thermostat lets you hold chips crisp without drying them out, and a light inside helps food look its best.`,
      },
      {
        heading: 'Display warmers supplier in Kenya',
        body: `Kitchen And All supplies and makes display warmers in Nairobi for hotels, restaurants, takeaways, supermarkets and schools. We can build a warmer to fit your counter, deliver free within Nairobi and ship across Kenya.`,
      },
    ],
    tableHeading: 'Display warmer prices in Kenya',
    faqs: [
      { q: 'How much is a chips display warmer in Kenya?', a: 'Our small food and chips display warmers start from about KES 15,000 to KES 25,000. Larger glass warmers with pans cost more. The table above lists every display warmer with today\'s price.' },
      { q: 'What is the difference between a display warmer and a bain marie?', a: 'A display warmer heats food with dry heat behind glass and is made to show food to customers. A bain marie holds pans in a hot water bath and suits stews, rice and sauces on a serving line or buffet.' },
      { q: 'Can you make a display warmer to fit my counter?', a: 'Yes. We fabricate in our Nairobi workshop and can make a display warmer to the length and number of trays you need.' },
    ],
  },
};

/** The guide for a category or sub-category page. */
export function guideFor(categorySlug?: string, subSlug?: string) {
  if (!categorySlug) return undefined;
  return categoryGuides[subSlug ? `${categorySlug}/${subSlug}` : categorySlug];
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** One line of guide text to HTML: escapes it, then turns [text](/path) into links and **text** into bold. */
export function inlineHtml(text: string) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a href="$2" class="font-semibold text-orange-600 hover:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900">$1</strong>');
}

/** Guide text to HTML paragraphs and bullet lists. */
export function guideHtml(body: string) {
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push(`<ul class="list-disc pl-5 space-y-2">${list.map((l) => `<li>${inlineHtml(l)}</li>`).join('')}</ul>`);
    list = [];
  };
  for (const line of body.split('\n').map((l) => l.trim())) {
    if (!line) { flush(); continue; }
    if (line.startsWith('- ')) { list.push(line.slice(2)); continue; }
    flush();
    out.push(`<p>${inlineHtml(line)}</p>`);
  }
  flush();
  return out.join('');
}

/** FAQ text without the link and bold markup, for FAQPage structured data. */
export const plainText = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

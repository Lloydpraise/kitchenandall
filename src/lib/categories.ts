// The shop's category tree. Products link to it through products.major_category (a category name)
// and products.sub_category (a sub-category name), so a name here must match the database exactly.
// Names and slugs come from what Kenyan buyers type into Google (Google Ads search terms, Oct 2026).

export interface SubCategory {
  slug: string;
  name: string;
  title: string; // <title>, about 60 characters
  description: string; // meta description, 120 to 155 characters
  intro: string; // short paragraph shown above the products
}

export interface Category extends SubCategory {
  menuName: string; // short label for the category bar
  subs: SubCategory[];
}

export const categories: Category[] = [
  {
    slug: 'cooking-equipment',
    name: 'Cooking Equipment',
    menuName: 'Cooking',
    title: 'Commercial Cooking Equipment Prices in Kenya | Kitchen And All',
    description: 'Commercial cooking equipment in Kenya: gas cookers, cooking ranges, deep fryers, griddles and shawarma machines, built in Nairobi for busy kitchens.',
    intro: 'Everything a hotel, restaurant, school or fast food kitchen cooks on, from single burner gas stoves to full cooking ranges and chips fryers. We build in stainless and mild steel at our Nairobi workshop, so you get heavy duty equipment that lasts, with free delivery within Nairobi.',
    subs: [
      {
        slug: 'gas-cookers',
        name: 'Gas Cookers & Burners',
        title: 'Commercial Gas Cookers & Burners Price in Kenya',
        description: 'Commercial gas cookers and high pressure gas burners in Kenya: 1 to 6 burner stoves in stainless or mild steel, built strong in Nairobi.',
        intro: 'Single, double, 3, 4 and 6 burner gas cookers and high pressure burners for hotels, schools, caterers and food kiosks. Choose stainless steel for easy cleaning or a black mild steel frame for the best price.',
      },
      {
        slug: 'cooking-ranges',
        name: 'Commercial Cooking Ranges',
        title: 'Commercial Cooking Ranges & Range Cookers in Kenya',
        description: 'Commercial cooking ranges in Kenya: gas range cookers with burners, griddle, fryers and oven in one unit, made to fit your hotel or restaurant kitchen.',
        intro: 'Combination cooking ranges put burners, a griddle, deep fryers and an oven in one stainless steel line, so your cooks work faster in less space. We size each range to your menu and kitchen layout.',
      },
      {
        slug: 'deep-fryers',
        name: 'Deep Fryers & Chips Fryers',
        title: 'Chips Fryer & Commercial Deep Fryer Price in Kenya',
        description: 'Chips fryers and commercial deep fryers in Kenya: electric, gas and charcoal, single or double tank, for fast food shops, hotels and caterers.',
        intro: 'Fry more chips and chicken per hour with single and double tank deep fryers in electric, gas and charcoal models. Strong baskets, easy drain valves and stainless steel tanks that are simple to clean.',
      },
      {
        slug: 'griddles',
        name: 'Griddles & Hot Plates',
        title: 'Commercial Griddle & Gas Hot Plate Price in Kenya',
        description: 'Commercial griddles and hot plates in Kenya: electric and gas flat tops for chapati, eggs, burgers and pancakes, in heavy stainless steel.',
        intro: 'Flat top griddles and hot plates for chapati, eggs, smokies, burgers and pancakes. Thick plates hold heat evenly so every batch cooks the same, in electric and gas models.',
      },
      {
        slug: 'shawarma-rotisserie',
        name: 'Shawarma & Rotisserie Machines',
        title: 'Shawarma Machine & Chicken Rotisserie Price in Kenya',
        description: 'Shawarma machines and chicken rotisserie ovens in Kenya: gas and electric models that roast evenly and draw customers to your counter.',
        intro: 'Vertical shawarma broilers and chicken rotisserie ovens that roast evenly and put your food on show. Gas and electric models for fast food shops, supermarkets and restaurants.',
      },
      {
        slug: 'popcorn-snack-machines',
        name: 'Popcorn & Snack Machines',
        title: 'Popcorn Machine Price in Kenya | Snack Machines',
        description: 'Popcorn machines and snack makers in Kenya for cinemas, schools, events and small businesses. Easy to run, quick to clean, delivered fast.',
        intro: 'Popcorn machines and snack makers that turn a small space into steady daily sales, for shops, cinemas, schools and events.',
      },
      {
        slug: 'sufurias',
        name: 'Sufurias & Cooking Pots',
        title: 'Large Sufuria & Commercial Cooking Pot Price in Kenya',
        description: 'Large aluminium sufurias and commercial cooking pots in Kenya, from family size to 100 litre and above, for schools, hotels and caterers.',
        intro: 'Heavy duty aluminium sufurias and stock pots with lids, sized for school kitchens, hotels, churches and caterers who cook in bulk.',
      },
    ],
  },
  {
    slug: 'jikos',
    name: 'Jikos & Firewood Stoves',
    menuName: 'Jikos',
    title: 'Energy Saving Jikos & Institutional Jikos in Kenya',
    description: 'Energy saving jikos in Kenya: charcoal jikos, institutional firewood jikos for schools and firewood boilers, built in Nairobi to cut fuel costs.',
    intro: 'Charcoal and firewood jikos built for daily heavy cooking. Our institutional jikos for schools, hospitals and hotels use less firewood, keep kitchens cleaner and come with fitted pots, delivered and installed.',
    subs: [
      {
        slug: 'charcoal-jikos',
        name: 'Charcoal Jikos',
        title: 'Charcoal Jiko Price in Kenya | Energy Saving Jikos',
        description: 'Charcoal jikos in Kenya: energy saving and commercial heavy duty jikos for homes, kiosks and hotels, made strong at our Nairobi workshop.',
        intro: 'Energy saving and heavy duty charcoal jikos that hold heat longer and use less charcoal, for homes, food kiosks and hotel kitchens.',
      },
      {
        slug: 'institutional-jikos',
        name: 'Institutional Firewood Jikos',
        title: 'Institutional Jikos for Schools | Firewood Jiko Kenya',
        description: 'Institutional energy saving firewood jikos for schools, colleges and hospitals in Kenya, with fitted pots from small to very large sizes.',
        intro: 'Energy saving firewood jikos for schools, colleges, hospitals and churches, with insulated bodies, chimneys and fitted pots. They cook large meals on less firewood and keep the kitchen smoke free.',
      },
      {
        slug: 'firewood-boilers',
        name: 'Firewood Boilers & Steamers',
        title: 'Firewood Water Boiler & Steamer Pot Price in Kenya',
        description: 'Firewood and charcoal water boilers and steamer pots in Kenya for schools, hotels and institutions that need hot water and steam in bulk.',
        intro: 'Firewood and charcoal boilers and multi tier steamers that give you hot water, tea and steamed food in bulk for less fuel.',
      },
    ],
  },
  {
    slug: 'grills-bbq',
    name: 'Grills & Nyama Choma',
    menuName: 'Grills & BBQ',
    title: 'Nyama Choma Grills & BBQ Grill Prices in Kenya',
    description: 'Nyama choma grills and BBQ grills in Kenya: charcoal grills, drum and barrel smokers and gas grills, built in stainless steel in Nairobi.',
    intro: 'Charcoal nyama choma grills, drum barbecues and gas grills for butcheries, bars, hotels and homes. Built heavy so they keep their shape under high heat, season after season.',
    subs: [
      {
        slug: 'nyama-choma-grills',
        name: 'Nyama Choma & Charcoal Grills',
        title: 'Nyama Choma Grill & Charcoal Grill Price in Kenya',
        description: 'Nyama choma grills and charcoal barbecue grills in Kenya for butcheries, bars and hotels, in strong stainless steel that does not rust.',
        intro: 'Jiko ya kuchoma nyama made for business: stainless steel charcoal grills with strong grates, hoods and ash trays, in counter and freestanding sizes.',
      },
      {
        slug: 'drum-bbq-grills',
        name: 'Drum BBQ Grills & Smokers',
        title: 'Drum BBQ Grill & Barrel Smoker Price in Kenya',
        description: 'Drum BBQ grills, barrel grills and offset smokers in Kenya for homes, bars and events, with lids, chimneys and side shelves.',
        intro: 'Drum and barrel barbecues with lids and chimneys for slow smoking and fast grilling, ideal for homes, bars and outside catering.',
      },
      {
        slug: 'gas-grills',
        name: 'Gas Grills & Sizzling Plates',
        title: 'Commercial Gas Grill & Sizzling Plate Price in Kenya',
        description: 'Commercial gas grills and sizzling plates in Kenya for restaurants that grill to order and serve hot to the table.',
        intro: 'Gas grills for fast, clean grilling to order, and sizzling plates that keep food hot all the way to the table.',
      },
    ],
  },
  {
    slug: 'food-warmers',
    name: 'Food Warmers & Bain Marie',
    menuName: 'Food Warmers',
    title: 'Food Warmers & Bain Marie Prices in Kenya',
    description: 'Food warmers and bain marie in Kenya: chips display warmers, curved glass display counters and hot cupboards for hotels and fast food shops.',
    intro: 'Keep food hot, safe and on show. Choose from bain maries with 2 to 12 pans, chips and food display warmers, curved glass counters and hot cupboards, made in stainless steel in Nairobi to fit your counter.',
    subs: [
      {
        slug: 'bain-marie',
        name: 'Bain Marie',
        title: 'Bain Marie Food Warmer Price in Kenya',
        description: 'Bain marie food warmers in Kenya with 2 to 12 pans, mobile or fixed, with sneeze guards and cabinets, for hotels, schools and buffets.',
        intro: 'Electric and gas bain marie counters with 2 to 12 pans, on legs, cabinets or castors, with glass sneeze guards and lids to keep food hot and hygienic for hours.',
      },
      {
        slug: 'food-display-warmers',
        name: 'Food Display Warmers',
        title: 'Chips Display Warmer & Food Display Warmer Price in Kenya',
        description: 'Chips display warmers and food display warmers in Kenya that keep chips, chicken and samosas hot and on show, so customers buy on sight.',
        intro: 'Glass display warmers for chips, chicken, samosas and pastries. Customers see the food, it stays hot and crisp, and you sell more.',
      },
      {
        slug: 'display-counters',
        name: 'Glass Display Counters',
        title: 'Food Display Counter Price in Kenya | Glass Counters',
        description: 'Curved glass food display counters and showcases in Kenya for restaurants, bakeries and snack shops, fixed or on wheels.',
        intro: 'Curved glass food display counters and showcases that present your food well, fixed or on wheels, for restaurants, bakeries and snack shops.',
      },
      {
        slug: 'hot-cupboards',
        name: 'Hot Cupboards & Warming Cabinets',
        title: 'Hot Cupboard & Heated Holding Cabinet Price in Kenya',
        description: 'Hot cupboards, heated holding cabinets and food pass counters in Kenya that keep plated and bulk food hot until it is served.',
        intro: 'Hot cupboards, warming cabinets and pass counters with heat lamps that hold cooked food at serving temperature until it goes out.',
      },
    ],
  },
  {
    slug: 'bakery-equipment',
    name: 'Bakery Equipment',
    menuName: 'Bakery',
    title: 'Bakery Equipment & Baking Oven Prices in Kenya',
    description: 'Bakery equipment in Kenya: commercial baking ovens, charcoal ovens, dough mixers, bread slicers and baking tins for bakeries big and small.',
    intro: 'Start or grow a bakery with ovens, mixers and slicers that bake evenly batch after batch. From jua kali style charcoal ovens to electric deck ovens and spiral dough mixers, we guide you to the right set up.',
    subs: [
      {
        slug: 'baking-ovens',
        name: 'Commercial Baking Ovens',
        title: 'Commercial Baking Oven Price in Kenya | Deck Ovens',
        description: 'Commercial baking ovens in Kenya: electric and gas deck ovens, pizza ovens and tandoor ovens for bakeries, hotels and restaurants.',
        intro: 'Single, double and triple deck ovens in electric and gas, plus pizza and tandoor ovens, for even baking and steady output.',
      },
      {
        slug: 'charcoal-ovens',
        name: 'Charcoal Ovens',
        title: 'Charcoal Oven for Baking Price in Kenya',
        description: 'Charcoal ovens for baking in Kenya, with 2 to 4 trays and double doors: bake cakes and bread without electricity, built in Nairobi.',
        intro: 'Charcoal baking ovens with insulated bodies, trays and ash drawers. Bake cakes, bread and buns where power is costly or unreliable.',
      },
      {
        slug: 'dough-mixers',
        name: 'Dough Mixers',
        title: 'Dough Mixer Machine Price in Kenya | Spiral Mixers',
        description: 'Dough mixer machines in Kenya: spiral and planetary mixers for bread, chapati and cake dough, for bakeries and hotels.',
        intro: 'Spiral and planetary dough mixers that knead bread, chapati and mandazi dough evenly in minutes and save hours of hand work.',
      },
      {
        slug: 'bread-slicers-baking-tins',
        name: 'Bread Slicers & Baking Tins',
        title: 'Bread Slicer & Baking Tins Price in Kenya',
        description: 'Bread slicer machines, loaf tins, baking pans and cooling racks in Kenya for bakeries that want neat, even loaves every time.',
        intro: 'Bread slicers, loaf tins, baking pans and cooling racks that give every loaf the same neat shape and slice.',
      },
    ],
  },
  {
    slug: 'butchery-equipment',
    name: 'Butchery Equipment',
    menuName: 'Butchery',
    title: 'Butchery Equipment & Meat Display Chiller Prices in Kenya',
    description: 'Butchery equipment in Kenya: meat display chillers, display fridges, bone saws, meat mincers and slicers to start or upgrade your butchery.',
    intro: 'Everything to open or upgrade a butchery: meat display chillers that keep meat fresh and on show, display fridges, bone saw machines, meat mincers and slicers.',
    subs: [
      {
        slug: 'meat-display-chillers',
        name: 'Meat Display Chillers',
        title: 'Meat Display Chiller Price in Kenya | Meat Chillers',
        description: 'Meat display chillers in Kenya from 4 to 6 feet with curved glass, plus hanging meat fridges, to keep meat fresh and sell it on sight.',
        intro: 'Curved glass meat display chillers and hanging meat fridges that keep meat cold, fresh and attractive to buyers.',
      },
      {
        slug: 'butchery-machines',
        name: 'Butchery Machines & Tools',
        title: 'Bone Saw Machine & Meat Mincer Price in Kenya',
        description: 'Butchery machines in Kenya: bone saw machines, meat mincers, meat slicers and cleavers that cut faster and cleaner.',
        intro: 'Bone saw machines, electric meat mincers, meat slicers and cleavers that cut and portion faster with less waste.',
      },
      {
        slug: 'display-fridges',
        name: 'Display Fridges & Cake Displays',
        title: 'Display Fridge & Cake Display Price in Kenya',
        description: 'Display fridges and refrigerated cake displays in Kenya for bakeries, cafes and supermarkets that want cold food on show.',
        intro: 'Refrigerated cake displays and curved glass display fridges that keep cakes, pastries and drinks cold and in full view.',
      },
    ],
  },
  {
    slug: 'food-processing',
    name: 'Food Processing Machines',
    menuName: 'Food Processing',
    title: 'Food Processing Machines Prices in Kenya | Kitchen And All',
    description: 'Food processing machines in Kenya: chips cutters, potato peelers, nut roasters, juice machines, water vending machines and weighing scales.',
    intro: 'Machines that save labour and open new income: chips cutters and potato peelers, nut roasters, juice extractors, tea urns, water vending machines and milk tanks.',
    subs: [
      {
        slug: 'chips-cutters-peelers',
        name: 'Chips Cutters & Potato Peelers',
        title: 'Chips Cutter & Potato Peeler Machine Price in Kenya',
        description: 'Chips cutters and potato peeler machines in Kenya that prepare sacks of potatoes in minutes for fast food shops and hotels.',
        intro: 'Manual chips cutters and electric potato peelers that prepare a full sack of potatoes in minutes, with even cuts and less waste.',
      },
      {
        slug: 'roasters-rotary-drums',
        name: 'Nut Roasters & Rotary Drums',
        title: 'Nut Roaster Machine & Rotary Drum Price in Kenya',
        description: 'Groundnut and peanut roaster machines and stainless steel rotary drums in Kenya for snack makers and small food factories.',
        intro: 'Electric and motorised rotary drum roasters for groundnuts, peanuts and coffee, plus drum washers and tumblers for small food factories.',
      },
      {
        slug: 'juice-tea-machines',
        name: 'Juice Machines & Tea Urns',
        title: 'Juice Machine, Juice Dispenser & Tea Urn Price in Kenya',
        description: 'Sugarcane and fruit juice extractors, cold juice dispensers and commercial tea urns in Kenya for cafes, hotels and events.',
        intro: 'Juice extractors, sugarcane machines, cold juice dispensers and large tea urns that serve drinks fast to many people.',
      },
      {
        slug: 'water-vending-machines',
        name: 'Water Vending Machines',
        title: 'Water Vending & Water Refilling Machine Price in Kenya',
        description: 'Water vending and water refilling machines in Kenya: stainless steel refill stations to start a profitable water business.',
        intro: 'Stainless steel water vending machines and refilling stations with meters and multiple outlets. Ask us to match the purification system to your water source.',
      },
      {
        slug: 'milk-mixing-tanks',
        name: 'Milk Tanks & Mixing Tanks',
        title: 'Milk Tank, Milk Pasteurizer & Mixing Tank Price in Kenya',
        description: 'Stainless steel milk tanks, milk pasteurizers and mixing tanks with agitators in Kenya for dairies and small processing plants.',
        intro: 'Food grade stainless steel milk tanks, pasteurizers and mixing tanks for dairies, yoghurt makers and small processing plants.',
      },
      {
        slug: 'weighing-scales',
        name: 'Weighing Scales',
        title: 'Digital Price Computing Scale Price in Kenya',
        description: 'Digital price computing scales in Kenya for butcheries, groceries and shops: accurate weighing with automatic price calculation.',
        intro: 'Digital price computing scales that weigh accurately and work out the price for you, for butcheries, groceries and shops.',
      },
    ],
  },
  {
    slug: 'stainless-steel-sinks',
    name: 'Stainless Steel Sinks',
    menuName: 'Sinks',
    title: 'Stainless Steel Sinks Prices in Kenya | Commercial Sinks',
    description: 'Stainless steel sinks in Kenya: single, double and triple bowl kitchen sinks, hand wash stations and sink cabinets made to your size.',
    intro: 'Commercial kitchen sinks made in food grade stainless steel at our Nairobi workshop: single, double and triple bowls, drainers, hand wash stations and sink cabinets, built to your measurements.',
    subs: [
      {
        slug: 'single-bowl-sinks',
        name: 'Single Bowl Sinks',
        title: 'Single Bowl Stainless Steel Sink Price in Kenya',
        description: 'Single bowl stainless steel sinks in Kenya with drainers, splashbacks and undershelves, including deep pot wash sinks for busy kitchens.',
        intro: 'Single bowl sinks with drainers, splashbacks and undershelves, plus deep pot wash sinks for large pots and trays.',
      },
      {
        slug: 'double-bowl-sinks',
        name: 'Double & Triple Bowl Sinks',
        title: 'Double Sink & Triple Bowl Sink Price in Kenya',
        description: 'Double and triple bowl stainless steel sinks in Kenya for washing, rinsing and sanitising in one unit, with drainers and taps.',
        intro: 'Double and triple bowl sinks that let staff wash, rinse and sanitise in one place, with drainers, gooseneck taps and undershelves.',
      },
      {
        slug: 'hand-wash-sinks',
        name: 'Hand Wash Sinks & Stations',
        title: 'Hand Washing Station & Hand Wash Sink Price in Kenya',
        description: 'Hand washing stations and stainless steel hand wash sinks in Kenya, wall mounted, mobile or multi tap troughs for schools and food businesses.',
        intro: 'Hand wash basins, mobile hand washing stations and multi tap troughs that help you meet public health rules in kitchens, schools and factories.',
      },
      {
        slug: 'sink-cabinets',
        name: 'Sink Cabinets & Bar Sinks',
        title: 'Stainless Steel Sink Cabinet & Bar Sink Price in Kenya',
        description: 'Stainless steel sink cabinets with doors and drawers, bar sinks and cocktail stations in Kenya, built to fit your kitchen or bar.',
        intro: 'Enclosed sink units with doors and drawers, bar sinks with ice wells and cocktail stations that keep storage and washing in one neat unit.',
      },
    ],
  },
  {
    slug: 'tables-storage',
    name: 'Tables & Storage',
    menuName: 'Tables & Storage',
    title: 'Stainless Steel Tables, Shelves & Trolleys in Kenya',
    description: 'Stainless steel work tables, kitchen cabinets, shelving racks and trolleys in Kenya, made to measure in Nairobi for kitchens and stores.',
    intro: 'Work tables, cabinets, racks and trolleys that keep a kitchen organised and easy to clean. Every piece is made in stainless steel and can be built to your size.',
    subs: [
      {
        slug: 'work-tables',
        name: 'Stainless Steel Work Tables',
        title: 'Stainless Steel Table Price in Kenya | Work Tables',
        description: 'Stainless steel work tables in Kenya with undershelves, upstands and overshelves, in standard sizes or made to measure.',
        intro: 'Stainless steel work and prep tables with undershelves, upstands and overshelves, in 4ft, 5ft, 6ft and custom sizes.',
      },
      {
        slug: 'kitchen-cabinets',
        name: 'Stainless Steel Kitchen Cabinets',
        title: 'Stainless Steel Kitchen Cabinets Price in Kenya',
        description: 'Stainless steel kitchen cabinets in Kenya with sliding or hinged doors and drawers: hygienic storage that does not rot or rust.',
        intro: 'Cabinet tables and kitchen cabinets with sliding or hinged doors and drawers. Hygienic storage that never rots, swells or rusts.',
      },
      {
        slug: 'shelving-racks',
        name: 'Shelving & Racks',
        title: 'Stainless Steel Shelving Racks Price in Kenya',
        description: 'Stainless steel shelving racks in Kenya: 3, 4 and 5 tier solid, slatted and perforated racks for stores, kitchens and cold rooms.',
        intro: 'Solid, slatted and perforated racks and wall shelves for dry stores, cold rooms and kitchens, in 3 to 5 tiers.',
      },
      {
        slug: 'trolleys',
        name: 'Trolleys & Carts',
        title: 'Stainless Steel Trolley & Food Trolley Price in Kenya',
        description: 'Stainless steel trolleys in Kenya: service trolleys, food trolleys with pans, platform and tray trolleys that move loads safely.',
        intro: 'Service trolleys, food trolleys with pans, tray trolleys and platform trolleys on strong castors that move food and loads safely.',
      },
      {
        slug: 'bins-tubs',
        name: 'Bins, Tubs & Buckets',
        title: 'Stainless Steel Bins, Tubs & Buckets in Kenya',
        description: 'Stainless steel bins, mobile tubs and buckets in Kenya for hygienic waste handling and bulk food work in kitchens.',
        intro: 'Swing lid bins, mobile tubs and buckets for hygienic waste handling and bulk food preparation.',
      },
    ],
  },
  {
    slug: 'kitchen-hoods-ventilation',
    name: 'Kitchen Hoods & Ventilation',
    menuName: 'Hoods & Grease Traps',
    title: 'Kitchen Hood, Exhaust Fan & Grease Trap Prices in Kenya',
    description: 'Commercial kitchen hoods, exhaust fans and grease traps in Kenya: designed, fabricated and installed by our Nairobi team.',
    intro: 'Clear smoke, heat and grease from your kitchen with stainless steel extraction hoods, axial exhaust fans and grease traps, designed to your cooking line and installed by our team.',
    subs: [
      {
        slug: 'kitchen-hoods',
        name: 'Kitchen Exhaust Hoods',
        title: 'Kitchen Hood Price in Kenya | Commercial Exhaust Hoods',
        description: 'Commercial kitchen exhaust hoods in Kenya with grease or baffle filters, wall mounted or island, made to fit your cooking line.',
        intro: 'Wall and island extraction hoods with grease or baffle filters, fans and ducting, sized to cover your whole cooking line.',
      },
      {
        slug: 'exhaust-fans',
        name: 'Exhaust & Axial Fans',
        title: 'Axial Fan & Kitchen Exhaust Fan Price in Kenya',
        description: 'Industrial axial fans and kitchen extractor fans in Kenya that move smoke and heat out fast in kitchens, factories and stores.',
        intro: 'Industrial axial and extractor fans that pull smoke, steam and heat out of kitchens, factories and stores.',
      },
      {
        slug: 'grease-traps',
        name: 'Grease Traps & Drains',
        title: 'Grease Trap Price in Kenya | Stainless Steel Grease Traps',
        description: 'Stainless steel grease traps and trench drains in Kenya that stop fat blocking your drains and help you pass county inspections.',
        intro: 'Stainless steel grease traps with strainer baskets and trench drains with grates that keep fat out of your drains and pass health inspections.',
      },
    ],
  },
  {
    slug: 'hospital-equipment',
    name: 'Hospital Equipment',
    menuName: 'Hospital',
    title: 'Hospital Stainless Steel Equipment Prices in Kenya',
    description: 'Hospital stainless steel equipment in Kenya: surgical scrub sinks, sluice sinks, slop hoppers, dressing and mortuary trolleys.',
    intro: 'Stainless steel fittings for hospitals, clinics, labs and mortuaries: scrub sinks with elbow or knee taps, sluice sinks, slop hoppers and trolleys that clean easily and meet health standards.',
    subs: [
      {
        slug: 'scrub-sinks',
        name: 'Scrub & Surgical Sinks',
        title: 'Scrub Sink & Surgical Sink Price in Kenya',
        description: 'Hospital scrub sinks and surgical sinks in Kenya with elbow or knee operated taps and soap dispensers, in 304 stainless steel.',
        intro: 'Surgical scrub sinks and medical hand wash sinks with elbow or knee operated taps, so theatre staff scrub without touching taps.',
      },
      {
        slug: 'sluice-sinks',
        name: 'Sluice Sinks & Slop Hoppers',
        title: 'Sluice Sink & Slop Hopper Price in Kenya',
        description: 'Stainless steel sluice sinks and slop hoppers in Kenya for hospitals, clinics and care homes, wall mounted or with sink combinations.',
        intro: 'Sluice sinks and slop hoppers, wall mounted or combined with a wash bowl, for safe disposal in hospitals, clinics and care homes.',
      },
      {
        slug: 'hospital-trolleys',
        name: 'Hospital & Mortuary Trolleys',
        title: 'Mortuary Trolley & Hospital Trolley Price in Kenya',
        description: 'Stainless steel mortuary trolleys and hospital dressing trolleys in Kenya, heavy duty and easy to clean and disinfect.',
        intro: 'Heavy duty mortuary trolleys and dressing trolleys in stainless steel that are easy to clean and disinfect.',
      },
    ],
  },
  {
    slug: 'stainless-steel-fabrication',
    name: 'Stainless Steel Fabrication',
    menuName: 'Fabrication',
    title: 'Stainless Steel Fabrication in Nairobi | Railings, Urinals',
    description: 'Custom stainless steel fabrication in Nairobi: railings and balustrades, urinals, mobile kitchens and restaurant furniture made to order.',
    intro: 'Have something in mind? Our Juakali workshop on Landhies Road fabricates stainless steel to your design: staircase railings and balustrades, urinals, mobile kitchens and food trucks, and restaurant furniture.',
    subs: [
      {
        slug: 'railings-balustrades',
        name: 'Railings & Balustrades',
        title: 'Stainless Steel Railings Price per Meter in Kenya',
        description: 'Stainless steel staircase railings, balustrades and glass balcony railings in Kenya, priced per meter and made to your design.',
        intro: 'Staircase railings, handrails, balustrades and glass balcony railings in stainless steel that never rust, priced per meter.',
      },
      {
        slug: 'urinals',
        name: 'Stainless Steel Urinals',
        title: 'Stainless Steel Urinal Price in Kenya | Urinal Troughs',
        description: 'Stainless steel urinals and urinal troughs in Kenya for schools, bars, malls and public toilets: vandal proof and easy to clean.',
        intro: 'Wall and corner urinal troughs with flush pipes for schools, bars, malls and public toilets. Vandal proof and quick to clean.',
      },
      {
        slug: 'mobile-kitchens',
        name: 'Mobile Kitchens & Food Trucks',
        title: 'Mobile Kitchen & Food Truck Conversion in Kenya',
        description: 'Mobile kitchens, container kitchens and food truck conversions in Kenya, fitted out with stainless steel cooking and washing stations.',
        intro: 'Container kitchens and food truck conversions fitted with stainless steel cooking, washing and storage, ready to trade.',
      },
      {
        slug: 'restaurant-furniture',
        name: 'Restaurant Tables & Chairs',
        title: 'Restaurant Tables & Chairs Price in Kenya',
        description: 'Restaurant dining tables and chairs in Kenya for hotels, canteens and cafes: strong metal frames in bright colours.',
        intro: 'Dining table and chair sets with strong metal frames for restaurants, canteens and cafes.',
      },
    ],
  },
];

export const categoryUrl = (c: { slug: string }) => `/category/${c.slug}`;
export const subCategoryUrl = (c: { slug: string }, s: { slug: string }) => `/category/${c.slug}/${s.slug}`;

export function findCategory(slug?: string) {
  return categories.find((c) => c.slug === slug);
}

const norm = (v?: string | null) => (v || '').trim().toLowerCase();

/** The category and sub-category a product belongs to, from its major_category and sub_category columns. */
export function categoryOf(product: { major_category?: string | null; sub_category?: string | null }) {
  const category = categories.find((c) => norm(c.name) === norm(product.major_category));
  if (category) return { category, sub: category.subs.find((s) => norm(s.name) === norm(product.sub_category)) };
  // a sub-category name is unique across the tree, so it is enough on its own
  for (const c of categories) {
    const sub = c.subs.find((s) => norm(s.name) === norm(product.sub_category));
    if (sub) return { category: c, sub };
  }
  return { category: undefined, sub: undefined };
}

// Old category links (before October 2026) and where they now live, so Google and old bookmarks keep working.
export const legacyCategoryRedirects: Record<string, string> = {
  'cooking': '/category/cooking-equipment',
  'refrigeration': '/category/butchery-equipment',
  'food-prep': '/category/food-processing',
  'stainless-steel': '/category/stainless-steel-fabrication',
  'bakery-appliances': '/category/bakery-equipment',
  'burners-jikos-stoves': '/category/cooking-equipment/gas-cookers',
  'cooking-appliances': '/category/cooking-equipment',
  'small-appliances': '/category/food-processing',
  'large-appliances': '/category/cooking-equipment/cooking-ranges',
  'hotel-appliances': '/category/food-warmers',
  'office-kitchen': '/category/tables-storage',
  'food-processors': '/category/food-processing',
  'measuring-tools': '/category/food-processing/weighing-scales',
  'measuring-tools-scales': '/category/food-processing/weighing-scales',
  'home-kitchen': '/category/tables-storage',
  'juakali-fabrications': '/category/stainless-steel-fabrication',
};

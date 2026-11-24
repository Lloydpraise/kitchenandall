-- Search Console fixes, 23 Nov 2026 (Kitchen And All)
-- Run the whole file once in Supabase > SQL Editor. Nothing else runs it.
-- Part 1: new meta titles and descriptions for 41 products that show on Google page 1 (or close) but get few clicks.
-- Part 2: moves 138 products (ids 349 to 486) that still carry the old "Cooking" / "Stainless Steel" categories
--         into the current category tree. Today they are missing from every category page, so the
--         bakery, butchery, food warmer and cooking hubs Google sees are short of products.
-- Both parts save the current values first, so any row can be put back (see the end of the file).

create table if not exists products_seo_backup as select id, description, meta_title, meta_description, alt_text, canonical_url, now() as backed_up_at from products where false;
insert into products_seo_backup select id, description, meta_title, meta_description, alt_text, canonical_url, now() from products where id in (179,170,172,296,442,64,293,16,158,30,14,308,273,52,439,474,27,41,43,116,136,348,305,128,163,19,72,55,22,89,92,146,148,133,18,112,193,10,409,68,90);

create table if not exists products_category_backup as select id, major_category, sub_category, now() as backed_up_at from products where false;
insert into products_category_backup select id, major_category, sub_category, now() from products where id in (349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486);

begin;

-- Part 1: meta titles and descriptions (the price in each description is the price on the site today)
-- 179 4-pot-institutional-jiko-with-chimney | query: modern firewood jiko with chimney (+ price in kenya)
update products set meta_title = $seo$Modern Firewood Jiko with Chimney, 4 Pot | Price in Kenya$seo$, meta_description = $seo$Modern firewood jiko with chimney: four pots on one fire line, stainless steel body, smoke piped out of the kitchen. KES 350,000. Free delivery in Nairobi.$seo$ where id = 179;
-- 170 institutional-energy-saving-jiko-stainless-steel-body | query: improved firewood jiko / energy saving jikos
update products set meta_title = $seo$Improved Firewood Jiko with Chimney | Price in Kenya$seo$, meta_description = $seo$Improved energy saving firewood jiko with chimney, stainless body, fitted pot and lid. Cooks for hundreds on less wood. KES 95,000. Free Nairobi delivery.$seo$ where id = 170;
-- 172 firewood-jiko-with-aluminium-sufuria-orange-steel-body | query: firewood jiko / jua kali firewood jiko price in kenya
update products set meta_title = $seo$Firewood Jiko with Sufuria and Lid | Price in Kenya$seo$, meta_description = $seo$Jua kali firewood jiko with a fitted aluminium sufuria and lid in a strong orange steel body. Saves firewood, cooks big pots. KES 85,000. Free Nairobi delivery.$seo$ where id = 172;
-- 296 firewood-jikos-with-aluminium-pots-on-orange-stands | query: jua kali jiko price in kenya
update products set meta_title = $seo$Jua Kali Firewood Jiko with Pot | Price in Kenya$seo$, meta_description = $seo$Jua kali firewood jiko with aluminium pot and lid on a strong orange stand, for schools, canteens and caterers. KES 50,000. Free delivery within Nairobi.$seo$ where id = 296;
-- 442 orange-mild-steel-charcoal-jiko-with-stand | query: jua kali jiko / charcoal jiko
update products set meta_title = $seo$Jua Kali Charcoal Jiko with Stand | Price in Kenya$seo$, meta_description = $seo$Jua kali charcoal jiko in orange mild steel with a stand, for big sufurias at hotels, kibandas and events. KES 9,500. Delivery in Nairobi and across Kenya.$seo$ where id = 442;
-- 64 charcoal-jiko-oven | query: jua kali oven price in kenya / juakali oven
update products set meta_title = $seo$Jua Kali Charcoal Oven Jiko | Price in Kenya$seo$, meta_description = $seo$Jua kali charcoal oven jiko that bakes, roasts and grills on charcoal or firewood, no electricity needed. KES 10,000. Free delivery within Nairobi.$seo$ where id = 64;
-- 293 stainless-steel-mortuary-trolley | query: mortuary trolley
update products set meta_title = $seo$Mortuary Trolley with Cover, Stainless | Price in Kenya$seo$, meta_description = $seo$Stainless steel mortuary trolley with cover, recessed tray and smooth castors for hospitals, mortuaries and funeral homes. KES 85,000. Free Nairobi delivery.$seo$ where id = 293;
-- 16 stainless-heavy-duty-mortuary-trolley | query: mortuary trolley
update products set meta_title = $seo$Heavy Duty Mortuary Trolley | Price in Kenya$seo$, meta_description = $seo$Heavy duty stainless steel mortuary trolley: rust free, easy to disinfect, moves with dignity on smooth castors. KES 85,000. Free delivery within Nairobi.$seo$ where id = 16;
-- 158 stainless-steel-multi-layer-trolley-cart | query: trolley cart / trolly cart
update products set meta_title = $seo$Trolley Cart, Stainless Steel Multi Layer | Price in Kenya$seo$, meta_description = $seo$Stainless steel trolley cart with several shelves and braked wheels for kitchens, hotels and hospitals. KES 35,000. Free delivery within Nairobi.$seo$ where id = 158;
-- 30 stainless-steel-utility-trolley | query: trolley / utility cart
update products set meta_title = $seo$Stainless Steel Utility Trolley | Price in Kenya$seo$, meta_description = $seo$Stainless steel utility trolley with braked swivel castors that moves heavy loads safely in kitchens, stores and wards. KES 35,000. Free Nairobi delivery.$seo$ where id = 30;
-- 14 cast-iron-sizzling-plate-wooden-base | query: sizzling plate / cast iron sizzling plate
update products set meta_title = $seo$Sizzling Plate, Cast Iron with Wooden Base | Price in Kenya$seo$, meta_description = $seo$Cast iron sizzling plate with wooden base: steak, choma and fajitas arrive at the table still sizzling. KES 3,500 each, bulk orders welcome. Kenya delivery.$seo$ where id = 14;
-- 308 glass-display-counters-set-of-3 | query: glass display counter (price in kenya) / glass counter
update products set meta_title = $seo$Glass Display Counter Set of 3 | Price in Kenya$seo$, meta_description = $seo$Glass display counters, set of 3: flat, shelved and curved fronts on steel bases with castors, for bakeries and shops. KES 85,000. Free Nairobi delivery.$seo$ where id = 308;
-- 273 glass-hot-food-display-counters | query: hotel display counter
update products set meta_title = $seo$Hotel Display Counter, Glass Hot Food | Price in Kenya$seo$, meta_description = $seo$Glass hot food display counter for hotels, restaurants and canteens: steel base on wheels, keeps dishes warm and on show. KES 85,000. Free Nairobi delivery.$seo$ where id = 273;
-- 52 stainless-steel-food-display-counter | query: food display counter price in kenya
update products set meta_title = $seo$Food Display Counter, Stainless Steel | Price in Kenya$seo$, meta_description = $seo$Stainless steel food display counter with tempered glass that keeps food warm and on show for hotels and canteens. KES 95,000. Free delivery within Nairobi.$seo$ where id = 52;
-- 439 stainless-steel-wall-urinal-trough-with-flush-pipe | query: urinal trough / stainless steel urinal trough
update products set meta_title = $seo$Urinal Trough, Stainless Steel | Price in Kenya$seo$, meta_description = $seo$Stainless steel urinal trough for walls with a spray flush pipe, for schools, bars and public toilets. Vandal proof, easy to clean. KES 85,000, made to length.$seo$ where id = 439;
-- 474 stainless-steel-l-shaped-corner-urinal-trough | query: urinal trough / toilet trough
update products set meta_title = $seo$L-Shaped Urinal Trough, Stainless Steel | Price in Kenya$seo$, meta_description = $seo$Stainless steel L-shaped corner urinal trough with a high back, serves many users in schools and public toilets. KES 120,000, made to fit. Nairobi delivery.$seo$ where id = 474;
-- 27 stainless-steel-urinals | query: stainless steel urinal
update products set meta_title = $seo$Stainless Steel Urinals & Troughs | Price in Kenya$seo$, meta_description = $seo$Stainless steel urinals and urinal troughs for schools, bars, malls and public toilets: vandal proof and easy to clean. From KES 85,000. Nairobi delivery.$seo$ where id = 27;
-- 41 stainless-steel-bain-marie-with-glass-sneeze-guard | query: bain marie (price in kenya)
update products set meta_title = $seo$Bain Marie with Glass Sneeze Guard | Price in Kenya$seo$, meta_description = $seo$Stainless steel bain marie with a glass sneeze guard that keeps buffet food hot, safe and on show for hotels and canteens. KES 85,000. Free Nairobi delivery.$seo$ where id = 41;
-- 43 commercial-bain-marie-food-warmer-5-pan | query: bain marie food warmer
update products set meta_title = $seo$Bain Marie Food Warmer, 5 Pan | Price in Kenya$seo$, meta_description = $seo$Commercial bain marie food warmer with 5 pans that holds food at serving heat all through service. 1.5kW, 220V. KES 70,000. Free delivery within Nairobi.$seo$ where id = 43;
-- 116 bain-marie-food-warmer-8-pans | query: bain marie price
update products set meta_title = $seo$Bain Marie, 8 Pans on Wheels | Price in Kenya$seo$, meta_description = $seo$Bain marie food warmer with 8 lidded pans, water bath, undershelf and castors for hotels, schools and buffets. KES 40,000. Free delivery within Nairobi.$seo$ where id = 116;
-- 136 commercial-chicken-rotisserie-oven | query: rotisserie oven
update products set meta_title = $seo$Rotisserie Oven for Chicken | Price in Kenya$seo$, meta_description = $seo$Commercial rotisserie oven for chicken: birds turn behind glass, cook evenly and sell on sight. For takeaways and supermarkets. KES 120,000. Nairobi delivery.$seo$ where id = 136;
-- 348 electric-rotisserie-chicken-oven-with-glass-door | query: rotisserie oven / oven rotisserie
update products set meta_title = $seo$Rotisserie Oven, Electric with Glass Door | Price in Kenya$seo$, meta_description = $seo$Electric rotisserie oven with glass door, rotating spits and a lit control panel on a stand. Roasts chicken evenly. KES 120,000. Free delivery within Nairobi.$seo$ where id = 348;
-- 305 electric-vertical-rotisserie-chicken-roaster | query: commercial chicken roaster
update products set meta_title = $seo$Commercial Chicken Roaster, Vertical | Price in Kenya$seo$, meta_description = $seo$Electric vertical rotisserie chicken roaster with glass door, control panel and rotating racks on castors. KES 135,000. Free delivery within Nairobi.$seo$ where id = 305;
-- 128 tadoor-oven | query: tandoor oven / buy tandoor
update products set meta_title = $seo$Tandoor Oven | Price in Kenya$seo$, meta_description = $seo$Tandoor oven in mild steel with even, high heat for naan, tandoori chicken and kebabs. Charcoal or gas. KES 25,000. Free delivery within Nairobi.$seo$ where id = 128;
-- 163 tandoori-oven | query: tandoori oven
update products set meta_title = $seo$Tandoori Oven, Insulated Charcoal | Price in Kenya$seo$, meta_description = $seo$Tandoori oven with an insulated steel body for authentic naan and kebabs on charcoal. KES 25,000. Free delivery in Nairobi, shipping across Kenya.$seo$ where id = 163;
-- 19 bakery-cake-display-fridge-4ft | query: cake display fridge
update products set meta_title = $seo$Cake Display Fridge 4ft | Price in Kenya$seo$, meta_description = $seo$4ft cake display fridge with glass shelves that keeps cakes and pastries cool and in full view, so they sell. KES 85,000. Free delivery within Nairobi.$seo$ where id = 19;
-- 72 curved-glass-refrigerated-display-case | query: cake chiller display / display fridge
update products set meta_title = $seo$Cake Display Fridge, Curved Glass | Price in Kenya$seo$, meta_description = $seo$Curved glass refrigerated display for cakes, desserts and salads. Keeps them cold, fresh and on show for bakeries and cafes. KES 85,000. Nairobi delivery.$seo$ where id = 72;
-- 55 commercial-dough-mixer-20l | query: 10kg dough mixer price in kenya
update products set meta_title = $seo$10kg Dough Mixer, 20 Litre | Price in Kenya$seo$, meta_description = $seo$10kg dough mixer with 20 litre bowl and 0.75kW motor for bread, chapati and pizza dough. Kneads in minutes. KES 150,000. Free delivery within Nairobi.$seo$ where id = 55;
-- 22 commercial-spiral-dough-mixer-20l | query: dough mixer 20l / 20l cake mixer
update products set meta_title = $seo$Spiral Dough Mixer 20L | Price in Kenya$seo$, meta_description = $seo$Commercial spiral dough mixer, 20 litre bowl, kneads smooth bread and chapati dough batch after batch. KES 150,000. Free delivery within Nairobi.$seo$ where id = 22;
-- 89 4ft-meat-chiller-display | query: meat display chiller price in kenya
update products set meta_title = $seo$Meat Display Chiller 4ft | Price in Kenya$seo$, meta_description = $seo$4ft meat display chiller with curved glass that keeps meat cold and on show in small butcheries. KES 65,000. Free delivery in Nairobi, shipping across Kenya.$seo$ where id = 89;
-- 92 6ft-commercial-meat-chiller-display | query: meat display chiller price in kenya
update products set meta_title = $seo$Meat Display Chiller 6ft | Price in Kenya$seo$, meta_description = $seo$6ft meat display chiller with curved glass and trays to show more cuts in busy butcheries and supermarkets. KES 90,000. Free delivery within Nairobi.$seo$ where id = 92;
-- 146 commercial-meat-display-case | query: meat display counter price in kenya
update products set meta_title = $seo$Meat Display Counter, Curved Glass | Price in Kenya$seo$, meta_description = $seo$Meat display counter with curved glass and LED lighting for a modern butchery front. Keeps meat cold and visible. KES 75,000. Free Nairobi delivery.$seo$ where id = 146;
-- 148 food-display-warmer | query: jua kali food warmer (price) / chips display warmer
update products set meta_title = $seo$Jua Kali Food Warmer, Chips Display | Price in Kenya$seo$, meta_description = $seo$Jua kali food warmer with glass sides that keeps chips, chicken and sausages hot and on show at takeaways. KES 25,000. Free delivery within Nairobi.$seo$ where id = 148;
-- 133 commercial-food-warmer-display | query: display warmers supplier kenya / commercial food warmer
update products set meta_title = $seo$Food Warmer Display for Restaurants | Price in Kenya$seo$, meta_description = $seo$Commercial food warmer display that keeps dishes at serving heat behind clear glass for restaurants and cafes. KES 25,000. Free delivery within Nairobi.$seo$ where id = 133;
-- 18 charcoal-chips-fryer-jiko | query: how much is chips machine / chips cooking machine price
update products set meta_title = $seo$Chips Machine, Charcoal Chips Fryer | Price in Kenya$seo$, meta_description = $seo$How much is a chips machine? This charcoal chips fryer jiko is KES 8,500 and fries through power cuts at low running cost. Free delivery within Nairobi.$seo$ where id = 18;
-- 112 lidded-stainless-steel-grease-trap | query: grease trap price / grease trap for kitchen sink
update products set meta_title = $seo$Grease Trap for Kitchen Sink | Price in Kenya$seo$, meta_description = $seo$Stainless steel grease trap for the kitchen sink with lid, drain tap and outlet. Stops blocked drains in hotels and restaurants. KES 25,000. Kenya delivery.$seo$ where id = 112;
-- 193 sugarcane-juice-extractor-machine | query: sugar cane juice machine
update products set meta_title = $seo$Sugarcane Juice Machine | Price in Kenya$seo$, meta_description = $seo$Sugarcane juice machine with roller crusher, flywheel and belt drive on a stand, for kiosks and juice bars. KES 45,000. Free delivery within Nairobi.$seo$ where id = 193;
-- 10 stainless-steel-railings-costmeter | query: stainless steel railing / handrail price per meter
update products set meta_title = $seo$Stainless Steel Railing & Handrail per Metre | Kenya$seo$, meta_description = $seo$Stainless steel railings and handrails from KES 9,500 per metre for stairs, balconies and ramps. Measured, made and fitted by our Nairobi team.$seo$ where id = 10;
-- 409 stainless-steel-deep-pot-wash-sink-with-upstand | query: pot wash sink / deep sink
update products set meta_title = $seo$Pot Wash Sink, Deep Stainless Steel | Price in Kenya$seo$, meta_description = $seo$Deep pot wash sink in stainless steel with a square bowl and upstand. Soak and scrub big sufurias and trays. KES 25,000. Free delivery within Nairobi.$seo$ where id = 409;
-- 68 stainless-steel-hospital-scrub-sink | query: scrub sink for hospital
update products set meta_title = $seo$Scrub Sink for Hospital, Stainless Steel | Price in Kenya$seo$, meta_description = $seo$Stainless steel hospital scrub sink with one or two bowls for theatres and clinics, built for infection control. KES 35,000. Free delivery within Nairobi.$seo$ where id = 68;
-- 90 kitchen-hood-grease-filters-extractor-fan-ductwork | query: kitchen hood / commercial kitchen vent hood
update products set meta_title = $seo$Kitchen Hood with Extractor Fan & Duct | Price in Kenya$seo$, meta_description = $seo$Complete kitchen hood with extractor fan, grease filters and ductwork, sized to your cooking line. From KES 120,000. Measured and fitted in Nairobi.$seo$ where id = 90;

-- Part 2: put products into the category tree (major_category / sub_category must match src/lib/categories.ts)
-- Cooking Equipment > Deep Fryers & Chips Fryers: single-tank-deep-fryer-with-two-baskets-and-mild-steel-stand, double-tank-gas-deep-fryer-with-baskets-on-stand, stainless-steel-double-basket-deep-fryer-on-stand, single-tank-gas-deep-fryer-with-stainless-steel-stand, electric-double-tank-deep-fryer-with-drain-valves
update products set major_category = $seo$Cooking Equipment$seo$, sub_category = $seo$Deep Fryers & Chips Fryers$seo$ where id in (349,354,376,472,481);
-- Grills & Nyama Choma > Drum BBQ Grills & Smokers: offset-drum-charcoal-smoker-grill-with-side-firebox, drum-charcoal-grill-with-wooden-side-shelf, drum-charcoal-grill-with-chimney-on-folding-stand, stainless-steel-barrel-charcoal-grill-with-side-shelf
update products set major_category = $seo$Grills & Nyama Choma$seo$, sub_category = $seo$Drum BBQ Grills & Smokers$seo$ where id in (350,360,361,471);
-- Bakery Equipment > Charcoal Ovens: charcoal-baking-oven-with-3-trays-and-double-doors, large-charcoal-baking-oven-with-4-charcoal-drawers, double-compartment-charcoal-baking-oven-with-glass-doors
update products set major_category = $seo$Bakery Equipment$seo$, sub_category = $seo$Charcoal Ovens$seo$ where id in (351,355,437);
-- Cooking Equipment > Gas Cookers & Burners: 3-burner-high-pressure-gas-stove-with-mild-steel-frame, stainless-steel-2-burner-gas-stove-with-front-controls, 4-burner-high-pressure-gas-stove-with-mild-steel-frame, 2-burner-high-pressure-gas-stove-with-black-mild-steel-frame, stainless-steel-double-burner-gas-stove-with-undershelf, 6-burner-high-pressure-gas-stove-with-mild-steel-frame, stainless-steel-6-burner-long-gas-stove-with-brass-knobs, stainless-steel-single-burner-gas-stove-with-undershelf
update products set major_category = $seo$Cooking Equipment$seo$, sub_category = $seo$Gas Cookers & Burners$seo$ where id in (352,364,366,410,428,430,432,433);
-- Hospital Equipment > Scrub & Surgical Sinks: stainless-steel-knee-operated-double-scrub-sink-with-soap-dispenser
update products set major_category = $seo$Hospital Equipment$seo$, sub_category = $seo$Scrub & Surgical Sinks$seo$ where id in (353);
-- Tables & Storage > Bins, Tubs & Buckets: galvanised-metal-bucket-with-handle
update products set major_category = $seo$Tables & Storage$seo$, sub_category = $seo$Bins, Tubs & Buckets$seo$ where id in (356);
-- Butchery Equipment > Meat Display Chillers: curved-glass-butchery-display-chiller
update products set major_category = $seo$Butchery Equipment$seo$, sub_category = $seo$Meat Display Chillers$seo$ where id in (357);
-- Butchery Equipment > Butchery Machines & Tools: commercial-electric-meat-mincer-stainless-steel
update products set major_category = $seo$Butchery Equipment$seo$, sub_category = $seo$Butchery Machines & Tools$seo$ where id in (358);
-- Tables & Storage > Stainless Steel Kitchen Cabinets: stainless-steel-cabinet-with-double-doors-and-3-drawers, stainless-steel-kitchen-cabinet-with-hinged-doors-and-3-drawers, stainless-steel-cabinet-with-sliding-doors-and-3-drawers
update products set major_category = $seo$Tables & Storage$seo$, sub_category = $seo$Stainless Steel Kitchen Cabinets$seo$ where id in (359,406,464);
-- Stainless Steel Sinks > Single Bowl Sinks: stainless-steel-single-sink-with-drainer-and-slatted-undershelf, stainless-steel-single-bowl-sink-with-left-drainer, stainless-steel-large-single-bowl-sink-with-drainer, stainless-steel-deep-pot-wash-sink-with-upstand, stainless-steel-single-sink-table-with-drainer-and-undershelf
update products set major_category = $seo$Stainless Steel Sinks$seo$, sub_category = $seo$Single Bowl Sinks$seo$ where id in (362,363,407,409,414);
-- Grills & Nyama Choma > Nyama Choma & Charcoal Grills: black-charcoal-grill-box-with-chimney-and-stand, stainless-steel-nyama-choma-charcoal-grill-with-canopy, long-stainless-steel-charcoal-grill-with-wire-grate, stainless-steel-charcoal-grill-with-hinged-lid-and-cabinet
update products set major_category = $seo$Grills & Nyama Choma$seo$, sub_category = $seo$Nyama Choma & Charcoal Grills$seo$ where id in (365,473,484,485);
-- Food Warmers & Bain Marie > Bain Marie: 12-pan-bain-marie-counter-with-sliding-door-cabinet, 6-pan-bain-marie-counter-with-undershelf, 8-pan-bain-marie-counter-with-undershelf, 6-pan-bain-marie-with-lids-stainless-steel, 4-well-stainless-steel-bain-marie-with-undershelf, 2-pan-bain-marie-with-overshelf, curved-glass-hot-food-display-bain-marie-counter, long-stainless-steel-bain-marie-with-deep-gastronorm-pans, curved-glass-bain-marie-display-with-multiple-pans, stainless-steel-3-pan-bain-marie-with-tubular-gantry, 4-pan-bain-marie-with-sliding-door-hot-cupboard, bain-marie-counter-with-curved-glass-sneeze-guard-and-top-shelf, 6-pan-inline-bain-marie-with-undershelf, mobile-bain-marie-with-lidded-pans-on-castors, bain-marie-counter-with-12-pans-and-overshelf, mobile-bain-marie-with-curved-glass-guard-and-hot-cupboard, mobile-curved-glass-display-bain-marie
update products set major_category = $seo$Food Warmers & Bain Marie$seo$, sub_category = $seo$Bain Marie$seo$ where id in (367,380,381,391,396,404,415,421,423,427,429,434,435,440,441,467,468);
-- Food Warmers & Bain Marie > Glass Display Counters: curved-glass-food-display-showcase-with-green-side-panels, curved-glass-display-counter-with-white-side-panels
update products set major_category = $seo$Food Warmers & Bain Marie$seo$, sub_category = $seo$Glass Display Counters$seo$ where id in (368,372);
-- Bakery Equipment > Commercial Baking Ovens: double-deck-baking-oven-with-4-trays, single-deck-baking-oven-with-digital-controls, single-deck-baking-oven-with-stainless-steel-stand
update products set major_category = $seo$Bakery Equipment$seo$, sub_category = $seo$Commercial Baking Ovens$seo$ where id in (369,370,386);
-- Stainless Steel Sinks > Double & Triple Bowl Sinks: stainless-steel-triple-bowl-sink-with-gooseneck-taps-and-slatted-undershelf, stainless-steel-double-bowl-sink-table-with-upstand, stainless-steel-twin-sink-with-swan-neck-taps-and-bottom-shelf, stainless-steel-double-bowl-sink-with-slatted-undershelf, stainless-steel-double-bowl-sink-with-long-right-drainer, stainless-steel-double-bowl-deep-sink-with-pillar-taps, stainless-steel-sink-tables-set-with-undershelves, stainless-steel-double-sink-with-overhead-plate-rack-and-slatted-undershelf, stainless-steel-double-bowl-sink-with-drainer-and-pull-down-tap
update products set major_category = $seo$Stainless Steel Sinks$seo$, sub_category = $seo$Double & Triple Bowl Sinks$seo$ where id in (371,377,387,399,403,417,443,447,451);
-- Cooking Equipment > Commercial Cooking Ranges: stainless-steel-4-burner-gas-cooking-range, stainless-steel-6-burner-gas-cooking-range, stainless-steel-5-burner-inline-gas-cooking-range, commercial-gas-cooking-range-with-4-burners-griddle-and-oven, commercial-cooking-range-with-2-gas-burners-2-electric-hotplates-and-double-fryer, stainless-steel-4-burner-gas-cooker-with-heavy-pan-supports, 4-burner-gas-range-with-centre-griddle-and-electric-oven, stainless-steel-3-burner-gas-range-on-castors, combination-cooking-station-with-deep-fryers-griddle-and-burner, commercial-cooking-line-with-electric-twin-fryer-griddle-and-6-burners, commercial-cooking-range-with-oven-chargrill-griddle-and-6-burners, stainless-steel-cooking-counter-with-overhead-extraction-hood
update products set major_category = $seo$Cooking Equipment$seo$, sub_category = $seo$Commercial Cooking Ranges$seo$ where id in (373,374,375,425,436,438,449,454,455,457,458,463);
-- Stainless Steel Sinks > Hand Wash Sinks & Stations: stainless-steel-trough-hand-wash-sink-with-2-taps-and-soap-dispenser, mobile-stainless-steel-hand-wash-station-with-overhead-water-tank-and-6-taps, stainless-steel-hand-wash-cabinet-with-paper-towel-and-soap-dispenser, mobile-stainless-steel-hand-wash-cabinet-with-round-bowl-and-gooseneck-tap, row-of-stainless-steel-hand-wash-basin-cabinets, stainless-steel-two-tap-hand-wash-trough-with-upstand, stainless-steel-4-tap-hand-wash-trough
update products set major_category = $seo$Stainless Steel Sinks$seo$, sub_category = $seo$Hand Wash Sinks & Stations$seo$ where id in (378,382,383,384,398,426,453);
-- Hospital Equipment > Sluice Sinks & Slop Hoppers: stainless-steel-sink-with-slop-hopper-combination, stainless-steel-slop-hopper-sink-with-grid-cover, stainless-steel-sink-top-with-bowl-and-slop-hopper
update products set major_category = $seo$Hospital Equipment$seo$, sub_category = $seo$Sluice Sinks & Slop Hoppers$seo$ where id in (379,416,465);
-- Tables & Storage > Stainless Steel Work Tables: stainless-steel-prep-table-with-small-sink-overshelf-and-2-undershelves, heavy-duty-stainless-steel-work-table-with-two-undershelves, stainless-steel-table-with-back-upstand-and-2-undershelves, stainless-steel-work-table-with-splashback-and-undershelf, stainless-steel-three-level-work-table, compact-stainless-steel-stand-with-upstand-and-2-undershelves, narrow-stainless-steel-3-tier-work-table, stainless-steel-work-table-with-2-undershelves-no-upstand, stainless-steel-work-table-with-upstand-middle-shelf-and-slatted-bottom, plain-stainless-steel-work-table-with-undershelf, sus-304-stainless-steel-work-table-with-undershelf
update products set major_category = $seo$Tables & Storage$seo$, sub_category = $seo$Stainless Steel Work Tables$seo$ where id in (385,394,397,405,419,422,450,461,466,483,486);
-- Stainless Steel Fabrication > Railings & Balustrades: stainless-steel-staircase-balustrade-with-ball-top-newel-post
update products set major_category = $seo$Stainless Steel Fabrication$seo$, sub_category = $seo$Railings & Balustrades$seo$ where id in (388);
-- Food Processing Machines > Nut Roasters & Rotary Drums: electric-rotary-drum-nut-roaster-machine
update products set major_category = $seo$Food Processing Machines$seo$, sub_category = $seo$Nut Roasters & Rotary Drums$seo$ where id in (389);
-- Jikos & Firewood Stoves > Institutional Firewood Jikos: institutional-energy-saving-firewood-jiko-for-school-kitchens, stainless-steel-institutional-firewood-jiko-with-refractory-lining, square-stainless-steel-institutional-jiko-with-fitted-pot-and-lid
update products set major_category = $seo$Jikos & Firewood Stoves$seo$, sub_category = $seo$Institutional Firewood Jikos$seo$ where id in (390,393,448);
-- Food Warmers & Bain Marie > Food Display Warmers: stainless-steel-food-pass-counter-with-heat-lamps-and-overshelf
update products set major_category = $seo$Food Warmers & Bain Marie$seo$, sub_category = $seo$Food Display Warmers$seo$ where id in (392);
-- Tables & Storage > Trolleys & Carts: stainless-steel-3-tier-utility-trolley-with-orange-castors, stainless-steel-5-tier-trolley-with-castors, stainless-steel-food-service-trolley-with-3-covered-pans, stainless-steel-3-tier-tray-trolley-with-push-handle, stainless-steel-serving-trolley-with-3-open-food-pans, stainless-steel-2-tier-flat-top-trolley-with-push-handle
update products set major_category = $seo$Tables & Storage$seo$, sub_category = $seo$Trolleys & Carts$seo$ where id in (395,408,411,431,462,470);
-- Stainless Steel Sinks > Sink Cabinets & Bar Sinks: stainless-steel-sink-cabinet-with-drainer-drawers-and-doors, stainless-steel-kitchen-sink-unit-with-drawers-and-cupboards, stainless-steel-enclosed-sink-unit-with-drainer, stainless-steel-double-sink-cabinet-with-drawers
update products set major_category = $seo$Stainless Steel Sinks$seo$, sub_category = $seo$Sink Cabinets & Bar Sinks$seo$ where id in (400,413,445,446);
-- Cooking Equipment > Griddles & Hot Plates: stainless-steel-gas-griddle-flat-top-with-stand, commercial-gas-griddle-flat-top-with-cabinet-stand, electric-griddle-with-half-ribbed-plate
update products set major_category = $seo$Cooking Equipment$seo$, sub_category = $seo$Griddles & Hot Plates$seo$ where id in (401,444,478);
-- Tables & Storage > Shelving & Racks: stainless-steel-4-tier-solid-shelving-rack, tall-stainless-steel-multi-tier-tray-rack, stainless-steel-open-frame-3-shelf-rack, stainless-steel-perforated-cold-room-shelving-racks, stainless-steel-5-tier-slatted-rack-on-castors, stainless-steel-4-tier-perforated-rack
update products set major_category = $seo$Tables & Storage$seo$, sub_category = $seo$Shelving & Racks$seo$ where id in (402,418,452,456,460,469);
-- Kitchen Hoods & Ventilation > Kitchen Exhaust Hoods: stainless-steel-extraction-hood-section-with-baffle-filters, long-stainless-steel-extraction-hood-with-baffle-filters
update products set major_category = $seo$Kitchen Hoods & Ventilation$seo$, sub_category = $seo$Kitchen Exhaust Hoods$seo$ where id in (412,420);
-- Food Warmers & Bain Marie > Hot Cupboards & Warming Cabinets: stainless-steel-single-door-food-warming-cabinet-on-castors
update products set major_category = $seo$Food Warmers & Bain Marie$seo$, sub_category = $seo$Hot Cupboards & Warming Cabinets$seo$ where id in (424);
-- Stainless Steel Fabrication > Stainless Steel Urinals: stainless-steel-wall-urinal-trough-with-flush-pipe, stainless-steel-l-shaped-corner-urinal-trough
update products set major_category = $seo$Stainless Steel Fabrication$seo$, sub_category = $seo$Stainless Steel Urinals$seo$ where id in (439,474);
-- Jikos & Firewood Stoves > Charcoal Jikos: orange-mild-steel-charcoal-jiko-with-stand
update products set major_category = $seo$Jikos & Firewood Stoves$seo$, sub_category = $seo$Charcoal Jikos$seo$ where id in (442);
-- Bakery Equipment > Dough Mixers: commercial-spiral-dough-mixer
update products set major_category = $seo$Bakery Equipment$seo$, sub_category = $seo$Dough Mixers$seo$ where id in (459);
-- Food Processing Machines > Chips Cutters & Potato Peelers: potato-chips-cutter-on-mild-steel-stand, commercial-electric-potato-peeler-machine
update products set major_category = $seo$Food Processing Machines$seo$, sub_category = $seo$Chips Cutters & Potato Peelers$seo$ where id in (475,477);
-- Cooking Equipment > Shawarma & Rotisserie Machines: commercial-shawarma-machine-vertical-broiler
update products set major_category = $seo$Cooking Equipment$seo$, sub_category = $seo$Shawarma & Rotisserie Machines$seo$ where id in (476);
-- Bakery Equipment > Bread Slicers & Baking Tins: commercial-bread-slicer-machine
update products set major_category = $seo$Bakery Equipment$seo$, sub_category = $seo$Bread Slicers & Baking Tins$seo$ where id in (479);
-- Food Processing Machines > Juice Machines & Tea Urns: double-tank-cold-juice-dispenser
update products set major_category = $seo$Food Processing Machines$seo$, sub_category = $seo$Juice Machines & Tea Urns$seo$ where id in (480);
-- Food Processing Machines > Milk Tanks & Mixing Tanks: stainless-steel-electric-mixing-tank-with-agitator-and-control-panel
update products set major_category = $seo$Food Processing Machines$seo$, sub_category = $seo$Milk Tanks & Mixing Tanks$seo$ where id in (482);

commit;

-- Check: should return 0 rows
-- select id, slug, major_category, sub_category from products where major_category in ('Cooking','Stainless Steel');

-- Undo (only if needed):
-- update products p set meta_title = b.meta_title, meta_description = b.meta_description from (select distinct on (id) * from products_seo_backup order by id, backed_up_at desc) b where p.id = b.id and p.id in (179,170,172,296,442,64,293,16,158,30,14,308,273,52,439,474,27,41,43,116,136,348,305,128,163,19,72,55,22,89,92,146,148,133,18,112,193,10,409,68,90);
-- update products p set major_category = b.major_category, sub_category = b.sub_category from (select distinct on (id) * from products_category_backup order by id, backed_up_at desc) b where p.id = b.id;

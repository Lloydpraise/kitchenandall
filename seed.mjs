import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Read keys from your .env file
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY is missing in your .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const inventory = {
  'Cooking': {
    'Bakery Appliances': ['3-Deck 9-Tray Oven', '20L Spiral Mixer', 'Bread Prover 16 Tray', 'Cake Mixer 10L', 'Dough Sheeter', 'Rotary Rack Oven', 'Bread Slicer', 'Pastry Roller', 'Deck Oven Gas', 'Pizza Oven'],
    'Burners/Jikos/Stoves': ['SS Four Burner', 'Gas Cooker 2 Burners', 'Mid-Steel Burner', 'Stock Pot Stove', 'High-Pressure Burner', 'Double Stock Pot', 'Boiling Table', 'Bio-Ethanol Jiko', 'Charcoal Griller', '6 Burner Range'],
    'Cooking Appliances': ['Combined Range', 'Chips Frier', 'Adjustable Choma Grill', 'Bain Marie 4 Div', 'Flat Griddle', 'Salamander', 'Gas Fryer', 'Rice Cooker 10L', 'Pressure Fryer', 'Pasta Boiler'],
    'Small Appliances': ['Popcorn Machine', 'Conveyor Toaster', 'Heavy Duty Blender', 'Panini Press', 'Industrial Microwave', 'Waffle Maker', 'Crepe Maker', 'Coffee Percolator', 'Induction Cooker', 'Milk Shaker'],
  },
  'Refrigeration': {
    'Large Appliances': ['Meat Chiller Storage', 'Double Door Chiller', 'Upright Freezer', 'Island Freezer', 'Cold Room Panel', 'Blast Chiller', 'Chest Freezer 500L', 'Vertical Freezer', 'Chiller Compressor', 'Pharmacy Fridge'],
    'Hotel Appliances': ['Meat Chiller Display', 'Meat Display Cabinet', 'Cake Display SS', 'Food Display Chilled', 'Pizza Prep Fridge', 'Ice Cube Maker', 'Saladette Chiller', 'Sushi Display', 'Sandwich Display', 'Back Bar Cooler'],
    'Office Kitchen': ['Water Dispenser', 'Minibar Fridge', 'Wine Chiller', 'Under-sink Chiller', 'Office Microwave', 'Coffee Machine', 'Electric Kettle', 'Ice Dispenser', 'Milk Frother', 'Compact Dishwasher'],
  },
  'Food Prep': {
    'Butchery Equipment': ['Meat Mincer #32', 'Bone Saw 1650mm', 'Meat Slicer 12in', 'Sausage Filler 7L', 'Hamburger Press', 'Feather Plucker', 'Bone Crusher', 'Meat Injector', 'Hydraulic Stuffer', 'Meat Tenderizer'],
    'Food Processors': ['Potato Peeler 15kg', 'Vegetable Cutter', 'Hand Blender', 'Tabletop Processor', 'Commercial Juicer', 'Garlic Peeler', 'Bread Crumb Machine', 'Orange Squeezer', 'Vacuum Sealer', 'Universal Shredder'],
    'Measuring Tools': ['Pricing Scale 40kg', 'Platform Scale 300kg', 'Meat Thermometer', 'Hanging Scale', 'Precision Scale', 'Laser Thermometer', 'Flour Scoops', 'Industrial Timer', 'Portion Scale', 'Mechanical Scale'],
    'Home Kitchen': ['Stand Mixer 5L', 'Air Fryer', 'Slow Cooker', 'Nutri-Blender', 'Dehydrator', 'Pasta Maker', 'Knife Sharpener', 'Milk Frother Home', 'Slow Juicer', 'Toaster Oven'],
  },
  'Stainless Steel': {
    'Juakali Fabrications': ['Kitchen Hood', 'Work Top Table', 'SS 4-Tier Rack', 'Storage Cabinet', 'Grease Trap', 'Wall Shelving', 'Hand Wash Basin', 'Pot Rack', 'Charcoal Grill Box', 'Wall Cladding'],
    'Hotel Appliances': ['Double Bowl SS Sink', 'Single Bowl SS Sink', 'Bain Marie Counter', 'Service Trolley', 'GN Pan Rack', 'Dishwash Table', 'Prep Table Sink', 'Pedal Wash Station', 'GN Pan Set', 'Deep Soaking Sink'],
  }
};

async function seed() {
  const products = [];

  for (const [major, subs] of Object.entries(inventory)) {
    for (const [sub, items] of Object.entries(subs)) {
      for (const name of items) {
        const price = Math.floor(Math.random() * (150000 - 15000 + 1)) + 15000;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);
        
        products.push({
          name,
          slug,
          major_category: major,
          sub_category: sub,
          price,
          old_price: Math.random() > 0.5 ? price + 5000 : null,
          image_url: `https://placehold.co/400x400?text=${encodeURIComponent(name)}`
        });
      }
    }
  }

  console.log(`Preparing to insert ${products.length} products...`);
  
  const { data, error } = await supabase.from('products').insert(products);

  if (error) {
    console.error('Failed to insert into Supabase:', error);
  } else {
    console.log(`Success! Inserted ${products.length} products into Supabase.`);
  }
}

seed();
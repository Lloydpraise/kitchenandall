'use client';

import React, { useState } from 'react';

// 1. Define the exact structure of your 11 sub-categories
const CATEGORY_MAP: Record<string, string[]> = {
  'Cooking': ['Bakery Appliances', 'Burners/Jikos/Stoves', 'Cooking Appliances', 'Small Appliances'],
  'Refrigeration': ['Large Appliances', 'Hotel Appliances', 'Office Kitchen'],
  'Food Prep': ['Butchery Equipment', 'Food Processors', 'Measuring Tools', 'Home Kitchen'],
  'Stainless Steel': ['Juakali Fabrications', 'Hotel Appliances']
};

interface Product {
  id: number;
  name: string;
  major_category: string;
  sub_category: string;
  price: number;
  old_price?: number;
  image_url: string;
}

export default function ProductGallery({ products }: { products: Product[] }) {
  // Default to the first Major Category and its first Sub-Category
  const [activeMajor, setActiveMajor] = useState('Cooking');
  const [activeSub, setActiveSub] = useState('Bakery Appliances');

  // Filter logic to show exactly the 10 items in the selected sub-category
  const filteredItems = products.filter(
    (p) => p.major_category === activeMajor && p.sub_category === activeSub
  );

  const handleWhatsApp = (productName: string, subCat: string) => {
    const phone = "2547XXXXXXXX"; // Replace with your actual WhatsApp number
    const message = `Hi Stanley, I am interested in the ${productName} from the ${subCat} section of Kitchen and All Ltd.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="w-full py-8">
      {/* --- MAJOR CATEGORY NAVIGATION --- */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.keys(CATEGORY_MAP).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveMajor(cat);
              setActiveSub(CATEGORY_MAP[cat][0]); // Auto-select first sub-category
            }}
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
              activeMajor === cat 
              ? 'bg-blue-700 text-white shadow-md scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- SUB-CATEGORY PILL NAVIGATION --- */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
        {CATEGORY_MAP[activeMajor].map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSub(sub)}
            className={`px-4 py-1 text-sm rounded-md border transition-colors ${
              activeSub === sub 
              ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' 
              : 'border-gray-200 text-gray-500 hover:border-blue-300'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* --- PRODUCT GRID (4 COLUMNS) --- */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {filteredItems.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Product Image Placeholder */}
              <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.old_price && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Sale
                  </span>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-gray-800 font-bold text-sm md:text-base mb-1 h-12 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-700 font-black text-lg">
                    KES {Number(product.price).toLocaleString()}
                  </span>
                  {product.old_price && (
                    <span className="text-gray-400 line-through text-xs">
                      {Number(product.old_price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Call to Action */}
                <button 
                  onClick={() => handleWhatsApp(product.name, product.sub_category)}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.584 3.911 1.745 5.672l-.999 3.65 3.743-.981z" />
                  </svg>
                  Inquire
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>No products found in this category.</p>
        </div>
      )}
    </section>
  );
}

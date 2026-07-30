interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;      // Freshly added
  stock_quantity: number; // Freshly added
}

export default function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-orange-500 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      
      {/* Clickable Image Section */}
      <a href={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100 block">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* STOCK BADGE - Dynamic colors */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-10 ${
          isOutOfStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isOutOfStock ? '● Out of Stock' : '● In Stock'}
        </div>
      </a>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest italic">Industrial Grade</span>
        
        <a href={`/product/${product.id}`}>
          <h3 className="font-extrabold text-slate-900 text-xl mt-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </a>
        
        <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-snug flex-1">
          {product.description}
        </p>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tight">Price (Inc. VAT)</span>
            <span className="text-2xl font-black text-slate-900">
              KSH {Number(product.price).toLocaleString()}
            </span>
          </div>

          {/* ADD TO CART - Disabled if out of stock */}
          <button 
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              isOutOfStock 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50' 
              : 'bg-slate-900 text-white hover:bg-orange-600 shadow-md active:scale-95'
            }`}
          >
            <span>Add</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
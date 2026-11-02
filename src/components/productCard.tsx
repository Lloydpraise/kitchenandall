import { useEffect, useState } from 'react';
import { addToCart } from '../stores/cart';
import { track } from '../lib/analytics';

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  image_url: string;      // Freshly added
  stock_quantity: number; // Freshly added
  old_price?: number | string | null;
  // Set by withOffer() in src/lib/offers.ts when the product is in a live sale (price is then already the sale price)
  offer?: { badge: string; percent: number } | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const [toastVisible, setToastVisible] = useState(false);
  const isOutOfStock = product.stock_quantity <= 0;
  const offer = product.offer;
  const wasPrice = Number(product.old_price);
  const showWas = Number.isFinite(wasPrice) && wasPrice > Number(product.price);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image_url,
      price: Number(product.price),
    });
    track('add_to_cart', { product_id: product.id, product_name: product.name, value: Number(product.price), quantity: 1, label: 'product card', location: 'product-card' });
    setToastVisible(true);
  };

  useEffect(() => {
    if (!toastVisible) return;
    const timer = window.setTimeout(() => setToastVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if the add to cart button was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.location.href = `/product/${product.slug}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image: the same height on every card */}
      <div className="relative h-36 sm:h-44 lg:h-52 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className={`absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide shadow ${
          isOutOfStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {isOutOfStock ? 'Out of stock' : 'In stock'}
        </span>
        {offer && (
          <>
            <span className="bf-badge absolute bottom-0 inset-x-0 z-10 flex items-center justify-center gap-1.5 bg-black/90 px-2 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.12em] text-amber-400">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400 bf-announce-dot" />
              {offer.badge}
            </span>
            <span className="absolute top-2 right-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[10px] sm:text-xs font-black text-white shadow">
              -{offer.percent}%
            </span>
          </>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors" title={product.name}>
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 truncate">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <span className="flex flex-col leading-tight">
            {showWas && (
              <span className="whitespace-nowrap text-[11px] sm:text-xs font-semibold text-slate-400 line-through">
                KSh {wasPrice.toLocaleString()}
              </span>
            )}
            <span className={`whitespace-nowrap text-[15px] sm:text-lg font-black ${showWas ? 'text-red-600' : 'text-slate-900'}`}>
              KSh {Number(product.price).toLocaleString()}
            </span>
          </span>
          {/* Add to cart, disabled when out of stock */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
            className={`shrink-0 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all ${
              isOutOfStock
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : toastVisible ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-orange-600 shadow active:scale-95 cursor-pointer'
            }`}
          >
            {toastVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3.5h2.6l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1l1.6-6.8H6.2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { addToCart } from '../stores/cart';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  stock_quantity: number;
}

export default function ProductDetail({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const hasDiscount = Boolean(product.old_price && product.old_price > product.price);
  const discountPercent = useMemo(
    () => hasDiscount ? Math.round(((product.old_price as number) - product.price) / (product.old_price as number) * 100) : 0,
    [hasDiscount, product.old_price, product.price]
  );
  const stockQuantity = product.stock_quantity ?? 20;
  const descriptionText = product.description?.trim() || `Our ${product.name} is built for high-volume kitchens and engineered for reliable long-term performance.`;
  const shortDescription = descriptionText.length > 240 ? `${descriptionText.slice(0, 240)}...` : descriptionText;
  const stockLabel = stockQuantity > 0 ? 'In stock' : 'Out of stock';
  const isOutOfStock = stockQuantity <= 0;

  const itemPayload = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image_url,
    price: product.price,
  };

  const handleAddToCart = () => {
    addToCart(itemPayload);
    setToastVisible(true);
  };

  const handleBuyNow = () => {
    addToCart(itemPayload);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('added-to-cart-toast', 'true');
    }
    setToastVisible(true);
    window.setTimeout(() => {
      window.location.href = '/checkout';
    }, 300);
  };

  useEffect(() => {
    if (!toastVisible) return;
    const timer = window.setTimeout(() => setToastVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  return (
    <div className="relative bg-slate-100 pb-32 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)]">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full min-h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-0 top-6 px-6 flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.35em] ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {stockLabel}
              </span>
              {hasDiscount && (
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-white">
                  {discountPercent}% off
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">
                  {product.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-orange-600 font-black">Price</p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="text-4xl font-black text-slate-900">KSH {Number(product.price).toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="text-sm text-slate-500 line-through">KSH {Number(product.old_price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.25em] ${isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isOutOfStock ? 'Out of stock' : 'Available now'}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black">Description</p>
                  </div>
                  {descriptionText.length > 240 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="text-sm font-black uppercase tracking-[0.35em] text-orange-600 transition hover:text-orange-500"
                    >
                      {expanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
                <p className="mt-5 text-base leading-relaxed text-slate-700">
                  {expanded ? descriptionText : shortDescription}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="inline-flex min-h-[56px] w-full items-center justify-center bg-indigo-700 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="inline-flex min-h-[56px] w-full items-center justify-center bg-orange-600 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Buy now
                </button>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                <p className="font-black uppercase tracking-[0.35em] text-slate-700">Product details</p>
                <p className="mt-3 leading-relaxed">This product is designed to perform in demanding commercial environments. Specifications are based on high durability, easy cleaning, and efficient workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-20px_50px_rgba(15,23,42,0.14)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Total</p>
            <p className="text-lg font-black text-slate-900">KSH {Number(product.price).toLocaleString()}</p>
          </div>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="inline-flex min-h-[52px] items-center justify-center rounded-none bg-orange-600 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Buy now
          </button>
        </div>
      </div>

      {toastVisible && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:px-0">
          <div className="w-full max-w-md rounded-2xl bg-emerald-600 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.25em] text-white shadow-2xl">
            You have Added item to Cart!
          </div>
        </div>
      )}
    </div>
  );
}

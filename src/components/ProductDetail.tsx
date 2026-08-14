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
  const [questionDrawerOpen, setQuestionDrawerOpen] = useState(false);
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
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 font-black mb-5">Description</p>
                <div className="flex flex-wrap items-start gap-1">
                  <p className="text-base leading-relaxed text-slate-700">
                    {expanded ? descriptionText : shortDescription}
                  </p>
                  {descriptionText.length > 240 && !expanded && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="text-base text-blue-600 underline hover:text-blue-700 transition font-normal whitespace-nowrap"
                    >
                      Read more
                    </button>
                  )}
                  {expanded && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="text-base text-blue-600 underline hover:text-blue-700 transition font-normal whitespace-nowrap ml-1"
                    >
                      Read less
                    </button>
                  )}
                </div>
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
        {questionDrawerOpen && (
          <div className="mb-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <a
              href={`https://wa.me/254741045143?text=${encodeURIComponent('Hi I am Inquiring about')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-black uppercase text-sm tracking-wider transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.99 1.485c-2.873 1.72-4.613 4.47-4.613 7.361 0 2.3.638 4.543 1.848 6.487L2.5 21.5l7.25-1.902c1.863 1.021 3.957 1.56 6.153 1.56 5.803 0 10.5-4.697 10.5-10.5 0-2.822-1.126-5.477-3.175-7.475-2.05-1.997-4.78-3.098-7.65-3.098z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        )}
        <button
          type="button"
          onClick={() => setQuestionDrawerOpen(!questionDrawerOpen)}
          className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700 underline transition"
        >
          {questionDrawerOpen ? '✕ Close' : 'Have a Question?'}
        </button>
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

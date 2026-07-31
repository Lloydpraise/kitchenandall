import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { cartItems, removeFromCart, updateQuantity } from '../stores/cart';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useStore(cartItems);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <button
        type="button"
        className="relative p-2 text-slate-800 hover:text-orange-600 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          {items.length}
        </span>
      </button>

      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        <aside className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Your Cart</p>
              <h2 className="text-2xl font-black text-slate-900">Shopping Bag</h2>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="Close cart">
              ✕
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-slate-500">
                <div>
                  <p className="text-lg font-bold text-slate-900">Your cart is empty</p>
                  <p className="mt-3 text-sm">Items you add to cart appear here.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-3xl border border-slate-200 p-4">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-black text-slate-900 text-sm line-clamp-2">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black">-</button>
                        <span className="text-[12px] font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-2 text-[11px] text-red-500 font-bold uppercase">Remove</button>
                      </div>
                      <p className="mt-3 text-lg font-black text-slate-900">KSH {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-5">
            <div className="flex items-center justify-between text-slate-500 uppercase tracking-widest text-xs font-black">
              <span>Subtotal</span>
              <span>KSH {subtotal.toLocaleString()}</span>
            </div>
            <a
              href="/checkout"
              className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-orange-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg hover:bg-orange-700 transition-all"
            >
              Checkout
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

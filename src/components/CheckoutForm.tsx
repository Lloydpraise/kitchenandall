import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, clearCart } from '../stores/cart';

const WHATSAPP_PHONE = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '254741045143';

export default function CheckoutForm() {
  const items = useStore(cartItems);
  const [customerName, setCustomerName] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('added-to-cart-toast') === 'true') {
      setToastVisible(true);
      window.sessionStorage.removeItem('added-to-cart-toast');
      const timer = window.setTimeout(() => setToastVisible(false), 2000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    const itemText = items
      .map((item) => `${item.name} for KSH ${item.price.toLocaleString()}`)
      .join(items.length > 1 ? ' and ' : '');

    const message = `Hello! i want the ${itemText} from the website. can i place an order?`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    setIsSubmitting(true);
    clearCart();
    // Open WhatsApp directly
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        {toastVisible && (
          <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:px-0">
            <div className="w-full max-w-md rounded-2xl bg-emerald-600 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.25em] text-white shadow-2xl">
              You have Added item to Cart!
            </div>
          </div>
        )}
        <p className="text-lg font-bold text-slate-900">Your cart is empty</p>
        <a href="/" className="mt-6 inline-flex rounded-full bg-orange-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-orange-700 transition-all">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                <p className="text-slate-500 text-xs mt-1">Qty: {item.quantity}</p>
              </div>
              <p className="font-black text-slate-900">Ksh {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-4">
          <span>Total</span>
          <span>Ksh {subtotal.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-6">Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-bold text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 disabled:bg-slate-300 text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-orange-700 transition-all"
          >
            {isSubmitting ? 'Placing Order...' : 'Confirm Order via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MarketingPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative bg-[#0F172A] w-full max-w-md p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="text-center">
          <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">New Project Offer</span>
          <h3 className="text-3xl font-black text-white mt-4 uppercase italic">Get <span className="text-orange-500">Free Consultation</span></h3>
          <p className="text-slate-400 mt-4 font-medium">Planning a new hotel or restaurant? Get a free kitchen layout consultation today.</p>
          <a
            href="https://wa.me/254741045143"
            target="_blank"
            onClick={() => setShowPopup(false)}
            className="mt-8 block w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-center"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
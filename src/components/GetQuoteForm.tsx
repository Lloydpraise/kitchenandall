import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export default function GetQuoteForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const trackPixel = (eventName: string, payload: Record<string, unknown> = {}) => {
    if (typeof window === 'undefined') return;
    const fbq = (window as typeof window & { fbq?: (...args: any[]) => void }).fbq;
    if (!fbq) return;
    fbq('track', eventName, payload);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const { error } = await supabase.from('quote_requests').insert({
      name,
      phone,
      email: email || null,
      project_details: projectDetails,
    });

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      setErrorMessage('Something went wrong. Please try again or reach us on WhatsApp directly.');
      return;
    }

    trackPixel('Lead', {
      content_name: 'Quote Request',
      content_category: 'Lead Generation',
      currency: 'KES',
      value: 0,
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-black text-slate-900">Thank you, {name}!</p>
        <p className="mt-4 text-slate-600">We've received your request and will get back to you shortly.</p>
        <a
          href={`https://wa.me/254741045143?text=${encodeURIComponent(`Hi, I just submitted a quote request as ${name}. I'd like to follow up.`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-full bg-orange-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-orange-700 transition-all"
        >
          Chat on WhatsApp Now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Tell us about your project</label>
        <textarea
          required
          rows={5}
          value={projectDetails}
          onChange={(e) => setProjectDetails(e.target.value)}
          placeholder="e.g. New hotel kitchen, 40-seater restaurant, need refrigeration and cooking equipment..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
        />
      </div>

      {errorMessage && <p className="text-sm font-bold text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 disabled:bg-slate-300 text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-orange-700 transition-all"
      >
        {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
      </button>
    </form>
  );
}
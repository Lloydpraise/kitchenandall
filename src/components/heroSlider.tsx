import { useState, useEffect } from 'react';

const slides = [
  {
    title: 'Modern Kitchen Design',
    description: 'Premium appliances and custom fixtures to elevate every cooking space.',
    image: '/images/hero/slide-1.jpg',
  },
  {
    title: 'Stainless Steel Reliability',
    description: 'Durable, hygienic solutions built for busy restaurants and commercial kitchens.',
    image: '/images/hero/slide-2.jpg',
  },
  {
    title: 'Professional Food Prep',
    description: 'Smart storage, prep stations, and tools designed for efficient workflow.',
    image: '/images/hero/slide-3.jpg',
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full min-h-[650px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${slides[active].image}')` }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center text-white">
          <span className="inline-block text-sm uppercase tracking-[0.4em] text-orange-500">
            Kitchen & Hospitality
          </span>
          <h1 className="mt-6 text-5xl font-black uppercase tracking-tight sm:text-6xl">
            {slides[active].title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
            {slides[active].description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/catalog"
              className="rounded-full bg-orange-600 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] transition hover:bg-orange-700"
            >
              Shop Gear
            </a>
            <button
              type="button"
              onClick={() => setActive((active + 1) % slides.length)}
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:border-orange-500"
            >
              Next Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
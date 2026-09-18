import { motion } from 'framer-motion';
import { Ruler, ShieldCheck, PenTool } from 'lucide-react';

export default function AnimatedBanner() {
  return (
    <section className="bg-[#0F172A] py-24 relative overflow-hidden">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 0.15 }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="grid grid-cols-3 gap-4 rotate-12 scale-150">
          <motion.img animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} src="/images/categories/cooking.jpg" className="rounded-3xl shadow-2xl" />
          <motion.img animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} src="/images/categories/refrigeration.jpg" className="rounded-3xl shadow-2xl mt-20" />
          <motion.img animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} src="/images/categories/food-prep.jpg" className="rounded-3xl shadow-2xl" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-white">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 text-orange-500 leading-none">Bespoke Kitchen <br/> Layout & Fabrication</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4"><Ruler className="text-orange-500 shrink-0" size={28} /><p className="text-slate-300 font-medium">Custom measurements and 3D planning for maximum kitchen efficiency.</p></div>
              <div className="flex items-start gap-4"><ShieldCheck className="text-orange-500 shrink-0" size={28} /><p className="text-slate-300 font-medium">304 Food-Grade Stainless Steel for superior hygiene and durability.</p></div>
              <div className="flex items-start gap-4"><PenTool className="text-orange-500 shrink-0" size={28} /><p className="text-slate-300 font-medium">Hand-crafted in our Nairobi workshop by expert Kenyan artisans.</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h4 className="text-white font-black uppercase tracking-widest mb-4">Start Your Project</h4>
            <p className="text-slate-400 mb-8 font-medium">Turn your empty space into a high-performance commercial kitchen. Send us your requirements.</p>
            <a href="/get-quote" className="inline-block w-full bg-orange-600 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-orange-700 text-center transition-all shadow-2xl">Get a Quote</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
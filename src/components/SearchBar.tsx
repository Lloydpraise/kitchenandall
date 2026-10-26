import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { categories, categoryUrl, subCategoryUrl } from '../lib/categories';

// Every category and sub-category as a search target, e.g. "bain" finds Bain Marie
const categoryTargets = categories.flatMap((c) => [
  { label: c.name, parent: '', href: categoryUrl(c) },
  ...c.subs.map((s) => ({ label: s.name, parent: c.name, href: subCategoryUrl(c, s) })),
]);
const words = (q: string) => q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1 || /\d/.test(w));

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [categoryResults, setCategoryResults] = useState<typeof categoryTargets>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      const terms = words(searchQuery);
      if (searchQuery.length < 2 || !terms.length) {
        setResults([]);
        setCategoryResults([]);
        setIsSearching(false);
        return;
      }
      setCategoryResults(
        categoryTargets.filter((t) => terms.every((w) => `${t.label} ${t.parent}`.toLowerCase().includes(w))).slice(0, 3)
      );
      // every word must appear in the name, in any order: "gas cooker 4 burner" finds "4 Burner Gas Cooker"
      let query = supabase.from('products').select('id, slug, name, price, image_url');
      for (const w of terms) query = query.ilike('name', `%${w}%`);
      const { data, error } = await query.limit(6);

      if (error) {
        console.error("Search Error:", error);
        return;
      }
      setResults(data || []);
      setIsSearching(true);
    };
    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 1 && setIsSearching(true)}
        placeholder="Search products or categories..."
        className="w-full bg-slate-100 border-none rounded-full py-2.5 px-5 text-[12px] font-normal text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-600 outline-none"
      />
      {isSearching && (results.length > 0 || categoryResults.length > 0) && (
        <div className="absolute top-full mt-2 w-72 max-w-[calc(100vw-2rem)] right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[60]">
          {categoryResults.map((c) => (
            <a key={c.href} href={c.href} className="flex flex-col px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 transition-colors">
              <span className="text-[12px] font-black text-slate-800">{c.label}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">{c.parent ? `Category · ${c.parent}` : 'Category'}</span>
            </a>
          ))}
          {results.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => setIsSearching(false)}
              className="flex items-center gap-4 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                <img src={product.image_url || "/placeholder.png"} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-slate-700 line-clamp-1">{product.name}</span>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">Ksh {product.price.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
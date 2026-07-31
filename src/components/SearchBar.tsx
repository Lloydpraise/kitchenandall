import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase.js';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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
      if (searchQuery.length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('id, slug, name, price, image_url')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

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
        placeholder="Search..."
        className="w-full bg-slate-100 border-none rounded-full py-2.5 px-5 text-[12px] font-normal text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-600 outline-none"
      />
      {isSearching && results.length > 0 && (
        <div className="absolute top-full mt-2 w-72 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[60]">
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
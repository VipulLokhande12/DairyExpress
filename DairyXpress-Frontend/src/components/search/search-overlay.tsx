import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Search, X } from 'lucide-react';
import { api, type Product } from '@/services/api';

const popular = ['Milk', 'Paneer', 'Ghee', 'Yogurt', 'Cheese'];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem('dv_search_history') ?? '[]'));
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.getProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products.slice(0, 6);
    return products.filter((product) => [product.name, product.category, product.description, product.unit].some((value) => value?.toLowerCase().includes(term))).slice(0, 8);
  }, [products, query]);

  const remember = (term: string) => {
    const next = [term, ...history.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setHistory(next); localStorage.setItem('dv_search_history', JSON.stringify(next));
  };
  const browse = (term: string) => { remember(term); setQuery(''); onClose(); navigate(`/products?search=${encodeURIComponent(term)}`); };
  const openProduct = (product: Product) => { remember(product.name); setQuery(''); onClose(); navigate(`/product/${product.slug}`); };

  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70]">
    <div className="absolute inset-0 bg-ink/40 backdrop-blur-md" onClick={onClose}/>
    <motion.div initial={{ opacity: 0, y: -20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: .98 }} className="absolute left-1/2 top-24 w-[92%] max-w-2xl -translate-x-1/2">
      <div className="glass overflow-hidden rounded-4xl shadow-float">
        <form onSubmit={(event) => { event.preventDefault(); if (query.trim()) browse(query.trim()); }} className="flex items-center gap-3 border-b border-cream-400 px-5 py-4">
          <Search className="h-5 w-5 text-primary"/><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all 25 dairy products…" className="w-full bg-transparent font-heading text-lg text-ink outline-none placeholder:text-ink-400"/><button type="submit" disabled={!query.trim()} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Search</button><button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-cream-300"><X className="h-4 w-4"/></button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!query && <div className="mb-4 flex flex-wrap gap-2">{history.map((term) => <button key={term} onClick={() => setQuery(term)} className="chip bg-cream-300 text-ink-600"><Clock className="h-3 w-3"/>{term}</button>)}{popular.map((term) => <button key={term} onClick={() => setQuery(term)} className="chip bg-primary/10 text-primary">{term}</button>)}</div>}
          {loading ? <p className="py-8 text-center text-sm text-ink-500">Searching products…</p> : results.length ? <div className="space-y-1">{results.map((product) => <button key={product.id} onClick={() => openProduct(product)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-cream-200"><img src={product.image} alt="" className="h-12 w-12 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{product.name}</p><p className="text-xs text-ink-500">₹{product.price} · {product.category} · {product.deliveryMins} min</p></div><ArrowRight className="h-4 w-4 text-ink-400"/></button>)}</div> : <div className="py-10 text-center"><p className="font-heading font-semibold text-ink">No matching products</p><button onClick={() => browse(query)} className="mt-2 text-sm font-semibold text-primary">Search the full shop</button></div>}
        </div>
      </div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

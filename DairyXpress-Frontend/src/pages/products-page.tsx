import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/services/api';
import type { Product } from '@/data/catalog';
import { categories } from '@/data/catalog';
import { ProductCard } from '@/components/ui/product-card';
import { Reveal, SectionHeading, Skeleton } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

const sorts = [
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? '';
  const search = params.get('search') ?? '';
  const [items, setItems] = useState<Product[] | null>(null);
  const [sort, setSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(null);
    setError('');
    api.getProducts({ category: category || undefined, search: search || undefined })
      .then((data) => setItems(data))
      .catch((err: Error) => {
        setError(err.message || 'Unable to load products. Please try again.');
        setItems([]);
      });
  }, [category, search]);

  const sorted = useMemo(() => {
    if (!items) return [];
    const list = items.filter((item) =>
      item.price <= maxPrice &&
      (!organicOnly || item.organic) &&
      (!fastDeliveryOnly || item.deliveryMins <= 30)
    );
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, sort, maxPrice, organicOnly, fastDeliveryOnly]);

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('category', slug); else next.delete('category');
    setParams(next);
  };

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={search ? 'Search results' : 'Shop all'}
            title={search ? `Results for "${search}"` : category ? categories.find((c) => c.slug === category)?.name ?? 'All products' : 'All fresh products'}
            subtitle="Sourced this morning, delivered to your door in 30 minutes."
          />
        </Reveal>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory('')} className={cn('chip transition', !category ? 'bg-primary text-white' : 'bg-cream-300 text-ink-600 hover:bg-primary/10')}>All</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCategory(c.slug)} className={cn('chip transition', category === c.slug ? 'bg-primary text-white' : 'bg-cream-300 text-ink-600 hover:bg-primary/10')}>{c.name}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters((o) => !o)} className="inline-flex items-center gap-2 rounded-full border border-cream-400 bg-white px-4 py-2 text-sm font-medium text-ink-600 transition hover:border-primary/40">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-cream-400 bg-white px-4 py-2 text-sm font-medium text-ink-600 outline-none focus:border-primary">
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filter drawer (simplified) */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden rounded-3xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold text-ink"><Filter className="mr-1 inline h-4 w-4" /> Refine</p>
              <button onClick={() => setShowFilters(false)}><X className="h-4 w-4 text-ink-500" /></button>
            </div>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-ink-400">Price</p>
                <input type="range" min={0} max={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
                <p className="mt-1 text-xs text-ink-500">Up to ₹{maxPrice}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-ink-400">Organic only</p>
                <label className="inline-flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} className="accent-primary" /> Show organic</label>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-ink-400">Delivery</p>
                <label className="inline-flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" checked={fastDeliveryOnly} onChange={(e) => setFastDeliveryOnly(e.target.checked)} className="accent-primary" /> 30 min only</label>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-cream-200 pt-4">
              <button type="button" onClick={() => { setMaxPrice(1000); setOrganicOnly(false); setFastDeliveryOnly(false); }} className="btn-ghost px-4 py-2 text-sm">Clear filters</button>
              <button type="button" onClick={() => setShowFilters(false)} className="btn-primary px-5 py-2 text-sm">Apply filters ({sorted.length})</button>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sorted.length > 0
            ? sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            : items === null
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card-base overflow-hidden">
                    <Skeleton className="aspect-square rounded-t-4xl" />
                    <div className="p-4"><Skeleton className="h-3 w-1/3" /><Skeleton className="mt-2 h-4 w-3/4" /><Skeleton className="mt-4 h-6 w-1/2" /></div>
                  </div>
                ))
              : null}
        </div>

        {items !== null && sorted.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-heading text-2xl font-bold text-ink">No products found</p>
            <p className="mt-2 text-ink-500">{error || 'Try a different category, search term, or filter.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

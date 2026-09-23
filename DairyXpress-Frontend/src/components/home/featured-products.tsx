import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import type { Product } from '@/data/catalog';
import { ProductCard } from '@/components/ui/product-card';
import { Reveal, SectionHeading, Skeleton } from '@/components/ui/primitives';

export function FeaturedProducts() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    api.getFeaturedProducts().then((data) => setItems(data));
  }, []);

  return (
    <section className="relative bg-cream-gradient py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading eyebrow="Fresh picks" title="Featured this week" subtitle="Hand-picked favourites our customers reorder the most." />
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/products" className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-primary transition hover:gap-2.5">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items
            ? items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            : Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-base overflow-hidden p-0">
                  <Skeleton className="aspect-square rounded-t-4xl" />
                  <div className="p-4">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                    <Skeleton className="mt-3 h-3 w-2/3" />
                    <Skeleton className="mt-4 h-6 w-1/2" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

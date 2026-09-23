import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { api } from '@/services/api';
import type { Category } from '@/services/api';
import { categories as fallback } from '@/data/catalog';
import { Reveal, SectionHeading, Skeleton } from '@/components/ui/primitives';

const categoryImageOverrides: Record<string, string> = {
  paneer: '/categories/paneer.png',
  ghee: '/categories/ghee.png',
};

export function CategorySection() {
  const [cats, setCats] = useState<Category[] | null>(null);

  useEffect(() => {
    api.getCategories().then(setCats).catch(() => setCats(fallback as unknown as Category[]));
  }, []);

  const list = cats ?? fallback;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="Browse" title="Shop by category" subtitle="Everyday essentials and artisanal treats, all sourced from trusted local farms." center />
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cats === null
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-4xl bg-white shadow-card">
                <Skeleton className="aspect-[4/5] rounded-4xl" />
              </div>
            ))
          : list.map((c, i) => {
              const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[c.icon] ?? Icons.Milk;
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                  <Link to={`/products?category=${c.slug}`} className="group relative block h-full overflow-hidden rounded-4xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={categoryImageOverrides[c.slug] ?? c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                      <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full glass shadow-soft transition group-hover:bg-accent group-hover:text-ink">
                        <Icon className="h-4 w-4 text-primary group-hover:text-ink" />
                      </div>
                      <div className="absolute inset-x-3 bottom-3">
                        <p className="font-heading text-base font-bold text-white">{c.name}</p>
                        <p className="text-xs text-white/70">{c.blurb}</p>
                        <p className="mt-1 text-[11px] font-semibold text-accent">{c.count} products →</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
      </div>
    </section>
  );
}

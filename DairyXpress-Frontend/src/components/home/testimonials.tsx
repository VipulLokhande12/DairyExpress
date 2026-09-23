import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { api } from '@/services/api';
import type { Testimonial } from '@/services/api';
import { testimonials as fallback } from '@/data/catalog';
import { Reveal, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(fallback as unknown as Testimonial[]);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    api.getTestimonials().then((data) => {
      if (data.length > 0) setItems(data);
    });
  }, []);

  const go = (n: number) => {
    setDir(n > active ? 1 : -1);
    setActive((n + items.length) % items.length);
  };

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setActive((a) => (a + 1) % items.length); }, 6000);
    return () => clearInterval(t);
  }, [items.length]);

  const t = items[active];

  return (
    <section className="relative overflow-hidden bg-cream-gradient py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Loved by families" title="What our customers say" center />
        </Reveal>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-5xl bg-white p-8 shadow-float md:p-12"
            >
              <Quote className="absolute left-8 top-8 h-10 w-10 text-primary/15" />
              <div className="relative">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
                </div>
                <p className="mt-5 font-heading text-xl font-medium leading-relaxed text-ink md:text-2xl">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover shadow-soft" />
                  <div>
                    <p className="font-heading font-bold text-ink">{t.name}</p>
                    <p className="text-sm text-ink-500">{t.role}</p>
                  </div>
                  <span className="ml-auto chip bg-success/10 text-success">Verified</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => go(active - 1)} aria-label="Previous" className="absolute -left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full glass shadow-soft transition hover:bg-primary hover:text-white md:-left-6">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(active + 1)} aria-label="Next" className="absolute -right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full glass shadow-soft transition hover:bg-primary hover:text-white md:-right-6">
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-8 flex justify-center gap-2">
            {items.map((_, i) => (
              <button key={i} aria-label={`Testimonial ${i + 1}`} onClick={() => go(i)} className={cn('h-2 rounded-full transition-all', i === active ? 'w-8 bg-primary' : 'w-2 bg-cream-400')} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

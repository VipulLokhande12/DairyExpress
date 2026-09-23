import { motion } from 'framer-motion';
import { galleryImages } from '@/data/catalog';
import { Reveal, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="Moments" title="Life at the village" subtitle="Farms, products, deliveries and the people who make it all possible." center />
      </Reveal>

      <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {galleryImages.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
            className={cn(
              'group relative overflow-hidden rounded-3xl',
              g.span === 'tall' && 'aspect-[3/4]',
              g.span === 'wide' && 'aspect-[4/3]',
              g.span === 'normal' && 'aspect-square'
            )}
          >
            <img src={g.src} alt={g.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="absolute bottom-3 left-3 translate-y-2 text-sm font-heading font-semibold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{g.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

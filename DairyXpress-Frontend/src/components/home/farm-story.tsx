import { motion } from 'framer-motion';
import { farmStory } from '@/data/catalog';
import { IMAGES } from '@/data/images';
import { Reveal, Ripple, SectionHeading } from '@/components/ui/primitives';
import { Link } from 'react-router-dom';

export function FarmStory() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="absolute inset-0 bg-hero-grain opacity-20" />
      <motion.img
        src={IMAGES.farm.cow3}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full object-cover opacity-20 blur-sm"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Our story" title="From our farm to your home" subtitle="Five steps, one promise: freshness you can trace." />
        </Reveal>

        {/* Timeline */}
        <div className="mt-16 grid gap-6 md:grid-cols-5">
          {farmStory.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-4xl">
                <img src={s.image} alt={s.title} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full glass-dark font-display text-sm font-bold text-accent">{s.step}</div>
                <div className="absolute inset-x-3 bottom-3">
                  <h3 className="font-heading text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{s.text}</p>
                </div>
              </div>
              {i < farmStory.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-accent/40 md:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Farmer portraits */}
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-col items-center gap-6 rounded-5xl glass-dark p-8 md:flex-row md:justify-between">
            <div className="flex -space-x-4">
              {[IMAGES.people.farmer1, IMAGES.people.farmer2, IMAGES.people.farmer3].map((src, i) => (
                <img key={i} src={src} alt="Farmer" className="h-14 w-14 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <p className="max-w-md text-center text-sm text-white/80 md:text-left">
              "We've been with DairyXpress since day one. They pay fair, collect on time, and treat our cows like family." — Ramesh, partner farmer
            </p>
            <Link to="/farm"><Ripple variant="accent">Meet the farmers</Ripple></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

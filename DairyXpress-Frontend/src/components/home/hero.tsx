import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Leaf, Milk, Star, Truck } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { Counter, Ripple } from '@/components/ui/primitives';

const slides = [
  { img: IMAGES.hero.farm, label: 'Free-grazing farms' },
  { img: IMAGES.hero.milkPour, label: 'Fresh every morning' },
  { img: IMAGES.hero.churn, label: 'Slow-churned goodness' },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Happy Customers' },
  { value: 100, suffix: '%', label: 'Organic' },
  { value: 30, suffix: ' min', label: 'Delivery' },
  { value: 4.9, suffix: '★', label: 'Rating', float: true },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Backgrounds */}
      {slides.map((s, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1.05 : 1.15 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img src={s.img} alt={s.label} className="h-full w-full object-cover" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink/55" />
      <div className="absolute inset-0 bg-hero-grain" />

      {/* Floating milk splash */}
      <motion.div style={{ y }} className="pointer-events-none absolute -right-10 top-1/4 hidden lg:block">
        <motion.img
          src={IMAGES.splash}
          alt=""
          aria-hidden
          className="h-72 w-72 rounded-full object-cover opacity-90 shadow-float"
          animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-24 pb-16 md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <div className="glass-green mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white">
            <Leaf className="h-4 w-4 text-accent" /> Farm to Home · Est. 2026
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            Fresh Dairy Delivered <span className="text-gradient-accent">Every Morning</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
            Farm fresh milk, paneer, butter, ghee, cheese & more — delivered directly from local farms to your doorstep in 30 minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products"><Ripple variant="accent" className="px-7 py-3.5">Shop Now <ArrowRight className="h-4 w-4" /></Ripple></Link>
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-heading font-semibold text-white backdrop-blur transition hover:bg-white/20">Explore Products</Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass rounded-3xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                  {s.float ? s.value : <Counter value={s.value} />}
                  {s.suffix}
                </p>
                <p className="mt-1 text-xs font-medium text-ink-600">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* slide indicators */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-accent' : 'w-2 bg-white/50'}`} />
        ))}
      </div>

      {/* trust strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-white/10 bg-ink/30 backdrop-blur md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-8 py-3 text-xs text-white/70">
          <span className="flex items-center gap-2"><Milk className="h-4 w-4 text-accent" /> Glass-bottle delivery</span>
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> 30-min doorstep delivery</span>
          <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-accent" /> 100% organic & hormone-free</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" /> 4.9★ from 12,000+ reviews</span>
        </div>
      </div>
    </section>
  );
}

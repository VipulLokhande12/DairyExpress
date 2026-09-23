import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { Reveal, Ripple } from '@/components/ui/primitives';

export function SpecialOffers() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Big banner */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-5xl bg-green-gradient p-8 text-white shadow-card md:p-12">
            <div className="absolute inset-0 bg-hero-grain opacity-40" />
            <motion.img
              src={IMAGES.products.ghee}
              alt="Bilona Ghee"
              className="absolute -right-8 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full object-cover opacity-90 shadow-float"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <div className="relative max-w-sm">
              <span className="chip bg-accent/30 text-white"><Sparkles className="h-3 w-3" /> Limited time</span>
              <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">Bilona Ghee,<br />20% off this week</h3>
              <p className="mt-3 text-sm text-white/80">Hand-churned, slow-cooked, golden pure. Stock up while it lasts.</p>
              <Link to="/products?category=ghee" className="mt-6 inline-block">
                <Ripple variant="accent">Grab the deal <ArrowRight className="h-4 w-4" /></Ripple>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Stack */}
        <div className="grid gap-5">
          <Reveal delay={0.1}>
            <div className="group relative overflow-hidden rounded-5xl bg-accent-gradient p-8 text-ink shadow-card">
              <div className="absolute inset-0 bg-hero-grain opacity-30" />
              <img src={IMAGES.products.paneer} alt="Paneer" className="absolute -right-4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-3xl object-cover opacity-90 shadow-float transition-transform duration-500 group-hover:scale-110" />
              <div className="relative max-w-xs">
                <span className="chip bg-ink/10 text-ink">Fresh batch</span>
                <h3 className="mt-3 font-display text-2xl font-bold">Paneer at ₹99</h3>
                <p className="mt-1 text-sm text-ink/70">Hand-pressed, soft and creamy. Today only.</p>
                <Link to="/products?category=paneer" className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-ink transition hover:gap-2.5">Order now <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="group relative overflow-hidden rounded-5xl glass-green p-8 shadow-card">
              <img src={IMAGES.products.yogurt} alt="Yogurt" className="absolute -right-4 top-1/2 h-28 w-28 -translate-y-1/2 rounded-3xl object-cover opacity-90 shadow-soft transition-transform duration-500 group-hover:scale-110" />
              <div className="relative max-w-xs">
                <span className="chip bg-primary/15 text-primary">Subscribe & save</span>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">Daily milk plan</h3>
                <p className="mt-1 text-sm text-ink-600">From ₹73/day. Pause anytime, free bottles.</p>
                <Link to="/subscriptions" className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-primary transition hover:gap-2.5">Start subscription <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { Reveal } from '@/components/ui/primitives';

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-5xl bg-green-gradient p-8 text-white shadow-float md:p-16">
          <div className="absolute inset-0 bg-hero-grain opacity-40" />
          <motion.img
            src={IMAGES.products.milkBottle}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 hidden h-72 w-72 rounded-full object-cover opacity-30 lg:block"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
          <div className="relative max-w-xl">
            <span className="chip bg-white/20 text-white"><Mail className="h-3 w-3" /> Newsletter</span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Get a free glass bottle on your first order</h2>
            <p className="mt-3 text-white/80">Join 50,000+ households. Seasonal recipes, restock alerts and subscriber-only deals — once a week, no spam.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <input type="email" placeholder="Enter your email" aria-label="Email" className="w-full rounded-full border border-white/20 bg-white/10 py-3.5 pl-12 pr-4 text-white placeholder:text-white/50 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 font-heading font-bold text-ink shadow-card transition hover:shadow-glow-accent">
                Subscribe <Send className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

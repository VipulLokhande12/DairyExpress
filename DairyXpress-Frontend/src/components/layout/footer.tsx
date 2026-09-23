import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, Facebook, Instagram, Leaf, Linkedin, Mail, MapPin, Milk, Phone, Twitter, Youtube } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { categories } from '@/data/catalog';
import { Ripple } from '@/components/ui/primitives';

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubscribed(true); event.currentTarget.reset(); };
  const openChat = () => window.dispatchEvent(new CustomEvent('dairyxpress:open-chat'));
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white/80">
      <div className="absolute inset-0 bg-hero-grain opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8">
        {/* Newsletter strip */}
        <div className="glass-dark mb-16 flex flex-col items-center gap-6 rounded-5xl p-8 text-center md:flex-row md:justify-between md:p-12 md:text-left">
          <div className="max-w-md">
            <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">Stay close to the farm</h3>
            <p className="mt-2 text-sm text-white/70">Get seasonal recipes, restock alerts and subscriber-only offers in your inbox.</p>
          </div>
          <form className="flex w-full max-w-md gap-2" onSubmit={subscribe}>
            <input type="email" placeholder="you@email.com" aria-label="Email" className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white placeholder:text-white/50 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
            <Ripple variant="accent">Subscribe</Ripple>
          </form>
          {subscribed && <p className="text-sm font-semibold text-accent">Subscribed successfully!</p>}
        </div>

        {/* Columns */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-gradient">
                <Milk className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-xl font-bold text-white">Dairy<span className="text-gradient-accent">Xpress</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Farm-to-home dairy, delivered fresh in 30 minutes. We partner with local, ethical farms to bring you milk, paneer, ghee and more — untouched by middlemen.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href={['https://instagram.com','https://facebook.com','https://twitter.com','https://youtube.com','https://linkedin.com'][i]} target="_blank" rel="noreferrer" aria-label="Social" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-ink">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}><Link to={`/products?category=${c.slug}`} className="text-white/60 transition hover:text-accent">{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">Support</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><button onClick={openChat} className="text-white/60 transition hover:text-accent">Help Center</button></li>
              <li><Link to="/profile?tab=orders" className="text-white/60 transition hover:text-accent">Track Order</Link></li>
              <li><button onClick={openChat} className="text-white/60 transition hover:text-accent">Returns & Refunds</button></li>
              <li><a href="mailto:support@dairyxpress.farm" className="text-white/60 transition hover:text-accent">Contact Us</a></li>
              <li><button onClick={openChat} className="text-white/60 transition hover:text-accent">FAQs</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">Reach us</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Anand+Nagar+Metro+Station+Pune" className="flex items-start gap-2 hover:text-accent"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Near Anand Nagar Metro Station, Pune 411051</a></li>
              <li><a href="tel:+9118001234567" className="flex items-center gap-2 hover:text-accent"><Phone className="h-4 w-4 shrink-0 text-accent" /> +91 1800 123 4567</a></li>
              <li><a href="mailto:support@dairyxpress.farm" className="flex items-center gap-2 hover:text-accent"><Mail className="h-4 w-4 shrink-0 text-accent" /> support@dairyxpress.farm</a></li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a href="#" aria-label="App Store" className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20"><Apple className="h-4 w-4" /> App Store</a>
              <a href="#" aria-label="Play Store" className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20"><Leaf className="h-4 w-4" /> Play Store</a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-4xl border border-white/10">
          <img src={IMAGES.farm.cow2} alt="Our farm" className="h-44 w-full object-cover opacity-60" loading="lazy" />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} DairyXpress. Farm to home, with love.</p>
          <div className="flex gap-5">
            <Link to="/about" className="hover:text-accent">Privacy</Link>
            <Link to="/about" className="hover:text-accent">Terms</Link>
            <Link to="/about" className="hover:text-accent">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

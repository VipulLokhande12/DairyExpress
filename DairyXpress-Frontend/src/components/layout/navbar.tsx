import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe2, Heart, LogOut, Menu, Milk, Search, ShoppingCart, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/cart-context';
import { useAuth } from '@/store/auth-context';
import { categories } from '@/data/catalog';
import { useLanguage } from '@/store/language-context';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Subscriptions', to: '/subscriptions' },
  { label: 'About', to: '/about' },
  { label: 'Admin', to: '/admin' },
];

export function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { count, state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visibleNavLinks = navLinks.filter((link) => link.to !== '/admin' || user?.role === 'ADMIN');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenSearch]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'glass shadow-soft' : 'bg-transparent')}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-gradient shadow-card">
              <Milk className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Dairy<span className="text-gradient">Xpress</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setMegaOpen(false)}>
            {visibleNavLinks.map((l) => (
              <div key={l.to} className="relative" onMouseEnter={() => setMegaOpen(l.label === 'Shop')}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => cn(
                    'group relative rounded-full px-4 py-2 font-heading text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-ink-600 hover:text-primary'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {l.label === 'Shop' && <ChevronDown className="ml-1 inline h-3 w-3" />}
                      {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
                    </>
                  )}
                </NavLink>
              </div>
            ))}

            {/* Mega menu */}
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                >
                  <div className="glass grid w-[640px] grid-cols-3 gap-2 rounded-3xl p-4 shadow-float">
                    {categories.map((c) => (
                      <Link key={c.id} to={`/products?category=${c.slug}`} className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-white/60">
                        <img src={c.image} alt={c.name} className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-heading text-sm font-semibold text-ink">{c.name}</p>
                          <p className="text-xs text-ink-500">{c.count} products</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={onOpenSearch} aria-label="Search" className="hidden items-center gap-2 rounded-full border border-cream-400 bg-white/70 px-3 py-2 text-sm text-ink-400 transition hover:border-primary/40 hover:text-primary md:flex">
              <Search className="h-4 w-4" />
              <span>Search…</span>
              <kbd className="ml-2 rounded-md bg-cream-300 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">⌘K</kbd>
            </button>
            <button onClick={onOpenSearch} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-primary/10 hover:text-primary md:hidden">
              <Search className="h-5 w-5" />
            </button>

            <div className="flex items-center rounded-full border border-primary/15 bg-white p-1 shadow-sm" role="group" aria-label="Choose language"><Globe2 className="mx-1 h-4 w-4 text-primary"/><button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={cn('rounded-full px-2.5 py-1.5 text-xs font-bold transition', language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-ink-500 hover:bg-primary/10')}>EN</button><button type="button" onClick={() => setLanguage('mr')} aria-pressed={language === 'mr'} className={cn('rounded-full px-2.5 py-1.5 text-xs font-bold transition', language === 'mr' ? 'bg-primary text-white shadow-sm' : 'text-ink-500 hover:bg-primary/10')}>मराठी</button></div>

            <Link to="/notifications" aria-label="Notifications" title="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-primary/10 hover:text-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </Link>

            <Link to="/profile?tab=wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-primary/10 hover:text-primary">
              <Heart className="h-5 w-5" />
              {state.wishlist.length > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-error px-1 text-[10px] font-bold text-white">{state.wishlist.length}</span>}
            </Link>

            <Link to="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-primary/10 hover:text-primary">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {count}
                </motion.span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative hidden sm:block">
              <button onClick={() => setProfileOpen((o) => !o)} aria-label="Profile" className="grid h-10 w-10 place-items-center rounded-full bg-green-gradient text-white shadow-soft transition hover:shadow-card">
                <User className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl p-2 shadow-float">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-ink-600 transition hover:bg-primary/10 hover:text-primary">My Dashboard</Link>
                    <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-ink-600 transition hover:bg-primary/10 hover:text-primary">My Orders</Link>
                    <Link to="/profile?tab=subscriptions" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-ink-600 transition hover:bg-primary/10 hover:text-primary">Subscriptions</Link>
                    <Link to="/profile?tab=addresses" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-ink-600 transition hover:bg-primary/10 hover:text-primary">Addresses</Link>
                    <div className="my-1 h-px bg-cream-400" />
                    <button onClick={() => { setProfileOpen(false); logout(); navigate('/auth'); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-error transition hover:bg-error/10"><LogOut className="h-4 w-4" /> Sign out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-primary/10 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-cream p-6 shadow-float"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-ink">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-cream-300"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                {visibleNavLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn('rounded-2xl px-4 py-3 font-heading font-medium', isActive ? 'bg-primary/10 text-primary' : 'text-ink-600 hover:bg-cream-300')}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-6">
                <p className="px-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Categories</p>
                <div className="mt-2 flex flex-col gap-1">
                  {categories.map((c) => (
                    <Link key={c.id} to={`/products?category=${c.slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-cream-300">
                      <img src={c.image} alt={c.name} className="h-9 w-9 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-ink">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

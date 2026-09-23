import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock3, Headphones, MapPin, PackageCheck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Counter, Reveal, SectionHeading } from '@/components/ui/primitives';
import { api } from '@/services/api';
import { products as catalogProducts, categories as catalogCategories } from '@/data/catalog';

const capabilities = [
  { icon: ShoppingBag, title: 'Complete dairy marketplace', text: 'Browse 25+ milk, paneer, cheese, butter, ghee, curd and yogurt products in one responsive shopping experience.' },
  { icon: Clock3, title: 'Fast local fulfilment', text: 'Orders are prepared at our Anand Nagar Metro Station store in Pune and routed to each customer’s saved delivery address.' },
  { icon: PackageCheck, title: 'Live order tracking', text: 'Customers can follow preparation, packing, dispatch and delivery progress from their profile.' },
  { icon: Headphones, title: 'Support built in', text: 'Ask Moo provides chat help, tap-to-call, email support and persistent support tickets with reference numbers.' },
  { icon: ShieldCheck, title: 'Secure customer accounts', text: 'Protected customer and administrator areas keep orders, addresses, subscriptions, reviews and inventory organized.' },
  { icon: MapPin, title: 'Pune-first service', text: 'DairyXpress is designed around quick neighbourhood delivery from Anand Nagar, with a clear route from store to doorstep.' },
];

export function FarmPage() {
  const catalogDeliveryMins = Math.min(...catalogProducts.map((product) => product.deliveryMins).filter((minutes) => minutes > 0));
  const [stats, setStats] = useState({
    products: catalogProducts.length,
    categories: catalogCategories.length,
    deliveryMins: Number.isFinite(catalogDeliveryMins) ? catalogDeliveryMins : 30,
    supportChannels: 4,
  });
  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()]).then(([products, categories]) => {
      const deliveryOptions = products.map((product) => product.deliveryMins).filter((minutes) => minutes > 0);
      const deliveryMins = deliveryOptions.length ? Math.min(...deliveryOptions) : 30;
      setStats({
        products: products.length || catalogProducts.length,
        categories: categories.length || catalogCategories.length,
        deliveryMins,
        supportChannels: 4,
      });
    }).catch(() => {});
  }, []);
  return <div className="pt-24">
    <section className="mx-auto max-w-7xl px-4 md:px-8"><div className="relative overflow-hidden rounded-5xl bg-green-gradient p-10 text-white shadow-float md:p-16"><div className="absolute inset-0 bg-hero-grain opacity-30"/><div className="relative max-w-3xl"><span className="chip bg-white/15 text-white">About DairyXpress</span><h1 className="mt-5 font-display text-4xl font-bold md:text-6xl">Fresh dairy shopping, delivery and support in one project</h1><p className="mt-5 max-w-2xl text-lg text-white/80">DairyXpress is a full-stack e-commerce platform created to make ordering everyday dairy products simple—from discovering products and checking out to tracking delivery and getting help.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/products" className="rounded-full bg-white px-6 py-3 font-semibold text-primary">Explore products</Link><Link to="/subscriptions" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white">View subscriptions</Link></div></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[{v:stats.products,s:'+',l:'Dairy products'},{v:stats.categories,s:'',l:'Product categories'},{v:stats.deliveryMins,s:' min',l:'Target delivery'},{v:stats.supportChannels,s:'',l:'Support channels'}].map((item)=><div key={item.l} className="rounded-4xl bg-white p-6 text-center shadow-card"><p className="font-display text-3xl font-bold text-gradient"><Counter value={item.v}/>{item.s}</p><p className="mt-1 text-sm text-ink-500">{item.l}</p></div>)}</div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8"><Reveal><SectionHeading eyebrow="What the project does" title="Designed around the complete customer journey" subtitle="Every major part of buying dairy is connected through a single clear experience."/></Reveal><div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{capabilities.map((item,index)=><motion.article key={item.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.06}} className="rounded-4xl bg-white p-6 shadow-card"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><item.icon className="h-6 w-6"/></div><h2 className="mt-4 font-heading text-lg font-bold text-ink">{item.title}</h2><p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p></motion.article>)}</div></section>
    <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8"><div className="rounded-5xl bg-cream-200 p-10"><h2 className="font-display text-3xl font-bold text-ink">Built for customers and store administrators</h2><p className="mx-auto mt-3 max-w-2xl text-ink-600">Customers get search, filters, subscriptions, reviews, checkout and tracking. Administrators get product creation, pricing, stock control, deletion and business summaries.</p></div></section>
  </div>;
}

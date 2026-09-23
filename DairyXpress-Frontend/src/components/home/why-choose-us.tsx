import { motion } from 'framer-motion';
import { Leaf, Lock, MapPin, Milk, ShieldCheck, Truck } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/ui/primitives';

const features = [
  { icon: Milk, title: 'Farm Fresh', text: 'Milched at dawn, delivered by noon — never more than a few hours old.' },
  { icon: Leaf, title: 'No Preservatives', text: 'Zero additives, zero hormones. Just milk, the way nature intended.' },
  { icon: Truck, title: 'Same Day Delivery', text: 'Order now and it reaches your door in 30 minutes, cold-chain intact.' },
  { icon: ShieldCheck, title: '100% Organic', text: 'Certified organic farms, free-grazing cows, audited every season.' },
  { icon: Lock, title: 'Secure Payment', text: 'Bank-grade encryption with UPI, cards, wallets and COD options.' },
  { icon: MapPin, title: 'Trusted Farmers', text: 'We know every farmer by name. Full traceability from farm to bottle.' },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Why DairyXpress" title="A standard you can taste" subtitle="Six promises that make every delivery feel like a gift from the farm." center />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-4xl bg-white p-7 shadow-card transition-shadow hover:shadow-float"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-gradient text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Milk, Pause, Play, X } from 'lucide-react';
import { api } from '@/services/api';
import type { SubscriptionDto } from '@/services/api';
import { IMAGES } from '@/data/images';
import { Reveal, Ripple, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

const plans = [
  { id: 'daily', name: 'Daily', price: 89, perDay: 89, period: 'per day', popular: false, savings: '10%', benefits: ['1L A2 milk every morning', 'Skip or pause anytime', 'Free glass bottle', 'Priority delivery slot'] },
  { id: 'weekly', name: 'Weekly', price: 549, perDay: 78, period: 'per week', popular: true, savings: '15%', benefits: ['7L A2 milk, your schedule', 'Mix milk + paneer + curd', 'Free glass bottles', 'Dedicated delivery agent', 'Pause anytime'] },
  { id: 'monthly', name: 'Monthly', price: 2199, perDay: 73, period: 'per month', popular: false, savings: '20%', benefits: ['30L milk, fully flexible', 'Add ghee, butter, cheese', 'Free farm visit for family', 'Loyalty rewards 2x', 'Priority support'] },
];

export function SubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionDto[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubs = () => {
    api.getSubscriptions().then(setSubs).catch(() => setSubs([]));
  };

  useEffect(() => { fetchSubs(); }, []);

  const subscribe = async (plan: typeof plans[number]) => {
    setSelected(plan.id);
    setLoading(true);
    try {
      await api.createSubscription({
        planName: plan.name,
        frequency: plan.period,
        detail: plan.benefits.join(', '),
        price: plan.price,
      });
      fetchSubs();
      setSelected(null);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: number) => {
    await api.cancelSubscription(id);
    fetchSubs();
  };
  const toggleStatus = async (sub: SubscriptionDto) => {
    await api.updateSubscriptionStatus(sub.id, sub.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
    fetchSubs();
  };

  return (
    <div className="pt-24">
      {/* Hero strip */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-cream-200 p-8 md:p-12">
            <motion.img src={IMAGES.hero.milkPour} alt="" aria-hidden className="absolute -right-8 top-0 h-full w-1/2 rounded-5xl object-cover opacity-90" animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity }} />
            <div className="relative max-w-lg">
              <span className="chip bg-primary/10 text-primary"><Milk className="h-3 w-3" /> Subscriptions</span>
              <h1 className="mt-4 font-display text-4xl font-bold text-ink md:text-5xl">Fresh milk, on repeat</h1>
              <p className="mt-3 text-ink-600">Set it once and forget it. We deliver your chosen dairy on schedule — pause, skip or swap products anytime, with zero lock-in.</p>
              <ul className="mt-5 space-y-2">
                {['Save up to 20% vs one-off orders', 'Free reusable glass bottles', 'Dedicated delivery agent', 'Pause or skip anytime'].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-ink-600"><Check className="h-4 w-4 text-success" /> {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Active subscriptions */}
      {subs && subs.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
          <Reveal>
            <h2 className="font-heading text-xl font-bold text-ink">Your active subscriptions</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subs.map((s) => (
                <div key={s.id} className="rounded-4xl bg-white p-5 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className={cn('chip', s.status === 'ACTIVE' ? 'bg-success/10 text-success' : s.status === 'PAUSED' ? 'bg-warning/10 text-warning' : 'bg-cream-300 text-ink-500')}><span className="h-1.5 w-1.5 rounded-full bg-current" /> {s.status}</span>
                    <button onClick={() => cancel(s.id)} className="text-error hover:underline"><X className="h-4 w-4" /></button>
                  </div>
                  <p className="mt-3 font-display text-xl font-bold text-ink">{s.planName}</p>
                  <p className="text-sm text-ink-500">{s.frequency}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-primary">₹{s.price}</p>
                  {s.status !== 'CANCELLED' && <button onClick={() => toggleStatus(s)} className="btn-ghost mt-4 flex w-full items-center justify-center gap-2 text-sm">{s.status === 'ACTIVE' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{s.status === 'ACTIVE' ? 'Pause subscription' : 'Resume subscription'}</button>}
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Plans */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Plans" title="Choose your milk plan" subtitle="Flexible subscriptions that save you money. Cancel or pause anytime — no lock-in." center />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn('relative rounded-5xl bg-white p-8 shadow-card transition hover:shadow-float', p.popular && 'ring-2 ring-primary')}
            >
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-green-gradient text-white shadow-float">Most popular</span>}
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-ink-400">{p.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-ink">₹{p.price}</span>
                <span className="text-sm text-ink-500">{p.period}</span>
              </div>
              <p className="mt-1 text-sm text-success font-medium">Save {p.savings}</p>
              <ul className="mt-5 space-y-2.5">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-ink-600"><Check className="h-4 w-4 shrink-0 text-success" /> {b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Ripple onClick={() => subscribe(p)} className="w-full" variant={p.popular ? 'primary' : 'ghost'}>
                  {loading && selected === p.id ? 'Subscribing...' : 'Start subscription'}
                </Ripple>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ strip */}
      <section className="mx-auto max-w-3xl px-4 pb-12 md:px-8">
        <div className="rounded-4xl bg-white p-8 text-center shadow-card">
          <h2 className="font-heading text-xl font-bold text-ink">Questions?</h2>
          <p className="mt-2 text-ink-500">You can pause, skip or cancel your subscription anytime from your dashboard — no calls, no fees. Switch products or change your delivery slot in two taps.</p>
        </div>
      </section>
    </div>
  );
}

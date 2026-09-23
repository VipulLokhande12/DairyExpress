import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Sparkles } from 'lucide-react';
import { subscriptionPlans } from '@/data/catalog';
import { Reveal, Ripple, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';

export function Subscription() {
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const choosePlan = async (plan: typeof subscriptionPlans[number]) => {
    if (subscribing) return;
    setSubscribing(plan.id);
    setMessage('');
    try {
      await api.createSubscription({ planName: plan.name, frequency: plan.period, detail: plan.benefits.join(', '), price: plan.price });
      setMessage(`${plan.name} subscription activated successfully.`);
      window.setTimeout(() => navigate('/profile?tab=subscriptions'), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start the subscription. Please try again.');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <Reveal>
        <SectionHeading eyebrow="Never run out" title="Milk subscription plans" subtitle="Fresh milk on autopilot. Pause, skip or swap products anytime — no lock-in." center />
      </Reveal>
      {message && <p role="status" className={cn('mx-auto mt-5 max-w-xl rounded-2xl px-4 py-3 text-center text-sm font-semibold', message.includes('successfully') ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>{message}</p>}

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {subscriptionPlans.map((plan, i) => {
          const isPopular = plan.popular;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={cn(
                'relative overflow-hidden rounded-5xl p-8 shadow-card transition-shadow hover:shadow-float',
                isPopular ? 'bg-green-gradient text-white' : 'bg-white text-ink'
              )}
            >
              {isPopular && (
                <div className="absolute right-5 top-5 chip bg-accent text-ink shadow-soft">
                  <Crown className="h-3 w-3" /> Popular
                </div>
              )}
              <div className={cn('grid h-14 w-14 place-items-center rounded-2xl', isPopular ? 'bg-white/20' : 'bg-primary/10')}>
                <Sparkles className={cn('h-7 w-7', isPopular ? 'text-accent' : 'text-primary')} />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">{plan.name}</h3>
              <p className={cn('text-sm', isPopular ? 'text-white/70' : 'text-ink-500')}>{plan.period}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">₹{plan.price}</span>
                <span className={cn('text-sm', isPopular ? 'text-white/70' : 'text-ink-500')}>/{plan.period.replace('per ', '')}</span>
              </div>
              <div className={cn('mt-1 inline-flex items-center gap-1 text-sm font-semibold', isPopular ? 'text-accent' : 'text-success')}>
                <Check className="h-4 w-4" /> Save {plan.savings}
              </div>
              <p className={cn('mt-1 text-xs', isPopular ? 'text-white/60' : 'text-ink-400')}>≈ ₹{plan.perDay}/day</p>

              <ul className="mt-6 space-y-3">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full', isPopular ? 'bg-white/20' : 'bg-success/10')}>
                      <Check className={cn('h-3 w-3', isPopular ? 'text-accent' : 'text-success')} />
                    </span>
                    <span className={isPopular ? 'text-white/90' : 'text-ink-600'}>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Ripple onClick={() => void choosePlan(plan)} variant={isPopular ? 'accent' : 'primary'} className={cn('w-full', subscribing && 'pointer-events-none opacity-60')}>{subscribing === plan.id ? 'Activating...' : `Choose ${plan.name}`}</Ripple>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

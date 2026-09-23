import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CreditCard, MapPin, Navigation, PackageCheck, Timer, Truck } from 'lucide-react';
import type { OrderDto } from '@/services/api';
import { DeliveryTimeline } from './DeliveryTimeline';
import { DriverCard } from './DriverCard';
import { MapView } from './MapView';

const estimateFor = (status: string) => {
  if (status === 'DELIVERED') return { label: 'Delivered', distance: '0 KM away' };
  if (status === 'OUT_FOR_DELIVERY') return { label: '18 minutes', distance: '2.3 KM away' };
  if (status === 'PACKED') return { label: '25–35 minutes', distance: 'Preparing dispatch' };
  return { label: '35–45 minutes', distance: 'Freshly preparing' };
};

export function OrderTracking({ order }: { order: OrderDto }) {
  const [open, setOpen] = useState(false);
  const estimate = estimateFor(order.status);

  return (
    <section className="overflow-hidden rounded-4xl bg-white shadow-card transition hover:shadow-float">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><PackageCheck className="h-5 w-5" /></div>
        <div>
          <p className="font-heading font-bold text-ink">Order #{order.orderId}</p>
          <p className="text-xs text-ink-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length === 1 ? '' : 's'}</p>
        </div>
        <span className="chip ml-auto bg-success/10 text-success">{order.status.replace(/_/g, ' ')}</span>
        <p className="font-display text-lg font-bold text-ink">₹{order.total}</p>
        <button type="button" onClick={() => setOpen((value) => !value)} className="btn-ghost px-4 py-2 text-sm"><Navigation className="h-4 w-4" />Track order<ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} /></button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="overflow-hidden border-t border-cream-300">
            <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-heading text-lg font-bold text-ink">Your delivery route</p><p className="mt-1 text-sm text-ink-500">Track the journey to your saved address.</p></div>
                  <div className="rounded-2xl bg-primary/10 px-3 py-2 text-right"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Estimated arrival</p><p className="mt-0.5 font-heading text-lg font-bold text-ink">{estimate.label}</p></div>
                </div>
                <MapView latitude={order.deliveryLatitude} longitude={order.deliveryLongitude} status={order.status} address={order.address} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cream-300 bg-cream-100/70 p-4"><Timer className="h-5 w-5 text-primary" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Distance</p><p className="mt-1 font-heading font-bold text-ink">{estimate.distance}</p></div>
                  <div className="rounded-2xl border border-cream-300 bg-cream-100/70 p-4"><MapPin className="h-5 w-5 text-primary" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Delivery address</p><p className="mt-1 line-clamp-2 text-sm font-medium text-ink">{order.address}</p></div>
                </div>
              </div>

              <aside className="space-y-5 rounded-3xl bg-cream-100/70 p-4 sm:p-5">
                <div><p className="font-heading text-lg font-bold text-ink">Delivery timeline</p><p className="mt-1 text-sm text-ink-500">Updates animate as your order progresses.</p></div>
                <DeliveryTimeline status={order.status} />
                <DriverCard />
                <div className="rounded-3xl border border-cream-300 bg-white p-4">
                  <div className="flex items-center justify-between"><p className="font-heading font-bold text-ink">Order summary</p><p className="font-heading font-bold text-ink">₹{order.total}</p></div>
                  <div className="mt-3 space-y-2 border-t border-cream-200 pt-3">
                    {order.items.map((item) => <div key={`${item.productName}-${item.qty}`} className="flex items-start justify-between gap-3 text-sm"><span className="text-ink-600">{item.productName} × {item.qty}</span><span className="font-medium text-ink">₹{item.subtotal}</span></div>)}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-cream-200 pt-3 text-xs text-ink-500"><CreditCard className="h-3.5 w-3.5 text-primary" />{order.paymentMethod}</div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs text-primary"><Truck className="h-4 w-4 shrink-0" />Route and driver pin are estimates until your rider shares live GPS.</div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

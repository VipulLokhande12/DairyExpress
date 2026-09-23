import { motion } from 'framer-motion';
import { Check, Circle, PackageCheck, ShoppingBag, Truck } from 'lucide-react';

const stages = [
  { key: 'PLACED', label: 'Order placed', icon: ShoppingBag },
  { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { key: 'PREPARING', label: 'Preparing fresh', icon: PackageCheck },
  { key: 'PACKED', label: 'Packed', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Check },
];

const currentIndex = (status: string) => {
  const index = stages.findIndex((stage) => stage.key === status);
  return index < 2 ? 2 : index;
};

export function DeliveryTimeline({ status }: { status: string }) {
  const activeIndex = currentIndex(status);

  return (
    <ol className="space-y-0" aria-label="Delivery status">
      {stages.map((stage, index) => {
        const complete = index < activeIndex;
        const active = index === activeIndex;
        const Icon = complete ? Check : active ? stage.icon : Circle;
        return (
          <li key={stage.key} className="relative flex gap-3 pb-5 last:pb-0">
            {index < stages.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 ${complete ? 'bg-primary' : 'bg-cream-300'}`} />}
            <motion.span initial={false} animate={{ scale: active ? [1, 1.12, 1] : 1 }} transition={{ duration: 0.45 }} className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ${complete || active ? 'bg-primary text-white shadow-card' : 'bg-cream-300 text-ink-400'}`}>
              <Icon className="h-3.5 w-3.5" />
            </motion.span>
            <div className="pt-1">
              <p className={`text-sm font-semibold ${complete || active ? 'text-ink' : 'text-ink-400'}`}>{stage.label}</p>
              {active && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-0.5 text-xs text-primary">Current order status</motion.p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

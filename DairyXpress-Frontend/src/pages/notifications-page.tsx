import { useEffect, useState } from 'react';
import { Award, Bell, Package, Truck } from 'lucide-react';
import { api, type OrderDto, type SubscriptionDto } from '@/services/api';
import { useAuth } from '@/store/auth-context';

export function NotificationsPage() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([]);
  useEffect(() => {
    Promise.all([api.getOrders(), api.getSubscriptions(), refreshUser()])
      .then(([orderData, subscriptionData]) => { setOrders(orderData); setSubscriptions(subscriptionData); })
      .catch(() => {});
  }, []);
  const notices = [
    ...orders.map((order) => ({ id: `order-${order.id}`, icon: Package, title: `Order ${order.orderId}`, detail: `Your order is ${order.status.toLowerCase()}.`, date: order.createdAt })),
    ...subscriptions.map((sub) => ({ id: `sub-${sub.id}`, icon: Truck, title: sub.planName, detail: `Subscription status: ${sub.status.toLowerCase()}.`, date: '' })),
    ...(user?.rewardPoints ? [{ id: 'rewards', icon: Award, title: 'Rewards available', detail: `You have ${user.rewardPoints} reward points to use.`, date: '' }] : []),
  ];
  return <div className="mx-auto min-h-[70vh] max-w-4xl px-4 pb-16 pt-28 md:px-8">
    <div className="rounded-4xl bg-white p-6 shadow-card md:p-8">
      <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Bell /></span><div><h1 className="font-display text-3xl font-bold text-ink">Notifications</h1><p className="text-sm text-ink-500">Updates from your orders, subscriptions and rewards.</p></div></div>
      <div className="mt-7 space-y-3">{notices.length ? notices.map((notice) => <article key={notice.id} className="flex gap-4 rounded-3xl bg-cream-100 p-4"><notice.icon className="mt-1 h-5 w-5 shrink-0 text-primary"/><div><h2 className="font-heading font-semibold text-ink">{notice.title}</h2><p className="text-sm text-ink-500">{notice.detail}</p>{notice.date && <time className="mt-1 block text-xs text-ink-400">{new Date(notice.date).toLocaleString()}</time>}</div></article>) : <div className="py-14 text-center text-ink-500"><Bell className="mx-auto mb-3 h-10 w-10 text-primary/30"/>You have no notifications yet.</div>}</div>
    </div>
  </div>;
}

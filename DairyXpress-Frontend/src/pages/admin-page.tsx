import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { api } from '@/services/api';
import type { OrderDto, Product } from '@/services/api';
import { Counter, Reveal, Skeleton } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { InventoryManager } from '@/components/admin/inventory-manager';
import { products as catalogProducts } from '@/data/catalog';

type Stats = {
  revenueMtd: number; ordersMtd: number; newCustomers: number; avgOrderValue: number; totalProducts: number; lowStockCount: number;
};

export function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<OrderDto[] | null>(null);
  const [lowStock, setLowStock] = useState<Product[] | null>(null);
  const [inventoryProducts, setInventoryProducts] = useState<Product[]>(catalogProducts);
  const [restockingId, setRestockingId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const refreshDashboard = async () => {
      const [statsResult, ordersResult, stockResult, productsResult] = await Promise.allSettled([
        api.getAdminStats(), api.getRecentOrders(), api.getLowStockProducts(), api.getAdminProducts().catch(() => api.getProducts()),
      ]);
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value);
      if (stockResult.status === 'fulfilled') setLowStock(stockResult.value);
      if (productsResult.status === 'fulfilled') setInventoryProducts(productsResult.value);
      setLoadError(statsResult.status === 'rejected' || ordersResult.status === 'rejected'
        ? 'Admin data could not be refreshed. Sign in with an ADMIN account and confirm the backend is running on port 8080.' : '');
    };
    refreshDashboard();
    const onStorage = (event: StorageEvent) => { if (event.key === 'dairyxpress-data-changed') refreshDashboard(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') refreshDashboard(); };
    window.addEventListener('dairyxpress:data-changed', refreshDashboard);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refreshDashboard);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(refreshDashboard, 10000);
    return () => {
      window.removeEventListener('dairyxpress:data-changed', refreshDashboard);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refreshDashboard);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  const kpis = stats
    ? [
        { label: 'Revenue (MTD)', value: stats.revenueMtd, prefix: '₹', delta: 12.4, up: true, icon: DollarSign, tone: 'primary' },
        { label: 'Orders (MTD)', value: stats.ordersMtd, delta: 8.1, up: true, icon: ShoppingCart, tone: 'accent' },
        { label: 'New Customers', value: stats.newCustomers, delta: 5.3, up: true, icon: Users, tone: 'success' },
        { label: 'Avg. Order Value', value: stats.avgOrderValue, prefix: '₹', delta: -2.1, up: false, icon: TrendingUp, tone: 'primary' },
      ]
    : [];

  const weeklyRevenue = [42, 58, 49, 71, 63, 88, 95];

  const restock = async (product: Product) => {
    setRestockingId(product.id);
    try {
      const updated = await api.updateStock(product.id, Math.max(product.stock + 25, 30));
      setLowStock((current) => current?.filter((item) => item.id !== updated.id) ?? []);
      setInventoryProducts((current) => current?.map((item) => item.id === updated.id ? updated : item) ?? current);
      setStats((current) => current ? { ...current, lowStockCount: Math.max(0, current.lowStockCount - 1) } : current);
    } finally {
      setRestockingId(null);
    }
  };
  const refreshInventory = () => {
    api.getAdminStats().then(setStats);
    api.getLowStockProducts().then(setLowStock);
    api.getAdminProducts().catch(() => api.getProducts()).then(setInventoryProducts);
  };

  const totalInventoryProducts = inventoryProducts.length || stats?.totalProducts || 0;
  const currentLowStockCount = inventoryProducts.filter((product) => product.stock < 10).length;
  const totalStockUnits = inventoryProducts.reduce((units, product) => units + product.stock, 0);
  const inventoryValue = inventoryProducts.reduce((value, product) => value + product.stock * product.price, 0);
  const outOfStockCount = inventoryProducts.filter((product) => product.stock === 0).length;
  const wellStockedCount = inventoryProducts.filter((product) => product.stock >= 10).length;

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {loadError && <div role="alert" className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error">{loadError}</div>}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Admin dashboard</h1>
              <p className="mt-1 text-ink-500">Welcome back, here's what's happening today.</p>
            </div>
            <span className="chip bg-success/10 text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Live · {new Date().toLocaleDateString()}</span>
          </div>
        </Reveal>

        {/* KPIs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats === null
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-4xl" />)
            : kpis.map((k, i) => (
                <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-4xl bg-white p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div className={cn('grid h-11 w-11 place-items-center rounded-2xl', k.tone === 'primary' ? 'bg-primary/10 text-primary' : k.tone === 'accent' ? 'bg-accent/20 text-accent-700' : 'bg-success/10 text-success')}>
                      <k.icon className="h-5 w-5" />
                    </div>
                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', k.up ? 'text-success' : 'text-error')}>
                      {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {Math.abs(k.delta)}%
                    </span>
                  </div>
                  <p className="mt-4 font-display text-2xl font-bold text-ink">{k.prefix}<Counter value={k.value} /></p>
                  <p className="text-sm text-ink-500">{k.label}</p>
                </motion.div>
              ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <div className="rounded-4xl bg-white p-6 shadow-card lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-ink">Revenue this week</h2>
              <span className="chip bg-primary/10 text-primary">+18% vs last week</span>
            </div>
            <div className="mt-6 flex h-48 items-end gap-3">
              {weeklyRevenue.map((v, i) => (
                <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${v}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 20 }} className="flex-1 rounded-t-2xl bg-green-gradient" />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-ink-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Low stock */}
          <div className="rounded-4xl bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-ink"><AlertTriangle className="h-5 w-5 text-error" /> Low stock alerts</h2>
            <div className="mt-4 space-y-3">
              {lowStock === null
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)
                : lowStock.length === 0
                  ? <p className="text-sm text-ink-500">All products well stocked.</p>
                  : lowStock.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">{s.name}</p>
                          <p className="text-xs font-medium text-error">{s.stock === 0 ? 'OUT OF STOCK' : `LOW STOCK · ${s.stock} units left`}</p>
                        </div>
                        <button onClick={() => restock(s)} disabled={restockingId === s.id} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{restockingId === s.id ? 'Updating…' : 'Restock +25'}</button>
                      </div>
                    ))}
            </div>
          </div>
        </div>

        {/* Recent orders + top products */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-4xl bg-white p-6 shadow-card lg:col-span-2">
            <h2 className="font-heading text-lg font-bold text-ink">Recent orders</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-ink-400">
                    <th className="pb-3">Order</th><th className="pb-3">Items</th><th className="pb-3">Total</th><th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders === null
                    ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={4}><Skeleton className="h-10 rounded-xl" /></td></tr>)
                    : orders.length === 0
                      ? <tr><td colSpan={4} className="py-6 text-center text-ink-500">No recent orders.</td></tr>
                      : orders.map((o) => (
                          <tr key={o.id} className="border-t border-cream-200">
                            <td className="py-3 font-semibold text-primary">#{o.orderId}</td>
                            <td className="py-3 text-ink-600">{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                            <td className="py-3 font-semibold text-ink">₹{o.total}</td>
                            <td className="py-3"><span className={cn('chip', o.status === 'Delivered' ? 'bg-success/10 text-success' : o.status === 'Out for delivery' ? 'bg-accent/20 text-accent-700' : 'bg-primary/10 text-primary')}>{o.status}</span></td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-ink"><Package className="h-5 w-5 text-primary" /> Inventory summary</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Total products</span>
                <span className="font-display text-xl font-bold text-ink">{totalInventoryProducts ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Low stock items</span>
                <span className="font-display text-xl font-bold text-error">{currentLowStockCount ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Total units in stock</span>
                <span className="font-display text-xl font-bold text-primary">{totalStockUnits?.toLocaleString() ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Inventory value</span>
                <span className="font-display text-lg font-bold text-ink">{inventoryValue === undefined ? '—' : `₹${Math.round(inventoryValue).toLocaleString()}`}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Out of stock</span>
                <span className="font-display text-xl font-bold text-error">{outOfStockCount ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-cream-100 p-3">
                <span className="text-sm font-medium text-ink">Well stocked</span>
                <span className="font-display text-xl font-bold text-success">{wellStockedCount ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>
        <InventoryManager onChanged={refreshInventory} />
      </div>
    </div>
  );
}

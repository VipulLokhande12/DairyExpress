import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Bell, Heart, Home, MapPin, Package, Plus, Settings, Sparkles, Truck, User as UserIcon } from 'lucide-react';
import { api, type OrderDto, type AddressDto, type SubscriptionDto, type ProfileSummaryDto } from '@/services/api';
import { useCart } from '@/store/cart-context';
import { useAuth } from '@/store/auth-context';
import { Counter } from '@/components/ui/primitives';
import { IMAGES } from '@/data/images';
import { cn } from '@/lib/utils';
import { OrderTracking } from '@/components/orders/order-tracking';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'subscriptions', label: 'Subscriptions', icon: Truck },
  { id: 'rewards', label: 'Rewards', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const emptySummary: ProfileSummaryDto = {
  totalOrders: 0,
  activeSubscriptions: 0,
  rewardPoints: 0,
  wishlistItems: 0,
  savedAddresses: 0,
  notifications: 0,
};

const dashboardSummaryKey = (userId: string | number) => `dairyxpress-dashboard-summary-${userId}`;

const readCachedSummary = (userId: string | number): ProfileSummaryDto | null => {
  try {
    const cached = window.localStorage.getItem(dashboardSummaryKey(userId));
    if (!cached) return null;
    const summary = JSON.parse(cached) as Partial<ProfileSummaryDto>;
    const values = [summary.totalOrders, summary.activeSubscriptions, summary.rewardPoints, summary.wishlistItems, summary.savedAddresses, summary.notifications];
    if (!values.every((value) => typeof value === 'number' && Number.isFinite(value))) return null;
    return summary as ProfileSummaryDto;
  } catch {
    return null;
  }
};

export function ProfilePage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'dashboard';
  const { state, toggleWishlist } = useCart();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [subs, setSubs] = useState<SubscriptionDto[]>([]);
  const [summary, setSummary] = useState<ProfileSummaryDto>(emptySummary);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (authLoading || !userId) return;

    let active = true;
    const cachedSummary = readCachedSummary(userId);
    setSummary(cachedSummary ?? emptySummary);
    setSummaryLoading(cachedSummary === null);
    const loadProfile = async () => {
      const [summaryResult, ordersResult, addressesResult, subscriptionsResult, wishlistResult, userResult] = await Promise.allSettled([
        api.getProfileSummary(), api.getOrders(), api.getAddresses(), api.getSubscriptions(), api.getWishlist(), api.getMe(),
      ]);
      if (!active) return;
      const summaryData = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
      const orderData = ordersResult.status === 'fulfilled' ? ordersResult.value : [];
      const addressData = addressesResult.status === 'fulfilled' ? addressesResult.value : [];
      const subscriptionData = subscriptionsResult.status === 'fulfilled' ? subscriptionsResult.value : [];
      const wishlistData = wishlistResult.status === 'fulfilled' ? wishlistResult.value : [];
      const currentUser = userResult.status === 'fulfilled' ? userResult.value : null;
      if (ordersResult.status === 'rejected' || userResult.status === 'rejected') {
        setLoadError('Dashboard data could not be loaded. Please sign out, sign in again, and confirm the backend is running on port 8080.');
      } else {
        setLoadError('');
      }
      const pointsFromOrders = orderData.flatMap((order) => order.items).reduce((points, item) => points + item.qty * 10, 0);
      if (ordersResult.status === 'fulfilled') setOrders(orderData);
      if (addressesResult.status === 'fulfilled') setAddresses(addressData);
      if (subscriptionsResult.status === 'fulfilled') setSubs(subscriptionData);
      const dashboardResolved = summaryResult.status === 'fulfilled' || (
        ordersResult.status === 'fulfilled'
        && addressesResult.status === 'fulfilled'
        && subscriptionsResult.status === 'fulfilled'
        && wishlistResult.status === 'fulfilled'
        && userResult.status === 'fulfilled'
      );
      if (dashboardResolved) {
        setSummary((previous) => {
          const rewardPoints = Math.max(currentUser?.rewardPoints ?? 0, pointsFromOrders);
          const nextSummary = {
            totalOrders: summaryData?.totalOrders ?? (ordersResult.status === 'fulfilled' ? orderData.length : previous.totalOrders),
            activeSubscriptions: summaryData?.activeSubscriptions ?? (subscriptionsResult.status === 'fulfilled' ? subscriptionData.filter((sub) => sub.status === 'ACTIVE').length : previous.activeSubscriptions),
            rewardPoints: summaryData?.rewardPoints ?? (userResult.status === 'fulfilled' || ordersResult.status === 'fulfilled' ? rewardPoints : previous.rewardPoints),
            wishlistItems: summaryData?.wishlistItems ?? (wishlistResult.status === 'fulfilled' ? wishlistData.length : previous.wishlistItems),
            savedAddresses: summaryData?.savedAddresses ?? (addressesResult.status === 'fulfilled' ? addressData.length : previous.savedAddresses),
            notifications: summaryData?.notifications ?? (ordersResult.status === 'fulfilled' && subscriptionsResult.status === 'fulfilled' ? orderData.length + subscriptionData.length + (rewardPoints > 0 ? 1 : 0) : previous.notifications),
          };
          window.localStorage.setItem(dashboardSummaryKey(userId), JSON.stringify(nextSummary));
          return nextSummary;
        });
        setSummaryLoading(false);
      }
    };
    loadProfile();
    const refresh = () => loadProfile();
    const onStorage = (event: StorageEvent) => { if (event.key === 'dairyxpress-data-changed') refresh(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('dairyxpress:data-changed', refresh);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(refresh, 10000);
    return () => {
      active = false;
      window.removeEventListener('dairyxpress:data-changed', refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, [authLoading, userId]);

  const setTab = (t: string) => setParams({ tab: t });

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {loadError && <div role="alert" className="mb-4 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error">{loadError}</div>}
        {/* Header card */}
          <div className="relative overflow-hidden rounded-5xl bg-green-gradient p-8 text-white shadow-float">
            <div className="absolute inset-0 bg-hero-grain opacity-40" />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <img src={IMAGES.people.c3} alt="Profile" className="h-20 w-20 rounded-full border-4 border-white/40 object-cover shadow-float" />
              <div>
                <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name ?? 'Guest'}</h1>
                <p className="text-white/80">{user?.email ?? 'guest@dairyxpress.farm'} · Member since 2026</p>
              </div>
            </div>
          </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex gap-2 overflow-x-auto rounded-4xl bg-white p-3 shadow-card no-scrollbar lg:flex-col">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={cn('flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium transition', tab === t.id ? 'bg-primary/10 text-primary' : 'text-ink-600 hover:bg-cream-200')}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {tab === 'dashboard' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'Total orders', value: summary.totalOrders, icon: Package, tone: 'primary' },
                    { label: 'Active subscriptions', value: summary.activeSubscriptions, icon: Truck, tone: 'accent' },
                    { label: 'Reward points', value: summary.rewardPoints, icon: Award, tone: 'success' },
                    { label: 'Wishlist items', value: summary.wishlistItems, icon: Heart, tone: 'error' },
                    { label: 'Saved addresses', value: summary.savedAddresses, icon: MapPin, tone: 'primary' },
                    { label: 'Notifications', value: summary.notifications, icon: Bell, tone: 'accent' },
                  ].map((c) => (
                    <div key={c.label} className="rounded-4xl bg-white p-6 shadow-card">
                      <div className={cn('grid h-12 w-12 place-items-center rounded-2xl', c.tone === 'primary' ? 'bg-primary/10 text-primary' : c.tone === 'accent' ? 'bg-accent/20 text-accent-700' : c.tone === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>
                        <c.icon className="h-6 w-6" />
                      </div>
                      <p className="mt-4 font-display text-3xl font-bold text-ink">{summaryLoading ? '—' : <Counter value={c.value} />}</p>
                      <p className="text-sm text-ink-500">{c.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-3">
                  {orders.map((o) => <OrderTracking key={o.id} order={o} />)}
                </div>
              )}

              {tab === 'wishlist' && (
                state.wishlist.length === 0 ? (
                  <div className="rounded-4xl bg-white p-10 text-center shadow-card">
                    <Heart className="mx-auto h-10 w-10 text-primary/30" />
                    <p className="mt-4 font-heading text-lg font-bold text-ink">Your wishlist is empty</p>
                    <p className="mt-1 text-ink-500">Tap the heart on any product to save it here.</p>
                    <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse products →</Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {state.wishlist.map((w) => (
                      <div key={w.id} className="flex gap-4 rounded-4xl bg-white p-4 shadow-card">
                        <img src={w.image} alt={w.name} className="h-20 w-20 rounded-2xl object-cover" />
                        <div className="flex flex-1 flex-col">
                          <p className="font-heading font-semibold text-ink">{w.name}</p>
                          <p className="font-bold text-ink">₹{w.price}</p>
                          <div className="mt-auto flex gap-2">
                            <Link to={`/product/${w.id}`} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white">View</Link>
                            <button onClick={() => toggleWishlist(w)} className="rounded-full bg-cream-300 px-4 py-1.5 text-xs font-semibold text-ink-600 hover:bg-error/10 hover:text-error">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {tab === 'addresses' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((a) => (
                    <div key={a.id} className="rounded-4xl bg-white p-5 shadow-card">
                      <div className="flex items-center justify-between">
                        <p className="font-heading font-bold text-ink">{a.label}</p>
                        {a.isDefault && <span className="chip bg-primary/10 text-primary">Default</span>}
                      </div>
                      <p className="mt-2 text-sm text-ink-500">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city} - {a.pincode}</p>
                      <div className="mt-3 flex gap-2 text-xs"><button onClick={() => api.deleteAddress(a.id).then(() => setAddresses((prev) => prev.filter((x) => x.id !== a.id)))} className="font-semibold text-error hover:underline">Delete</button></div>
                    </div>
                  ))}
                  {addresses.length === 0 && <p className="text-sm text-ink-500">No saved addresses yet.</p>}
                  <AddressForm onSaved={(a) => setAddresses((prev) => [...prev, a])} />
                </div>
              )}

              {tab === 'subscriptions' && (
                <div className="space-y-3">
                  {subs.length === 0 ? (
                    <div className="rounded-4xl bg-white p-10 text-center shadow-card">
                      <Truck className="mx-auto h-10 w-10 text-primary/30" />
                      <p className="mt-4 font-heading text-lg font-bold text-ink">No active subscriptions</p>
                      <Link to="/subscriptions" className="mt-4 inline-block text-primary hover:underline">Browse plans →</Link>
                    </div>
                  ) : subs.map((s) => (
                    <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-4xl bg-white p-5 shadow-card">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/20"><Sparkles className="h-6 w-6 text-accent-700" /></div>
                        <div><p className="font-heading font-bold text-ink">{s.planName}</p><p className="text-xs text-ink-500">{s.detail}</p></div>
                      </div>
                      <span className="chip bg-success/10 text-success">{s.status}</span>
                      <p className="font-display text-lg font-bold text-ink">₹{s.price}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'rewards' && (
                <div className="rounded-4xl bg-white p-8 shadow-card text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent/20"><Award className="h-10 w-10 text-accent-700" /></div>
                  <p className="mt-4 font-display text-4xl font-bold text-ink"><Counter value={summary.rewardPoints} /></p>
                  <p className="text-ink-500">reward points available</p>
                  <p className="mt-4 text-sm text-ink-500">Earn 10 points for every product unit ordered. Redeem 100 pts for ₹10 off.</p>
                  <button className="btn-accent mt-6">Redeem now</button>
                </div>
              )}

              {tab === 'settings' && <SettingsForm />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsForm() {
  const { user, updateProfile } = useAuth();
  const initial = { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', password: '' };
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true); setStatus('');
    try {
      await updateProfile({ ...form, password: form.password || undefined });
      setForm((current) => ({ ...current, password: '' }));
      setStatus('Changes are saved.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to save changes.'); }
    finally { setSaving(false); }
  };
  return <div className="rounded-4xl bg-white p-6 shadow-card">
    <h2 className="font-heading text-xl font-bold text-ink">Account settings</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {([['name','Name','text'],['email','Email','email'],['phone','Phone','tel'],['password','New password','password']] as const).map(([key,label,type]) => <div key={key}><label className="text-xs font-semibold uppercase text-ink-400">{label}</label><input type={type} value={form[key]} placeholder={key === 'password' ? 'Leave blank to keep current password' : ''} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} className="input-premium mt-1" /></div>)}
    </div>
    {status && <p role="status" className={`mt-4 text-sm ${status === 'Changes are saved.' ? 'text-success' : 'text-error'}`}>{status}</p>}
    <div className="mt-6 flex gap-3"><button disabled={saving} onClick={save} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button><button onClick={() => { setForm(initial); setStatus(''); }} className="btn-ghost">Cancel</button></div>
  </div>;
}

function AddressForm({ onSaved }: { onSaved: (a: AddressDto) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: '', line1: '', line2: '', city: '', pincode: '', isDefault: false });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const a = await api.addAddress(form);
      onSaved(a);
      setForm({ label: '', line1: '', line2: '', city: '', pincode: '', isDefault: false });
      setOpen(false);
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="grid place-items-center rounded-4xl border-2 border-dashed border-cream-400 p-5 text-ink-400 transition hover:border-primary hover:text-primary">
        <Plus className="h-6 w-6" /> Add new address
      </button>
    );
  }

  return (
    <div className="rounded-4xl bg-white p-5 shadow-card">
      <p className="font-heading font-bold text-ink">New address</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input placeholder="Label (Home, Work...)" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="input-premium" />
        <input placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input-premium" />
        <input placeholder="Address line 1" value={form.line1} onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))} className="input-premium sm:col-span-2" />
        <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))} className="input-premium sm:col-span-2" />
        <input placeholder="PIN code" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} className="input-premium" />
        <label className="inline-flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="accent-primary" /> Set as default</label>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save address'}</button>
        <button onClick={() => setOpen(false)} className="btn-ghost text-sm">Cancel</button>
      </div>
    </div>
  );
}

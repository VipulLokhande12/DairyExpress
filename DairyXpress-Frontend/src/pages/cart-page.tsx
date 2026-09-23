import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from 'lucide-react';
import { useCart } from '@/store/cart-context';
import { Ripple } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

const coupons: Record<string, number> = { FRESH10: 10, DAIRY15: 15, VILLAGE20: 20 };

export function CartPage() {
  const { state, setQty, remove, subtotal, discount, deliveryFee, total, freeDeliveryThreshold, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  const apply = () => {
    const c = coupons[code.toUpperCase()];
    if (c) { applyCoupon(code.toUpperCase(), c); setErr(''); }
    else { setErr('Invalid coupon code'); }
  };

  const remaining = Math.max(0, freeDeliveryThreshold - (subtotal - discount));
  const progress = Math.min(100, ((subtotal - discount) / freeDeliveryThreshold) * 100);

  if (state.items.length === 0) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-cream-200"><ShoppingBag className="h-12 w-12 text-primary/40" /></div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-2 text-ink-500">Looks like you haven't added any fresh dairy yet.</p>
          <Link to="/products" className="mt-6 inline-block"><Ripple>Browse products <ArrowRight className="h-4 w-4" /></Ripple></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Your cart</h1>
        <p className="mt-1 text-ink-500">{state.items.length} item{state.items.length > 1 ? 's' : ''} · ready for delivery</p>

        {/* Free delivery progress */}
        <div className="mt-6 rounded-4xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            {remaining > 0
              ? <span className="text-ink-600">Add <strong className="text-primary">₹{remaining}</strong> more for <strong>free delivery</strong></span>
              : <span className="font-semibold text-success">You've unlocked free delivery!</span>}
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-300">
            <motion.div animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="h-full rounded-full bg-green-gradient" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div key={item.product.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }} className="flex gap-4 rounded-4xl bg-white p-4 shadow-card">
                  <Link to={`/product/${item.product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/product/${item.product.slug}`} className="font-heading font-semibold text-ink hover:text-primary">{item.product.name}</Link>
                        <p className="text-xs text-ink-500">{item.product.unit} · {item.product.deliveryMins} min</p>
                      </div>
                      <button onClick={() => remove(String(item.product.id))} aria-label="Remove" className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-error/10 hover:text-error"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-cream-400">
                        <button onClick={() => setQty(String(item.product.id), item.qty - 1)} className="grid h-9 w-9 place-items-center text-ink-600 hover:text-primary"><Minus className="h-3.5 w-3.5" /></button>
                        <motion.span key={item.qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-8 text-center font-heading font-bold text-ink">{item.qty}</motion.span>
                        <button onClick={() => setQty(String(item.product.id), item.qty + 1)} className="grid h-9 w-9 place-items-center text-ink-600 hover:text-primary"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-ink">₹{item.product.price * item.qty}</p>
                        {item.product.oldPrice && <p className="text-xs text-ink-400 line-through">₹{item.product.oldPrice * item.qty}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-4xl bg-white p-6 shadow-card">
              <h2 className="font-heading text-lg font-bold text-ink">Order summary</h2>

              {/* Coupon */}
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase text-ink-400">Apply coupon</label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="FRESH10" className="input-premium pl-9" />
                  </div>
                  <button onClick={apply} className="rounded-2xl bg-primary px-4 font-heading font-semibold text-white transition hover:bg-primary-700">Apply</button>
                </div>
                {err && <p className="mt-1 text-xs text-error">{err}</p>}
                {state.coupon && (
                  <div className="mt-2 flex items-center justify-between rounded-2xl bg-success/10 px-3 py-2 text-sm">
                    <span className="font-semibold text-success">"{state.coupon.code}" applied · {state.coupon.discount}% off</span>
                    <button onClick={removeCoupon} className="text-error hover:underline">Remove</button>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.keys(coupons).map((c) => <button key={c} onClick={() => { setCode(c); applyCoupon(c, coupons[c]); }} className={cn('chip text-xs', state.coupon?.code === c ? 'bg-success/15 text-success' : 'bg-cream-300 text-ink-600 hover:bg-primary/10')}>{c}</button>)}
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-cream-300 pt-4 text-sm">
                <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{discount}</span></div>}
                <div className="flex justify-between text-ink-600"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-success">FREE</span> : `₹${deliveryFee}`}</span></div>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-cream-300 pt-4">
                <span className="font-heading font-bold text-ink">Total</span>
                <span className="font-display text-2xl font-bold text-ink">₹{total}</span>
              </div>

              <Link to="/checkout" className="mt-5 block"><Ripple className="w-full">Proceed to checkout <ArrowRight className="h-4 w-4" /></Ripple></Link>
              <p className="mt-3 text-center text-xs text-ink-400">Estimated delivery in 30 minutes · Free returns within 24h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

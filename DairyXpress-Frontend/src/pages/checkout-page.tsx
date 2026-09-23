import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Check, CreditCard, Landmark, Loader2, LocateFixed, MapPin, Receipt, Smartphone, Truck, Wallet } from 'lucide-react';
import { useCart } from '@/store/cart-context';
import { api } from '@/services/api';
import { Ripple } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth-context';


const steps = ['Address', 'Payment', 'Review', 'Confirmation'];

export function CheckoutPage() {
  const { state, subtotal, discount, deliveryFee, total, clear } = useCart();
  const { refreshUser } = useAuth();
  const [active, setActive] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [payment, setPayment] = useState('upi');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [address, setAddress] = useState({ fullName: '', phone: '', line1: '', line2: '', city: '', pincode: '', latitude: undefined as number | undefined, longitude: undefined as number | undefined });
  const deliveryAddress = [address.line1, address.line2, address.city, address.pincode].filter(Boolean).join(', ');
  const updateAddress = (key: keyof typeof address, value: string | number) => setAddress((a) => ({ ...a, [key]: value }));
  const useCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) { setLocationError('Location is not supported by this browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      setAddress((a) => ({ ...a, latitude: coords.latitude, longitude: coords.longitude }));
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`, { headers: { 'Accept-Language': 'en' } });
        const data = await response.json(); const place = data.address ?? {};
        setAddress((a) => ({ ...a, line1: data.display_name?.split(',').slice(0, 2).join(',').trim() || a.line1, city: place.city || place.town || place.village || a.city, pincode: place.postcode || a.pincode }));
      } catch { /* Coordinates remain available if reverse geocoding fails. */ }
      setLocating(false);
    }, (error) => { setLocationError(error.code === 1 ? 'Location permission was denied. You can still type your address.' : 'Could not get your location. Please try again.'); setLocating(false); }, { enableHighAccuracy: true, timeout: 12000 });
  };
 

  const handlePayment = async () => {

    try {
  
      const paymentOrder = await api.createPayment({
        amount: total
      });
  
      const options = {
  
        key: paymentOrder.key,

amount: paymentOrder.amount,

currency: paymentOrder.currency,

name: "DairyXpress",

description: "Milk Order Payment",

order_id: paymentOrder.orderId,
  
        handler: async function (response: any) {
  
          try {
  
            await api.verifyPayment({
  
              razorpayOrderId: response.razorpay_order_id,
  
              razorpayPaymentId: response.razorpay_payment_id,
  
              razorpaySignature: response.razorpay_signature
  
            });
  
            const order = await api.createOrder({
  
              items: state.items.map((i) => ({
                productId: String(i.product.id),
                productName: i.product.name,
                productImage: i.product.image,
                productUnit: i.product.unit,
                price: i.product.price,
                qty: i.qty
              })),
  
              subtotal,
  
              discount,
  
              deliveryFee,
  
              total,
  
              address: deliveryAddress,
              deliveryLatitude: address.latitude,
              deliveryLongitude: address.longitude,
  
              paymentMethod: payment
  
            });
  
            setOrderId(order.orderId);
            await refreshUser();
  
            clear();
  
            setActive(3);
  
          } catch (error) {
  
            console.error(error);
  
            alert("Payment verification failed.");
  
          }
  
        },
  
        prefill: {
  
          name: "",
  
          email: "",
  
          contact: ""
  
        },
  
        theme: {
  
          color: "#2E7D32"
  
        }
  
      };
  
      const razorpay = new (window as any).Razorpay(options);
  
      razorpay.open();
  
    } catch (error: any) {

      console.error("Payment Error:", error);
    
      if (error.response) {
        console.log("Response:", error.response.data);
        alert(JSON.stringify(error.response.data));
      } else if (error.message) {
        alert(error.message);
      } else {
        alert("Unknown Error");
      }
    
    }
  
  };

  const next = async () => {

    if (active === 0 && (!address.line1.trim() || !address.city.trim() || !address.pincode.trim())) {
      setLocationError('Please enter your address, city, and PIN code before continuing.');
      return;
    }

    if (active === 2) {
  
      // Cash On Delivery
      if (payment === "cod") {
  
        const order = await api.createOrder({
  
          items: state.items.map((i) => ({
            productId: String(i.product.id),
            productName: i.product.name,
            productImage: i.product.image,
            productUnit: i.product.unit,
            price: i.product.price,
            qty: i.qty,
          })),
  
          subtotal,
          discount,
          deliveryFee,
          total,
  
          address: deliveryAddress,
          deliveryLatitude: address.latitude,
          deliveryLongitude: address.longitude,
  
          paymentMethod: payment,
  
        });
  
        setOrderId(order.orderId);
        await refreshUser();
  
        clear();
  
        setActive(3);
  
        return;
      }
  
      // Razorpay Payment
      await handlePayment();
  
      return;
    }
  
    setActive((a) => Math.min(a + 1, 3));
  
  };
      
  const back = () => setActive((a) => Math.max(a - 1, 0));

  if (state.items.length === 0 && active < 3) {
    return (
      <div className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div>
          <p className="font-heading text-2xl font-bold text-ink">Your cart is empty</p>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse products →</Link>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'All major banks' },
    { id: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when it arrives' },
  ];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Checkout</h1>

        {/* Stepper */}
        <div className="mt-8 flex items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cn('grid h-10 w-10 place-items-center rounded-full font-heading font-bold transition', i < active ? 'bg-success text-white' : i === active ? 'bg-primary text-white shadow-float' : 'bg-cream-300 text-ink-400')}>
                  {i < active ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className={cn('mt-2 text-xs font-medium', i <= active ? 'text-ink' : 'text-ink-400')}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded-full transition', i < active ? 'bg-success' : 'bg-cream-300')} />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="rounded-4xl bg-white p-6 shadow-card md:p-8">
                {active === 0 && (
                  <div>
                    <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-ink"><MapPin className="h-5 w-5 text-primary" /> Delivery address</h2>
                    <button type="button" onClick={useCurrentLocation} disabled={locating} className="btn-ghost mt-4 flex items-center gap-2 border border-primary/20 text-sm text-primary">{locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />} {locating ? 'Finding your location...' : 'Use my current location'}</button>
                    {address.latitude != null && <p className="mt-2 text-xs font-medium text-success">Location captured. Confirm the address below before continuing.</p>}
                    {locationError && <p className="mt-2 text-sm text-error">{locationError}</p>}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <input placeholder="Full name" value={address.fullName} onChange={(e)=>updateAddress('fullName',e.target.value)} className="input-premium" />
                      <input placeholder="Phone number" value={address.phone} onChange={(e)=>updateAddress('phone',e.target.value)} className="input-premium" />
                      <input placeholder="Address line 1" value={address.line1} onChange={(e)=>updateAddress('line1',e.target.value)} className="input-premium sm:col-span-2" />
                      <input placeholder="Address line 2 (optional)" value={address.line2} onChange={(e)=>updateAddress('line2',e.target.value)} className="input-premium sm:col-span-2" />
                      <input placeholder="City" value={address.city} onChange={(e)=>updateAddress('city',e.target.value)} className="input-premium" />
                      <input placeholder="PIN code" value={address.pincode} onChange={(e)=>updateAddress('pincode',e.target.value)} className="input-premium" />
                    </div>
                    <label className="mt-4 inline-flex items-center gap-2 text-sm text-ink-600"><input type="checkbox" className="accent-primary" /> Save this address for next time</label>
                  </div>
                )}

                {active === 1 && (
                  <div>
                    <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-ink"><Wallet className="h-5 w-5 text-primary" /> Payment method</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {paymentMethods.map((m) => (
                        <button key={m.id} onClick={() => setPayment(m.id)} className={cn('flex items-center gap-3 rounded-3xl border-2 p-4 text-left transition', payment === m.id ? 'border-primary bg-primary/5' : 'border-cream-300 hover:border-primary/40')}>
                          <span className={cn('grid h-11 w-11 place-items-center rounded-2xl', payment === m.id ? 'bg-primary text-white' : 'bg-cream-200 text-ink-600')}><m.icon className="h-5 w-5" /></span>
                          <div>
                            <p className="font-heading font-semibold text-ink">{m.label}</p>
                            <p className="text-xs text-ink-500">{m.desc}</p>
                          </div>
                          {payment === m.id && <BadgeCheck className="ml-auto h-5 w-5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {active === 2 && (
                  <div>
                    <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-ink"><Receipt className="h-5 w-5 text-primary" /> Review your order</h2>
                    <div className="mt-5 space-y-3">
                      {state.items.map((i) => (
                        <div key={i.product.id} className="flex items-center gap-3 rounded-2xl bg-cream-100 p-3">
                          <img src={i.product.image} alt={i.product.name} className="h-14 w-14 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-heading font-semibold text-ink">{i.product.name}</p>
                            <p className="text-xs text-ink-500">Qty {i.qty} · {i.product.unit}</p>
                          </div>
                          <p className="font-bold text-ink">₹{i.product.price * i.qty}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-primary/5 p-3 text-sm text-ink-600"><Truck className="h-4 w-4 text-primary" /> Delivery in 30 minutes to your saved address.</div>
                  </div>
                )}

                {active === 3 && (
                  <div className="py-8 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15">
                      <Check className="h-10 w-10 text-success" />
                    </motion.div>
                    <h2 className="mt-6 font-display text-2xl font-bold text-ink">Order confirmed!</h2>
                    <p className="mt-2 text-ink-500">Your order <strong className="text-primary">#{orderId}</strong> is being prepared fresh.</p>
                    <p className="mt-1 text-sm text-ink-500">Estimated delivery in 30 minutes.</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <Link to="/profile?tab=orders"><Ripple>Track order</Ripple></Link>
                      <Link to="/products" className="btn-ghost">Continue shopping</Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {active < 3 && (
              <div className="mt-4 flex justify-between">
                <button onClick={back} disabled={active === 0} className="btn-ghost disabled:opacity-40">Back</button>
                <Ripple onClick={next}>{active === 2 ? 'Place order' : 'Continue'}</Ripple>
              </div>
            )}
          </div>

          {/* Summary */}
          {active < 3 && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-4xl bg-white p-6 shadow-card">
                <h3 className="font-heading font-bold text-ink">Summary</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-₹{discount}</span></div>}
                  <div className="flex justify-between text-ink-600"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-cream-300 pt-4">
                  <span className="font-heading font-bold text-ink">Total</span>
                  <span className="font-display text-2xl font-bold text-ink">₹{total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

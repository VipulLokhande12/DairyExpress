import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Heart, Minus, Plus, ShieldCheck, Star, Truck, Zap } from 'lucide-react';
import { api } from '@/services/api';
import type { Product, ReviewDto } from '@/services/api';
import { useCart } from '@/store/cart-context';
import { ProductCard } from '@/components/ui/product-card';
import { Badge, Reveal, Ripple, Skeleton } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'How fresh is the milk when delivered?', a: 'Milk is milched at dawn and delivered within 4–6 hours, cold-chain intact.' },
  { q: 'Is the packaging returnable?', a: 'Yes — glass bottles are collected on your next delivery and reused. You get a small credit for each returned bottle.' },
  { q: 'Can I pause my subscription?', a: 'Absolutely. Pause, skip or modify any delivery from your dashboard up to 2 hours before the slot.' },
  { q: 'What if a product is damaged?', a: 'We replace or refund within 24 hours, no questions asked. Just report it from your order page.' },
];

export function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const { add, toggleWishlist, state } = useCart();

  useEffect(() => {
    setProduct(undefined);
    api.getProductBySlug(slug ?? '').then((data) => {
      setProduct(data);
      setActiveImg(0);
      setQty(1);
      api.getProductReviews(data.id).then(setReviews).catch(() => setReviews([]));
      api.getProducts({ category: data.category }).then((all) => {
        setRelated(all.filter((p) => p.id !== data.id).slice(0, 4));
      }).catch(() => setRelated([]));
    }).catch(() => setProduct(null));
  }, [slug]);

  if (product === undefined) {
    return (
      <div className="pt-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Skeleton className="aspect-square rounded-5xl" />
            <div className="space-y-4"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-10 w-3/4" /><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-full" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center pt-24">
        <div className="text-center">
          <p className="font-heading text-3xl font-bold text-ink">Product not found</p>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse all products →</Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const inWishlist = state.wishlist.some((w) => w.id === String(product.id));
  const submitReview = async (event: FormEvent) => { event.preventDefault(); setReviewMessage(''); try { const created = await api.createReview(product.id, reviewRating, reviewText); setReviews((current) => [created, ...current]); setReviewText(''); setReviewMessage('Thank you! Your review was posted.'); } catch (error) { setReviewMessage(error instanceof Error ? error.message : 'Could not post review.'); } };


  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-ink-500">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square overflow-hidden rounded-5xl bg-cream-200 shadow-card">
              <img src={product.gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {discount > 0 && <Badge tone="error" className="shadow-soft">-{discount}%</Badge>}
                {product.organic && <Badge tone="success" className="shadow-soft">Organic</Badge>}
              </div>
            </motion.div>
            <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
              {product.gallery.map((g, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={cn('h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition', i === activeImg ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100')}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{product.category}</span>
              {product.badge && <Badge tone="accent">{product.badge}</Badge>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-ink"><Star className="h-4 w-4 fill-accent text-accent" /> {product.rating}</span>
              <span className="text-sm text-ink-500">{product.reviews} reviews</span>
              <span className="text-ink-400">•</span>
              <span className={cn('text-sm font-medium', product.stock < 10 ? 'text-error' : 'text-success')}>{product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `Low stock · only ${product.stock} left` : 'In stock'}</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-ink">₹{product.price}</span>
              {product.oldPrice && <span className="text-lg text-ink-400 line-through">₹{product.oldPrice}</span>}
              {discount > 0 && <Badge tone="success">Save ₹{product.oldPrice! - product.price}</Badge>}
            </div>
            <p className="text-sm text-ink-500">{product.unit}</p>

            <p className="mt-5 leading-relaxed text-ink-600">{product.description}</p>

            {/* benefits */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {product.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 rounded-2xl bg-cream-200 px-3 py-2 text-sm text-ink-600">
                  <Check className="h-4 w-4 text-success" /> {b}
                </div>
              ))}
            </div>

            {/* delivery badges */}
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="chip bg-primary/10 text-primary"><Truck className="h-3 w-3" /> {product.deliveryMins} min delivery</span>
              <span className="chip bg-primary/10 text-primary"><ShieldCheck className="h-3 w-3" /> Secure payment</span>
              <span className="chip bg-primary/10 text-primary"><Zap className="h-3 w-3" /> Freshness guaranteed</span>
            </div>

            {/* qty + actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-cream-400 bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-ink-600 hover:text-primary"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-heading font-bold text-ink">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-ink-600 hover:text-primary"><Plus className="h-4 w-4" /></button>
              </div>
              <Ripple onClick={() => product.stock > 0 && add(product, qty)} className={cn('flex-1 sm:flex-none', product.stock === 0 && 'pointer-events-none opacity-50')}>{product.stock === 0 ? 'Out of stock' : `Add to Cart · ₹${product.price * qty}`}</Ripple>
              <button disabled={product.stock === 0} onClick={() => { add(product, qty); navigate('/checkout'); }} className="btn-accent disabled:cursor-not-allowed disabled:opacity-50">Buy Now</button>
              <button onClick={() => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image })} aria-label="Wishlist" className={cn('grid h-12 w-12 place-items-center rounded-full border border-cream-400 bg-white transition hover:border-error', inWishlist && 'border-error')}>
                <Heart className={cn('h-5 w-5', inWishlist ? 'fill-error text-error' : 'text-ink-600')} />
              </button>
            </div>

            {/* Nutrition */}
            <div className="mt-10">
              <h3 className="font-heading text-xl font-bold text-ink">Nutrition facts</h3>
              <div className="mt-3 overflow-hidden rounded-3xl border border-cream-400">
                {product.nutrition.map((n, i) => (
                  <div key={n.label} className={cn('flex items-center justify-between px-4 py-3 text-sm', i % 2 === 0 ? 'bg-cream-100' : 'bg-white')}>
                    <span className="text-ink-600">{n.label}</span>
                    <span className="font-semibold text-ink">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-6">
              <h3 className="font-heading text-xl font-bold text-ink">Ingredients</h3>
              <p className="mt-2 text-ink-600">{product.ingredients.join(', ')}.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Reveal><h2 className="font-heading text-2xl font-bold text-ink">Frequently asked</h2></Reveal>
          </div>
          <div className="space-y-3 lg:col-span-2">
            {faqs.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-3xl bg-white shadow-card">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                  <span className="font-heading font-semibold text-ink">{f.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-2xl text-primary">+</motion.span>
                </button>
                <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-ink-600">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-ink">Customer reviews</h2>
          <form onSubmit={submitReview} className="mt-5 rounded-3xl bg-white p-5 shadow-card"><div className="flex flex-wrap items-center gap-4"><label className="font-semibold text-ink">Your rating</label><select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="input-premium w-28">{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></div><textarea required minLength={3} maxLength={1000} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your product review" className="input-premium mt-3 min-h-24 w-full"/><button className="btn-primary mt-3 px-6 py-2">Post review</button>{reviewMessage && <p className="mt-2 text-sm text-primary">{reviewMessage}</p>}</form>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-3xl bg-white p-5 shadow-card">
                <div className="flex gap-1">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <p className="mt-3 text-sm text-ink-600">"{r.text}"</p>
                <p className="mt-4 text-sm font-semibold text-ink">{r.userName} <span className="font-normal text-ink-400">· {new Date(r.createdAt).toLocaleDateString()}</span></p>
              </motion.div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-ink-500">No reviews yet. Be the first to review this product.</p>}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-ink">You might also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add to cart (mobile) */}
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-400 bg-white/90 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-ink-500">{product.name}</p>
            <p className="font-display text-lg font-bold text-ink">₹{product.price * qty}</p>
          </div>
          <Ripple onClick={() => add(product, qty)} className="flex-1 max-w-[60%]">Add to Cart</Ripple>
        </div>
      </motion.div>
    </div>
  );
}

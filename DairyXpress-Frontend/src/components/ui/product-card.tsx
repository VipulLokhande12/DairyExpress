import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Product } from '@/data/catalog';
import { useCart } from '@/store/cart-context';
import { Badge, TiltCard } from './primitives';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, toggleWishlist, state } = useCart();
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const inWishlist = state.wishlist.some((w) => w.id === String(product.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group h-full"
    >
      <TiltCard className="h-full" intensity={6}>
        <div className="card-base group relative flex h-full flex-col overflow-hidden hover:shadow-float hover:-translate-y-1">
          {/* image */}
          <div className="relative aspect-square overflow-hidden rounded-t-4xl bg-cream-200">
            <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {discount > 0 && <Badge tone="error" className="shadow-soft">-{discount}%</Badge>}
              {product.organic && <Badge tone="success" className="shadow-soft">Organic</Badge>}
              {product.badge && <Badge tone="accent" className="shadow-soft">{product.badge}</Badge>}
            </div>

            {/* wishlist */}
            <button
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist({ id: String(product.id), name: product.name, price: product.price, image: product.image })}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass shadow-soft transition-transform hover:scale-110"
            >
              <motion.svg animate={{ scale: inWishlist ? 1.1 : 1 }} className="h-4 w-4" fill={inWishlist ? '#EF4444' : 'none'} stroke={inWishlist ? '#EF4444' : '#1A1A1A'} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </motion.svg>
            </button>

            {/* hover actions */}
            <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button onClick={() => product.stock > 0 && add(product)} disabled={product.stock === 0} className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-white shadow-float transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-ink-300">{product.stock === 0 ? 'Out of stock' : 'Add to Cart'}</button>
              <Link to={`/product/${product.slug}`} className="flex-1 rounded-full bg-white/90 py-2.5 text-center text-xs font-semibold text-primary shadow-soft backdrop-blur transition hover:bg-white">Quick View</Link>
            </div>
          </div>

          {/* body */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-500">{product.category}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-accent-700">
                <Star className="h-3 w-3 fill-accent text-accent" /> {product.rating}
                <span className="font-normal text-ink-400">({product.reviews})</span>
              </span>
            </div>
            <h3 className="mt-1 font-heading text-base font-semibold text-ink line-clamp-1">{product.name}</h3>
            <p className="mt-1 text-xs text-ink-500 line-clamp-2">{product.description}</p>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-500">
              <span className={cn('flex items-center gap-1', product.stock < 20 ? 'text-error' : 'text-success')}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? `Low stock · ${product.stock} left` : 'In stock'}
              </span>
              <span className="text-ink-400">•</span>
              <span>{product.deliveryMins} min</span>
            </div>

            <div className="mt-auto flex items-end justify-between pt-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-bold text-ink">₹{product.price}</span>
                  {product.oldPrice && <span className="text-sm text-ink-400 line-through">₹{product.oldPrice}</span>}
                </div>
                {discount > 0 && <span className="text-[11px] font-semibold text-success">Save ₹{product.oldPrice! - product.price}</span>}
              </div>
              <span className="text-[11px] text-ink-400">{product.unit}</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

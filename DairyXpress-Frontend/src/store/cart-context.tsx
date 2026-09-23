import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Product } from '../data/catalog';
import { api, auth } from '@/services/api';

export type CartItem = { product: Product; qty: number };
export type WishlistItem = { id: string; name: string; price: number; image: string };

const key = (id: string | number) => String(id);

type State = {
  items: CartItem[];
  wishlist: WishlistItem[];
  coupon: { code: string; discount: number } | null;
};

type Action =
  | { type: 'ADD'; product: Product; qty?: number }
  | { type: 'REMOVE'; id: string | number }
  | { type: 'SET_QTY'; id: string | number; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_WISHLIST'; item: WishlistItem }
  | { type: 'SET_WISHLIST'; items: WishlistItem[] }
  | { type: 'APPLY_COUPON'; code: string; discount: number }
  | { type: 'REMOVE_COUPON' }
  | { type: 'HYDRATE'; state: State };

const STORAGE_KEY = 'dairy-xpress-cart';

const initial: State = { items: [], wishlist: [], coupon: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => key(i.product.id) === key(action.product.id));
      if (existing) {
        return { ...state, items: state.items.map((i) => (key(i.product.id) === key(action.product.id) ? { ...i, qty: i.qty + (action.qty ?? 1) } : i)) };
      }
      return { ...state, items: [...state.items, { product: action.product, qty: action.qty ?? 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => key(i.product.id) !== key(action.id)) };
    case 'SET_QTY':
      return { ...state, items: state.items.map((i) => (key(i.product.id) === key(action.id) ? { ...i, qty: Math.max(1, action.qty) } : i)) };
    case 'CLEAR':
      return { ...state, items: [], coupon: null };
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.find((w) => w.id === action.item.id);
      return exists
        ? { ...state, wishlist: state.wishlist.filter((w) => w.id !== action.item.id) }
        : { ...state, wishlist: [...state.wishlist, action.item] };
    }
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.items };
    case 'APPLY_COUPON':
      return { ...state, coupon: { code: action.code, discount: action.discount } };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'HYDRATE':
      return action.state;
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  add: (product: Product, qty?: number) => void;
  remove: (id: string | number) => void;
  setQty: (id: string | number, qty: number) => void;
  clear: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  count: number;
  freeDeliveryThreshold: number;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!auth.isLoggedIn()) return;
    api.getWishlist().then((items) => dispatch({
      type: 'SET_WISHLIST',
      items: items.map((item) => ({ id: item.productId, name: item.productName, price: item.productPrice, image: item.productImage })),
    })).catch(() => {});
  }, []);

  const value = useMemo<Ctx>(() => {
    const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const discount = state.coupon ? Math.round((subtotal * state.coupon.discount) / 100) : 0;
    const freeDeliveryThreshold = 299;
    const deliveryFee = subtotal === 0 || subtotal - discount >= freeDeliveryThreshold ? 0 : 39;
    const total = Math.max(0, subtotal - discount + deliveryFee);
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    return {
      state,
      add: (product, qty = 1) => dispatch({ type: 'ADD', product, qty }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      toggleWishlist: (item) => {
        dispatch({ type: 'TOGGLE_WISHLIST', item });
        if (auth.isLoggedIn()) {
          api.toggleWishlist({ productId: item.id, productName: item.name, productPrice: item.price, productImage: item.image }).catch(() => {});
        }
      },
      applyCoupon: (code, discount) => dispatch({ type: 'APPLY_COUPON', code, discount }),
      removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
      subtotal, discount, deliveryFee, total, count, freeDeliveryThreshold,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

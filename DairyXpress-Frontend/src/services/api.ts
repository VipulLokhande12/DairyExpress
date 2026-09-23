// API service layer — talks to the Spring Boot backend via axios.
// All REST endpoints are defined here so the UI never touches axios directly.
// To point at a different backend, change API_BASE_URL below.

import axios from 'axios';
import { testimonials as fallbackTestimonials } from '../data/catalog';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

// Attach JWT token from localStorage on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('dv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the ApiResponse envelope { success, message, data }
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.message ?? error.message ?? 'Network error';
    return Promise.reject(new Error(msg));
  }
);

async function unwrap<T>(p: Promise<{ data: { data: T } }>): Promise<T> {
  const res = await p;
  return res.data.data;
}

function announceDataChange() {
  const changedAt = String(Date.now());
  localStorage.setItem('dairyxpress-data-changed', changedAt);
  window.dispatchEvent(new CustomEvent('dairyxpress:data-changed', { detail: changedAt }));
}

// ─── Types matching backend DTOs ────────────────────────────────────
export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  stock: number;
  deliveryMins: number;
  organic: boolean;
  badge?: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  nutrition: { label: string; value: string }[];
  unit: string;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  icon: string;
  image: string;
  blurb: string;
  count: number;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  photo: string;
  rating: number;
  text: string;
};

export type AuthResponse = {
  token: string;
  user: { id: number; name: string; email: string; phone: string; role: string; rewardPoints: number };
};

export type OrderDto = {
  id: number;
  orderId: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: string;
  address: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  paymentMethod: string;
  createdAt: string;
  items: { productName: string; productImage: string; productUnit: string; price: number; qty: number; subtotal: number }[];
};

export type WishlistDto = {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
};

export type AddressDto = {
  id: number;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
};

export type SubscriptionDto = {
  id: number;
  planName: string;
  frequency: string;
  detail: string;
  price: number;
  status: string;
};

export type ProfileSummaryDto = {
  totalOrders: number;
  activeSubscriptions: number;
  rewardPoints: number;
  wishlistItems: number;
  savedAddresses: number;
  notifications: number;
};

export type SupportTicketDto = { ticketNumber: string; status: string; createdAt: string };
export type ReviewDto = { id: number; userName: string; rating: number; text: string; createdAt: string };

// ─── API ────────────────────────────────────────────────────────────
export const api = {
  // Auth
  register: (name: string, email: string, password: string, phone: string) =>
    unwrap<AuthResponse>(client.post('/auth/register', { name, email, password, phone })),

  login: (email: string, password: string) =>
    unwrap<AuthResponse>(client.post('/auth/login', { email, password })),

  adminLogin: (email: string, password: string) =>
    unwrap<AuthResponse>(client.post('/auth/admin/login', { email, password })),

  getMe: () => unwrap<AuthResponse['user']>(client.get('/auth/me')),

  getProfileSummary: () => unwrap<ProfileSummaryDto>(client.get('/auth/profile/summary')),

  updateProfile: (profile: { name: string; email: string; phone: string; password?: string }) =>
    unwrap<AuthResponse>(client.put('/auth/profile', profile)),

  // Products
  getProducts: (params?: { category?: string; search?: string }) =>
    unwrap<Product[]>(client.get('/products', { params })).then((items) => items.map(applyBrandedProductImage)),

  getProductBySlug: (slug: string) =>
    unwrap<Product>(client.get(`/products/${slug}`)).then(applyBrandedProductImage),

  getFeaturedProducts: () => unwrap<Product[]>(client.get('/products/featured')).then((items) => items.map(applyBrandedProductImage)),

  getCategories: () => unwrap<Category[]>(client.get('/categories')),
  getProductReviews: (productId: number) => unwrap<ReviewDto[]>(client.get(`/products/${productId}/reviews`)),
  createReview: (productId: number, rating: number, text: string) => unwrap<ReviewDto>(client.post('/reviews', { productId, rating, text })),

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      return await unwrap<Testimonial[]>(client.get('/testimonials'));
    } catch {
      return fallbackTestimonials as unknown as Testimonial[];
    }
  },

  // Orders
  createOrder: async (payload: {
    items: { productId: string; productName: string; productImage: string; productUnit: string; price: number; qty: number }[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    address: string;
    paymentMethod: string;
    deliveryLatitude?: number;
    deliveryLongitude?: number;
  }) => {
    const order = await unwrap<OrderDto>(client.post('/orders', payload));
    announceDataChange();
    return order;
  },

  getOrders: () => unwrap<OrderDto[]>(client.get('/orders')),

  // Payment
  createPayment: async (payload: { amount: number }) => {
    const response = await client.post('/payment/create', payload);
  
    return response.data;
  },

  verifyPayment: async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
  
    const response = await client.post('/payment/verify', payload);
  
    return response.data;
  
  },

  // Wishlist
  getWishlist: () => unwrap<WishlistDto[]>(client.get('/wishlist')),

  toggleWishlist: (item: { productId: string; productName: string; productPrice: number; productImage: string }) =>
    unwrap<WishlistDto | null>(client.post('/wishlist', item)),

  removeWishlist: (productId: string) => unwrap<void>(client.delete(`/wishlist/${productId}`)),

  // Addresses
  getAddresses: () => unwrap<AddressDto[]>(client.get('/addresses')),

  addAddress: (addr: { label: string; line1: string; line2?: string; city: string; pincode: string; isDefault: boolean; latitude?: number; longitude?: number }) =>
    unwrap<AddressDto>(client.post('/addresses', addr)),

  deleteAddress: (id: number) => unwrap<void>(client.delete(`/addresses/${id}`)),

  // Subscriptions
  getSubscriptions: () => unwrap<SubscriptionDto[]>(client.get('/subscriptions')),

  createSubscription: (sub: { planName: string; frequency: string; detail: string; price: number }) =>
    unwrap<SubscriptionDto>(client.post('/subscriptions', sub)),

  cancelSubscription: (id: number) => unwrap<void>(client.delete(`/subscriptions/${id}`)),
  updateSubscriptionStatus: (id: number, status: 'ACTIVE' | 'PAUSED') => unwrap<SubscriptionDto>(client.put(`/subscriptions/${id}/status`, null, { params: { status } })),

  // Admin
  getAdminStats: () => unwrap<{
    revenueMtd: number; ordersMtd: number; newCustomers: number; avgOrderValue: number; totalProducts: number; lowStockCount: number;
  }>(client.get('/admin/stats')),

  getRecentOrders: () => unwrap<OrderDto[]>(client.get('/admin/orders')),

  getLowStockProducts: () => unwrap<Product[]>(client.get('/admin/products/low-stock')).then((items) => items.map(applyBrandedProductImage)),
  getAdminProducts: () => unwrap<Product[]>(client.get('/admin/products')).then((items) => items.map(applyBrandedProductImage)),
  createProduct: (product: { slug: string; name: string; category: string; price: number; oldPrice?: number; image: string; unit: string; stock: number; deliveryMins: number; organic: boolean; badge?: string; description: string }) => unwrap<Product>(client.post('/admin/products', product)),
  updatePricing: (id: number, price: number, oldPrice?: number) => unwrap<Product>(client.put(`/admin/products/${id}/pricing`, { price, oldPrice })),

  updateStock: (id: number, stock: number) => unwrap<Product>(client.put(`/admin/products/${id}/stock`, null, { params: { stock } })),

  deleteProduct: (id: number) => unwrap<void>(client.delete(`/admin/products/${id}`)),

  chat: (message: string) => unwrap<{ reply: string }>(client.post('/chat', { message })),

  createSupportTicket: (ticket: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    unwrap<SupportTicketDto>(client.post('/support/tickets', ticket)),
};

// ─── Auth helpers ────────────────────────────────────────────────────
export const auth = {
  save: (token: string) => localStorage.setItem('dv_token', token),
  clear: () => localStorage.removeItem('dv_token'),
  isLoggedIn: () => !!localStorage.getItem('dv_token'),
};
import { applyBrandedProductImage } from '@/data/product-images';

import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from '@/store/cart-context';
import { AuthProvider, useAuth } from '@/store/auth-context';
import { AdminRoute, ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SearchOverlay } from '@/components/search/search-overlay';
import { Chatbot } from '@/components/chat/chatbot';
import { NotFoundPage, ServerErrorPage } from '@/pages/error-pages';

const AuthPage = lazy(() => import('@/pages/auth-page').then((m) => ({ default: m.AuthPage })));
const HomePage = lazy(() => import('@/pages/home-page').then((m) => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('@/pages/products-page').then((m) => ({ default: m.ProductsPage })));
const ProductDetailsPage = lazy(() => import('@/pages/product-details-page').then((m) => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('@/pages/cart-page').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/checkout-page').then((m) => ({ default: m.CheckoutPage })));
const ProfilePage = lazy(() => import('@/pages/profile-page').then((m) => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('@/pages/admin-page').then((m) => ({ default: m.AdminPage })));
const AboutPage = lazy(() => import('@/pages/farm-page').then((m) => ({ default: m.FarmPage })));
const SubscriptionsPage = lazy(() => import('@/pages/subscriptions-page').then((m) => ({ default: m.SubscriptionsPage })));
const NotificationsPage = lazy(() => import('@/pages/notifications-page').then((m) => ({ default: m.NotificationsPage })));

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  return null;
}

function AppRoutes({ onOpenSearch }: { onOpenSearch: () => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAuthRoute = location.pathname === '/auth';

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Auth route — redirect to home if already logged in */}
          <Route path="/auth" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/'} replace /> : <AuthPage />} />

          {/* All other routes wrapped in navbar + footer and protected */}
          <Route
            path="/*"
            element={
              isAuthRoute ? null : (
                <ProtectedRoute>
                  <div className="flex min-h-screen flex-col bg-cream">
                    <Navbar onOpenSearch={onOpenSearch} />
                    <main className="flex-1">
                      <Suspense fallback={<div className="grid min-h-[60vh] place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-cream-400 border-t-primary" /></div>}>
                        <AnimatePresence mode="wait">
                          <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                            <Route path="/products" element={<PageWrapper><ProductsPage /></PageWrapper>} />
                            <Route path="/product/:slug" element={<PageWrapper><ProductDetailsPage /></PageWrapper>} />
                            <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
                            <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
                            <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                            <Route path="/admin" element={<AdminRoute><PageWrapper><AdminPage /></PageWrapper></AdminRoute>} />
                            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                            <Route path="/farm" element={<Navigate to="/about" replace />} />
                            <Route path="/subscriptions" element={<PageWrapper><SubscriptionsPage /></PageWrapper>} />
                            <Route path="/notifications" element={<PageWrapper><NotificationsPage /></PageWrapper>} />
                            <Route path="/500" element={<PageWrapper><ServerErrorPage /></PageWrapper>} />
                            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
                          </Routes>
                        </AnimatePresence>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                </ProtectedRoute>
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes onOpenSearch={() => setSearchOpen(true)} />
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
          <Chatbot />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppShell />;
}

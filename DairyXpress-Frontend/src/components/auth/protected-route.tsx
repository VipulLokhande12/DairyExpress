import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cream-400 border-t-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-cream"><div className="h-12 w-12 animate-spin rounded-full border-4 border-cream-400 border-t-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, auth } from '@/services/api';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  rewardPoints: number;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (profile: { name: string; email: string; phone: string; password?: string }) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then(setUser)
      .catch(() => auth.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    auth.save(res.token);
    setUser(res.user);
  };

  const loginAsAdmin = async (email: string, password: string) => {
    const res = await api.adminLogin(email, password);
    if (res.user.role !== 'ADMIN') throw new Error('This account is not authorized for the admin console.');
    auth.save(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    const res = await api.register(name, email, password, phone);
    auth.save(res.token);
    setUser(res.user);
  };

  const logout = () => {
    auth.clear();
    setUser(null);
  };

  const refreshUser = async () => setUser(await api.getMe());

  const updateProfile = async (profile: { name: string; email: string; phone: string; password?: string }) => {
    const res = await api.updateProfile(profile);
    auth.save(res.token);
    setUser(res.user);
  };

  return <Ctx.Provider value={{ user, loading, login, loginAsAdmin, register, refreshUser, updateProfile, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

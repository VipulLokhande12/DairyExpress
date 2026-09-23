import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Milk, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '@/store/auth-context';
import { cn } from '@/lib/utils';

type AccountType = 'customer' | 'admin';
type FormMode = 'login' | 'register';

export function AuthPage() {
  const { login, loginAsAdmin, register } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [mode, setMode] = useState<FormMode>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectAccountType = (next: AccountType) => {
    setAccountType(next);
    setMode('login');
    setError('');
    setForm(next === 'admin' ? { name: '', email: 'admin@dairyxpress.farm', password: 'password123', phone: '' } : { name: '', email: '', password: '', phone: '' });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password, form.phone);
        navigate('/');
        return;
      }
      if (accountType === 'admin') {
        await loginAsAdmin(form.email, form.password);
        navigate('/admin');
      } else {
        await login(form.email, form.password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isRegistering = mode === 'register';
  const heading = isRegistering ? 'Create your account' : `Sign in as ${accountType === 'admin' ? 'admin' : 'customer'}`;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f6fbf5] px-4 py-8">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-6 shadow-float backdrop-blur sm:p-8">
        <header className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-gradient text-white shadow-card"><Milk className="h-6 w-6" /></span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Dairy<span className="text-gradient">Xpress</span></h1>
          <p className="mt-1 text-sm text-ink-500">Fresh dairy, delivered simply.</p>
        </header>

        <div className="mt-7 grid grid-cols-2 rounded-2xl bg-cream-100 p-1 text-sm font-semibold">
          <button type="button" onClick={() => selectAccountType('customer')} className={cn('rounded-xl px-3 py-2.5 transition', accountType === 'customer' ? 'bg-white text-primary shadow-sm' : 'text-ink-500')}><UserRound className="mr-1 inline h-4 w-4" /> Customer</button>
          <button type="button" onClick={() => selectAccountType('admin')} className={cn('rounded-xl px-3 py-2.5 transition', accountType === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-ink-500')}><ShieldCheck className="mr-1 inline h-4 w-4" /> Admin</button>
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-heading text-xl font-bold text-ink">{heading}</h2>
          <p className="mt-1 text-sm text-ink-500">{isRegistering ? 'Your new account is saved securely in the DairyXpress database.' : 'Use your saved email and password to continue.'}</p>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-error/20 bg-error/10 px-3 py-2 text-center text-sm text-error">{error}</p>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {isRegistering && <Field label="Full name" icon={UserRound}><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ananya Sharma" className="input-premium pl-11" /></Field>}
          <Field label="Email address" icon={Mail}><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={accountType === 'admin' ? 'admin@dairyxpress.farm' : 'you@example.com'} className="input-premium pl-11" /></Field>
          {isRegistering && <Field label="Phone number" icon={Phone}><input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className="input-premium pl-11" /></Field>}
          <Field label="Password" icon={Lock}><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input-premium pl-11 pr-11" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></Field>
          <button disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 disabled:opacity-60">{loading ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'} <ArrowRight className="h-5 w-5" /></button>
        </form>

        <div className="mt-6 border-t border-cream-200 pt-5 text-center text-sm text-ink-500">
          {isRegistering ? 'Already have an account?' : 'New to DairyXpress?'}{' '}
          <button type="button" onClick={() => { setMode(isRegistering ? 'login' : 'register'); setAccountType('customer'); setError(''); }} className="font-semibold text-primary hover:underline">{isRegistering ? 'Sign in' : 'Register now'}</button>
        </div>
      </section>
    </main>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</label><div className="relative"><Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />{children}</div></div>;
}

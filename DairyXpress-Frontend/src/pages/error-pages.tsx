import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Milk } from 'lucide-react';
import { Ripple } from '@/components/ui/primitives';

export function NotFoundPage() {
  return (
    <div className="grid min-h-[100svh] place-items-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-cream-200">
          <Milk className="h-12 w-12 text-primary/40" />
        </div>
        <h1 className="mt-6 font-display text-7xl font-bold text-gradient">404</h1>
        <p className="mt-2 font-heading text-xl font-bold text-ink">This page wandered off the farm</p>
        <p className="mt-2 max-w-sm text-ink-500">The page you're looking for doesn't exist or has been moved. Let's get you back to fresh pastures.</p>
        <Link to="/" className="mt-6 inline-block"><Ripple><HomeIcon className="h-4 w-4" /> Back to home</Ripple></Link>
      </motion.div>
    </div>
  );
}

export function ServerErrorPage() {
  return (
    <div className="grid min-h-[100svh] place-items-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-display text-7xl font-bold text-error">500</h1>
        <p className="mt-2 font-heading text-xl font-bold text-ink">Something spilled on our servers</p>
        <p className="mt-2 max-w-sm text-ink-500">We're mopping it up. Please try again in a moment.</p>
        <Link to="/" className="mt-6 inline-block"><Ripple>Back to home</Ripple></Link>
      </motion.div>
    </div>
  );
}

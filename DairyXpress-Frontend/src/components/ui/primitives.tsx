import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

/* Animated number counter */
export function Counter({ value, suffix = '' }: { value: number; suffix?: string; duration?: number }) {
  return <span>{Number.isFinite(value) ? value.toLocaleString() : '0'}{suffix}</span>;
}

/* 3D tilt card wrapper */
export function TiltCard({ children, className, intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={cn('perspective', className)}
    >
      {children}
    </motion.div>
  );
}

/* Ripple button */
export function Ripple({ children, className, onClick, variant = 'primary' }: { children: React.ReactNode; className?: string; onClick?: () => void; variant?: 'primary' | 'accent' | 'ghost' }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const base = variant === 'primary' ? 'btn-primary' : variant === 'accent' ? 'btn-accent' : 'btn-ghost';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 700);
    onClick?.();
  };

  return (
    <button onClick={handleClick} className={cn(base, className)}>
      {ripples.map((r) => (
        <span key={r.id} className="pointer-events-none absolute rounded-full bg-white/40 animate-ripple" style={{ left: r.x, top: r.y, width: 12, height: 12, transform: 'translate(-50%, -50%)' }} />
      ))}
      {children}
    </button>
  );
}

/* Badge */
export function Badge({ children, tone = 'primary', className }: { children: React.ReactNode; tone?: 'primary' | 'accent' | 'error' | 'success' | 'neutral'; className?: string }) {
  const tones: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/20 text-accent-700',
    error: 'bg-error/10 text-error',
    success: 'bg-success/10 text-success',
    neutral: 'bg-ink-500/10 text-ink-600',
  };
  return <span className={cn('chip', tones[tone], className)}>{children}</span>;
}

/* Skeleton block */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-2xl', className)} />;
}

/* Section heading with eyebrow */
export function SectionHeading({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && (
        <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="chip bg-primary/10 text-primary mb-3">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight">
        {title}
      </motion.h2>
      {subtitle && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-ink-500 text-base md:text-lg leading-relaxed">{subtitle}</motion.p>}
    </div>
  );
}

/* Reveal-on-scroll wrapper */
export function Reveal({ children, delay = 0, y = 24, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

/** Fade-up on scroll wrapper. */
export const Reveal: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

/** Simple stagger container for lists of cards. */
export const RevealGroup: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-60px' }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
  >
    {children}
  </motion.div>
);

export const RevealItem: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    }}
  >
    {children}
  </motion.div>
);

/** Animated number that counts up when visible. */
export const CountUp: React.FC<{ value: number; suffix?: string; className?: string }> = ({
  value, suffix = '', className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
};

export const Stars: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`${className} ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
      />
    ))}
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-6 w-full' }) => (
  <div className={`skeleton ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="card space-y-4 p-6">
    <Skeleton className="h-10 w-10 rounded-xl" />
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

export const EmptyState: React.FC<{ icon: ReactNode; title: string; text: string; action?: ReactNode }> = ({
  icon, title, text, action,
}) => (
  <div className="card flex flex-col items-center p-14 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
      {icon}
    </div>
    <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-400">{text}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`h-2 overflow-hidden rounded-full bg-white/10 ${className}`}>
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  </div>
);

export const Avatar: React.FC<{ name: string; className?: string }> = ({ name, className = 'h-9 w-9 text-sm' }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/60 to-cyan-500/40 font-semibold text-white ${className}`}
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

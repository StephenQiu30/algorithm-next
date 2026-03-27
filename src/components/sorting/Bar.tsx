import { motion } from 'framer-motion';

export type BarState = 'default' | 'compare' | 'swap' | 'overwrite' | 'pivot' | 'sorted';

export interface BarProps {
  value: number;
  maxValue: number;
  state: BarState;
  dimmed?: boolean;
}

export function Bar({ value, maxValue, state, dimmed = false }: BarProps) {
  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 5;
  
  let bgColor = 'bg-blue-600 dark:bg-blue-500';
  let effect = 'shadow-[0_8px_22px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_22px_rgba(0,0,0,0.22)]';

  if (state === 'compare') {
    bgColor = 'bg-orange-500 dark:bg-orange-400';
    effect = 'ring-2 ring-orange-500/25 dark:ring-orange-400/25 z-10';
  } else if (state === 'swap') {
    bgColor = 'bg-rose-500 dark:bg-rose-400';
    effect = 'ring-2 ring-rose-500/25 dark:ring-rose-400/25 z-10';
  } else if (state === 'overwrite') {
    bgColor = 'bg-orange-500 dark:bg-orange-400';
    effect = 'ring-2 ring-orange-500/25 dark:ring-orange-400/25 z-10';
  } else if (state === 'pivot') {
    bgColor = 'bg-orange-500 dark:bg-orange-400';
    effect = 'ring-2 ring-orange-500/25 dark:ring-orange-400/25 z-10';
  } else if (state === 'sorted') {
    bgColor = 'bg-emerald-500/80 dark:bg-emerald-400/70';
    effect = 'shadow-[0_8px_22px_rgba(16,185,129,0.10)] dark:shadow-[0_8px_22px_rgba(16,185,129,0.12)]';
  }

  return (
    <div className={`w-full h-full flex flex-col items-center justify-end px-[1px] relative select-none transition-opacity ${dimmed ? 'opacity-35' : 'opacity-100'}`}>
      {/* Value Label */}
      <motion.span
        animate={{ bottom: `${Math.max(4, heightPercent) + 2}%` }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        className="absolute text-[11px] font-black text-zinc-500 dark:text-zinc-400 tabular-nums mb-1"
      >
        {value}
      </motion.span>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${Math.max(4, heightPercent)}%` }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
        className={`w-full rounded-t-lg transition-all duration-300 ${bgColor} ${effect} border-t border-x border-white/20 dark:border-white/5 active:scale-95`}
      />
    </div>
  );
}

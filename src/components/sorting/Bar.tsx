import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BarState = 'default' | 'compare' | 'swap' | 'overwrite' | 'pivot' | 'sorted';

export interface BarProps {
  value: number;
  maxValue: number;
  state: BarState;
  dimmed?: boolean;
  showValue?: boolean;
}

export function Bar({ value, maxValue, state, dimmed = false, showValue = true }: BarProps) {
  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 5;
  const h = Math.max(7, heightPercent);

  // Premium HSL-based color system
  const colorMap: Record<BarState, string> = {
    default: 'bg-gradient-to-t from-blue-600/80 to-blue-500/90 dark:from-blue-600/60 dark:to-blue-400/80',
    compare: 'bg-gradient-to-t from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    swap: 'bg-gradient-to-t from-rose-600 to-rose-400 dark:from-rose-700 dark:to-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.35)]',
    overwrite: 'bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-700 dark:to-indigo-500',
    pivot: 'bg-gradient-to-t from-fuchsia-600 to-fuchsia-400 dark:from-fuchsia-700 dark:to-fuchsia-500 shadow-[0_0_25px_rgba(192,38,211,0.4)]',
    sorted: 'bg-gradient-to-t from-emerald-600/90 to-emerald-400/90 dark:from-emerald-700/70 dark:to-emerald-400/70 shadow-[0_4px_15px_rgba(16,185,129,0.15)]',
  };

  const isSpec = state !== 'default' && state !== 'sorted';

  return (
    <div 
      className={`group relative w-full h-full flex flex-col items-center justify-end px-[1px] sm:px-[2px] transition-all duration-500 ${dimmed ? 'opacity-40 grayscale-[0.3]' : 'opacity-100'}`}
      style={{ zIndex: isSpec ? 20 : 1 }}
    >
      {/* Dynamic Glow Effect for Active Elements */}
      <AnimatePresence>
        {isSpec && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -inset-2 rounded-full bg-white/20 dark:bg-white/5 blur-xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Floating Value Label */}
      {showValue && (
        <motion.div
          animate={{ 
            y: `-${h}%`, // Perfectly match bar height percentage
            opacity: 1,
            scale: isSpec ? 1.2 : 1
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute pointer-events-none whitespace-nowrap flex flex-col items-center z-30`}
          style={{ marginBottom: '1.25rem' }} // Add fixed pixel gap above the bar
        >
          <span className={cn(
            "text-[10px] sm:text-[11px] font-black tabular-nums tracking-tighter transition-colors duration-300",
            isSpec ? "text-zinc-900 dark:text-white drop-shadow-md scale-110" : "text-zinc-400 dark:text-zinc-500"
          )}>
            {value}
          </span>
          {isSpec && (
            <motion.div 
               initial={{ height: 0 }}
               animate={{ height: 8 }}
               className={cn(
                 "w-0.5 rounded-full mt-0.5 shadow-sm",
                 state === 'swap' ? 'bg-rose-500' : state === 'compare' ? 'bg-amber-500' : 'bg-blue-500'
               )} 
            />
          )}
        </motion.div>
      )}

      {/* The Bar Itself */}
      <motion.div
        layout
        initial={{ height: 0 }}
        animate={{ 
          height: `${h}%`,
          filter: isSpec ? 'brightness(1.1)' : 'brightness(1)'
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 25, 
          mass: 0.5 
        }}
        className={`w-full rounded-t-xl relative transition-all duration-300 ${colorMap[state]} border-t border-x border-white/30 dark:border-white/5 overflow-hidden active:scale-95 cursor-default shadow-sm`}
      >
        {/* Shine/Reflection effect */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-none" />
        
        {/* Subtle pattern for texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:4px_4px]" />
      </motion.div>
    </div>
  );
}

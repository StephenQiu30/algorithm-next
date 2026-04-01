'use client';

import React from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { SORTING_ALGORITHMS, SortingAlgorithmId } from '@/lib/sortingAlgorithms';
import { Bar, BarState } from './Bar';
import { CodeHighlighter } from './CodeHighlighter';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Info, Code2, Sparkles, Activity, Settings2, Play, Pause, StepForward, StepBack, Shuffle, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

const ACTION_LABEL: Record<string, string> = {
  compare: '比较',
  swap: '交换',
  overwrite: '写入',
  pivot: '枢轴点',
  markSorted: '归位',
  done: '排序完成',
};

export function SortingVisualizer({ initialAlgorithmId }: { initialAlgorithmId?: SortingAlgorithmId }) {
  const scopeRef = React.useRef<HTMLDivElement>(null);
  const {
    array,
    size,
    setSize,
    algorithmId,
    setAlgorithmId,
    speed,
    setSpeed,
    isPlaying,
    handlePlayPause,
    reset,
    activeIndices,
    sortedIndices,
    algorithms,
    currentStep,
    totalSteps,
    stepForward,
    stepBack,
    metrics,
    currentStepInfo,
    setArrayFromInput,
  } = useSortingVisualizer(10, initialAlgorithmId);

  const maxValue = Math.max(...array, 1);
  const activeSet = React.useMemo(() => new Set(activeIndices), [activeIndices]);
  const sortedSet = React.useMemo(() => new Set(sortedIndices), [sortedIndices]);
  
  const actionTone = React.useMemo(() => {
    switch (currentStepInfo?.action) {
      case 'compare':
        return { tag: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20', rail: 'bg-amber-500' };
      case 'swap':
        return { tag: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20', rail: 'bg-rose-500' };
      case 'pivot':
        return { tag: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/20', rail: 'bg-fuchsia-500' };
      case 'done':
        return { tag: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20', rail: 'bg-emerald-500' };
      default:
        return { tag: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20', rail: 'bg-blue-500' };
    }
  }, [currentStepInfo?.action]);

  const progressPercent = Math.round((currentStep / Math.max(1, totalSteps)) * 100);

  const [arrayText, setArrayText] = React.useState('');
  const parsedArray = React.useMemo(() => {
    const raw = arrayText.trim();
    if (!raw) return null;
    const nums = raw.split(/[\s,]+/).filter(Boolean).map(Number);
    return nums.every(n => !isNaN(n)) ? nums : null;
  }, [arrayText]);

  // Layout Animation
  useGSAP(
    () => {
      gsap.fromTo(
        ['.sv-board', '.sv-side-panel'],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.1, clearProps: 'all' }
      );
    },
    { scope: scopeRef }
  );

  return (
    <div ref={scopeRef} className="flex flex-col gap-6 lg:h-[calc(100vh-160px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
        
        {/* Left Section (8/12): Board + Immersive Controls */}
        <div className="lg:col-span-8 flex flex-col gap-0 h-full relative">
          
          {/* Top Bar: Algorithm Selector - Simplified */}
          <div className="absolute top-6 inset-x-6 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-between shadow-sm lg:max-w-max mx-auto">
             <ScrollArea className="max-w-[calc(100%-48px)]">
                <div className="flex items-center gap-1">
                  {SORTING_ALGORITHMS.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => setAlgorithmId(algo.id)}
                      disabled={isPlaying}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap",
                        algorithmId === algo.id 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      {algo.shortName || algo.name.replace('排序', '')}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
             </ScrollArea>
             <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700 mx-2" />
             <Popover>
                <PopoverTrigger asChild>
                   <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <Settings2 size={16} />
                   </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 rounded-2xl p-6 shadow-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800" side="bottom" align="end">
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-blue-600">速度 {speed}%</span>
                         </div>
                         <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} max={100} min={1} step={1} />
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">大小 {size}</span>
                         </div>
                         <Slider value={[size]} onValueChange={([v]) => setSize(v)} max={100} min={10} step={1} disabled={isPlaying} />
                      </div>
                      <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                         <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">自定义数据</span>
                         <div className="flex gap-2">
                           <input 
                             value={arrayText}
                             onChange={(e) => setArrayText(e.target.value)}
                             placeholder="1, 5, 8..."
                             className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                           />
                           {parsedArray && (
                             <button 
                               onClick={() => setArrayFromInput(parsedArray)}
                               className="px-3 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold"
                             >
                               Apply
                             </button>
                           )}
                         </div>
                      </div>
                   </div>
                </PopoverContent>
             </Popover>
          </div>

          <div className="sv-board relative flex-1 min-h-[500px] bg-white dark:bg-zinc-950/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all overflow-hidden flex flex-col">
            
            {/* Real-time Monitor - Simplified */}
            <div className="absolute top-24 left-8 z-20 pointer-events-none">
              <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-6 opacity-60">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">比较</span>
                       <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">{metrics.comparisons}</span>
                    </div>
                    <div className="flex flex-col border-l border-zinc-200 dark:border-zinc-800 pl-4">
                       <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">交换</span>
                       <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">{metrics.swaps}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 flex items-end justify-center px-10 pb-28 pt-40 gap-1.5 sm:gap-2">
              {array.map((value, idx) => {
                let state: BarState = 'default';
                if (sortedSet.has(idx)) state = 'sorted';
                else if (activeSet.has(idx)) state = (currentStepInfo?.action as BarState) || 'compare';
                const dimmed = !!currentStepInfo?.range && (idx < currentStepInfo.range[0] || idx > currentStepInfo.range[1]);
                return <Bar key={idx} value={value} maxValue={maxValue} state={state} dimmed={dimmed} showValue={size <= 25} />;
              })}
            </div>

            {/* Step Narrative - Integrated */}
            {currentStepInfo?.description && (
              <div className="absolute bottom-24 inset-x-0 z-30 flex justify-center px-8 pointer-events-none">
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-3 shadow-md flex items-center gap-3 max-w-xl">
                  <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse", actionTone.rail)} />
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-snug">
                    {currentStepInfo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Floating Action Bar (Bottom Center) - Simplified */}
            <div className="absolute bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none">
               <div className="bg-zinc-900 dark:bg-white rounded-2xl p-1 flex items-center gap-1 shadow-lg pointer-events-auto border border-white/5 dark:border-zinc-200">
                  <button 
                    onClick={reset}
                    disabled={isPlaying}
                    className="p-3 rounded-xl text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors disabled:opacity-20"
                    title="洗牌"
                  >
                    <Shuffle size={16} />
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-800 dark:bg-zinc-200 mx-1" />
                  <button 
                    onClick={stepBack}
                    disabled={isPlaying || currentStep === 0}
                    className="p-3 rounded-xl text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors disabled:opacity-20"
                  >
                    <StepBack size={16} />
                  </button>
                  <button 
                    onClick={handlePlayPause}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95",
                      isPlaying 
                        ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900" 
                        : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    )}
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button 
                    onClick={stepForward}
                    disabled={isPlaying || currentStep === totalSteps}
                    className="p-3 rounded-xl text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors disabled:opacity-20"
                  >
                    <StepForward size={16} />
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-800 dark:bg-zinc-200 mx-1" />
                  <div className="px-4 py-2 flex flex-col items-center min-w-[64px]">
                     <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{progressPercent}%</span>
                     <div className="text-[9px] font-bold text-zinc-500 tabular-nums">Step {currentStep}</div>
                  </div>
               </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-100 dark:bg-zinc-900/50">
              <div className={cn("h-full transition-all duration-300", actionTone.rail)} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Right Section (4/12): Code */}
        <div className="lg:col-span-4 flex flex-col gap-0 h-full sv-side-panel">
          <div className="flex items-center gap-2 mb-4 pl-2">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">源码执行同步</span>
          </div>
          <CodeHighlighter algorithmId={algorithmId} currentLine={currentStepInfo?.line} />
        </div>
      </div>
    </div>
  );
}

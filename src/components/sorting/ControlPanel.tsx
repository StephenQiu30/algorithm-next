import { useMemo, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Pause, Play, Shuffle, StepBack, StepForward } from 'lucide-react';
import { SORTING_ALGORITHM_NAME_BY_ID, SortingAlgorithmId } from '@/lib/sortingAlgorithms';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ControlPanelProps {
  algorithms: SortingAlgorithmId[];
  selectedAlgorithmId: SortingAlgorithmId;
  onSelectAlgorithmId: (alg: SortingAlgorithmId) => void;
  size: number;
  onSizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  onStepBack: () => void;
  onStepForward: () => void;
  metrics: { comparisons: number; swaps: number; overwrites: number };
  onApplyArrayInput: (arr: number[]) => void;
  compact?: boolean;
}

export function ControlPanel({
  algorithms,
  selectedAlgorithmId,
  onSelectAlgorithmId,
  size,
  onSizeChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  currentStep,
  totalSteps,
  onApplyArrayInput,
  compact = false,
}: ControlPanelProps) {
  const [arrayText, setArrayText] = useState<string>('');
  const parsedArray = useMemo(() => {
    const raw = arrayText.trim();
    if (!raw) return null;
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => Number.isNaN(n))) return null;
    return nums;
  }, [arrayText]);

  const canStep = !isPlaying && totalSteps > 0;
  const canBack = canStep && currentStep > 0;
  const canForward = canStep && currentStep < totalSteps;

  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all overflow-hidden',
        compact ? 'max-w-full' : 'mx-auto max-w-5xl'
      )}
    >
      <div className={cn('flex flex-col', compact ? 'gap-3 p-6' : 'gap-4 p-8')}>
        <div className="flex justify-between items-center pl-1">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">算法选择</label>
          <span className="text-[10px] font-black tabular-nums py-1 px-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {SORTING_ALGORITHM_NAME_BY_ID[selectedAlgorithmId]}
          </span>
        </div>
        <Tabs
          value={selectedAlgorithmId}
          onValueChange={(v) => onSelectAlgorithmId(v as SortingAlgorithmId)}
        >
          <ScrollArea className="-mx-1 px-1">
            <TabsList className="h-11 w-max rounded-full bg-zinc-100 p-1 dark:bg-zinc-800/50">
              {algorithms.map((id) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  disabled={isPlaying}
                  className={cn(
                    'h-9 rounded-full px-3 text-[11px] font-black',
                    'data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm',
                    'dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-100',
                    'disabled:opacity-40'
                  )}
                >
                  {SORTING_ALGORITHM_NAME_BY_ID[id]}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Primary Playback Bar */}
      <div className={cn('flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800/50', compact ? 'px-6 pb-6' : 'px-8 pb-10')}>
        <div className="flex-1 flex items-center gap-3">
          <button
            onClick={onStepBack}
            disabled={!canBack}
            className="flex-shrink-0 flex items-center justify-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all shadow-sm disabled:opacity-20"
            title="上一步"
          >
            <StepBack size={20} />
          </button>

          <button
            onClick={onPlayPause}
            className={`group flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm shadow-sm transition-all duration-300 active:scale-95 ${
              isPlaying 
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:shadow-lg' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25 hover:shadow-lg'
            }`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            <span className="tracking-tight">{isPlaying ? '暂停执行' : '开始排序'}</span>
          </button>

          <button
            onClick={onStepForward}
            disabled={!canForward}
            className="flex-shrink-0 flex items-center justify-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all shadow-sm disabled:opacity-20"
            title="下一步"
          >
            <StepForward size={20} />
          </button>
        </div>

        <button
          onClick={onReset}
          disabled={isPlaying}
          className="flex-shrink-0 flex items-center justify-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-30 shadow-sm"
          title="重新打乱数组"
        >
          <Shuffle size={20} />
        </button>
      </div>

      {/* Main Configuration Grid */}
      <div className={cn('flex flex-col', compact ? 'gap-6 px-6 pb-6' : 'gap-10 px-8 pb-8')}>
        <div className={cn('flex flex-col', compact ? 'gap-6' : 'gap-8')}>
          {/* Speed Slider */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">动画速度</label>
                <span className="text-[10px] font-black tabular-nums py-1 px-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{speed}%</span>
             </div>
             <Slider.Root
               className="relative flex items-center select-none touch-none w-full h-5"
               defaultValue={[speed]}
               max={100}
               min={1}
               step={1}
               value={[speed]}
               onValueChange={([val]) => onSpeedChange(val)}
             >
               <Slider.Track className="bg-zinc-100 dark:bg-zinc-800 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
               </Slider.Track>
               <Slider.Thumb
                 className="block w-4 h-4 bg-white border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-full hover:scale-125 active:scale-90 transition-transform focus:outline-none ring-offset-4 ring-offset-white dark:ring-offset-zinc-900 focus:ring-2 focus:ring-blue-500"
                 aria-label="Speed"
               />
             </Slider.Root>
          </div>

          {/* Size Slider */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">数组规模</label>
                <span className="text-[10px] font-black tabular-nums py-1 px-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{size}</span>
             </div>
             <Slider.Root
               className="relative flex items-center select-none touch-none w-full h-5"
               defaultValue={[size]}
               max={100}
               min={10}
               step={1}
               value={[size]}
               onValueChange={([val]) => onSizeChange(val)}
               disabled={isPlaying}
             >
               <Slider.Track className="bg-zinc-100 dark:bg-zinc-800 relative grow rounded-full h-[3px]">
                 <Slider.Range className="absolute bg-zinc-900 dark:bg-zinc-100 rounded-full h-full" />
               </Slider.Track>
               <Slider.Thumb
                 className="block w-4 h-4 bg-white border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-full hover:scale-125 active:scale-90 transition-transform focus:outline-none ring-offset-4 ring-offset-white dark:ring-offset-zinc-900 focus:ring-2 focus:ring-blue-500"
                 aria-label="Size"
               />
             </Slider.Root>
          </div>
        </div>

        <details
          className={cn(
            'border-t border-zinc-100 dark:border-zinc-800/50 pt-4',
            compact ? 'pt-4' : 'pt-6'
          )}
          open={!compact}
        >
          <summary className="cursor-pointer list-none select-none">
            <div className="flex items-center justify-between pl-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">自定义数据导入</label>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-600" />
                <div className="w-1 h-1 rounded-full bg-blue-600/30" />
              </div>
            </div>
          </summary>

          <div className={cn('flex flex-col', compact ? 'gap-4 pt-4' : 'gap-6 pt-6')}>
            <div className="relative group transition-all">
              <input
                value={arrayText}
                onChange={(e) => setArrayText(e.target.value)}
                placeholder="例如: 15, 42, 8, 33, 91"
                className={cn(
                  'w-full bg-zinc-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl px-5 text-sm outline-none font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-600 transition-all disabled:opacity-50 shadow-inner',
                  compact ? 'py-4' : 'py-5'
                )}
                disabled={isPlaying}
              />
              {parsedArray && (
                <button
                  onClick={() => onApplyArrayInput(parsedArray)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-lg"
                >
                  Apply
                </button>
              )}
            </div>

            <p className="px-1 text-[9px] text-zinc-400 font-medium italic">
              逗号/空格分隔；应用后同步到左侧图。
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

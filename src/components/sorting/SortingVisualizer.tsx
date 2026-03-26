'use client';

import React from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { SORTING_ALGORITHM_NAME_BY_ID, SortingAlgorithmId } from '@/lib/sortingAlgorithms';
import { Bar, BarState } from './Bar';
import { ControlPanel } from './ControlPanel';
import { CodeHighlighter } from './CodeHighlighter';

const ACTION_LABEL: Record<string, string> = {
  compare: '比较',
  swap: '交换',
  overwrite: '写入',
  pivot: '枢轴',
  markSorted: '归位',
  done: '完成',
};

export function SortingVisualizer({ initialAlgorithmId }: { initialAlgorithmId?: SortingAlgorithmId }) {
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
  const actionLabel = currentStepInfo?.action ? (ACTION_LABEL[currentStepInfo.action] ?? currentStepInfo.action) : null;
  const actionTone = React.useMemo(() => {
    switch (currentStepInfo?.action) {
      case 'compare':
        return {
          tag: 'bg-orange-100/80 dark:bg-orange-900/25 text-orange-700 dark:text-orange-300',
          dot: 'bg-orange-500',
          rail: 'bg-orange-500/70',
        };
      case 'swap':
        return {
          tag: 'bg-rose-100/80 dark:bg-rose-900/25 text-rose-700 dark:text-rose-300',
          dot: 'bg-rose-500',
          rail: 'bg-rose-500/70',
        };
      case 'overwrite':
        return {
          tag: 'bg-orange-100/80 dark:bg-orange-900/25 text-orange-700 dark:text-orange-300',
          dot: 'bg-orange-500',
          rail: 'bg-orange-500/70',
        };
      case 'pivot':
        return {
          tag: 'bg-orange-100/80 dark:bg-orange-900/25 text-orange-700 dark:text-orange-300',
          dot: 'bg-orange-500',
          rail: 'bg-orange-500/70',
        };
      case 'markSorted':
      case 'done':
        return {
          tag: 'bg-emerald-100/80 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          rail: 'bg-emerald-500/70',
        };
      default:
        return {
          tag: 'bg-zinc-100 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300',
          dot: 'bg-zinc-400',
          rail: 'bg-zinc-300/60',
        };
    }
  }, [currentStepInfo?.action]);
  const progressPercent = Math.round((currentStep / Math.max(1, totalSteps)) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left (lg:col-span-7): Visualization Board with All Overlays */}
      <div className="lg:col-span-7">
        <div className="relative w-full h-full min-h-[520px] lg:min-h-[620px] bg-zinc-50 dark:bg-zinc-900/10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center justify-end p-10 sm:p-12 overflow-hidden shadow-sm">
          
          {/* Status Message Overlay - Top Left */}
          <div className="absolute top-8 left-8 sm:top-10 sm:left-10 z-10 transition-all duration-300">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/40 backdrop-blur px-5 py-4 shadow-sm">
              <div className={`absolute left-0 top-0 h-full w-1.5 ${actionTone.rail}`} />
              <div className="flex items-start gap-4">
                <div className="mt-1 flex flex-col items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-blue-600 animate-pulse' : 'bg-zinc-300'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${actionTone.dot}`} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.18em]">执行信息</p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <h2 className="text-[20px] font-black text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                      {currentStepInfo?.message ?? '就绪'}
                    </h2>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {currentStepInfo?.action ? (
                      <span className={`px-2 py-0.5 rounded-md ${actionTone.tag} text-[10px] font-black tracking-wider`}>
                        {actionLabel ?? '执行'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-300 text-[10px] font-black tracking-wider">
                        就绪
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-bold italic tabular-nums">
                      Step {currentStep}/{totalSteps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Overlay - Top Right */}
          <div className="absolute top-8 right-8 sm:top-10 sm:right-10 flex items-center gap-6 sm:gap-8 z-10 text-right transition-all duration-300">
             <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">比较</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums leading-none">{metrics.comparisons}</p>
             </div>
             <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">交换</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums leading-none">{metrics.swaps}</p>
             </div>
             <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">写入</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums leading-none">{metrics.overwrites}</p>
             </div>
             <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-blue-500">已完成</p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-500 tabular-nums leading-none">
                   {progressPercent}%
                </p>
             </div>
          </div>

          <div className="w-full h-[66%] flex items-end justify-center gap-2 sm:gap-3 max-w-4xl">
            {array.map((value, idx) => {
              let state: BarState = 'default';
              if (sortedSet.has(idx)) state = 'sorted';
              else if (activeSet.has(idx)) {
                const action = currentStepInfo?.action;
                if (action === 'compare') state = 'compare';
                else if (action === 'swap') state = 'swap';
                else if (action === 'overwrite') state = 'overwrite';
                else if (action === 'pivot') state = 'pivot';
                else state = 'compare';
              }

              return <Bar key={idx} value={value} maxValue={maxValue} state={state} />;
            })}
          </div>
          
          <div className="absolute bottom-0 left-0 h-1.5 bg-zinc-200 dark:bg-zinc-800 w-full overflow-hidden">
             <div 
               className={`h-full ${actionTone.dot} transition-all duration-300`}
               style={{ width: `${(currentStep / Math.max(1, totalSteps)) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Right (lg:col-span-5): Simplified Console */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="h-full p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 flex flex-col justify-between shadow-sm">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">控制面板</h3>
              </div>
              <ControlPanel
                algorithms={algorithms}
                selectedAlgorithmId={algorithmId}
                onSelectAlgorithmId={setAlgorithmId}
                size={size}
                onSizeChange={setSize}
                speed={speed}
                onSpeedChange={setSpeed}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={reset}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepBack={stepBack}
                onStepForward={stepForward}
                metrics={metrics}
                onApplyArrayInput={setArrayFromInput}
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

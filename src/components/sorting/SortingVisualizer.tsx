'use client';

import React from 'react';
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer';
import { SORTING_ALGORITHMS, SortingAlgorithmId } from '@/lib/sortingAlgorithms';
import { Bar, BarState } from './Bar';
import { ControlPanel } from './ControlPanel';
import { CodeHighlighter } from './CodeHighlighter';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ACTION_LABEL: Record<string, string> = {
  compare: '比较',
  swap: '交换',
  overwrite: '写入',
  pivot: '枢轴',
  markSorted: '归位',
  done: '完成',
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
  const algoInfo = React.useMemo(() => SORTING_ALGORITHMS.find((a) => a.id === algorithmId), [algorithmId]);
  const range = currentStepInfo?.range;
  const oneLiner = React.useMemo(() => {
    switch (algorithmId) {
      case 'bubble':
        return '反复比较相邻两个数，大的往右冒。'
      case 'selection':
        return '每一轮从未排序里挑最小的，放到前面。'
      case 'insertion':
        return '像整理扑克牌：把新牌插到左侧有序区。'
      case 'shell':
        return '先按间隔分组做插入排序，间隔逐渐变小。'
      case 'merge':
        return '不断对半拆开，各自排好，再两两合并。'
      case 'quick':
        return '选一个枢轴，小的放左边，大的放右边，再递归。'
      case 'heap':
        return '把数据变成堆，反复取堆顶放到末尾。'
      case 'radix':
        return '从低位到高位按桶分配并收集，逐位排好。'
      default:
        return '按步骤把无序变有序。'
    }
  }, [algorithmId]);

  useGSAP(
    () => {
      gsap.fromTo(
        ['.sv-board', '.sv-panel'],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.06, clearProps: 'transform,opacity' }
      );
      gsap.fromTo(
        ['.sv-status', '.sv-metrics'],
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.04, delay: 0.12, clearProps: 'transform,opacity' }
      );
    },
    { scope: scopeRef }
  );

  useGSAP(
    () => {
      if (!currentStepInfo?.action) return;
      gsap.fromTo(
        '.sv-status-card',
        { scale: 0.99 },
        { scale: 1, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    },
    { scope: scopeRef, dependencies: [currentStepInfo?.action, currentStepInfo?.message, currentStep] }
  );

  return (
    <div ref={scopeRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch lg:h-[calc(100vh-220px)]">
      {/* Left (lg:col-span-7): Visualization Board with All Overlays */}
      <div className="lg:col-span-7">
        <div className="sv-board relative w-full h-full min-h-[420px] lg:min-h-0 bg-zinc-50 dark:bg-zinc-900/10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center justify-end p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm">
          
          {/* Status Message Overlay - Top Left */}
          <div className="sv-status absolute top-6 left-6 sm:top-8 sm:left-8 z-10 transition-all duration-300 max-w-[70%]">
            <div className="sv-status-card relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/40 backdrop-blur px-5 py-4 shadow-sm">
              <div className={`absolute left-0 top-0 h-full w-1.5 ${actionTone.rail}`} />
              <div className="flex items-start gap-4">
                <div className="mt-1 flex flex-col items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-blue-600 animate-pulse' : 'bg-zinc-300'}`} />
                  <span className={`w-2.5 h-2.5 rounded-full ${actionTone.dot}`} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.18em]">正在做什么</p>
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
          <div className="sv-metrics absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-5 sm:gap-6 z-10 text-right transition-all duration-300">
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

              const dimmed = !!range && (idx < range[0] || idx > range[1]);
              return <Bar key={idx} value={value} maxValue={maxValue} state={state} dimmed={dimmed} />;
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
        <div className="sv-panel h-full overflow-hidden p-6 sm:p-8 lg:p-10 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 flex flex-col shadow-sm lg:sticky lg:top-24">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">控制面板</h3>
              </div>

              {algoInfo && (
                <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/25 backdrop-blur px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.18em]">当前算法</div>
                      <div className="mt-1 text-zinc-900 dark:text-zinc-100 text-lg font-black tracking-tight truncate">
                        {algoInfo.name}
                      </div>
                      <div className="mt-1 text-[12px] font-bold text-zinc-600 dark:text-zinc-300">
                        一句话：{oneLiner}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-full text-[11px] font-black px-2.5 py-1',
                        algoInfo.stability === '稳定'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300'
                          : 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300'
                      )}
                    >
                      {algoInfo.stability}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {algoInfo.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className={cn(
                          'rounded-full text-[10px] font-black px-2.5 py-1',
                          t === '原地' && 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300',
                          t === '分治' && 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-300',
                          t === '非比较' && 'bg-amber-500/10 text-amber-800 border-amber-500/25 dark:text-amber-300',
                          t !== '原地' && t !== '分治' && t !== '非比较' && 'bg-muted/15 text-foreground/70 border-border/10'
                        )}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 px-3 py-2">
                      <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">平均时间</div>
                      <div className="mt-1 text-[12px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {algoInfo.timeComplexity.average}
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 px-3 py-2">
                      <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">最差时间</div>
                      <div className="mt-1 text-[12px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {algoInfo.timeComplexity.worst}
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 px-3 py-2">
                      <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">空间</div>
                      <div className="mt-1 text-[12px] font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {algoInfo.spaceComplexity}
                      </div>
                    </div>
                  </div>

                  {(range || currentStepInfo?.action === 'pivot') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {range && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] font-black px-2.5 py-1 bg-zinc-100/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
                        >
                          区间 [{range[0]}, {range[1]}]
                        </Badge>
                      )}
                      {currentStepInfo?.action === 'pivot' && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] font-black px-2.5 py-1 bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300"
                        >
                          枢轴
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

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
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

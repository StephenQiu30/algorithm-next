'use client'

import React from 'react'
import { useSortingVisualizer } from '@/hooks/useSortingVisualizer'
import { SORTING_ALGORITHMS, SortingAlgorithmId } from '@/lib/sortingAlgorithms'
import { Bar, BarState } from './Bar'
import { CodeHighlighter } from './CodeHighlighter'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  Info,
  Code2,
  Sparkles,
  Activity,
  Settings2,
  Play,
  Pause,
  StepForward,
  StepBack,
  Shuffle,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'

const ACTION_LABEL: Record<string, string> = {
  compare: '比较',
  swap: '交换',
  overwrite: '写入',
  pivot: '枢轴点',
  markSorted: '归位',
  done: '排序完成',
}

export function SortingVisualizer({
  initialAlgorithmId,
}: {
  initialAlgorithmId?: SortingAlgorithmId
}) {
  const scopeRef = React.useRef<HTMLDivElement>(null)
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
  } = useSortingVisualizer(10, initialAlgorithmId)

  const maxValue = Math.max(...array, 1)
  const activeSet = React.useMemo(() => new Set(activeIndices), [activeIndices])
  const sortedSet = React.useMemo(() => new Set(sortedIndices), [sortedIndices])

  const actionTone = React.useMemo(() => {
    switch (currentStepInfo?.action) {
      case 'compare':
        return {
          tag: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
          rail: 'bg-amber-500',
        }
      case 'swap':
        return {
          tag: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
          rail: 'bg-rose-500',
        }
      case 'pivot':
        return {
          tag: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/20',
          rail: 'bg-fuchsia-500',
        }
      case 'done':
        return {
          tag: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
          rail: 'bg-emerald-500',
        }
      default:
        return {
          tag: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
          rail: 'bg-blue-500',
        }
    }
  }, [currentStepInfo?.action])

  const progressPercent = Math.round((currentStep / Math.max(1, totalSteps)) * 100)

  const [arrayText, setArrayText] = React.useState('')
  const parsedArray = React.useMemo(() => {
    const raw = arrayText.trim()
    if (!raw) return null
    const nums = raw
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number)
    return nums.every(n => !isNaN(n)) ? nums : null
  }, [arrayText])

  // Layout Animation
  useGSAP(
    () => {
      gsap.fromTo(
        ['.sv-board', '.sv-side-panel'],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.1, clearProps: 'all' }
      )
    },
    { scope: scopeRef }
  )

  return (
    <div ref={scopeRef} className="flex flex-col gap-6 lg:h-[calc(100vh-160px)]">
      <div className="grid h-full grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Section (8/12): Board + Immersive Controls */}
        <div className="relative flex h-full flex-col gap-0 lg:col-span-8">
          {/* Top Bar: Algorithm Selector - Apple Style */}
          <div className="absolute inset-x-6 top-6 z-40 mx-auto flex items-center justify-between rounded-full bg-card/80 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ring-1 ring-black/5 lg:max-w-max dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:ring-white/10">
            <ScrollArea className="max-w-[calc(100%-48px)]">
              <div className="flex items-center gap-1">
                {SORTING_ALGORITHMS.map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithmId(algo.id)}
                    disabled={isPlaying}
                    className={cn(
                      'rounded-xl px-3 py-1.5 text-[11px] font-bold whitespace-nowrap transition-all',
                      algorithmId === algo.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {algo.shortName || algo.name.replace('排序', '')}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
            <div className="mx-2 h-4 w-[1px] bg-border" />
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-xl p-2 text-muted-foreground transition-colors hover:text-foreground">
                  <Settings2 size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 rounded-2xl border-border bg-card p-6 shadow-xl"
                side="bottom"
                align="end"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                        速度 {speed}%
                      </span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      max={100}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        大小 {size}
                      </span>
                    </div>
                    <Slider
                      value={[size]}
                      onValueChange={([v]) => setSize(v)}
                      max={100}
                      min={10}
                      step={1}
                      disabled={isPlaying}
                    />
                  </div>
                  <div className="space-y-3 border-t border-border pt-4">
                    <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      自定义数据
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={arrayText}
                        onChange={e => setArrayText(e.target.value)}
                        placeholder="1, 5, 8..."
                        className="flex-1 rounded-xl border border-border bg-muted px-3 py-2 text-xs font-bold text-foreground focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      {parsedArray && (
                        <button
                          onClick={() => setArrayFromInput(parsedArray)}
                          className="rounded-xl bg-blue-600 px-3 py-2 text-[10px] font-bold text-white"
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

          <div className="sv-board relative flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-[32px] bg-card shadow-[0_8px_40px_rgba(0,0,0,0.03)] ring-1 ring-black/5 transition-all dark:ring-white/10 dark:shadow-none">
            {/* Real-time Monitor - Simplified */}
            <div className="pointer-events-none absolute top-24 left-8 z-20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-6 opacity-60">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                      比较
                    </span>
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      {metrics.comparisons}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-border pl-4">
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                      交换
                    </span>
                    <span className="text-lg font-bold text-foreground tabular-nums">
                      {metrics.swaps}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="flex flex-1 items-end justify-center gap-1.5 px-10 pt-40 pb-28 sm:gap-2">
              {array.map((value, idx) => {
                let state: BarState = 'default'
                if (sortedSet.has(idx)) state = 'sorted'
                else if (activeSet.has(idx))
                  state = (currentStepInfo?.action as BarState) || 'compare'
                const dimmed =
                  !!currentStepInfo?.range &&
                  (idx < currentStepInfo.range[0] || idx > currentStepInfo.range[1])
                return (
                  <Bar
                    key={idx}
                    value={value}
                    maxValue={maxValue}
                    state={state}
                    dimmed={dimmed}
                    showValue={size <= 25}
                  />
                )
              })}
            </div>

            {/* Step Narrative - Integrated */}
            {currentStepInfo?.description && (
              <div className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center px-8">
                <div className="flex max-w-xl items-center gap-3 rounded-full border border-border/50 bg-card/80 px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl">
                  <div
                    className={cn(
                      'h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full',
                      actionTone.rail
                    )}
                  />
                  <p className="text-xs leading-snug font-semibold text-foreground">
                    {currentStepInfo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Island Action Bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-foreground/90 p-2 shadow-2xl backdrop-blur-2xl text-background">
                <button
                  onClick={reset}
                  disabled={isPlaying}
                  className="rounded-xl p-3 text-background/60 transition-colors hover:text-background disabled:opacity-20"
                  title="洗牌"
                >
                  <Shuffle size={16} />
                </button>
                <div className="mx-1 h-4 w-[1px] bg-background/20" />
                <button
                  onClick={stepBack}
                  disabled={isPlaying || currentStep === 0}
                  className="rounded-full p-3.5 text-background/60 transition-colors hover:text-background disabled:opacity-20"
                >
                  <StepBack size={18} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95',
                    isPlaying
                      ? 'bg-background/20 text-background'
                      : 'bg-background text-foreground shadow-md hover:scale-105'
                  )}
                >
                  {isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={stepForward}
                  disabled={isPlaying || currentStep === totalSteps}
                  className="rounded-full p-3.5 text-background/60 transition-colors hover:text-background disabled:opacity-20"
                >
                  <StepForward size={18} />
                </button>
                <div className="mx-2 h-5 w-[1px] bg-background/20" />
                <div className="flex min-w-[72px] flex-col items-center px-4 py-1">
                  <span className="text-[11px] font-bold tracking-widest text-background uppercase">
                    {progressPercent}%
                  </span>
                  <div className="text-[9px] font-bold text-background/50 tabular-nums">
                    Step {currentStep}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-zinc-100 dark:bg-zinc-900/50">
              <div
                className={cn('h-full transition-all duration-300', actionTone.rail)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Section (4/12): Code */}
        <div className="sv-side-panel flex h-full flex-col gap-0 lg:col-span-4">
          <div className="mb-4 flex items-center gap-2 pl-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              源码执行同步
            </span>
          </div>
          <CodeHighlighter algorithmId={algorithmId} currentLine={currentStepInfo?.line} />
        </div>
      </div>
    </div>
  )
}

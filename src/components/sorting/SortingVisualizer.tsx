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
          <div className="absolute inset-x-6 top-6 z-40 mx-auto flex items-center justify-between rounded-full bg-white/60 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl ring-1 ring-zinc-900/5 lg:max-w-max dark:bg-zinc-900/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:ring-white/10">
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
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    )}
                  >
                    {algo.shortName || algo.name.replace('排序', '')}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
            <div className="mx-2 h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-xl p-2 text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">
                  <Settings2 size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 rounded-2xl border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                side="bottom"
                align="end"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-blue-600 text-zinc-400 uppercase">
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
                      <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
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
                  <div className="space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      自定义数据
                    </span>
                    <div className="flex gap-2">
                      <input
                        value={arrayText}
                        onChange={e => setArrayText(e.target.value)}
                        placeholder="1, 5, 8..."
                        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
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

          <div className="sv-board relative flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-zinc-200/50 ring-1 inset-ring inset-ring-white/50 ring-zinc-900/5 transition-all dark:bg-zinc-950/60 dark:shadow-none dark:ring-zinc-800">
            {/* Real-time Monitor - Simplified */}
            <div className="pointer-events-none absolute top-24 left-8 z-20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-6 opacity-60">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                      比较
                    </span>
                    <span className="text-lg font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                      {metrics.comparisons}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-zinc-200 pl-4 dark:border-zinc-800">
                    <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                      交换
                    </span>
                    <span className="text-lg font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
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
                <div className="flex max-w-xl items-center gap-3 rounded-full border border-zinc-200/50 bg-white/80 px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl dark:border-zinc-800/50 dark:bg-zinc-900/80">
                  <div
                    className={cn(
                      'h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full',
                      actionTone.rail
                    )}
                  />
                  <p className="text-xs leading-snug font-semibold text-zinc-700 dark:text-zinc-300">
                    {currentStepInfo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Island Action Bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-zinc-900/80 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl dark:bg-white/90 dark:shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                <button
                  onClick={reset}
                  disabled={isPlaying}
                  className="rounded-xl p-3 text-zinc-400 transition-colors hover:text-white disabled:opacity-20 dark:hover:text-zinc-900"
                  title="洗牌"
                >
                  <Shuffle size={16} />
                </button>
                <div className="mx-1 h-4 w-[1px] bg-zinc-800 dark:bg-zinc-200" />
                <button
                  onClick={stepBack}
                  disabled={isPlaying || currentStep === 0}
                  className="rounded-full p-3.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-20 dark:text-zinc-500 dark:hover:text-zinc-900"
                >
                  <StepBack size={18} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95',
                    isPlaying
                      ? 'bg-zinc-700 text-white dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-white text-zinc-900 shadow-md hover:scale-105 dark:bg-zinc-900 dark:text-white'
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
                  className="rounded-full p-3.5 text-zinc-400 transition-colors hover:text-white disabled:opacity-20 dark:text-zinc-500 dark:hover:text-zinc-900"
                >
                  <StepForward size={18} />
                </button>
                <div className="mx-2 h-5 w-[1px] bg-zinc-700/50 dark:bg-zinc-300/50" />
                <div className="flex min-w-[72px] flex-col items-center px-4 py-1">
                  <span className="text-[11px] font-bold tracking-widest text-zinc-100 dark:text-zinc-800 uppercase">
                    {progressPercent}%
                  </span>
                  <div className="text-[9px] font-bold text-zinc-500 tabular-nums">
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
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
              源码执行同步
            </span>
          </div>
          <CodeHighlighter algorithmId={algorithmId} currentLine={currentStepInfo?.line} />
        </div>
      </div>
    </div>
  )
}

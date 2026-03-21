'use client'

import React, { useEffect, useState } from 'react'
import { Bar } from './Bar'
import { ControlPanel } from './ControlPanel'
import { useSorting, ArrayPattern } from '@/hooks/useSorting'
import { Card } from '@/components/ui/card'
import { Activity, Clock, Database, Info } from 'lucide-react'

interface SortingVisualizerProps {
  initialAlgorithm?: 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge' | 'shell' | 'heap' | 'radix'
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ initialAlgorithm }) => {
  const {
    array,
    status,
    speed,
    currentAlgorithm,
    currentStepInfo,
    comparisons,
    swaps,
    setCurrentAlgorithm,
    updateSpeed,
    generateArray,
    startSorting,
    pauseSorting,
    stopSorting,
    algorithmDetails
  } = useSorting(initialAlgorithm)

  const [arrayLength, setArrayLength] = useState(50)

  // Initial generation
  useEffect(() => {
    generateArray(arrayLength, 'random')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLengthChange = (len: number) => {
    setArrayLength(len)
    generateArray(len, 'random')
  }

  const handleGenerate = (pattern: ArrayPattern) => {
    generateArray(arrayLength, pattern)
  }

  const maxVal = Math.max(...array, 1) // Prevent division by zero

  const getBarState = (index: number) => {
    if (currentStepInfo.sortedIndices.includes(index)) return 'sorted'
    if (currentStepInfo.swapIndices.includes(index)) return 'swap'
    if (currentStepInfo.activeIndices.includes(index)) return 'compare'
    return 'default'
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-2 md:p-6">
      <div className="text-center space-y-4 mb-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          {algorithmDetails.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          {algorithmDetails.description}
        </p>
      </div>

      {/* Main Visualization Area */}
      <Card className="p-6 md:p-8 bg-background/40 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem] flex flex-col items-center justify-end h-[400px] md:h-[500px] overflow-hidden relative">
        <div className="w-full h-full flex items-end justify-center gap-[1px] md:gap-[2px] px-2 md:px-8">
          {array.map((val, idx) => (
            <Bar
              key={`${idx}-${status === 'idle' ? val : 'sort'}`} // force re-render on true array changes, but allow layout animation during sort
              value={val}
              max={maxVal}
              state={getBarState(idx)}
              width={Math.max(4, 800 / arrayLength)}
            />
          ))}
        </div>

        {/* Floating Info Badge mapping to Apple style details */}
        {currentStepInfo.description && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-popover/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-border flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
             <Info className="w-5 h-5 text-primary" />
             <span className="text-sm font-medium tracking-wide">
               {currentStepInfo.description}
             </span>
          </div>
        )}
      </Card>

      {/* Control Panel */}
      <ControlPanel
        status={status}
        arrayLength={arrayLength}
        onLengthChange={handleLengthChange}
        onGenerate={handleGenerate}
        speed={speed}
        onSpeedChange={updateSpeed}
        algorithm={currentAlgorithm}
        onAlgorithmChange={setCurrentAlgorithm}
        onStart={startSorting}
        onPause={pauseSorting}
        onStop={stopSorting}
      />

      {/* Statistics & Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-transparent border-none shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-bold text-foreground">操作统计</h3>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">比较次数</span>
              <span className="font-mono font-bold text-lg">{comparisons}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">交换次数</span>
              <span className="font-mono font-bold text-lg">{swaps}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-green-500/10 to-transparent border-none shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-bold text-foreground">时间复杂度</h3>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">最优情况</span>
              <span className="font-mono font-bold">{algorithmDetails.timeComplexity.best}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">平均情况</span>
              <span className="font-mono font-bold">{algorithmDetails.timeComplexity.average}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">最坏情况</span>
              <span className="font-mono font-bold">{algorithmDetails.timeComplexity.worst}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-500/10 to-transparent border-none shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Database className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-bold text-foreground">空间复杂度</h3>
          </div>
          <div className="flex items-center justify-center h-[calc(100%-40px)]">
            <span className="text-4xl font-mono font-black text-purple-500/80">
              {algorithmDetails.spaceComplexity}
            </span>
          </div>
        </Card>
      </div>
    </div>
  )
}

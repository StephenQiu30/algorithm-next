import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Play, Pause, Square, Shuffle, ChartBar } from 'lucide-react'
import { SortingStatus, ArrayPattern, useSorting } from '@/hooks/useSorting'
import { AlgorithmType } from '@/types/sorting'
import { sortingAlgorithms } from '@/lib/algorithms'

interface ControlPanelProps {
  status: SortingStatus
  arrayLength: number
  onLengthChange: (val: number) => void
  onGenerate: (pattern: ArrayPattern) => void
  speed: 'slow' | 'medium' | 'fast'
  onSpeedChange: (speed: 'slow' | 'medium' | 'fast') => void
  algorithm: AlgorithmType
  onAlgorithmChange: (algo: AlgorithmType) => void
  onStart: () => void
  onPause: () => void
  onStop: () => void
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  status,
  arrayLength,
  onLengthChange,
  onGenerate,
  speed,
  onSpeedChange,
  algorithm,
  onAlgorithmChange,
  onStart,
  onPause,
  onStop
}) => {
  const isRunning = status === 'running'
  
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem]">
      <div className="flex flex-col gap-6">
        {/* Top Controls: Algorithm & Generate */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground mr-2">算法:</span>
            <div className="flex bg-muted/50 p-1 rounded-full border border-border/50 overflow-x-auto max-w-full">
              {(Object.keys(sortingAlgorithms) as AlgorithmType[]).map((key) => (
                <button
                  key={key}
                  disabled={isRunning}
                  onClick={() => onAlgorithmChange(key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    algorithm === key 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {sortingAlgorithms[key].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isRunning}
              onClick={() => onGenerate('random')}
              className="rounded-full shadow-sm"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              随机数据
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isRunning}
              onClick={() => onGenerate('nearly-sorted')}
              className="rounded-full shadow-sm"
            >
              <ChartBar className="w-4 h-4 mr-2" />
              近乎有序
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isRunning}
              onClick={() => onGenerate('reversed')}
              className="rounded-full shadow-sm"
            >
              <ChartBar className="w-4 h-4 mr-2 rotate-180 transform" />
              逆序数据
            </Button>
          </div>
        </div>

        {/* Sliders: Length and Speed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-muted-foreground">数组长度</span>
              <span className="text-sm font-mono font-bold">{arrayLength}</span>
            </div>
            <Slider 
              disabled={isRunning}
              defaultValue={[arrayLength]} 
              max={200} 
              min={10} 
              step={1}
              onValueChange={(vals) => onLengthChange(vals[0])}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-muted-foreground">播放速度</span>
              <span className="text-sm font-mono font-bold capitalize">
                {speed === 'fast' ? '快' : speed === 'medium' ? '中' : '慢'}
              </span>
            </div>
            <div className="flex bg-muted/50 p-1 rounded-full border border-border/50">
               {['slow', 'medium', 'fast'].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s as any)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                    speed === s 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {s === 'fast' ? '快' : s === 'medium' ? '中' : '慢'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-2">
          {status === 'running' ? (
            <Button 
              size="lg" 
              onClick={onPause}
              className="rounded-full px-8 shadow-lg shadow-primary/25 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Pause className="w-5 h-5 mr-2" />
              暂停
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={status === 'sorted' ? () => onGenerate('random') : onStart}
              className="rounded-full px-8 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90"
            >
              <Play className="w-5 h-5 mr-2" />
              {status === 'sorted' ? '重新生成并开始' : status === 'paused' ? '继续' : '开始排序'}
            </Button>
          )}

          <Button 
            size="lg" 
            variant="outline" 
            onClick={onStop}
            disabled={status === 'idle'}
            className="rounded-full px-8"
          >
            <Square className="w-5 h-5 mr-2" />
            重置
          </Button>
        </div>
      </div>
    </Card>
  )
}

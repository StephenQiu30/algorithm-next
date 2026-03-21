'use client'

import React, { useState } from 'react'
import { sortingAlgorithms } from '@/lib/algorithms'
import { SortingVisualizer } from '@/components/sorting/SortingVisualizer'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Clock, Database } from 'lucide-react'
import { AlgorithmType } from '@/types/sorting'

export function SortingPageClient() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType | null>(null)
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20">
      <div className="text-center space-y-6 pt-10">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-700">
          排序算法
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
          全流程深度可视化教学，每一个算法背后都是人类智慧的结晶。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(sortingAlgorithms).map((algo) => (
          <Card 
            key={algo.key}
            className="p-6 rounded-[2rem] bg-gradient-to-br from-background to-muted/20 border border-border shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 group"
            onClick={() => setSelectedAlgorithm(algo.key as AlgorithmType)}
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {algo.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {algo.description}
              </p>
              
              <div className="pt-4 flex items-center justify-between border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{algo.timeComplexity.average}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>{algo.spaceComplexity}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog 
        open={selectedAlgorithm !== null} 
        onOpenChange={(open) => !open && setSelectedAlgorithm(null)}
      >
        <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl h-[90vh] overflow-y-auto p-0 border-none bg-background/95 backdrop-blur-xl">
          <DialogTitle className="sr-only">排序算法可视化 - {selectedAlgorithm && sortingAlgorithms[selectedAlgorithm]?.name}</DialogTitle>
          {selectedAlgorithm && (
            <div className="p-4 md:p-6 overflow-hidden">
              <SortingVisualizer initialAlgorithm={selectedAlgorithm} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

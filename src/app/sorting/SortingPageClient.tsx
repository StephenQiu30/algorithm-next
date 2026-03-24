'use client'

import React, { useState } from 'react'
import { sortingAlgorithms } from '@/lib/algorithms'
import { SortingVisualizer } from '@/components/sorting/SortingVisualizer'
import { PostCard } from '@/components/blog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlgorithmType } from '@/types/sorting'
import { getAlgorithmContent } from '@/app/actions/getAlgorithmContent'
import { MarkdownRender } from '@/components/blog/markdown-render'

export function SortingPageClient() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType | null>(null)
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const handleOpenAlgorithm = async (key: AlgorithmType) => {
    setSelectedAlgorithm(key)
    setMarkdownContent('> Loading algorithm details...')
    const content = await getAlgorithmContent(key)
    setMarkdownContent(content)
  }
  
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
          <div key={algo.key} className="h-[400px]">
            <PostCard 
              onClick={() => handleOpenAlgorithm(algo.key as AlgorithmType)}
              post={{
                id: algo.key as any,
                title: algo.name,
                content: algo.description,
                userVO: { userName: 'Sorting Algorithm' } as any,
                createTime: new Date().toISOString(),
                thumbNum: 0,
                favourNum: 0
              }}
            />
          </div>
        ))}
      </div>

      <Dialog 
        open={selectedAlgorithm !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAlgorithm(null)
            setMarkdownContent('')
          }
        }}
      >
        <DialogContent className="max-w-[95vw] w-full lg:max-w-[95vw] h-[90vh] overflow-hidden p-0 border-none bg-background/95 backdrop-blur-xl flex flex-col lg:flex-row gap-0">
          <DialogTitle className="sr-only">排序算法可视化 - {selectedAlgorithm && sortingAlgorithms[selectedAlgorithm]?.name}</DialogTitle>
          {selectedAlgorithm && (
            <>
              {/* 左侧/顶部：Markdown 文章区域 */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:border-r border-border/50 custom-scrollbar h-full hidden md:block">
                <MarkdownRender content={markdownContent} />
              </div>
              
              {/* 移动端 Markdown 文章简易显示或可折叠区域（为了不影响全栈可视，暂时在移动端只显示可视化和少量文档，或者上下堆叠） */}
              <div className="flex-none max-h-[40vh] overflow-y-auto p-4 border-b border-border/50 block md:hidden">
                <MarkdownRender content={markdownContent} />
              </div>

              {/* 右侧/底部：可视化控件区域 */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/5 h-full flex flex-col custom-scrollbar">
                <SortingVisualizer initialAlgorithm={selectedAlgorithm} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

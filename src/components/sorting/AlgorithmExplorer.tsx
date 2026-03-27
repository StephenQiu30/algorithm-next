'use client';

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { SortingVisualizer } from './SortingVisualizer';
import { SortingAlgorithmInfo } from '@/lib/sortingAlgorithms';
import { motion } from 'framer-motion';
import { BookOpen, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { MarkdownRender } from '@/components/blog/markdown-render';

export function AlgorithmExplorer({ algorithm, docContent }: { algorithm: SortingAlgorithmInfo, docContent?: string }) {
  return (
    <div className="container mx-auto w-full px-6 py-10 md:py-14 space-y-10 md:space-y-12">
      {/* Breadcrumb & Core Meta */}
      <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
        <Link href="/sorting" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">排序算法</Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{algorithm.name}</span>
      </nav>

      <section className="space-y-8 md:space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 text-[11px] font-black tracking-widest">
            算法详情
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
            {algorithm.name}
          </h1>
          <p className="max-w-3xl text-zinc-600 dark:text-zinc-400 font-medium text-base md:text-lg leading-relaxed">
            {algorithm.description}
          </p>
        </div>

        {/* Minimalist Complexity Row */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em]">时间复杂度 (平均)</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{algorithm.timeComplexity.average}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em]">空间复杂度</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{algorithm.spaceComplexity}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em]">稳定性</span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{algorithm.stability}</span>
          </div>
          <div className="flex gap-4 ml-auto">
             {algorithm.tags.map(tag => (
               <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </section>

      {/* Radix UI Tabs */}
      <Tabs.Root defaultValue="explanation" className="w-full">
        <Tabs.List className="flex gap-8 mb-12 border-b border-zinc-100 dark:border-zinc-800">
          <Tabs.Trigger 
            value="explanation"
            className="pb-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-500 outline-none"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>算法讲解</span>
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="visualization"
            className="pb-4 text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-500 outline-none"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <span>算法可视化</span>
            </div>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="explanation" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-3">
              {docContent ? (
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400">
                  <MarkdownRender content={docContent} />
                </div>
              ) : (
                <div className="py-24 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/50">
                  <p className="text-zinc-400 font-medium">暂无相关文字教程</p>
                </div>
              )}
            </div>

            {/* Subtle TOC */}
            <aside className="hidden lg:block space-y-8 sticky top-12">
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">目录</h3>
                <nav className="flex flex-col gap-4">
                  {[
                    "1. 原理剖析",
                    "2. 核心步骤",
                    "3. 复杂度与稳定性",
                    "4. 适用场景",
                    "5. 示例代码"
                  ].map((item, idx) => (
                    <div key={item} className={`text-sm font-semibold transition-colors cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 ${idx === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`}>
                      {item}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </Tabs.Content>

        <Tabs.Content value="visualization" className="outline-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SortingVisualizer initialAlgorithmId={algorithm.id} />
          </motion.div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

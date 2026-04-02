'use client'

import React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { SortingVisualizer } from './SortingVisualizer'
import { SortingAlgorithmInfo } from '@/lib/sortingAlgorithms'
import { motion } from 'framer-motion'
import { BookOpen, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { MarkdownRender } from '@/components/blog/markdown-render'

export function AlgorithmExplorer({
  algorithm,
  docContent,
}: {
  algorithm: SortingAlgorithmInfo
  docContent?: string
}) {
  return (
    <div className="container mx-auto w-full space-y-10 px-6 py-10 md:space-y-12 md:py-14">
      {/* Breadcrumb & Core Meta */}
      <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
        <Link
          href="/sorting"
          className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          排序算法
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{algorithm.name}</span>
      </nav>

      <section className="space-y-8 md:space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-zinc-900/10 bg-zinc-900/5 px-3 py-1 text-[11px] font-black tracking-widest text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
            算法详情
          </div>
          <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            {algorithm.name}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed font-medium text-zinc-600 md:text-lg dark:text-zinc-400">
            {algorithm.description}
          </p>
        </div>

        {/* Minimalist Complexity Row */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-zinc-100 pt-4 dark:border-zinc-800/50">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
              时间复杂度 (平均)
            </span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {algorithm.timeComplexity.average}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
              空间复杂度
            </span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {algorithm.spaceComplexity}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
              稳定性
            </span>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {algorithm.stability}
            </span>
          </div>
          <div className="ml-auto flex gap-4">
            {algorithm.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Radix UI Tabs */}
      <Tabs.Root defaultValue="explanation" className="w-full">
        <Tabs.List className="mb-12 flex gap-8 border-b border-zinc-100 dark:border-zinc-800">
          <Tabs.Trigger
            value="explanation"
            className="pb-4 text-sm font-bold text-zinc-400 transition-all outline-none hover:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:hover:text-zinc-100 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-500"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>算法讲解</span>
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="visualization"
            className="pb-4 text-sm font-bold text-zinc-400 transition-all outline-none hover:text-zinc-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:hover:text-zinc-100 dark:data-[state=active]:border-blue-500 dark:data-[state=active]:text-blue-500"
          >
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <span>算法可视化</span>
            </div>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="explanation" className="outline-none">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
            <div className="lg:col-span-3">
              {docContent ? (
                <div className="prose prose-zinc dark:prose-invert prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 max-w-none">
                  <MarkdownRender content={docContent} />
                </div>
              ) : (
                <div className="rounded-3xl bg-zinc-50 py-24 text-center dark:bg-zinc-900/50">
                  <p className="font-medium text-zinc-400">暂无相关文字教程</p>
                </div>
              )}
            </div>

            {/* Subtle TOC */}
            <aside className="sticky top-12 hidden space-y-8 lg:block">
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                  目录
                </h3>
                <nav className="flex flex-col gap-4">
                  {[
                    '1. 原理剖析',
                    '2. 核心步骤',
                    '3. 复杂度与稳定性',
                    '4. 适用场景',
                    '5. 示例代码',
                  ].map((item, idx) => (
                    <div
                      key={item}
                      className={`cursor-pointer text-sm font-semibold transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 ${idx === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`}
                    >
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
  )
}

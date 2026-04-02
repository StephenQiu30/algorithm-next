'use client'

import React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { SortingVisualizer } from './SortingVisualizer'
import { SortingAlgorithmInfo } from '@/lib/sortingAlgorithms'
import { motion } from 'framer-motion'
import { BookOpen, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { MarkdownRender } from '@/components/blog/markdown-render'
import { RAGChatPanel } from './RAGChatPanel'

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

      <section className="flex flex-col items-center space-y-6 pt-8 pb-4 text-center md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-zinc-900/10 bg-zinc-900/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
        >
          Algorithm Design
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-zinc-900 to-zinc-600 bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-7xl dark:from-white dark:to-zinc-500"
        >
          {algorithm.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 md:text-xl dark:text-zinc-400"
        >
          {algorithm.description}
        </motion.p>
      </section>

      {/* Apple-Style Bento Box Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4 pb-12 md:grid-cols-4 lg:gap-6"
      >
        <div className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-6 shadow-xl shadow-zinc-200/50 ring-1 inset-ring inset-ring-white/50 ring-zinc-900/5 transition-transform hover:scale-[1.02] dark:bg-zinc-900/50 dark:shadow-none dark:ring-white/10">
          <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
            时间复杂度 (平均)
          </span>
          <span className="mt-4 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {algorithm.timeComplexity.average}
          </span>
        </div>
        <div className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-6 shadow-xl shadow-zinc-200/50 ring-1 inset-ring inset-ring-white/50 ring-zinc-900/5 transition-transform hover:scale-[1.02] dark:bg-zinc-900/50 dark:shadow-none dark:ring-white/10">
          <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
            空间复杂度
          </span>
          <span className="mt-4 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {algorithm.spaceComplexity}
          </span>
        </div>
        <div className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-6 shadow-xl shadow-zinc-200/50 ring-1 inset-ring inset-ring-white/50 ring-zinc-900/5 transition-transform hover:scale-[1.02] dark:bg-zinc-900/50 dark:shadow-none dark:ring-white/10">
          <span className="text-[11px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
            稳定性
          </span>
          <span className="mt-4 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {algorithm.stability}
          </span>
        </div>
        <div className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-blue-600 p-6 shadow-xl shadow-blue-600/30 ring-1 ring-zinc-900/5 transition-transform hover:scale-[1.02] dark:bg-blue-600/90 dark:ring-white/10">
          <span className="text-[11px] font-bold tracking-[0.1em] text-blue-200 uppercase">
            算法标签
          </span>
          <div className="mt-4 flex flex-wrap gap-2">
            {algorithm.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-3 py-1 text-[13px] font-bold text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Segmented Control Tabs */}
      <Tabs.Root defaultValue="explanation" className="w-full">
        <div className="mb-12 flex justify-center">
          <Tabs.List className="inline-flex items-center justify-center rounded-full bg-zinc-100 p-1.5 shadow-inner dark:bg-zinc-800/50">
            <Tabs.Trigger
              value="explanation"
              className="group relative flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-bold text-zinc-500 transition-all outline-none data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:data-[state=active]:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen size={18} />
                <span>算法讲解</span>
              </span>
              <div className="absolute inset-0 z-0 scale-95 rounded-full bg-white opacity-0 shadow-sm transition-all group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 dark:bg-zinc-900"></div>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="visualization"
              className="group relative flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-bold text-zinc-500 transition-all outline-none data-[state=active]:text-zinc-900 dark:text-zinc-400 dark:data-[state=active]:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Activity size={18} />
                <span>算法可视化</span>
              </span>
              <div className="absolute inset-0 z-0 scale-95 rounded-full bg-white opacity-0 shadow-sm transition-all group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 dark:bg-zinc-900"></div>
            </Tabs.Trigger>
          </Tabs.List>
        </div>

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

      {/* MVP RAG 聊天面板 */}
      <RAGChatPanel algorithmName={algorithm.name} />
    </div>
  )
}

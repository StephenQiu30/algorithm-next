'use client'

import React, { useRef } from 'react'
import { AlgorithmCard } from '@/components/sorting/AlgorithmCard'
import { SORTING_ALGORITHMS } from '@/lib/sortingAlgorithms'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SortingPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.reveal', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      })
    },
    { scope: containerRef }
  )

  return (
    <main ref={containerRef} className="relative min-h-screen bg-white pb-24 pt-24 dark:bg-zinc-950 overflow-hidden">
      {/* Primary Tinted Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Vibrant Ambient Glows */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 opacity-50 blur-[120px] dark:bg-primary/15" />

      <div className="relative z-10 container mx-auto px-6">
        {/* Fluid Primary Header Section */}
        <header className="mb-20 max-w-4xl pt-16">
          <div className="reveal mb-6 flex items-center gap-2">
            <div className="flex h-7 items-center rounded-full border border-primary/20 bg-primary/5 px-3 shadow-sm transition-colors hover:bg-primary/10">
              <span className="text-[11px] font-bold tracking-wide text-primary">
                Educational Tools
              </span>
            </div>
          </div>
          <h1 className="reveal mb-6 text-5xl font-black tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            引擎级算法沙盘
          </h1>
          <p className="reveal text-lg font-medium leading-relaxed text-zinc-500 md:text-xl dark:text-zinc-400">
            通过高频阵列堆栈刷新，实时拦截每一种排序算法调度带来的微小性能起伏。
          </p>
        </header>

        {/* Algorithm Grid - Standard Spacing */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SORTING_ALGORITHMS.map(algo => (
            <div key={algo.id} className="reveal h-full">
              <AlgorithmCard algorithm={algo} href={`/sorting/${algo.id}`} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

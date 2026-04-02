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
    <main ref={containerRef} className="min-h-screen bg-white pt-24 pb-24 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        {/* Header Section - Clean & Minimalist */}
        <header className="mb-20 max-w-3xl pt-16">
          <div className="reveal mb-4 flex items-center gap-2">
            <div className="h-[1px] w-8 bg-blue-600" />
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Educational Tools
            </span>
          </div>
          <h1 className="reveal mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            排序算法可视化
          </h1>
          <p className="reveal text-base leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
            深入探索经典排序算法。通过交互式演示，直观理解每一行代码背后的逻辑演变与性能权衡。
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

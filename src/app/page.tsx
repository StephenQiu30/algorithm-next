'use client'

import React, { useRef, memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PostCard, PostCardSkeleton } from '@/components/blog/post-card'
import { searchPostByPage } from '@/api/search/searchController'
import { ArrowRight, Box, Cpu, Network } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

// 1. Fluid Vibrant Hero
const HeroSection = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.hero-reveal', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        clearProps: 'all',
      })
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="relative flex flex-col items-center justify-center pt-32 pb-24 text-center lg:pt-40"
    >
      <div className="hero-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 shadow-sm transition-all hover:bg-primary/10">
        <Cpu size={14} className="text-primary" />
        <span className="text-xs font-bold tracking-wide text-primary">
          Stephen Cloud Engine v2.0
        </span>
      </div>

      <h1 className="hero-reveal max-w-4xl text-5xl leading-tight font-black tracking-tight text-zinc-900 md:text-6xl lg:text-7xl dark:text-white">
        认知重塑
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {' '}
          交互新感官
        </span>
      </h1>

      <p className="hero-reveal mt-8 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
        基于现代工程化标准的算法可视化平台。使用原生性能流体渲染模块，将晦涩的框架时间线降维为每一次精准的调度步进。
      </p>

      <div className="hero-reveal mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/sorting"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40"
        >
          立即接入
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-white px-8 text-sm font-bold text-zinc-900 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
        >
          查阅文档
        </Link>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

// 2. Fluid Bento Features
const FeaturesSection = memo(() => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.feature-reveal', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative mb-32 w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="feature-reveal group col-span-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Box size={24} />
          </div>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            引擎级可视化沙盘
          </h3>
          <p className="mt-3 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            获取接近底层的操控权。通过高频阵列堆栈刷新，我们能够在虚拟 DOM 构建中实时拦截每一种算法调度带来的性能流转。
          </p>
        </div>

        {/* Card 2 */}
        <div className="feature-reveal group overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Network size={24} />
          </div>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            RAG 智能导师
          </h3>
          <p className="mt-3 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            基于先进的企业级流式生成引擎嵌入代码块内层，对游标的异常突刺提供亚秒级解析方案。
          </p>
        </div>

        {/* Card 3 - Wide Showcase */}
        <div className="feature-reveal group col-span-1 flex min-h-[200px] flex-col justify-center overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 md:col-span-3 dark:border-zinc-800 dark:bg-zinc-900/30">
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl dark:text-white">
             「 所谓极客，是将细微的变量打磨至完美。」
          </h2>
          <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary">
            <div className="h-[2px] w-8 bg-primary/50" />
            <span>见解哲学 · Core</span>
          </div>
        </div>
      </div>
    </section>
  )
})

FeaturesSection.displayName = 'FeaturesSection'

// 3. Fluid Posts
const FeaturedPosts = () => {
  const [posts, setPosts] = useState<PostAPI.PostVO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await searchPostByPage({
          current: 1,
          pageSize: 6,
          sortField: 'createTime',
          sortOrder: 'descend',
        })
        if (res.code === 0 && res.data?.records) {
          setPosts(res.data.records as unknown as PostAPI.PostVO[])
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setIsLoading(false)
        setTimeout(() => ScrollTrigger.refresh(), 100)
      }
    }
    fetchPosts()
  }, [])

  useGSAP(
    () => {
      if (!isLoading) {
        gsap.from('.post-reveal', {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
          clearProps: 'all',
        })
      }
    },
    { scope: containerRef, dependencies: [isLoading] }
  )

  return (
    <section ref={containerRef} className="mb-32 w-full">
      <div className="mb-10 flex items-center justify-between">
        <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          开发日志 & 见解
        </h3>
        <Link
          href="/blog"
          className="group flex items-center gap-2 text-sm font-bold text-zinc-500 transition-colors hover:text-primary dark:hover:text-primary"
        >
          阅读全部
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-primary/10 dark:bg-zinc-800">
            <ArrowRight size={12} className="text-zinc-600 transition-colors group-hover:text-primary dark:text-zinc-400" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} index={i} />)
          : posts.map(post => (
              <div key={post.id} className="post-reveal h-full transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl">
                <PostCard post={post} />
              </div>
            ))}
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-white transition-colors duration-500 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* SaaS Style Grid Background but with Primary Tint */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Vibrant Ambient Glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 opacity-50 blur-[120px] dark:bg-primary/20" />
      <div className="pointer-events-none absolute top-[40rem] right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 opacity-50 blur-[100px] dark:bg-primary/10" />

      <div className="relative z-10 container mx-auto px-6">
        <HeroSection />
        <FeaturesSection />
        <FeaturedPosts />
      </div>
    </main>
  )
}

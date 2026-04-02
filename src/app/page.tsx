'use client'

import React, { useRef, memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PostCard, PostCardSkeleton } from '@/components/blog/post-card'
import { searchPostByPage } from '@/api/search/searchController'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// --- Sub-components ---

const HeroSection = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.hero-reveal', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all',
      })
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="relative mb-32 flex flex-col items-center justify-between gap-16 pt-16 lg:flex-row lg:items-start"
    >
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Next-Gen Algorithm Platform
          </span>
        </div>

        <h1 className="hero-reveal text-5xl leading-[1.1] font-bold tracking-tight text-zinc-900 select-none lg:text-6xl dark:text-white">
          排序算法
          <br />
          <span className="text-blue-600">交互式教学</span>
        </h1>

        <div className="hero-reveal mx-auto max-w-2xl lg:mx-0">
          <p className="text-base leading-relaxed font-medium text-zinc-500 lg:text-lg dark:text-zinc-400">
            面向排序算法学习：用动画、步骤与指标把“为什么”和“怎么做”讲清楚。
            沉淀代码直觉，在跨越维度的交互中体验算法之美。
          </p>
        </div>

        <div className="hero-reveal flex flex-wrap items-center justify-center gap-4 pt-4 lg:justify-start">
          <Link
            href="/sorting"
            className="group flex items-center gap-2 rounded-xl bg-zinc-900 px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-zinc-900"
          >
            立即探索
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-zinc-200 bg-white px-7 py-3.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          >
            阅读文章
          </Link>
        </div>
      </div>

      <div className="hero-reveal w-full shrink-0 lg:w-[420px]">
        <div className="group relative">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-500 group-hover:border-blue-500/30 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-xl font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                S.
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1 text-emerald-600 dark:text-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-xl leading-tight font-bold tracking-tight text-zinc-900 dark:text-white">
                  在跨越维度的代码中，寻求纯粹的直觉。
                </p>
              </div>

              <Link
                href="/blog"
                className="group/btn flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800"
              >
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase transition-colors group-hover/btn:text-blue-600">
                  Recent Insights
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all group-hover/btn:scale-110 group-hover/btn:rotate-45 dark:border-zinc-800 dark:text-zinc-100">
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

const PhilosophySection = memo(() => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.phi-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative mb-32 w-full border-y border-zinc-100 py-24 dark:border-zinc-800/50"
    >
      <div className="phi-reveal max-w-4xl space-y-8">
        <h2 className="text-3xl leading-tight font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-white">
          「所谓极致，是把细节做到
          <span className="text-blue-600"> 完美</span>
          。」
        </h2>
        <div className="inline-flex items-center gap-4 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          <div className="h-[1px] w-10 bg-zinc-200 dark:bg-zinc-800" />
          <span>見解哲学</span>
        </div>
      </div>
    </section>
  )
})

PhilosophySection.displayName = 'PhilosophySection'

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
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          clearProps: 'all',
        })
      }
    },
    { scope: containerRef, dependencies: [isLoading] }
  )

  return (
    <section ref={containerRef} className="mb-32 w-full">
      <div className="mb-16 flex items-end justify-between">
        <div className="space-y-3">
          <div className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Latest Thoughts
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 lg:text-3xl dark:text-white">
            精选见解
          </h3>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase transition-colors hover:text-blue-600"
        >
          <span>Explore Archive</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} index={i} />)
          : posts.map(post => (
              <div key={post.id} className="post-reveal h-full">
                <PostCard post={post} />
              </div>
            ))}
      </div>
    </section>
  )
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="relative container mx-auto px-6 py-24">
        <HeroSection />
        <PhilosophySection />
        <FeaturedPosts />
      </div>
    </main>
  )
}

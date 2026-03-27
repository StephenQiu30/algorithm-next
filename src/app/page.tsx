'use client'

import React, { useRef, memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PostCard, PostCardSkeleton } from '@/components/blog/post-card'
import { searchPostByPage } from '@/api/search/searchController'

gsap.registerPlugin(ScrollTrigger)

// --- Sub-components ---

const HeroSection = memo(() => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.hero-reveal', {
        y: 80,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        clearProps: 'all',
      })
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="relative mb-32 flex flex-col items-start justify-between gap-16 lg:flex-row"
    >
      <div className="flex-1">
        <div className="hero-reveal bg-primary mb-12 h-1.5 w-16 rounded-full" />
        <h1 className="hero-reveal text-foreground mb-12 text-7xl leading-[0.9] font-black tracking-tighter select-none md:text-8xl lg:text-[10rem]">
          排序算法
          <br />
          交互式教学
        </h1>
        <div className="hero-reveal text-foreground/30 mb-16 flex items-center gap-6 text-[11px] font-black tracking-[0.5em] uppercase">
          <span>可视化</span>
          <span className="bg-border h-1 w-1 rounded-full" />
          <span>逐步讲解</span>
          <span className="bg-border h-1 w-1 rounded-full" />
          <span>复杂度理解</span>
        </div>

        <div className="hero-reveal max-w-xl">
          <p className="text-foreground/80 text-xl leading-relaxed font-black tracking-tight md:text-2xl">
            面向排序算法学习：用动画、步骤与指标把“为什么”和“怎么做”讲清楚。
            <br />
            聚焦核心体验，按 MVP 原则迭代。
          </p>
        </div>
      </div>

      <div className="hero-reveal w-full shrink-0 lg:w-[450px]">
        <div className="group relative">
          <div className="from-primary/10 absolute -inset-2 bg-gradient-to-tr to-transparent opacity-0 blur-2xl transition duration-1000 group-hover:opacity-100" />
          <div className="border-border bg-background/80 relative flex flex-col gap-10 rounded-[48px] border p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] backdrop-blur-3xl transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_48px_96px_-24px_hsl(var(--primary)/0.2)]">
            <div className="flex items-start justify-between">
              <div className="bg-primary text-primary-foreground shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black shadow-xl">
                S.
              </div>
              <div className="pt-2 text-right">
                <p className="text-foreground/50 mb-1 font-mono text-[10px] font-black tracking-[0.3em] uppercase">
                  Status
                </p>
                <div className="flex items-center justify-end gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                  <p className="text-foreground text-xs font-black">当前在线</p>
                </div>
              </div>
            </div>

            <div className="space-y-12 pl-1">
              <p className="text-foreground text-2xl leading-tight font-black tracking-tight">
                在跨越维度的代码中，寻求纯粹的直觉。
                <br />
                在每一次细微的迭代中，沉淀灵感的厚度。
              </p>

              <Link
                href="/blog"
                className="group/btn border-border/60 flex items-center justify-between border-t pt-8"
              >
                <span className="text-foreground/80 group-hover:text-primary text-[11px] font-black tracking-[0.3em] uppercase transition-colors">
                  探索全部见解
                </span>
                <div className="bg-primary group-hover:shadow-primary/30 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover/btn:rotate-45">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
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
      gsap.from(sectionRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        clearProps: 'all',
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="section-reveal border-border/10 mb-32 w-full border-y py-24"
    >
      <h2 className="text-foreground text-4xl leading-[1.1] font-black tracking-tight md:text-6xl lg:text-7xl">
        「所谓极致，
        <br />
        是把微不足道的细节做到
        <span className="text-foreground decoration-border/40 underline decoration-4 underline-offset-[20px]">
          完美
        </span>
        。」
      </h2>
      <p className="text-foreground/60 mt-12 text-[11px] font-black tracking-[0.6em] uppercase">
        — 见解哲学
      </p>
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
        console.error('Failed to fetch posts from ES:', err)
      } finally {
        setIsLoading(false)
        // Refresh ScrollTrigger after content load
        setTimeout(() => ScrollTrigger.refresh(), 100)
      }
    }
    fetchPosts()
  }, [])

  useGSAP(
    () => {
      if (!isLoading) {
        gsap.from('.post-reveal', {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
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
      <div className="mb-24 flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h3 className="text-foreground/60 text-[11px] font-black tracking-[0.8em] uppercase">
            精选见解
          </h3>
          <span className="text-foreground/40 text-xs font-bold italic">/ 06</span>
        </div>
        <Link
          href="/blog"
          className="text-foreground/80 hover:text-foreground group flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all"
        >
          <span className="transition-all group-hover:mr-2">所有见解 archive</span>
          <span>→</span>
        </Link>
      </div>

      <div className="mb-20 grid min-h-[400px] grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} index={i} />)
          : posts.map(post => (
              <div key={post.id} className="post-reveal">
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
    <main className="selection:bg-foreground selection:text-background relative container mx-auto min-h-screen px-6 pt-32 pb-24">
      <HeroSection />
      <PhilosophySection />
      <FeaturedPosts />
    </main>
  )
}

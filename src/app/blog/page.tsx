'use client'

import * as React from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { PostCard } from '@/components/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchPostByPage } from '@/api/search/searchController'
import { BookOpen, FileWarning, Loader2, Plus, Search, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store'

function BlogList() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearchText = searchParams.get('q') || ''
  const { user } = useAppSelector((state: RootState) => state.user)
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 12

  const [posts, setPosts] = React.useState<PostAPI.PostVO[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchText, setSearchText] = React.useState(currentSearchText)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  // 获取文章列表 (From ES directly, userVO is included in the DTO)
  const fetchPosts = React.useCallback(async () => {
    if (currentPage === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)
    try {
      const res = await searchPostByPage({
        current: currentPage,
        pageSize,
        searchText: currentSearchText || undefined,
        sortField: 'createTime',
        sortOrder: 'descend',
      })

      if (res && res.code === 0 && res.data) {
        let records = (res.data.records || []) as PostAPI.PostVO[]
        const totalCount = Number(res.data.total) || 0

        // Map ES response to state. The nested userObj from ES is often named 'user' or 'userVO'
        records = records.map(record => ({
          ...record,
          userVO: record.userVO || (record as any).user,
        }))

        if (currentPage === 1) {
          setPosts(records)
        } else {
          setPosts(prev => {
            const newRecords = records.filter(record => !prev.some(p => p.id === record.id))
            return [...prev, ...newRecords]
          })
        }
        setTotal(totalCount)
      } else {
        setError(res?.message || '加载文章列表失败')
      }
    } catch (err: any) {
      console.error('获取文章列表失败:', err)
      setError('网络请求失败，请尝试刷新页面')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [currentPage, currentSearchText])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchText) {
      params.set('q', searchText)
    } else {
      params.delete('q')
    }
    router.push(`/blog?${params.toString()}`)
    setCurrentPage(1)
  }

  const hasMore = posts.length < total

  useGSAP(
    () => {
      if (!loading) {
        gsap.from('.animate-in', {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        })
      }
    },
    { scope: containerRef, dependencies: [loading] }
  )

  // Infinite Scroll Observer
  React.useEffect(() => {
    if (!hasMore || loading || loadingMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1)
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, loadingMore])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white pb-24 dark:bg-zinc-950 overflow-hidden">
      {/* Primary Tinted Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Vibrant Ambient Glows */}
      <div className="pointer-events-none absolute top-40 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 opacity-50 blur-[120px] dark:bg-primary/15" />

      <div className="relative z-10 container mx-auto w-full px-6 pt-24">
        {/* Fluid Primary Header Section */}
        <div className="mb-14 max-w-3xl space-y-6">
          <div className="animate-in flex items-center gap-2">
            <div className="flex h-7 items-center rounded-full border border-primary/20 bg-primary/5 px-3 shadow-sm transition-colors hover:bg-primary/10">
              <span className="text-[11px] font-bold tracking-wide text-primary">
                Insights & Updates
              </span>
            </div>
          </div>
          
          <h1 className="animate-in text-5xl font-black tracking-tight text-zinc-900 md:text-6xl dark:text-white">
            高级工程技术日志
          </h1>

          <p className="animate-in text-lg font-medium leading-relaxed text-zinc-500 md:text-xl dark:text-zinc-400">
            涵盖大规模渲染、RAG检索优化，以及现代化算法交互平台背后所有的微小代码变迁记录。
          </p>
        </div>

        {/* Minimalist Search Bar with Primary Focus */}
        <div className="mb-16 max-w-xl">
          <div className="animate-in group relative flex items-center rounded-2xl shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="absolute left-5 h-5 w-5 text-zinc-400 transition-colors group-focus-within:text-primary dark:text-zinc-500" />
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="搜索日志与见解..."
                className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-14 pr-6 text-base font-medium text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus-visible:border-primary focus-visible:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus-visible:border-primary"
              />
            </form>
          </div>
        </div>

        {/* Article Grid Container */}
        <div className="min-h-[400px]">
          {loading && currentPage === 1 ? (
            <LoadingSkeleton type="grid" count={6} />
          ) : error ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 text-center">
              <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-[24px]">
                <FileWarning className="text-destructive h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black tracking-tight">{error}</h3>
                <p className="text-foreground/60 text-sm font-bold">暂时无法获取内容，请稍后再试</p>
              </div>
              <Button
                variant="outline"
                onClick={fetchPosts}
                className="h-10 rounded-full border-2 px-6 text-sm font-bold"
              >
                重试加载
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-5 text-center">
              <div className="bg-muted/40 flex h-16 w-16 items-center justify-center rounded-[24px]">
                <BookOpen className="text-muted-foreground/30 h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-foreground/80 text-lg font-bold tracking-tight">
                  未找到相关文章
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {searchText
                    ? `没有找到关于 "${searchText}" 的内容`
                    : '这里静悄悄的，开启你的创作之旅吧'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <div key={post.id} className="animate-in h-full">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infinite Scroll & Footer */}
        <div className="mt-28 flex justify-center pb-40">
          {hasMore ? (
            <div ref={sentinelRef} className="flex items-center gap-3 py-10">
              <Loader2 className="text-primary/60 h-5 w-5 animate-spin" />
              <p className="text-foreground/40 text-sm font-black tracking-tight">
                正在发现更多文章与见解...
              </p>
            </div>
          ) : posts.length > 0 ? (
            <div className="flex flex-col items-center gap-5">
              <div className="via-border/60 h-px w-20 bg-gradient-to-r from-transparent to-transparent" />
              <p className="text-foreground/30 text-[10px] font-black tracking-[0.25em] uppercase">
                已加载全部内容
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      }
    >
      <BlogList />
    </React.Suspense>
  )
}

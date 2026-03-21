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
    <div ref={containerRef} className="bg-background selection:bg-primary/10 relative min-h-screen">
      <div className="relative z-10 container mx-auto w-full px-6 pt-16">
        {/* Refined Hero Section */}
        <div className="mb-12 space-y-6">
          <div className="space-y-3">
            <h1 className="animate-in text-foreground text-4xl leading-tight font-black tracking-tight md:text-5xl lg:text-6xl">
              文章与见解
            </h1>

            <p className="animate-in text-foreground/80 max-w-xl text-lg font-bold tracking-tight">
              分享技术见解、开发实践，以及构建精细软件的思考。
            </p>
          </div>
        </div>

        {/* Minimalist Search Bar */}
        <div className="mb-12 max-w-xl">
          <div className="animate-in group relative flex items-center">
            <Search className="text-foreground/20 group-focus-within:text-foreground/40 absolute left-5 h-4 w-4 transition-all duration-300 group-focus-within:scale-110" />
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="搜索文章、主题..."
                className="border-border/10 bg-muted/20 focus-visible:ring-muted/30 focus-visible:border-border/30 placeholder:text-foreground/20 h-14 w-full rounded-full pr-24 pl-12 text-sm font-black transition-all duration-500 focus-visible:ring-[6px]"
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

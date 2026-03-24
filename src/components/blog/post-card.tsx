'use client'

import * as React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from '@/lib/dayjs'

gsap.registerPlugin(ScrollTrigger)

interface PostCardProps {
  post: Partial<PostAPI.PostVO>
  className?: string
  href?: string
  onClick?: () => void
}

export function PostCard({ post, className, href, onClick }: PostCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const { id, title, content, cover, thumbNum = 0, favourNum = 0, createTime, userVO } = post

  useGSAP(
    () => {
      // Entrance Animation
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
      })
    },
    { scope: cardRef }
  )

  const onMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.005,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const excerpt =
    (
      content
        ?.replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/[#*`>~_]/g, '')
        .trim() || ''
    ).slice(0, 100) + ((content?.length ?? 0) > 100 ? '...' : '')

  const formattedDate = createTime ? dayjs(createTime).format('LL') : ''

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn('group relative h-full cursor-pointer', className)}
    >
      <div className="border-border/10 bg-card/40 hover:border-primary/20 group relative flex h-full flex-col overflow-hidden rounded-[24px] border transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        {/* Cover Area */}
        {cover ? (
          <div className="border-border/10 relative aspect-[16/10] w-full overflow-hidden border-b">
            <img
              src={cover}
              alt={title || ''}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          /* Subtle Typography Cover (Minimalist) */
          <div className="bg-muted/20 border-border/10 relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden border-b p-6">
            <h2 className="text-foreground/40 group-hover:text-primary/40 line-clamp-3 text-center text-xl leading-tight font-black tracking-tight transition-colors md:text-2xl">
              {title || '无标题文章'}
            </h2>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 flex-col space-y-3 p-6">
          <div className="mb-1 flex items-center gap-2">
            <UserAvatar user={userVO} size="sm" className="h-5 w-5 opacity-80" />
            <span className="text-foreground/80 text-[11px] font-bold tracking-tight">
              {userVO?.userName || '匿名用户'}
            </span>
            <span className="text-foreground/30 text-[11px]">·</span>
            <span className="text-foreground/40 text-[11px] font-bold">{formattedDate}</span>
          </div>

          <h3 className="text-foreground group-hover:text-primary text-lg leading-snug font-black tracking-tight transition-all duration-300">
            {title || '无标题'}
          </h3>

          <p className="text-foreground/70 line-clamp-2 text-sm leading-relaxed font-bold">
            {excerpt}
          </p>
        </div>

        {/* Footer with Stats */}
        <div className="flex items-center justify-between px-6 pt-1 pb-5">
          <div className="text-foreground/40 flex items-center gap-4">
            <div className="hover:text-primary/70 flex items-center gap-1.5 transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black">{thumbNum}</span>
            </div>
            <div className="hover:text-primary flex items-center gap-1.5 transition-colors">
              <Bookmark className="h-3.5 w-3.5" />
              <span className="text-[11px] font-black">{favourNum}</span>
            </div>
          </div>

          <div className="text-primary flex -translate-x-1 items-center gap-1.5 text-[12px] font-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            阅读全文
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {onClick ? (
          <button onClick={onClick} className="absolute inset-0 z-20 w-full h-full cursor-pointer border-none bg-transparent" aria-label="查看详情" />
        ) : (
          <Link href={href || `/blog/${id}`} className="absolute inset-0 z-20">
            <span className="sr-only">查看全文</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export function PostCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="shimmer border-border/10 bg-card/40 flex h-full flex-col overflow-hidden rounded-[24px] border"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="bg-muted/20 aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-center gap-2">
          <div className="bg-border/20 h-5 w-5 rounded-full" />
          <div className="bg-border/20 h-3 w-20 rounded" />
        </div>
        <div className="bg-border/20 h-6 w-3/4 rounded" />
        <div className="space-y-2">
          <div className="bg-border/10 h-3 w-full rounded" />
          <div className="bg-border/10 h-3 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}

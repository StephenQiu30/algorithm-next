'use client'

import * as React from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserAvatar } from '@/components/header/user-avatar'
import { ArrowUpRight, Bookmark, Heart, Clock } from 'lucide-react'
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

  const excerpt =
    (
      content
        ?.replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        .replace(/[#*`>~_]/g, '')
        .trim() || ''
    ).slice(0, 70) + ((content?.length ?? 0) > 70 ? '...' : '')

  const formattedDate = createTime ? dayjs(createTime).format('MMM D, YYYY') : ''

  return (
    <div
      ref={cardRef}
      className={cn('group relative h-full cursor-pointer', className)}
    >
      <div className={cn(
        "relative h-full flex flex-col overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300",
        "group-hover:border-blue-500/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
      )}>
        {/* Cover Image Area */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-100 dark:border-zinc-800">
          {cover ? (
             <img
               src={cover}
               alt={title || ''}
               className="h-full w-full object-cover grayscale-[0.2] transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
             />
          ) : (
             <div className="h-full w-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-300 dark:text-zinc-700 font-bold text-xs uppercase tracking-widest">No Cover</span>
             </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <UserAvatar user={userVO} size="sm" className="h-4 w-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                 {userVO?.userName || 'Anonymous'}
               </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-600 font-mono italic">
               {formattedDate}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
              {title || 'Untitled'}
            </h3>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3 text-zinc-400">
               <div className="flex items-center gap-1.5 transition-colors group-hover:text-amber-500">
                  <Heart size={12} className={thumbNum > 0 ? "fill-current" : ""} />
                  <span className="text-[10px] font-bold tabular-nums">{thumbNum}</span>
               </div>
               <div className="flex items-center gap-1.5 transition-colors group-hover:text-blue-500">
                  <Bookmark size={12} className={favourNum > 0 ? "fill-current" : ""} />
                  <span className="text-[10px] font-bold tabular-nums">{favourNum}</span>
               </div>
            </div>
            <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        {onClick ? (
          <button onClick={onClick} className="absolute inset-0 z-20" aria-label="Details" />
        ) : (
          <Link href={href || `/blog/${id}`} className="absolute inset-0 z-20">
            <span className="sr-only">View</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export function PostCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="shimmer border-border/10 bg-card/40 flex h-full flex-col overflow-hidden rounded-[2.5rem] border"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="bg-zinc-100 dark:bg-zinc-900/50 aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col space-y-5 p-7">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-200 dark:bg-zinc-800 h-5 w-5 rounded-full" />
          <div className="bg-zinc-200 dark:bg-zinc-800 h-2 w-20 rounded" />
        </div>
        <div className="bg-zinc-200 dark:bg-zinc-800 h-6 w-3/4 rounded-xl" />
        <div className="space-y-3 pt-2">
          <div className="bg-zinc-100 dark:bg-zinc-900 h-3 w-full rounded-full" />
          <div className="bg-zinc-100 dark:bg-zinc-900 h-3 w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  )
}

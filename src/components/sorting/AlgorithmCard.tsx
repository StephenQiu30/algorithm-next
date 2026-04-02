import Link from 'next/link'
import { Split, Layers, Workflow, Gauge, Shuffle, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface AlgorithmInfo {
  id: string
  name: string
  shortName: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  stability: '稳定' | '不稳定'
  tags: string[]
}

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo
  href: string
}

export function AlgorithmCard({ algorithm, href }: AlgorithmCardProps) {
  const Icon =
    algorithm.id === 'quick'
      ? Split
      : algorithm.id === 'merge'
        ? Layers
        : algorithm.id === 'heap'
          ? Workflow
          : algorithm.id === 'radix'
            ? Gauge
            : Shuffle

  return (
    <Link
      href={href}
      className="group block h-full outline-none"
      aria-label={`进入 ${algorithm.name}`}
    >
      <div
        className={cn(
          'relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all duration-500 will-change-transform dark:border-zinc-800/60 dark:bg-zinc-950/50',
          'hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/15'
        )}
      >
        {/* Subtle Ambient Glow inside Card */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/5 group-hover:to-primary/10 group-hover:opacity-100" />

        {/* Top Section */}
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30">
              <Icon size={20} />
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'h-6 rounded-full border-0 px-3 py-0 text-[10px] font-bold tracking-widest',
                  algorithm.stability === '稳定'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                )}
              >
                {algorithm.stability}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-2xl font-black tracking-tight text-zinc-900 transition-colors group-hover:text-primary dark:text-white">
              {algorithm.shortName || algorithm.name}
            </h3>
            <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase transition-colors group-hover:text-primary/70">
              {algorithm.id} SORT
            </span>
          </div>

          <p className="line-clamp-2 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
            {algorithm.description}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-8 rounded-2xl bg-zinc-50/80 p-4 transition-colors group-hover:bg-primary/5 dark:bg-zinc-900/80 dark:group-hover:bg-primary/10">
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors group-hover:text-primary/60">
                Avg Time
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100">
                {algorithm.timeComplexity.average}
              </span>
            </div>
            <div className="h-8 w-[2px] bg-zinc-200/60 transition-colors group-hover:bg-primary/20 dark:bg-zinc-800/60" />
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors group-hover:text-primary/60">
                Space
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100">
                {algorithm.spaceComplexity}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {algorithm.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="rounded-xl bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-primary/10 group-hover:text-primary dark:bg-zinc-800">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

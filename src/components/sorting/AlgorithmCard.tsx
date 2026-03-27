import Link from 'next/link'
import { ArrowUpRight, Gauge, Layers, Shuffle, Split, Workflow } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface AlgorithmInfo {
  id: string;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  tags: string[];
}

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
  href: string;
  isActive?: boolean;
}

export function AlgorithmCard({ algorithm, href, isActive }: AlgorithmCardProps) {
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

  const tagClass = (tag: string) => {
    switch (tag) {
      case '稳定':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300'
      case '不稳定':
      case '稳定性差':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300'
      case '原地':
        return 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300'
      case '分治':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-300'
      case '非比较':
        return 'bg-amber-500/10 text-amber-800 border-amber-500/25 dark:text-amber-300'
      case '按位处理':
        return 'bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20 dark:text-fuchsia-300'
      case '额外空间':
        return 'bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300'
      case '简单':
        return 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:text-zinc-300'
      default:
        return 'bg-muted/15 text-foreground/70 border-border/10'
    }
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Link
        href={href}
        className={cn(
          'group block h-full focus:outline-none',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-[22px]'
        )}
        aria-label={`查看 ${algorithm.name}`}
      >
        <Card
          className={cn(
            'relative h-full overflow-hidden rounded-[22px] border border-border/10 bg-card/45 shadow-[0_1px_0_rgba(255,255,255,0.5),0_12px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl',
            'transition-all duration-300 will-change-transform',
            'group-hover:-translate-y-1 group-hover:border-border/25 group-hover:bg-card/55 group-hover:shadow-[0_1px_0_rgba(255,255,255,0.55),0_18px_48px_rgba(0,0,0,0.10)]',
            isActive && 'border-border/30'
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 opacity-[0.45] bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(255,255,255,0.55),transparent_55%)] dark:opacity-[0.25] dark:bg-[radial-gradient(1200px_circle_at_0%_0%,rgba(255,255,255,0.18),transparent_55%)]" />
          </div>

          <CardHeader className="relative p-6 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="border-border/15 bg-background/40 text-foreground/80 flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-foreground truncate text-lg leading-snug font-black tracking-tight">
                    {algorithm.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-full text-[11px] font-black px-2.5 py-1',
                        tagClass(algorithm.tags.includes('稳定') ? '稳定' : '不稳定')
                      )}
                    >
                      {algorithm.tags.includes('稳定') ? '稳定' : '不稳定'}
                    </Badge>
                    <div className="text-foreground/40 text-[11px] font-black tracking-[0.16em] uppercase">
                      {algorithm.id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-foreground/45 flex items-center gap-1 text-[12px] font-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                进入
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative px-6 pb-4 pt-0">
            <p className="text-foreground/70 line-clamp-2 text-sm leading-relaxed font-bold">
              {algorithm.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex">
                    <Badge
                      variant="outline"
                      className="bg-muted/15 border-border/10 text-foreground/75 rounded-full text-[11px] font-black px-3 py-1.5"
                    >
                      时间 {algorithm.timeComplexity.average}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px]">
                  最优 {algorithm.timeComplexity.best} · 平均 {algorithm.timeComplexity.average} · 最差 {algorithm.timeComplexity.worst}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex">
                    <Badge
                      variant="outline"
                      className="bg-muted/15 border-border/10 text-foreground/75 rounded-full text-[11px] font-black px-3 py-1.5"
                    >
                      空间 {algorithm.spaceComplexity}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>额外空间复杂度</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>

          <CardFooter className="relative px-6 pb-5 pt-0">
            <div className="flex flex-wrap items-center gap-2">
              {algorithm.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn('rounded-full text-[10px] font-black px-2.5 py-1', tagClass(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </TooltipProvider>
  )
}

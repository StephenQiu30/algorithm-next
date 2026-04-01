import Link from 'next/link'
import { ArrowRight, Clock, Box, Shield, Workflow, Layers, Split, Gauge, Shuffle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface AlgorithmInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stability: '稳定' | '不稳定';
  tags: string[];
}

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
  href: string;
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
    <TooltipProvider delayDuration={150}>
      <Link
        href={href}
        className="group block h-full outline-none"
        aria-label={`进入 ${algorithm.name}`}
      >
        <Card
          className={cn(
            'relative h-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300',
            'group-hover:border-blue-500/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
          )}
        >
          <CardHeader className="relative p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                    <Icon size={18} />
                 </div>
                 <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {algorithm.shortName || algorithm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                         {algorithm.id}
                       </span>
                       <Badge variant="outline" className={cn(
                          "px-2 py-0 h-4 rounded-full border-0 text-[9px] font-bold uppercase tracking-widest",
                          algorithm.stability === '稳定' 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                       )}>
                          {algorithm.stability}
                       </Badge>
                    </div>
                 </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative px-6 pb-6 pt-0 space-y-4">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
               {algorithm.description}
            </p>

            <div className="flex items-center gap-4 pt-2">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Average Time</span>
                  <span className="text-xs font-bold tabular-nums">{algorithm.timeComplexity.average}</span>
               </div>
               <div className="w-[1px] h-6 bg-zinc-100 dark:bg-zinc-800" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Space Comp</span>
                  <span className="text-xs font-bold tabular-nums">{algorithm.spaceComplexity}</span>
               </div>
            </div>
          </CardContent>

          <CardFooter className="relative px-6 pb-6 pt-0">
             <div className="flex flex-wrap gap-1.5 opacity-60">
                {algorithm.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="text-[9px] font-black px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase">
                      {tag}
                   </span>
                ))}
             </div>
          </CardFooter>
        </Card>
      </Link>
    </TooltipProvider>
  )
}

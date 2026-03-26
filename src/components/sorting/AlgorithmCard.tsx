import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
  return (
    <div className="group relative h-full cursor-pointer">
      <div
        className={`border-border/10 bg-card/40 hover:border-border/30 relative flex h-full flex-col overflow-hidden rounded-[22px] border transition-colors duration-200 hover:bg-card/55
          ${isActive ? 'border-border/30' : ''}
        `}
      >
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-foreground text-lg leading-snug font-black tracking-tight">
              {algorithm.name}
            </h3>
            <div className="text-foreground/45 flex items-center gap-1 text-[12px] font-black opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              查看
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <p className="text-foreground/70 line-clamp-2 text-sm leading-relaxed font-bold">
            {algorithm.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-foreground/70 bg-muted/20 border-border/10 text-[11px] font-black px-2.5 py-1.5 rounded-full border">
              时间 {algorithm.timeComplexity.average}
            </span>
            <span className="text-foreground/70 bg-muted/20 border-border/10 text-[11px] font-black px-2.5 py-1.5 rounded-full border">
              空间 {algorithm.spaceComplexity}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pt-0 pb-5">
          <div className="text-foreground/40 flex flex-wrap items-center gap-2">
            {algorithm.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black px-2 py-1 rounded-full bg-muted/20 border border-border/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Link href={href} className="absolute inset-0 z-20">
          <span className="sr-only">查看算法详情</span>
        </Link>
      </div>
    </div>
  );
}

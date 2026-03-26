import { Metadata } from 'next';
import { AlgorithmCard } from '@/components/sorting/AlgorithmCard';
import { SORTING_ALGORITHMS } from '@/lib/sortingAlgorithms';

export const metadata: Metadata = {
  title: 'Sorting Algorithm Visualization | Step-by-Step Learning',
  description: 'Interactive visualization for popular sorting algorithms including Bubble Sort, Merge Sort, Quick Sort, and more.',
};

export default function SortingPage() {
  return (
    <main className="w-full">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 md:py-20">
        <div className="w-full space-y-6 mb-10 md:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 text-[11px] font-black tracking-widest">
            排序算法可视化
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
            经典排序算法
            <span className="block text-blue-600 dark:text-blue-500 mt-2">
              交互式学习
            </span>
          </h1>
          <p className="max-w-3xl text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            深入理解 8 大核心排序算法。通过多维度的实时演示、代码追踪与复杂度分析，掌握数据结构的精髓。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SORTING_ALGORITHMS.map((algo) => (
            <AlgorithmCard key={algo.id} algorithm={algo} href={`/sorting/${algo.id}`} />
          ))}
        </div>
      </div>
    </main>
  );
}

import { Metadata } from 'next'
import { SortingPageClient } from './SortingPageClient'

export const metadata: Metadata = {
  title: '排序算法可视化 | 面向排序算法教学的RAG增强型交互式系统',
  description: '全流程排序算法可视化教学体验。',
}

export default function SortingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background">
      <SortingPageClient />
    </main>
  )
}

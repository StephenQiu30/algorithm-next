import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { SORTING_ALGORITHMS } from '@/lib/sortingAlgorithms'
import { AlgorithmExplorer } from '@/components/sorting/AlgorithmExplorer'

export default async function SortingAlgorithmPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const info = SORTING_ALGORITHMS.find(a => a.id === slug)

  if (!info) notFound()

  const docPath = path.resolve(process.cwd(), 'src/app/sorting/_content', `${slug}.md`)
  let docContent = ''
  try {
    docContent = await readFile(docPath, 'utf8')
  } catch {
    docContent = `# 文档暂缺\n\n路径：${docPath}`
  }

  return (
    <div className="w-full text-zinc-900 dark:text-zinc-100">
      <AlgorithmExplorer algorithm={info} docContent={docContent} />
    </div>
  )
}

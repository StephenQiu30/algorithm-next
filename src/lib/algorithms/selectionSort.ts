import { SortStep } from '@/types/sorting'

export const selectionSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIdx, j],
        snapshot: [...array],
        description: `检查 ${array[j]} 是否小于当前最小值 ${array[minIdx]}`,
      })

      if (array[j] < array[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      const temp = array[minIdx]
      array[minIdx] = array[i]
      array[i] = temp

      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        snapshot: [...array],
        description: `将最小值 ${array[i]} 交换到正确位置 ${i}`,
      })
    }

    steps.push({
      type: 'sorted',
      indices: [i],
      snapshot: [...array],
      description: `元素 ${array[i]} 已到达最终排序位置。`,
    })
  }

  steps.push({
    type: 'sorted',
    indices: [n - 1],
    snapshot: [...array],
    description: `数组已经完全排序！`,
  })

  return steps
}

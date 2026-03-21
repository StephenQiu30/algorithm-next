import { SortStep } from '@/types/sorting'

export const bubbleSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        snapshot: [...array],
        description: `比较元素 ${array[j]} 和 ${array[j + 1]}`,
      })

      if (array[j] > array[j + 1]) {
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp

        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          snapshot: [...array],
          description: `交换元素 ${array[j + 1]} 和 ${array[j]}`,
        })
      }
    }
    steps.push({
      type: 'sorted',
      indices: [n - i - 1],
      snapshot: [...array],
      description: `元素 ${array[n - i - 1]} 已到达最终排序位置。`,
    })
  }

  steps.push({
    type: 'sorted',
    indices: [0],
    snapshot: [...array],
    description: `数组已经完全排序！`,
  })

  return steps
}

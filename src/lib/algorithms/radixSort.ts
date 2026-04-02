import { SortStep } from '@/types/sorting'

export const radixSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  const getMax = (arr: number[]) => {
    let max = arr[0]
    for (let i = 1; i < n; i++) {
      if (arr[i] > max) max = arr[i]
    }
    return max
  }

  const countSort = (arr: number[], exp: number) => {
    const output = new Array(n).fill(0)
    const count = new Array(10).fill(0)

    for (let i = 0; i < n; i++) {
      steps.push({
        type: 'compare',
        indices: [i],
        snapshot: [...array],
        description: `读取元素 ${arr[i]} 在当前数位上的值`,
      })
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--
    }

    for (let i = 0; i < n; i++) {
      array[i] = output[i]
      steps.push({
        type: 'overwrite',
        indices: [i],
        snapshot: [...array],
        description: `将元素 ${array[i]} 从桶中取出并按顺序写回数组`,
      })
    }
  }

  if (n === 0) return steps
  const max = getMax(array)

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countSort(array, exp)
  }

  const allIndices = array.map((_, i) => i)
  steps.push({
    type: 'sorted',
    indices: allIndices,
    snapshot: [...array],
    description: `基数排序完成！`,
  })

  return steps
}

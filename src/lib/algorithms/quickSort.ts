import { SortStep } from '@/types/sorting'

export const quickSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]

  const partition = (low: number, high: number): number => {
    const pivot = array[high]
    steps.push({
      type: 'pivot',
      indices: [high],
      snapshot: [...array],
      description: `选择 ${pivot} 作为基准值 (Pivot)`,
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        snapshot: [...array],
        description: `比较元素 ${array[j]} 与基准值 ${pivot}`,
      })

      if (array[j] < pivot) {
        i++
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp

        if (i !== j) {
          steps.push({
            type: 'swap',
            indices: [i, j],
            snapshot: [...array],
            description: `将 ${array[i]} (小于基准值) 与 ${array[j]} 交换`,
          })
        }
      }
    }

    const temp = array[i + 1]
    array[i + 1] = array[high]
    array[high] = temp

    if (i + 1 !== high) {
      steps.push({
        type: 'swap',
        indices: [i + 1, high],
        snapshot: [...array],
        description: `将基准值 ${array[i + 1]} 放到正确的中间位置`,
      })
    }

    steps.push({
      type: 'sorted',
      indices: [i + 1],
      snapshot: [...array],
      description: `基准值 ${array[i + 1]} 已经在最终排序位置`,
    })

    return i + 1
  }

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    } else if (low === high) {
      steps.push({
        type: 'sorted',
        indices: [low],
        snapshot: [...array],
        description: `单独的元素 ${array[low]} 天然有序`,
      })
    }
  }

  sort(0, array.length - 1)

  return steps
}

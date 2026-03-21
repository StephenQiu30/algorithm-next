import { SortStep } from '@/types/sorting'

export const heapSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  const heapify = (size: number, i: number) => {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2

    if (l < size) {
      steps.push({
        type: 'compare',
        indices: [largest, l],
        snapshot: [...array],
        description: `比较根节点 ${array[largest]} 和左子节点 ${array[l]}`
      })
      if (array[l] > array[largest]) {
        largest = l
      }
    }

    if (r < size) {
      steps.push({
        type: 'compare',
        indices: [largest, r],
        snapshot: [...array],
        description: `比较当前最大值 ${array[largest]} 和右子节点 ${array[r]}`
      })
      if (array[r] > array[largest]) {
        largest = r
      }
    }

    if (largest !== i) {
      const swap = array[i]
      array[i] = array[largest]
      array[largest] = swap
      
      steps.push({
        type: 'swap',
        indices: [i, largest],
        snapshot: [...array],
        description: `交换根节点 ${array[largest]} 和较大的子节点 ${array[i]}`
      })

      heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i)
  }

  for (let i = n - 1; i >= 0; i--) {
    const temp = array[0]
    array[0] = array[i]
    array[i] = temp
    
    steps.push({
      type: 'swap',
      indices: [0, i],
      snapshot: [...array],
      description: `将当前最大元素 ${array[i]} 移动到数组末尾`
    })
    
    steps.push({
      type: 'sorted',
      indices: [i],
      snapshot: [...array],
      description: `元素 ${array[i]} 已到达最终排序位置`
    })

    heapify(i, 0)
  }

  return steps
}

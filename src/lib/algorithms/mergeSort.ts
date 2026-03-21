import { SortStep } from '@/types/sorting'

export const mergeSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]

  const merge = (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1
    const n2 = right - mid
    
    const L = new Array(n1)
    const R = new Array(n2)
    
    for (let i = 0; i < n1; i++) L[i] = array[left + i]
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j]
    
    let i = 0, j = 0, k = left
    
    while (i < n1 && j < n2) {
      steps.push({
        type: 'compare',
        indices: [k, mid + 1 + j], 
        snapshot: [...array],
        description: `比较左右半边当前首元素：${L[i]} 和 ${R[j]}`
      })
      
      if (L[i] <= R[j]) {
        array[k] = L[i]
        i++
      } else {
        array[k] = R[j]
        j++
      }
      
      steps.push({
        type: 'overwrite',
        indices: [k],
        snapshot: [...array],
        description: `将较小的元素 ${array[k]} 放入合并后的原数组位置`
      })
      k++
    }
    
    while (i < n1) {
      array[k] = L[i]
      steps.push({
        type: 'overwrite',
        indices: [k],
        snapshot: [...array],
        description: `复制左侧剩余元素 ${L[i]}`
      })
      i++
      k++
    }
    
    while (j < n2) {
      array[k] = R[j]
      steps.push({
        type: 'overwrite',
        indices: [k],
        snapshot: [...array],
        description: `复制右侧剩余元素 ${R[j]}`
      })
      j++
      k++
    }
  }

  const sort = (left: number, right: number) => {
    if (left >= right) return
    const mid = left + Math.floor((right - left) / 2)
    sort(left, mid)
    sort(mid + 1, right)
    merge(left, mid, right)
  }

  sort(0, array.length - 1)
  
  const allIndices = array.map((_, i) => i)
  steps.push({
    type: 'sorted',
    indices: allIndices,
    snapshot: [...array],
    description: `归并排序完成！`
  })
  
  return steps
}

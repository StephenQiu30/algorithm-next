import { SortStep } from '@/types/sorting'

export const shellSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = array[i]
      let j
      for (j = i; j >= gap; j -= gap) {
        steps.push({
          type: 'compare',
          indices: [j - gap, i], // Visual focus
          snapshot: [...array],
          description: `以步长 ${gap} 进行比较：元素 ${array[j - gap]} 和待插入值 ${temp}`,
        })

        if (array[j - gap] > temp) {
          array[j] = array[j - gap]
          steps.push({
            type: 'overwrite',
            indices: [j],
            snapshot: [...array],
            description: `将 ${array[j]} 向右移动 ${gap} 个位置`,
          })
        } else {
          break
        }
      }

      if (j !== i) {
        array[j] = temp
        steps.push({
          type: 'overwrite',
          indices: [j],
          snapshot: [...array],
          description: `将 ${temp} 插入到间隙位置 ${j}`,
        })
      }
    }
  }

  const allIndices = array.map((_, i) => i)
  steps.push({
    type: 'sorted',
    indices: allIndices,
    snapshot: [...array],
    description: `希尔排序完成！`,
  })

  return steps
}

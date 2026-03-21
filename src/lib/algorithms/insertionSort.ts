import { SortStep } from '@/types/sorting'

export const insertionSort = (arr: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const array = [...arr]
  const n = array.length

  steps.push({
    type: 'sorted',
    indices: [0],
    snapshot: [...array],
    description: `第一个元素默认已排序。`,
  })

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1

    while (j >= 0) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        snapshot: [...array],
        description: `比较元素 ${array[j]} 和待插入值 ${key}`,
      })

      if (array[j] > key) {
        array[j + 1] = array[j]
        steps.push({
          type: 'overwrite',
          indices: [j + 1],
          snapshot: [...array],
          description: `元素 ${array[j]} 比待插入值大，向右移动一位。`,
        })
        j--
      } else {
        break
      }
    }
    
    array[j + 1] = key
    steps.push({
      type: 'overwrite',
      indices: [j + 1],
      snapshot: [...array],
      description: `将 ${key} 插入到位置 ${j + 1}。`,
    })

    steps.push({
      type: 'sorted',
      indices: [i],
      snapshot: [...array],
      description: `前 ${i + 1} 个元素已经排好序。`,
    })
  }

  return steps
}

export type SortAction = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'markSorted' | 'done'

export type SortMetricsDelta = {
  comparisons?: number
  swaps?: number
  overwrites?: number
}

export type SortStep = {
  array: number[]
  activeIndices: number[]
  sortedIndices: number[]
  action?: SortAction
  message?: string
  description?: string // Detailed pedagogical explanation
  line?: number // Current line in the pseudo-code
  range?: [number, number]
  metricsDelta?: SortMetricsDelta
}

export type SortingAlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'shell'
  | 'radix'

export type SortingAlgorithmInfo = {
  id: SortingAlgorithmId
  name: string
  shortName: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  stability: '稳定' | '不稳定'
  tags: string[]
}

export const SORTING_ALGORITHMS: SortingAlgorithmInfo[] = [
  {
    id: 'bubble',
    name: '冒泡排序 (Bubble Sort)',
    shortName: '冒泡',
    description: '通过重复走访要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '稳定',
    tags: ['基础', '交换', '原地'],
  },
  {
    id: 'selection',
    name: '选择排序 (Selection Sort)',
    shortName: '选择',
    description: '每一次从待排序的数据元素中选出最小（或最大）的一个元素，存放在序列的起始位置。',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['基础', '选择', '原地'],
  },
  {
    id: 'insertion',
    name: '插入排序 (Insertion Sort)',
    shortName: '插入',
    description:
      '通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '稳定',
    tags: ['基础', '插入', '原地'],
  },
  {
    id: 'shell',
    name: '希尔排序 (Shell Sort)',
    shortName: '希尔',
    description:
      '通过将整个有序列分割成若干个子序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全部记录进行依次直接插入排序。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['进阶', '插入', '原地'],
  },
  {
    id: 'merge',
    name: '归并排序 (Merge Sort)',
    shortName: '归并',
    description:
      '建立在归并操作上的一种有效的排序算法，该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stability: '稳定',
    tags: ['经典', '分治', '递归'],
  },
  {
    id: 'quick',
    name: '快速排序 (Quick Sort)',
    shortName: '快速',
    description:
      '通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stability: '不稳定',
    tags: ['经典', '分治', '交换'],
  },
  {
    id: 'heap',
    name: '堆排序 (Heap Sort)',
    shortName: '堆',
    description:
      '利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['进阶', '选择', '堆'],
  },
  {
    id: 'radix',
    name: '基数排序 (Radix Sort)',
    shortName: '基数',
    description: '透过键值的部份资讯，将要排序的元素分配至某些“桶”中，借以达到排序的作用。',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n+k)',
    stability: '稳定',
    tags: ['特殊', '桶排序', '非比较'],
  },
]

export const SORTING_ALGORITHM_NAME_BY_ID = SORTING_ALGORITHMS.reduce(
  (acc, a) => {
    acc[a.id] = a.name
    return acc
  },
  {} as Record<SortingAlgorithmId, string>
)

const pushStep = (
  steps: SortStep[],
  arr: number[],
  activeIndices: number[],
  sortedIndices: number[],
  extra?: Omit<SortStep, 'array' | 'activeIndices' | 'sortedIndices'>
) => {
  steps.push({
    array: [...arr],
    activeIndices: [...activeIndices],
    sortedIndices: [...sortedIndices],
    ...extra,
  })
}

export const bubbleSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const sortedIndices: number[] = []
  const n = arr.length

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      pushStep(steps, arr, [j, j + 1], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j]} 与 ${arr[j + 1]}`,
        description: `正在比较相邻的两个元素 ${arr[j]} 和 ${arr[j + 1]}。如果左边的比右边大，就需要交换它们。`,
        line: 4,
        metricsDelta: { comparisons: 1 },
      })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        pushStep(steps, arr, [j, j + 1], sortedIndices, {
          action: 'swap',
          message: `交换 ${arr[j + 1]} 与 ${arr[j]}`,
          description: `因为 ${arr[j + 1]} > ${arr[j]}，它们的位置不对，所以交换它们，让较大的元素向右“冒泡”。`,
          line: 5,
          metricsDelta: { swaps: 1 },
        })
      }
    }
    sortedIndices.push(n - i - 1)
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `元素 ${arr[n - i - 1]} 已归位`,
      description: `本轮遍历结束，最大的元素 ${arr[n - i - 1]} 已经移动到了它最终的正确位置。`,
      line: 2,
    })
  }
  pushStep(steps, arr, [], sortedIndices, {
    action: 'done',
    message: '排序完成',
    description: '所有的元素都已经按照从小到大的顺序排列好了！',
    line: 9,
  })
  return steps
}

export const selectionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const sortedIndices: number[] = []
  const n = arr.length

  for (let i = 0; i < n; i++) {
    let minIdx = i
    pushStep(steps, arr, [i], sortedIndices, {
      action: 'compare',
      message: `假设 ${arr[i]} 为当前最小`,
      description: `从位置 ${i} 开始，我们先假设当前位置的数字 ${arr[i]} 是剩余序列中最小的。`,
      line: 3,
    })

    for (let j = i + 1; j < n; j++) {
      pushStep(steps, arr, [minIdx, j], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j]} 与 最小值 ${arr[minIdx]}`,
        description: `扫描剩余序列，寻找是否还有比 ${arr[minIdx]} 更小的数。`,
        line: 5,
        metricsDelta: { comparisons: 1 },
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        pushStep(steps, arr, [minIdx], sortedIndices, {
          action: 'compare',
          message: `找到新的最小值 ${arr[minIdx]}`,
          description: `找到了一个更小的数 ${arr[minIdx]}，记录下它的位置。`,
          line: 6,
        })
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      pushStep(steps, arr, [i, minIdx], sortedIndices, {
        action: 'swap',
        message: `将最小值 ${arr[i]} 换到位置 ${i}`,
        description: `扫描结束，我们将找到的最小值 ${arr[i]} 与起始位置的数进行交换。`,
        line: 9,
        metricsDelta: { swaps: 1 },
      })
    }
    sortedIndices.push(i)
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `位置 ${i} 的元素已归位`,
      description: `现在，位置 ${i} 上的元素已经是正确顺序中的最小值。`,
      line: 2,
    })
  }
  pushStep(steps, arr, [], sortedIndices, {
    action: 'done',
    message: '排序完成',
    description: '每一轮都选出了剩余序列中的最小值，整个数组已经有序了！',
    line: 11,
  })
  return steps
}

export const insertionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const sortedIndices: number[] = []
  const n = arr.length

  for (let i = 0; i < n; i++) {
    let j = i
    pushStep(steps, arr, [i], sortedIndices, {
      action: 'compare',
      message: `准备插入 ${arr[i]}`,
      description: `准备将元素 ${arr[i]} 插入到左侧已经排好序的区域中。`,
      line: 2,
    })

    while (j > 0 && arr[j - 1] > arr[j]) {
      pushStep(steps, arr, [j - 1, j], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j - 1]} 与 ${arr[j]}`,
        description: `因为 ${arr[j - 1]} 比我们要插入的数大，所以需要把它后移一位，腾出空间。`,
        line: 4,
        metricsDelta: { comparisons: 1 },
      })
      ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      pushStep(steps, arr, [j - 1, j], sortedIndices, {
        action: 'swap',
        message: `向左移动 ${arr[j - 1]}`,
        description: `交换两个相邻位置的内容。`,
        line: 5,
        metricsDelta: { swaps: 1 },
      })
      j--
    }
    sortedIndices.push(i)
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `元素已插入`,
      description: `现在，元素已经找到了在当前有序区域中正确位置并成功插入。`,
      line: 8,
    })
  }
  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    {
      action: 'done',
      message: '排序完成',
      description: '所有的元素都已经像整理扑克牌一样，一张一张插入到了正确的地方。',
      line: 11,
    }
  )
  return steps
}

export const mergeSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const n = arr.length

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      pushStep(steps, arr, [left + i, mid + 1 + j], [], {
        action: 'compare',
        message: `比较 ${leftArr[i]} 与 ${rightArr[j]}`,
        description: `分治法：正在合并两个有序子数组。比较左侧的 ${leftArr[i]} 和右侧的 ${rightArr[j]}。`,
        line: 11, // Map to if (left[i] < right[j])
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      })
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `将较小值 ${arr[k]} 写入合并后的数组`,
        description: `将两个数中的较小值放入临时存储空间，以保持合并后的顺序。`,
        line: 12,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      })
      k++
    }

    while (i < leftArr.length) {
      pushStep(steps, arr, [left + i], [], {
        action: 'compare',
        message: `取左侧剩余元素 ${leftArr[i]}`,
        description: `右侧数组已空，直接将左侧剩余的元素依次放入合并后的数组。`,
        line: 15,
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      })
      arr[k] = leftArr[i]
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `写入 ${arr[k]}`,
        description: `合并剩余元素。`,
        line: 15,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      pushStep(steps, arr, [mid + 1 + j], [], {
        action: 'compare',
        message: `取右侧剩余元素 ${rightArr[j]}`,
        description: `左侧数组已空，直接将右侧剩余的元素依次放入合并后的数组。`,
        line: 15,
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      })
      arr[k] = rightArr[j]
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `写入 ${arr[k]}`,
        description: `合并剩余元素。`,
        line: 15,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      })
      j++
      k++
    }
  }

  const mergeSortHelper = (left: number, right: number) => {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    mergeSortHelper(left, mid)
    mergeSortHelper(mid + 1, right)
    merge(left, mid, right)
  }

  mergeSortHelper(0, n - 1)
  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    {
      action: 'done',
      message: '排序完成',
      description: '通过不断的拆分与合并，所有的元素都已经递归地排列整齐了。',
      line: 6,
    }
  )
  return steps
}

export const quickSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedIndices: number[] = []

  const partition = (low: number, high: number): number => {
    const pivot = arr[high]
    let i = low - 1
    pushStep(steps, arr, [high], sortedIndices, {
      action: 'pivot',
      message: `选择枢轴 ${pivot}`,
      description: `快速排序的核心：分区。我们选择区间末尾的 ${pivot} 作为枢轴，准备将小于它的数移到左边。`,
      line: 10,
      range: [low, high],
    })

    for (let j = low; j < high; j++) {
      pushStep(steps, arr, [j, high], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j]} 与 枢轴 ${pivot}`,
        description: `正在通过比较，决定元素 ${arr[j]} 应该放在枢轴的哪一侧。`,
        line: 13,
        range: [low, high],
        metricsDelta: { comparisons: 1 },
      })
      if (arr[j] < pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        pushStep(steps, arr, [i, j], sortedIndices, {
          action: 'swap',
          message: `由于 ${arr[i]} < 枢轴，将其移到左侧`,
          description: `枢轴左侧存储所有小于它的数，所以我们进行一次交换。`,
          line: 15,
          range: [low, high],
          metricsDelta: { swaps: 1 },
        })
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    pushStep(steps, arr, [i + 1, high], sortedIndices, {
      action: 'swap',
      message: `枢轴 ${arr[i + 1]} 归位`,
      description: `分区完成！现在枢轴已经到了它最终的正确位置，左侧都比它小，右侧都比它大。`,
      line: 18,
      range: [low, high],
      metricsDelta: { swaps: 1 },
    })
    return i + 1
  }

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high)
      sortedIndices.push(pi)
      quickSortHelper(low, pi - 1)
      quickSortHelper(pi + 1, high)
    } else if (low === high) {
      sortedIndices.push(low)
    }
  }

  quickSortHelper(0, n - 1)
  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    {
      action: 'done',
      message: '排序完成',
    }
  )
  return steps
}

export const shellSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedApprox: number[] = []

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let j = i
      while (j - gap >= 0) {
        pushStep(steps, arr, [j - gap, j], sortedApprox, {
          action: 'compare',
          message: `按步长 ${gap} 比较`,
          description: `希尔排序：使用步长 ${gap} 进行分组插入排序。比较间隔为 ${gap} 的两个元素。`,
          line: 7,
          metricsDelta: { comparisons: 1 },
        })
        if (arr[j - gap] <= arr[j]) break
        ;[arr[j - gap], arr[j]] = [arr[j], arr[j - gap]]
        pushStep(steps, arr, [j - gap, j], sortedApprox, {
          action: 'swap',
          message: `交换间隔元素`,
          description: `间隔为 ${gap} 的元素顺序不对，进行交换。`,
          line: 8,
          metricsDelta: { swaps: 1 },
        })
        j -= gap
      }
    }
  }
  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    {
      action: 'done',
      message: '排序完成',
      description: '通过多次不同步长的预排序，数组最终完成了排序。',
      line: 12,
    }
  )
  return steps
}

export const heapSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sortedIndices: number[] = []

  const siftDown = (heapSize: number, root: number) => {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < heapSize) {
      pushStep(steps, arr, [left, largest], sortedIndices, {
        action: 'compare',
        message: `比较根节点与左孩子`,
        description: `堆化过程：比较父节点与左子节点 ${arr[left]}，确保父节点是最大的。`,
        line: 11,
        metricsDelta: { comparisons: 1 },
      })
      if (arr[left] > arr[largest]) largest = left
    }
    if (right < heapSize) {
      pushStep(steps, arr, [right, largest], sortedIndices, {
        action: 'compare',
        message: `比较当前最大值与右孩子`,
        description: `继续比较当前最大值与右子节点 ${arr[right]}。`,
        line: 12,
        metricsDelta: { comparisons: 1 },
      })
      if (arr[right] > arr[largest]) largest = right
    }
    if (largest !== root) {
      ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
      pushStep(steps, arr, [root, largest], sortedIndices, {
        action: 'swap',
        message: `交换父子节点`,
        description: `子节点更大，交换它们以维持大顶堆的性质。`,
        line: 14,
        metricsDelta: { swaps: 1 },
      })
      siftDown(heapSize, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i)

  for (let end = n - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    sortedIndices.push(end)
    pushStep(steps, arr, [0, end], sortedIndices, {
      action: 'swap',
      message: `取堆顶最大值 ${arr[end]}`,
      description: `将当前堆中最大的元素（堆顶）与末尾元素交换，并将其从堆中移除。`,
      line: 4,
      metricsDelta: { swaps: 1 },
    })
    siftDown(end, 0)
  }
  sortedIndices.push(0)
  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    { action: 'done', message: '排序完成' }
  )
  return steps
}

export const radixSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = []
  const arr = [...initialArray].map(v => Math.max(0, Math.floor(v)))
  const n = arr.length
  if (n <= 1) {
    pushStep(
      steps,
      arr,
      [],
      Array.from({ length: n }, (_, i) => i),
      { action: 'done', message: '排序完成' }
    )
    return steps
  }

  const max = Math.max(...arr)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array<number>(n)
    const count = new Array<number>(10).fill(0)

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i]
      pushStep(steps, arr, [i], [], {
        action: 'overwrite',
        message: `按第 ${exp} 位搬运元素`,
        description: `非比较排序：正在根据数字的第 ${exp} 位（个、十、百...）将元素放回原数组。`,
        line: 4,
        metricsDelta: { overwrites: 1 },
      })
    }
  }

  pushStep(
    steps,
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    {
      action: 'done',
      message: '排序完成',
      description: '从低位到高位依次排列，最终实现了整体有序。',
      line: 6,
    }
  )
  return steps
}

export const SORTING_ALGORITHM_MAP: Record<SortingAlgorithmId, (arr: number[]) => SortStep[]> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  shell: shellSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  radix: radixSort,
}

export const SORTING_ALGORITHM_IDS = SORTING_ALGORITHMS.map(a => a.id)

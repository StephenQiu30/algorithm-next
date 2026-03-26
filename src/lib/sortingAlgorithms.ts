export type SortAction =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'pivot'
  | 'markSorted'
  | 'done';

export type SortMetricsDelta = {
  comparisons?: number;
  swaps?: number;
  overwrites?: number;
};

export type SortStep = {
  array: number[];
  activeIndices: number[];
  sortedIndices: number[];
  action?: SortAction;
  message?: string;
  range?: [number, number];
  metricsDelta?: SortMetricsDelta;
};

export type SortingAlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'shell'
  | 'radix';

export type SortingAlgorithmInfo = {
  id: SortingAlgorithmId;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stability: '稳定' | '不稳定';
  tags: string[];
};

export const SORTING_ALGORITHMS: SortingAlgorithmInfo[] = [
  {
    id: 'bubble',
    name: '冒泡排序',
    description: '通过相邻元素的比较和交换，使较大的元素逐渐移动到数组末尾。简单但效率较低，适合教学与小规模数据。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '稳定',
    tags: ['稳定', '原地', '简单'],
  },
  {
    id: 'selection',
    name: '选择排序',
    description: '每一轮在未排序区间选择最小值，放到已排序区间末尾。实现简单但比较次数多。',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['原地', '简单', '不稳定'],
  },
  {
    id: 'insertion',
    name: '插入排序',
    description: '维护一个有序区间，将新元素插入到合适位置。对近乎有序数据表现很好。',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stability: '稳定',
    tags: ['稳定', '原地', '适合近乎有序'],
  },
  {
    id: 'shell',
    name: '希尔排序',
    description: '插入排序的改进版，通过分组（步长）预排序，逐步缩小步长提高整体效率。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n log² n)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['原地', '分组', '不稳定'],
  },
  {
    id: 'merge',
    name: '归并排序',
    description: '分治策略：递归拆分并合并两个有序数组，稳定且时间复杂度稳定。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stability: '稳定',
    tags: ['稳定', '分治', '额外空间'],
  },
  {
    id: 'quick',
    name: '快速排序',
    description: '选择枢轴，将数组划分为两部分递归排序。平均性能优秀，工程中常用。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stability: '不稳定',
    tags: ['分治', '原地', '不稳定'],
  },
  {
    id: 'heap',
    name: '堆排序',
    description: '利用堆结构反复取出最大（或最小）元素并放到末尾，时间复杂度稳定。',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stability: '不稳定',
    tags: ['原地', '稳定性差', '结构化'],
  },
  {
    id: 'radix',
    name: '基数排序',
    description: '按位（从低位到高位）进行稳定分配与收集，适用于整数/定长键排序。',
    timeComplexity: { best: 'O(d·(n + k))', average: 'O(d·(n + k))', worst: 'O(d·(n + k))' },
    spaceComplexity: 'O(n + k)',
    stability: '稳定',
    tags: ['非比较', '稳定', '按位处理'],
  },
];

export const SORTING_ALGORITHM_NAME_BY_ID = SORTING_ALGORITHMS.reduce(
  (acc, a) => {
    acc[a.id] = a.name;
    return acc;
  },
  {} as Record<SortingAlgorithmId, string>
);

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
  });
};

export const bubbleSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const sortedIndices: number[] = [];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      pushStep(steps, arr, [j, j + 1], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j]} 与 ${arr[j + 1]}`,
        metricsDelta: { comparisons: 1 },
      });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        pushStep(steps, arr, [j, j + 1], sortedIndices, {
          action: 'swap',
          message: `交换后：${arr[j]} 与 ${arr[j + 1]}`,
          metricsDelta: { swaps: 1 },
        });
      }
    }
    sortedIndices.push(n - i - 1);
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `一个元素已归位`,
    });
  }
  pushStep(steps, arr, [], sortedIndices, { action: 'done', message: '排序完成' });
  return steps;
};

export const selectionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const sortedIndices: number[] = [];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      pushStep(steps, arr, [minIdx, j], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[minIdx]} 与 ${arr[j]}`,
        metricsDelta: { comparisons: 1 },
      });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      pushStep(steps, arr, [i, minIdx], sortedIndices, {
        action: 'swap',
        message: `交换后：${arr[i]} 与 ${arr[minIdx]}`,
        metricsDelta: { swaps: 1 },
      });
    }
    sortedIndices.push(i);
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `一个元素已归位`,
    });
  }
  pushStep(steps, arr, [], sortedIndices, { action: 'done', message: '排序完成' });
  return steps;
};

export const insertionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const sortedIndices: number[] = [];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      pushStep(steps, arr, [j - 1, j], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j - 1]} 与 ${arr[j]}`,
        metricsDelta: { comparisons: 1 },
      });
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      pushStep(steps, arr, [j - 1, j], sortedIndices, {
        action: 'swap',
        message: `交换后：${arr[j - 1]} 与 ${arr[j]}`,
        metricsDelta: { swaps: 1 },
      });
      j--;
    }
    sortedIndices.push(i); // Approximate sorted region
    pushStep(steps, arr, [], sortedIndices, {
      action: 'markSorted',
      message: `当前元素已插入到有序区域（近似）`,
    });
  }
  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), {
    action: 'done',
    message: '排序完成',
  });
  return steps;
};

export const mergeSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      pushStep(steps, arr, [left + i, mid + 1 + j], [], {
        action: 'compare',
        message: `比较 ${leftArr[i]} 与 ${rightArr[j]}`,
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      });
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `写入 ${arr[k]}`,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      });
      k++;
    }

    while (i < leftArr.length) {
      pushStep(steps, arr, [left + i], [], {
        action: 'compare',
        message: `取左侧 ${leftArr[i]}`,
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      });
      arr[k] = leftArr[i];
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `写入 ${arr[k]}`,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      pushStep(steps, arr, [mid + 1 + j], [], {
        action: 'compare',
        message: `取右侧 ${rightArr[j]}`,
        range: [left, right],
        metricsDelta: { comparisons: 1 },
      });
      arr[k] = rightArr[j];
      pushStep(steps, arr, [k], [], {
        action: 'overwrite',
        message: `写入 ${arr[k]}`,
        range: [left, right],
        metricsDelta: { overwrites: 1 },
      });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (left: number, right: number) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  };

  mergeSortHelper(0, n - 1);
  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), {
    action: 'done',
    message: '排序完成',
  });
  return steps;
};

export const quickSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices: number[] = [];

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;
    pushStep(steps, arr, [high], sortedIndices, {
      action: 'pivot',
      message: `选择枢轴 ${pivot}`,
      range: [low, high],
    });

    for (let j = low; j < high; j++) {
      pushStep(steps, arr, [j, high], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[j]} 与 枢轴 ${pivot}`,
        range: [low, high],
        metricsDelta: { comparisons: 1 },
      });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        pushStep(steps, arr, [i, j], sortedIndices, {
          action: 'swap',
          message: `交换后：${arr[i]} 与 ${arr[j]}`,
          range: [low, high],
          metricsDelta: { swaps: 1 },
        });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    pushStep(steps, arr, [i + 1, high], sortedIndices, {
      action: 'swap',
      message: `枢轴归位：${arr[i + 1]}`,
      range: [low, high],
      metricsDelta: { swaps: 1 },
    });
    return i + 1;
  };

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sortedIndices.push(pi);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedIndices.push(low);
    }
  };

  quickSortHelper(0, n - 1);
  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), {
    action: 'done',
    message: '排序完成',
  });
  return steps;
};

export const shellSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedApprox: number[] = [];

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j - gap >= 0) {
        pushStep(steps, arr, [j - gap, j], sortedApprox, {
          action: 'compare',
          message: `gap=${gap} 比较 ${arr[j - gap]} 与 ${arr[j]}`,
          metricsDelta: { comparisons: 1 },
        });
        if (arr[j - gap] <= arr[j]) break;
        [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
        pushStep(steps, arr, [j - gap, j], sortedApprox, {
          action: 'swap',
          message: `gap=${gap} 交换后：${arr[j - gap]} 与 ${arr[j]}`,
          metricsDelta: { swaps: 1 },
        });
        j -= gap;
      }
    }
  }
  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), { action: 'done', message: '排序完成' });
  return steps;
};

export const heapSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices: number[] = [];

  const siftDown = (heapSize: number, root: number) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize) {
      pushStep(steps, arr, [left, largest], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[left]} 与 ${arr[largest]}`,
        metricsDelta: { comparisons: 1 },
      });
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < heapSize) {
      pushStep(steps, arr, [right, largest], sortedIndices, {
        action: 'compare',
        message: `比较 ${arr[right]} 与 ${arr[largest]}`,
        metricsDelta: { comparisons: 1 },
      });
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      pushStep(steps, arr, [root, largest], sortedIndices, {
        action: 'swap',
        message: `交换后：${arr[root]} 与 ${arr[largest]}`,
        metricsDelta: { swaps: 1 },
      });
      siftDown(heapSize, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(n, i);

  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    sortedIndices.push(end);
    pushStep(steps, arr, [0, end], sortedIndices, {
      action: 'swap',
      message: `取最大值 ${arr[end]} 放到末尾`,
      metricsDelta: { swaps: 1 },
    });
    siftDown(end, 0);
  }
  sortedIndices.push(0);
  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), { action: 'done', message: '排序完成' });
  return steps;
};

export const radixSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...initialArray].map((v) => Math.max(0, Math.floor(v)));
  const n = arr.length;
  if (n <= 1) {
    pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), { action: 'done', message: '排序完成' });
    return steps;
  }

  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array<number>(n);
    const count = new Array<number>(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      pushStep(steps, arr, [i], [], {
        action: 'overwrite',
        message: `exp=${exp} 写入 ${arr[i]}`,
        metricsDelta: { overwrites: 1 },
      });
    }
  }

  pushStep(steps, arr, [], Array.from({ length: n }, (_, i) => i), { action: 'done', message: '排序完成' });
  return steps;
};

export const SORTING_ALGORITHM_MAP: Record<SortingAlgorithmId, (arr: number[]) => SortStep[]> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  shell: shellSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  radix: radixSort,
};

export const SORTING_ALGORITHM_IDS = SORTING_ALGORITHMS.map((a) => a.id);

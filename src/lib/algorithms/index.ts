import { bubbleSort } from './bubbleSort'
import { selectionSort } from './selectionSort'
import { insertionSort } from './insertionSort'
import { quickSort } from './quickSort'
import { mergeSort } from './mergeSort'
import { shellSort } from './shellSort'
import { heapSort } from './heapSort'
import { radixSort } from './radixSort'
import { SortingAlgorithm } from '@/types/sorting'

export const sortingAlgorithms: Record<string, SortingAlgorithm> = {
  bubble: {
    name: '冒泡排序 (Bubble Sort)',
    key: 'bubble',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      '通过重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。',
    generator: bubbleSort,
  },
  selection: {
    name: '选择排序 (Selection Sort)',
    key: 'selection',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      '首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。',
    generator: selectionSort,
  },
  insertion: {
    name: '插入排序 (Insertion Sort)',
    key: 'insertion',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      '通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。',
    generator: insertionSort,
  },
  quick: {
    name: '快速排序 (Quick Sort)',
    key: 'quick',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    description:
      '通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序。',
    generator: quickSort,
  },
  merge: {
    name: '归并排序 (Merge Sort)',
    key: 'merge',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description:
      '建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。',
    generator: mergeSort,
  },
  shell: {
    name: '希尔排序 (Shell Sort)',
    key: 'shell',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n) ~ O(n¹.⁵)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      '第一个突破O(n²)的排序算法，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。',
    generator: shellSort,
  },
  heap: {
    name: '堆排序 (Heap Sort)',
    key: 'heap',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    description:
      '利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。',
    generator: heapSort,
  },
  radix: {
    name: '基数排序 (Radix Sort)',
    key: 'radix',
    timeComplexity: {
      best: 'O(n * k)',
      average: 'O(n * k)',
      worst: 'O(n * k)',
    },
    spaceComplexity: 'O(n + k)',
    description:
      '一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。',
    generator: radixSort,
  },
}

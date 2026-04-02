import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { SortingAlgorithmId } from '@/lib/sortingAlgorithms'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface CodeHighlighterProps {
  algorithmId: SortingAlgorithmId
  currentLine?: number
  theme?: 'dark' | 'light'
}

const ALGORITHM_CODE: Record<SortingAlgorithmId, string> = {
  bubble: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}`,
  selection: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    swap(arr, i, minIdx);
  }
}`,
  insertion: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`,
  merge: `function mergeSort(arr, low, high) {
  if (low < high) {
    let mid = (low + high) / 2;
    mergeSort(arr, low, mid);
    mergeSort(arr, mid + 1, high);
    merge(arr, low, mid, high);
  }
}

function merge(arr, low, mid, high) {
  // Comparing and merging...
  if (left[i] < right[j]) {
    arr[k] = left[i++];
  } else {
    arr[k] = right[j++];
  }
}`,
  quick: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      swap(arr, ++i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
  heap: `function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i);
    maxHeapify(arr, 0, i);
  }
}

function maxHeapify(arr, i, size) {
  let largest = i;
  // Compare with children...
  if (left < size && arr[left] > arr[largest])
    largest = left;
  if (right < size && arr[right] > arr[largest])
    largest = right;
  if (largest !== i) {
    swap(arr, i, largest);
    maxHeapify(arr, largest, size);
  }
}`,
  shell: `function shellSort(arr) {
  for (let gap = n/2; gap > 0; gap /= 2) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j>=gap && arr[j-gap]>temp; j-=gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
}`,
  radix: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; max / exp > 0; exp *= 10) {
    // Counting sort by digit
    countSort(arr, exp);
  }
}`,
}

export function CodeHighlighter({
  algorithmId,
  currentLine,
  theme = 'dark',
}: CodeHighlighterProps) {
  const code = ALGORITHM_CODE[algorithmId] || '// No code available'

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 dark:border-zinc-800/50 dark:bg-zinc-950 dark:shadow-none">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="ml-2 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
            伪代码实现
          </span>
        </div>
      </div>

      {/* Forcing a dark, high-contrast container for the code for professional "Editor" look */}
      <div className="flex min-h-0 flex-1 flex-col bg-[#1e1e1e] dark:bg-zinc-950">
        <ScrollArea className="flex-1">
          <div className="relative py-4">
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: '1.25rem 1.5rem',
                fontSize: '0.85rem',
                lineHeight: '1.7',
                backgroundColor: 'transparent',
                fontFamily: 'JetBrains Mono, Menlo, monospace',
              }}
              showLineNumbers
              wrapLines
              lineProps={lineNumber => {
                const isHigh = lineNumber === currentLine
                return {
                  style: {
                    display: 'block',
                    backgroundColor: isHigh ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    borderLeft: isHigh ? '3px solid #3b82f6' : '3px solid transparent',
                    paddingLeft: isHigh ? 'calc(1.25rem - 3px)' : '1.25rem',
                    transition: 'all 0.3s ease',
                    // Removed the aggressive fading/blurring that caused unreadability
                    opacity: isHigh ? 1 : 0.85,
                  },
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
          <ScrollBar className="bg-white/10" />
        </ScrollArea>
      </div>
    </div>
  )
}

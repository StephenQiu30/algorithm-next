import { useState, useRef, useCallback } from 'react'
import { AlgorithmType, SortStep } from '@/types/sorting'
import { sortingAlgorithms } from '@/lib/algorithms'

export type ArrayPattern = 'random' | 'nearly-sorted' | 'reversed'
export type SortingStatus = 'idle' | 'running' | 'paused' | 'sorted'

const SPEED_MS = {
  slow: 500,
  medium: 100,
  fast: 20
}

export const useSorting = (initialAlgorithm?: AlgorithmType) => {
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [status, setStatus] = useState<SortingStatus>('idle')
  const [speed, setSpeed] = useState<keyof typeof SPEED_MS>('medium')
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>(initialAlgorithm || 'bubble')
  const [currentStepInfo, setCurrentStepInfo] = useState<{
    description: string
    activeIndices: number[]
    sortedIndices: number[]
    swapIndices: number[]
  }>({
    description: '',
    activeIndices: [],
    sortedIndices: [],
    swapIndices: []
  })

  // Counters
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)

  // Refs for tracking async state
  const isPausedRef = useRef(false)
  const isStoppedRef = useRef(false)
  const speedRef = useRef(speed)
  const pendingStepsRef = useRef<SortStep[]>([])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Utility to generate array
  const generateArray = useCallback((size: number, pattern: ArrayPattern = 'random') => {
    isStoppedRef.current = true
    setStatus('idle')
    setComparisons(0)
    setSwaps(0)
    setCurrentStepInfo({
      description: '',
      activeIndices: [],
      sortedIndices: [],
      swapIndices: []
    })

    let newArr: number[] = []
    
    if (pattern === 'random') {
      newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 400) + 20)
    } else if (pattern === 'nearly-sorted') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor((i / size) * 400) + 20)
      for (let i = 0; i < newArr.length; i += 5) {
        if (i + 1 < newArr.length) {
          const temp = newArr[i]
          newArr[i] = newArr[i + 1]
          newArr[i + 1] = temp
        }
      }
    } else if (pattern === 'reversed') {
      newArr = Array.from({ length: size }, (_, i) => Math.floor(((size - i) / size) * 400) + 20)
    }

    setArray([...newArr])
    setOriginalArray([...newArr])
  }, [])

  const updateSpeed = (newSpeed: keyof typeof SPEED_MS) => {
    setSpeed(newSpeed)
    speedRef.current = newSpeed
  }

  const runSteps = async (steps: SortStep[], startIndex = 0) => {
    isStoppedRef.current = false
    isPausedRef.current = false
    setStatus('running')
    
    let compCount = comparisons
    let swapCount = swaps
    const accumulatedSortedIndices = new Set(currentStepInfo.sortedIndices)

    for (let i = startIndex; i < steps.length; i++) {
      if (isStoppedRef.current) break

      while (isPausedRef.current && !isStoppedRef.current) {
        await sleep(100) // Poll for unpause
      }

      if (isStoppedRef.current) break

      const step = steps[i]
      
      if (step.type === 'compare') compCount++
      if (step.type === 'swap') swapCount++
      if (step.type === 'sorted') {
        step.indices.forEach(idx => accumulatedSortedIndices.add(idx))
      }

      setArray([...step.snapshot])
      setComparisons(compCount)
      setSwaps(swapCount)
      
      setCurrentStepInfo({
        description: step.description || '',
        activeIndices: step.type === 'compare' ? step.indices : [],
        swapIndices: step.type === 'swap' || step.type === 'overwrite' ? step.indices : [],
        sortedIndices: Array.from(accumulatedSortedIndices)
      })

      // Pop from pending
      pendingStepsRef.current = steps.slice(i + 1)
      
      // Delay
      await sleep(SPEED_MS[speedRef.current])
    }

    if (!isStoppedRef.current && !isPausedRef.current) {
      setStatus('sorted')
      setCurrentStepInfo(prev => ({
        ...prev,
        activeIndices: [],
        swapIndices: [],
        description: '排序完成！'
      }))
    }
  }

  const startSorting = () => {
    if (status === 'sorted') return
    
    if (status === 'paused') {
      isPausedRef.current = false
      setStatus('running')
      return
    }

    const algo = sortingAlgorithms[currentAlgorithm]
    if (!algo) return

    setComparisons(0)
    setSwaps(0)
    setCurrentStepInfo({
        description: `开始 ${algo.name}...`,
        activeIndices: [],
        sortedIndices: [],
        swapIndices: []
    })

    const steps = algo.generator([...array])
    pendingStepsRef.current = steps
    runSteps(steps)
  }

  const pauseSorting = () => {
    isPausedRef.current = true
    setStatus('paused')
  }

  const stopSorting = () => {
    isStoppedRef.current = true
    isPausedRef.current = false
    setStatus('idle')
    setArray([...originalArray])
    setComparisons(0)
    setSwaps(0)
    setCurrentStepInfo({
      description: '已重置。',
      activeIndices: [],
      sortedIndices: [],
      swapIndices: []
    })
  }

  return {
    array,
    status,
    speed,
    currentAlgorithm,
    currentStepInfo,
    comparisons,
    swaps,
    setCurrentAlgorithm,
    updateSpeed,
    generateArray,
    startSorting,
    pauseSorting,
    stopSorting,
    algorithmDetails: sortingAlgorithms[currentAlgorithm]
  }
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  SORTING_ALGORITHM_IDS,
  SORTING_ALGORITHM_MAP,
  SortingAlgorithmId,
  SortStep,
} from '@/lib/sortingAlgorithms'

type SortMetrics = {
  comparisons: number
  swaps: number
  overwrites: number
}

export const useSortingVisualizer = (
  initialSize: number = 10,
  initialAlgorithmId?: SortingAlgorithmId
) => {
  const [array, setArray] = useState<number[]>([])
  const [size, setSize] = useState<number>(initialSize)
  const [algorithmId, setAlgorithmId] = useState<SortingAlgorithmId>(
    initialAlgorithmId ?? SORTING_ALGORITHM_IDS[0]
  )
  const [speed, setSpeed] = useState<number>(1) // 1 to 100

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [activeIndices, setActiveIndices] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [isSorted, setIsSorted] = useState<boolean>(false)

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [totalSteps, setTotalSteps] = useState<number>(0)
  const [metrics, setMetrics] = useState<SortMetrics>({ comparisons: 0, swaps: 0, overwrites: 0 })

  const stepsRef = useRef<SortStep[]>([])
  const metricsPrefixRef = useRef<SortMetrics[]>([{ comparisons: 0, swaps: 0, overwrites: 0 }])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentStepRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  const resetSteps = useCallback(() => {
    stepsRef.current = []
    metricsPrefixRef.current = [{ comparisons: 0, swaps: 0, overwrites: 0 }]
    setCurrentStep(0)
    setTotalSteps(0)
    setMetrics({ comparisons: 0, swaps: 0, overwrites: 0 })
    setActiveIndices([])
    setSortedIndices([])
    setIsSorted(false)
  }, [])

  const generateArray = useCallback(
    (newSize?: number) => {
      const s = newSize || size
      const newArr = Array.from({ length: s }, () => Math.floor(Math.random() * 100) + 10)
      clearTimer()
      setIsPlaying(false)
      setArray(newArr)
      resetSteps()
    },
    [size, clearTimer, resetSteps]
  )

  useEffect(() => {
    generateArray()
  }, [generateArray])

  const buildSteps = useCallback(
    (baseArray: number[]) => {
      const steps = SORTING_ALGORITHM_MAP[algorithmId]([...baseArray])
      stepsRef.current = steps

      const prefix: SortMetrics[] = [{ comparisons: 0, swaps: 0, overwrites: 0 }]
      for (let i = 0; i < steps.length; i++) {
        const prev = prefix[prefix.length - 1]
        const d = steps[i].metricsDelta
        prefix.push({
          comparisons: prev.comparisons + (d?.comparisons ?? 0),
          swaps: prev.swaps + (d?.swaps ?? 0),
          overwrites: prev.overwrites + (d?.overwrites ?? 0),
        })
      }
      metricsPrefixRef.current = prefix
      setTotalSteps(steps.length)
      setCurrentStep(0)
      setMetrics(prefix[0])
      setIsSorted(false)
      setActiveIndices([])
      setSortedIndices([])
    },
    [algorithmId]
  )

  const applyStepIndex = useCallback(
    (nextIndex: number) => {
      const steps = stepsRef.current
      if (steps.length === 0) return
      const clamped = Math.max(0, Math.min(nextIndex, steps.length))

      if (clamped === steps.length) {
        clearTimer()
        setIsPlaying(false)
        setIsSorted(true)
        setActiveIndices([])
        setSortedIndices(
          Array.from({ length: steps[steps.length - 1]?.array.length ?? array.length }, (_, i) => i)
        )
        setCurrentStep(clamped)
        setMetrics(
          metricsPrefixRef.current[clamped] ??
            metricsPrefixRef.current[metricsPrefixRef.current.length - 1]
        )
        return
      }

      const step = steps[clamped]
      setArray(step.array)
      setActiveIndices(step.activeIndices)
      setSortedIndices(step.sortedIndices ?? [])
      setCurrentStep(clamped)
      setMetrics(metricsPrefixRef.current[clamped] ?? { comparisons: 0, swaps: 0, overwrites: 0 })
    },
    [array.length, clearTimer]
  )

  const ensureSteps = useCallback(() => {
    if (stepsRef.current.length === 0) buildSteps(array)
  }, [array, buildSteps])

  const stepForward = useCallback(() => {
    ensureSteps()
    applyStepIndex(currentStep + 1)
  }, [applyStepIndex, currentStep, ensureSteps])

  const stepBack = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    ensureSteps()
    applyStepIndex(currentStep - 1)
    setIsSorted(false)
  }, [applyStepIndex, clearTimer, currentStep, ensureSteps])

  const seek = useCallback(
    (index: number) => {
      clearTimer()
      setIsPlaying(false)
      ensureSteps()
      applyStepIndex(index)
      setIsSorted(false)
    },
    [applyStepIndex, clearTimer, ensureSteps]
  )

  const handlePlayPause = () => {
    if (isSorted) {
      generateArray()
      return
    }

    if (isPlaying) {
      setIsPlaying(false)
      clearTimer()
    } else {
      ensureSteps()
      if (currentStep >= stepsRef.current.length) {
        seek(0)
      }
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      currentStepRef.current = currentStep
      const playStep = () => {
        const stepsLen = stepsRef.current.length
        if (currentStepRef.current >= stepsLen) {
          clearTimer()
          setIsPlaying(false)
          setIsSorted(true)
          setActiveIndices([])
          setSortedIndices(Array.from({ length: array.length }, (_, i) => i))
          return
        }
        applyStepIndex(currentStepRef.current)
        currentStepRef.current += 1

        const minDelayMs = 16
        const maxDelayMs = 1200
        const delayMs = Math.max(
          minDelayMs,
          Math.round(maxDelayMs * Math.pow(0.95, Math.max(0, Math.min(99, speed - 1))))
        )
        timerRef.current = setTimeout(playStep, delayMs)
      }

      timerRef.current = setTimeout(playStep, 0)
    }

    return () => {
      clearTimer()
    }
  }, [isPlaying, speed, array.length, applyStepIndex, clearTimer, currentStep])

  const prevInitialAlgorithmIdRef = useRef<SortingAlgorithmId | undefined>(undefined)
  useEffect(() => {
    if (!initialAlgorithmId) return
    if (prevInitialAlgorithmIdRef.current === initialAlgorithmId) return
    prevInitialAlgorithmIdRef.current = initialAlgorithmId
    setAlgorithmId(initialAlgorithmId)
    generateArray()
  }, [generateArray, initialAlgorithmId])

  const reset = () => {
    generateArray()
  }

  const currentStepInfo = useMemo(() => {
    if (stepsRef.current.length === 0) return null
    if (currentStep < 0 || currentStep >= stepsRef.current.length) return null
    return stepsRef.current[currentStep]
  }, [currentStep])

  const setArrayFromInput = useCallback(
    (arr: number[]) => {
      clearTimer()
      setIsPlaying(false)
      setArray(arr)
      setSize(arr.length)
      resetSteps()
    },
    [clearTimer, resetSteps]
  )

  return {
    array,
    size,
    setSize: (newSize: number) => {
      setSize(newSize)
      generateArray(newSize)
    },
    algorithmId,
    setAlgorithmId: (alg: SortingAlgorithmId) => {
      setAlgorithmId(alg)
      generateArray()
    },
    speed,
    setSpeed,
    isPlaying,
    handlePlayPause,
    reset,
    activeIndices,
    sortedIndices,
    isSorted,
    algorithms: SORTING_ALGORITHM_IDS,
    currentStep,
    totalSteps,
    stepForward,
    stepBack,
    seek,
    metrics,
    currentStepInfo,
    setArrayFromInput,
  }
}

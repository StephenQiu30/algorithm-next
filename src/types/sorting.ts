export type SortStepType = 'compare' | 'swap' | 'overwrite' | 'sorted' | 'pivot'

export interface SortStep {
  type: SortStepType
  indices: number[] // indices involved in this step (e.g., comparing i and j)
  snapshot: number[] // the state of the array AFTER this step is applied
  description?: string // optional description for teaching purposes
}

export type AlgorithmType =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge'
  | 'shell'
  | 'heap'
  | 'radix'

export type SpeedType = 'slow' | 'medium' | 'fast'

export interface SortingAlgorithm {
  name: string
  key: AlgorithmType
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  description: string
  generator: (array: number[]) => SortStep[]
}

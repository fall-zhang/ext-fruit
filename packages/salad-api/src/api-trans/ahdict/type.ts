import type { HTMLString } from '@/core/api-server/types'

export interface Idiom {
  title?: string
  eg?: string
  tips?: string
}

export interface AhdictResultItem {
  /** word */
  title: string
  /** pronunciation */
  pron?: string
  /** meaning and eg */
  meaning: HTMLString[]
  /** idiom and eg */
  idioms: Idiom[]
  origin?: HTMLString
  usageNote?: string
}

export type AhdictResult = AhdictResultItem[]

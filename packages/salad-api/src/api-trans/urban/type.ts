import type { HTMLString } from '../../types'

export interface UrbanResultItem {
  /** keyword */
  title: string
  /** pronunciation */
  pron?: string
  meaning?: HTMLString
  example?: HTMLString
  gif?: {
    src: string
    attr: string
  }
  tags?: string[]
  /** who write this explanation */
  contributor?: string
  /** numbers of thumbs up */
  thumbsUp?: string
  /** numbers of thumbs down */
  thumbsDown?: string
}

interface thumbItem {
  current: string
  defid: number
  down: number
  up: number
}

export interface thumbRes {
  thumbs: thumbItem[]
}

interface thumbMapItem {
  up: string
  down: string
}

export interface ThumbMap {
  [defid: string]: thumbMapItem
}

export type UrbanResult = UrbanResultItem[]

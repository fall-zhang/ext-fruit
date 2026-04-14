import type { HTMLString } from '../../types'

export interface JikipediaResultItem {
  title: string
  content: HTMLString
  likes: number
  url?: string
  author?: {
    name: string
    url: string
  }
}

export type JikipediaResult = JikipediaResultItem[]

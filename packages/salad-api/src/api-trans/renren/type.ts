import type { HTMLString } from '../../types'

export interface RenrenSlide {
  cover: string
  mp3: string
  en: HTMLString
  chs: string
}

interface RenrenResultItem {
  key: string
  title: string
  detail: string
  slide: RenrenSlide
  context: Array<{
    title: string
    content: string[]
  }>
}

export type RenrenResult = RenrenResultItem[]

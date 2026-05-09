import type { HTMLString } from '../../types'

export type JukuuLang = 'engjp' | 'zhjp' | 'zheng'

export interface JukuuTransItem {
  trans: HTMLString
  original: string
  src: string
}

export interface JukuuResult {
  lang: JukuuLang
  sens: JukuuTransItem[]
}

export interface JukuuPayload {
  lang?: JukuuLang
}

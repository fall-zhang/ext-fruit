import type { HTMLString } from '../../types'

export interface WeblioejjeResultItem {
  title?: string
  content: HTMLString
}

export type WeblioejjeResult = WeblioejjeResultItem[]

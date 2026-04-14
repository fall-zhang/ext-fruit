import type { HTMLString } from '@/core/api-server/types'

export interface CNKIDictItem {
  word: string
  href: string
}

export interface CNKISensItem {
  title: string
  more: string
  sens: HTMLString[]
}

export interface CNKIResult {
  dict: CNKIDictItem[]
  senbi: CNKISensItem[]
  seneng: CNKISensItem[]
}

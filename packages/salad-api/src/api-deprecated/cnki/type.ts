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
  // 双语例句
  senbi: CNKISensItem[]
  // 英文例句
  seneng: CNKISensItem[]
}

import type { HTMLString } from '@/core/api-server/types'

export interface YoudaoPron {
  phsym: string
  url: string
}

export interface YoudaoCollinsItem {
  title: string
  content: HTMLString
}

export interface YoudaoResultLex {
  type: 'lex'
  title: string
  stars: number
  rank: string
  pattern: string
  prons: YoudaoPron[]
  basic?: HTMLString
  collins: YoudaoCollinsItem[]
  discrimination?: HTMLString
  sentence?: HTMLString
  translation?: HTMLString
}

export interface YoudaoResultRelated {
  type: 'related'
  list: HTMLString
}

export type YoudaoResult = YoudaoResultLex | YoudaoResultRelated

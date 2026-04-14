import type { HTMLString } from '@/core/api-server/types'

export interface LongmanResultEntry {
  title: {
    HWD: string
    HYPHENATION: string
    HOMNUM: string
  }
  senses: HTMLString[]
  prons: Array<{
    lang: string
    pron: string
  }>
  topic?: {
    title: string
    href: string
  }
  phsym?: string
  level?: {
    rate: number
    title: string
  }
  freq?: Array<{
    title: string
    rank: string
  }>
  pos?: string
  collocations?: HTMLString
  grammar?: HTMLString
  thesaurus?: HTMLString
  examples?: HTMLString[]
}

export interface LongmanResultLex {
  type: 'lex'
  bussinessFirst: boolean
  contemporary: LongmanResultEntry[]
  bussiness: LongmanResultEntry[]
  wordfams?: HTMLString
}

export interface LongmanResultRelated {
  type: 'related'
  list: HTMLString
}

export type LongmanResult = LongmanResultLex | LongmanResultRelated

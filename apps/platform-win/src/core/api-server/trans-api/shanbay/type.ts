import type { DictSearchResult } from '../../api-common/search-type'
import type { HTMLString } from '../../types'

export interface ShanbayResultLex {
  type: 'lex'
  title: string
  pattern: string
  prons: Array<{
    phsym: string
    url: string
  }>
  basic?: HTMLString
  wordId?: string | null
  sentences: Array<{
    annotation: string
    translation: string
  }>
  translation?: HTMLString
  id: 'shanbay'
}

export type ShanbayResult = ShanbayResultLex

export type ShanbaySearchResult = DictSearchResult<ShanbayResult>

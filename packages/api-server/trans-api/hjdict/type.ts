import type { DictSearchResult } from '@P/api-server/api-common/search-type'
import type { HTMLString } from '@P/api-server/types'

export interface HjdictResultLex {
  type: 'lex'
  langCode: string
  header?: HTMLString
  entries: HTMLString[]
}

export interface HjdictResultRelated {
  type: 'related'
  langCode: string
  content: HTMLString
}

export type HjdictResult = HjdictResultLex | HjdictResultRelated


export interface HjdictPayload {
  langCode?: string
}

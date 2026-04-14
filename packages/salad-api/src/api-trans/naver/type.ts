import type { DictSearchResult } from '../../api-common/search-type'

/** Alternate machine translation result */
export interface NaverResult {
  lang: 'zh' | 'ja'
  entry: {
    WORD: { items: any[] }
    MEANING: { items: any[] }
    EXAMPLE: { items: any[] }
  }
}

export interface NaverPayload {
  lang?: 'zh' | 'ja'
}

export type NaverSearchResult = DictSearchResult<NaverResult>

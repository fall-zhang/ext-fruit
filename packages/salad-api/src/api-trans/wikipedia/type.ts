import type { DictSearchResult } from '../../api-common/search-type'
import type { HTMLString } from '../../types'

export type LangListItem = {
  title: string
  url: string
}

export type LangList = LangListItem[]

export interface WikipediaResult {
  title: string
  content: HTMLString
  langSelector: string
}

export type WikipediaSearchResult = DictSearchResult<WikipediaResult>

export type WikipediaPayload = {
  /** Search a specific url */
  url?: string
}

export type WikipediaOptions = {
  lang: 'auto' | 'zh' | 'zh-cn' | 'zh-tw' | 'zh-hk' | 'en' | 'ja' | 'fr' | 'de'
}

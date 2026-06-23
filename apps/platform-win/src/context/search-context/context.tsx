import type { Profile } from '@/config/trans-profile'
import { createContext, useContext } from 'react'

import type { Word } from '@/types/word'

import type { AsyncOptRes } from '@/core/file-system/types'
import type { AllDictsConf, DictID } from '@P/salad-api/src/api-trans'
import type { RenderDictItem } from './utils/get-search-dict'
import type { SupportLanguage } from '@P/salad-api'
import type { HistoryWord } from '@/types/search-history'

export type DictSearchState = {
  text: string
  isInNotebook: boolean
  activeProfile: Profile
  selectedDicts: Array<keyof AllDictsConf>
  renderedDicts: RenderDictItem[],
  // 搜索历史记录
  /** 0 is the latest, max: 100 */
  searchHistory: HistoryWord[]
  // searchResultStore: [],
  /**
   * User manually folded or unfolded
   * 用户手动折叠的组件
   */
  userFoldedDicts: Partial<Record<DictID, boolean>>
  removeHistoryItem(id: string): void
  searchStart: WordSearch
  clearHistory(): AsyncOptRes
}

export type WordSearch = {
  (option: {
    /** Search with specific dict */
    dictId?: DictID
    /** Search specific word */
    word?: Word
    from?: SupportLanguage
    to?: SupportLanguage
    /**
     * Do not update search history
     * 本次查询不计入历史查询
     */
    noHistory?: boolean
    /**
     * 本次查询，不使用缓存
     */
    noCache?: boolean
  }): void
}


export const SearchContext = createContext<DictSearchState | null>(null)

export function useSearchContext () {
  const store = useContext(SearchContext)
  if (!store) {
    throw new Error('Missing SearchProvider in the tree')
  }
  return store
}

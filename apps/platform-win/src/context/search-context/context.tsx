import type { Profile } from '@/config/trans-profile'
import { createContext, useContext } from 'react'

import type { HistoryWord, Word } from '@/types/word'

import type { DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { AsyncOptRes } from '@/core/file-system/types'
import type { AllDictsConf, DictID } from '@P/salad-api/src/api-trans'

export type DictSearchState = {
  text: string

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
  searchStart(option: {
    /** Search with specific dict */
    id?: DictID
    /** Search specific word */
    word?: Word
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
  clearHistory(): AsyncOptRes
}

export type WordSearch = {
  (option: {
    /** Search with specific dict */
    id?: DictID
    /** Search specific word */
    word?: Word
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

type RenderDictItem = {
  readonly dictID: DictID
  // idle 闲置
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

export const SearchContext = createContext<DictSearchState | null>(null)

export function useSearchContext () {
  const store = useContext(SearchContext)
  if (!store) {
    throw new Error('Missing SearchProvider in the tree')
  }
  return store
}

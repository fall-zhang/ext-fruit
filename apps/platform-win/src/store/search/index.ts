
import { create, createStore, useStore } from 'zustand'

import { getDefaultProfile, getDefaultSelectDict, type Profile } from '@/config/trans-profile'
import type { AllDictsConf, DictID } from '@/core/api-server/config'
import type { DictSearchResult, SearchFunction } from '@/core/api-server/api-common/search-type'
import { api } from '@/core/api-server/trans-api'
import { checkSupportedLangs } from '@/core/api-server/utils/lang-check'
import { countWords } from '@/core/api-server/utils/get-word-count'
import type { Word } from '@/types/word'


type RenderDictItem = {
  readonly dictID: DictID
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

export type DictSearchState = {
  text: string

  activeProfile: Profile
  selectedDicts: Array<keyof AllDictsConf>
  renderedDicts: RenderDictItem[],

  historyIndex: number
  searchHistory: Word[],

  userFoldedDicts: Partial<Record<DictID, boolean>>
  searchStart(payload: {
    /** Search with specific dict */
    id?: DictID
    /** Search specific word */
    word?: Word
    /** Additional payload passed to search engine */
    payload?: any
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

  searchEnd(param: {
    id: DictID
    result: any
    catalog?: DictSearchResult<DictID>['catalog']
  }): void
  /** switch to the next or previous history */
  switchHistory(payload: 'prev' | 'next'): void
}


export const useSearchStore = create<DictSearchState>()((set, get) => ({
  text: '',
  activeProfile: getDefaultProfile(),
  historyIndex: -1,
  renderedDicts: [],
  selectedDicts: getDefaultSelectDict(),
  searchHistory: [],
  userFoldedDicts: {},
  switchHistory () { },
  searchStart (searchCof) {
    let dictList: RenderDictItem[] = []
    let word: Word
    const { activeProfile, searchHistory, historyIndex, selectedDicts } = get()
    // 从历史缓存中查找
    const newSearchHistory: Word[] =
      searchCof && searchCof.noHistory
        ? searchHistory
        : searchHistory.slice(0, historyIndex + 1)
    let newHistoryIndex = historyIndex

    if (searchCof && searchCof.word) {
      word = searchCof.word
      const lastWord = searchHistory[historyIndex]

      if (!searchCof.noHistory && (!lastWord || lastWord.text !== word.text)) {
        newSearchHistory.push(word)
        newHistoryIndex = newSearchHistory.length - 1
      }
    } else {
      word = searchHistory[historyIndex]
    }
    set((state) => {
      if (!word) {
        console.warn('SEARCH_START: Empty word on first search', searchCof)
        return state
      }
      if (searchCof && searchCof.id) {
        dictList = state.renderedDicts.map(d => {
          if (d.dictID === searchCof.id) {
            return {
              dictID: d.dictID,
              searchStatus: 'SEARCHING',
              searchResult: null,
            }
          }
          return d
        }
        )
      } else {
        dictList = selectedDicts.filter(id => {
          // dicts that should be rendered
          const dict = activeProfile.dicts.all[id]
          if (checkSupportedLangs(dict.selectionLang, word.text)) {
            const wordCount = countWords(word.text)
            const { min, max } = dict.selectionWC
            return wordCount >= min && wordCount <= max
          }
          return false
        })
          .map(id => {
            // fold or unfold
            const status = checkSupportedLangs(
              activeProfile.dicts.all[id].defaultUnfold,
              word.text
            ) && (!state.activeProfile.stickyFold || !state.userFoldedDicts[id])
              ? 'SEARCHING'
              : 'IDLE'
            return {
              dictID: id,
              searchStatus: status,
              searchResult: null,
            }
          })
      }
      return {
        ...state,
        text: word.text,
        searchHistory: newSearchHistory,
        historyIndex: newHistoryIndex,
        renderedDicts: dictList,
      }
    })
    selectedDicts.forEach((id, index) => {
      const searchFun: SearchFunction = api[id]
      searchFun(word.text, {
        profile: activeProfile.dicts.all,
        dictAuth: activeProfile.dictAuth,
      }).then((res: DictSearchResult) => {
        set(state => {
          const dictResult: RenderDictItem = {
            dictID: id,
            searchStatus: 'FINISH',
            searchResult: res.result,
          }
          const newDict = state.renderedDicts.toSpliced(index, 1, dictResult)

          return {
            ...state,
            renderedDicts: newDict,
          }
        })
      }).catch((err: unknown) => {
        console.warn('⚡️ line:157 ~ err: ', err)
      })
    })
  },
  searchEnd (payload: {
    id: DictID
    result: any
    catalog?: DictSearchResult<DictID>['catalog']
  }) {
    set((state) => {
      if (state.renderedDicts.every(({ dictID }) => dictID !== payload.id)) {
        // this dict is for auto-pronunciation only
        return state
      }

      return {
        ...state,
        renderedDicts: state.renderedDicts.map(d =>
          (d.dictID === payload.id
            ? {
              dictID: d.dictID,
              searchStatus: 'FINISH',
              searchResult: payload.result,
              catalog: payload.catalog,
            }
            : d)
        ),
      }
    })
  },
}))


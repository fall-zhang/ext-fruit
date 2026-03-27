import { createContext, useContext, useState, type ReactNode } from 'react'
import { createStore, useStore } from 'zustand'

import type { Word } from '../types/word'
import { getDefaultProfile, getDefaultSelectDict, type AppProfile, type Profile } from '@/config/trans-profile'
import type { AllDictsConf, DictID } from '@/core/api-server/config'
import type { DictSearchResult, SearchFunction } from '@/core/api-server/api-common/search-type'
import { api } from '@/core/api-server/trans-api'
import { checkSupportedLangs } from '@/core/api-server/utils/lang-check'
import { countWords } from '@/core/api-server/utils/get-word-count'


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
  /** switch to the next or previous history */
  switchHistory(payload: 'prev' | 'next'): void
}

export const SearchContext = createContext<SearchStore | null>(null)

type SearchStore = ReturnType<typeof createSearchStore>

const createSearchStore = (profile: AppProfile) => {
  return createStore<DictSearchState>()((set, get) => ({
    text: '',
    activeProfile: profile,
    historyIndex: -1,
    renderedDicts: [],
    selectedDicts: getDefaultSelectDict(),
    searchHistory: [],
    userFoldedDicts: {},
    switchHistory (arg) {
      set((state) => {
        const historyIndex = Math.min(
          Math.max(0, state.historyIndex + (arg === 'prev' ? -1 : 1)),
          state.searchHistory.length - 1
        )

        return {
          ...state,
          historyIndex,
          text: state.searchHistory[historyIndex]
            ? state.searchHistory[historyIndex].text
            : state.text,
        }
      })
      return true
    },
    searchStart (searchOpt) {
      let dictList: RenderDictItem[] = []
      let word: Word
      const { activeProfile, searchHistory, historyIndex, selectedDicts } = get()
      // 从历史缓存中查找
      const newSearchHistory: Word[] = searchOpt && searchOpt.noHistory
        ? searchHistory
        : searchHistory.slice(0, historyIndex + 1)
      let newHistoryIndex = historyIndex

      if (searchOpt && searchOpt.word) {
        word = searchOpt.word
        const lastWord = searchHistory[historyIndex]

        if (!searchOpt.noHistory && (!lastWord || lastWord.text !== word.text)) {
          newSearchHistory.push(word)
          newHistoryIndex = newSearchHistory.length - 1
        }
      } else {
        word = searchHistory[historyIndex]
      }
      // start search
      set((state) => {
        if (!word) {
          console.warn('SEARCH_START: Empty word on first search', searchOpt)
          return state
        }
        if (searchOpt && searchOpt.id) {
          const searchDicts = state.renderedDicts.filter(item => item.dictID === searchOpt.id)

          dictList = searchDicts.map(d => {
            return {
              dictID: d.dictID,
              searchStatus: 'SEARCHING',
              searchResult: null,
            }
          })
        } else {
          // dicts that should be rendered
          dictList = selectedDicts.filter(id => {
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
          console.log('search dicts', dictList)
        }
        return {
          ...state,
          text: word.text,
          searchHistory: newSearchHistory,
          historyIndex: newHistoryIndex,
          renderedDicts: dictList,
        }
      })
      // searching
      selectedDicts.forEach((id) => {
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
            const dictIndex = state.renderedDicts.findIndex((item) => item.dictID === id)
            const newDict = state.renderedDicts.toSpliced(dictIndex, 1, dictResult)

            return {
              ...state,
              renderedDicts: newDict,
            }
          })
        }).catch((err: unknown) => {
          console.warn(`current dict ${id} ~ err: `, err)
          set(state => {
            const dictIndex = state.renderedDicts.findIndex((item) => item.dictID === id)
            const newDict = state.renderedDicts.toSpliced(dictIndex, 1)
            return {
              ...state,
              renderedDicts: newDict,
            }
          })
        })
      })
    },
  }))
}

export function SearchProvider ({ children, profile }: {
  children: ReactNode
  profile: AppProfile
}) {
  const [store] = useState(() => createSearchStore(profile))
  return (
    <SearchContext.Provider value={store}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext<T> (selector: (state: DictSearchState) => T): T {
  const store = useContext(SearchContext)
  // console.log('⚡️ line:251 ~ store: ', store)
  if (!store) throw new Error('Missing SearchProvider in the tree')
  return useStore(store, selector)
}

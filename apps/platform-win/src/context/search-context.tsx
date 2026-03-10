import { createContext, useContext, useState, type ReactNode } from 'react'
import { createStore, useStore } from 'zustand'

import type { Word } from '../types/word'
import { getDefaultProfile, getDefaultSelectDict, type Profile } from '@/config/trans-profile'
import { checkSupportedLangs, countWords } from '../utils/lang-check'
import type { AllDictsConf } from '@/core/api-server/types/all-dict-conf'
import type { DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { DictID } from '@/core/api-server/types'

type RenderDictItem = {
  readonly dictID: DictID
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}
type CustomFetch = (input: URL | Request | string, init?: RequestInit) => Promise<Response>

export type DictSearchState = {
  text: string

  activeProfile: Profile
  selectedDicts: Array<keyof AllDictsConf>
  renderedDicts: RenderDictItem[],

  historyIndex: number
  searchHistory: Word[],

  userFoldedDicts: Partial<Record<DictID, boolean>>
  customFetch: CustomFetch
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

export const SearchContext = createContext<SearchStore | null>(null)

type SearchStore = ReturnType<typeof createSearchStore>

const createSearchStore = (initProps?: {
  customFetch?: CustomFetch
}) => {
  const DEFAULT_PROPS = {
    customFetch: initProps?.customFetch || fetch,
  }
  return createStore<DictSearchState>()((set, get) => ({
    ...DEFAULT_PROPS,
    text: '',
    activeProfile: getDefaultProfile(),
    historyIndex: -1,
    renderedDicts: [],
    selectedDicts: getDefaultSelectDict(),
    searchHistory: [],
    userFoldedDicts: {},
    switchHistory () {

    },
    searchStart (payload) {
      let dictList: RenderDictItem[] = []
      let word: Word
      const { activeProfile, searchHistory, historyIndex, selectedDicts } = get()
      // 从历史缓存中查找
      const newSearchHistory: Word[] =
        payload && payload.noHistory
          ? searchHistory
          : searchHistory.slice(0, historyIndex + 1)
      let newHistoryIndex = historyIndex

      if (payload && payload.word) {
        word = payload.word
        const lastWord = searchHistory[historyIndex]

        if (!payload.noHistory && (!lastWord || lastWord.text !== word.text)) {
          newSearchHistory.push(word)
          newHistoryIndex = newSearchHistory.length - 1
        }
      } else {
        word = searchHistory[historyIndex]
      }
      set((state) => {
        if (!word) {
          if (process.env.DEBUG) {
            console.warn('SEARCH_START: Empty word on first search', payload)
          }
          return state
        }
        if (payload && payload.id) {
          dictList = state.renderedDicts.map(d => {
            if (d.dictID === payload.id) {
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
      console.log('⚡️ line:63 ~ word: ', selectedDicts)

      const request = apiMap.baidu.getRequest(word.text, {
        from: 'auto',
        to: 'zh',
        option: {
          appid: '20260228002563230',
          key: 'ujv5scyNwqVHs5_pZCaJ',
        },
      })
      DEFAULT_PROPS.customFetch(request).then(res => {
        return apiMap.baidu.handleResponse(res, {
          text: word.text,
          from: 'auto',
          to: 'auto',
          profile: activeProfile.dicts.all,
        })
      }).then(res => {
        const dictResult: RenderDictItem = {
          dictID: res.result.id,
          searchStatus: 'FINISH',
          searchResult: res.result,
        }
        set(state => ({
          ...state,
          renderedDicts: [dictResult],
        }))
      }).catch(err => {
        console.warn('⚡️ line:157 ~ err: ', err)
      })

      // dictList.forEach(item => {
      //   fetchDictResult({
      //     id: item.id,
      //     text: word.text,
      //   }).then(res => {
      //     console.log(res)
      //   }).catch(err => {
    //   })
    // })
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
}
export function SearchProvider ({ children, customFetch }: {
  children: ReactNode
  customFetch?: CustomFetch
}) {
  const [store] = useState(() => createSearchStore({
    customFetch,
  }))
  return (
    <SearchContext.Provider value={store}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext<T> (selector: (state: DictSearchState) => T): T {
  const store = useContext(SearchContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector)
}

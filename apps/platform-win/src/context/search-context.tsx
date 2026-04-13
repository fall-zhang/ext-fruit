import { createContext, useContext, useState, type ReactNode } from 'react'
import { createStore, useStore } from 'zustand'

import type { HistoryWord, Word } from '../types/word'
import { getDefaultSelectDict, type AppProfile, type Profile } from '@/config/trans-profile'
import type { AllDictsConf, DictID } from '@/core/api-server/config'
import type { DictSearchResult, SearchFunction } from '@/core/api-server/api-common/search-type'
import { api } from '@/core/api-server/trans-api'
import { checkSupportedLangs } from '@/core/api-server/utils/lang-check'
import { countWords } from '@/core/api-server/utils/get-word-count'
import { isInNotebook } from '@/core/index-db'


type RenderDictItem = {
  readonly dictID: DictID
  // idle 闲置
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

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
}

export const SearchContext = createContext<SearchStore | null>(null)

type SearchStore = ReturnType<typeof createSearchStore>

const createSearchStore = (profile: AppProfile) => {
  return createStore<DictSearchState>()((set, get) => ({
    text: '',
    activeProfile: profile,
    searchHistory: [],
    renderedDicts: [],
    selectedDicts: getDefaultSelectDict(),
    userFoldedDicts: {},
    clearHistory () {
      set(state => {
        return {
          ...state,
          searchHistory: [],
        }
      })
    },
    searchStart (searchOpt) {
      let dictList: RenderDictItem[] = []
      let word: Word
      const { activeProfile, searchHistory, selectedDicts, renderedDicts, userFoldedDicts } = get()
      if (searchOpt && searchOpt.word) {
        word = searchOpt.word
      } else {
        // 默认为最后一次查找
        word = searchHistory[0]
      }

      if (searchOpt && searchOpt.id) {
        const searchDicts = renderedDicts.filter(item => item.dictID === searchOpt.id)
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
            ) && (!userFoldedDicts[id])
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
      isInNotebook(word).then(isInNote => {
        // res
        set((state) => {
          if (!word) {
            console.warn('SEARCH_START: Empty word on first search', searchOpt)
            return state
          }
          let newHistory: HistoryWord[]
          if (searchOpt.noHistory) {
            newHistory = searchHistory
          } else {
            newHistory = [...searchHistory, {
              ...word,
              isInNotebook: isInNote,
            }]
          }
          return {
            ...state,
            text: word.text,
            searchHistory: newHistory,
            renderedDicts: dictList,
          } satisfies DictSearchState
        })
      }).catch(err => {

      })
      // start search

      // searching
      // console.log('⚡️ line:157 ~ selectedDicts: ', selectedDicts)
      dictList.forEach((item) => {
        const id = item.dictID
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
            const newDict = state.renderedDicts.map(item => {
              if (item.dictID === id) {
                return dictResult
              }
              return item
            })

            return {
              ...state,
              renderedDicts: newDict,
            }
          })
        }).catch((err: unknown) => {
          console.warn(`current dict ${id} ~ err: `, err)
          set(state => {
            const newDict = state.renderedDicts.map(item => {
              if (item.dictID === id) {
                return {
                  searchStatus: 'IDLE',
                  dictID: id,
                  searchResult: null,
                } satisfies RenderDictItem
              }
              return item
            })
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

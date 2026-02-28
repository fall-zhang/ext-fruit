import { create } from 'zustand'
import type { Word } from '../types/word'
import { getDefaultConfig, type DictID } from '../app-config'
import { getDefaultProfile, getDefaultSelectDict, type Profile } from '../app-config/profiles'
import { checkSupportedLangs, countWords } from '../utils/lang-check'
import type { DictSearchResult } from '../core/trans-api/types'
import type { AllDictsConf } from '../app-config/dicts'
import { fetchDictResult } from '../core/trans-engine/fetch-trans'
type RenderDictItem = {
  readonly id: DictID
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

export type DictSearchState = {
  text:string

  activeProfile: Profile
  selectedDicts: Array<keyof AllDictsConf>
  renderedDicts: RenderDictItem[],

  historyIndex:number
  searchHistory: Word[],

  userFoldedDicts: Partial<Record<DictID, boolean >>

  searchStart(payload:{
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
  }):void

  searchEnd(param:{
    id: DictID
    result: any
    catalog?: DictSearchResult<DictID>['catalog']
  }):void
  /** switch to the next or previous history */
  switchHistory(payload: 'prev' | 'next'):void
}

export const useDictSearch = create<DictSearchState>()((set, get) => ({
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
    let dictList:RenderDictItem[] = []
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
          if (d.id === payload.id) {
            return {
              id: d.id,
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
              id,
              searchStatus: status,
              searchResult: null,
            }
          })
      }
      console.log('⚡️ line:49 ~ dictList: ', dictList)
      return {
        ...state,
        text: word.text,
        searchHistory: newSearchHistory,
        historyIndex: newHistoryIndex,
        renderedDicts: dictList,
      }
    })
    console.log('⚡️ line:63 ~ word: ', word.text)
    fetchDictResult({
      id: 'bing',
      text: word.text,
      config: getDefaultConfig(),
      profile: activeProfile.dicts.all,
    }).then(res => {
      console.log(res)
    }).catch(err => {

    })
    // dictList.forEach(item => {
    //   fetchDictResult({
    //     id: item.id,
    //     text: word.text,
    //     payload: {

    //     },
    //   }).then(res => {
    //     console.log(res)
    //   }).catch(err => {

    //   })
    // })
  },
  searchEnd (payload:{
    id: DictID
    result: any
    catalog?: DictSearchResult<DictID>['catalog']
  }) {
    set((state) => {
      if (state.renderedDicts.every(({ id }) => id !== payload.id)) {
      // this dict is for auto-pronunciation only
        return state
      }

      return {
        ...state,
        renderedDicts: state.renderedDicts.map(d =>
          (d.id === payload.id
            ? {
              id: d.id,
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

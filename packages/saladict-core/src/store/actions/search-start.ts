import type { DictID } from '../../app-config'
import type { GlobalState } from '../global-state'
import { checkSupportedLangs, countWords } from '../../utils/lang-check'
import type { Word } from '../../types/word'
import type { DictSearchResult } from '../../core/trans-api/types'
type RenderDictItem = {
  readonly id: DictID
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}
export const searchStart = (payload:{
  /** Search with specific dict */
  id?: DictID
  /** Search specific word */
  word?: Word
  /** Additional payload passed to search engine */
  payload?: any
  /** Do not update search history */
  noHistory?: boolean
}, set:{ (state: (state:GlobalState) => GlobalState):void }) => {
  set((state) => {
    const { activeProfile, searchHistory, historyIndex } = state

    let word: Word
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

    if (!word) {
      if (process.env.DEBUG) {
        console.warn('SEARCH_START: Empty word on first search', payload)
      }
      return state
    }
    let dictList:RenderDictItem[] = []
    if (payload && payload.id) {
      dictList = state.renderedDicts.map(d => (d.id === payload.id
        ? {
          id: d.id,
          searchStatus: 'SEARCHING',
          searchResult: null,
        }
        : d)
      )
    } else {
      dictList = activeProfile.dicts.selected.filter(id => {
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
      isShowDictPanel: true,
      isExpandMtaBox: false,
      // activeProfile.mtaAutoUnfold === 'always' ||
      // (activeProfile.mtaAutoUnfold === 'popup' && isPopupPage()),
      searchHistory: newSearchHistory,
      historyIndex: newHistoryIndex,
      renderedDicts: dictList,
    }
  })
}

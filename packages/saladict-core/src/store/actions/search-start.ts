import { checkSupportedLangs, countWords } from '@/_helpers/lang-check'
import { isPopupPage } from '@/_helpers/saladict'
import { Word } from '@/_helpers/record-manager'
import { DictID } from '../../app-config'
import { GlobalState } from '..'

export const searchStart = (payload:{
  /** Search with specific dict */
  id?: DictID
  /** Search specific word */
  word?: Word
  /** Additional payload passed to search engine */
  payload?: any
  /** Do not update search history */
  noHistory?: boolean
}, set:{
  (state:{
    (state:GlobalState):GlobalState
  }):void
}) => {
  set((state) => {
    const { activeProfile, searchHistory, historyIndex } = state

    let word: Word
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

    return {
      ...state,
      text: word.text,
      isShowDictPanel: true,
      isExpandMtaBox:
      activeProfile.mtaAutoUnfold === 'always' ||
      (activeProfile.mtaAutoUnfold === 'popup' && isPopupPage()),
      searchHistory: newSearchHistory,
      historyIndex: newHistoryIndex,
      renderedDicts:
      payload && payload.id
      // expand an folded dict item
        ? state.renderedDicts.map(d =>
          (d.id === payload.id
            ? {
              id: d.id,
              searchStatus: 'SEARCHING',
              searchResult: null
            }
            : d)
        )
        : activeProfile.dicts.selected
          .filter(id => {
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
            return {
              id,
              searchStatus:
                  checkSupportedLangs(
                    activeProfile.dicts.all[id].defaultUnfold,
                    word.text
                  ) &&
                  (!state.activeProfile.stickyFold ||
                    !state.userFoldedDicts[id])
                    ? 'SEARCHING'
                    : 'IDLE',
              searchResult: null
            }
          })
    }
  })
}

import type { StateCreator } from 'zustand'
import type { DBArea } from '../../core/database/types'
import type { DictID } from '../../app-config'
import { openQSPanel } from './open-qs-panel'
import type { Word } from '../../types/word'
import { isInDictPanel, isQuickSearchPage } from '../../core/saladict-state'
import type { GlobalState } from '../global-state'
import type { DictActionSlice } from './actions'
import { getSentenceFromSelection, getTextFromSelection } from '../../utils/get-selection-more'
import { newSelectionWord } from '../../utils/selection/helper'
import { getWords, getWordsByText } from '../../core/database'

type DictMessageSlice = {
  /** Open the source page of a dictionary */
  OPEN_DICT_SRC_PAGE(payload: {
    id: DictID
    text: string
    /** Focus on the new page? */
    active?: boolean
  }):void
  /** Request backend for page info */
  PAGE_INFO(): {
    pageId: string | number
    faviconURL?: string
    pageTitle?: string
    pageURL?: string
  }

  /* ------------------------------------------------ *\
     Backend IndexedDB: Notebook or History
  \* ------------------------------------------------ */

  GET_WORDS_BY_TEXT(payload: {
    area: DBArea
    text: string
  }): Word[]

  GET_WORDS(payload: {
    area: DBArea
    itemsPerPage?: number
    pageNum?: number
    sortField?: string | string []
    sortOrder?: 'ascend' | 'descend'
    searchText?: string
  }):{
    total: number
    words: Word[]
  }

  // LAST_PLAY_AUDIO: {
  //   response?: null | { src: string; timestamp: number }
  // }

  /* ------------------------------------------------ *\
     Text Selection
  \* ------------------------------------------------ */

  /** To dict panel */
  SELECTION(payload: {
    word: Word
    mouseX: number
    mouseY: number
    dbClick: boolean
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    /** inside panel? */
    self: boolean
    /** skip salad bowl and show panel directly */
    instant: boolean
    /** force panel to skip reconciling position */
    force: boolean
  }):void

  /** Manually emit selection */
  EMIT_SELECTION: Record<string, unknown>
  /* ------------------------------------------------ *\
    Quick Search Dict Panel
  \* ------------------------------------------------ */
  /** Open or update Quick Search Panel */
  OPEN_QS_PANEL():void

  /** Send new words to standalone panel */
  QS_PANEL_SEARCH_TEXT(payload: Word):void

  CLOSE_QS_PANEL():void

  /** query backend for standalone panel appearance */
  QUERY_QS_PANEL():boolean


  /** Focus standalone quick search panel */
  QS_PANEL_FOCUSED: Record<string, unknown>

  /** Switch to Sidebar */
  QS_SWITCH_SIDEBAR(payload: 'left' | 'right'):void

  /* ------------------------------------------------ *\
     Context Menus
  \* ------------------------------------------------ */

  /** Manually trigger context menus click */
  CONTEXT_MENUS_CLICK(payload: {
    menuItemId: string
    selectionText?: string
    linkUrl?: string
  }):void
}

export const messageActionSlice:StateCreator<DictMessageSlice & DictActionSlice & GlobalState, [], [], DictMessageSlice> = (set, get) => {
  return {
    PAGE_INFO () {
      const result = {
        pageId: '' as string | number,
        faviconURL: '',
        pageTitle: '',
        pageURL: '',
      }
      const tab = sender.tab
      if (tab) {
        result.pageId = tab.id || ''
        if (tab.favIconUrl) {
          result.faviconURL = tab.favIconUrl
        }
        if (tab.url) {
          result.pageURL = tab.url
        }
        if (tab.title) {
          result.pageTitle = tab.title
        }
      } else {
        // FRAGILE: Assume only browser action page is tabless
        result.pageId = 'popup'
        if (sender.url && !sender.url.startsWith('http')) {
          result.faviconURL = 'https://saladict.crimx.com/favicon.ico'
        }
      }
      return result
    },
    OPEN_DICT_SRC_PAGE (payload) {
      // const engine = await BackgroundServer.getDictEngine(id)
      // return openUrl({
      //   url: await engine.getSrcPage(
      //     text,
      //     window.appConfig,
      //     window.activeProfile
      //   ),
      //   active,
      // })
    },
    OPEN_QS_PANEL: () => set(openQSPanel),

    CLOSE_QS_PANEL: () => {
      // AudioManager.getInstance().reset()
      // return qsPanelManager.destroy()
    },
    QS_PANEL_SEARCH_TEXT: (word) => {
      const state = get()
      if (isQuickSearchPage()) {
        state.SEARCH_START({ word })
        // request searching text, from other tabs
        if (state.isQSFocus) {
          // focus standalone panel
          state.OPEN_QS_PANEL()
        }
      }
      return Promise.resolve()
    },
    SELECTION: (payload) => {
      set(state => ({
        ...state,
        selection: payload,
      }))
    },
    EMIT_SELECTION: async () => {
      const selection = window.getSelection()
      const state = get()
      if (selection && selection.rangeCount > 0) {
        const text = getTextFromSelection(selection)
        const rect = selection.getRangeAt(0).getBoundingClientRect()
        if (text) {
          state.SELECTION({
            mouseX: rect.right,
            mouseY: rect.top,
            instant: true,
            self: isInDictPanel(selection.anchorNode),
            word: await newSelectionWord({
              text,
              context: getSentenceFromSelection(selection),
            }),
            dbClick: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            force: false,
          })
        }
      }
    },
    GET_WORDS_BY_TEXT: (payload) => {
      return getWordsByText(payload)
    },
    GET_WORDS: (payload) => {
      return getWords(payload)
    },
    QS_PANEL_FOCUSED: () => {
      const isExpandMtaBox = get().isExpandMtaBox
      if (isQuickSearchPage()) {
        const input = document.querySelector< HTMLTextAreaElement | HTMLInputElement >(
          isExpandMtaBox
            ? '.mtaBox-TextArea'
            : '.menuBar-SearchBox'
        )
        if (input) {
          input.focus()
          input.select()
        }
      }
      return Promise.resolve()
    },
  }
}

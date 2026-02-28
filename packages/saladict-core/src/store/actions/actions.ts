import { searchStart } from './search-start'
import { newSelection } from './new-selection'
import type { StateCreator } from 'zustand'
import type { AppConfig, DictID } from '../../app-config'
import type { ProfileID } from '../profile/types'
import type { Profile } from '../../app-config/profiles'
import { AudioManager } from '../../background/audio-manager'
import { newWord } from '../../dict-utils/new-word'
import type { Word } from '../../types/word'
import type { GlobalState } from '../global-state'

export type DictActionSlice = {
  NEW_CONFIG(payload:AppConfig):void
  /* ------------------------------------------------ *\
     Audio Playing
  \* ------------------------------------------------ */

  PLAY_AUDIO: {
    /** url: to backend */
    (payload: string):void
  }

  /** switch to the next or previous history */
  SWITCH_HISTORY(payload: 'prev' | 'next'):void

  /** request closing panel */
  CLOSE_PANEL():void

  TEMP_DISABLED_STATE(value:boolean):void
}

export const createActionSlice:StateCreator<GlobalState & DictActionSlice, [], [],
  DictActionSlice> = (set, get) => {
  return {
    NEW_CONFIG: (payload:AppConfig) => set((state) => {
      const url = window.location.href
      const panelMaxHeight =
        (window.innerHeight * payload.panelMaxHeightRatio) / 100

      return {
        ...state,
        config: payload,
        panelHeight: Math.min(state.panelHeight, panelMaxHeight),
        panelMaxHeight,
        isQSFocus: payload.qsFocus,
        isTempDisabled:
        payload.blacklist.some(([r]) => new RegExp(r).test(url)) &&
        payload.whitelist.every(([r]) => !new RegExp(r).test(url)),
      }
    }),

    NEW_PROFILES: (payload:ProfileID[]) => set((state) => ({
      ...state,
      profiles: payload,
    })),

    NEW_ACTIVE_PROFILE: (payload :Profile) => set(state => {
      const isShowMtaBox = payload.mtaAutoUnfold !== 'hide'
      return {
        ...state,
        activeProfile: payload,
        isShowMtaBox,
        isExpandMtaBox:
        isShowMtaBox &&
        (payload.mtaAutoUnfold === 'once' ||
          payload.mtaAutoUnfold === 'always' ||
          (payload.mtaAutoUnfold === 'popup')),
        renderedDicts: state.renderedDicts.filter(({ id }) =>
          payload.dicts.selected.includes(id)
        ),
      }
    }),

    NEW_SELECTION: (payload:{
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
    }) => set(state => newSelection(state, payload)),

    /** Is App temporary disabled */
    TEMP_DISABLED_STATE: (payload:boolean) => set((state) => {
      if (payload) {
        return {
          ...state,
          isTempDisabled: true,
          isPinned: false,
          // keep showing if it's standalone page
          isShowBowl: false,
        }
      }
      return {
        ...state,
        isTempDisabled: false,
      }
    }),

    /* ------------------------------------------------ *\
     Dict Panel
  \* ------------------------------------------------ */
    UPDATE_TEXT: (newText:string) => set((state) => ({
      ...state,
      text: newText,
    })),

    TOGGLE_MTA_BOX: () => set(state => ({
      ...state,
      isExpandMtaBox: !state.isExpandMtaBox,
    })),

    TOGGLE_PIN: () => set(state => ({
      ...state,
      isPinned: !state.isPinned,
    })),
    /** Focus button on quick search panel */
    TOGGLE_QS_FOCUS: () => set(state => ({
      ...state,
      isQSFocus: !state.isQSFocus,
    })),

    TOGGLE_WAVEFORM_BOX: () => set(state => ({
      ...state,
      isExpandWaveformBox: !state.isExpandWaveformBox,
    })),

    OPEN_PANEL: (payload:{ x: number, y: number }) => set((state) => {
      return {
        ...state,
        isPinned: state.config.defaultPinned,
        dictPanelCoord: {
          x: payload.x,
          y: payload.y,
        },
      }
    }),

    CLOSE_PANEL: () => set(state => {
      AudioManager.getInstance().reset()
      return {
        ...state,
        isPinned: false,
        isShowBowl: false,
      }
    }),

    SWITCH_HISTORY: (payload:'next' | 'prev') => {
      set((state) => {
        const historyIndex = Math.min(
          Math.max(0, state.historyIndex + (payload === 'prev' ? -1 : 1)),
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

    /** User manually folds or unfolds dict item */
    USER_FOLD_DICT: (payload:{
      id: DictID
      fold: boolean
    }) => set((state) => ({
      ...state,
      userFoldedDicts: {
        ...state.userFoldedDicts,
        [payload.id]: payload.fold,
      },
    })),

    DRAG_START_COORD: (payload: null | {
      x: number
      y: number
    }) => set((state) => ({
      ...state,
      dragStartCoord: payload,
    })),

    /* ------------------------------------------------ *\
        Quick Search Dict Panel
      \* ------------------------------------------------ */
    SUMMONED_PANEL_INIT: (payload:string) => set((state) => ({
      ...state,
      text: payload,
      historyIndex: 0,
      isPinned: state.config.defaultPinned,
      isShowBowl: false,
    })),

    QS_PANEL_CHANGED: (payload:boolean) => set((state) => {
      if (state.withQssaPanel === payload) {
        return state
      }

      // hide panel on other pages and leave just quick search panel
      return payload && state.config.qssaPageSel
        ? {
          ...state,
          withQssaPanel: payload,
          isPinned: false,
          // no hiding if it's browser action page
          isShowBowl: false,
        }
        : {
          ...state,
          withQssaPanel: payload,
        }
    }),


    /* ------------------------------------------------ *\
     Word Editor Panel
    \* ------------------------------------------------ */
    WORD_EDITOR_STATUS: (payload:{
      word: Word | null
      /** translate context when word editor shows */
      translateCtx?: boolean
    }) => set((state) => {
      if (payload.word) {
        return {
          ...state,
          wordEditor: {
            isShow: true,
            word: payload.word,
            translateCtx: !!payload.translateCtx,
          },
          dictPanelCoord: {
            x: 50,
            y: window.innerHeight * 0.2,
          },
        }
      }
      return {
        ...state,
        wordEditor: {
          isShow: false,
          word: state.wordEditor.word,
          translateCtx: false,
        },
      }
    }),

    PLAY_AUDIO: (payload:string) => set((state) => ({
      ...state,
      lastPlayAudio: {
        src: payload,
        timestamp: (new Date()).getTime(),
      },
    })),
  }
}

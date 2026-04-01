import { create } from 'zustand'

import type { GlobalState } from './type'

import type { AppConfig } from '@/config/app-config'
import type { Word } from '../types/word'

import type { Profile } from '@/config/trans-profile'
import type { ProfileID } from '@/core/api-local/profile'


import { newWord } from '@/utils/dict-utils/new-word'

export const useDictStore = create<GlobalState>((set, get) => {
  return {
    selection: {
      word: newWord(),
      mouseX: 0,
      mouseY: 0,
      self: false,
      dbClick: false,
      altKey: false,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
      instant: false,
      force: false,
    },
    isTempDisabled: true,
    wordEditor: {
      isShow: false,
      word: newWord(),
      // translate context on start
      translateCtx: false,
    },

    isShowBowl: false,
    isExpandWaveformBox: false,
    isFav: false,
    bowlCoord: { x: 0, y: 0 },
    /** The actual coord of dict panel might be different */
    dictPanelCoord: { x: 0, y: 0 },
    panelHeight: 30,

    panelMaxHeight: (window.innerHeight * 80) / 100,
    /** User can view back search history */
    historyIndex: -1,
    /** Record init coordinate on dragstart */
    dragStartCoord: null as null | { x: number; y: number },
    lastPlayAudio: null as null | { src: string; timestamp: number },
    NEW_CONFIG: (payload: AppConfig) => set((state) => {
      const url = window.location.href
      const panelMaxHeight =
        (window.innerHeight * payload.panelMaxHeightRatio) / 100

      return {
        ...state,
        config: payload,
        panelHeight: Math.min(state.panelHeight, panelMaxHeight),
        panelMaxHeight,
        isTempDisabled:
        payload.blacklist.some(([r]) => new RegExp(r).test(url)) &&
        payload.whitelist.every(([r]) => !new RegExp(r).test(url)),
      }
    }),

    NEW_PROFILES: (payload: ProfileID[]) => set((state) => ({
      ...state,
      profiles: payload,
    })),

    NEW_ACTIVE_PROFILE: (payload: Profile) => set(state => {
      const isShowMtaBox = payload.mtaAutoUnfold !== 'hide'
      return {
        ...state,
        activeProfile: payload,
        isShowMtaBox,
      }
    }),

    /* ------------------------------------------------ *\
     Dict Panel
    \* ------------------------------------------------ */
    UPDATE_TEXT: (newText: string) => set((state) => ({
      ...state,
      text: newText,
    })),

    /* ------------------------------------------------ *\
        Quick Search Dict Panel
      \* ------------------------------------------------ */
    SUMMONED_PANEL_INIT: (payload: string) => set((state) => ({
      ...state,
      text: payload,
      historyIndex: 0,
      isShowBowl: false,
    })),

    /* ------------------------------------------------ *\
     Word Editor Panel
    \* ------------------------------------------------ */
    WORD_EDITOR_STATUS: (payload: {
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

    playAudio: (url: string) => set((state) => ({
      ...state,
      lastPlayAudio: {
        src: url,
        timestamp: (new Date()).getTime(),
      },
    })),
  }
})


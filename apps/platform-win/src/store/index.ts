import { create } from 'zustand'

import type { GlobalState } from './type'

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
    /** Record init coordinate on dragstart */
    dragStartCoord: null as null | { x: number; y: number },
    lastPlayAudio: null as null | { src: string; timestamp: number },

    playAudio: (url: string) => set((state) => ({
      ...state,
      lastPlayAudio: {
        src: url,
        timestamp: (new Date()).getTime(),
      },
    })),
  }
})


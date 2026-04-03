import type { Word } from '@/types/word'

export interface GlobalState {
  selection: {
    word: Word
    mouseX: number
    mouseY: number
    self: boolean
    dbClick: boolean
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
    instant: boolean
    force: boolean
  }
  /**
   * Temporary disable
   * 暂时禁用功能
   */
  isTempDisabled: boolean
  /**
   * is a standalone quick search panel running
   * 运行中的独立快速搜索面板
   */
  wordEditor: {
    isShow: boolean
    word: Word
    // translate context on start
    translateCtx: boolean
  }
  isShowBowl: boolean
  isExpandWaveformBox: boolean

  /**
   * Is current word in Notebook
   *
   * 当前单词是否在笔记中
   */
  isFav: boolean,
  bowlCoord: {
    x: number
    y: number
  },
  // activeProfile: Profile
  /** The actual coord of dict panel might be different */
  dictPanelCoord: {
    x: number
    y: number
  }
  panelHeight: number,

  panelMaxHeight: number
  /** Record init coordinate on dragstart */
  dragStartCoord: null | { x: number; y: number },
  lastPlayAudio: null | { src: string; timestamp: number },
  /* ------------------------------------------------ *\
     Audio Playing
  \* ------------------------------------------------ */
  playAudio: {
    /** url: to backend */
    (payload: string): void
  }
}


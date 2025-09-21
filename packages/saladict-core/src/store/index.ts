import { create } from 'zustand'
import { AppConfig, DictID, getDefaultConfig } from './config/get-default-conf'
import { Profile, ProfileID } from '../app-config/profiles'
import { getDefaultProfile } from './profile/get-default-profile'
import { Word } from './selection/types'
import { newWord } from '../dict-utils/new-word'
import { isTempDisable } from '../dict-utils/is-temp-disable'
import { isStandalonePage, isOptionsPage, isPopupPage, isQuickSearchPage } from '../core/saladict-state'
// import { isStandalonePage } from '../_helpers/saladict'

import { DictSearchResult } from '@P/saladict-core/src/core/trans-api/helpers'

type RenderDictItem = {
  readonly id: DictID
  readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  readonly searchResult: any
  readonly catalog?: DictSearchResult<DictID>['catalog']
}

export interface GlobalState {
  bears: number
  config: AppConfig
  profiles: ProfileID[]
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
   * 是否为快速面板
   */
  isQSPanel: boolean
  isQSFocus: boolean
  /**
   * is a standalone quick search panel running
   * 运行中的独立快速搜索面板
   */
  withQssaPanel: boolean
  wordEditor: {
    isShow: boolean
    word: Word
    // translate context on start
    translateCtx: boolean
  }
  isShowBowl: boolean
  isShowDictPanel: boolean
  isShowMtaBox: boolean
  isExpandMtaBox: boolean
  isExpandWaveformBox: boolean
  isPinned: boolean
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
  activeProfile: Profile
  /** The actual coord of dict panel might be different */
  dictPanelCoord: {
    x: number
    y: number
  }
  panelHeight: number,
  _panelHeightCache: {
    menubar: number,
    mtabox: number,
    dictlist: number,
    waveformbox: number,
    sum: number,
    /** independent layer */
    floatHeight: number
  },
  panelMaxHeight: number
  /** Dicts that will be rendered to dict panel */
  renderedDicts: RenderDictItem[],
  /** User manually folded or unfolded */
  userFoldedDicts: Record<DictID, boolean>
  /** Search text */
  text: string,
  /** 0 is the oldest */
  searchHistory: Word[],
  /** User can view back search history */
  historyIndex: number,
  /** Record init coordinate on dragstart */
  dragStartCoord: null | { x: number; y: number },
  lastPlayAudio: null | { src: string; timestamp: number },
  increasePopulation: (by: number) => void
  removeAllBears: () => void
}

export const useDictStore = create<GlobalState>((set) => {
  const config = getDefaultConfig()
  // getActiveProfileID
  const profile = getDefaultProfile()
  const isShowMtaBox = profile.mtaAutoUnfold !== 'hide'

  const isExpandMtaBox = isShowMtaBox && (profile.mtaAutoUnfold === 'once' || profile.mtaAutoUnfold === 'always' || (profile.mtaAutoUnfold === 'popup' && isPopupPage()))
  const result: GlobalState = {
    bears: 0,
    config,
    profiles: [],
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
      force: false
    },
    activeProfile: profile,
    isTempDisabled: isTempDisable(config),
    isQSPanel: isQuickSearchPage(),
    isQSFocus: config.qsFocus,
    withQssaPanel: false,
    wordEditor: {
      isShow: false,
      word: newWord(),
      // translate context on start
      translateCtx: false
    },

    isShowBowl: false,
    isShowDictPanel: isStandalonePage(),
    isShowMtaBox,
    isExpandMtaBox,
    isExpandWaveformBox: false,
    isPinned: false,
    isFav: false,
    bowlCoord: { x: 0, y: 0 },
    /** The actual coord of dict panel might be different */
    dictPanelCoord: isOptionsPage()
      ? { x: window.innerWidth - config.panelWidth - 20, y: 80 }
      : { x: 0, y: 0 },
    panelHeight: 30,
    _panelHeightCache: {
      menubar: 30,
      mtabox: 0,
      dictlist: 0,
      waveformbox: 0,
      sum: 30,
      /** independent layer */
      floatHeight: 0
    },
    panelMaxHeight: (window.innerHeight * config.panelMaxHeightRatio) / 100,
    /** Dicts that will be rendered to dict panel */
    renderedDicts: [] as {
      readonly id: DictID
      readonly searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
      readonly searchResult: any
      readonly catalog?: DictSearchResult<DictID>['catalog']
    }[],
    /** User manually folded or unfolded */
    userFoldedDicts: {
      baidu: false,
      bing: false,
      ahdict: false,
      oaldict: false,
      caiyun: false,
      cambridge: false,
      cnki: false,
      cobuild: false,
      etymonline: false,
      eudic: false,
      google: false,
      googledict: false,
      guoyu: false,
      hjdict: false,
      jikipedia: false,
      jukuu: false,
      lexico: false,
      liangan: false,
      longman: false,
      macmillan: false,
      mojidict: false,
      naver: false,
      renren: false,
      sogou: false,
      tencent: false,
      urban: false,
      vocabulary: false,
      weblio: false,
      weblioejje: false,
      merriamwebster: false,
      websterlearner: false,
      wikipedia: false,
      youdao: false,
      youdaotrans: false,
      zdic: false
    },
    /** Search text */
    text: '',
    /** 0 is the oldest */
    searchHistory: [] as Word[],
    /** User can view back search history */
    historyIndex: -1,
    /** Record init coordinate on dragstart */
    dragStartCoord: null as null | { x: number; y: number },
    lastPlayAudio: null as null | { src: string; timestamp: number },
    increasePopulation () {
      set((state) => ({ bears: state.bears + 1 }))
    },
    removeAllBears: () => set({ bears: 0 })
  }
  return result
})

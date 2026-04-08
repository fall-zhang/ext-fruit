import type { DictID } from '@/core/api-server/config'
import type { SupportedLangs } from '@/core/api-server/types/dict-base'

export type LangCode = 'zh-CN' | 'zh-TW' | 'en'

type InstantSearchKey = 'direct' | 'ctrl' | 'alt' | 'shift'
export type TCDirection = |
  'CENTER' |
  'TOP' |
  'RIGHT' |
  'BOTTOM' |
  'LEFT' |
  'TOP_LEFT' |
  'TOP_RIGHT' |
  'BOTTOM_LEFT' |
  'BOTTOM_RIGHT'

export type ModeConfType = {
  /** direct: on mouseup */
  direct: boolean,
  /** double: double click */
  double: boolean,
  /** holding a key */
  holding: {
    alt: boolean,
    shift: boolean,
    ctrl: boolean,
    meta: boolean,
  },
  /** cursor instant capture */
  instant: {
    enable: boolean,
    key: InstantSearchKey,
    delay: number,
  },
}

export type SaladConfigType = {
  version: number,

  /** activate app */
  active: boolean,

  /**
   * 应用后台运行
   * Run extension in background
   */
  runInBg: boolean

  /**
   * 随着开机进行自启动
   */
  startOnBoot: boolean

  /** enable update check */
  updateCheck: boolean,

  /** disable selection on type fields, like input and textarea */
  noTypeField: boolean,

  /**
   * use animation for transition
   * 是否开启应用动画
   */
  animation: boolean,

  /** language code for locales 本地 Language Code */
  langCode: LangCode,

  /** panel width */
  panelWidth: number,

  /** panel max height in percentage, 0 < n < 100 */
  panelMaxHeightRatio: number,

  bowlOffsetX: number,

  bowlOffsetY: number,

  darkMode: boolean,

  /** custom panel css */
  panelCSS: '',

  /** panel font-size */
  fontSize: 13,

  /** track search history */
  searchHistory: boolean,

  /** open word editor when adding a word to notebook */
  editOnFav: boolean,

  /** Show suggestions when typing on search box */
  searchSuggests: boolean,

  /** Enable touch related support */
  touchMode: boolean,

  /**
   * 搜索触发方式，以及如何搜索
   * when and how to search text
   */
  mode: ModeConfType

  /** when and how to search text inside dict panel */
  panelMode: ModeConfType

  /** double click delay, in ms */
  doubleClickDelay: 450,

  /** show quick search panel when triple press ctrl */
  tripleCtrl: boolean,

  /** where should the dict appears */
  qsLocation: TCDirection,

  /** focus quick search panel when shows up */
  qsFocus: boolean,

  /** pin panel when shows up  */
  defaultPinned: boolean,

  baHeight: 550,

  baAuto: boolean,

  /** context tranlate engines */
  ctxTrans: {
    google: boolean,
    youdaotrans: boolean,
    baidu: boolean,
    tencent: boolean,
    caiyun: boolean,
    sogou: boolean,
  },

  /** start searching when source containing the languages */
  language: SupportedLangs,

  /** auto pronunciation */
  autoPronounce: {
    cn: {
      dict: DictID | '',
      list: DictID[],
    },
    en: {
      dict: DictID | '',
      list: DictID[],
      accent: 'us' | 'uk',
    },
    machine: {
      dict: DictID | '',
      list: ['google', 'sogou', 'tencent', 'baidu', 'caiyun'],
      // play translation or source
      src: 'trans' | 'searchText',
    },
  },

  /** enable Google analytics */
  analytics: boolean,
}


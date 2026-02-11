import type { DictID } from '.'
import type { SupportedLangs } from '../utils/lang-check'
import type { DictAuths } from './auth'

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
type PreloadSource = '' | 'clipboard' | 'selection'

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

export type ConfigType = {
  version: number,

  /** activate app, won't affect triple-ctrl setting */
  active: boolean,

  /**
   * 应用后台运行
   * Run extension in background
   */
  runInBg: boolean

  /** enable update check */
  updateCheck: boolean,

  /** disable selection on type fields, like input and textarea */
  noTypeField: boolean,

  /** use animation for transition */
  animation: boolean,

  /** language code for locales */
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

  /** when and how to search text if the panel is pinned */
  pinMode: ModeConfType

  /** when and how to search text inside dict panel */
  panelMode: ModeConfType

  /** when this is a quick search standalone panel running */
  qsPanelMode: ModeConfType

  /** hover instead of click */
  bowlHover: boolean,

  /** double click delay, in ms */
  doubleClickDelay: 450,

  /** show quick search panel when triple press ctrl */
  tripleCtrl: boolean,

  /** preload content on quick search panel */
  qsPreload: PreloadSource,

  /** auto search when quick search panel opens */
  qsAuto: boolean,

  /** where should the dict appears */
  qsLocation: TCDirection,

  /** focus quick search panel when shows up */
  qsFocus: boolean,

  /** pin panel when shows up  */
  defaultPinned: boolean,

  /** should panel be in a standalone window */
  qsStandalone: boolean,

  /** standalone panel height */
  qssaHeight: number,

  /** resize main widnow to leave space to standalone window */
  qssaSidebar: '' | 'left' | 'right',

  /** should standalone panel response to page selection */
  qssaPageSel: boolean,

  /** should standalone panel memo position and dimension on close */
  qssaRectMemo: boolean,

  /** browser action panel width defaults to as wide as possible */
  baWidth: -1,

  baHeight: 550,

  /** browser action panel preload source */
  baPreload: PreloadSource,

  /** auto search when browser action panel shows */
  baAuto: boolean,

  /**
   * browser action behavior
   * 'popup_panel' - show dict panel
   * 'popup_fav' - add selection to notebook
   * 'popup_options' - opten options
   * 'popup_standalone' - open standalone panel
   * others are same as context menus
   */
  baOpen: 'popup_panel' | 'popup_fav' | 'popup_options'

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
  autopron: {
    cn: {
      dict: DictID | '',
      list: DictID[],
    },
    en: {
      dict:DictID | '',
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

  /** URLs, [regexp.source, match_pattern] */
  whitelist: Array<[string, string]>,
  /** URLs, [regexp.source, match_pattern] */
  // tslint:disable-next-line: no-unnecessary-type-assertion
  blacklist: Array<[string, string]>

  contextMenus: {
    selected:string[]
    all: Record<string, string>,
  }

  /** Open settings on first switching "translation" profile */
  showedDictAuth: boolean,
  dictAuth: DictAuths


  /** enable Google analytics */
  analytics: boolean,
}


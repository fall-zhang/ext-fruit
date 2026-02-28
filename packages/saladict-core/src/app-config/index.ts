import type { ReadonlyDeep } from 'type-fest'
import { getAllContextMenus } from './context-menus'
import type { MtaAutoUnfold as _MtaAutoUnfold } from './profiles'
import { getDefaultDictAuths } from './auth'
import type { ConfigType } from './config-type'
import type { AllDictsConf, getAllDicts } from '@P/api-server/types/all-dict-conf'


export type DictConfigs = ReadonlyDeep<AllDictsConf>
export type DictID = keyof AllDictsConf
export type MtaAutoUnfold = _MtaAutoUnfold

export type AppConfigMutable = ConfigType
export type AppConfig = ReadonlyDeep<ConfigType>

export function getDefaultConfig ():ConfigType {
  return {
    version: 14,
    active: true,
    runInBg: false,
    analytics: true,
    updateCheck: true,
    noTypeField: false,
    animation: true,
    langCode: 'zh-CN',
    panelWidth: 450,
    panelMaxHeightRatio: 80,
    bowlOffsetX: 15,
    bowlOffsetY: -45,
    darkMode: false,
    panelCSS: '',
    fontSize: 13,
    searchHistory: false,
    editOnFav: true,
    searchSuggests: true,
    touchMode: false,
    mode: {
      direct: false,
      double: false,
      holding: {
        alt: false,
        shift: false,
        ctrl: false,
        meta: false,
      },
      instant: {
        enable: false,
        key: 'alt',
        delay: 600,
      },
    },
    pinMode: {
      /** direct: on mouseup */
      direct: true,
      /** double: double click */
      double: false,
      /** holding a key */
      holding: {
        alt: false,
        shift: false,
        ctrl: false,
        meta: false,
      },
      /** cursor instant capture */
      instant: {
        enable: false,
        key: 'alt',
        delay: 600,
      },
    },

    /** when and how to search text inside dict panel */
    panelMode: {
      /** direct: on mouseup */
      direct: false,
      /** double: double click */
      double: false,
      /** holding a key */
      holding: {
        alt: false,
        shift: false,
        ctrl: false,
        meta: false,
      },
      /** cursor instant capture */
      instant: {
        enable: false,
        key: 'alt',
        delay: 600,
      },
    },

    /** when this is a quick search standalone panel running */
    qsPanelMode: {
      /** direct: on mouseup */
      direct: true,
      /** double: double click */
      double: false,
      /** holding a key */
      holding: {
        alt: false,
        shift: false,
        ctrl: true,
        meta: false,
      },
      /** cursor instant capture */
      instant: {
        enable: false,
        key: 'alt',
        delay: 600,
      },
    },

    /** hover instead of click */
    bowlHover: true,

    /** double click delay, in ms */
    doubleClickDelay: 450,

    /** show quick search panel when triple press ctrl */
    tripleCtrl: true,

    /** preload content on quick search panel */
    qsPreload: 'selection',

    /** auto search when quick search panel opens */
    qsAuto: false,

    /** where should the dict appears */
    qsLocation: 'CENTER',

    /** focus quick search panel when shows up */
    qsFocus: true,

    /** pin panel when shows up  */
    defaultPinned: false,

    /** should panel be in a standalone window */
    qsStandalone: true,

    /** resize main widnow to leave space to standalone window */
    qssaSidebar: '',

    /** should standalone panel response to page selection */
    qssaPageSel: true,

    /** should standalone panel memo position and dimension on close */
    qssaRectMemo: false,

    /** browser action panel width defaults to as wide as possible */
    baWidth: -1,

    baHeight: 550,

    /** browser action panel preload source */
    baPreload: 'selection',

    /** auto search when browser action panel shows */
    baAuto: false,

    baOpen: 'popup_panel',

    /** context tranlate engines */
    ctxTrans: {
      google: true,
      youdaotrans: true,
      baidu: true,
      tencent: false,
      caiyun: false,
      sogou: false,
    },

    /** start searching when source containing the languages */
    language: {
      chinese: true,
      english: true,
      japanese: true,
      korean: true,
      french: true,
      spanish: true,
      deutsch: true,
      others: false,
      matchAll: false,
    },

    /** auto pronunciation */
    autopron: {
      cn: {
        dict: '',
        list: ['zdic', 'guoyu'],
      },
      en: {
        dict: '',
        list: [
          'bing',
          'cambridge',
          'cobuild',
          'eudic',
          'longman',
          'macmillan',
          'lexico',
          'urban',
          'websterlearner',
          'youdao',
        ],
        accent: 'uk',
      },
      machine: {
        dict: '',
        list: ['google', 'sogou', 'tencent', 'baidu', 'caiyun'],
        // play translation or source
        src: 'trans',
      },
    },

    /** URLs, [regexp.source, match_pattern] */
    whitelist: [],
    /** URLs, [regexp.source, match_pattern] */
    blacklist: [
      ['^https://stackedit\\.io(/.*)?$', 'https://stackedit.io/*'],
      ['^https://docs\\.google\\.com(/.*)?$', 'https://docs.google.com/*'],
      ['^https://docs\\.qq\\.com(/.*)?$', 'https://docs.qq.com/*'],
    ],

    contextMenus: {
      selected: ['google_translate', 'saladict'],
      // : ['view_as_pdf', 'caiyuntrs', 'google_translate', 'saladict'],
      all: getAllContextMenus(),
    },

    /** Open settings on first switching "translation" profile */
    showedDictAuth: false,
    dictAuth: getDefaultDictAuths(),
  }
}

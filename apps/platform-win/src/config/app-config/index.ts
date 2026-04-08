import type { ReadonlyDeep } from 'type-fest'
import { getAllContextMenus } from './context-menus'
import type { SaladConfigType } from './config-type'

export type AppConfigMutable = SaladConfigType
export type AppConfig = ReadonlyDeep<SaladConfigType>

export function getDefaultConfig (): SaladConfigType {
  return {
    version: 1,
    active: true,
    startOnBoot: false,
    runInBg: false,
    analytics: true,
    updateCheck: true,
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

    /** double click delay, in ms */
    doubleClickDelay: 450,

    /** show quick search panel when triple press ctrl */
    tripleCtrl: true,


    /** where should the dict appears */
    qsLocation: 'CENTER',

    /** focus quick search panel when shows up */
    qsFocus: true,

    /** pin panel when shows up  */
    defaultPinned: false,

    baHeight: 550,

    /** auto search when browser action panel shows */
    baAuto: false,

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
    autoPronounce: {
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
  }
}

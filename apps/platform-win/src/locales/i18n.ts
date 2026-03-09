import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'
import { zhCN } from './langMap'

export type LangCode = 'zh-CN' | 'zh-TW' | 'en'
export type Namespace = 'common' | 'content' | 'langCode' | 'menus' | 'options' | 'popup' | 'wordPage' | 'dicts' | 'sync'

export interface RawLocale {
  'zh-CN': string
  'zh-TW': string
  en: string
}

export interface RawLocales {
  [message: string]: RawLocale
}

export interface RawDictLocales {
  name: RawLocale
  options?: RawLocales
  helps?: RawLocales
}

export interface DictLocales {
  name: string
  options?: {
    [message: string]: any
  }
  helps?: {
    [message: string]: any
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'zh-CN',
    fallbackLng: false,
    resources: {
      'zh-CN': {
        ...zhCN,
      },
    },
    saveMissing: false,
    load: 'currentOnly',
    debug: import.meta.env.DEV,
    ns: 'common',
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n

import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'
import type { ExtendSupportLang } from '@P/open-trans/languages/src/languages'

export type YoudaotransLanguage = ExtendSupportLang<
  'zh-CN' | 'en' | 'pt' | 'es' | 'ja' | 'ko' | 'fr' | 'ru'
>

export type YoudaotransConfig = DictItemBase & DictItemOption<YoudaotransLanguage>

export default (): YoudaotransConfig => ({
  lang: '11011111',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
    others: true,
    matchAll: false,
  },
  defaultUnfold: {
    english: true,
    chinese: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
    others: true,
    matchAll: false,
  },
  selectionWC: {
    min: 1,
    max: 9999999,
  },
  options: {
    keepLF: 'all',
    slInitial: 'collapse',
    tl: 'default',
    tl2: 'default',
  },
  optionalVal: {
    keepLF: ['none', 'all'],
    slInitial: ['collapse', 'hide', 'full'],
    tl: ['default', 'zh-CN', 'en', 'ja', 'ko', 'fr', 'es', 'ru'],
    tl2: ['default', 'zh-CN', 'en', 'ja', 'ko', 'fr', 'es', 'ru'],
  },
})

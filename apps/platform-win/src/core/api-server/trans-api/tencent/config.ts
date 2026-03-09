import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'
import type { ExtendSupportLang } from '@P/open-trans/languages/src/languages'

export type TencentLanguage = ExtendSupportLang<
  'zh-CN' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru'
>

export type TencentConfig = DictItemBase & DictItemOption<TencentLanguage>

export default (): TencentConfig => ({
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
    tl: ['default', 'zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
    tl2: ['default', 'zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
  },
})


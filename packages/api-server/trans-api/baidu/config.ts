import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'
import type { ExtendLocaleLang } from '@P/open-trans/languages/src/languages'

export type BaiduLanguage = ExtendLocaleLang<'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru' | 'nl'>

export type BaiduConfig = DictItemBase & DictItemOption<BaiduLanguage>

export default (): BaiduConfig => {
  return {
    lang: '11111111',
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
      tl: ['default', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
      tl2: ['default', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'nl'],
    },
  }
}
// machineConfig<BaiduConfig>(
//   [],
//   {}
// )

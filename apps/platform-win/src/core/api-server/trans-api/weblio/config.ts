import type { DictItemBase } from '@P/api-server/types/dict-base'

export type WeblioConfig = DictItemBase

export default (): WeblioConfig => ({
  lang: '00010000',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: true,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
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
  // preferredHeight: 265,
  selectionWC: {
    min: 1,
    max: 20,
  },
})

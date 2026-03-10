import type { DictItemBase } from '@/core/api-server/types/dict-base'

export type CnkiConfig = DictItemBase & {
  options: {
    dict: boolean
    senbi: boolean
    seneng: boolean

  }
}

export default (): CnkiConfig => ({
  lang: '11000000',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: false,
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
  selectionWC: {
    min: 1,
    max: 100,
  },
  options: {
    dict: true,
    senbi: true,
    seneng: true,
    // digests: true,
  },
})

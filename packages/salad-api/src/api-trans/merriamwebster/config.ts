import type { DictItemBase } from '@/core/api-server/types/dict-base'
export type MerriamWebsterConfig = DictItemBase & {
  options: {
    resultCount: number
  }
}

export default (): MerriamWebsterConfig => ({
  lang: '10000000',
  selectionLang: {
    english: true,
    chinese: false,
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
    max: 5,
  },
  options: {
    resultCount: 4,
  },
})

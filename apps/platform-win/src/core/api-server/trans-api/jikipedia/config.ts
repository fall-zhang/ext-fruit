import type { DictItemBase } from '@/core/api-server/types/dict-base'
export type UrbanConfig = DictItemBase & {
  options: {
    resultCount: number
  }
}

export default (): UrbanConfig => ({
  lang: '01000000',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: false,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
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
    max: 5,
  },
  options: {
    resultCount: 4,
  },
})

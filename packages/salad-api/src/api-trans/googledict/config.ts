import type { DictItemBase } from '@/core/api-server/types/dict-base'

export type GoogledictConfig = DictItemBase & {
  options: {
    enresult: boolean
  }
}

export default (): GoogledictConfig => ({
  lang: '11110000',
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
    max: 5,
  },
  options: {
    enresult: true,
  },
})

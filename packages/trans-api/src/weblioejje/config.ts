import { DictItem } from '@P/trans-api/types/api-types'

export type VocabularyConfig = DictItem

export default (): VocabularyConfig => ({
  lang: '10010000',
  selectionLang: {
    english: true,
    chinese: false,
    japanese: true,
    korean: false,
    french: false,
    spanish: false,
    deutsch: false,
    others: false,
    matchAll: false
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
    matchAll: false
  },
  preferredHeight: 400,
  selectionWC: {
    min: 1,
    max: 999
  }
})

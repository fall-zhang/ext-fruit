import { DictItem } from '@P/trans-api/types/api-types'

export type ZdicConfig = DictItem<{
  audio: boolean
}>

export default (): ZdicConfig => ({
  lang: '01000000',
  selectionLang: {
    english: false,
    chinese: true,
    japanese: false,
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
    max: 5
  },
  options: {
    audio: false
  }
})

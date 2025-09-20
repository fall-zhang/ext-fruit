import { DictItem } from '@/types/api-types'

export type MacmillanConfig = DictItem<{
  related: boolean
  locale: 'uk' | 'us'
}>

export default (): MacmillanConfig => ({
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
  preferredHeight: 465,
  selectionWC: {
    min: 1,
    max: 5
  },
  options: {
    related: true,
    locale: 'uk'
  },
  optionsSel: {
    locale: ['uk', 'us']
  }
})

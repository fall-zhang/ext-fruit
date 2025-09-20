import { DictItem } from '@/types/api-types'

export type JukuuConfig = DictItem<{
  lang: 'zheng' | 'engjp' | 'zhjp'
}>

export default (): JukuuConfig => ({
  lang: '11010000',
  selectionLang: {
    english: true,
    chinese: true,
    japanese: true,
    korean: true,
    french: true,
    spanish: true,
    deutsch: true,
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
  preferredHeight: 300,
  selectionWC: {
    min: 1,
    max: 99999
  },
  options: {
    lang: 'zheng'
  },
  optionsSel: {
    lang: ['zheng', 'engjp', 'zhjp']
  }
})

import type { DictItemBase } from '@P/api-server/types/dict-base'
export type JukuuConfig = DictItemBase & {
  options: {
    lang: 'zheng' | 'engjp' | 'zhjp'
  }
}

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
    max: 99999,
  },
  options: {
    lang: 'zheng',
  },
  optionalVal: {
    lang: ['zheng', 'engjp', 'zhjp'],
  },
})

import type { DictItemBase } from '@P/api-server/types/dict-base'

export type GuoyuConfig = DictItemBase & {
  options: {
  /** show translation */
    trans: boolean
  }
}

export default (): GuoyuConfig => ({
  lang: '00100000',
  selectionLang: {
    english: false,
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
    max: 5,
  },
  options: {
    trans: true,
  },
})

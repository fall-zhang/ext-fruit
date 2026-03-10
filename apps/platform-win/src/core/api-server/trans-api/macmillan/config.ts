import type { DictItemBase } from '@/core/api-server/types/dict-base'
export type MacmillanConfig = DictItemBase & {
  options: {
    related: boolean
    locale: 'uk' | 'us'
  }
  optionalVal: {
    locale: Array<'uk' | 'us'>
  }
}

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
    related: true,
    locale: 'uk',
  },
  optionalVal: {
    locale: ['uk', 'us'],
  },
})

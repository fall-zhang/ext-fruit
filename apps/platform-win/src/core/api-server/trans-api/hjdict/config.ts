import type { DictItemBase } from '@P/api-server/types/dict-base'

export type HjdictConfig = DictItemBase & {
  options: {
    related: boolean
    chsas: 'jp/cj' | 'jp/jc' | 'kr' | 'w' | 'fr' | 'de' | 'es'
    engas: 'w' | 'fr' | 'de' | 'es'
    uas: 'fr' | 'de' | 'es'
    aas: 'fr' | 'de'
    eas: 'fr' | 'es'
  }
  optionalVal: {
    chsas: Array<'jp/cj' | 'jp/jc' | 'kr' | 'w' | 'fr' | 'de' | 'es'>
    engas: Array<'w' | 'fr' | 'de' | 'es'>
    uas: Array<'fr' | 'de' | 'es'>
    aas: Array<'fr' | 'de'>
    eas: Array<'fr' | 'es'>
  }
}

export default (): HjdictConfig => ({
  lang: '10011111',
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
    max: 10,
  },
  options: {
    related: true,
    chsas: 'jp/jc',
    engas: 'w',
    uas: 'fr',
    aas: 'fr',
    eas: 'fr',
  },
  optionalVal: {
    chsas: ['jp/cj', 'jp/jc', 'kr', 'w', 'fr', 'de', 'es'],
    engas: ['w', 'fr', 'de', 'es'],
    uas: ['fr', 'de', 'es'],
    aas: ['fr', 'de'],
    eas: ['fr', 'es'],
  },

})

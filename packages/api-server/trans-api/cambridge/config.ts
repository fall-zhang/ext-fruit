import type { DictItemBase, DictItemOption } from '@P/api-server/types/dict-base'

export type CambridgeConfig = DictItemBase & DictItemOption<'default' | 'en' | 'en-chs' | 'en-chz'
> & {
  related: boolean
}

export default (): CambridgeConfig => ({
  lang: '11100000',
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
    keepLF: 'none',
    slInitial: 'hide',
    tl: 'default',
    tl2: 'default',
  },
  options_sel: {
    lang: ['default', 'en', 'en-chs', 'en-chz'],
    CambridgeConfig: [],
  },
})

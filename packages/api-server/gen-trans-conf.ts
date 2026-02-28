import type { Language } from '@P/open-trans/languages'
import type { SupportedLangs } from './utils/lang-check'

interface DictItemBase<Lang> {
  /**
   * Supported language: en, zh-CN, zh-TW, ja, kor, fr, de, es
   * `1` for supported
   */
  lang: string
  /** Show this dictionary when selection contains words in the chosen languages. */
  selectionLang: SupportedLangs
  /**
   * Otherwise it'll only start seaching when user clicks the unfold button.
   * Default MUST be true and let user decide.
   */
  defaultUnfold: SupportedLangs
  /**
   * This is the default height when the dict first renders the result.
   * If the content height is greater than the preferred height,
   * the preferred height is used and a mask with a view-more button is shown.
   * Otherwise the content height is used.
   */
  selectionWC: {
    min: number
    max: number
  }
  options: {
  /** Keep linebreaks */
    keepLF: 'none' | 'all'
    /** Source language initial state */
    slInitial: 'hide' | 'collapse' | 'full'
    tl: 'default' | Lang
    tl2: 'default' | Lang
  }
  optionsSel: {
    keepLF: Array<'none' | 'all'>
    slInitial: ['collapse', 'hide', 'full'],
    tl: Array<Lang | 'default'>,
    tl2: Array<Lang | 'default'>,
  },
}
export type ExtractLangFromConfig<Config> = Config extends DictItemBase<
  infer Lang
>
  ? Lang
  : never


export function machineConfig<Config extends DictItemBase<Language>> (
  langs: ExtractLangFromConfig<Config>[],
  /** overwrite configs */
  config: Partial<Config>
): DictItemBase<ExtractLangFromConfig<Config>> {
  const setting: DictItemBase<ExtractLangFromConfig<Config>> = {
    lang: '11111111',
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
      max: 9999999,
    },
    options: {
      keepLF: 'all',
      slInitial: 'collapse',
      tl: 'default',
      tl2: 'default',
    },
    optionsSel: {
      keepLF: ['none', 'all'],
      slInitial: ['collapse', 'hide', 'full'],
      tl: ['default', ...langs],
      tl2: ['default', ...langs],
    },
    ...config,
  }
  return setting
}

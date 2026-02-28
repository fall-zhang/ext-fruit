import type { ArrayValues } from 'type-fest'

const languages = [
  'chinese',
  'english',
  'japanese',
  'korean',
  'french',
  'spanish',
  'deutsch',
] as const

type Languages = ArrayValues<typeof languages>

export type SupportedLangs = {
  [key in Languages | 'others' | 'matchAll']: boolean
}

/**
 * 每个 API 都需要实现的配置
 * config for every API
 */
export interface DictItemBase {
  /**
   * Supported language: en, zh-CN, zh-TW, ja, kor, fr, de, es
   * `1` for supported
   * @example 11000000
   */
  lang: string
  /**
   * Show this dictionary when selection contains words in the chosen languages.
   *
   * 当前文本所对应的语言包含时，展示该语言翻译内容
  */
  selectionLang: SupportedLangs
  /**
   * If set to true, the dict start searching automatically.
   * Otherwise it'll only start searching when user clicks the unfold button.
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
}

/**
 * 额外的 options 配置
 */
export type DictItemOption<Lang> = {
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

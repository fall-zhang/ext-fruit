import type { Language } from '@P/open-trans/languages'

/**
 * 当前 API 的信息
 */
export type ApiInfo = {
  from: Array<Language>
  to: Array<Language>
  /**
   * 字翻译类型，比如中译中，英译英
   */
  type: 'self-trans' | 'word-trans' | 'paragraph-trans'
  maxWord: number
  minWOrd: number
}

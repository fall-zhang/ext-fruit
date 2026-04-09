import type { Language } from '@P/open-trans/languages'

/**
 * 每个 API 翻译时需要的通用信息
 */
export type ApiInfo = {
  enName: string,
  zhName: string,

  from: Array<Language>
  to: Array<Language>
  /**
   * 'self-trans' 自翻译类型，比如中译中，英译英
   * 'word-trans' 单词翻译
   * 'paragraph-trans' 段落翻译
   */
  type: 'self-trans' | 'word-trans' | 'paragraph-trans'
  maxWord: number
  minWord: number
}

export type AuthApiInfo<T = undefined> = ApiInfo & {
  auth: T
}


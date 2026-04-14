import type { Language } from '../const/languages'
export type HTMLString = string

export interface AtomSearchResult<Result = unknown> {
  /** search result */
  result: Result
  /** auto play sound */
  audio?: {
    uk?: string
    us?: string
    py?: string
  }
}

export type WordResponse = {
  /**
   * 翻译的引擎
   */
  engin: string
  type: 'word-trans'
  from: Language
  to: Language
  /** 翻译的文本 */
  text: string
  /** 单词翻译结果 */
  translate: string
  // 发音
  pronounce: {
    zh?: string
    en?: string
    uk?: string
  }
  /**
   * 同义词，对内容进行扩展
   */
  commonDefinitions?: Array<{
    pronounce?: string
    phoneticSymbol?: string
    text: string
    translate: string
  }>
  /**
   * 单词变形，名词，动词，副词等变换
   */
  associateWord?: Array<{
    pronounce?: string
    phoneticSymbol?: string
    text: string
    translate: string
  }>

  /**
   * 示例内容，如果是单词，会有示例相关的内容
   */
  exampleParagraph?: Array<{
    pronounce?: string
    text: string
    translate: string
    // 该单词出自
    source?: string
  }>
}

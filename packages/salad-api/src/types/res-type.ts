import type { DictID } from '../api-trans/api-config'
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
/**
 * from/to 不同的翻译
 * 例如 en -> zh
 */
export type WordResponse = {
  /**
   * 翻译的引擎
   */
  engin: DictID
  type: 'word-trans'
  from: Language
  to: Language
  /** 翻译的文本 */
  text: string
  /** （动词）原形 */
  infinitive?: string
  /** 单词出现频率，重要程度 */
  wordStars?: number // 1 | 2 | 3 | 4 | 5
  /** 单词翻译结果 */
  translate: Array<{
    translate: string
    // type?: 'verb'
  }>
  /** 发音 */
  pronounce: Array<{
    phoneticSymbols?: string
    lang: Language | 'en-US' | 'en-UK'
    src: string
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
   * 同义词，对内容进行扩展
   */
  commonDefinitions?: Array<{
    pronounce?: string
    phoneticSymbol?: string
    text: string
    translate: string
  }>
  /**
   * 反义词，对内容进行扩展
   */
  antonymDefinitions?: Array<{
    pronounce?: string
    phoneticSymbol?: string
    text: string
    translate: string
  }>
  /**
   * 示例内容，会有示例相关的内容
   */
  exampleParagraph?: Array<{
    pronounce?: string
    text: string
    translate: string
    // 该单词出自
    source?: string
  }>
}

export type ParagraphResponse = {
  /**
   * 翻译的引擎
   */
  engin: DictID
  type: 'paragraph-trans'
  from: Language
  to: Language
  /** 翻译的文本 */
  text: string
  /** 单词翻译结果 */
  translate: string
  /** 发音 */
  pronounce: Array<{
    lang: Language
    src: string
  }>
}

export type UnitResponse = WordResponse | ParagraphResponse
export type UnitSearchResult = UnitResponse

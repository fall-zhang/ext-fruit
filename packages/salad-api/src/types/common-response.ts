import type { Language } from '../const/languages'

export type WordResponse = {
  /**
   * 翻译的引擎
   */
  engin: string
  from: Language
  to: Language
  /** 翻译的文本 */
  text: string
  /** 单词翻译结果 */
  translate: string
  /**
   * 关联内容，如果是单词，对内容进行扩展
   */
  associateWord: Array<{
    pronounce?: string
    text: string
    translate: string
  }>
  /**
   * 示例内容，如果是单词，会有示例相关的内容
   */
  exampleParagraph: Array<{
    pronounce?: string
    text: string
    translate: string
  }>
}

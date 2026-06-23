import type { SupportLanguage } from '../main'
import type { UnitSearchResult } from './res-type'

/**
 * 获取该引擎 fetch 方法所需的参数
 */
export type AtomFetchRequest<T = unknown> = {
  (
    text: string,
    opt: {
      from: SupportLanguage
      to: SupportLanguage
      option?: T
    }
  ): Request
}


/**
 * 获取该引擎对于返回结果的处理
 * 这些内容是 open-trans 共同需要的内容
 */
export type AtomResponseHandle = {
  (
    res: Response,
    context: {
      text: string
      from: SupportLanguage
      to: SupportLanguage
    }
  ): Promise<UnitSearchResult>
}
/**
 * 获取当前单词对应查词引擎的源页面
 *
 * Return a dictionary source page url for the dictionary header
 */
export interface AtomGetSrcFunction {
  // config 当前配置
  (
    text: string,
    localLangCode: 'zh-CN' | 'zh-TW' | 'en',
  ): string | Promise<string>
}

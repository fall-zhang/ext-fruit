import type { Language } from '@P/open-trans/languages'
import type { AllDictsConf } from '../types/all-dict-conf'
import type { DictSearchResult } from './search-type'

/**
 * 获取该引擎 fetch 方法所需的参数
 */
export type GetFetchRequest<T = unknown> = {
  (
    text: string,
    opt: {
      from?: Language
      to?: Language
      option?: T
    }
  ): Request
}


/**
 * 获取该引擎对于返回结果的处理
 * 这些内容是 open-trans 共同需要的内容
 */
export type HandleFetchResponse<Result = unknown> = {
  (
    res: Response,
    context: {
      text: string
      from: Language
      to: Language
      profile: AllDictsConf
    }
  ): Promise<DictSearchResult<Result>>
}
/**
 * 获取当前查词引擎的源页面
 *
 * Return a dictionary source page url for the dictionary header
 */
export interface GetSrcPageFunction {
  // config 当前配置
  (
    text: string,
    localLangCode: 'zh-CN' | 'zh-TW' | 'en',
    profile: AllDictsConf
  ): string | Promise<string>
}

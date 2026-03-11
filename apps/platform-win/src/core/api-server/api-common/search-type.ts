import type { Language } from '@P/open-trans/languages'
import type { AllDictsConf } from '../types/all-dict-conf'
// import type { AppConfig } from '@/config/app-config'
import type { DictAuths } from '@/config/trans-profile/auth'

/**
 * Fetch and parse dictionary search result
 *
 * 获取和解析查询结果
 */
export interface SearchFunction<Result = unknown> {
  (
    text: string,
    options: {
      // config: AppConfig,
      profile: AllDictsConf,
      dictAuth?: DictAuths
      // 语言相关配置
      from?: Language
      to?: Language
      localLang?: 'en' | 'zh-CN' | 'zh-TW'
      /** 保留换行 */
      keepLF?: boolean
    }
  ): Promise<DictSearchResult<Result>>
}


export interface DictSearchResult<Result = unknown> {
  /** search result */
  result: Result
  /** auto play sound */
  audio?: {
    uk?: string
    us?: string
    py?: string
  }
  /** generate menus on dict title bars */
  catalog?: Array<
    {
      // <button>
      key: string
      value: string
      label: string
      options?: undefined
    } |
    {
      // <select>
      key: string
      value: string
      options: Array<{
        value: string
        label: string
      }>
      title?: string
    }
  >
}


export type GetSrcPageFunction = {
  // config 当前配置
  (
    text: string,
    localLangCode: 'zh-CN' | 'zh-TW' | 'en',
    profile: AllDictsConf
  ): string | Promise<string>
}

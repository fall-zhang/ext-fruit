import type { Language } from '@P/open-trans/languages'
import type { AllDictsConf } from '../types/all-dict-conf'
import type { AppConfig } from '@P/saladict-core/src/app-config'


/**
 * Fetch and parse dictionary search result
 *
 * 获取和解析查询结果
 */
export interface SearchFunction<Result, Payload = unknown> {
  (
    text: string,
    options: {
      config: AppConfig,
      profile: AllDictsConf,
      payload: Readonly<Payload>
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

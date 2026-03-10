import type { AppConfig } from '@/config/app-config'
type AllDictsConf = {

}

/**
 * Fetch and parse dictionary search result
 *
 * 获取和解析查询结果
 */
export interface AtomSearchFunction<Result, Payload = unknown> {
  (
    text: string,
    options: {
      config: AppConfig,
      profile: AllDictsConf,
      payload: Readonly<Payload>
    }
  ): Promise<AtomSearchResult<Result>>
}


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

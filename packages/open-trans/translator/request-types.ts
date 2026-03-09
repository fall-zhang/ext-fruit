import type { Language } from '../languages'


/**
 * 获取该引擎对于返回结果的处理
 */
export type HandleFetchResult<Result = unknown> = {
  (res: Response, context: {
    text: string
    from: Language
    to: Language
  }): {
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
}

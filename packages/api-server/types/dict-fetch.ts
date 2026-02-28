import type { DictSearchResult } from '.'

/**
 * 获取该引擎 fetch 方法所需的参数
 */
export type GetFetchParam = {
  (text:string):Request
}
/**
 * 获取该引擎对于返回结果的处理
 */
export type HandleFetchResult<Result> = {
  (res:string):DictSearchResult<Result>
}

import type { AtomSearchResult } from '../types/res-type'

/**
 * 如果用户没有进行登录，或者翻译错误，提供以下默认返回内容
 */
function getUnAuthRes (): AtomSearchResult {
  return {
    result: undefined,
  }
}

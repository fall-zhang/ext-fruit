import type { AtomSearchResult } from '../../types/res-type'

/**
 * 如果用户没有进行登录，那么统一返回以下内容
 */
function getUnAuthRes (): AtomSearchResult {
  return {
    result: undefined,
  }
}

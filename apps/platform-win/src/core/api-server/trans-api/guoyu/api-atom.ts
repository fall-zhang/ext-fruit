import type { GetSrcPageFunction } from '@/core/api-server/api-common/atom-type'
import { getChsToChz } from '@/core/api-server/utils'

export const getSrcPage: GetSrcPageFunction = async text => {
  const transform = getChsToChz()
  return `https://www.moedict.tw/${transform(text)}`
}

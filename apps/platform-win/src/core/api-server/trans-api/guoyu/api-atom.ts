import type { GetSrcPageFunction } from '@/core/api-server/trans-api/atom-type'
import { getChsToChz } from '@/core/api-server/utils'

export const getSrcPage: GetSrcPageFunction = async text => {
  const transform = getChsToChz()
  return `https://www.moedict.tw/${transform(text)}`
}

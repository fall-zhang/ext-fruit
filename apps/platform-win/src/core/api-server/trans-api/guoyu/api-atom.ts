import type { GetSrcPageFunction } from '@P/api-server/api-common/atom-type'
import { getChsToChz } from '@P/api-server/utils'

export const getSrcPage: GetSrcPageFunction = async text => {
  const transform = getChsToChz()
  return `https://www.moedict.tw/${transform(text)}`
}

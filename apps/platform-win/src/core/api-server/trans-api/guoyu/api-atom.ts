import type { GetSrcPageFunction } from '../../api-common/search-type'
import chsToChz from '../../utils/chs-to-chz'

export const getSrcPage: GetSrcPageFunction = async text => {
  return `https://www.moedict.tw/${chsToChz(text)}`
}

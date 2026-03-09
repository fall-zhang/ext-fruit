import type { GetSrcPageFunction } from '../../api-common/atom-type'

export const getSrcPage: GetSrcPageFunction = text => {
  return `http://www.etymonline.com/search?q=${text}`
}

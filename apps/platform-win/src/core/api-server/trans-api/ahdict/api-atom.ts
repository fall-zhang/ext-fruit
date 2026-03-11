import type { GetSrcPageFunction } from '../../api-common/search-type'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://ahdictionary.com/word/search.html?q=${text}`
}

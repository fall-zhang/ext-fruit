import type { AtomGetSrcFunction } from '../../types/atom-type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://ahdictionary.com/word/search.html?q=${text}`
}

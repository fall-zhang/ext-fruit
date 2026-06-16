import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=${text}`
}


export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = handleDOM(dom)
  const result: WordResponse = {
    engin: 'oaldict',
    type: 'word-trans',
    from: 'en',
    to: 'en',
    text,
    translate: [],
    pronounce: [],
  }
  return result
}

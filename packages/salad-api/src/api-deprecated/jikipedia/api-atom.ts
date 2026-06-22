import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { from, to, text }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const resultCount = 4
  const domRes = handleDOM(dom, { resultCount })
  const result: WordResponse = {
    // engin: 'jikipedia',
    engin: 'bing',
    type: 'word-trans',
    from,
    to,
    text,
    translate: [],
    pronounce: [],
  }
  return result
}

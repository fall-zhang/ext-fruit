import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { fetchDirtyDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://ahdictionary.com/word/search.html?q=${text}`
}


export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://ahdictionary.com/word/search.html?q=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return fetchDirtyDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  return handleDOM(dom, { resultCount: 5 })
}

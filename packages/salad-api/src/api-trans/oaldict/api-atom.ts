import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=${text}`
}


export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  return handleDOM(dom)
}

import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.91dict.com/words?w=${encodeURIComponent(text.replace(/\s+/g, '+'))}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = `https://www.91dict.com/words?w=${encodeURIComponent(text.replace(/\s+/g, '+'))}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  return handleDOM(dom)
}

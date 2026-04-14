import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.ldoceonline.com/dictionary/${text
    .trim()
    .split(/\s+/)
    .join('-')}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://www.ldoceonline.com/dictionary/' +
    text.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-')
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const options = profile.longman.options
  return handleDOM(dom, options)
}

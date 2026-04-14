import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `http://www.learnersdictionary.com/definition/${text
    .trim()
    .split(/\s+/)
    .join('-')}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'http://www.learnersdictionary.com/definition/' +
    text.toLowerCase().replace(/[^A-Za-z0-9]+/g, '-')
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const options = profile.websterlearner.options
  return handleDOM(dom, options)
}

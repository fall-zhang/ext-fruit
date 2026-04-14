import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.lexico.com/definition/${text.trim().replace(/\s+/g, '_')}`
}

export const getFetchRequest: AtomFetchRequest = text => {
  const url = `https://www.lexico.com/definition/${text.trim().replace(/\s+/g, '_')}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { profile }) => {
  const { options } = profile.lexico

  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  return handleDOM(dom, options)
}

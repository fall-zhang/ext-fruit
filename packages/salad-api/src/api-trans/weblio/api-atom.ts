import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.weblio.jp/content/${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, _opt) => {
  const url = 'https://www.weblio.jp/content/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, _context) => {
  const dom = await parseDirtyDom(res)
  return handleDOM(dom)
}

import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { ParagraphResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://ejje.weblio.jp/content/${encodeURIComponent(text.replace(/\s+/g, '+'))}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://ejje.weblio.jp/content/${encodeURIComponent(text.replace(/\s+/g, '+'))}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = handleDOM(dom)
  const result: ParagraphResponse = {
    engin: 'weblioejje',
    type: 'paragraph-trans',
    from,
    to,
    text,
    translate: '',
    pronounce: [],
  }
  return result
}

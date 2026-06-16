import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://dict.youdao.com/w/${encodeURIComponent(text.replace(/\s+/g, ' '))}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://dict.youdao.com/w/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'baidu',
    type: 'word-trans',
    from: 'af',
    to: 'af',
    text,
    translate: [],
    pronounce: [],
  }
  if (domRes.type === 'lex') {
    result.wordStars = domRes.stars
  }
  return result
}

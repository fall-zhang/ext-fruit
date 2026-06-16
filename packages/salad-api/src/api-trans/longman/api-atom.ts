import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
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

export const handleResponse: AtomResponseHandle = async (res, { text }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'longman',
    type: 'word-trans',
    from: 'en',
    to: 'en',
    text,
    translate: [],
    pronounce: [],
  }
  if (domRes.result.type === 'lex') {
    result.translate = domRes.result.bussiness.map(item => ({ translate: item.thesaurus || '' }))
  }
  return result
}

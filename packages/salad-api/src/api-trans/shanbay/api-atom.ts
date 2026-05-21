import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text) => {
  return `https://www.shanbay.com/bdc/mobile/preview/word?word=${encodeURIComponent(text.replace(/\s+/g, ' '))}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://www.shanbay.com/bdc/mobile/preview/word?word=' +
    encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const dom = await parseDirtyDom(res)
  const domRes = handleDOM(dom)
  const result: WordResponse = {
    engin: 'urban',
    type: 'word-trans',
    from: 'af',
    to: 'af',
    text: '',
    translate: [],
    pronounce: [],
  }
  return result
}

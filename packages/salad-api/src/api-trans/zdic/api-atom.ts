import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import type { ZdicResult } from './type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.zdic.net/hans/${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.zdic.net/hans/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res) => {
  const dom = await parseDirtyDom(res)
  const domRes = handleDOM(dom)
  const result: WordResponse = {
    engin: 'oaldict',
    type: 'word-trans',
    from: 'af',
    to: 'af',
    text: '',
    translate: [],
    pronounce: [],
  }
  return result
}

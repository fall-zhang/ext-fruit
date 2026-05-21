import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
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
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'baidu',
    type: 'word-trans',
    from: 'zh-CN',
    to: 'zh-CN',
    text: '',
    translate: [],
    pronounce: [],
  }
  return result
}

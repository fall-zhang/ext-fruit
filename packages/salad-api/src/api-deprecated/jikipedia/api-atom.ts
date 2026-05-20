import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://jikipedia.com/search?phrase=${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const resultCount = profile.jikipedia?.options?.resultCount ?? 4
  const domRes = handleDOM(dom, { resultCount })
  const result: WordResponse = {
    // engin: 'jikipedia',
    engin: 'baidu',
    type: 'word-trans',
    from: 'af',
    to: 'af',
    text: '',
    translate: [],
    pronounce: [],
  }
  return result
}

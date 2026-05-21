import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `http://www.urbandictionary.com/define.php?term=${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'http://www.urbandictionary.com/define.php?term=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = handleDOM(dom)
  const result: WordResponse = {
    engin: 'urban',
    type: 'word-trans',
    from: 'en',
    to: 'en',
    text: '',
    translate: [],
    pronounce: [],
  }
  return result
}

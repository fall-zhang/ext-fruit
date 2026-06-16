import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `http://www.etymonline.com/search?q=${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.etymonline.com/word/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')

  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'etymonline',
    type: 'word-trans',
    from,
    to,
    text,
    translate: domRes.map(item => {
      return {
        translate: item.def,
      }
    }),
    pronounce: [],
  }
  return result
}

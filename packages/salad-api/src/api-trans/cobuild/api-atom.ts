import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.collinsdictionary.com/dictionary/english/${encodeURIComponent(text.replace(/\s+/g, '-'))}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.collinsdictionary.com/dictionary/english/' + encodeURIComponent(text.replace(/\s+/g, '-'))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const dom = await parseDirtyDom(res)
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'cobuild',
    type: 'word-trans',
    from,
    to,
    text,
    pronounce: [],
    translate: domRes.result.sections.map(item => {
      return {
        translate: item.content,
      }
    }),
  }

  return result
}

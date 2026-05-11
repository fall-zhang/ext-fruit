import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { ParagraphResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return 'http://dict.cnki.net/old/dict_result.aspx?scw=' + encodeURIComponent(text)
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'http://dict.cnki.net/old/dict_result.aspx?scw=' + encodeURIComponent(text)
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const dom = await parseDirtyDom(res)

  const domRes = await handleDOM(dom)
  const result: ParagraphResponse = {
    engin: 'cnki',
    type: 'paragraph-trans',
    from,
    to,
    text,
    translate: '',
    pronounce: [],
  }
  return result
}

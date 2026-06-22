import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text) => {
  return 'https://www.shanbay.com/bdc/mobile/preview/word?word=' + text
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://www.shanbay.com/bdc/mobile/preview/word?word=' +
    encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const dom = await parseDirtyDom(res)
  const domRes = handleDOM(dom)
  console.log('⚡️ line:18 ~ domRes: ', domRes)
  const result: WordResponse = {
    engin: 'bing',
    type: 'word-trans',
    from,
    to,
    text,
    translate: [],
    pronounce: [],
  }
  return result
}

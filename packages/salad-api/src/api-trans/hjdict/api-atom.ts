import { detectLang } from '@P/open-trans/utils/detect-lang'
import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM, getLangCode } from './engine'
import type { WordResponse } from '../../types/res-type'

// 当前地址为 https://dict.hujiang.com
export const getSrcPage: AtomGetSrcFunction = (text) => {
  const langCode = getLangCode(text)
  return `https://www.hjdict.com/${langCode}/${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  // Note: opt.option should contain the hjdict profile for lang detection
  const langCode = detectLang(text)
  const url = `https://www.hjdict.com/${langCode}/${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const dom = await parseDirtyDom(res)
  const langCode = getLangCode(text)
  const domRes = await handleDOM(dom, langCode)

  const result: WordResponse = {
    engin: 'hjdict',
    type: 'word-trans',
    from,
    to,
    text,
    translate: [],
    pronounce: [],
  }
  // if (domRes.result.type === 'lex') {
  //   domRes.result.entries.map(item =>{
  //     return item
  //   })
  // }
  return result
}


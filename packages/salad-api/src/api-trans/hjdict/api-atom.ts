import { detectLang } from '@P/open-trans/utils/detect-lang'
import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM, getLangCode } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode, profile) => {
  const langCode = getLangCode(text, profile.hjdict)
  return `https://www.hjdict.com/${langCode}/${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  // Note: opt.option should contain the hjdict profile for lang detection
  const langCode = detectLang(text)
  const url = `https://www.hjdict.com/${langCode}/${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const dom = await parseDirtyDom(res)
  const langCode = getLangCode(text, profile.hjdict)
  return handleDOM(dom, profile.hjdict.options, langCode)
}


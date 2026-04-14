import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode, profile) => {
  return `https://cn.bing.com/dict/search?q=${encodeURIComponent(text.replace(/\s+/g, ' '))}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://cn.bing.com/dict/clientsearch?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q=' +
    encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const dom = await parseDirtyDom(res)
  // Derive localLang from the 'to' language: zh-TW for Traditional Chinese, otherwise zh-CN
  const localLang = to === 'zh-TW' ? to : 'zh-CN'
  return handleDOM(dom, { profile, localLang })
}

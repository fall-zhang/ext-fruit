import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GoogleDictResult } from './type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'


/**
 * @deprecated 无法获取请求内容，废弃
 */
export const getSrcPage: AtomGetSrcFunction = text => {
  return (
    'https://www.google.com.hk/search?hl=en&safe=off&q=meaning:' +
    encodeURIComponent(text.toLowerCase().replace(/\s+/g, '+'))
  )
}
/**
 * @deprecated 无法获取请求内容，废弃
 */
export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const isEnQuery = opt.to === 'en'
    ? 'hl=en&gl=en&'
    : ''

  const encodedText = encodeURIComponent(
    text.toLowerCase().replace(/\s+/g, '+')
  )

  const url = `https://www.google.com/search?hl=en&safe=off&${isEnQuery}q=define:${encodedText}`
  return getFetchDOMReq(url)
}
/**
 * @deprecated 无法获取请求内容，废弃
 */
export const handleResponse: AtomResponseHandle<GoogleDictResult> = async (res, { text }) => {
  const domText = await res.text()
  return handleDOM(domText, text)
}

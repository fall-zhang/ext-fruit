import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://dict.youdao.com/w/${encodeURIComponent(text.replace(/\s+/g, ' '))}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://dict.youdao.com/w/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const options = profile.youdao.options
  const transform = null // getChsToChz would need to be imported if needed
  return handleDOM(dom, options, transform)
}

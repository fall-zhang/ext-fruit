import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import type { UrbanResult } from './type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `http://www.urbandictionary.com/define.php?term=${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'http://www.urbandictionary.com/define.php?term=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle<UrbanResult> = async (res, { profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const options = profile.urban.options
  return handleDOM(dom, options)
}

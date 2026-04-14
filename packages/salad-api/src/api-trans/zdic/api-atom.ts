import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import type { ZdicResult } from './type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.zdic.net/hans/${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://www.zdic.net/hans/' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle<ZdicResult> = async (res, { text, from, to, profile }) => {
  const dom = await parseDirtyDom(res)
  const isAudio = profile.zdic.options.audio
  return handleDOM(dom, { isAudio })
}

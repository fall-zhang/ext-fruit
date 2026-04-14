import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import type { JukuuLang, JukuuResult } from './type'
import { handleDOM } from './engine'

function getUrl (text: string, lang: JukuuLang) {
  const newText = encodeURIComponent(text.replace(/\s+/g, '+'))

  switch (lang) {
    case 'engjp':
      return 'http://www.jukuu.com/jsearch.php?q=' + newText
    case 'zhjp':
      return 'http://www.jukuu.com/jcsearch.php?q=' + newText
    // case 'zheng':
    default:
      return 'http://www.jukuu.com/search.php?q=' + newText
  }
}

export const getSrcPage: AtomGetSrcFunction = (text, _localLangCode, profile) => {
  return getUrl(text, profile.jukuu.options.lang)
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const lang = (opt.option as { lang?: JukuuLang })?.lang || 'zheng'
  const url = getUrl(text, lang)
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle<JukuuResult> = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  return handleDOM(dom, profile.jukuu.options.lang)
}

import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import type { JukuuLang, JukuuResult } from './type'
import { handleDOM } from './engine'
import type { ParagraphResponse } from '../../types/res-type'

function getUrl (text: string, lang: JukuuLang) {
  const newText = encodeURIComponent(text.replace(/\s+/g, '+'))

  switch (lang) {
    case 'eng-jp':
      return 'http://www.jukuu.com/jsearch.php?q=' + newText
    case 'zh-jp':
      return 'http://www.jukuu.com/jcsearch.php?q=' + newText
    default:
      return 'http://www.jukuu.com/search.php?q=' + newText
  }
}

export const getSrcPage: AtomGetSrcFunction = (text) => {
  return getUrl(text, 'zh-eng')
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const lang = (opt.option as { lang?: JukuuLang })?.lang || 'zh-eng'
  const url = getUrl(text, 'zh-eng')
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = handleDOM(dom, 'zh-eng')
  const result: ParagraphResponse = {
    // engin: 'jukuu',
    engin: 'baidu',
    type: 'paragraph-trans',
    from,
    to,
    text,
    translate: '',
    pronounce: [],
  }
  return result
}

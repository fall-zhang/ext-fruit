import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { ParagraphResponse } from '../../types/res-type'
import { isContainChinese, isContainJapanese } from '../../utils/detect-lang/lang-check'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import type { WikipediaOptions } from './type'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode) => {
  const subdomain = getSubdomain(text, localLangCode)
  const path = localLangCode.startsWith('zh-') ? localLangCode : 'wiki'
  return `https://${subdomain}.wikipedia.org/${path}/${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest<WikipediaOptions> = (text, opt) => {
  const { lang } = (opt.option || { lang: 'auto' }) as WikipediaOptions
  const subdomain = getSubdomain(text, lang)
  const path = lang.startsWith('zh-') ? lang : 'wiki'
  const url = `https://${subdomain}.m.wikipedia.org/${path}/${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')

  // const { lang } = profile.wikipedia.options
  const subdomain = getSubdomain(text, to)
  const domRes = handleDOM(dom, subdomain)
  const result: ParagraphResponse = {
    engin: 'wikipedia',
    type: 'paragraph-trans',
    from,
    to,
    text: '',
    translate: '',
    pronounce: [],
  }
  return result
}

function getSubdomain (
  text: string,
  lang: string
): string {
  if (lang.startsWith('zh-')) {
    return 'zh'
  }

  if (lang === 'auto') {
    if (isContainJapanese(text)) {
      return 'ja'
    } else if (isContainChinese(text)) {
      return 'zh'
    }
    return 'en'
  }

  return lang
}

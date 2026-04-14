import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import type { WikipediaOptions } from './type'
import { isContainChinese, isContainJapanese } from '../../utils/lang-check'

export const getSrcPage: AtomGetSrcFunction = (text, _localLangCode, profile) => {
  const { lang } = profile.wikipedia.options
  const subdomain = getSubdomain(text, lang)
  const path = lang.startsWith('zh-') ? lang : 'wiki'
  return `https://${subdomain}.wikipedia.org/${path}/${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest<WikipediaOptions> = (text, opt) => {
  const { lang } = (opt.option || { lang: 'auto' }) as WikipediaOptions
  const subdomain = getSubdomain(text, lang)
  const path = lang.startsWith('zh-') ? lang : 'wiki'
  const url = `https://${subdomain}.m.wikipedia.org/${path}/${encodeURIComponent(text)}`
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')

  const { lang } = profile.wikipedia.options
  const subdomain = getSubdomain(text, lang)

  return handleDOM(dom, subdomain)
}

function getSubdomain(
  text: string,
  lang: WikipediaOptions['lang']
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

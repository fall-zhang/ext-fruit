import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'
import { chsToChz } from '../../utils/chs-to-chz'
import type { WordResponse } from '../../types/res-type'
import { handleNoResult } from '../../utils/error-response'

export const getSrcPage: AtomGetSrcFunction = async (text, localLang) => {
  let lang = 'default'

  if (lang === 'default') {
    switch (localLang) {
      case 'zh-CN':
        lang = 'en-chs'
        break
      case 'zh-TW':
        lang = 'en-chz'
        break
      default:
        lang = 'en'
        break
    }
  }

  switch (lang) {
    case 'en':
      return (
        'https://dictionary.cambridge.org/search/direct/?datasetsearch=english&q=' +
        encodeURIComponent(
          text
            .trim()
            .split(/\s+/)
            .join('-')
        )
      )
    case 'en-chs':
      return (
        'https://dictionary.cambridge.org/zhs/%E6%90%9C%E7%B4%A2/direct/?datasetsearch=english-chinese-simplified&q=' +
        encodeURIComponent(text)
      )
    case 'en-chz': {
      return (
        'https://dictionary.cambridge.org/zht/%E6%90%9C%E7%B4%A2/direct/?datasetsearch=english-chinese-traditional&q=' +
        encodeURIComponent(chsToChz(text))
      )
    }
    default: {
      return ''
    }
  }
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  // Default to English URL for fetching
  const url = 'https://dictionary.cambridge.org/search/direct/?datasetsearch=english&q=' +
    encodeURIComponent(
      text
        .trim()
        .split(/\s+/)
        .join('-')
    )
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const dom = await parseDirtyDom(res)
  const domRes = handleDOM(dom)
  if (!domRes.translate) {
    return handleNoResult()
  }
  const result: WordResponse = {
    engin: 'cambridge',
    type: 'word-trans',
    from,
    to,
    text,
    translate: domRes.translate || '',
    pronounce: [],
  }
  return result
}

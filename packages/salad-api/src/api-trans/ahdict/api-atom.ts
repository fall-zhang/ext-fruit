import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { SelfTransResponse } from '../../types/res-type'
import { getFetchDOMReq } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://ahdictionary.com/word/search.html?q=${text}`
}


export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = 'https://ahdictionary.com/word/search.html?q=' + encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  const dom = new DOMParser().parseFromString(domText, 'text/html')
  const domRes = await handleDOM(dom, { resultCount: 5 })
  const result: SelfTransResponse = {
    type: 'self-trans',
    engin: 'ahdict',
    from,
    to,
    text,
    translate: '',
    pronounce: [],
  }
  domRes.forEach(item => {
    result.translate = item.meaning.join('; ')
    if (item.pron) {
      result.pronounce = [
        {
          lang: 'en',
          src: item.pron,
        },
      ]
    }
    if (item.idioms) {
      result.exampleParagraph = item.idioms.map(item => {
        return {
          text: item.title || '',
          translate: item.eg || '',
          tips: item.tips || '',
        }
      })
    }
  })

  return result
}

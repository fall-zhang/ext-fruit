import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = (text, localLangCode) => {
  return `https://cn.bing.com/dict/search?q=${encodeURIComponent(text.replace(/\s+/g, ' '))}`
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://cn.bing.com/dict/clientsearch?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q=' +
    encodeURIComponent(text.replace(/\s+/g, ' '))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const dom = await parseDirtyDom(res)
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'bing',
    type: 'word-trans',
    from,
    to,
    text,
    translate: [],
    pronounce: [],
  }
  if (domRes.audio?.uk) {
    result.pronounce.push({
      lang: 'en-UK',
      src: domRes.audio.uk,
    })
  }
  if (domRes.audio?.us) {
    result.pronounce.push({
      lang: 'en-US',
      src: domRes.audio.us,
    })
  }
  if (domRes.result.cdef) {
    result.translate = domRes.result.cdef.map(item => {
      return {
        type: item.pos,
        translate: item.def,
      }
    })
  }
  if (domRes.result.infs) {
    result.associateWord = domRes.result.infs.map(item => ({ text: item }))
  }
  if (domRes.result.sentences) {
    result.exampleParagraph = domRes.result.sentences.map(item => {
      return {
        text: item.en || '',
        translate: item.chs || '',
        pronounce: item.mp3,
        source: 'bing',
      }
    })
  }
  if (domRes.result.phsym) {
    result.pronounce = domRes.result.phsym.map(item => {
      return {
        text: item.lang || '',
        lang: 'auto',
        src: '',
      }
    })
  }
  return result
}


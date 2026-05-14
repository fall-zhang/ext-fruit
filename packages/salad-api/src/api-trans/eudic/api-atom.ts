import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { WordResponse } from '../../types/res-type'
import { handleNoResult } from '../../utils/error-response'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://dict.eudic.net/dicts/en/${text}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const newText = encodeURIComponent(
    text
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
  )
  const url = 'https://dict.eudic.net/dicts/en/' + newText
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const domText = await res.text()
  let dom = new DOMParser().parseFromString(domText, 'text/html')

  // If no #TingLiju, try to get content via POST request
  if (!dom.querySelector('#TingLiju')) {
    const status = dom.querySelector('#page-status') as HTMLInputElement
    if (!status || !status.value) {
      return handleNoResult()
    }

    const formData = new FormData()
    formData.append('status', status.value)

    const postRes = await fetch('https://dict.eudic.net/Dicts/en/tab-detail/-12', {
      method: 'POST',
      body: formData,
      credentials: 'omit',
    })
    dom = await parseDirtyDom(postRes)
  }
  const domRes = await handleDOM(dom)
  const result: WordResponse = {
    engin: 'etymonline',
    type: 'word-trans',
    from,
    to,
    text,
    translate: domRes.result.map(item => {
      return {
        translate: item.chs,
      }
    }),
    pronounce: [],
  }
  return result
}

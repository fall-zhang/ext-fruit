import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { getFetchDOMReq, parseDirtyDom } from '../../utils/fetch-dom'
import { handleDOM } from './engine'

function removeChildren(parent: ParentNode, selector: string): void {
  parent.querySelectorAll(selector).forEach($el => $el.remove())
}

export const getSrcPage: AtomGetSrcFunction = (text, localLang) => {
  const lang = 'american'
  return (
    `http://www.macmillandictionary.com/dictionary/${lang}/` +
    encodeURIComponent(text.toLocaleLowerCase().replace(/[^A-Za-z0-9]+/g, '-'))
  )
}

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'http://www.macmillandictionary.com/dictionary/american/' +
    encodeURIComponent(text.toLocaleLowerCase().replace(/[^A-Za-z0-9]+/g, '-'))
  return getFetchDOMReq(url)
}

export const handleResponse: AtomResponseHandle = async (res) => {
  const doc = await parseDirtyDom(res)
  removeChildren(doc, '.visible-xs')
  return handleDOM(doc)
}

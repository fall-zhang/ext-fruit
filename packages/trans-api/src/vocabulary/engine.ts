import { fetchDirtyDOM } from '@P/trans-api/utils/fetch-dom'

import {
  getText,
  handleNoResult,
  handleNetWorkError,
  SearchFunction,
  GetSrcPageFunction,
  DictSearchResult
} from '../helpers'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.vocabulary.com/dictionary/${text}`
}

export interface VocabularyResult {
  short: string
  long: string
}

type VocabularySearchResult = DictSearchResult<VocabularyResult>

export const search: SearchFunction<VocabularyResult> = (
  text,
  config,
  profile,
  payload
) => {
  return fetchDirtyDOM(
    'https://www.vocabulary.com/dictionary/' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(handleDOM)
}

function handleDOM (
  doc: Document
): VocabularySearchResult | Promise<VocabularySearchResult> {
  const short = getText(doc, '.short')
  if (!short) {
    return handleNoResult()
  }

  const long = getText(doc, '.long')
  if (!long) {
    return handleNoResult()
  }

  return { result: { long, short } }
}

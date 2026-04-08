
import type { DictSearchResult, SearchFunction } from '../../api-common/search-type'
import type { AtomFetchRequest, AtomGetSrcFunction } from '../../types/atom-type'
import {
  getText,
  handleNoResult,
  handleNetWorkError
} from '../../utils'
import { fetchDirtyDOM } from '../../utils/fetch-dom'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.vocabulary.com/dictionary/${text}`
}

export interface VocabularyResult {
  short: string
  long: string
}

type VocabularySearchResult = DictSearchResult<VocabularyResult>

export const search: AtomFetchRequest<VocabularyResult> = async (text) => {
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

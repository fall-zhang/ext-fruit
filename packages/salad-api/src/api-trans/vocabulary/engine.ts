
import {
  getText,
  handleNoResult
} from '../../utils/dom-utils'
import type { VocabularySearchResult } from './type'

export function handleDOM (
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

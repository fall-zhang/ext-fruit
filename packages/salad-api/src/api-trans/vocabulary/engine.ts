
import {
  getText
} from '../../utils/dom-utils'
import { handleNoResult } from '../../utils/error-response'

export function handleDOM (
  doc: Document
) {
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

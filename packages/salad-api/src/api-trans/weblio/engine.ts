import type { WeblioResult } from './type'
import {
  getInnerHTML,
  handleNoResult,
  getOuterHTML,
  getText,
  removeChild
} from '../../utils/dom-utils'
import type { AtomSearchResult } from '../../types/res-type'

const HOST = 'https://www.weblio.jp'

type WeblioSearchResult = AtomSearchResult<WeblioResult>

export function handleDOM (
  doc: Document
): WeblioSearchResult | Promise<WeblioSearchResult> {
  const result: WeblioResult = []
  const $titles = doc.querySelectorAll<HTMLAnchorElement>(
    '#cont>.pbarT .pbarTL>a'
  )
  doc
    .querySelectorAll<HTMLDivElement>('#cont>.kijiWrp>.kiji')
    .forEach(($dict, i) => {
      const $title = $titles[i]
      if (!$title) {
        console.error('Dict Weblio: missing title')
        return
      }

      if ($title.title === '百科事典') {
        // too long
        return
      }

      result.push({
        title: getOuterHTML(HOST, $title, { config: {} }),
        def: getInnerHTML(HOST, $dict, { config: {} }),
      })
    })

  if (result.length <= 0) {
    doc.querySelectorAll('.section-card .basic-card').forEach($card => {
      const title = getText($card, '.pbarT h2')
      if (title) {
        removeChild($card, '.pbarT')
        result.push({
          title,
          def: getInnerHTML(HOST, $card, { config: {} }),
        })
      }
    })
  }

  return result.length > 0 ? { result } : handleNoResult()
}

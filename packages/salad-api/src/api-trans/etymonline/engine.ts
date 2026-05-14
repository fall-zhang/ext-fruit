import {
  getText,
  getInnerHTML,
  getFullLink
} from '../../utils/dom-utils'
import type { DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { EtymonlineResult, EtymonlineResultItem } from './type'
import { handleNoResult } from '../../utils/error-response'

const HOST = 'https://www.etymonline.com'


const RESULT_COUNT = 5

export function handleDOM (
  doc: Document
): EtymonlineResult | Promise<EtymonlineResult> {
  const result: EtymonlineResult = []
  const $items = Array.from(doc.querySelectorAll('[class*="word--"]'))

  for (let i = 0; i < $items.length && result.length < RESULT_COUNT; i++) {
    const $item = $items[i]

    const title = getText($item, '[class*="word__name--"]')
    if (!title) {
      continue
    }

    let def = ''
    const $def = $item.querySelector('[class*="word__defination--"]>*')
    if ($def) {
      $def.querySelectorAll('.crossreference').forEach($cf => {
        const word = getText($cf)

        const $a = document.createElement('a')
        $a.target = '_blank'
        $a.href = `https://www.etymonline.com/word/${word}`
        $a.textContent = word

        $cf.replaceWith($a)
      })
      def = getInnerHTML(HOST, $def)
    }
    if (!def) {
      continue
    }

    const href = getFullLink(HOST, $item, 'href')

    const id = `d-etymonline-entry${i}`

    result.push({ id, href, title, def })
  }

  if (result.length > 0) {
    return result
  }

  return handleNoResult()
}

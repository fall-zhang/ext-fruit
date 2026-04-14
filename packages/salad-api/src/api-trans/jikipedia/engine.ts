
import type { AtomSearchResult } from '../../types/res-type'
import {
  getText,
  getInnerHTML,
  handleNoResult,
  getFullLink
} from '../../utils/dom-utils'
import type { JikipediaResult, JikipediaResultItem } from './type'

const HOST = 'https://jikipedia.com'

type JikipediaSearchResult = AtomSearchResult<JikipediaResult>

export function handleDOM (
  doc: Document,
  { resultCount }: { resultCount: number }
): JikipediaSearchResult | Promise<JikipediaSearchResult> {
  const $cards = doc.querySelectorAll('.lite-card')
  if ($cards.length < 1) {
    return handleNoResult()
  }

  doc.querySelectorAll('.ad-card').forEach(el => el.remove())

  const result: JikipediaResult = []

  for (const $card of $cards) {
    if (result.length >= resultCount) {
      break
    }

    const item: JikipediaResultItem = {
      title: getText($card, '.title'),
      content: getInnerHTML(HOST, $card, '.content'),
      likes: Number(getText($card, '.like-count')) || 0,
    }

    if (!item.content) {
      continue
    }

    const $a = $card.querySelector('a.card-content')
    if ($a) {
      item.url = getFullLink(HOST, $a, 'href')
    }

    const $author = $card.querySelector('.author a')
    if ($author) {
      item.author = {
        name: getText($author),
        url: getFullLink(HOST, $author, 'href'),
      }
    }

    result.push(item)
  }

  return result.length > 0 ? { result } : handleNoResult()
}

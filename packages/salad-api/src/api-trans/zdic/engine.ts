
import { getStaticSpeaker } from '@/components/Speaker'

import { handleNetWorkError, getInnerHTML, handleNoResult } from '@/core/api-server/utils'
import type { HTMLString, AtomSearchResult } from '../../types/res-type'
import type { ZdicResult } from './type'

const HOST = 'https://www.zdic.net'

type ZdicSearchResult = AtomSearchResult<ZdicResult>

export function handleDOM (
  doc: Document,
  options: { isAudio: boolean }
): ZdicSearchResult | Promise<ZdicSearchResult> {
  const { isAudio } = options
  const response: ZdicSearchResult = {
    result: [],
  }

  for (const $entry of doc.querySelectorAll<HTMLDivElement>(
    '[data-type-block]'
  )) {
    const title = $entry.dataset.typeBlock || ''
    if (!/基本解释|词语解释|详细解释/.test(title)) {
      continue
    }

    for (const $a of $entry.querySelectorAll<HTMLAnchorElement>(
      '[data-src-mp3]'
    )) {
      if (isAudio) {
        if (!response.audio) {
          response.audio = {
            py: $a.dataset.srcMp3,
          }
        }
        $a.replaceWith(getStaticSpeaker($a.dataset.srcMp3))
      } else {
        $a.remove()
      }
    }

    response.result.push({
      title,
      content: getInnerHTML(HOST, $entry, '.content'),
    })
  }

  return response.result.length > 0 ? response : handleNoResult()
}

import {
  handleNoResult,
  getText,
  getFullLink,
  removeChild,
  removeChildren,
  getInnerHTML,
  externalLink
} from '../../utils/dom-utils'
import { getStaticSpeaker } from '@/components/Speaker'
import type { AtomSearchResult } from '../../types/res-type'
import type { HTMLString } from '../../types'
import type { LexicoResult, LexicoResultLex, LexicoResultRelated } from './type'

const HOST = 'https://www.lexico.com'

type LexicoSearchResult = AtomSearchResult<LexicoResult>

export function handleDOM(
  doc: Document,
  options: { related: boolean }
): LexicoSearchResult | Promise<LexicoSearchResult> {
  // Check for no-exact-matches first
  const $noResult = doc.querySelector('.no-exact-matches')
  if ($noResult) {
    if (options.related) {
      const $similar = $noResult.querySelectorAll<HTMLAnchorElement>(
        '.similar-results .search-results li a'
      )
      if ($similar.length > 0) {
        const result: LexicoResultRelated = {
          type: 'related',
          list: [...$similar].map($a => ({
            href: getFullLink(HOST, $a, 'href'),
            text: getText($a),
          })),
        }
        return { result }
      }
    }
    return handleNoResult()
  }

  const $entry = doc.querySelector('.entryWrapper')

  if ($entry) {
    removeChild($entry, '.breadcrumbs')
    removeChildren($entry, '.socials')
    removeChildren($entry, '.homographs')
    removeChildren($entry, '.associatedTranslation')

    $entry.querySelectorAll('.entryHead header > h1').forEach($h1 => {
      if ($h1.textContent?.trim().startsWith('Meaning of')) {
        $h1.remove()
      }
    })

    let mp3: string | undefined

    $entry
      .querySelectorAll<HTMLAnchorElement>('a[data-value="view synonyms"]')
      .forEach($a => externalLink($a))
    ;[
      ...$entry.querySelectorAll<HTMLAnchorElement>('.headwordAudio'),
      ...$entry.querySelectorAll<HTMLAnchorElement>('.speaker'),
    ].forEach($speaker => {
      const $audio = $speaker.querySelector<HTMLAudioElement>('audio')
      const src = $audio && getFullLink(HOST, $audio, 'src')
      $speaker.replaceWith(getStaticSpeaker(src))
      if (src && !mp3) {
        mp3 = src
      }
    })

    const result: LexicoResultLex = {
      type: 'lex',
      entry: getInnerHTML(HOST, $entry),
    }

    return {
      result,
      audio: mp3 ? { uk: mp3 } : undefined,
    }
  }

  return handleNoResult()
}

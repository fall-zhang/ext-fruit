import { fetchDirtyDOM } from '../../utils/fetch-dom'

import {
  handleNoResult,
  handleNetWorkError,
  getText,
  getFullLink,
  removeChild,
  removeChildren,
  getInnerHTML,
  externalLink
} from '../../utils'
import { getStaticSpeaker } from '@/components/Speaker'
import type { SearchFunction, DictSearchResult, GetSrcPageFunction } from '../../api-common/search-type'
import type { HTMLString } from '../../types'


export const getSrcPage: GetSrcPageFunction = (text: string) =>
  `https://www.lexico.com/definition/${text.trim().replace(/\s+/g, '_')}`


const HOST = 'https://www.lexico.com'

export interface LexicoResultLex {
  type: 'lex'
  entry: HTMLString
}

export interface LexicoResultRelated {
  type: 'related'
  list: ReadonlyArray<{
    href: string
    text: string
  }>
}

export type LexicoResult = LexicoResultLex | LexicoResultRelated

export const search: SearchFunction<LexicoResult> = async (
  text,
  opt
) => {
  const { options } = opt.profile.lexico

  const url = await getSrcPage(text, opt.localLang || 'zh-CN', opt.profile)
  return fetchDirtyDOM(url)
    .catch(handleNetWorkError)
    .then(doc => {
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
      return handleDOM(doc)
    })
}

function handleDOM (
  doc: Document
):
  | Promise<DictSearchResult<LexicoResultLex>> |
  DictSearchResult<LexicoResultLex> {
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

    return {
      result: {
        type: 'lex',
        entry: getInnerHTML(HOST, $entry),
      },
      audio: mp3 ? { uk: mp3 } : undefined,
    }
  }

  return handleNoResult()
}

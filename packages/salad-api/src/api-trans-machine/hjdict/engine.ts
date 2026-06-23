
import type { HjdictResult } from './type'
import { handleNoResult } from '../../utils/error-response'
import type { AtomSearchResult } from '../../types/res-type'
import { isContainFrench, isContainDeutsch, isContainSpanish, isContainJapanese, isContainKorean } from '../../utils/detect-lang/lang-check'
import { getInnerHTML, getStaticSpeaker } from '../../utils/dom-utils'
import type { HTMLString } from '../../types'

const HOST = 'https://www.hjdict.com'

type HjdictSearchResult = AtomSearchResult<HjdictResult>

export function handleDOM (
  doc: Document,
  langCode: string
): HjdictSearchResult | Promise<HjdictSearchResult> {
  if (doc.querySelector('.word-notfound')) {
    return handleNoResult()
  }

  const $suggests = doc.querySelector('.word-suggestions')
  if ($suggests) {
    // if (options.related) {
    //   return {
    //     result: {
    //       type: 'related',
    //       langCode,
    //       content: getInnerHTML(HOST, $suggests),
    //     },
    //   }
    // }
    return handleNoResult()
  }

  let header = ''
  const $header = doc.querySelector('.word-details-multi .word-details-header')
  if ($header) {
    $header
      .querySelectorAll<HTMLLIElement>('.word-details-tab')
      .forEach(($tab, i) => {
        // eslint-disable-next-line no-param-reassign
        $tab.dataset.categories = String(i)
      })
    header = getInnerHTML(HOST, $header)
  }

  doc.querySelectorAll<HTMLSpanElement>('.word-audio').forEach($audio => {
    $audio.replaceWith(getStaticSpeaker($audio.dataset.src))
  })

  const entries: HTMLString[] = [
    ...doc.querySelectorAll('.word-details-pane'),
  ].map(
    ($pane, i) => `
      <div class="word-details-pane${
        i === 0 ? ' word-details-pane-active' : ''
      }">
        <div class="word-details-pane-header">
          ${getInnerHTML(HOST, $pane, '.word-details-pane-header')}
        </div>
        <div class="word-details-pane-content">
          ${getInnerHTML(HOST, $pane, '.word-details-pane-content')}
        </div>
      </div>
    `
  )

  if (entries.length > 0) {
    return { result: { type: 'lex', header, entries, langCode } }
  }
  return handleNoResult()
}

export function getLangCode (text: string): string {
  if (isContainFrench(text)) {
    return 'fr'
  }

  if (isContainDeutsch(text)) {
    return 'de'
  }

  if (isContainSpanish(text)) {
    return 'es'
  }

  if (isContainJapanese(text)) {
    return 'jp/jc'
  }

  if (isContainKorean(text)) {
    return 'kr'
  }

  return 'w'
}



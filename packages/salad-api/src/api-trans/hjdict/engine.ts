
import type { HTMLString } from '@/core/api-server/types'
import { getInnerHTML } from '@/core/api-server/utils'
import { getStaticSpeaker } from '@/components/Speaker'
import type { HjdictPayload, HjdictResult, HjdictResultRelated } from './type'
import { isContainFrench, isContainDeutsch, isContainSpanish, isContainEnglish, isContainJapanese, isContainKorean, isContainChinese } from '@/core/api-server/utils/lang-check'
import type { HjdictConfig } from './config'
import type { AllDictsConf } from '@/core/api-server/config'
import { handleNoResult } from '../../utils/error-response'
import type { AtomSearchResult } from '../../types/res-type'

const HOST = 'https://www.hjdict.com'

type HjdictSearchResult = AtomSearchResult<HjdictResult>

export function handleDOM (
  doc: Document,
  options: AllDictsConf['hjdict']['options'],
  langCode: string
): HjdictSearchResult | Promise<HjdictSearchResult> {
  if (doc.querySelector('.word-notfound')) {
    return handleNoResult()
  }

  const $suggests = doc.querySelector('.word-suggestions')
  if ($suggests) {
    if (options.related) {
      return {
        result: {
          type: 'related',
          langCode,
          content: getInnerHTML(HOST, $suggests),
        },
      }
    }
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

export function getLangCode (text: string, profile: HjdictConfig): string {
  // ü
  if (/\u00fc/i.test(text)) {
    return profile.options.uas
  }

  // ä
  if (/\u00e4/i.test(text)) {
    return profile.options.aas
  }

  // é
  if (/\u00e9/i.test(text)) {
    return profile.options.eas
  }

  if (isContainFrench(text)) {
    return 'fr'
  }

  if (isContainDeutsch(text)) {
    return 'de'
  }

  if (isContainSpanish(text)) {
    return 'es'
  }

  if (isContainEnglish(text)) {
    return profile.options.engas
  }

  if (isContainJapanese(text)) {
    return 'jp/jc'
  }

  if (isContainKorean(text)) {
    return 'kr'
  }

  if (isContainChinese(text)) {
    return profile.options.chsas
  }

  return 'w'
}



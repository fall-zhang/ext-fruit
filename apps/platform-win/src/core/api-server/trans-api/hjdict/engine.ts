
import type { DictSearchResult, SearchFunction } from '@/core/api-server/api-common/search-type'
import type { HTMLString } from '@/core/api-server/types'
import { handleNetWorkError, getInnerHTML } from '@/core/api-server/utils'
import { fetchDirtyDOM } from '@/core/api-server/utils/fetch-dom'
import { getStaticSpeaker } from '@/components/Speaker'
import type { HjdictPayload, HjdictResult, HjdictResultRelated } from './type'
import { isContainFrench, isContainDeutsch, isContainSpanish, isContainEnglish, isContainJapanese, isContainKorean, isContainChinese } from '@/core/api-server/utils/lang-check'
import type { HjdictConfig } from './config'
import type { AllDictsConf } from '../../config'
import { v4 as getUUID } from 'uuid'

const HOST = 'https://www.hjdict.com'

type HjdictSearchResult = DictSearchResult<HjdictResult>

export const search: SearchFunction<HjdictResult> = async (
  text,
  opt
) => {
  const cookies = {
    HJ_SITEID: 3,
    HJ_UID: getUUID(),
    HJ_SID: getUUID(),
    HJ_SSID: getUUID(),
    HJID: 0,
    HJ_VT: 2,
    HJ_SST: 1,
    HJ_CSST: 1,
    HJ_ST: 1,
    HJ_CST: 1,
    HJ_T: +new Date(),
    _: getUUID(),
  }

  // await Promise.all(
  //   Object.keys(cookies).map(name =>
  //     window.cookieStore.set({
  //       url: 'https://www.hjdict.com',
  //       domain: 'hjdict.com',
  //       name,
  //       value: String(cookies[name]),
  //     })
  //   )
  // )

  const langCode = getLangCode(text, opt.profile.hjdict)

  return fetchDirtyDOM(
    `https://www.hjdict.com/${langCode}/${encodeURIComponent(text)}`
  )
    .catch(handleNetWorkError)
    .then(doc => handleDOM(doc, opt.profile.hjdict.options, langCode))
}

function handleDOM (
  doc: Document,
  options: AllDictsConf['hjdict']['options'],
  langCode: string
): HjdictSearchResult | Promise<HjdictSearchResult> {
  if (doc.querySelector('.word-notfound')) {
    return wrapNoResult(langCode)
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
    return wrapNoResult(langCode)
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

  return entries.length > 0
    ? { result: { type: 'lex', header, entries, langCode } }
    : wrapNoResult(langCode)
}

function wrapNoResult (langCode: string): DictSearchResult<HjdictResultRelated> {
  return {
    result: {
      type: 'related',
      langCode,
      content: '<p style="text-align:center;">No Result</p>',
    },
  }
}

/**
 * Firefox adds 'Origin' field with `fetch` which would be rejected by the server.
 */
// function xhrDirtyDOM (url: string): Promise<Document> {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest()
//     xhr.open('GET', url, true)
//     xhr.responseType = 'document'
//     xhr.withCredentials = true
//     xhr.onload = () => {
//       if (xhr.readyState === xhr.DONE && xhr.status >= 200 && xhr.status < 300) {
//         if (xhr.responseXML) {
//           resolve(xhr.responseXML)
//         } else {
//           reject(xhr)
//         }
//       }
//     }
//     xhr.onerror = err => reject(err)
//     xhr.send(null)
//   })
// }

function getLangCode (text: string, profile: HjdictConfig): string {
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



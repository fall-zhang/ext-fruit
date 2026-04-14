import type { AtomSearchResult } from '../../types/res-type'
import {
  getInnerHTML,
  getFullLink,
  handleNoResult,
  getText
} from '../../utils/dom-utils'
import type { CNKIResult, CNKIDictItem, CNKISensItem } from './type'
import type { CnkiConfig } from './config'

const HOST = 'http://dict.cnki.net/old'

type CnkiSearchResult = AtomSearchResult<CNKIResult>

export function handleDOM (
  doc: Document,
  options: CnkiConfig['options']
): CnkiSearchResult | Promise<CnkiSearchResult> {
  const $entries = [...doc.querySelectorAll('.main-table')]

  const result: CNKIResult = {
    dict: [],
    senbi: [],
    seneng: [],
  }

  if (options.dict) {
    const $dict = $entries.find($e =>
      Boolean($e.querySelector('img[src="images/02.gif"]'))
    )
    if ($dict) {
      result.dict = [...$dict.querySelectorAll('.zztj li')]
        .map($li => {
          const word = ($li.textContent || '').trim()
          if (word) {
            const $a = $li.querySelector('a:nth-of-type(2)')
            if ($a) {
              const href = getFullLink(HOST, $a, 'href')
              if (href) {
                return { word, href }
              }
            }
          }
          return null
        })
        .filter((x): x is CNKIDictItem => Boolean(x))
    }
  }

  if (options.senbi) {
    result.senbi = extractSens(
      $entries,
      'img[src="images/word.jpg"]',
      'showjd_'
    )
  }

  if (options.seneng) {
    result.seneng = extractSens(
      $entries,
      'img[src="images/dian_ywlj.gif"]',
      'showlj_'
    )
  }

  if (
    result.dict.length > 0 ||
    result.senbi.length > 0 ||
    result.seneng.length > 0
  ) {
    return { result }
  }

  return handleNoResult()
}

function extractSens (
  $entries: Element[],
  selector: string,
  sensid: string
): CNKISensItem[] {
  const $sens = $entries.find($e => Boolean($e.querySelector(selector)))
  if (!$sens) {
    return []
  }

  return [...$sens.querySelectorAll(`[id^=${sensid}]`)].map($sens => {
    let more = ''

    $sens.querySelectorAll('td[align=right]').forEach($td => {
      if (($td.textContent || '').trim() === '更多') {
        const $a = $td.querySelector('a')
        if ($a) {
          more = getFullLink(HOST, $a, 'href')
        }
      }
      $td.remove()
    })

    return {
      title: getText($sens.previousElementSibling!).trim(),
      more,
      sens: [...$sens.querySelectorAll('td')].map($td =>
        getInnerHTML(HOST, $td).replace(/&nbsp;/g, '')
      ),
    }
  })
}

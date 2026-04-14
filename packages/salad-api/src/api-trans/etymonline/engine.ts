import { fetchDirtyDOM } from '@/core/api-server/utils/fetch-dom'
import type { HTMLString } from '../../types'
import {
  getText,
  getInnerHTML,
  getFullLink,
  handleNoResult,
  handleNetWorkError
} from '../../utils/dom-utils'
import type { AllDictsConf } from '@/core/api-server/config'
import type { DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { EtymonlineResult, EtymonlineResultItem } from './type'

const HOST = 'https://www.etymonline.com'

type EtymonlineSearchResult = DictSearchResult<EtymonlineResult>

export const search: (text: string, opt: any) => Promise<EtymonlineSearchResult> = async (
  text,
  opt
) => {
  const options = opt.profile.etymonline.options
  const newText = encodeURIComponent(text.replace(/\s+/g, ' '))

  // http to bypass the referer checking
  return fetchDirtyDOM('https://www.etymonline.com/word/' + newText)
    .catch(() => fetchDirtyDOM('https://www.etymonline.com/search?q=' + newText))
    .catch(handleNetWorkError)
    .then(doc => handleDOM(doc, options))
}

export function handleDOM (
  doc: Document,
  options: AllDictsConf['etymonline']['options']
): EtymonlineSearchResult | Promise<EtymonlineSearchResult> {
  const result: EtymonlineResult = []
  const catalog: NonNullable<EtymonlineSearchResult['catalog']> = []
  const $items = Array.from(doc.querySelectorAll('[class*="word--"]'))

  for (let i = 0; i < $items.length && result.length < options.resultCount; i++) {
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

    let chart = ''
    if (options.chart) {
      const $chart = $item.querySelector<HTMLImageElement>(
        '[class*="chart--"] img'
      )
      if ($chart) {
        chart = getFullLink(HOST, $chart, 'src')
      }
    }

    const id = `d-etymonline-entry${i}`

    result.push({ id, href, title, def, chart })

    catalog.push({
      key: `#${i}`,
      value: id,
      label: `#${title}`,
    })
  }

  if (result.length > 0) {
    return { result, catalog }
  }

  return handleNoResult()
}

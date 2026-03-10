
import type { GetSrcPageFunction, DictSearchResult, SearchFunction } from '../../api-common/search-type'
import type { HTMLString } from '../../types'
import {
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  getOuterHTML,
  getText,
  removeChild
} from '../../utils'
import { fetchDirtyDOM } from '../../utils/fetch-dom'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.weblio.jp/content/${text}`
}

const HOST = 'https://www.weblio.jp'

export type WeblioResult = Array<{
  title: HTMLString
  def: HTMLString
}>

type WeblioSearchResult = DictSearchResult<WeblioResult>

export const search: SearchFunction<WeblioResult> = async (
  text
) => {
  return fetchDirtyDOM(
    'https://www.weblio.jp/content/' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(handleDOM)
}

function handleDOM (
  doc: Document
): WeblioSearchResult | Promise<WeblioSearchResult> {
  const result: WeblioResult = []
  const $titles = doc.querySelectorAll<HTMLAnchorElement>(
    '#cont>.pbarT .pbarTL>a'
  )
  doc
    .querySelectorAll<HTMLDivElement>('#cont>.kijiWrp>.kiji')
    .forEach(($dict, i) => {
      const $title = $titles[i]
      if (!$title) {
        if (process.env.DEBUG) {
          console.error('Dict Weblio: missing title')
        }
        return
      }

      if ($title.title === '百科事典') {
        // too long
        return
      }

      result.push({
        title: getOuterHTML(HOST, $title, { config: {} }),
        def: getInnerHTML(HOST, $dict, { config: {} }),
      })
    })

  if (result.length <= 0) {
    doc.querySelectorAll('.section-card .basic-card').forEach($card => {
      const title = getText($card, '.pbarT h2')
      if (title) {
        removeChild($card, '.pbarT')
        result.push({
          title,
          def: getInnerHTML(HOST, $card, { config: {} }),
        })
      }
    })
  }

  return result.length > 0 ? { result } : handleNoResult()
}

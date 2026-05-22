import type { AtomFetchRequest, AtomResponseHandle } from '../types/atom-type'
import type { AtomSearchResult } from '../types/res-type'
import { getText } from '../utils/dom-utils'
import { handleNoResult } from '../utils/error-response'
import { getFetchDOMReq, parseDirtyDom } from '../utils/fetch-dom'
import type { Suggest } from './types'

interface BingResultRelated {
  type: 'related'
  title: string
  defs: Array<{
    title: string
    meanings: Array<{
      href: string
      word: string
      def: string
    }>
  }>
}
type BingSearchResultRelated = AtomSearchResult<BingResultRelated>

export const getFetchRequest: AtomFetchRequest = (text) => {
  const url = 'https://cn.bing.com/dict/clientsearch?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q=' +
    encodeURIComponent(text.replace(/\s+/g, ' '))

  return getFetchDOMReq(url)
}

export const handleResponse = async (res: Response, { text }: {
  text: string
}): Promise<Suggest[]> => {
  const dom = await parseDirtyDom(res)
  const domRes = handleRelatedResult(dom)

  return []
}

function handleRelatedResult (
  doc: Document
): BingSearchResultRelated | Promise<BingSearchResultRelated> {
  if (doc.querySelector('.client_do_you_mean_title_bar')) {
    return handleRelatedResult(doc)
  }
  const searchResult: AtomSearchResult<BingResultRelated> = {
    result: {
      type: 'related',
      title: getText(doc, '.client_do_you_mean_title_bar'),
      defs: [],
    },
  }

  doc.querySelectorAll('.client_do_you_mean_area').forEach($area => {
    const $defsList = $area.querySelectorAll('.client_do_you_mean_list')
    if ($defsList.length > 0) {
      searchResult.result.defs.push({
        title: getText($area, '.client_do_you_mean_title'),
        meanings: Array.from($defsList).map($list => {
          const word = getText(
            $list,
            '.client_do_you_mean_list_word'

          )
          return {
            href: `https://cn.bing.com/dict/search?q=${word}`,
            word,
            def: getText($list, '.client_do_you_mean_list_def'),
          }
        }),
      })
    }
  })

  if (searchResult.result.defs.length > 0) {
    return searchResult
  }
  return handleNoResult()
}

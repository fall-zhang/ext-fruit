import type { DictSearchResult, SearchFunction } from '../../types/atom-type'
import {
  getText,
  getInnerHTML,
  handleNoResult,
  handleNetWorkError,
  removeChildren
} from '../../utils/dom-utils'
import { fetchDirtyDOM } from '../../utils/fetch-dom'
import type { JukuuLang, JukuuTransItem, JukuuResult } from './type'


type JukuuSearchResult = DictSearchResult<JukuuResult>

export const search: SearchFunction<JukuuResult> = async (
  text,
  opt
) => {
  const lang = opt.profile.jukuu.options.lang
  return fetchDirtyDOM(getUrl(text, lang))
    .catch(handleNetWorkError)
    .then(doc => handleDOM(doc, lang))
    .then(sens =>
      (sens.length > 0 ? { result: { lang, sens } } : handleNoResult())
    )
}

export function handleDOM (doc: Document, lang: JukuuLang): JukuuTransItem[] {
  return [...doc.querySelectorAll('tr.e')]
    .map($e => {
      const $trans = $e.lastElementChild
      if (!$trans) {
        return null
      }
      removeChildren($trans, 'img')

      const $original = $e.nextElementSibling
      if (!$original || !$original.classList.contains('c')) {
        return null
      }

      const $src = $original.nextElementSibling

      return {
        trans: getInnerHTML('http://www.jukuu.com', $trans),
        original: getText($original),
        src:
          $src && $src.classList.contains('s')
            ? getText($src).replace(/^[\s-]*/, '')
            : '',
      }
    })
    .filter((item): item is JukuuTransItem => Boolean(item && item.trans))
}

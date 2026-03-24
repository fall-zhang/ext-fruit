import { detectLang } from '@P/open-trans/utils/detect-lang'
import type { GetSrcPageFunction } from '../../api-common/search-type'

export const getSrcPage: GetSrcPageFunction = (text) => {
  return `https://www.hjdict.com/${detectLang(
    text
  )}/${encodeURIComponent(text)}`
}


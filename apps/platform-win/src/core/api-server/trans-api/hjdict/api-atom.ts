import type { GetSrcPageFunction } from '../../api-common/search-type'

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  return `https://www.hjdict.com/${getLangCode(
    text,
    profile
  )}/${encodeURIComponent(text)}`
}


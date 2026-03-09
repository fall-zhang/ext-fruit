import type { GetSrcPageFunction } from '@P/api-server/api-common/atom-type'

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  return `https://www.hjdict.com/${getLangCode(
    text,
    profile
  )}/${encodeURIComponent(text)}`
}


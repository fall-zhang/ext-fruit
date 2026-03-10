import type { GetSrcPageFunction } from '@/core/api-server/api-common/atom-type'

export const getSrcPage: GetSrcPageFunction = (text, config, profile) => {
  return `https://www.hjdict.com/${getLangCode(
    text,
    profile
  )}/${encodeURIComponent(text)}`
}


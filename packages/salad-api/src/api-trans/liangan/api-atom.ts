import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { LiangAnResult } from './type'
import { handleNetWorkError } from '@/core/api-server/utils'
import chsToChz from '@/core/api-server/utils/chs-to-chz'
import { handleResponse as handleLiangAnResponse } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.moedict.tw/~${chsToChz(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://www.moedict.tw/c/${encodeURIComponent(chsToChz(text.replace(/\s+/g, '')))}.json`
  return new Request(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const data = await res.json().catch(handleNetWorkError) as LiangAnResult

  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }

  // Replace '<br>陸⃝' with ' [大陆]: ' for mainland China annotations

  return handleLiangAnResponse(data)
}

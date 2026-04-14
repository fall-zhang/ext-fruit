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

export const handleResponse: AtomResponseHandle<LiangAnResult> = async (res, { text, from, to, profile }) => {
  const data = await res.json().catch(handleNetWorkError) as LiangAnResult

  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }

  const options = profile.liangan.options

  if (!options.trans) {
    data.translation = undefined
  }

  // Replace '<br>陸⃝' with ' [大陆]: ' for mainland China annotations
  if (data.h) {
    data.h.forEach(item => {
      if (item.p) {
        item.p = item.p.replace('<br>陸⃝', ' [大陆]: ')
      }
    })
  }

  return handleLiangAnResponse(data)
}

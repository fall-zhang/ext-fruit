import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GuoYuResult } from './type'
import { handleNetWorkError } from '@/core/api-server/utils'
import chsToChz from '@/core/api-server/utils/chs-to-chz'
import { handleResponse as handleGuoYuResponse } from './engine'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.moedict.tw/${chsToChz(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://www.moedict.tw/a/${encodeURIComponent(chsToChz(text.replace(/\s+/g, '')))}.json`
  return new Request(url)
}

export const handleResponse: AtomResponseHandle<GuoYuResult> = async (res, { text, from, to, profile }) => {
  const data = await res.json().catch(handleNetWorkError) as GuoYuResult

  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }

  const options = profile.guoyu.options

  if (!options.trans) {
    data.translation = undefined
  }

  return handleGuoYuResponse(data)
}

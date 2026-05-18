import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GuoYuResult } from './type'
import { handleNetWorkError } from '@/core/api-server/utils'
import chsToChz from '@/core/api-server/utils/chs-to-chz'
import { handleResponse as handleGuoYuResponse } from './engine'
import type { WordResponse } from '../../types/res-type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.moedict.tw/${chsToChz(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://www.moedict.tw/a/${encodeURIComponent(chsToChz(text.replace(/\s+/g, '')))}.json`
  return new Request(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to, profile }) => {
  const data = await res.json().catch(handleNetWorkError) as GuoYuResult

  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }

  handleGuoYuResponse(data)
  const result: WordResponse = {
    engin: 'google',
    type: 'word-trans',
    from: 'af',
    to: 'af',
    text: '',
    translate: [],
    pronounce: [],
  }

  return result
}

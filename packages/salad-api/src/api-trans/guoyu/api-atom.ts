import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import type { GuoYuResult } from './type'
import { handleResponse as handleGuoYuResponse } from './engine'
import type { WordResponse } from '../../types/res-type'
import { chsToChz } from '../../utils/chs-to-chz'
import { handleNetWorkError } from '../../utils/error-response'

export const getSrcPage: AtomGetSrcFunction = text => {
  return `https://www.moedict.tw/${chsToChz(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = `https://www.moedict.tw/a/${encodeURIComponent(chsToChz(text.replace(/\s+/g, '')))}.json`
  return new Request(url)
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const data = await res.json().catch(handleNetWorkError) as GuoYuResult

  if (!data || !data.h) {
    throw new Error('NO_RESULT')
  }

  handleGuoYuResponse(data)
  const result: WordResponse = {
    engin: 'guoyu',
    type: 'word-trans',
    from: 'zh-CN',
    to: 'zh-CN',
    text: '',
    translate: [],
    pronounce: [],
  }

  return result
}

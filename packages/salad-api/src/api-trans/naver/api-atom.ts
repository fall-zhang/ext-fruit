import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { isContainJapanese, isContainKorean } from '../../utils/detect-lang/lang-check'
import { handleNoResult, handleNetWorkError } from '../../utils/error-response'
import type { NaverResult, NaverSearchResult } from './type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return isContainJapanese(text)
    ? `https://ja.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
    : `https://zh.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const url = isContainJapanese(text)
    ? `https://ja.dict.naver.com/api3/jako/search?query=${encodeURIComponent(text)}`
    : `https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(text)}&lang=zh_CN`

  return new Request(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const handleResponse: AtomResponseHandle = async (res, { text, from, to }) => {
  const isJa = isContainJapanese(text)

  let data
  try {
    data = await res.json()
  } catch {
    throw handleNetWorkError(new Error('NETWORK_ERROR'))
  }

  const ListMap = data?.searchResultMap?.searchResultListMap

  if (!ListMap) {
    return handleNoResult()
  }

  const result: NaverSearchResult = {
    lang: isJa ? 'ja' : 'zh',
    entry: ListMap,
  }

  return result
}

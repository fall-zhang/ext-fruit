import type { AtomFetchRequest, AtomGetSrcFunction, AtomResponseHandle } from '../../types/atom-type'
import { handleNoResult, handleNetWorkError } from '../../utils/error-response'
import { isContainJapanese, isContainKorean } from '../../utils/lang-check'
import type { NaverResult, NaverSearchResult } from './type'

export const getSrcPage: AtomGetSrcFunction = text => {
  return isContainJapanese(text)
    ? `https://ja.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
    : `https://zh.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
}

export const getFetchRequest: AtomFetchRequest = (text, opt) => {
  const { options } = opt.profile.naver

  const url =
    options.hanAsJa ||
    isContainJapanese(text) ||
    (options.korAsJa && isContainKorean(text))
      ? `https://ja.dict.naver.com/api3/jako/search?query=${encodeURIComponent(text)}`
      : `https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(text)}&lang=zh_CN`

  return new Request(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const handleResponse: AtomResponseHandle<NaverResult> = async (res, { text, from, to, profile }) => {
  const { options } = profile.naver

  const isJa =
    options.hanAsJa ||
    isContainJapanese(text) ||
    (options.korAsJa && isContainKorean(text))

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
    result: {
      lang: isJa ? 'ja' : 'zh',
      entry: ListMap,
    },
  }

  return result
}

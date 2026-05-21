import type { NaverResult, NaverSearchResult } from './type'
import { handleNetWorkError, handleNoResult } from '../../utils/error-response'
import { isContainJapanese, isContainKorean } from '../../utils/detect-lang/lang-check'

async function zhDict (text: string): Promise<NaverSearchResult> {
  const response = await fetch(
    `https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(
      text
    )}&lang=zh_CN`
  ).catch(handleNetWorkError)

  const data = await response.json()
  const ListMap = data?.searchResultMap?.searchResultListMap

  if (!ListMap) {
    return handleNoResult()
  }

  return {
    lang: 'zh',
    entry: ListMap,
  }
}

async function jaDict (text: string): Promise<NaverSearchResult> {
  const response = await fetch(
    `https://ja.dict.naver.com/api3/jako/search?query=${encodeURIComponent(
      text
    )}`
  ).catch(handleNetWorkError)

  const data = await response.json()
  const ListMap = data?.searchResultMap?.searchResultListMap

  if (!ListMap) {
    return handleNoResult()
  }

  return {
    lang: 'ja',
    entry: ListMap,
  }
}

export const search = (
  text: string
): Promise<NaverResult> => {
  if (isContainJapanese(text)) {
    return jaDict(text)
  }

  return zhDict(text)
}

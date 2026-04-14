
import type { GetSrcPageFunction, DictSearchResult, SearchFunction } from '../../api-common/search-type'
import {
  handleNoResult,
  handleNetWorkError
} from '../../utils/dom-utils'
import { isContainJapanese, isContainKorean } from '../../utils/lang-check'
import type { NaverResult, NaverSearchResult } from './type'
import { getSrcPage as atomGetSrcPage } from './api-atom'

export { NaverResult } from './type'

export const getSrcPage: GetSrcPageFunction = atomGetSrcPage

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
    result: {
      lang: 'zh',
      entry: ListMap,
    },
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
    result: {
      lang: 'ja',
      entry: ListMap,
    },
  }
}

export const search: SearchFunction<NaverResult> = (
  text,
  opt
) => {
  const { options } = opt.profile.naver

  if (
    options.hanAsJa ||
    isContainJapanese(text) ||
    (options.korAsJa && isContainKorean(text))
  ) {
    return jaDict(text)
  }

  return zhDict(text)
}


import type { GetSrcPageFunction, DictSearchResult, SearchFunction } from '../../api-common/search-type'
import {
  handleNoResult,
  handleNetWorkError
} from '../../utils'
import axios from 'axios'
import { isContainJapanese } from '../../utils/lang-check'

export const getSrcPage: GetSrcPageFunction = text => {
  return isContainJapanese(text)
    ? `https://ja.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
    : `https://zh.dict.naver.com/#/search?query=${encodeURIComponent(text)}`
}

/** Alternate machine translation result */
export interface NaverResult {
  lang: 'zh' | 'ja'
  entry: {
    WORD: { items: any[] }
    MEANING: { items: any[] }
    EXAMPLE: { items: any[] }
  }
}

interface NaverPayload {
  lang?: 'zh' | 'ja'
}

type NaverSearchResult = DictSearchResult<NaverResult>

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

async function zhDict (text: string): Promise<NaverSearchResult> {
  const { data } = await axios
    .get(
      `https://zh.dict.naver.com/api3/zhko/search?query=${encodeURIComponent(
        text
      )}&lang=zh_CN`
    )
    .catch(handleNetWorkError)

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
  const { data } = await axios
    .get(
      `https://ja.dict.naver.com/api3/jako/search?query=${encodeURIComponent(
        text
      )}`
    )
    .catch(handleNetWorkError)

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


import {
  handleNoResult,
  handleNetWorkError,
  getChsToChz
} from '../helpers'
import axios from 'axios'
import type { Profile } from '@/config/app-config/profiles'
import type { GuoYuResult } from './type'
import type { SearchFunction, DictSearchResult } from '@P/api-server/api-common/search-type'

export const search: SearchFunction<GuoYuResult> = (
  text,
  opt
) => {
  return moedictSearch<GuoYuResult>(
    'a',
    text,
    opt.profile.guoyu.options
  )
}

export async function moedictSearch<R extends GuoYuResult> (
  moedictID: string,
  text: string,
  options: Profile['dicts']['all']['guoyu']['options']
): Promise<DictSearchResult<R>> {
  const chsToChz = await getChsToChz()
  const { data } = await axios
    .get<R>(
      `https://www.moedict.tw/${moedictID}/${encodeURIComponent(
        chsToChz(text.replace(/\s+/g, ''))
      )}.json`
    )
    .catch(handleNetWorkError)

  if (!data || !data.h) {
    return handleNoResult()
  }

  if (!options.trans) {
    data.translation = undefined
  }

  const result: DictSearchResult<R> = { result: data }

  for (const h of data.h) {
    if (h['=']) {
      h[
        '='
      ] = `https://203146b5091e8f0aafda-15d41c68795720c6e932125f5ace0c70.ssl.cf1.rackcdn.com/${h['=']}.ogg`
    }
    if (!result.audio) {
      result.audio = {
        py: h['='],
      }
    }
  }

  return result
}

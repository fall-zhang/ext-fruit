
import {
  handleNoResult,
  handleNetWorkError,
  getChsToChz
} from '../../utils'
import type { GuoYuResult } from './type'
import type { SearchFunction, DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { Profile } from '@/config/trans-profile'
import { fetch } from '@tauri-apps/plugin-http'
import chsToChz from '../../utils/chs-to-chz'
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
  const data = await fetch(`https://www.moedict.tw/${moedictID}/${encodeURIComponent(
    chsToChz(text.replace(/\s+/g, ''))
  )}.json`).then(res => res.json())
    .catch(handleNetWorkError)
  console.log('⚡️ line:28 ~ data: ', data)

  if (!data || !data.h) {
    return handleNoResult()
  }

  if (!options.trans) {
    data.translation = undefined
  }

  const result: DictSearchResult<R> = { result: data }

  for (const h of data.h) {
    if (h['=']) {
      h['='] = `https://203146b5091e8f0aafda-15d41c68795720c6e932125f5ace0c70.ssl.cf1.rackcdn.com/${h['=']}.ogg`
    }
    if (!result.audio) {
      result.audio = {
        py: h['='],
      }
    }
  }

  return result
}


import type { GuoYuResult } from './type'
import type { AtomSearchResult } from '@/types/res-type'
import type { DictSearchResult } from '@/core/api-server/api-common/search-type'
import type { Profile } from '@/config/trans-profile'
import { handleNetWorkError, handleNoResult } from '@/core/api-server/utils'
import chsToChz from '@/core/api-server/utils/chs-to-chz'

export function handleResponse (data: GuoYuResult): AtomSearchResult<GuoYuResult> {
  for (const h of data.h!) {
    if (h['=']) {
      h['='] = `https://203146b5091e8f0aafda-15d41c68795720c6e932125f5ace0c70.ssl.cf1.rackcdn.com/${h['=']}.ogg`
    }
  }

  const result: AtomSearchResult<GuoYuResult> = { result: data }

  if (data.h && data.h.length > 0) {
    result.audio = {
      py: data.h[0]['='] || '',
    }
  }

  return result
}

/** @deprecated Use api-atom.ts handleResponse instead. Kept for liangan compatibility. */
export async function moedictSearch<R extends GuoYuResult> (
  moedictID: string,
  text: string,
  options: Profile['dicts']['all']['guoyu']['options']
): Promise<DictSearchResult<R>> {
  const data = await fetch(`https://www.moedict.tw/${moedictID}/${encodeURIComponent(
    chsToChz(text.replace(/\s+/g, ''))
  )}.json`).then(res => res.json())
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


import type { GuoYuResult } from './type'
import type { AtomSearchResult } from '../../types/res-type'

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

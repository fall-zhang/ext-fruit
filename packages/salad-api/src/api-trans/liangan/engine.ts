import type { GuoYuResult, LiangAnResult } from './type'
// import { handleResponse as handleGuoYuResponse } from '../guoyu/engine'

/**
 * Handle liangan search result - reuses guoyu's logic with additional processing for mainland annotations.
 */
export function handleResponse (data: LiangAnResult): LiangAnResult {
  // Replace '<br>陸⃝' with ' [大陆]: ' for mainland China annotations
  if (data.h) {
    data.h.forEach((item: any) => {
      if (item.p) {
        // eslint-disable-next-line no-param-reassign
        item.p = item.p.replace('<br>陸⃝', ' [大陆]: ')
      }
    })
  }

  return handleGuoYuResponse(data)
}

export function handleGuoYuResponse (data: GuoYuResult): GuoYuResult {
  for (const h of data.h!) {
    if (h['=']) {
      h['='] = `https://203146b5091e8f0aafda-15d41c68795720c6e932125f5ace0c70.ssl.cf1.rackcdn.com/${h['=']}.ogg`
    }
  }

  const result: GuoYuResult = data

  // if (data.h && data.h.length > 0) {
  //   result.audio = {
  //     py: data.h[0]['='] || '',
  //   }
  // }

  return result
}
/**
 * @deprecated Use api-atom.ts instead. Kept for backward compatibility.
 */
export type { GuoYuResult } from '../guoyu/type'
export type { LiangAnResult } from './type'

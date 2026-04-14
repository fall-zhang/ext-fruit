import type { LiangAnResult } from './type'
import type { AtomSearchResult } from '@/types/res-type'
import { handleResponse as handleGuoYuResponse } from '../guoyu/engine'

/**
 * Handle liangan search result - reuses guoyu's logic with additional processing for mainland annotations.
 * @deprecated Use api-atom.ts handleResponse instead. Kept for backward compatibility.
 */
export function handleResponse(data: LiangAnResult): AtomSearchResult<LiangAnResult> {
  // Replace '<br>陸⃝' with ' [大陆]: ' for mainland China annotations
  if (data.h) {
    data.h.forEach(item => {
      if (item.p) {
        item.p = item.p.replace('<br>陸⃝', ' [大陆]: ')
      }
    })
  }

  return handleGuoYuResponse(data)
}

/**
 * @deprecated Use api-atom.ts instead. Kept for backward compatibility.
 */
export { moedictSearch } from '../guoyu/engine'
export type { GuoYuResult } from '../guoyu/type'
export type { LiangAnResult } from './type'

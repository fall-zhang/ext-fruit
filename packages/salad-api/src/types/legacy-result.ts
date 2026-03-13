import type { DictID } from '@/core/api-server/config'
import type { AtomSearchResult } from './res-type'
import type { Language } from '@P/open-trans/languages'

export interface MachineTranslateResult {
  id: DictID
  /** Source language */
  sl: Language
  /** Target language */
  tl: Language
  searchText: {
    paragraphs: string[]
    tts?: string
  }
  trans: {
    paragraphs: string[]
    tts?: string
  }
  requireCredential?: boolean
}


/** Generate catalog 生成目录 */
export function machineResult (
  data: AtomSearchResult<MachineTranslateResult>
): AtomSearchResult<MachineTranslateResult> {
  return {
    ...data,
  }
}

import type { Language } from '@P/open-trans/languages'

export type CaiyunResult = {
  id: 'caiyun'
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

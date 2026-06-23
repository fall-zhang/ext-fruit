import type { SupportLanguage } from '../../main'

export type CaiyunResult = {
  id: 'caiyun'
  /** Source language */
  sl: SupportLanguage
  /** Target language */
  tl: SupportLanguage
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

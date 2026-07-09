import type { MachineDictID } from '../api-config'
import type { SupportLanguage } from '../../const/languages'

export type GoogleResult = {
  id: MachineDictID
  slInitial: 'hide' | 'collapse' | 'full'
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


export type GoogleSupportLang = 'de' | 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'nl' | 'ru' | 'zh-CN' | 'zh-TW' | 'default'

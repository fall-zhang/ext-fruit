import type { DictID } from '..'
import type { Language } from '../../const/languages'

export type GoogleResult = {
  id: DictID
  slInitial: 'hide' | 'collapse' | 'full'
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


export type SupportLang = 'de' | 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'nl' | 'ru' | 'zh-CN' | 'zh-TW' | 'default'

import memoizeOne from 'memoize-one'

import { Google } from '@P/open-trans/service-google'
import type { SupportLanguage } from '../../main'

export const getTranslator = memoizeOne(() => new Google())

export async function getTTS (text: string, lang: SupportLanguage): Promise<string> {
  return (await getTranslator().textToSpeech(text, lang)) || ''
}

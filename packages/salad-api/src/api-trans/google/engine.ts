import memoizeOne from 'memoize-one'

import { Google } from '@P/open-trans/service-google'
import type { Language } from '@P/open-trans/languages'

export const getTranslator = memoizeOne(() => new Google())

export async function getTTS (text: string, lang: Language): Promise<string> {
  return (await getTranslator().textToSpeech(text, lang)) || ''
}

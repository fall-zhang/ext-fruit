import { sougoLangMap } from '../../api-trans-machine/sogou/engine'
import type { Language } from '../../const/languages'

export async function textToSpeech (text: string, lang: Language): Promise<string | null> {
  return lang === 'zh-TW'
    ? `https://fanyi.sogou.com/reventondc/microsoftGetSpeakFile?${new URLSearchParams({
      text,
      spokenDialect: 'zh-CHT',
      from: 'translateweb',
    }).toString()}`
    : `https://fanyi.sogou.com/reventondc/synthesis?${new URLSearchParams({
      text,
      speed: '1',
      lang: sougoLangMap.get(lang) || 'en',
      from: 'translateweb',
    }).toString()}`
}

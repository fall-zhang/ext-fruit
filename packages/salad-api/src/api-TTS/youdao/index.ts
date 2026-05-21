import type { Language } from '../../const/languages'

export async function textToSpeech (text: string, lang: Language): Promise<string | null> {
  const standard2custom: { [prop: string]: string | null } = {
    en: 'eng',
    ja: 'jap',
    ko: 'ko',
    fr: 'fr',
  }
  const voiceLang = standard2custom[lang]
  if (!voiceLang) return null
  const qs = new URLSearchParams({
    audio: text,
    type: '0',
    le: voiceLang,
    keyfrom: 'speaker-target',
  })
  // you better use official api or offical tts url returned by translator result
  return ('https://dict.youdao.com/dictvoice?' + qs)
}

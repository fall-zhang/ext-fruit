import { isContainChinese, isContainDeutsch, isContainEnglish, isContainFrench, isContainJapanese, isContainKorean, isContainSpanish } from './lang-check'
import type { Language } from '../../const/languages'

export const baseLangDetect = (text: string): Language => {
  if (isContainFrench(text)) {
    return 'fr'
  }

  if (isContainDeutsch(text)) {
    return 'de'
  }

  if (isContainSpanish(text)) {
    return 'es'
  }

  if (isContainEnglish(text)) {
    return 'en'
  }

  if (isContainJapanese(text)) {
    return 'ja'
  }

  if (isContainKorean(text)) {
    return 'ko'
  }

  if (isContainChinese(text)) {
    return 'zh'
  }

  return 'auto'
}


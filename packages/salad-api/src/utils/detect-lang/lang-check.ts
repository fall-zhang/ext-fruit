import { matchers } from './reg-util'

export const isContainChinese = (text: string): boolean =>
  matchers.chinese.test(text)

export const isContainEnglish = (text: string): boolean =>
  matchers.english.test(text)

/** Hiragana & Katakana, no Chinese */
export const isContainJapanese = (text: string): boolean =>
  matchers.japanese.test(text)

/** Korean Hangul, no Chinese */
export const isContainKorean = (text: string): boolean =>
  matchers.korean.test(text)

/** French, no English àâäèéêëîïôœùûüÿç */
export const isContainFrench = (text: string): boolean =>
  matchers.french.test(text)

/** Deutsch, no English äöüÄÖÜß */
export const isContainDeutsch = (text: string): boolean =>
  matchers.deutsch.test(text)

/** Spanish, no English áéíóúñü¡¿ */
export const isContainSpanish = (text: string): boolean =>
  matchers.spanish.test(text)

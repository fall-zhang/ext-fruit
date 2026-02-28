import memoizeOne from 'memoize-one'
import type { ArrayValues } from 'type-fest'
import { matchers, matcherSign } from './reg-utils'
const languages = [
  'chinese',
  'english',
  'japanese',
  'korean',
  'french',
  'spanish',
  'deutsch',
] as const
type Languages = ArrayValues<typeof languages>


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

const isContain: { [key in Languages]: (text: string) => boolean } = {
  chinese: memoizeOne(isContainChinese),
  english: memoizeOne(isContainEnglish),
  /** Hiragana & Katakana, no Chinese */
  japanese: memoizeOne(isContainJapanese),
  /** Korean Hangul, no Chinese */
  korean: memoizeOne(isContainKorean),
  /** French, no English àâäèéêëîïôœùûüÿç */
  french: memoizeOne(isContainFrench),
  /** Spanish, no English áéíóúñü¡¿ */
  spanish: memoizeOne(isContainSpanish),
  /** Deutsch, no English äöüÄÖÜß */
  deutsch: memoizeOne(isContainDeutsch),
}


const matchAllMeaningless = new RegExp(`^(\\d|\\s|${matcherSign.source})+$`)

export type SupportedLangs = {
  [key in Languages | 'others' | 'matchAll']: boolean
}
export const supportedLangs: ReadonlyArray<keyof SupportedLangs> = [
  ...languages,
  'others',
  'matchAll',
]

export function checkSupportedLangs (
  langs: SupportedLangs,
  text: string
): boolean {
  if (!text) {
    return false
  }

  if (langs.matchAll) {
    if (matchAllMeaningless.test(text)) {
      return false
    }

    if (langs.others) {
      const checkedMatchers: RegExp[] = [/-|\.|\d|\s/]
      const uncheckedMatchers: RegExp[] = []

      for (let i = languages.length - 1; i >= 0; i--) {
        const l = languages[i]
        if (langs[l]) {
          checkedMatchers.push(matchers[l])
        } else {
          uncheckedMatchers.push(matchers[l])
        }
      }

      for (let i = 0; i < text.length; i++) {
        // characters of latin languages may overlap
        if (
          checkedMatchers.every(m => !m.test(text[i])) &&
          uncheckedMatchers.some(m => m.test(text[i]))
        ) {
          return false
        }
      }
      return true
    }
    const checkedMatchers = languages
      .filter(l => langs[l])
      .map(l => matchers[l])

    checkedMatchers.push(/-|\.|\d|\s/)

    for (let i = text.length - 1; i >= 0; i--) {
      if (checkedMatchers.every(m => !m.test(text[i]))) {
        return false
      }
    }
    return true
  } /* !langs.matchAll */
  if (languages.some(l => langs[l] && isContain[l](text))) {
    return true
  }

  if (!langs.others || matchAllMeaningless.test(text)) {
    return false
  }

  const uncheckedMatchers = languages
    .filter(l => !langs[l])
    .map(l => matchers[l])

  uncheckedMatchers.push(new RegExp(`${matcherSign.source}|\\d|\\s`))

  for (let i = text.length - 1; i >= 0; i--) {
    if (uncheckedMatchers.every(m => !m.test(text[i]))) {
      return true
    }
  }
  return false
}
